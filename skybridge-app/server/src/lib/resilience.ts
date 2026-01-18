/**
 * Resilience Patterns
 *
 * Circuit breaker, retry with exponential backoff,
 * and timeout handling for external API calls
 */

import { logger } from "./logger.js";

// Circuit breaker state tracking
const circuitStates = new Map<string, { failures: number; lastFailure: number; state: string }>();

// Configuration
const CIRCUIT_CONFIG = {
  halfOpenAfterMs: 30000, // Try again after 30 seconds
  failureThreshold: 5, // Number of failures before opening
};

const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelayMs: 200,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
};

const TIMEOUT_CONFIG = {
  defaultMs: 10000, // 10 second default timeout
  exaMs: 15000, // 15 seconds for Exa (neural search is slow)
  lightpandaMs: 20000, // 20 seconds for web scraping
  fullenrichMs: 10000, // 10 seconds for email verification
};

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateBackoffDelay(attempt: number): number {
  const baseDelay = Math.min(
    RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
    RETRY_CONFIG.maxDelayMs
  );
  // Add jitter (10%)
  const jitter = baseDelay * 0.1 * (Math.random() * 2 - 1);
  return Math.round(baseDelay + jitter);
}

/**
 * Wrap a promise with a timeout
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, serviceName: string): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`${serviceName} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
}

/**
 * Check if circuit is open for a service
 */
function isCircuitOpen(serviceName: string): boolean {
  const state = circuitStates.get(serviceName);
  if (!state || state.state === "closed") return false;

  if (state.state === "open") {
    // Check if we should try half-open
    if (Date.now() - state.lastFailure > CIRCUIT_CONFIG.halfOpenAfterMs) {
      circuitStates.set(serviceName, { ...state, state: "half-open" });
      logger.info(`Circuit breaker HALF-OPEN for ${serviceName}`);
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Record a failure for circuit breaker
 */
function recordFailure(serviceName: string): void {
  const current = circuitStates.get(serviceName) || { failures: 0, lastFailure: 0, state: "closed" };
  const newFailures = current.failures + 1;

  if (newFailures >= CIRCUIT_CONFIG.failureThreshold) {
    circuitStates.set(serviceName, {
      failures: newFailures,
      lastFailure: Date.now(),
      state: "open",
    });
    logger.warn(`Circuit breaker OPENED for ${serviceName}`, { failures: newFailures });
  } else {
    circuitStates.set(serviceName, {
      ...current,
      failures: newFailures,
      lastFailure: Date.now(),
    });
  }
}

/**
 * Record a success for circuit breaker
 */
function recordSuccess(serviceName: string): void {
  const current = circuitStates.get(serviceName);
  if (current && current.state !== "closed") {
    circuitStates.set(serviceName, { failures: 0, lastFailure: 0, state: "closed" });
    logger.info(`Circuit breaker CLOSED for ${serviceName}`);
  }
}

/**
 * Resilient service wrapper factory
 */
export interface ResilientService {
  execute: <R>(fn: () => Promise<R>) => Promise<R>;
  getState: () => { state: string; failures: number };
}

/**
 * Create a resilient wrapper for an external service
 */
export function createResilientService(
  serviceName: string,
  timeoutMs: number = TIMEOUT_CONFIG.defaultMs
): ResilientService {
  return {
    execute: async <R>(fn: () => Promise<R>): Promise<R> => {
      // Check circuit breaker
      if (isCircuitOpen(serviceName)) {
        throw new Error(`Circuit breaker is open for ${serviceName}`);
      }

      const startTime = Date.now();
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
        try {
          const result = await withTimeout(fn(), timeoutMs, serviceName);
          recordSuccess(serviceName);
          logger.debug(`${serviceName} call succeeded`, {
            service: serviceName,
            duration: Date.now() - startTime,
            attempt: attempt + 1,
          });
          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          logger.warn(`${serviceName} attempt ${attempt + 1} failed`, {
            service: serviceName,
            attempt: attempt + 1,
            error: lastError.message,
          });

          if (attempt < RETRY_CONFIG.maxAttempts - 1) {
            const delay = calculateBackoffDelay(attempt);
            await sleep(delay);
          }
        }
      }

      // All retries exhausted
      recordFailure(serviceName);
      logger.error(`${serviceName} call failed after ${RETRY_CONFIG.maxAttempts} attempts`, {
        service: serviceName,
        duration: Date.now() - startTime,
        error: lastError?.message,
      });
      throw lastError;
    },
    getState: () => {
      const state = circuitStates.get(serviceName) || {
        state: "closed",
        failures: 0,
      };
      return { state: state.state, failures: state.failures };
    },
  };
}

// Pre-configured resilient services for each external API
export const exaService = createResilientService("exa", TIMEOUT_CONFIG.exaMs);
export const lightpandaService = createResilientService(
  "lightpanda",
  TIMEOUT_CONFIG.lightpandaMs
);
export const fullenrichService = createResilientService(
  "fullenrich",
  TIMEOUT_CONFIG.fullenrichMs
);

/**
 * Get all circuit breaker states for monitoring
 */
export function getCircuitBreakerStates(): Record<string, { state: string; failures: number }> {
  const states: Record<string, { state: string; failures: number }> = {};
  for (const [name, state] of circuitStates) {
    states[name] = { state: state.state, failures: state.failures };
  }
  return states;
}

/**
 * Helper to wrap an async function with resilience
 */
export async function withResilience<T>(
  serviceName: string,
  fn: () => Promise<T>,
  timeoutMs?: number
): Promise<T> {
  const service = createResilientService(serviceName, timeoutMs);
  return service.execute(fn);
}

export { TIMEOUT_CONFIG };

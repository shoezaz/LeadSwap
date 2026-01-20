/**
 * Structured Logging
 *
 * Winston-based logging with JSON output for production
 * and pretty-printed output for development
 */

import winston from "winston";

const { combine, timestamp, json, printf, colorize, errors } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, requestId, ...metadata }) => {
  const meta = Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : "";
  const reqId = requestId ? `[${requestId}]` : "";
  return `${timestamp} ${level} ${reqId} ${message} ${meta}`;
});

// Determine log level from environment
const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");

// Create logger instance
export const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" })
  ),
  defaultMeta: {
    service: "leadswap",
    version: process.env.npm_package_version || "1.0.0",
  },
  transports: [
    // Console transport with environment-specific formatting
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? combine(timestamp(), json())
          : combine(colorize(), devFormat),
    }),
  ],
});

// File transport disabled in serverless environments (Lambda doesn't have persistent /logs)
// Files would be lost on container restart anyway
// For production logging, use CloudWatch via console transport above

/**
 * Create a child logger with request context
 */
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}

/**
 * Log API call with timing
 */
export function logApiCall(
  service: string,
  operation: string,
  duration: number,
  success: boolean,
  metadata?: Record<string, unknown>
) {
  const level = success ? "info" : "warn";
  logger.log(level, `API call: ${service}.${operation}`, {
    service,
    operation,
    duration,
    success,
    ...metadata,
  });
}

/**
 * Performance logging helper
 */
export function createTimer(operation: string) {
  const start = Date.now();
  return {
    end: (metadata?: Record<string, unknown>) => {
      const duration = Date.now() - start;
      logger.debug(`${operation} completed`, { duration, ...metadata });
      return duration;
    },
  };
}

export default logger;

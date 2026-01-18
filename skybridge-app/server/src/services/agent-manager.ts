/**
 * Agent Manager Service
 *
 * Multi-agent orchestration system for LeadSwap
 * Manages agent lifecycle, task queue, and parallel execution
 * Now with exponential backoff and improved resilience
 */

import type {
  Agent,
  AgentType,
  Task,
  TaskPriority,
  TaskPayload,
  TaskResult,
  AgentPool,
  TaskOrchestrationPlan,
} from "../types.js";

import { searchLeadsWithICP, scoreLeads, enrichLeadWithLightpanda } from "./lead-scorer.js";
import { exportLeads } from "./export-service.js";
import { logger } from "../lib/logger.js";

// Exponential backoff configuration
const BACKOFF_CONFIG = {
  initialDelayMs: 200,
  maxDelayMs: 10000,
  multiplier: 2,
  jitterFactor: 0.1, // 10% jitter
};

/**
 * Calculate backoff delay with jitter
 */
function calculateBackoffDelay(retryCount: number): number {
  const baseDelay = Math.min(
    BACKOFF_CONFIG.initialDelayMs * Math.pow(BACKOFF_CONFIG.multiplier, retryCount),
    BACKOFF_CONFIG.maxDelayMs
  );

  // Add jitter to prevent thundering herd
  const jitter = baseDelay * BACKOFF_CONFIG.jitterFactor * (Math.random() * 2 - 1);
  return Math.round(baseDelay + jitter);
}

// ====================================
// Agent Pool State
// ====================================

class AgentManager {
  private pool: AgentPool = {
    agents: [],
    taskQueue: [],
    completedTasks: [],
    failedTasks: [],
  };

  private taskExecutionMap = new Map<string, Promise<void>>();

  constructor() {
    this.initializeAgentPool();
  }

  /**
   * Initialize default agent pool
   */
  private initializeAgentPool(): void {
    const agentTypes: AgentType[] = ["search", "enrichment", "scoring", "validation", "export"];

    agentTypes.forEach((type) => {
      // Create 2 agents per type for parallel execution
      for (let i = 1; i <= 2; i++) {
        this.pool.agents.push({
          id: `${type}-agent-${i}`,
          type,
          name: `${this.capitalize(type)} Agent ${i}`,
          status: "idle",
          completedTasks: 0,
          failedTasks: 0,
          createdAt: new Date(),
        });
      }
    });
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Get current pool status
   */
  getPoolStatus(): AgentPool {
    return {
      agents: [...this.pool.agents],
      taskQueue: [...this.pool.taskQueue],
      completedTasks: [...this.pool.completedTasks],
      failedTasks: [...this.pool.failedTasks],
    };
  }

  /**
   * Add a task to the queue
   */
  async addTask(
    type: AgentType,
    payload: TaskPayload,
    priority: TaskPriority = "medium",
    dependencies?: string[]
  ): Promise<Task> {
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      priority,
      status: "queued",
      payload,
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3,
      dependencies,
    };

    this.pool.taskQueue.push(task);
    this.sortTaskQueue();

    // Start processing tasks
    this.processQueue();

    return task;
  }

  /**
   * Sort task queue by priority
   */
  private sortTaskQueue(): void {
    const priorityOrder: Record<TaskPriority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    this.pool.taskQueue.sort((a, b) => {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Process the task queue
   */
  private async processQueue(): Promise<void> {
    // Get available agents and queued tasks
    const availableAgents = this.pool.agents.filter((a) => a.status === "idle");
    const queuedTasks = this.pool.taskQueue.filter((t) => t.status === "queued");

    if (availableAgents.length === 0 || queuedTasks.length === 0) {
      return;
    }

    // Assign tasks to agents
    for (const task of queuedTasks) {
      // Check if task dependencies are complete
      if (task.dependencies && !this.areDependenciesComplete(task.dependencies)) {
        continue;
      }

      // Find an available agent of the correct type
      const agent = availableAgents.find((a) => a.type === task.type && a.status === "idle");

      if (agent) {
        this.assignTaskToAgent(task, agent);
      }
    }
  }

  /**
   * Check if task dependencies are complete
   */
  private areDependenciesComplete(dependencies: string[]): boolean {
    return dependencies.every((depId) =>
      this.pool.completedTasks.some((t) => t.id === depId)
    );
  }

  /**
   * Assign a task to an agent
   */
  private assignTaskToAgent(task: Task, agent: Agent): void {
    task.status = "running";
    task.assignedAgentId = agent.id;
    task.startedAt = new Date();

    agent.status = "running";
    agent.currentTask = task;
    agent.lastActiveAt = new Date();

    // Execute task in background
    const execution = this.executeTask(task, agent)
      .then(() => {
        this.onTaskComplete(task, agent);
      })
      .catch((error) => {
        this.onTaskFailed(task, agent, error);
      })
      .finally(() => {
        this.taskExecutionMap.delete(task.id);
        this.processQueue(); // Continue processing queue
      });

    this.taskExecutionMap.set(task.id, execution);
  }

  /**
   * Execute a task
   */
  private async executeTask(task: Task, _agent: Agent): Promise<void> {
    try {
      const result = await this.runTaskLogic(task);
      task.result = result;
      task.status = "completed";
      task.completedAt = new Date();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Task execution logic based on type
   */
  private async runTaskLogic(task: Task): Promise<TaskResult> {
    switch (task.payload.type) {
      case "search": {
        const { icp, numResults } = task.payload;
        const leads = await searchLeadsWithICP(icp, numResults);
        return { type: "search", leads };
      }

      case "scoring": {
        const { leads, icp } = task.payload;
        const scoringResult = await scoreLeads(leads, icp, { enrichWithExa: false });
        return { type: "scoring", scoringResult };
      }

      case "enrichment": {
        const { leads } = task.payload;

        // Enrich leads with Lightpanda
        const enrichedLeads = await Promise.all(
          leads.map(async (lead) => {
            const enrichment = await enrichLeadWithLightpanda(lead);
            if (enrichment) {
              return {
                ...lead,
                enrichmentData: {
                  ...lead.enrichmentData,
                  ...enrichment,
                  techStack: enrichment.techStack,
                  socialLinks: enrichment.socialLinks
                }
              };
            }
            return lead;
          })
        );

        return { type: "enrichment", enrichedLeads };
      }

      case "validation": {
        const { leads } = task.payload;
        // TODO: Implement validation logic (email verification, etc.)
        return { type: "validation", validatedLeads: leads };
      }

      case "export": {
        const { scoredLeads, format } = task.payload;
        const exportResult = exportLeads(scoredLeads, {
          format,
          includeTier: "all",
          includeMetadata: true,
          includeMatchDetails: true,
          includeEnrichmentData: true,
        });

        // In a real implementation, this would save to a file system or S3
        // For now, we return the content as a data URL
        const dataUrl = `data:${format === "csv" ? "text/csv" : "application/json"};base64,${Buffer.from(exportResult.content).toString("base64")}`;

        return { type: "export", downloadUrl: dataUrl, filename: exportResult.filename, leadsCount: exportResult.leadsCount };
      }

      default:
        throw new Error(`Unknown task type: ${(task.payload as any).type}`);
    }
  }

  /**
   * Handle task completion
   */
  private onTaskComplete(task: Task, agent: Agent): void {
    agent.status = "idle";
    agent.completedTasks++;
    agent.currentTask = undefined;

    // Remove from queue
    this.pool.taskQueue = this.pool.taskQueue.filter((t) => t.id !== task.id);

    // Add to completed tasks
    this.pool.completedTasks.push(task);
  }

  /**
   * Handle task failure with exponential backoff
   */
  private onTaskFailed(task: Task, agent: Agent, error: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    task.error = errorMessage;
    task.retryCount++;

    agent.status = "idle";
    agent.currentTask = undefined;

    logger.warn("Task failed", {
      taskId: task.id,
      taskType: task.type,
      agentId: agent.id,
      error: errorMessage,
      retryCount: task.retryCount,
      maxRetries: task.maxRetries,
    });

    // Retry with exponential backoff if under max retries
    if (task.retryCount < task.maxRetries) {
      const backoffDelay = calculateBackoffDelay(task.retryCount);

      logger.info("Scheduling task retry with backoff", {
        taskId: task.id,
        retryCount: task.retryCount,
        backoffDelay,
      });

      task.status = "queued";

      // Schedule retry with backoff delay
      setTimeout(() => {
        this.processQueue();
      }, backoffDelay);
    } else {
      task.status = "failed";
      agent.failedTasks++;

      logger.error("Task failed permanently after max retries", {
        taskId: task.id,
        taskType: task.type,
        error: errorMessage,
        retryCount: task.retryCount,
      });

      // Remove from queue
      this.pool.taskQueue = this.pool.taskQueue.filter((t) => t.id !== task.id);

      // Add to failed tasks
      this.pool.failedTasks.push(task);
    }
  }

  /**
   * Create an orchestration plan for multiple tasks
   */
  createOrchestrationPlan(
    tasks: Array<{ type: AgentType; payload: TaskPayload; priority?: TaskPriority }>
  ): TaskOrchestrationPlan {
    const parallelizable = tasks.every((t) => t.type !== "scoring"); // Scoring needs all leads ready

    return {
      tasks: tasks.map((t, i) => ({
        id: `plan-task-${i}`,
        type: t.type,
        priority: t.priority || "medium",
        status: "queued",
        payload: t.payload,
        createdAt: new Date(),
        retryCount: 0,
        maxRetries: 3,
      })),
      estimatedTimeMs: tasks.length * 2000, // Rough estimate
      parallelizable,
      workflow: parallelizable ? "parallel" : "sequential",
    };
  }

  /**
   * Execute an orchestration plan
   */
  async executeOrchestrationPlan(plan: TaskOrchestrationPlan): Promise<Task[]> {
    const taskPromises: Promise<Task>[] = [];

    for (const taskConfig of plan.tasks) {
      const task = await this.addTask(
        taskConfig.type,
        taskConfig.payload,
        taskConfig.priority
      );
      taskPromises.push(this.waitForTask(task.id));
    }

    if (plan.workflow === "parallel") {
      return await Promise.all(taskPromises);
    } else {
      // Sequential execution
      const results: Task[] = [];
      for (const promise of taskPromises) {
        results.push(await promise);
      }
      return results;
    }
  }

  /**
   * Wait for a task to complete
   */
  private async waitForTask(taskId: string): Promise<Task> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const task = this.pool.completedTasks.find((t) => t.id === taskId);
        if (task) {
          clearInterval(interval);
          resolve(task);
        }

        const failedTask = this.pool.failedTasks.find((t) => t.id === taskId);
        if (failedTask) {
          clearInterval(interval);
          reject(new Error(failedTask.error || "Task failed"));
        }
      }, 100);
    });
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): Task | undefined {
    return (
      this.pool.taskQueue.find((t) => t.id === taskId) ||
      this.pool.completedTasks.find((t) => t.id === taskId) ||
      this.pool.failedTasks.find((t) => t.id === taskId)
    );
  }

  /**
   * Cancel a queued task
   */
  cancelTask(taskId: string): boolean {
    const taskIndex = this.pool.taskQueue.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1 && this.pool.taskQueue[taskIndex].status === "queued") {
      this.pool.taskQueue.splice(taskIndex, 1);
      return true;
    }
    return false;
  }

  /**
   * Get agent statistics
   */
  getAgentStatistics() {
    return {
      totalAgents: this.pool.agents.length,
      idleAgents: this.pool.agents.filter((a) => a.status === "idle").length,
      runningAgents: this.pool.agents.filter((a) => a.status === "running").length,
      totalTasksCompleted: this.pool.completedTasks.length,
      totalTasksFailed: this.pool.failedTasks.length,
      queuedTasks: this.pool.taskQueue.filter((t) => t.status === "queued").length,
      runningTasks: this.pool.taskQueue.filter((t) => t.status === "running").length,
      agentsByType: this.groupAgentsByType(),
    };
  }

  private groupAgentsByType() {
    const grouped: Record<AgentType, { total: number; idle: number; running: number }> = {
      search: { total: 0, idle: 0, running: 0 },
      enrichment: { total: 0, idle: 0, running: 0 },
      scoring: { total: 0, idle: 0, running: 0 },
      validation: { total: 0, idle: 0, running: 0 },
      export: { total: 0, idle: 0, running: 0 },
    };

    this.pool.agents.forEach((agent) => {
      grouped[agent.type].total++;
      if (agent.status === "idle") grouped[agent.type].idle++;
      if (agent.status === "running") grouped[agent.type].running++;
    });

    return grouped;
  }
}

// Singleton instance
const agentManager = new AgentManager();
export default agentManager;

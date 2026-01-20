import "@/index.css";
import { mountWidget } from "skybridge/web";
import { LoadingIndicator } from "@openai/apps-sdk-ui/components/Indicator";

interface Agent {
  id: string;
  type: string;
  name: string;
  status: string;
  completedTasks: number;
  failedTasks: number;
}

interface Task {
  id: string;
  type: string;
  priority: string;
  status: string;
  assignedAgentId?: string;
}

interface AgentStats {
  totalAgents: number;
  idleAgents: number;
  runningAgents: number;
  totalTasksCompleted: number;
  totalTasksFailed: number;
  queuedTasks: number;
  runningTasks: number;
  agentsByType: Record<string, { total: number; idle: number; running: number }>;
}

interface AgentManagerOutput {
  agents?: Agent[];
  taskQueue?: Task[];
  stats?: AgentStats;
}

function AgentManager() {
  // Since agent-manager is not registered yet, we'll use a direct prop approach
  const output = (window as any).__agentManagerOutput as AgentManagerOutput | undefined;

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <LoadingIndicator />
        <p className="text-sm">Loading Agent Manager...</p>
      </div>
    );
  }

  const agents = output?.agents || [];
  const taskQueue = output?.taskQueue || [];
  const stats = output?.stats || null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idle":
        return "#10b981";
      case "running":
        return "#f59e0b";
      case "completed":
        return "#3b82f6";
      case "failed":
        return "#ef4444";
      case "queued":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#dc2626";
      case "high":
        return "#f59e0b";
      case "medium":
        return "#3b82f6";
      case "low":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="p-5 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-primary">🤖 Agent Manager</h2>
        <p className="text-secondary text-sm">Multi-agent orchestration system for LeadSwap</p>
      </div>

      {/* Statistics Overview */}
      {stats && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary">📊 System Statistics</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <StatCard title="Total Agents" value={stats.totalAgents} color="#3b82f6" />
            <StatCard title="Idle Agents" value={stats.idleAgents} color="#10b981" />
            <StatCard title="Running Agents" value={stats.runningAgents} color="#f59e0b" />
            <StatCard title="Tasks Completed" value={stats.totalTasksCompleted} color="#8b5cf6" />
            <StatCard title="Tasks Failed" value={stats.totalTasksFailed} color="#ef4444" />
            <StatCard title="Queued Tasks" value={stats.queuedTasks} color="#6b7280" />
            <StatCard title="Running Tasks" value={stats.runningTasks} color="#f59e0b" />
          </div>
        </div>
      )}

      {/* Agent Pool */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary">🔧 Agent Pool ({agents.length} agents)</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-primary">{agent.name}</div>
                  <div className="text-xs text-secondary">{agent.id}</div>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${getStatusColor(agent.status)}20`,
                    color: getStatusColor(agent.status),
                  }}
                >
                  {agent.status.toUpperCase()}
                </div>
              </div>

              <div className="text-xs text-secondary mb-2">
                Type: <span className="font-medium text-primary">{agent.type}</span>
              </div>

              <div className="flex gap-4 text-xs">
                <div>
                  <span className="text-secondary">✅ Completed:</span>{" "}
                  <span className="font-semibold" style={{ color: "#10b981" }}>
                    {agent.completedTasks}
                  </span>
                </div>
                <div>
                  <span className="text-secondary">❌ Failed:</span>{" "}
                  <span className="font-semibold" style={{ color: "#ef4444" }}>
                    {agent.failedTasks}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Queue */}
      {taskQueue.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">📋 Task Queue ({taskQueue.length} tasks)</h3>
          <div className="border border-border rounded-lg overflow-hidden bg-surface">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-semibold text-primary">Task ID</th>
                  <th className="p-3 text-left font-semibold text-primary">Type</th>
                  <th className="p-3 text-left font-semibold text-primary">Priority</th>
                  <th className="p-3 text-left font-semibold text-primary">Status</th>
                  <th className="p-3 text-left font-semibold text-primary">Agent</th>
                </tr>
              </thead>
              <tbody>
                {taskQueue.map((task, index) => (
                  <tr key={task.id} className={index > 0 ? "border-t border-border" : ""}>
                    <td className="p-3 text-secondary">{task.id}</td>
                    <td className="p-3 font-medium text-primary">{task.type}</td>
                    <td className="p-3">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${getPriorityColor(task.priority)}20`,
                          color: getPriorityColor(task.priority),
                        }}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${getStatusColor(task.status)}20`,
                          color: getStatusColor(task.status),
                        }}
                      >
                        {task.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-secondary text-xs">{task.assignedAgentId || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {agents.length === 0 && taskQueue.length === 0 && (
        <div className="text-center p-10 text-secondary">
          <div className="text-5xl mb-4">🤖</div>
          <div className="text-base font-medium mb-2">No agents or tasks</div>
          <div className="text-sm">The agent system is initializing...</div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-surface">
      <div className="text-xs text-secondary mb-1">{title}</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

export default AgentManager;
mountWidget(<AgentManager />);

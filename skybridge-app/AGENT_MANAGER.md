# Agent Manager - Multi-Agent Orchestration System

**Status**: ✅ Completed (2026-01-18)

## 🎯 Overview

The Agent Manager is a multi-agent orchestration system for LeadSwap's Skybridge ChatGPT App. It manages task distribution, parallel execution, and agent lifecycle across 5 different agent types.

## 🏗️ Architecture

### Agent Types (10 Total Agents)

The system initializes with **2 agents per type** for parallel execution:

1. **Search Agents** (2) - Find leads via Exa.ai semantic search
2. **Enrichment Agents** (2) - Enrich leads with company data
3. **Scoring Agents** (2) - Score leads against ICP criteria
4. **Validation Agents** (2) - Validate lead data (email verification, etc.)
5. **Export Agents** (2) - Generate CSV/JSON exports

### Task Queue System

- **Priority-based Queue**: Tasks are sorted by priority (urgent → high → medium → low)
- **Dependency Management**: Tasks can depend on completion of other tasks
- **Auto-retry**: Failed tasks are retried up to 3 times
- **Parallel Execution**: Independent tasks run concurrently when possible

### Task Workflow

```
Task Created → Queued → Assigned to Agent → Running → Completed/Failed
                ↑                                           ↓
                └─────────── Retry (if failed) ─────────────┘
```

## 📁 Files Created

### Server-side

1. **`server/src/types.ts`** (Extended)
   - Added Agent Manager types:
     - `Agent`, `AgentType`, `AgentStatus`
     - `Task`, `TaskPriority`, `TaskPayload`, `TaskResult`
     - `AgentPool`, `TaskOrchestrationPlan`

2. **`server/src/services/agent-manager.ts`** (NEW)
   - Singleton `AgentManager` class
   - Agent pool initialization
   - Task queue management
   - Orchestration planning
   - Statistics tracking

3. **`server/src/server.ts`** (Modified)
   - Added `agent-manager` widget endpoint
   - Imported `agentManager` singleton
   - Returns pool status, stats, and task queue

### Client-side

4. **`web/src/widgets/agent-manager.tsx`** (NEW)
   - React widget displaying:
     - System statistics (7 stat cards)
     - Agent pool (grid of 10 agents)
     - Task queue (table view)
   - Color-coded status indicators
   - Priority badges

## 🔧 Key Features

### 1. Agent Pool Management

```typescript
agentManager.getPoolStatus()
// Returns: { agents, taskQueue, completedTasks, failedTasks }
```

### 2. Task Creation

```typescript
await agentManager.addTask(
  "search",           // type
  { icp, numResults }, // payload
  "high",             // priority
  ["task-123"]        // dependencies (optional)
)
```

### 3. Orchestration Plans

```typescript
const plan = agentManager.createOrchestrationPlan([
  { type: "search", payload: {...}, priority: "high" },
  { type: "scoring", payload: {...}, priority: "medium" }
])

const results = await agentManager.executeOrchestrationPlan(plan)
```

### 4. Statistics

```typescript
agentManager.getAgentStatistics()
// Returns:
// - totalAgents, idleAgents, runningAgents
// - totalTasksCompleted, totalTasksFailed
// - queuedTasks, runningTasks
// - agentsByType (breakdown by type)
```

## 🎨 UI Components

### Agent Manager Widget

Displays 3 main sections:

1. **📊 System Statistics** (Grid)
   - Total Agents, Idle Agents, Running Agents
   - Tasks Completed, Tasks Failed
   - Queued Tasks, Running Tasks

2. **🔧 Agent Pool** (Cards)
   - Agent name and ID
   - Status badge (idle/running/completed/failed)
   - Type indicator
   - Completed/Failed task counters

3. **📋 Task Queue** (Table)
   - Task ID, Type, Priority, Status
   - Assigned Agent ID

## 🚀 Usage in ChatGPT

### Example Prompts:

1. **View Agent Status**
   ```
   "Show me the agent manager status"
   ```

2. **Create a Task**
   ```typescript
   // In code (not directly via ChatGPT yet - future feature)
   await agentManager.addTask("search", { icp, numResults: 20 }, "high")
   ```

3. **Check Statistics**
   ```
   "How are the agents performing?"
   ```

## 📊 Status Colors

### Agent/Task Status
- 🟢 **Idle** - Green (#10b981)
- 🟠 **Running** - Orange (#f59e0b)
- 🔵 **Completed** - Blue (#3b82f6)
- 🔴 **Failed** - Red (#ef4444)
- ⚪ **Queued** - Gray (#6b7280)

### Task Priority
- 🔴 **Urgent** - Red (#dc2626)
- 🟠 **High** - Orange (#f59e0b)
- 🔵 **Medium** - Blue (#3b82f6)
- ⚪ **Low** - Gray (#6b7280)

## 🔄 Integration with Existing Tools

The Agent Manager is designed to work with existing LeadSwap tools:

- **`search-leads`** → Uses Search Agents
- **`score-leads`** → Uses Scoring Agents (with optional Enrichment Agents)
- Future: **`export-leads`** → Will use Export Agents
- Future: **`validate-leads`** → Will use Validation Agents

## 🧪 Testing

### Build Status
✅ Server build: Passing  
✅ Web build: Passing  
✅ Full build: Passing  

### Test Commands
```bash
cd skybridge-app
npm run server:build  # Test server compilation
npm run build         # Full production build
npm run dev           # Start dev server
```

## 🎯 Future Enhancements

1. **Task Cancellation** - UI button to cancel queued tasks
2. **Real-time Updates** - WebSocket connection for live status
3. **Task History** - View completed/failed task logs
4. **Agent Scaling** - Dynamic agent pool sizing based on load
5. **Performance Metrics** - Average task duration, throughput
6. **Custom Workflows** - User-defined task chains via ChatGPT

## 📝 MCP Endpoint

**Widget Name**: `agent-manager`

**Input Schema**: None (no parameters required)

**Output**:
```typescript
{
  agents: Agent[],
  taskQueue: Task[],
  stats: AgentStats
}
```

## ✅ Completion Checklist

- [x] Create Agent Manager types
- [x] Implement AgentManager class with task queue
- [x] Build orchestration system
- [x] Create React widget UI
- [x] Integrate with MCP server
- [x] Test builds (server + web)
- [x] Documentation

---

**Built by**: OpenCode AI  
**Date**: 2026-01-18  
**Part of**: LeadSwap Skybridge ChatGPT App

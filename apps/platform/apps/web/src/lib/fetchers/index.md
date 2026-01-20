---
name: Fetchers
scope: Data fetching utilities for dashboard and programs
dependencies:
  - "@cliqo/prisma"
llmInstructions:
  - USE these fetchers for server-side data loading
  - CACHE appropriately for performance
  - HANDLE errors gracefully
---

# 📥 Fetchers

> Data fetching utilities for dashboard and programs.

---

## Responsibilities

- **Primary:** Server-side data fetching
- **Secondary:** Dashboard and program data retrieval

---

## Key Files

| File | Purpose |
|------|---------|
| `index.ts` | Main fetcher exports |
| `get-dashboard.ts` | Dashboard data fetching |
| `get-program.ts` | Program detail fetching |
| `get-content-api.ts` | Content API fetching |

---

## Implementation Rules (AI Guardrails)

### ✅ DO

- Return typed data structures
- Cache expensive queries
- Handle missing data gracefully

### ❌ DON'T

- Fetch data client-side when server-side is possible
- Skip error handling

---

**Last Updated:** 2026-01-06

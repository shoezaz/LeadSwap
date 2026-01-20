---
name: Settings Page
scope: settings page in Main SaaS Application
dependencies:
  - "@cliqo/ui"
  - "@cliqo/prisma"
llmInstructions:
  - REQUIRES workspace authentication
  - CHECK workspaceId via useWorkspace hook
  - FOLLOW dashboard layout patterns
  - USES client component pattern (page-client.tsx)
---

# 📄 Settings Page

> settings page in Main SaaS Application

---

## Route Information

| Property | Value |
|----------|-------|
| **Domain** | `app.cliqo.com` |
| **Route Group** | `dashboard` |
| **Files** | 2 TypeScript files |
| **Client Component** | Yes |
| **Has Layout** | No |

---

## Implementation Rules (AI Guardrails)

### ✅ DO

- Follow existing patterns in this route
- Use shared components from @cliqo/ui
- Maintain consistent styling with sibling routes

### ❌ DON'T

- Bypass authentication checks
- Create duplicate utility functions

---

**Last Updated:** 2026-01-06

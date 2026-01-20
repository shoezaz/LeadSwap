---
name: Plan Page
scope: plan page in Main SaaS Application
dependencies:
  - "@cliqo/ui"
  - "@cliqo/prisma"
llmInstructions:
  - REQUIRES workspace authentication
  - CHECK workspaceId via useWorkspace hook
  - FOLLOW dashboard layout patterns
---

# 📄 Plan Page

> plan page in Main SaaS Application

---

## Route Information

| Property | Value |
|----------|-------|
| **Domain** | `app.cliqo.com` |
| **Route Group** | `onboarding` |
| **Files** | 4 TypeScript files |
| **Client Component** | No |
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

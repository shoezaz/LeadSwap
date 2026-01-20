---
name: Constants
scope: Application-wide constants and configuration values
dependencies: []
llmInstructions:
  - IMPORT constants from this module instead of hardcoding
  - ADD new constants here for reusability
---

# 📋 Constants

> Application-wide constants and configuration values.

---

## Responsibilities

- **Primary:** Centralized constant definitions
- **Secondary:** Recruiter configuration values

---

## Key Files

| File | Purpose |
|------|---------|
| `recruiter.ts` | Recruiter-related constants |

---

## Implementation Rules (AI Guardrails)

### ✅ DO

- Keep constants typed and documented
- Group related constants together

### ❌ DON'T

- Hardcode values that should be constants
- Duplicate constants across files

---

**Last Updated:** 2026-01-06

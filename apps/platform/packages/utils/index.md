---
name: Utils Package
scope: Shared utility functions and constants (formatting, validation, math).
dependencies: []
llmInstructions:
  - "ALWAYS Check here for common logic like date formatting or slugification."
  - "NEVER Duplicate utility functions in app `lib/` folders."
---

# Utils Package

> Shared utility functions and constants.

---

## 🧠 High-Level Purpose

- **Primary Responsibility:** DRY (Don't Repeat Yourself) logic repository.
- **Key Features:**
    - Date formatting.
    - String manipulation.
    - Common constants.

---

## 🔑 Key Context for AI Agents

- **See also:** [Apps/Web Context](../../apps/web/index.md)
- **Source of Truth:** `packages/utils/package.json`

### Core Logic & Patterns

1.  **Pure Functions:** Most utilities should be stateless.
2.  **Tree Shaking:** Exported individually for optimization.

---

## 📁 File Structure

| File | Purpose |
|------|---------|
| `src/functions/` | Helper functions. |
| `src/constants/` | Shared constants. |

---

## 🧩 Dependencies

### Internal (@cliqo/*)

None.

### External

- `date-fns`: Date manipulation.
- `nanoid`: ID generation.
- `clsx` / `tailwind-merge`: CSS class handling.

---

## 🛡️ Implementation Rules (AI Guardrails)

### ✅ ALWAYS

- Write unit tests for new utilities.

### ❌ NEVER

- Add React-specific logic here (keep it pure JS/TS).

---

**Last Updated:** 2026-01-09

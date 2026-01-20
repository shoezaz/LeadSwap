---
name: Tailwind Config
scope: Shared Tailwind CSS configuration and presets for the monorepo.
dependencies: []
llmInstructions:
  - "ALWAYS Extend this config in apps/packages instead of duplicating it."
  - "NEVER Hardcode hex colors — use the CSS variables defined here."
---

# Tailwind Config

> Shared Tailwind CSS configuration and presets for the monorepo.

---

## 🧠 High-Level Purpose

- **Primary Responsibility:** Enforce design system tokens (colors, spacing, typography) across all apps.
- **Key Features:**
    - Shared `tailwind.config.js`.
    - Custom plugins (scrollbar hide, radix integration).

---

## 🔑 Key Context for AI Agents

- **See also:** [UI Package](../ui/index.md)
- **Source of Truth:** `packages/tailwind-config/index.ts`

### Core Logic & Patterns

1.  **Preset Pattern:** Apps import this package in their `tailwind.config.js` via `presets`.

---

## 📁 File Structure

| File | Purpose |
|------|---------|
| `index.ts` | Exports the configuration object. |
| `package.json` | Dependencies. |

---

## 🧩 Dependencies

### Internal (@cliqo/*)

None.

### External

- `tailwindcss`: Core library.
- `tailwindcss-radix`: Utilities for Radix UI primitives.

---

## 🛡️ Implementation Rules (AI Guardrails)

### ✅ ALWAYS

- Define new global colors here, not in local configs.

### ❌ NEVER

- Override structural defaults (breakpoints) without good reason.

---

**Last Updated:** 2026-01-09

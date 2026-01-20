---
name: UI Package
scope: Shared React component library (charts, icons, primitives).
dependencies:
  - "@dub/tailwind-config"
  - "@dub/utils"
llmInstructions:
  - "ALWAYS Reuse existing components from this package."
  - "NEVER Create ad-hoc UI components in apps if a shared one exists."
---

# UI Package

> Shared React component library (charts, icons, primitives).

---

## 🧠 High-Level Purpose

- **Primary Responsibility:** Provide a consistent design system implementation.
- **Key Features:**
    - Radix UI wrappers (`src/**`).
    - Custom icons (`src/icons`).
    - Charts (`src/charts`).

---

## 🔑 Key Context for AI Agents

- **See also:** [Tailwind Config](../tailwind-config/index.md)
- **Source of Truth:** `packages/ui/package.json`

### Core Logic & Patterns

1.  **Headless UI:** Uses Radix UI for accessibility and functional logic.
2.  **Styling:** Uses Tailwind CSS (via `@dub/tailwind-config`).

---

## 📁 File Structure

| File | Purpose |
|------|---------|
| `src/icons/` | SVG icon components. |
| `src/charts/` | Recharts/Visx implementations. |
| `src/` | Core components (Button, Modal, etc.). |

---

## 🧩 Dependencies

### Internal (@cliqo/*)

- `@dub/tailwind-config`: Design tokens.
- `@dub/utils`: Shared helpers.

### External

- `@radix-ui/*`: UI primitives.
- `framer-motion` / `motion`: Animations.
- `lucide-react`: Base icons.

---

## 🛡️ Implementation Rules (AI Guardrails)

### ✅ ALWAYS

- Check for an existing component before building new.
- Use `tsup` for bundling.

### ❌ NEVER

- Import `react-dom` directly in components (except for portals).

---

**Last Updated:** 2026-01-09

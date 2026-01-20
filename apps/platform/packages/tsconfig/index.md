---
name: Shared TSConfig
scope: Shared TypeScript configuration bases.
dependencies: []
llmInstructions:
  - "ALWAYS Extend these base configs in new packages."
  - "NEVER Override strict mode unless absolutely necessary for legacy code."
---

# Shared TSConfig

> Shared TypeScript configuration bases.

---

## 🧠 High-Level Purpose

- **Primary Responsibility:** Provide standardized TypeScript compiler options for the monorepo.
- **Key Features:**
    - `base.json`: Common settings.
    - `nextjs.json`: Next.js specific settings.
    - `react-library.json`: Component library settings.

---

## 🔑 Key Context for AI Agents

- **See also:** [Apps/Web Context](../../apps/web/index.md)
- **Source of Truth:** `packages/tsconfig/`

### Core Logic & Patterns

1.  **Inheritance:** Packages use `"extends": "@cliqo/tsconfig/..."` in their local `tsconfig.json`.

---

## 📁 File Structure

| File | Purpose |
|------|---------|
| `base.json` | Universal defaults. |
| `nextjs.json` | Frontend defaults. |
| `package.json` | Dependencies. |

---

## 🧩 Dependencies

### Internal (@cliqo/*)

None.

### External

- `typescript`: Core compiler.

---

## 🛡️ Implementation Rules (AI Guardrails)

### ✅ ALWAYS

- Check `base.json` for global rules like `strict: true`.

### ❌ NEVER

- Downgrade target ES versions below ES2017.

---

**Last Updated:** 2026-01-09

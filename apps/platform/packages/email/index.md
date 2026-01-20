---
name: Email Package
scope: Shared email templates (React Email) and sending utilities (Resend/Nodemailer).
dependencies:
  - "@dub/utils"
llmInstructions:
  - "ALWAYS use `react-email` components for templates."
  - "PREFER `resend` for transactional emails."
  - "NEVER hardcode API keys."
---

# Email Package

> Shared email templates (React Email) and sending utilities.

---

## 🧠 High-Level Purpose

- **Primary Responsibility:** Define all email templates in a visual way and provide utilities to send them.
- **Key Features:**
    - React components for email templates (`src/templates/`).
    - Resend integration for production sending.
    - Nodemailer fallback (for SMTP/testing).

---

## 🔑 Key Context for AI Agents

- **See also:** [Apps/Web Context](../../apps/web/index.md)
- **Source of Truth:** `packages/email/src/index.ts`

### Core Logic & Patterns

1.  **Template-first:** Emails are built as React components.
2.  **Preview Mode:** `pnpm dev` runs the React Email preview server on port 3333.

---

## 📁 File Structure

| File | Purpose |
|------|---------|
| `src/templates/` | React Email template components. |
| `src/resend/` | Resend-specific sending logic. |
| `src/index.ts` | Main barrel export. |

---

## 🧩 Dependencies

### Internal (@cliqo/*)

- `@cliqo/utils`: Shared utilities.

### External

- `react-email` / `@react-email/components`: UI framework for emails.
- `resend`: Email delivery service.
- `nodemailer`: SMTP transport.

---

## 🛡️ Implementation Rules (AI Guardrails)

### ✅ ALWAYS

- Test email layouts in the preview server (`pnpm dev`).
- Use standard `lucide-react` icons if needed.

### ❌ NEVER

- Use complex CSS layout tricks (flexbox/grid support varies in email clients).
- Include large inline images (use hosted assets).

---

**Last Updated:** 2026-01-09

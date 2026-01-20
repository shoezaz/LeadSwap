---
name: Integrations
scope: External tool integrations (Slack, Hubspot, Zapier) and OAuth flows.
dependencies:
  - "@dub/prisma"
  - "@dub/utils"
  - "@dub/email"
  - "@dub/ui"
llmInstructions:
  - "ALWAYS extend the `OAuthProvider` base class for new OAuth integrations."
  - "ALWAYS use `install.ts` to handle standardized installation side-effects (emails, DB updates)."
  - "NEVER hardcode client secrets; use environment variables."
---

# Integrations

> External tool integrations (Slack, Hubspot, Zapier) and OAuth flows.

---

## 🧠 High-Level Purpose

- **Primary Responsibility:** Connect the platform with third-party tools.
- **Key Features:**
    - **OAuth Flow:** Abstracted provider pattern for secure token exchange.
    - **Webhooks:** Incoming/Outgoing webhook handling (Zapier, Slack).
    - **Installation Lifecycle:** Standardized install/uninstall logic.

---

## 🔑 Key Context for AI Agents

- **See also:** [HubSpot Package](../../../../packages/hubspot-app/index.md)
- **Source of Truth:** `apps/web/lib/integrations/`

### Core Logic & Patterns

1.  **OAuthProvider:** Base class that standardizes the OAuth 2.0 dance.
2.  **Folder Structure:** Each integration gets its own folder (`slack/`, `notion/`) containing `oauth.ts`, `install.ts`, and `types.ts`.

---

## 📁 File Structure

| File | Purpose |
|------|---------|
| `oauth-provider.ts` | Abstract base class for OAuth integrations. |
| `install.ts` | Shared logic for recording installations in DB and sending emails. |
| `slack/`, `hubspot/` | Provider-specific implementations. |

---

## 🧩 Dependencies

### Internal (@cliqo/*)

- `@dub/prisma`: Database access (Integrations table).
- `@dub/email`: Notification emails.

### External

- `zod`: Schema validation.
- `@vercel/functions`: Background processing (`waitUntil`).

---

## 🛡️ Implementation Rules (AI Guardrails)

### ✅ ALWAYS

- Validate state parameters to prevent CSRF in OAuth flows.
- Use `waitUntil` for non-critical post-install actions (like syncing data).

### ❌ NEVER

- Commit credentials to the repo.

---

**Last Updated:** 2026-01-09

---
name: Prisma Database Layer
scope: Database access and schema management
dependencies: []
llmInstructions:
  - "ALWAYS Include `workspaceId` in every query for Tenant Isolation."
  - "NEVER use `prisma.$queryRaw` unless absolutely necessary and approved."
  - "ALWAYS run `pnpm prisma:generate` after modifying schema.prisma."
  - "PREFER `prisma.program.findMany` over complex raw joins."
---

> Shared ORM & Database/Schema definitions for the entire platform.

---

## 🏗️ Architecture Diagrams

```mermaid
graph TD
    Web[Apps/Web] --> Client[@dub/prisma]
    API[Apps/API] --> Client
    Client --> PlanetScale[(PlanetScale DB)]
```

---

## 🧠 High-Level Purpose

This package provides:
- **Prisma Client** - Type-safe database access
- **Schema Definitions** - Single source of truth for data models
- **Migrations** - Database schema versioning

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `schema.prisma` | Database schema definition |
| `client.ts` | Configured Prisma client instance |
| `migrations/` | Database migration history |

---

## 🔗 Dependencies

This package has NO dependencies on other workspace packages. It is a foundational layer.

---

## 🎯 Implementation Rules

### ✅ ALWAYS

- Include `workspaceId` in every query for tenant isolation
- Run `pnpm prisma:generate` after modifying `schema.prisma`
- Use Prisma's type-safe query builder
- Add indexes for frequently queried fields

### ❌ NEVER

- Use `prisma.$queryRaw` or Raw SQL unless absolutely necessary and approved
- Skip workspace isolation checks
- Modify the database schema directly without migrations
- Share Prisma client instances across requests

---

## 🔐 Tenant Isolation

**CRITICAL:** Every query MUST include workspace filtering:

```typescript
// ✅ CORRECT
const links = await prisma.link.findMany({
  where: {
    projectId: workspaceId,  // REQUIRED
    // ... other filters
  }
});

// ❌ WRONG - Missing workspace filter
const links = await prisma.link.findMany({
  where: {
    domain: "example.com"
  }
});
```

---

## 🚀 Usage Example

```typescript
import { prisma } from "@dub/prisma";

// Query with workspace isolation
const programs = await prisma.program.findMany({
  where: {
    projectId: workspaceId,
    status: "active"
  },
  include: {
    partners: true
  }
});
```

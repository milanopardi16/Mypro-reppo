# Phase 2 Migration Report — Database Activation

**Date:** 2026-06-03  
**Scope:** Schema hardening, relations, repository layer, seed — **no UI/route changes**

---

## Summary

Phase 2 activates and stabilizes the database layer: improved Prisma schema with proper defaults and foreign keys, complete repository coverage, enhanced seed data, and a second migration for relations.

---

## Schema Improvements

### 1. `@default(cuid())` added where appropriate

| Model | Before | After |
|-------|--------|-------|
| `User` | `id String @id` | `id String @id @default(cuid())` |
| `Assessment` | no default | `@default(cuid())` |
| `ContactMessage` | no default | `@default(cuid())` |
| `FounderSubmission` | no default | `@default(cuid())` |
| `ChatRoom` | no default | `@default(cuid())` |

**Note:** Legacy JSON imports and registration API still pass explicit IDs where required for API compatibility.

### 2. New relations

| Relation | Implementation |
|----------|----------------|
| **User ↔ Notification** | `Notification.userId` → `User.id` (+ `actorRef` for legacy external IDs) |
| **User ↔ PushToken** | `PushToken.userId` → `User.id` |
| **User ↔ ChatRoom** | `ChatRoom.userId` → `User.id` |
| **Admin ↔ ChatRoom** | `ChatRoom.adminId` → `Admin.id` |
| **Admin ↔ PushToken** | `PushToken.adminId` → `Admin.id` |

### 3. Email uniqueness for auth

- `User.email` — optional, **not unique** (registration forms may repeat)
- `User.authEmail` — optional, **`@unique`** (for future email-based login)

---

## Migrations

| File | Purpose |
|------|---------|
| `prisma/migrations/20250603130000_init/migration.sql` | Initial tables (Phase 1) |
| `prisma/migrations/20250603140000_phase2_relations/migration.sql` | Relations, indexes, FKs, role normalization |

---

## Seed (`prisma/seed.js`)

Creates:
- **Roles:** `Admin`, `Manager`, `User`
- **Default admin** from `ADMIN_EMAIL` + `ADMIN_PASSWORD`
- Imports all legacy JSON from `data/` directory
- Creates guest `User` records for chat participants (enables ChatRoom FK)

```bash
npm run db:setup    # migrate + seed
# or separately:
npm run db:migrate
npm run db:seed
```

---

## Repository Layer (`server/repositories/`)

| Repository | Entity |
|------------|--------|
| `admin.repository.js` | Admin |
| `assessment.repository.js` | Assessment |
| `auditLog.repository.js` | AuditLog *(new)* |
| `blog.repository.js` | BlogPost |
| `chat.repository.js` | ChatRoom, ChatMessage |
| `contactMessage.repository.js` | ContactMessage |
| `founder.repository.js` | FounderSubmission |
| `notification.repository.js` | Notification |
| `pushToken.repository.js` | PushToken |
| `refreshToken.repository.js` | RefreshToken |
| `role.repository.js` | Role *(new)* |
| `siteContent.repository.js` | SiteContent |
| `user.repository.js` | User |
| `index.js` | Barrel export *(new)* |

**JSON storage:** No remaining `readJson`/`writeJson` in `server/` — all persistence goes through Prisma repositories.

---

## Prisma Client

- **Generated:** `npx prisma generate` (via `npm run db:generate` or `postinstall`)
- **Singleton:** `server/prisma/client.js` with `connectDatabase()` / `disconnectDatabase()`

---

## Backend Files Changed (no UI)

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Relations, defaults, authEmail |
| `prisma/seed.js` | Admin/Manager/User roles, guest users for chat |
| `prisma/migrations/20250603140000_phase2_relations/` | Phase 2 migration |
| `server/prisma/client.js` | Enhanced singleton |
| `server/repositories/*` | Updated + 3 new repos |
| `server/middlewares/auth.middleware.js` | Admin + Manager roles |
| `server/middlewares/audit.middleware.js` | Uses auditLog repository |
| `server/utils/helpers.js` | Notification DTO with actorRef |
| `server/services/founder.service.js` | Auto-generated IDs |
| `server/controllers/api.controller.js` | Push token adminId, contact cuid |

---

## Breaking Changes

**None for API routes or frontend.** Internal DB-only changes:

- New notifications store external IDs in `actorRef` when no matching `User` exists (API `userId` field unchanged via DTO mapping)
- Contact messages get cuid IDs instead of timestamps for new entries

---

## Setup

```bash
# 1. Configure DATABASE_URL in .env.local
# 2. Run migrations + seed
npm run db:setup

# 3. Generate client (if not via postinstall)
npm run db:generate

# 4. Start
npm run dev
```

Login: `ADMIN_USERNAME` / `ADMIN_PASSWORD` (admin role: **Admin**)

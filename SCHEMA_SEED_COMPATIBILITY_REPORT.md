# Schema ↔ Seed Compatibility Report

**Generated:** 2026-06-03  
**Files analyzed:** `prisma/schema.prisma`, `prisma/seed.js`, `prisma/migrations/*`

---

## Executive Summary

| Category | Result |
|----------|--------|
| **Field name mismatches (seed → schema)** | **0** — all Prisma Client field names in seed match the schema |
| **Unknown models in seed** | **0** |
| **Missing schema fields used by seed** | **0** |
| **FK / import-order issues (runtime failures)** | **3** — fixed in seed.js |
| **Migration vs schema gaps (init only)** | **4 columns + 4 FKs** — covered by phase2 migration |

---

## Model-by-Model Field Audit

### Role
| seed field | schema field | status |
|------------|--------------|--------|
| `name` | `name` | ✅ |
| `description` | `description` | ✅ |

### Admin
| seed field | schema field | status |
|------------|--------------|--------|
| `email` | `email` | ✅ |
| `passwordHash` | `passwordHash` | ✅ |
| `name` | `name` | ✅ |
| `roleId` | `roleId` | ✅ |
| `isActive` | `isActive` | ✅ |

### User
| seed field | schema field | status |
|------------|--------------|--------|
| `id` | `id` | ✅ |
| `fullName` | `fullName` | ✅ |
| `email` | `email` | ✅ |
| `phone` | `phone` | ✅ |
| `companyName` | `companyName` | ✅ |
| `position` | `position` | ✅ |
| `industry` | `industry` | ✅ |
| `website` | `website` | ✅ |
| `message` | `message` | ✅ |
| `roleId` | `roleId` | ✅ |
| `createdAt` | `createdAt` | ✅ |

### SiteContent
| seed field | schema field | status |
|------------|--------------|--------|
| `id` | `id` | ✅ |
| `content` | `content` | ✅ |

### BlogPost
All 11 create fields (`id`, `slug`, `title`, `excerpt`, `content`, `coverImage`, `tags`, `category`, `status`, `createdAt`, `updatedAt`) — ✅

### ContactMessage
All 7 create fields — ✅

### Notification
| seed field | schema field | status |
|------------|--------------|--------|
| `id` | `id` | ✅ |
| `title` | `title` | ✅ |
| `message` | `message` | ✅ |
| `type` | `type` | ✅ |
| `userId` | `userId` (FK → User) | ⚠️ order issue |
| `actorRef` | `actorRef` | ✅ |
| `isRead` | `isRead` | ✅ |
| `createdAt` | `createdAt` | ✅ |

### Assessment
All 22 create fields — ✅

### FounderSubmission
All 21 create fields — ✅

### ChatRoom
| seed field | schema field | status |
|------------|--------------|--------|
| `id` | `id` | ✅ |
| `userId` | `userId` (FK → User) | ⚠️ guest user must exist first |
| `adminId` | `adminId` (FK → Admin) | ⚠️ invalid legacy values |
| `status` | `status` | ✅ |
| `createdAt` | `createdAt` | ✅ |

### ChatMessage
All 8 create fields — ✅

---

## Issues Found (Not Field-Name Mismatches)

### 1. Notification `userId` FK — import order
**Problem:** Chat notification JSON uses `userId: "9d8fb66b-…"` (guest UUID). `importNotifications` ran before guest users were created, so FK-linked `userId` was always `null` and value went to `actorRef` only.

**Fix:** Pre-seed guest users from chat JSON before `importNotifications`.

### 2. ChatRoom `userId` FK — guest user timing
**Problem:** Same guest UUID must exist in `users` before `chat_rooms.user_id` FK insert.

**Fix:** Centralized `seedGuestUsers()` before chat and notification imports.

### 3. ChatRoom `adminId` FK — legacy string `"admin"`
**Problem:** Socket/API may set `adminId: "admin"` (display name), not `Admin.id` (cuid). FK insert fails.

**Fix:** `resolveAdminId()` — only set `adminId` when value matches a real `Admin.id`.

### 4. Migration init vs schema (requires phase2)
| schema field | init migration | phase2 migration |
|--------------|----------------|------------------|
| `User.authEmail` | ❌ missing | ✅ added |
| `Notification.actorRef` | ❌ missing | ✅ added |
| `PushToken.userId` | ❌ missing | ✅ added |
| `PushToken.adminId` | ❌ missing | ✅ added |
| FK notifications → users | ❌ | ✅ |
| FK chat_rooms → users/admins | ❌ | ✅ |
| FK push_tokens → users/admins | ❌ | ✅ |

**Fix:** New migration `20250603150000_schema_seed_align` consolidates remaining alignment for greenfield + validates constraints.

---

## Relations Used in Seed

| Relation | seed usage | schema definition |
|----------|------------|-------------------|
| User ← Notification.userId | `userId` on create | ✅ `@relation` on Notification |
| User ← ChatRoom.userId | `userId` on create | ✅ `@relation("UserChatRooms")` |
| Admin ← ChatRoom.adminId | `adminId` on create | ✅ `@relation("AdminChatRooms")` |
| User ← User.roleId | `roleId` on create | ✅ |
| Admin ← Admin.roleId | `roleId` on create | ✅ |
| ChatRoom ← ChatMessage.roomId | `roomId` on create | ✅ |

No relation used in seed is missing from schema.

---

## Models in Schema Not Seeded (intentional)

| Model | Reason |
|-------|--------|
| `RefreshToken` | Runtime auth only |
| `PushToken` | Runtime FCM registration |
| `AuditLog` | Runtime logging |

---

## Fixes Applied

1. **`prisma/seed.js`** — guest user pre-seed, adminId resolver, corrected import order, idempotent upsert updates
2. **`prisma/migrations/20250603150000_schema_seed_align/migration.sql`** — ensures all schema columns/FKs exist (idempotent)
3. **`prisma/schema.prisma`** — no field renames required (already compatible)

---

## Verification Commands

```bash
# Requires DATABASE_URL in .env.local
npm run db:migrate
npm run db:seed
```

Expected: seed completes without FK violations; chat notifications link to `users.id` where guest UUID exists.

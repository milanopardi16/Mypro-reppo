# Prisma Migration Health Report

**Generated:** 2026-06-04

## Configuration

| Item | Status |
|------|--------|
| `prisma.config.ts` | Present — seed: `node prisma/seed.js` |
| `package.json#prisma` | Removed (migrated) |
| `schema.prisma` datasource | `env("DATABASE_URL")` |
| Provider | PostgreSQL |
| Migration lock | `postgresql` (`migration_lock.toml`) |

## Migrations (deterministic order)

| Migration | Purpose |
|-----------|---------|
| `20250603130000_init` | Core tables: roles, users, admins, tokens, notifications, blog, assessments, contact, chat, founder, site_content, push, audit |
| `20250603140000_phase2_relations` | FK indexes and relation alignment |
| `20250603150000_schema_seed_align` | Schema/seed field alignment |

All migrations use explicit SQL (no drift from `db pull`). Apply with:

```bash
npx prisma migrate deploy
```

## Schema relation validation

| Model | Relations | Notes |
|-------|-----------|-------|
| Role | → Admin, User | Valid |
| User | → Role | Optional `roleId` |
| Admin | → Role, RefreshToken, AuditLog | Valid |
| RefreshToken | → Admin CASCADE | Valid |
| ChatMessage | → ChatRoom CASCADE | Valid |
| AuditLog | → Admin SET NULL | Valid |
| Notification | — | **No FK** on `userId` (intentional flexibility; orphan risk) |
| ChatRoom | — | **No FK** on `userId` / `adminId` |
| BlogPost, Assessment, etc. | Standalone | Valid |

No orphan `@relation` fields without opposite side.

## Dead schema fields

None identified — all fields mapped in repositories or seed imports.

## Seed safety

- `prisma/seed.js` checks `DATABASE_URL` before run.
- `npm run db:validate-seed` runs `scripts/validate-seed-schema.mjs`.
- Guest users created before chat import for FK-less user IDs in chat.

## Recommendations

1. Add FK `Notification.userId` → `User.id` ON DELETE SET NULL (migration).
2. Add FK `ChatRoom.userId` → `User.id` optional.
3. Run `npx prisma validate` in CI after every schema change.

## Health: **PASS** (migrations deterministic; seed guarded)

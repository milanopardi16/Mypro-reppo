# Production Readiness Audit

**Date:** 2026-06-04  
**Verdict:** **NOT READY** (see score and blockers below)

## Production readiness score: **68 / 100**

| Area | Score | Weight |
|------|-------|--------|
| Security | 55 | 20% |
| Prisma / data | 75 | 15% |
| Backend API | 70 | 15% |
| Socket.IO | 65 | 10% |
| Frontend | 58 | 10% |
| Deployment | 72 | 15% |
| Observability | 78 | 10% |
| Code quality | 50 | 5% |

---

## Critical issues

| ID | Issue | Files |
|----|-------|-------|
| C1 | Live secrets in `.env` and `.env.local` on disk (DB passwords, JWT, admin password, `ADMIN_TOKEN`) — rotate immediately if repo was shared | `.env`, `.env.local` |
| C2 | ~~Public evaluations exposed all PII~~ **Mitigated:** server-side filter requires `email` / `phone` / `fullName` query | `server/controllers/api.controller.js`, `app/dashboard/page.js` |
| C3 | ~~Public site-content update~~ **Fixed:** removed unauthenticated `/api/site-content/update` routes | `server/routes/api.routes.js` |
| C4 | Async errors on main API/admin/auth routes **mitigated** via `asyncHandler` | `server/utils/asyncHandler.js`, `server/routes/*.js` |

## High issues

| ID | Issue | Files |
|----|-------|-------|
| H1 | Hardcoded credential fallbacks removed from `scripts/test-admin-auth.mjs` (fixed); verify no other scripts | `scripts/` |
| H2 | `ADMIN_TOKEN` socket fallback still enabled when env set — weak compared to JWT | `server/middlewares/auth.middleware.js` |
| H3 | CORS `origin: true` reflects any Origin — tighten for production | `server/middlewares/security.middleware.js`, `server/socket.js` |
| H4 | `listEvaluationsPublic` + legacy `/backend` routes lack validation middleware | `server/routes/api.routes.js`, `server/routes/legacy.routes.js` |
| H5 | Duplicate registration/site-content paths (`/api` vs `/backend`) | `server/routes/legacy.routes.js` |
| H6 | 103-file `app/` tree still uses Next.js naming (`page.js`, `layout.js`, `NEXT_PUBLIC_*`) | `app/`, `lib/` |
| H7 | `test-route/page.js` and `preview/homepage` likely non-production routes | `app/test-route/`, `app/preview/` |

## Medium issues

| ID | Issue | Files |
|----|-------|-------|
| M1 | `Notification.userId` has no FK to `User` — orphan user refs possible | `prisma/schema.prisma` |
| M2 | `ChatRoom.userId` / `adminId` no FK constraints | `prisma/schema.prisma` |
| M3 | `resolveNotificationUserId` `actorRef` unused in seed | `prisma/seed.js` |
| M4 | `founderOnboarding` lacks Zod body validation | `server/routes/api.routes.js` |
| M5 | Blog create/update admin endpoints accept raw `req.body` | `server/controllers/api.controller.js` |
| M6 | Empty `db/`, `one/`, `src/next-shims/` directories | repo root |
| M7 | `read_npm_log.py`, `timestamp.txt` appear non-essential | root |
| M8 | Vite build lacks `manualChunks` / route-based code splitting beyond React Router | `vite.config.js`, `src/App.jsx` |

## Low issues

| ID | Issue | Files |
|----|-------|-------|
| L1 | `PROJECT_STRUCTURE.md` references removed `next.config.mjs` | `PROJECT_STRUCTURE.md` |
| L2 | `public/next.svg`, `public/vercel.svg` branding remnants | `public/` |
| L3 | `app/layout.js` duplicate `<html>` shell unused by Vite | `app/layout.js` |
| L4 | Rate limit 120/min may be high for admin mutations | `server/middlewares/security.middleware.js` |

---

## Implemented in this audit (unified changes)

- `server/config/env.js` — Zod env validation at startup
- `server/config/logger.js` — structured JSON logs
- `server/middlewares/correlation.middleware.js` — `x-request-id`
- `server/middlewares/request-log.middleware.js` — request logging
- `server/middlewares/error.middleware.js` — normalized API errors
- `GET /api/version`, `GET /api/ready` (DB probe), enhanced `GET /api/health`
- `prisma.config.ts` — seed migrated from `package.json`
- `.gitignore` — explicit `.env` / `.env.local` ignore; allow `*.example`
- `.env.example`, `.env.local.example` — complete templates
- `SECURITY.md`, `Dockerfile`, `docker-compose.yml`, `scripts/start-production.sh`
- Upload size/type guards, multer 10MB limit
- Socket disconnect room cleanup + structured socket logs
- Graceful shutdown (`SIGTERM` / `SIGINT`)
- `scripts/validate-seed-schema.mjs`, `scripts/test-admin-auth.mjs` hardened

See companion reports: `MIGRATION_HEALTH_REPORT.md`, `DATA_CONSISTENCY_REPORT.md`, `DEPLOYMENT_CHECKLIST.md`, `ROLLBACK_CHECKLIST.md`, `BACKUP_STRATEGY.md`.

---

## Deployment verdict

### **NOT READY**

**Blockers before production:**

1. Rotate all secrets in `.env` / `.env.local` and confirm they are not in git history.
2. Set production CORS allowlist.
3. Run full regression: `npm run build`, `prisma migrate deploy`, `node scripts/test-admin-auth.mjs`.
4. Rotate secrets (C1) and confirm git history has no `.env` commits.

After blockers: re-score ≥ 85 → **READY**.

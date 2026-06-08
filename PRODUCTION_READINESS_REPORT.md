# Production Readiness Report

**Date:** 2026-06-04  
**Version:** 0.1.0  
**Verification run:** `scripts/production-verify.mjs`  
**Final score:** **86 / 100**  
**Final verdict:** **NOT READY**

> **READY** is withheld because Critical audit item **C1** (secrets rotation confirmation) and unresolved **high-severity dependency vulnerabilities** (`xlsx`, Prisma toolchain) remain operator/supply-chain actions before production traffic.

---

## Executive summary

A full production verification pass was executed against a live API instance (`NODE_ENV=production`, `SERVE_STATIC=true`, port `4001`). All runtime smoke tests passed after retry logic accounted for transient Supabase pooler latency. Build, Prisma, seed, and environment validation succeeded. The application architecture is production-capable, but deployment should wait until secrets are rotated and high-risk dependencies are reviewed.

---

## Architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Reverse proxy (TLS)                      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│  Express API (server/api-server.js) :4001                         │
│  ├── /api/*          REST JSON API                                │
│  ├── /backend/*      Legacy compatibility routes                  │
│  ├── /uploads/*      Static file serving                          │
│  ├── /dist/*         Vite SPA (when SERVE_STATIC=true)            │
│  └── Socket.IO       Real-time chat                               │
├─────────────────────────────────────────────────────────────────┤
│  Middleware stack                                                 │
│  correlation → request-log → CORS/Helmet/rate-limit → JSON body   │
│  routes → 404 → centralized error handler                         │
├─────────────────────────────────────────────────────────────────┤
│  Data layer: Prisma 6 + PostgreSQL (Supabase pooler in this env)  │
│  15 models · 3 migrations · JSON seed pipeline                    │
└─────────────────────────────────────────────────────────────────┘

Frontend: Vite 7 + React 19 + React Router 7 (SPA in dist/)
Dev proxy: Vite :5173 → API :4001
```

| Component | Technology | Notes |
|-----------|------------|-------|
| Frontend | Vite 7, React 19 | Build → `dist/`, served by Express in prod |
| API | Express 4 | Repository pattern, Zod validation |
| Database | PostgreSQL 16 | Prisma ORM, 3 migrations applied |
| Real-time | Socket.IO 4 | JWT admin auth; user rooms by `userId` |
| Auth | JWT (access + refresh) | bcrypt admin passwords |
| Observability | JSON structured logs | `x-request-id` correlation |
| Container | Docker + compose | Healthcheck on `/api/ready` |

---

## Verification checklist results

| Step | Command / action | Result | Notes |
|------|------------------|--------|-------|
| npm install | `npm install` | ✅ PASS | 650 packages; postinstall `prisma generate` OK |
| Prisma validate | `npx prisma validate` | ✅ PASS | Schema valid |
| Migrate deploy | `npx prisma migrate deploy` | ✅ PASS | 3 migrations; none pending |
| Prisma generate | `npx prisma generate` | ✅ PASS | Client v6.19.0 |
| Seed execution | `npx prisma db seed` | ✅ PASS | Admin, site content, 4 assessments, chat data |
| Frontend build | `npm run build` | ✅ PASS | Built in ~47s; chunk size warning (1.5 MB main) |
| Backend startup | `node server/api-server.js` | ✅ PASS | Production mode, static frontend served |
| Environment validation | `npm run validate:env` | ✅ PASS | Zod schema satisfied |
| Health endpoint | `GET /api/health` | ✅ PASS | `status: healthy` |
| Readiness endpoint | `GET /api/ready` | ✅ PASS | `database: up` (after retry) |
| Version endpoint | `GET /api/version` | ✅ PASS | v0.1.0 |
| Blog endpoint | `GET /api/blogs` | ✅ PASS | 200, array response |
| Site-content endpoint | `GET /api/site-content` | ✅ PASS | 200, 23 content keys |
| Upload endpoint | `POST /api/chat/uploads` | ✅ PASS | PNG upload → `/uploads/...` |
| WebSocket | Socket.IO connect (user role) | ✅ PASS | Connected and disconnected cleanly |

**Smoke test summary:** 8/8 passed (`scripts/.production-verify-result.json`, 2026-06-04T06:48:41Z)

### Transient failure observed

During the first verification attempt (~90s after server start), Supabase pooler returned `Can't reach database server` for `/api/ready`, `/api/blogs`, and `/api/site-content`. Requests succeeded on retry after ~2 minutes. **Risk:** remote DB pooler latency or cold-start may cause brief 503/500 at deploy; configure retries on load balancer health checks.

---

## Security findings

| ID | Severity | Finding | Status |
|----|----------|---------|--------|
| C1 | **Critical** | Live secrets in `.env` / `.env.local` on disk — rotation not verified | ⛔ Open (operator) |
| C2 | Critical | Public evaluations PII exposure | ✅ Mitigated (query filter + Zod) |
| C3 | Critical | Unauthenticated site-content mutation | ✅ Fixed |
| C4 | Critical | Unhandled async route errors | ✅ Fixed (`asyncHandler`) |
| H2 | High | `ADMIN_TOKEN` socket fallback | ✅ Rejected in production |
| H3 | High | CORS reflects any origin | ⚠️ Partial — allowlist only when `CORS_ORIGINS` set |
| DEP-1 | High | `xlsx` prototype pollution / ReDoS (no fix) | ⛔ Open |
| DEP-2 | High | `effect` via Prisma dev toolchain | ⚠️ Dev dependency chain |
| DEP-3 | Moderate | `uuid` via `firebase-admin` | ⚠️ Optional FCM feature |
| npm audit | — | 12 vulnerabilities (4 high, 8 moderate) | ⛔ Review required |

### Controls verified in production mode

- Helmet security headers
- Rate limiting (120/min global, 20 login/15min)
- Upload allowlist (`.png`, `.jpg`, `.pdf`, etc.) and 10 MB cap
- JWT admin authentication on protected routes
- Structured audit logging for admin mutations
- Graceful shutdown (HTTP → Socket.IO → Prisma disconnect)
- Environment validation exits on misconfiguration

---

## Fixed issues (audit remediation)

| Issue | Fix applied |
|-------|-------------|
| Schema/migration drift | `authEmail`, `actorRef`, FK relations synced in `schema.prisma` |
| Seed `actorRef` unused | Written in `prisma/seed.js` |
| Missing API validation | Zod on founder, blog, evaluations, legacy routes |
| Legacy `/backend` unprotected | Admin auth + validation on mutations |
| CORS production hardening | `CORS_ORIGINS` + shared config (`server/config/cors.js`) |
| Prisma not disconnected on shutdown | `$disconnect()` in graceful shutdown |
| Dead code / obsolete files | Removed unused `lib/*`, branding SVGs, utility scripts |
| Test routes in production | `/test-route`, `/preview/homepage` gated in prod build |
| Public evaluations filter | Requires `email`, `phone`, or `fullName` |
| Centralized errors + logging | Confirmed operational |

---

## Remaining risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **C1 — Secrets not rotated** | Credential compromise if files were shared | Rotate JWT, DB password, admin password before go-live |
| **CORS not configured** | Any origin accepted until `CORS_ORIGINS` set | Set `CORS_ORIGINS=https://yourdomain.com` |
| **`xlsx` high CVEs** | Admin Excel export attack surface | Replace with maintained fork or server-side CSV; restrict export to admin only (already gated) |
| **Supabase pooler blips** | Brief 503 on `/api/ready` | LB retry; increase healthcheck `start_period` |
| **Large JS bundle (1.5 MB)** | Slow first paint | Route-based code splitting (future) |
| **npm audit (12 issues)** | Supply-chain | `npm audit fix`; review firebase-admin / xlsx |
| **No git available in CI shell** | Cannot confirm `.env` never committed | Manual `git log -- .env` review |

---

## Deployment instructions

### 1. Pre-deploy

```bash
npm ci
npm run validate              # env + prisma + migrations + seed schema + lint + build
npx prisma migrate deploy
npx prisma db seed            # first deploy only
```

### 2. Configure production environment

```env
NODE_ENV=production
SERVE_STATIC=true
DATABASE_URL=postgresql://...?sslmode=require
JWT_ACCESS_SECRET=<32+ chars, unique>
JWT_REFRESH_SECRET=<32+ chars, unique>
CORS_ORIGINS=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# Unset ADMIN_TOKEN in production
```

### 3. Start

```bash
npm run start:prod
# or Docker:
docker compose up -d db
docker compose run --rm api npx prisma migrate deploy
docker compose up -d api
```

### 4. Post-deploy verification

```bash
curl -sf http://localhost:4001/api/health
curl -sf http://localhost:4001/api/ready
curl -sf http://localhost:4001/api/version
node scripts/production-verify.mjs
node scripts/test-admin-auth.mjs
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for nginx, volumes, and full checklist.

---

## Rollback instructions

### Application rollback

1. Stop current process / container: `docker compose stop api` or `SIGTERM` to Node process.
2. Deploy previous known-good image or git tag.
3. Do **not** run new migrations on rollback target.

### Database rollback

1. If the failed deploy applied **no new migrations** → no DB rollback needed.
2. If a new migration was applied → restore from backup (see `docs/BACKUP_STRATEGY.md`):

```bash
pg_restore -d capital_network backup.dump
# or Supabase point-in-time recovery via dashboard
```

3. Verify: `npx prisma migrate status` matches rolled-back app version.

See `docs/ROLLBACK_CHECKLIST.md` for full procedure.

---

## Score breakdown

| Area | Score | Weight | Weighted |
|------|-------|--------|----------|
| Security | 74 | 20% | 14.8 |
| Prisma / data | 92 | 15% | 13.8 |
| Backend API | 90 | 15% | 13.5 |
| Socket.IO | 85 | 10% | 8.5 |
| Frontend | 72 | 10% | 7.2 |
| Deployment | 90 | 15% | 13.5 |
| Observability | 90 | 10% | 9.0 |
| Code quality | 78 | 5% | 3.9 |
| **Total** | | | **86.0** |

Score increased from pre-remediation **68** due to verified runtime checks, schema sync, validation, and infrastructure hardening. Score capped below 90 due to C1, dependency CVEs, and CORS configuration gap.

---

## Final verdict

### **NOT READY**

**Blockers before accepting production traffic:**

1. **Rotate all secrets** (C1) and confirm `.env` was never committed to version control.
2. **Set `CORS_ORIGINS`** to production domain(s).
3. **Review `xlsx` dependency** used in admin Excel export (high severity, no upstream fix).
4. **Run staging regression** including `scripts/production-verify.mjs` and `scripts/test-admin-auth.mjs`.

**When blockers are cleared:** re-run verification → target score ≥ 90 → verdict **READY**.

---

## Appendix: commands log

```
npm install                                    ✅
npx prisma validate                            ✅
npx prisma migrate deploy                      ✅ (3 migrations, 0 pending)
npx prisma generate                            ✅
npx prisma db seed                             ✅
npm run build                                  ✅
npm run validate:env                           ✅
node server/api-server.js (NODE_ENV=production) ✅
node scripts/production-verify.mjs             ✅ 8/8
npm audit                                      ⚠️ 12 vulnerabilities
```

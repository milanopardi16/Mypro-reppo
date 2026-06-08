# Changelog

All notable changes to Capital Network (my-site) are documented here.

## [0.2.0] — 2026-06-04

### Added

- **Health & readiness:** `GET /api/health`, `GET /api/ready` (DB probe), `GET /api/version`, `GET /api/admin/health`
- **Observability:** Structured JSON logging (`server/config/logger.js`), request correlation IDs, HTTP request logging
- **Resilience:** Graceful shutdown on `SIGTERM`/`SIGINT` with HTTP, Socket.IO, and Prisma disconnect
- **Configuration:** Zod-based environment validation at startup (`server/config/env.js`)
- **CORS:** Production allowlist via `CORS_ORIGINS` and `NEXT_PUBLIC_SITE_URL` (`server/config/cors.js`)
- **Validation:** Zod schemas for registrations, contact, founder onboarding, blog CRUD, and public evaluations query
- **Legacy routes:** `asyncHandler`, body validation, and admin auth on `/backend/*` mutations
- **Deployment:** Dockerfile, docker-compose, `scripts/start-production.sh`, validation scripts
- **Documentation:** `DEPLOYMENT.md`, `SECURITY.md`, `PRODUCTION_READINESS_REPORT.md`

### Changed

- **Prisma schema:** Synced with migrations — `authEmail`, `actorRef`, FK relations on `Notification`, `ChatRoom`, `PushToken`
- **Seed:** Writes `actorRef` for legacy notification identifiers
- **Socket.IO:** CORS uses shared config; `ADMIN_TOKEN` rejected in production
- **Frontend:** Test and preview routes disabled in production builds
- **Security:** Public evaluations require `email`, `phone`, or `fullName` filter; unauthenticated site-content mutation removed

### Removed

- Dead code: `lib/backendUrl.js`, `lib/blogPostsServer.js`, `lib/registrationsStore.js`, `lib/supabaseClient.js`, `lib/supabaseServer.js`
- Obsolete files: `read_npm_log.py`, `timestamp.txt`, `public/next.svg`, `public/vercel.svg`

### Fixed

- Schema/migration drift (M1, M2, M3)
- Legacy `/backend` routes missing validation and auth (H4, H5)
- Founder onboarding and blog admin endpoints accepting unvalidated input (M4, M5)
- Prisma not disconnected on shutdown

## [0.1.0] — Initial

- Vite + React 19 SPA with Express API and Prisma/PostgreSQL backend
- Admin dashboard, blog, chat (Socket.IO), evaluations, registrations

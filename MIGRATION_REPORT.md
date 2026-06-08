# Migration Report — JSON to PostgreSQL + Prisma

**Date:** 2026-06-03  
**Project:** Capital Network (`my-next-app`)

## Summary

The backend was migrated from file-based JSON storage to **PostgreSQL** with **Prisma ORM**, real **JWT authentication** (access + refresh tokens with rotation), **RBAC**, **audit logging**, and production security middleware — while preserving existing API contracts and frontend routes.

---

## Files Added

### Prisma
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Full database schema (14 entities) |
| `prisma/seed.js` | Seeds roles, first admin, imports existing JSON data |
| `prisma/migrations/20250603130000_init/migration.sql` | Initial migration SQL |
| `prisma/migrations/migration_lock.toml` | Prisma migration lock |

### Server Architecture
| Path | Purpose |
|------|---------|
| `server/prisma/client.js` | Prisma client singleton |
| `server/app.js` | Express app factory |
| `server/socket.js` | Socket.IO real-time chat |
| `server/utils/helpers.js` | DTO mappers & shared helpers |
| `server/utils/firebase.js` | Firebase push notifications |
| `server/utils/upload.js` | File upload handling |
| `server/middlewares/auth.middleware.js` | JWT `requireAdmin`, socket auth |
| `server/middlewares/audit.middleware.js` | Audit log middleware |
| `server/middlewares/validate.middleware.js` | Zod validation wrapper |
| `server/middlewares/security.middleware.js` | Helmet, CORS, rate limiting |
| `server/repositories/*.repository.js` | Data access layer (10 repos) |
| `server/services/*.service.js` | Business logic (6 services) |
| `server/controllers/api.controller.js` | HTTP handlers |
| `server/routes/api.routes.js` | Public + admin API routes |
| `server/routes/auth.routes.js` | Auth routes (`/api/admin/auth/*`) |
| `server/routes/legacy.routes.js` | `/backend/*` legacy routes |

### Documentation
| File | Purpose |
|------|---------|
| `MIGRATION_REPORT.md` | This report |

---

## Files Changed

| File | Change |
|------|--------|
| `server/api-server.js` | Refactored to thin entry point (~25 lines) |
| `package.json` | Added Prisma, bcryptjs, db scripts, postinstall |
| `.env.example` | Added `DATABASE_URL`, `ADMIN_EMAIL`, JWT vars |
| `app/utils/adminAuth.js` | Real JWT token storage & `adminFetch` auth headers |
| `app/admin/AdminGate.jsx` | Session verification + admin login gate |

---

## Files Unchanged (Frontend UI)

All page components, layouts, styles, and routes remain intact:
- `app/admin/**/page.jsx` — no visual changes
- `src/App.jsx` — same routes
- Public pages — unchanged

---

## Database Tables Created

| Table | Entity | Replaces JSON File |
|-------|--------|-------------------|
| `roles` | Role | — (new) |
| `users` | User | `registrations.json` |
| `admins` | Admin | env-based mock admin |
| `refresh_tokens` | RefreshToken | `admin-refresh-tokens.json` |
| `notifications` | Notification | `admin-notifications.json` |
| `blog_posts` | BlogPost | `blog-posts.json` |
| `assessments` | Assessment | `admin-evaluations.json` |
| `contact_messages` | ContactMessage | `admin-messages.json` |
| `chat_rooms` | ChatRoom | `chat-rooms.json` |
| `chat_messages` | ChatMessage | `chat-messages.json` |
| `founder_submissions` | FounderSubmission | `founder-submissions.json` |
| `site_content` | SiteContent | `site-content.json` |
| `push_tokens` | PushToken | `admin-push-tokens.json` |
| `audit_logs` | AuditLog | — (new) |

**Note:** `evaluations.json` was orphaned (never used by server) — not migrated.

---

## APIs Updated

All endpoints preserve the same paths and response shapes. Storage backend changed from JSON files to Prisma/PostgreSQL.

### Public APIs (unchanged contracts)
- `GET /api/health`
- `GET /api/blogs`
- `GET /api/evaluations`
- `POST /api/registrations`
- `GET/POST /api/site-content/*`
- `POST /api/contact`
- `POST /api/founder-onboarding`
- `GET /api/chat/rooms/:roomId/messages`
- `POST /api/chat/uploads`
- `POST /backend/registrations`
- `GET/PUT /backend/site-content`

### Admin APIs (now JWT-protected)
- All `/api/admin/*` routes require `Authorization: Bearer <accessToken>`
- `POST /api/admin/auth/login` — bcrypt password verify against DB admin
- `POST /api/admin/auth/refresh` — token rotation (returns new access + refresh)
- `POST /api/admin/auth/logout` — revokes refresh token
- Dashboard, blogs, CMS, registrations, messages, notifications, evaluations, chat — same response formats

### Socket.IO
- Admin connections require valid JWT (`accessToken` in handshake auth)
- Legacy `ADMIN_TOKEN` still supported as fallback

---

## Security Enhancements

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcrypt (12 rounds) in seed + login |
| Access token | JWT, 15 min TTL |
| Refresh token | JWT, 30 days, stored in DB, rotated on refresh |
| RBAC | `Role` model linked to `Admin` |
| Audit logging | `audit_logs` table — login, logout, CRUD actions |
| Input validation | Zod on login, push tokens, socket messages |
| Helmet | Security headers |
| CORS | Credentials enabled |
| Rate limiting | 120 req/min global, 20 login attempts / 15 min |

---

## Breaking Changes

| Change | Impact | Mitigation |
|--------|--------|------------|
| **Admin panel requires login** | Previously open (`requireAdmin` was no-op) | Use `ADMIN_USERNAME` + `ADMIN_PASSWORD` after seed |
| **PostgreSQL required** | Server won't persist data without DB | Set `DATABASE_URL`, run `npm run db:setup` |
| **Refresh token rotation** | `/api/admin/auth/refresh` now also returns `refreshToken` | Backward compatible — old clients using only `accessToken` still work |
| **Admin API 401 without token** | `adminFetch` must send JWT | Updated in `app/utils/adminAuth.js` |

### Non-breaking
- All public form submissions work without auth
- API response field names preserved (`created_at`, `full_name`, etc.)
- File uploads still go to `uploads/` directory
- JSON files in `data/` are kept as backup — seed imports them once

---

## Setup Instructions

```bash
# 1. Configure environment
cp .env.example .env.local
# Edit DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, JWT secrets

# 2. Create database & run migrations + seed
npm run db:setup

# 3. Start development
npm run dev
```

Admin login: use `ADMIN_USERNAME` (or `ADMIN_EMAIL`) and `ADMIN_PASSWORD` from `.env.local`.

---

## Architecture Diagram

```
Client (Vite/React)
    │
    ├── REST API ──► server/routes ──► controllers ──► services ──► repositories ──► Prisma ──► PostgreSQL
    │
    └── Socket.IO ──► server/socket.js ──► chat.service ──► repositories ──► Prisma
```

---

## Verification Checklist

- [x] Prisma schema with all required entities
- [x] JSON storage replaced with database operations
- [x] JWT access + refresh tokens with rotation
- [x] bcrypt password hashing
- [x] Real `requireAdmin` middleware (no mock bypass)
- [x] RBAC via Role model
- [x] Audit logging
- [x] Zod validation
- [x] Helmet, CORS, rate limiting
- [x] Migration SQL files
- [x] Seed file with first admin + JSON import
- [x] API contracts preserved
- [x] Frontend routes unchanged

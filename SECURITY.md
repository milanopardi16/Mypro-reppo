# Security Policy

## Reporting vulnerabilities

Email security issues privately to your operations contact. Do not open public issues for undisclosed vulnerabilities.

## Environment variables

| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `DATABASE_URL` | Yes | Server, Prisma | PostgreSQL connection string. Never commit. |
| `JWT_ACCESS_SECRET` | Yes | Server | Min 32 chars. Signs admin access tokens (15m TTL). |
| `JWT_REFRESH_SECRET` | Yes | Server | Min 32 chars. Signs refresh tokens (30d TTL). |
| `NODE_ENV` | No | Server | `development` \| `production` \| `test`. Default `development`. |
| `REG_SERVER_PORT` / `PORT` | No | Server | API listen port (default `4001`). |
| `CORS_ORIGINS` | Prod recommended | Server | Comma-separated allowed origins for CORS and Socket.IO. |
| `ADMIN_EMAIL` | No | Seed | Admin email for `prisma db seed`. |
| `ADMIN_USERNAME` | No | Server | Login alias mapped to `ADMIN_EMAIL`. |
| `ADMIN_PASSWORD` | No | Seed, tests | Initial admin password (seed only). |
| `ADMIN_TOKEN` | No | Socket.IO | Legacy admin socket auth. **Disabled in production.** Prefer JWT. |
| `SERVE_STATIC` | No | Server | `true` to serve `dist/` from Express. |
| `FIREBASE_PROJECT_ID` | No | Server | FCM push (optional). |
| `FIREBASE_CLIENT_EMAIL` | No | Server | FCM service account email. |
| `FIREBASE_PRIVATE_KEY` | No | Server | FCM private key (escape newlines as `\n`). |
| `NEXT_PUBLIC_SITE_URL` | No | Client build | Public site URL; also used as CORS fallback. |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Client | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Client | Supabase anon key (public). |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server | Supabase service role — **server only**. |

Copy `.env.example` → `.env` and `.env.local.example` → `.env.local`. Both are gitignored except the `*.example` templates.

## Runtime validation

`server/config/env.js` validates required variables at API startup using Zod. Invalid configuration exits the process before accepting traffic.

Run standalone validation:

```bash
npm run validate:env
```

## Authentication

- **HTTP admin API:** JWT Bearer (`Authorization: Bearer <accessToken>`) or cookie `accessToken`.
- **Socket.IO admin:** JWT in `handshake.auth.accessToken`. Legacy `ADMIN_TOKEN` is **rejected when `NODE_ENV=production`**.
- **Socket.IO user:** `handshake.auth.role=user` and `userId` (room access is application-level).

## API security controls

| Control | Implementation |
|---------|----------------|
| Rate limiting | 120 req/min global; 20 login attempts / 15 min |
| Input validation | Zod schemas on registrations, contact, founder onboarding, blog, evaluations query |
| File uploads | 10 MB limit, extension allowlist |
| Helmet | Security headers (CORS resource policy relaxed for uploads) |
| Audit logging | Admin mutations logged to `audit_logs` table |
| Public PII | Evaluations endpoint requires email/phone/fullName filter |

## CORS

In **production**, when `CORS_ORIGINS` or `NEXT_PUBLIC_SITE_URL` is set, only listed origins are allowed. In development, all origins are reflected for local Vite proxy compatibility.

```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Secrets hygiene

1. Rotate credentials if `.env` or `.env.local` were ever committed or shared.
2. Use unique 32+ character JWT secrets per environment.
3. Do not hardcode passwords in scripts or source (see `scripts/test-admin-auth.mjs`).
4. Keep `uploads/` and `data/` out of version control when they contain PII.
5. Unset `ADMIN_TOKEN` in production unless legacy clients require it (JWT preferred).

## Production checklist

- [ ] Strong `ADMIN_PASSWORD` and rotated JWT secrets
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGINS` set to production domain(s)
- [ ] `ADMIN_TOKEN` unset in production
- [ ] TLS termination at reverse proxy
- [ ] Database SSL (`sslmode=require` in `DATABASE_URL`)
- [ ] Rate limits enabled (default: 120 req/min global, 20 login/15min)
- [ ] File upload limits (10 MB, extension allowlist)
- [ ] Run `npm run validate` before deploy

## Related documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) — deployment procedures
- [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md) — readiness score and blockers
- [CHANGELOG.md](./CHANGELOG.md) — security-related changes

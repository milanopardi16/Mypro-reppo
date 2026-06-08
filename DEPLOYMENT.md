# Deployment Guide

Production deployment guide for Capital Network (Vite + React + Express + PostgreSQL).

## Prerequisites

- Node.js 20+ (18 minimum per `package.json`)
- PostgreSQL 16+
- TLS reverse proxy (nginx, Caddy, or cloud load balancer)
- Secrets manager or secure env injection (never commit `.env`)

## Environment variables

Copy templates and fill values:

```bash
cp .env.example .env
cp .env.local.example .env.local   # optional local overrides
```

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | PostgreSQL connection string; use `sslmode=require` in production |
| `JWT_ACCESS_SECRET` | Yes | Min 32 characters |
| `JWT_REFRESH_SECRET` | Yes | Min 32 characters |
| `NODE_ENV` | Yes (prod) | Set to `production` |
| `SERVE_STATIC` | Yes (prod) | `true` to serve Vite build from Express |
| `CORS_ORIGINS` | Recommended | Comma-separated production origins |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site URL (also used for CORS fallback) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed only | First admin account via `prisma db seed` |
| `REG_SERVER_PORT` | No | Default `4001` |

See [SECURITY.md](./SECURITY.md) for the full variable reference.

## Pre-deploy validation

Run the full validation suite:

```bash
npm ci
npm run validate
```

Individual checks:

```bash
npm run validate:env          # Zod env validation
npm run validate:prisma       # prisma validate
npm run validate:migrations   # schema ↔ migration alignment
npm run db:validate-seed      # seed model references
npm run lint
npm run build
```

Database setup:

```bash
npx prisma migrate deploy
npx prisma db seed            # first deploy only
node scripts/test-admin-auth.mjs
```

Health checks:

```bash
curl http://localhost:4001/api/health
curl http://localhost:4001/api/ready
curl http://localhost:4001/api/version
```

## Docker deployment

```bash
docker compose up -d db
docker compose run --rm api npx prisma migrate deploy
docker compose up -d api
```

The API container:

- Exposes port `4001`
- Healthcheck: `GET /api/health`
- Readiness: `GET /api/ready` (used by docker-compose)

Or use the bundled script inside the container:

```bash
sh scripts/start-production.sh
```

## Manual Node deployment

```bash
npm ci
npm run build
export NODE_ENV=production
export SERVE_STATIC=true
npx prisma migrate deploy
npm run start:prod
```

Use a process manager (systemd, PM2) to restart on failure and forward `SIGTERM` for graceful shutdown.

## Reverse proxy (nginx example)

```nginx
server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:4001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Socket.IO requires WebSocket upgrade headers (shown above).

## Persistent storage

Mount a volume for user uploads:

```
./uploads → /app/uploads
```

## Post-deploy checklist

- [ ] `/api/health` returns 200
- [ ] `/api/ready` returns 200 (database connected)
- [ ] Admin login works
- [ ] Socket.IO admin chat connects with JWT
- [ ] CORS restricted to production domain
- [ ] Secrets rotated (not defaults from `.env.example`)
- [ ] Backups scheduled (see `docs/BACKUP_STRATEGY.md`)
- [ ] Monitor JSON logs for `http_request`, `socket_*`, `shutdown_*` events

## Rollback

See `docs/ROLLBACK_CHECKLIST.md` for database and application rollback procedures.

## Related docs

- `docs/DEPLOYMENT_CHECKLIST.md` — quick checklist
- `docs/BACKUP_STRATEGY.md` — database backups
- `docs/MIGRATION_HEALTH_REPORT.md` — migration status
- `PRODUCTION_READINESS_REPORT.md` — readiness score and blockers

# Deployment Checklist

## Pre-deploy

- [ ] Rotate `DATABASE_URL`, `JWT_*`, `ADMIN_PASSWORD`, `ADMIN_TOKEN` (if used)
- [ ] Copy `.env.example` → production secrets store (not git)
- [ ] `npm ci && npm run build`
- [ ] `npx prisma migrate deploy`
- [ ] Optional: `RUN_SEED=true` only on first deploy
- [ ] `node scripts/test-admin-auth.mjs` against staging API
- [ ] `curl /api/health`, `/api/ready`, `/api/version`

## Deploy

- [ ] Build Docker image or deploy Node 20+ runtime
- [ ] Set `NODE_ENV=production`, `SERVE_STATIC=true`
- [ ] Mount persistent volume for `uploads/`
- [ ] Configure TLS reverse proxy (nginx/Caddy)
- [ ] Restrict CORS to production origin
- [ ] Disable public `/api/evaluations` and site-content mutation (code change)

## Post-deploy

- [ ] Verify healthcheck passes (Docker / load balancer)
- [ ] Smoke test admin login + dashboard
- [ ] Verify Socket.IO admin chat connect
- [ ] Monitor logs (JSON `http_request`, `socket_*` events)
- [ ] Confirm backups scheduled (see `BACKUP_STRATEGY.md`)

## Docker quick start

```bash
docker compose up -d db
docker compose run --rm api npx prisma migrate deploy
docker compose up -d api
```

Or: `sh scripts/start-production.sh` inside container with env injected.

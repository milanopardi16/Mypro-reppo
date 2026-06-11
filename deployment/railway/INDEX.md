# Railway Deployment Package — File Index

All Railway deployment files live in `deployment/railway/`. The main application code is **not** modified.

## Configuration (required)

| File | Purpose |
|------|---------|
| `railway.json` | Primary Railway Config-as-Code (Nixpacks builder) |
| `railway.toml` | Alternative TOML config (same settings as JSON) |
| `railway-docker.json` | Optional: switch to Docker builder |
| `nixpacks.toml` | Nixpacks build phases (Node 22, Prisma, Vite) |
| `Dockerfile` | Production Docker image (optional builder) |
| `Procfile` | Fallback process definition |
| `env.template` | Environment variables template for Railway Dashboard |

## Scripts

| File | Purpose |
|------|---------|
| `scripts/railway-build.sh` | Full build: install → prisma generate → vite build |
| `scripts/railway-start.sh` | Production start (used by Railway) |
| `scripts/railway-postdeploy.sh` | Manual first-deploy: migrate + seed |
| `scripts/generate-secrets.mjs` | Generate secure secrets for Railway Variables |

## Guides

| File | Purpose |
|------|---------|
| `QUICK_START.md` | راهنمای سریع استقرار (فارسی + English) |
| `GITHUB_SETUP.md` | GitHub upload and Railway connection |
| `RAILWAY_SETUP_GUIDE.md` | Step-by-step Railway setup |
| `ENVIRONMENT_VARIABLES.md` | Full environment reference |
| `RAILWAY_CHECKLIST.md` | Pre/during/post deployment checklist |

## Local testing (optional)

| File | Purpose |
|------|---------|
| `docker-compose.railway.yml` | Local Railway-like stack with PostgreSQL |

## Ignore rules

| File | Purpose |
|------|---------|
| `.gitignore` | Prevents committing local secrets in this folder |
| `.railwayignore` | Suggested build-context exclusions |

## Railway Dashboard settings

1. **Root Directory:** leave empty (repository root `/`)
2. **Config file path:** `/deployment/railway/railway.json`
3. **Add PostgreSQL** plugin and link `DATABASE_URL` / `DIRECT_URL`
4. **Set variables** from `env.template`
5. **Deploy** — build runs automatically

## Health check

```
GET https://<your-domain>/health
→ { "status": "ok" }
```

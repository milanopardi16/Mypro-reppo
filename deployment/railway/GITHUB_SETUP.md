# GitHub Setup for Railway Deployment

This guide explains how to upload the repository to GitHub and connect it to Railway using the files in `deployment/railway/`.

## What gets committed

The deployment package in `deployment/railway/` is safe to commit. It contains **no real secrets** — only templates and configuration.

**Never commit:**

- `.env`, `.env.local`, `.env.production`
- Real passwords or API keys
- `uploads/` with user data

The root `.gitignore` already excludes sensitive files.

---

## Step 1 — Initialize Git (if not done)

```bash
cd /path/to/your/project
git init
git add .
git status
```

Review `git status` and confirm no `.env` files are staged.

---

## Step 2 — First commit

```bash
git commit -m "Add Railway deployment package"
```

---

## Step 3 — Create GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repository (e.g. `capital-network`)
3. Do **not** initialize with README if you already have one locally
4. Copy the remote URL

---

## Step 4 — Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 5 — Connect Railway to GitHub

1. [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo**
3. Authorize Railway if prompted
4. Select your repository and branch (`main`)

---

## Step 6 — Configure Railway service

| Setting | Value |
|---------|-------|
| Root Directory | *(empty — repo root)* |
| Config file path | `/deployment/railway/railway.json` |
| Builder | Nixpacks (default from config) |

For Docker builds, use config path: `/deployment/railway/railway-docker.json`

---

## Step 7 — Environment variables

1. Add PostgreSQL database in Railway
2. Reference database URL in app service variables
3. Copy remaining variables from `env.template`
4. Generate secrets:

```bash
node deployment/railway/scripts/generate-secrets.mjs
```

---

## Step 8 — Deploy and verify

Railway auto-deploys on every push to the connected branch.

```bash
curl https://your-app.up.railway.app/health
```

Expected: `{"status":"ok"}`

---

## Continuous deployment

After initial setup, every `git push` to `main` triggers a new Railway deployment:

```bash
git add deployment/railway/
git commit -m "Update Railway config"
git push
```

---

## File structure reference

```
deployment/railway/
├── railway.json          ← Railway reads this (set path in dashboard)
├── railway.toml          ← Alternative config format
├── railway-docker.json   ← Docker builder variant
├── nixpacks.toml         ← Build phases
├── Dockerfile            ← Docker image definition
├── env.template          ← Variables template
├── Procfile              ← Process definition
├── scripts/
│   ├── railway-build.sh
│   ├── railway-start.sh
│   ├── railway-postdeploy.sh
│   └── generate-secrets.mjs
├── QUICK_START.md
├── GITHUB_SETUP.md       ← This file
└── INDEX.md              ← Full file list
```

The main application (`server/`, `app/`, `prisma/`, etc.) stays at the repository root and is **not** modified by this package.

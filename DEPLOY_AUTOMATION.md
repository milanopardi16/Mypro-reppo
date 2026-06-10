# DEPLOY AUTOMATION

## Overview

This repository includes a production-grade automation flow for pushing code to GitHub and deploying to Railway.

## Usage

1. Ensure you are on the `main` branch.
2. Confirm Railway CLI is installed and authenticated.
3. Run:

```bash
npm run deploy:production
```

## Pre-deploy check

Before deployment, the following files must exist:

- `.env.example`
- `railway.json`
- `Dockerfile`
- `package.json`
- `DEPLOYMENT_READY.md`

The pre-deploy validation runs automatically if you invoke:

```bash
npm run predeploy
```

## What happens during deployment

1. Verify `git` is installed.
2. Verify `railway` CLI is installed.
3. Confirm the current branch is `main`.
4. Run `git add .`.
5. Commit changes with message `Production Ready` if there are staged changes.
6. Push `main` to `origin`.
7. Run `railway up`.
8. Retrieve the Railway project address.
9. Perform a health check on `GET /health`.

## Expected final result

On success, the automation prints:

```text
# =================================
STATUS: PRODUCTION READY
GITHUB: PASS
BUILD: PASS
DEPLOY: PASS
HEALTH CHECK: PASS
```

## Common errors and fixes

### `git` not found

- Install Git from https://git-scm.com/downloads
- Reopen your terminal and retry

### `railway` CLI not found

- Install Railway CLI from https://railway.app/install
- Authenticate with `railway login`

### Not on `main` branch

- Switch to the main branch with:

```bash
git checkout main
```

### No required repo files

- Confirm `.env.example`, `railway.json`, `Dockerfile`, `package.json`, and `DEPLOYMENT_READY.md` exist.
- If any are missing, add them before running `npm run predeploy`

### `railway up` fails

- Check Railway CLI authentication and project settings
- Run `railway status` manually to verify the current project
- Ensure your Railway workspace is configured for production deployment

### Health check returns non-200

- Verify the deployed application is running
- Confirm `/health` is exposed by the app
- Inspect Railway deployment logs for runtime errors

## Troubleshooting

- Run `npm run predeploy` first to validate repository files.
- Ensure `package.json` includes the automation scripts.
- Use `npm run deploy:production` only from the root of the repository.

# Railway Deployment Setup Guide

This guide walks you through deploying the Capital Network repository to Railway.

## 1. Create a Railway Project

1. Open Railway and log in.
2. Click **New Project**.
3. Choose **Deploy from GitHub**.
4. Select the repository for this project.
5. Choose the branch you want to deploy.

## 2. Add PostgreSQL

1. In your Railway project, click **New** > **Add Plugin**.
2. Select **PostgreSQL**.
3. Create a new PostgreSQL database.
4. Wait for Railway to finish provisioning.
5. Copy the generated PostgreSQL connection string.

## 3. Connect GitHub Repository

1. In Railway, connect your GitHub repository if not already connected.
2. Choose the repository branch that contains this project.
3. Railway will detect the project and use `railway.json` if present.

## 4. Configure Environment Variables

Set the following variables in Railway under **Variables**:

- `NODE_ENV=production`
- `DATABASE_URL=<Railway Postgres connection string>?schema=public`
- `DIRECT_URL=<Railway Postgres connection string>`
- `NEXTAUTH_SECRET=<secure random value>`
- `JWT_ACCESS_SECRET=<secure random value>`
- `JWT_REFRESH_SECRET=<secure random value>`
- `ADMIN_EMAIL=<admin email>`
- `ADMIN_PASSWORD=<secure password>`
- `ADMIN_PASSWORD_SALT=<secure random value>`
- `NEXT_PUBLIC_SITE_URL=<your public frontend URL>`

Optional variables:
- `CORS_ORIGINS` (comma-separated allowed origins)
- `SERVE_STATIC=true`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Notes
- `DATABASE_URL` is used by the app at runtime.
- `DIRECT_URL` is used by Prisma migrations.
- If you use the Railway PostgreSQL addon, both values can usually be the same.
- Always keep secrets out of code and commit only placeholder files.

## 5. First Deploy

1. In Railway, choose **Deploy**.
2. Railway will run the build command from `railway.json`: `npm ci && npm run build`.
3. Wait for the build to complete.
4. Confirm that the deployment log shows `server_started` and `database_connected` or `database_connect_deferred`.

## 6. Run Prisma Migration

After the initial deploy completes:

1. Open Railway terminal or use a local connection with the same environment variables.
2. Run:
```bash
npm run db:migrate
```
3. If the environment is fresh, seed the database:
```bash
npm run db:setup
```

## 7. Test Health Endpoint

After deployment, verify the service is live:

```bash
curl https://<your-railway-domain>/health
```

Expected response:

```json
{ "status": "ok" }
```

## 8. Test Login

Confirm admin login works with the seeded credentials.

1. Open the admin login page or use API test tools.
2. Log in using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. Verify you receive a valid token and no login error.

## 9. Test Database

Verify the database is reachable and seeded.

1. Use the health endpoint or Railway database console.
2. Confirm the `admins` table exists.
3. Optionally run a quick Prisma query from a script or inspect data via Railway Postgres panel.

## Troubleshooting

- If `prisma migrate deploy` fails, confirm `DIRECT_URL` points to a valid PostgreSQL database.
- If `npm run start:prod` fails, confirm `NODE_ENV=production` is set in Railway.
- If static files do not serve, set `SERVE_STATIC=true` or ensure the `dist` directory exists after build.

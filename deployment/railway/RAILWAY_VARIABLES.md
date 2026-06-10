# Railway Environment Variables for Capital Network

This document describes every environment variable used by the repository for Railway deployment.

## Required Variables

### `NODE_ENV`
- Required: Yes
- Example: `production`
- Used in: `server/api-server.js`, `server/app.js`, `server/prisma/client.js`, `server/middlewares/error.middleware.js`
- Purpose: Enables production mode, static asset serving, logging filters, and runtime configuration.

### `PORT`
- Required: No (Railway sets this automatically)
- Example: `8000`
- Used in: `server/api-server.js`
- Purpose: Default HTTP listen port fallback when `REG_SERVER_PORT` is not set.

### `REG_SERVER_PORT`
- Required: No
- Example: `4001`
- Used in: `server/api-server.js`, `vite.config.js`, `scripts/test-admin-auth.mjs`, `scripts/production-verify.mjs`
- Purpose: Preferred Express server port for local development and proxy routing.

### `DATABASE_URL`
- Required: Yes
- Example: `postgresql://user:password@host:5432/capital_network?schema=public`
- Used in: `prisma/schema.prisma`, `server/prisma/health.js`, `scripts/wait-for-db.js`, `prisma/seed.js`, `scripts/release.js`
- Purpose: Primary Prisma database connection for runtime queries and health checks.

### `DIRECT_URL`
- Required: Yes
- Example: `postgresql://user:password@host:5432/capital_network`
- Used in: `prisma/schema.prisma`, Prisma migrations
- Purpose: Direct PostgreSQL connection for `prisma migrate deploy` and migration operations.

### `NEXTAUTH_SECRET`
- Required: Yes
- Example: `n8ud7sG3V9qW4hXzPe1rF0cU3jN6kL7a`
- Used in: authentication and session layers
- Purpose: Secret key for signing and verifying NextAuth-style session tokens.

### `JWT_ACCESS_SECRET`
- Required: Yes
- Example: `Bz4dR8fN2jV6sQ7wXyA1mP5zL0uH9eK3`
- Used in: `server/services/auth.service.js`, `server/middlewares/auth.middleware.js`
- Purpose: Signs short-lived JWT access tokens for admin authentication.

### `JWT_REFRESH_SECRET`
- Required: Yes
- Example: `L0kB8dF3qC1xV7zM5nH2sT9yW4aJ0pR6`
- Used in: `server/services/auth.service.js`
- Purpose: Signs long-lived JWT refresh tokens for token renewal.

### `JWT_ISSUER`
- Required: No
- Default: `capital-network-api`
- Example: `capital-network-api`
- Used in: `server/services/auth.service.js`
- Purpose: JWT claim issuer for token validation.

### `JWT_AUDIENCE`
- Required: No
- Default: `capital-network-web`
- Example: `capital-network-web`
- Used in: `server/services/auth.service.js`
- Purpose: JWT claim audience for token validation.

### `ADMIN_EMAIL`
- Required: Yes
- Example: `admin@capitalnetwork.local`
- Used in: `prisma/seed.js`, `server/services/auth.service.js`
- Purpose: Initial admin email for database seed and login fallback.

### `ADMIN_USERNAME`
- Required: No
- Example: `admin`
- Used in: `prisma/seed.js`, `server/services/auth.service.js`
- Purpose: Username fallback for initial admin and login compatibility.

### `ADMIN_PASSWORD`
- Required: Yes
- Example: `ChangeMeBeforeProduction1!`
- Used in: `prisma/seed.js`
- Purpose: Initial admin password during database seed.

### `ADMIN_PASSWORD_SALT`
- Required: Yes
- Example: `8d4c9fbd3a03425584e1b3c8a9f0d1e2d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0`
- Used in: `prisma/seed.js`, `scripts/hash-password.js`
- Purpose: Password hashing salt used by admin seed and credential generation.

### `NEXT_PUBLIC_SITE_URL`
- Required: Yes in production
- Example: `https://app.capitalnetwork.com`
- Used in: `vite.config.js`, `server/config/cors.js`, client code
- Purpose: Public frontend URL used for CORS allowlist and redirects.

## Optional Variables

### `CORS_ORIGINS`
- Required: No
- Example: `https://app.capitalnetwork.com,https://admin.capitalnetwork.com`
- Used in: `server/config/cors.js`
- Purpose: Custom CORS whitelist for API access in production.

### `SERVE_STATIC`
- Required: No
- Example: `true`
- Used in: `server/app.js`
- Purpose: Forces Express to serve static files from the Vite build output.

### `ADMIN_TOKEN`
- Required: No
- Example: `some-admin-socket-token`
- Used in: `server/middlewares/auth.middleware.js`
- Purpose: Legacy socket admin token; should remain empty in production.

### `FIREBASE_PROJECT_ID`
- Required: No
- Example: `my-firebase-project`
- Used in: `server/utils/firebase.js`
- Purpose: Optional Firebase Cloud Messaging project ID.

### `FIREBASE_CLIENT_EMAIL`
- Required: No
- Example: `firebase-adminsdk@my-firebase-project.iam.gserviceaccount.com`
- Used in: `server/utils/firebase.js`
- Purpose: Optional Firebase service account email.

### `FIREBASE_PRIVATE_KEY`
- Required: No
- Example: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----`
- Used in: `server/utils/firebase.js`
- Purpose: Optional Firebase service account private key.

### `NEXT_PUBLIC_SUPABASE_URL`
- Required: No
- Example: `https://your-project-ref.supabase.co`
- Used in: client-side Supabase integration
- Purpose: Optional Supabase public API URL.

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Required: No
- Example: `your-anon-key`
- Used in: client-side Supabase integration
- Purpose: Optional Supabase anonymous key.

### `SUPABASE_SERVICE_ROLE_KEY`
- Required: No
- Example: `your-service-role-key`
- Used in: server-side Supabase integrations
- Purpose: Optional Supabase service role key. Do not expose in browser.

### `API_URL`
- Required: No
- Example: `https://api.capitalnetwork.com`
- Used in: `scripts/test-admin-auth.mjs`, `scripts/production-verify.mjs`
- Purpose: Optional API endpoint override for verification scripts and local integration tests.

## Railway Notes

- Railway will typically set `PORT` automatically during runtime.
- `REG_SERVER_PORT` is used by the Vite dev proxy and by local verification scripts.
- `DATABASE_URL` and `DIRECT_URL` must both be set for Prisma migrations on Railway.
- Do not commit actual secret values; keep them in Railway project variables only.

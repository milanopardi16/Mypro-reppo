# Capital Network

A production-ready Vite + React frontend with an Express API and Prisma-backed PostgreSQL database.

## Project overview

- Frontend: Vite + React
- Backend: Express API server
- ORM: Prisma
- Auth: JWT-based admin authentication
- Runtime config: environment variables loaded from `.env.local` and `.env`

## Prerequisites

- Node.js 18 or newer
- npm (compatible with `package-lock.json`)
- PostgreSQL database for `DATABASE_URL`

## Installation

```bash
npm install
```

## Environment setup

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Update `.env.local` with your local database, secrets, and admin values.
3. Keep `.env` and `.env.local` out of source control.

## Available scripts

- `npm run dev` — run Express API and Vite frontend concurrently
- `npm run dev:api` — run only the API server
- `npm run build` — build the frontend for production
- `npm run preview` — preview the built frontend
- `npm run start:prod` — start the production server
- `npm run lint` — run ESLint
- `npm run db:generate` — generate Prisma client
- `npm run db:migrate` — deploy Prisma migrations
- `npm run db:migrate:dev` — run Prisma migrations in development
- `npm run db:seed` — seed the database
- `npm run validate` — run env, Prisma, migrations, seed validation, lint, and build

## Build and run

```bash
npm run build
npm run start:prod
```

The production server reads environment variables and serves the frontend from the built assets.

## Required environment variables

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ADMIN_PASSWORD_SALT`

Optional variables include `NEXT_PUBLIC_SITE_URL`, `REG_SERVER_PORT`, `ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_TOKEN`, `JWT_ISSUER`, `JWT_AUDIENCE`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

## Deployment

1. Ensure production environment variables are configured securely.
2. Build the frontend with `npm run build`.
3. Start the server with `npm run start:prod`.
4. Use a process manager or container platform for production.

## GitHub preparation

- `.env` and `.env.local` are excluded by `.gitignore`.
- `node_modules`, build artifacts, and runtime logs are excluded.

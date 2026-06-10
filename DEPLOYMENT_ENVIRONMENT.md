# Deployment Environment Configuration

## Required environment variables

This project requires the following environment variables to run securely in production.

- `DATABASE_URL` — PostgreSQL connection string used by Prisma and runtime processes.
- `DIRECT_URL` — PostgreSQL connection string required by server environment validation.
- `JWT_ACCESS_SECRET` — JWT access token signing secret.
- `JWT_REFRESH_SECRET` — JWT refresh token signing secret.
- `NEXTAUTH_SECRET` — NextAuth session encryption secret.
- `ADMIN_EMAIL` — admin account email used for seed and login.
- `ADMIN_PASSWORD` — initial admin password used by database seed.
- `ADMIN_PASSWORD_SALT` — cryptographic salt for password hashing.

## PostgreSQL and Railway compatibility

### Recommended connection format

Use PostgreSQL connection strings in the following format:

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

For Railway Postgres, use the connection string Railway provides and ensure `schema=public` is included. If Railway's generated string already includes `sslmode=require`, keep it.

### Example

```text
DATABASE_URL=postgresql://db_admin:StrongDbPassword123@HOST:PORT/DATABASE?schema=public
DIRECT_URL=postgresql://db_admin:StrongDbPassword123@HOST:PORT/DATABASE?schema=public
```

## DIRECT_URL usage

`DIRECT_URL` is not referenced directly in `prisma/schema.prisma`, but it is required by `server/config/env.js` for application environment validation.

- `DATABASE_URL` is consumed by Prisma and runtime database initialization.
- `DIRECT_URL` is validated by the application configuration and should follow the same PostgreSQL format.

In this repository, setting `DIRECT_URL` to the same PostgreSQL connection string as `DATABASE_URL` is appropriate for production.

## JWT secret requirements

- `JWT_ACCESS_SECRET`: 64+ characters, cryptographically random, URL-safe.
- `JWT_REFRESH_SECRET`: 64+ characters, cryptographically random, URL-safe.
- `NEXTAUTH_SECRET`: 64+ characters, compatible with NextAuth and production-ready.

## Admin credentials

- `ADMIN_EMAIL`: used by the admin seed and login flow.
  - Example: `admin@example.com`
  - Replace with your production administrator email.

- `ADMIN_PASSWORD`: strong initial password for admin seed.
  - Minimum 24 characters.
  - Must include uppercase, lowercase, numbers, and special characters.

- `ADMIN_PASSWORD_SALT`: cryptographically random salt.
  - Minimum 32 characters.
  - Must be unique and secret.

## Railway deployment instructions

1. Open your Railway project.
2. Add a PostgreSQL service and note its connection string.
3. In Railway environment variables, add:

```text
NODE_ENV=production
PORT=4001
DATABASE_URL=<Railway Postgres connection string>
DIRECT_URL=<Railway Postgres connection string>
NEXTAUTH_SECRET=-KfiqMpcx5Y9PQFRKZqaco3Z52O5lXMl0khSDYxNWXVwP-elokTn0sY2NO_oRrRkSyLgX0mFIQV6InT9ooypNw
JWT_ACCESS_SECRET=E6c9ZFB9RjsZV3qv0K9ed02TdAZ6NkHBT_6v6a4uNMLgl9jBXshy1XOQg6yDnNBueA0LvCBeHcB1QRH_rr1uag
JWT_REFRESH_SECRET=MJXS3Ojimbgz__1HlbgzoY8ZBgwojJ8_I9m9ADb8jsA1hHbOit-52U5suVyBS6-vS_KDesLHoHeOJu6QS-r-gA
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=[81}@8zKp{3TLaRV0OB)zrcy
ADMIN_PASSWORD_SALT=atcTDhThLWgGIJQ8yo4kDuc6R4ytCPRxa-kvP7MEE4WtQxGgYfEVHSBO3yZHAV9y
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
CORS_ORIGINS=https://your-production-domain.com
```

4. Save the Railway environment variables as secret values.
5. Deploy the project and verify:
   - `/api/health` responds successfully
   - `/api/ready` responds successfully
   - `/api/admin/auth/login` can authenticate with `ADMIN_EMAIL` and `ADMIN_PASSWORD`

## Notes

- Do not commit these values to source control.
- Replace every generated secret before using in a real production environment.
- Use a secrets manager or Railway secret storage for long-term secret storage.

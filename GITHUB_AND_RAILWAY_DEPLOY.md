# GitHub and Railway Deploy

## Git Commands

```bash
git add .
git commit -m "Production Ready"
git push origin main
```

## Railway Deployment Steps

1. Open Railway and create a new project.
2. Choose **Deploy from GitHub**.
3. Connect your GitHub account if not already connected.
4. Select the repository for this project.
5. Choose the `main` branch.
6. Confirm the repository and branch.

## Railway Build Configuration

- Build Command: `npm ci --include=dev && npm run build`
- Start Command: `npm run start:prod`
- Health Check Path: `/health`
- Port: Railway provides `PORT` automatically.
- Node Version: `>=18`

## Railway Environment Variables

Set the following variables in Railway project settings:

```bash
NODE_ENV=production
PORT=4001
REG_SERVER_PORT=4001
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
DIRECT_URL=postgresql://user:password@host:5432/dbname?schema=public
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_MIN_32_CHARS
JWT_ACCESS_SECRET=YOUR_GENERATED_SECRET_MIN_32_CHARS
JWT_REFRESH_SECRET=YOUR_GENERATED_SECRET_MIN_32_CHARS
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=STRONG_PASSWORD_MIN_8_CHARS_CHANGE_IMMEDIATELY
ADMIN_PASSWORD_SALT=YOUR_GENERATED_SALT_MIN_32_CHARS
```

## Post-Deployment Checklist

- Verify Railway deployment build succeeds.
- Verify the service starts and `/health` returns HTTP 200.
- Confirm environment variables are set correctly.
- Ensure `DATABASE_URL` and `DIRECT_URL` point to the same PostgreSQL database.
- Validate that `NEXTAUTH_SECRET`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` are secure.
- Confirm `ADMIN_PASSWORD` is changed immediately after first login.
- Monitor logs for startup errors and database connectivity.

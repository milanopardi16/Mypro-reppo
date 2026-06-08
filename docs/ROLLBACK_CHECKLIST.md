# Rollback Checklist

## Application rollback

1. Note failing release tag/commit.
2. Deploy previous container image or git checkout of last known-good build.
3. Set `NODE_ENV=production` and prior env secret versions (JWT rotation invalidates sessions — expect re-login).
4. Run `curl https://<host>/api/ready` — expect `200` and `database: up`.
5. Verify admin login and critical user flows (register, contact, chat).

## Database rollback

Prisma does not auto-downgrade. Options:

- **Preferred:** Restore PostgreSQL snapshot from before migration (see `BACKUP_STRATEGY.md`).
- **Emergency:** Manually reverse migration SQL only if snapshot unavailable (high risk).

## Do not

- Run `prisma migrate reset` in production.
- Force-push deployment secrets into git.

## Communication

- Record incident time, affected endpoints, rollback commit/image digest.
- Rotate JWT secrets if breach suspected during failed deploy.

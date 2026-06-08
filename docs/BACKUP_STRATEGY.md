# Backup Strategy

## PostgreSQL (primary)

| Method | Frequency | Retention |
|--------|-----------|-----------|
| Managed provider snapshots (Neon/Supabase/RDS) | Daily | 7–30 days per provider plan |
| `pg_dump` custom format | Daily off-peak | 14 days minimum |

Example:

```bash
pg_dump "$DATABASE_URL" -Fc -f "backup-$(date +%Y%m%d).dump"
```

Store encrypted at rest (S3, Azure Blob, etc.) with IAM-restricted access.

## Uploads volume

- Sync `uploads/` to object storage daily.
- Include in disaster recovery runbook with DB restore order: **DB first**, then uploads.

## Configuration secrets

- Backup env secrets in team vault (1Password, Vault, Doppler) — not in git.
- Document rotation dates in `SECURITY.md` change log.

## Recovery test

Quarterly: restore dump to staging, run `prisma migrate deploy`, `npm run build`, smoke test `/api/ready`.

## RPO / RTO targets (suggested)

- RPO: 24 hours (daily backups)
- RTO: 4 hours (manual restore + redeploy)

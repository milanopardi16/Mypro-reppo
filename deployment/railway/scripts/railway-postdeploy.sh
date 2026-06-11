#!/usr/bin/env sh
# Run once after first Railway deploy (via Railway CLI or dashboard shell)
set -eu

echo "[railway:postdeploy] Waiting for database..."
node scripts/wait-for-db.js

echo "[railway:postdeploy] Applying migrations..."
npx prisma migrate deploy

echo "[railway:postdeploy] Seeding database (first deploy)..."
npx prisma db seed

echo "[railway:postdeploy] Done. Verify: curl https://<your-domain>/health"

#!/usr/bin/env sh
set -eu

echo "[prod] Applying database migrations..."
npx prisma migrate deploy

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[prod] Seeding database..."
  npx prisma db seed
fi

echo "[prod] Starting API server..."
export NODE_ENV=production
export SERVE_STATIC="${SERVE_STATIC:-true}"
exec node server/api-server.js

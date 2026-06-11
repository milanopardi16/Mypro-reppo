#!/usr/bin/env sh
# Railway production start script — runs from repository root
set -eu

export NODE_ENV="${NODE_ENV:-production}"
export SERVE_STATIC="${SERVE_STATIC:-true}"

# Railway assigns PORT dynamically; Express reads PORT or REG_SERVER_PORT
if [ -n "${PORT:-}" ]; then
  export REG_SERVER_PORT="${REG_SERVER_PORT:-$PORT}"
fi

echo "[railway:start] NODE_ENV=$NODE_ENV"
echo "[railway:start] PORT=${PORT:-unset} REG_SERVER_PORT=${REG_SERVER_PORT:-unset}"
echo "[railway:start] SERVE_STATIC=$SERVE_STATIC"

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[railway:start] RUN_SEED=true — seeding database..."
  npx prisma db seed || echo "[railway:start] Seed skipped or already applied."
fi

echo "[railway:start] Starting API server..."
exec node server/api-server.js

#!/usr/bin/env sh
# Railway build script — runs from repository root
set -eu

echo "[railway:build] Installing dependencies..."
npm ci --include=dev

echo "[railway:build] Generating Prisma client..."
npx prisma generate

echo "[railway:build] Building frontend..."
npm run build

echo "[railway:build] Build completed successfully."

#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../app"

echo "Installing dependencies for Prisma deployment..."
npm ci --omit=dev

echo "Generating Prisma client..."
npm run db:generate

echo "Deploying Prisma migrations..."
npm run db:migrate

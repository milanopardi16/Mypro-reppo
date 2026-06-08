#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../app"

export NODE_ENV=production
export PORT=${PORT:-4001}

exec npm run start:prod

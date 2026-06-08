#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../app"

HOST=${HOST:-127.0.0.1}
PORT=${PORT:-4001}
URL="http://$HOST:$PORT/api/health"

echo "Checking service health at $URL"
if curl -fsS "$URL" >/dev/null; then
  echo "Health check passed"
  exit 0
fi

echo "Health check failed"
exit 1

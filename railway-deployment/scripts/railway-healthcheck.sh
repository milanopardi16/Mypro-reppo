#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../app"

HOST=${HOST:-127.0.0.1}
PORT=${PORT:-4001}

echo "Railway health check: HTTP and readiness endpoints"

if curl -fsS "http://$HOST:$PORT/api/health" >/dev/null; then
  echo "HTTP health endpoint OK"
else
  echo "HTTP health endpoint failed"
  exit 1
fi

if curl -fsS "http://$HOST:$PORT/api/ready" >/dev/null; then
  echo "Readiness endpoint OK"
else
  echo "Readiness endpoint failed"
  exit 1
fi

echo "Railway health checks passed"

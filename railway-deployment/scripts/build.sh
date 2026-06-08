#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../app"

echo "Installing production dependencies..."
npm ci --omit=dev

echo "Building the Vite application..."
npm run build

echo "Build completed successfully."

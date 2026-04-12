#!/usr/bin/env bash
# Build and run this UI image locally (Docker only). The API base URL must be reachable from the browser.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
API_URL="${VITE_API_BASE_URL:-http://127.0.0.1:8080}"
IMAGE="${IMAGE_NAME:-system-frontend:local}"
docker build -t "$IMAGE" --build-arg "VITE_API_BASE_URL=$API_URL" .
exec docker run --rm -p 3000:3000 "$IMAGE"

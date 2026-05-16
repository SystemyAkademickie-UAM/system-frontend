#!/usr/bin/env bash
# Build and run this UI image locally (Docker only).
# Default build matches production: no VITE_API_BASE_URL; nginx proxies /api/ to the API on the host (port 8080).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
IMAGE="${IMAGE_NAME:-system-frontend:local}"
BUILD_ARGS=()
if [[ -n "${VITE_API_BASE_URL:-}" ]]; then
  BUILD_ARGS+=(--build-arg "VITE_API_BASE_URL=${VITE_API_BASE_URL}")
fi
docker build -t "$IMAGE" "${BUILD_ARGS[@]}" .
exec docker run --rm -p 3000:3000 --add-host "host.docker.internal:host-gateway" "$IMAGE"

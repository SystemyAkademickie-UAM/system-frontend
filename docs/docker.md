# Docker (frontend)

This document covers **only** the static UI image defined in this repository’s `Dockerfile`. Nginx serves built assets; the API is **not** part of this image.

## Build and run

Pick a base URL the user’s **browser** can use to reach the API, then build with `VITE_API_BASE_URL` (no trailing slash). Example when the API listens on the host at port 8080:

```bash
docker build -t system-frontend:local --build-arg VITE_API_BASE_URL=http://127.0.0.1:8080 .
docker run --rm -p 3000:3000 system-frontend:local
```

Open `http://127.0.0.1:3000`.

The container listens on **3000** inside the image (`docker/nginx/default.conf`), so map host port **3000** → container **3000** (for example `-p 127.0.0.1:3000:3000` on a Debian host where nginx uses `proxy_pass http://localhost:3000` for `/`).

### Same host as nginx (`/` + `/api/`)

If nginx terminates HTTP(S) and routes `/` to this service and `/api/` to the API on **8080**, build with an **empty** base URL so the browser calls `/api/...` on the same site:

```bash
docker build -t system-frontend:prod --build-arg VITE_API_BASE_URL= .
docker run -d -p 127.0.0.1:3000:3000 --name ui system-frontend:prod
```

## Helper scripts (Docker CLI only)

From the repository root:

| Platform   | Command |
| ---------- | ------- |
| Linux/macOS | `./scripts/docker-local.sh` |
| Windows (PowerShell) | `.\scripts\docker-local.ps1` |

Defaults use `VITE_API_BASE_URL=http://127.0.0.1:8080` and image tag `system-frontend:local` unless you override `VITE_API_BASE_URL` or `IMAGE_NAME`.

## CI image

`.github/workflows/docker-image.yml` builds and pushes this Dockerfile (for example to GHCR). Pass the correct `VITE_API_BASE_URL` (or build-arg) for the environment where the UI will run.

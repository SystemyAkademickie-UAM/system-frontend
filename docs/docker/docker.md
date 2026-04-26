# Docker (frontend)

This document covers **only** the static UI image defined in this repository’s `Dockerfile`. Nginx serves built assets; the API is **not** part of this image.

## Build and run

Pick a base URL the user’s **browser** can use to reach the API (including the `/api` prefix), then build with `VITE_API_BASE_URL` (no trailing slash). Example when the API is at `http://127.0.0.1:8080/api`:

```bash
docker build -t system-frontend:local --build-arg VITE_API_BASE_URL=http://127.0.0.1:8080/api .
docker run --rm -p 3000:3000 system-frontend:local
```

Open `http://127.0.0.1:3000`.

The container listens on **3000** inside the image (`docker/nginx/default.conf`), so map host port **3000** → container **3000** (for example `-p 127.0.0.1:3000:3000` on a Debian host where nginx uses `proxy_pass http://localhost:3000` for `/`).

### Same host as nginx (`/` + `/api/`)

If the public site is `https://example.org` and nginx proxies `/api/` to the backend, build with the full API base the browser will use:

```bash
docker build -t system-frontend:prod --build-arg VITE_API_BASE_URL=https://example.org/api .
docker run -d -p 127.0.0.1:3000:3000 --name ui system-frontend:prod
```

## Helper scripts (Docker CLI only)

From this service directory (`system-frontend`, where this `docs/` folder lives next to `scripts/`):

| Platform   | Command |
| ---------- | ------- |
| Linux/macOS | `./scripts/docker-local.sh` |
| Windows (PowerShell) | `.\scripts\docker-local.ps1` |

Defaults use `VITE_API_BASE_URL=http://127.0.0.1:8080/api` and image tag `system-frontend:local` unless you override `VITE_API_BASE_URL` or `IMAGE_NAME`.

## CI image

- `.github/workflows/docker-build.yml` — builds this Dockerfile on `push` to `main` (verification only).
- `.github/workflows/docker-publish.yml` — builds and pushes on `push` to `production` (for example to GHCR). Pass the correct `VITE_API_BASE_URL` (or GitHub `vars`) for the environment where the UI will run.

The build stage uses **Node.js 24.14.1** (Alpine) and **npm 11.11.0**, matching [prerequisites.md](../first-setup/prerequisites.md).

## Two-service dev stack (with the API repo)

If you clone **system-frontend** next to **system-backend**, run both images from the backend directory: **`../system-backend/docker-compose.dev.yml`** (see **`../system-backend/docs/docker/docker.md`** — *Developer compose*).

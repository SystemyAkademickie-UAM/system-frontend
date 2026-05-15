# Docker (frontend)

This document covers **only** the static UI image defined in this repository’s `Dockerfile`. Nginx serves built assets and **proxies `/api/`** to the backend so the browser stays on one origin (same pattern as production behind a shared host).

## Build and run

### Default (recommended local): same-origin `/api`

Do **not** set `VITE_API_BASE_URL`. The SPA uses `window.location.origin + '/api'`. The UI container’s nginx forwards `/api/` to **`http://host.docker.internal:8080/api/`** (Nest on the Docker host, published port **8080**).

```bash
docker compose up --build
# or
docker build -t system-frontend:local .
docker run --rm -p 3000:3000 --add-host host.docker.internal:host-gateway system-frontend:local
```

Open `http://127.0.0.1:3000` or `http://localhost:3000` consistently with your backend `CORS_ORIGIN` / cookie expectations.

`docker compose` in this repo adds `extra_hosts` for `host.docker.internal`; plain `docker run` on Linux needs `--add-host host.docker.internal:host-gateway`.

### Optional: split-origin build (`VITE_API_BASE_URL`)

Only if the browser must call the API on another absolute URL (different host/port). Known trade-offs: `SameSite=Lax` session cookies and CORS.

```bash
docker build -t system-frontend:local --build-arg VITE_API_BASE_URL=http://127.0.0.1:8080/api .
docker run --rm -p 3000:3000 system-frontend:local
```

### Same host as public nginx (`/` + `/api/`)

If the public site is `https://example.org` and **that** nginx proxies `/api/` to the backend, build with the API base the browser will use:

```bash
docker build -t system-frontend:prod --build-arg VITE_API_BASE_URL=https://example.org/api .
docker run -d -p 127.0.0.1:3000:3000 --name ui system-frontend:prod
```

The container listens on **3000** inside the image (`docker/nginx/default.conf`).

## Helper scripts (Docker CLI only)

From this service directory (`system-frontend`, where this `docs/` folder lives next to `scripts/`):

| Platform   | Command |
| ---------- | ------- |
| Linux/macOS | `./scripts/docker-local.sh` |
| Windows (PowerShell) | `.\scripts\docker-local.ps1` |

Default image tag is `system-frontend:local`. Override with `IMAGE_NAME`. Pass `VITE_API_BASE_URL` only when you need a split-origin build.

## CI image

- `.github/workflows/docker-build.yml` — builds this Dockerfile on `push` to `main` (verification only).
- `.github/workflows/docker-publish.yml` — builds and pushes on `push` to `production` (for example to GHCR). Pass `VITE_API_BASE_URL` only when the deployed UI must call a separate API origin; otherwise leave unset so nginx same-origin `/api/` applies where your ingress mirrors this layout.

The build stage uses **Node.js 24.14.1** (Alpine) and **npm 11.11.0**, matching [prerequisites.md](./prerequisites.md).

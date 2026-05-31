# Development (frontend)

## Stack versions

- **Node.js / npm:** see [prerequisites.md](./prerequisites.md) (local toolchain pin).
- **React:** 19.x
- **Vite:** 6.x

Use `.nvmrc` with nvm / nvm-windows. CI uses Node **24.14.1** (see `.github/workflows/ci.yml`).

## Workflow

1. Point `VITE_API_BASE_URL` (or rely on the dev default) at an API that implements the contract in [api-integration.md](./api-integration.md).
2. Run `npm run dev`.
3. Run `npm test` before pushing.

## CI

- `.github/workflows/ci.yml` — install, test, build on `push` / `pull_request` to `main`.
- `.github/workflows/docker-build.yml` — verify a Docker image build on `push` to `main` (no registry push).
- `.github/workflows/docker-publish.yml` — build and push the image on `push` to `production` (GHCR).

## Environment variables

| Variable              | Purpose |
| --------------------- | ------- |
| `NODE_ENV`            | `development` or `production`. Gates `/dev/api-test` in production builds. Set in local `.env` (copy from `.env.example`). Docker Compose build arg defaults to `development`; plain `docker build` defaults to `production`. Unset during `npm run dev` → Vite defaults to `development`. |
| `VITE_API_BASE_URL`   | API base URL including `/api` prefix (no trailing slash). Unset in dev → `window.location.origin + '/api'` (Vite proxy to Nest **8080**). For production builds, set only when the browser must call a separate API origin; otherwise rely on same-host `/api` proxy. |

Never commit `.env`; only `.env.example`.

## Next steps

- Replace the placeholder test in `src/App.test.jsx` when you adopt a component testing stack.

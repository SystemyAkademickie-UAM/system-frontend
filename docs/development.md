# Development (frontend)

## Stack versions

- **Node.js:** 24.x
- **React:** 19.x
- **Vite:** 6.x

Use `.nvmrc` with nvm / nvm-windows; GitHub Actions uses Node 24.

## Workflow

1. Point `VITE_API_BASE_URL` (or rely on the dev default) at an API that implements the contract in [api-integration.md](./api-integration.md).
2. Run `npm run dev`.
3. Run `npm test` before pushing.

## CI

- `.github/workflows/ci.yml` — install, test, build on `push` / `pull_request` to `main`.
- `.github/workflows/docker-image.yml` — build and push the Docker image on `push` to `main`.

## Environment variables

| Variable              | Purpose |
| --------------------- | ------- |
| `VITE_API_BASE_URL`   | API base URL including `/api` prefix (no trailing slash). Unset in dev → `http://127.0.0.1:8080/api`. For production builds, set to the full URL the browser must call. |

Never commit `.env`; only `.env.example`.

## Next steps

- Replace the placeholder test in `src/App.test.jsx` when you adopt a component testing stack.

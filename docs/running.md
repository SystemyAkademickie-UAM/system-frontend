# How to run (frontend)

## Full local stack (recommended for auth)

1. **Backend** — from `system-backend/`: `npm run db:up`, `npm run migrate`, `npm run start:dev` (API on **8080**).
2. **Local IdP** (optional) — `npm run idp:up` (**5000**), then `.\idp\scripts\register-local-idp.ps1` once per DB.
3. **Frontend** — from this repo:

```bash
npm install
npm run dev
```

Open **`http://127.0.0.1:3000`**. SAML ACS should target the same origin (`SAML_ACS_URL=http://127.0.0.1:3000/api/auth/saml/acs` in backend `.env`). See [api-integration.md](./api-integration.md) and backend [saml-local-idp.md](../system-backend/docs/saml-local-idp.md).

### Docker UI instead of Vite

From `system-frontend/`:

```powershell
docker compose up --build
```

Same-origin `/api` proxy to Nest on the host — see [docker.md](./docker.md). Rebuild after auth-related frontend changes: `docker compose build --no-cache`.

## Development (Node only)

The app expects an API implementing the contract in [api-integration.md](./api-integration.md). If `VITE_API_BASE_URL` is unset, requests use **`window.location.origin + '/api'`** (Vite proxy to **8080**).

```bash
npm run dev
```

Dev server: **`http://127.0.0.1:3000`** (see `vite.constants.js`).

## Production build (static files)

```bash
npm install
npm run build
```

Host the `dist/` directory with any static server. Set `VITE_API_BASE_URL` at **build time** to a base URL the **browser** can reach (no trailing slash), unless nginx (or similar) serves `/api` on the same host.

## Tests

```bash
npm test
```

CI runs `npm install`, `npm test`, and `npm run build` until a lockfile is committed; then you can switch the workflow to `npm ci`.

## Container (this repository only)

See [docker.md](./docker.md).

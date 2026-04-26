# How to run (frontend)

## Development (Node)

The app expects an API that speaks the contract in [api-integration.md](../api/api-integration.md). In dev, if `VITE_API_BASE_URL` is not set, requests default to `http://127.0.0.1:8080/api`.

```bash
npm run dev
```

Dev server: `http://127.0.0.1:3000` (see `vite.constants.js`).

## Production build (static files)

```bash
npm install
npm run build
```

Host the `dist/` directory with any static server. Set `VITE_API_BASE_URL` at **build time** to a base URL the **browser** can reach (no trailing slash).

## Tests

```bash
npm test
```

CI runs `npm install`, `npm test`, and `npm run build` until a lockfile is committed; then you can switch the workflow to `npm ci`.

## Container (this repository only)

See [docker.md](../docker/docker.md).

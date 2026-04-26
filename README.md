# system-frontend

React 19 + Vite 6 (JavaScript) SPA. Dev server: `http://127.0.0.1:3000`.

## Quick start

```bash
npm install
cp .env.example .env   # optional
npm run dev
```

By default the dev app uses `window.location.origin + '/api'` with a **Vite proxy** to `http://127.0.0.1:8080` (good for SAML cookies). Override with `VITE_API_BASE_URL` if needed ([docs/api/api-integration.md](./docs/api/api-integration.md)).

## Documentation

Start with **[docs/first-setup/prerequisites.md](./docs/first-setup/prerequisites.md)** (Node.js **24.14.1**, npm **11.11.0**), then use the index below. All Markdown except this file lives under `docs/`.

| Document | Description |
| -------- | ----------- |
| [docs/README.md](./docs/README.md) | Documentation index |
| [docs/first-setup/prerequisites.md](./docs/first-setup/prerequisites.md) | Toolchain versions (install before `npm install`) |
| [docs/first-setup/installation.md](./docs/first-setup/installation.md) | Requirements and install |
| [docs/development/running.md](./docs/development/running.md) | Dev server, production build, tests |
| [docs/docker/docker.md](./docs/docker/docker.md) | Docker image for this app |
| [docs/development/development.md](./docs/development/development.md) | Tooling, CI, environment variables |
| [docs/api/api-integration.md](./docs/api/api-integration.md) | How this app uses the API |

The HTTP API is a **separate** Git repository (**system-backend**). Clone it alongside this repo for a full stack; its `docs/` cover API install, ports, and Docker. Prerequisites versions match this repo by design.

## License

[LICENSE.md](./LICENSE.md) (all rights reserved).

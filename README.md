# system-frontend

React 19 + Vite 6 (JavaScript) SPA. Dev server: `http://127.0.0.1:3000`.

## Quick start

```bash
npm install
cp .env.example .env   # optional
npm run dev
```

Configure `VITE_API_BASE_URL` if the API base is not `http://127.0.0.1:8080/api` (see [docs/api-integration.md](./docs/api-integration.md)).

## Documentation

Start with **[docs/prerequisites.md](./docs/prerequisites.md)** (Node.js **24.14.1**, npm **11.11.0**), then use the guides below. All Markdown except this file lives under `docs/`.

| Document | Description |
| -------- | ----------- |
| [docs/prerequisites.md](./docs/prerequisites.md) | Toolchain versions (install before `npm install`) |
| [docs/installation.md](./docs/installation.md) | Requirements and install |
| [docs/running.md](./docs/running.md) | Dev server, production build, tests |
| [docs/docker.md](./docs/docker.md) | Docker image for this app |
| [docs/development.md](./docs/development.md) | Tooling, CI, environment variables |
| [docs/api-integration.md](./docs/api-integration.md) | How this app uses the API |

The HTTP API is a **separate** Git repository (**system-backend**). Clone it alongside this repo for a full stack; its `docs/` cover API install, ports, and Docker. Prerequisites versions match this repo by design.

## License

[LICENSE.md](./LICENSE.md) (all rights reserved).

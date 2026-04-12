# Installation (frontend)

## Requirements

- **Node.js** 24.x (see `.nvmrc`)
- **npm** 10+ (bundled with Node 24). Run `npm install` once to create `package-lock.json`, commit it, then prefer `npm ci` for reproducible installs (switch CI to `npm ci` after the lockfile is in the repo).
- **Docker Engine** (optional), if you serve the built assets from the image in this repository

Optional on Windows: **nvm-windows** to match Node 24.

## Clone and install

```bash
git clone <your-system-frontend-url>
cd system-frontend
nvm use    # optional
npm install
cp .env.example .env   # optional
```

## Debian / production host

Build static files with `npm run build` and host `dist/`, or use the [Dockerfile](../Dockerfile). See [docker.md](./docker.md).

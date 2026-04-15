# Installation (frontend)

## Requirements

Install the **pinned Node.js and npm versions** first: [prerequisites.md](./prerequisites.md).

- **Docker Engine** (optional), if you serve the built assets from the image in this repository

After prerequisites, run `npm install` once to create `package-lock.json`, commit it, then prefer `npm ci` for reproducible installs once the lockfile is in the repo.

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

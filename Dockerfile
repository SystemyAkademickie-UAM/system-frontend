# Build stage
FROM node:24.14.1-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@11.11.0 && npm ci
COPY . .
# Empty = production-like bundle (`location.origin + /api`). Optional override for split-origin deployments.
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# Baked into the SPA at build time (`/dev/api-test` route). Default production for safety.
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
RUN npm run build

# Serve static assets on port 3000 (matches host nginx proxy_pass http://localhost:3000)
FROM nginx:alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

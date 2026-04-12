# Build stage
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# URL must be reachable from the user’s browser. Behind host nginx on / + /api/, use empty string at build time.
ARG VITE_API_BASE_URL=http://127.0.0.1:8080/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Serve static assets on port 3000 (matches host nginx proxy_pass http://localhost:3000)
FROM nginx:alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

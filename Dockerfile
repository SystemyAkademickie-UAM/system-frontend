# ETAP 1: Budowanie paczki (GitHub)
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# ETAP 2: Serwowanie plików (serwer)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
# Uruchamienie Nginxa
CMD ["nginx", "-g", "daemon off;"]

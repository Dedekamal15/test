# Build stage
FROM node:20-bullseye AS builder

WORKDIR /app

COPY package*.json ./

# Clean install
RUN npm ci --include=optional

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
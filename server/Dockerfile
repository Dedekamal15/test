FROM node:20-bullseye

WORKDIR /app

# Copy package.json dari root (karena server pakai package.json yang sama)
COPY package*.json ./

# Install semua dependencies termasuk server
RUN npm ci --include=optional

# Copy semua source code
COPY . .

EXPOSE 5001

CMD ["node", "server/index.js"]
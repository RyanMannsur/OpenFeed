# syntax=docker/dockerfile:1
# Dockerfile raiz unificado — Frontend Angular + Backend Node.js

# --- 1. Build do Frontend ---
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY fontes/frontend/package*.json ./
RUN npm install
COPY fontes/frontend/ ./
RUN npm run build

# --- 2. Dependências do Backend ---
FROM node:22-alpine AS backend-deps
WORKDIR /app
COPY fontes/backend/package*.json ./
RUN npm ci --omit=dev

# --- 3. Imagem de Runtime ---
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY fontes/backend/package*.json ./
COPY --from=backend-deps /app/node_modules ./node_modules
COPY fontes/backend/ .

# Copia os arquivos de browser compilados do frontend para a pasta pública do backend
COPY --from=frontend-builder /app/dist/frontend/browser ./public/frontend

EXPOSE 3000

CMD ["node", "server.js"]

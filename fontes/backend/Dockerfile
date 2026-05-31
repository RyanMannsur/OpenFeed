# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM base AS production-deps
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
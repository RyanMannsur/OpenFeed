# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app/fontes/frontend

COPY fontes/frontend/package*.json ./
RUN npm install

FROM deps AS build
COPY fontes/frontend ./
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app/fontes/frontend

ENV NODE_ENV=production

COPY fontes/frontend/package*.json ./
COPY --from=deps /app/fontes/frontend/node_modules ./node_modules
RUN npm prune --omit=dev

COPY --from=build /app/fontes/frontend/dist/frontend ./dist/frontend

EXPOSE 4000
CMD ["node", "dist/frontend/server/server.mjs"]

# Based on https://depot.dev/docs/container-builds/optimal-dockerfiles/node-npm-dockerfile

FROM node:24.14-alpine3.23 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --omit=dev

FROM node:24.14-alpine3.23 AS production

WORKDIR /app

ENV NODE_ENV=production

USER node

COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/src/generated ./dist/src/generated
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/src/main"]

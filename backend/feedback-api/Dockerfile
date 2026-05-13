FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json ./
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN pnpm install --no-frozen-lockfile

COPY src ./src

RUN pnpm prisma:generate && pnpm build && pnpm prune --prod

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" >/dev/null || exit 1

CMD ["node", "dist/main.js"]

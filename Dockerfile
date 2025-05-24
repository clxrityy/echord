FROM node:24-slim AS base

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
EXPOSE 3000

FROM base AS builder
COPY . .
RUN npm run build


FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV DEVELOPMENT_ENVIRONMENT=docker
RUN npm ci

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

FROM base AS dev
ENV NODE_ENV=development
RUN npm install -g pnpm && pnpm i
COPY . .
CMD ["pnpm", "dev"]

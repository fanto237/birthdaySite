FROM oven/bun:1.3.9 AS build
WORKDIR /app

COPY package.json bun.lock nx.json tsconfig.base.json tsconfig.json ./
COPY apps/web/package.json apps/web/bun.lock apps/web/angular.json apps/web/tsconfig.json apps/web/tsconfig.app.json apps/web/tsconfig.spec.json ./apps/web/
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public

RUN bun install --frozen-lockfile
RUN bun --cwd apps/web ng build --configuration production

FROM node:22-alpine AS runtime
WORKDIR /app

COPY --from=build /app/apps/web/dist/web ./dist/web

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/web/server/server.mjs"]

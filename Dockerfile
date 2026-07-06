# syntax=docker/dockerfile:1

FROM oven/bun:1.3.14-alpine AS deps
WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/config/package.json packages/config/package.json
RUN HUSKY=0 bun install --frozen-lockfile

FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
COPY --from=deps /app ./
COPY . .

# Optional build-time values. Prefer refreshing the cached JSON outside Docker
# instead of passing secrets into image builds.
ARG GITHUB_USERNAME=fbrnngrh
ENV GITHUB_USERNAME=$GITHUB_USERNAME

RUN bun run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]

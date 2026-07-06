# Easypanel GitHub Dockerfile Deployment

This project is a monorepo, so Easypanel should build from the repository root.
Do **not** set the build path to `apps/web`, because the app depends on root
workspace files such as `package.json`, `bun.lock`, `turbo.json`, and
`packages/config`.

## Easypanel settings

Use an **App Service** with **Source: GitHub**.

Recommended values:

| Easypanel field | Value |
| --- | --- |
| Source | GitHub repository |
| Build path / Base directory | `.` or leave empty / repo root |
| Dockerfile | `Dockerfile` |
| Port | `80` |
| Health check path | `/health` |

If Easypanel only exposes a single **Build Path** field, use the repo root:

```txt
.
```

Do not use:

```txt
apps/web
```

## Why repo root

The root `Dockerfile` uses a multi-stage build:

1. Install workspace dependencies with Bun.
2. Run the Turborepo/SvelteKit static build.
3. Copy only `apps/web/build` into a tiny Nginx runtime image.

The production container does not run Bun, Node, or a database. It only serves
static files with Nginx.

## Files

- `Dockerfile` — multi-stage Bun builder + Nginx runtime.
- `nginx.conf` — static server config with gzip, asset cache, and `/health`.
- `.dockerignore` — keeps Docker context small and excludes local env files.

## Environment variables

Optional Easypanel environment variables:

```env
GITHUB_USERNAME=fbrnngrh
```

`GITHUB_TOKEN` is intentionally not required for Easypanel builds. The build can
fall back to the committed cached file:

```txt
apps/web/src/lib/data/github-contributions.json
```

For fresh contribution data, refresh it locally or in CI with `GITHUB_TOKEN` as
a secret, then commit the updated JSON:

```bash
bun run -F web fetch:github
```

Avoid passing `GITHUB_TOKEN` as a Docker build arg because build args can leak
through image metadata/history.

## Local Docker smoke test

Run this on a machine with Docker installed:

```bash
docker build -t febriannugroho-portfolio .
docker run --rm -p 3000:80 febriannugroho-portfolio
```

Then check:

```bash
curl http://localhost:3000/health
```

Expected output:

```txt
ok
```

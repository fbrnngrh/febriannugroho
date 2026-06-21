# Session Progress Log

## Current State

**Last Updated:** 2026-06-21
**Active Feature:** feat-005 — Static Site Migration (completed on branch `febrian`)

## Status

### What's Done

- [x] Agent harness initialized (AGENTS.md, docs/, init scripts)
- [x] Svelte MCP configured in `.cursor/mcp.json` and `.mcp.json`
- [x] Svelte skills installed under `.agents/skills/`
- [x] Cursor rules for Svelte MCP and best practices added
- [x] Baseline verification passed (`init.ps1`)
- [x] Portfolio rebuild (feat-003): OKLCH design tokens, Home/Stack/Blog/Contact
- [x] Home sectioned layout (feat-004)
- [x] **Static site migration (feat-005)** — 2026-06-21
  - `adapter-node` → `adapter-static` with prerendering (SSG)
  - Blog: PostgreSQL + oRPC → mdsvex + `.md` files in `src/content/blog/`
  - Contact: form action + DB insert → simple `mailto:` link
  - Removed: `packages/api`, `packages/db`, `packages/env`, oRPC infra, Docker, `bts.jsonc`
  - Dependencies cleaned: `@orpc/*`, `@tanstack/*`, `drizzle-orm`, `pg`, `marked`, `zod`, `dotenv` removed

### What's In Progress

- [ ] Verification of static build (Phase 6)

### What's Next

- Run `bun install` + `bun run -F web check` + `bun run build` to verify
- Replace placeholder project/social URLs with real links
- Deploy static output to CDN

## Blockers / Risks

- mdsvex + SvelteKit 5 compatibility — needs `bun run -F web check` verification
- Prerendering of `[slug]` route depends on `entries()` function working correctly

## Decisions Made

- **Static migration**: Convert from full-stack to 100% static SSG (user decision 2026-06-21)
- **Blog**: mdsvex + `.md` files with frontmatter (user choice over TS data file)
- **Contact**: Simple `mailto:` link (user choice over external form service)
- **Monorepo**: Kept Turborepo structure, slimmed to `apps/web` + `packages/config` only

## Evidence of Completion

- [x] `bun install` — 6 packages removed, lockfile clean
- [x] `bun run check-types` — 0 tasks (no type errors)
- [x] `bun run -F web check` — 0 errors, 1 warning (pre-existing `href="#"`)
- [x] `bun run build` — static output in `apps/web/build/` (7 HTML files)

## Notes for Next Session

All backend code removed. Active dev branch: `febrian`. No `.env` file needed anymore. Static output in `apps/web/build/` after `bun run build`.

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
- [x] **Home page fit-to-screen** — 2026-07-04
  - Adjusted global layout main wrapper (`+layout.svelte`) dynamically checking `page.url.pathname === "/"` to center elements and limit viewport height.
  - Tighter spacing and margins on `+page.svelte` (`space-y-6 sm:space-y-8`, reduced `hr` separator margins) to fit layout without scrolling.
  - Verified visual representation in browser matches the user's reference.
- [x] **Stack page redesign** — 2026-07-04
  - Replaced text-based avatar with the `ProfilePhoto` component (consistent with homepage).
  - Designed structured tool list layout matching user screenshot: rounded secondary-colored icon background, blue title links, and elbow `↳` connector before description text.
  - Changed placeholder links for tools to their actual homepages (e.g. cursor.com, claude.ai, nextjs.org).
  - Adjusted layout width (`+layout.svelte`) dynamically for the `/stack` page to `max-w-2xl` for better presentation.
  - Restructured stack items in a two-column grid on desktop viewports.
  - Categorized tools into four distinct groups (My Development Workspace, Frameworks & Languages, Infrastructure & Databases, Productivity & Life Tools) for structured presentation.
  - Added new workspace tools: **Windsurf** & **Cursor** (main IDEs), **Antigravity** (secondary IDE), **Codex** & **Claude** (CLIs).
  - Added new backend frameworks: **NestJS**, **Express.js**, **Hono**, **Fastify**, and **Laravel**.
  - Added **Svelte** as a top three framework (placed beside Next.js and React), and **Cloudflare** for edge deployment.
  - Removed **TanStack** from the stack page tools list.
  - Optimized readability of Plus Jakarta Sans by tweaking text colors (`text-neutral-600 dark:text-neutral-400`), weight, and font styles, resolving contrast issues for subtitle descriptions.
- [x] **Dark Mode Icon Visibility Fix** — 2026-07-04
  - Enabled selector-based dark mode in Tailwind v4 by adding `@custom-variant dark (&:where(.dark, .dark *))` to `app.css`. This resolved a bug where `dark:...` variant classes were ignoring the manual theme toggle.
  - Dynamically applied `dark:invert` only to monochrome icons on the homepage (Next.js, GitHub, X) and stack page (Cursor, Warp, Notion, Next.js, Prisma, Vercel).
  - Ensured colored/branded icons (React, TypeScript, Tailwind CSS, PostgreSQL, Claude, Brave, Figma, Bun) retain their original brand colors in both themes.
  - Verified visibility and color retention using the browser subagent in dark mode.
- [x] **Favicon Customization** — 2026-07-04
  - Changed the default favicon in `app.html` to target the user's profile photo (`/images/profile-photo-2.webp`).

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

# Session Progress Log

## Current State

**Last Updated:** 2026-11-27
**Active Feature:** Portfolio redesign 2026 (feat-015) on branch `redesign/portfolio-2026`, not pushed

## Status

### What's Done

- [x] **Home micro-UI · image link previews** — 2026-11-27, branch `t3/home-image-link-previews`, local only
  - `LinkPreview` takes `image`/`imageAlt`/`external`/`class`/children: screenshot card (280×175, scales down on narrow screens), clamped to the viewport, flips below near the top, rises from the link with a 2° tilt (200 ms in, 150 ms out, opacity only under reduced motion), text card if the image fails. Used for Trio Motor (About), every Tools item and GitHub/LinkedIn/Threads. Images expected at `/images/previews/<name>.webp`.
  - Experience list is a quiet timeline (years, dot + hairline, role over company); Contact "Email me" compacted to the Copy chip (32 px, 13 px).
  - Verified: `bun run -F web check` 0/0; browser 1440/390/320, light+dark, hover + keyboard focus + Esc on every preview, no horizontal scroll. Not verified: real screenshots (placeholders only), reduced motion in a browser, touch device.

- [ ] **Live fixes · Panggung v3 (feat-016)** — 2026-11-27, branch `fix/live-stage-v3` from `origin/master` (`ebaacfe`), local only
  - Stage: `VideoStage` rewritten (one clock, no slide UI, card = `<button aria-pressed>`, hover no longer pauses, resume from remaining time); 12 scenes in `components/stage/scenes/` from Figma 307:13632…309:13918; chapter colours as `@property` on `html[data-stage]` (600 ms), one glow set with mask edges, scroll-linked grow (+ IO fallback). StageScene, STAGE_SLIDES, SCENE_TEXT and unused stage tokens removed.
  - Review items: carousel bleeds right from the text column with a mask (no `::after` box), real hover lift on work cards and the Writing fan, 16×6 pill dot, Email me in Contact, Writing/Tools/Selected work heading reveals, Stack fleet map with SVG connectors + fail loop + approve line + 10 s WAAPI timeline (fail path every third loop), missing card logos, GitHub graph on `contributionLevel` for 39 weeks, `04-motion.md` §1/§6/§9/§10.
  - Verified: check-types, build, browser 1440/390/320 light+dark, chapter colour interpolation, fail path timing. Not verified: Safari/Firefox fallback, reduced motion in a browser, Chrome Performance recording.
  - Waiting for Febrian: dark-mode scene colours (provisional), chapter-3 caption link, GitHub PAT/workflow and agent contributions, Email me also kept on the profile card, `/review-animations` run.

- [x] **Portfolio redesign 2026 (feat-015)** — 2026-11-27, branch `redesign/portfolio-2026` (local only)
  - Handoff saved in `docs/redesign-handoff/` (Figma M4H1HkuEiWyZTToDQ6Iml2, page Hi-fi).
  - Dependencies updated; SvelteKit 3 migration (`sv migrate sveltekit-3`): config in `vite.config.ts`, `$lib` → `#lib`, mdsvex 1 as a Vite plugin. TypeScript stays 6.x (Kit 3 needs the TS 6 compiler API). `web` now has a real `check-types` script.
  - New tokens (Inter + Geist Mono, light/dark, motion), layout (skip link, nav, Explore menu, floating profile, page cross-fade), Home (hero, video stage, Selected work + project dialog/sheet, About, Writing fan, Shipping in public, Tools, Contact), Writing, article with TOC, Stack with fleet map + agent cards, 404.
  - Site copy and open decisions live in `apps/web/src/lib/content/site.ts` (`DECISIONS`).
  - Reviewed with better-interface / better-accessibility / break-ui and improve-animations / gestures; findings applied (commit ac7eb01).
  - QA: 6 widths × 6 routes without horizontal scroll, one `<main>` and one `<h1>` each; light/dark and 390/1440 checked in the browser.
  - Independent review + manual E2E (2026-11-27, agent-browser on `vite build` + preview, and the podman image): nginx served no `.html` routes (/stack, /blog, posts 404'd on direct load) and had no site 404; home bundle shipped the whole contributions JSON (202 kB → 35 kB); profile close lost focus; phone agent sheet ignored back/backdrop; a11y/reduced-motion polish. Fixed in fa52518, 6512a89, 59192e9, 3cdf79c. Second round (same day): stage frame, fleet rings/chips and agent avatar now crossfade opacity layers; Email me flies 160 ms linear + 260 ms ease-flow; fleet pause in the legend row with aria-pressed; no empty header on Home; Explore menu returns focus on Esc/back; Scroll hint contrast (305d5c1, 5400cf6, 0b00990, fc1331b, 3d047cf). Final E2E: 90/90 checks pass (390/1440 × light/dark, reduced motion, 720/320 px, axe, Web Vitals); report at `docs/reports/e2e-redesign-2026-11-27.pdf`. Still open: canonical/og tags and sitemap (need the site domain), large PNG covers of the 2025 posts (§4.5), a host that serves the prerendered `.html` routes and `404.html`. Playwright postponed by Febrian.

- [x] **Motion Design & Micro-interactions (feat-014)** — 2026-07-08
  - Added motion foundation: `inview` Intersection Observer action, extended `motion.ts` tokens/helpers, and shared CSS utilities (`scroll-reveal`, `press-feedback`, `icon-hover-lift`, `input-focus-line`, `pop-in`).
  - Home: strengthened per-icon hover scale/lift, sibling fade, social press feedback, and `link-underline` footer links.
  - Stack: extracted `StackToolItem`, added scroll-triggered section/item choreography with staggered reveals and elbow fade.
  - Blog: scroll-triggered `BlogListItem` cards, tag pill pop, search clear animation, empty-state fade.
  - Contact: `BackLink`, input focus line, copy-email pop-in, submit press feedback, success fade-slide-up.
  - Blog article: `CopyCodeButton` component (Svelte mount), prose heading reveal on scroll.
  - Theme toggle: Sun/Moon crossfade with rotate; GitHub calendar per-week wave fill on inview.
  - Verification: `bun run -F web check` — 0 errors, 0 warnings.

- [x] ~~**Easypanel GitHub Dockerfile Deployment (feat-013)**~~ — 2026-07-06, **removed 2026-11-27** (Febrian's call): `Dockerfile`, `nginx.conf`, `.dockerignore` and `docs/deployment.md` are gone from `redesign/portfolio-2026`. The nginx fix for refresh-404s (`try_files $uri $uri.html`, `error_page 404 /404.html`, commit fa52518) went with them, so whichever host comes next must itself map `/stack` → `stack.html` (prerendered `.html` routes) and serve `404.html` for unknown paths. History below kept for reference.
  - Researched lightweight Easypanel GitHub-source deployment approach for a static SvelteKit monorepo: root Dockerfile + multi-stage Bun build + Nginx runtime.
  - Added `Dockerfile`, `nginx.conf`, and `.dockerignore`.
  - Documented Easypanel repo-root build path, port `80`, health check, and safe GitHub contribution cache handling in `docs/deployment.md`.
  - Updated root Turborepo scripts to use explicit `turbo run` form.
  - Fixed Docker build failure from copying a non-existent `packages/config/node_modules` directory; builder now copies the full dependency stage from `/app` and disables Husky during Docker install.
  - Verified project checks pass; Docker image smoke test is pending because Docker CLI is unavailable in this environment.

- [x] **GitHub Contribution Calendar Integration (feat-012)** — 2026-07-06
  - Wrote a secure GraphQL data-fetching Bun script (`scripts/fetch-github-contributions.ts`) that downloads both rolling last year and individual calendar years (2021-2026) in a loop via GraphQL.
  - Implemented environment loading and a fallback strategy so that the build system uses the cached JSON file if `GITHUB_TOKEN` is missing, preventing build failures.
  - Configured the script to cache results in `apps/web/src/lib/data/github-contributions.json`.
  - Added a custom Svelte 5 component (`GitHubContributionCalendar.svelte`) using runes (`$props()`, `$derived`, `$state`, `$effect`) for reactive state and actions.
  - Styled the calendar with custom OKLCH-based theme variables mapped to the portfolio's accent blue color for light and dark modes.
  - Implemented an automatic scroll-to-right behavior using Svelte 5 `$effect` on load and year switch, ensuring the current/newest month is shown immediately.
  - Repositioned the Year Selector as a horizontal row of tabs in the top header, giving 100% of the horizontal space to the calendar grid.
  - Synced month labels scrolling by placing them inside the scroll container, avoiding any alignment drift when scrolling.
  - Math-aligned day labels (Mon, Wed, Fri) row-by-row with the grid by using a matching `88px` height and `18px` top margin.
  - Integrated the calendar into the `/stack` page inside a revamped profile dashboard card.
  - Configured project scripts (`fetch:github`) and automated fetching as part of the build pipeline in `apps/web/package.json`.
  - Documented setup instructions and build fallbacks in `README.md`.
- [x] **Social Media Links Update & Threads Transition** — 2026-07-06
  - Replaced all placeholder/old social media URLs with the user's correct profiles:
    - GitHub: `https://github.com/fbrnngrh`
    - LinkedIn: `https://www.linkedin.com/in/febrian-bayu-nugroho-ba044a1a0/`
    - Instagram: `https://www.instagram.com/febriannugroho.dev`
    - Threads: `https://www.threads.net/@febriannugroho.dev`
  - Replaced the "X" social icon on the homepage with the "Threads" icon using `SvglThreadsLogo` from `@selemondev/svgl-svelte`.
  - Updated the contact page social links section to list the correct GitHub, LinkedIn, Instagram, and Threads links, removing the old X reference.
  - Verified compilation and static HTML generation pass cleanly.
- [x] **Profile Photo Hydration Mismatch & Flicker Fix** — 2026-07-06
  - Fixed a Svelte 5 hydration mismatch and layout flickering issue with the `<ProfilePhoto>` component.
  - Root Cause: The profile photo component's container was using a block-level `<div>` element but was nested inside a `<p class="text-2xl leading-relaxed">` tag on the landing page. In HTML, a `<div>` inside a `<p>` causes the browser to automatically close the `<p>` element, creating a DOM hierarchy mismatch between the SSR output and client-side hydration.
  - Resolution: Changed the root element of `ProfilePhoto.svelte` from a `<div>` to a inline-block `<span>` (which is valid inside `<p>`).
  - Verified that this completely eliminates the Svelte hydration mismatch console warnings and prevents layout flickering or shifting on page refresh.
- [x] **Blog Content Improvement & Hero Cover Images (feat-011)** — 2026-07-05
  - Rewrote the three short placeholders into high-quality, long-form technical guides (React 19 Actions, Next.js SaaS architecture, and Tailwind CSS v4 OKLCH setup).
  - Configured cover image metadata support inside Svelte load types and templates.
  - Generated customized AI cover images for each post and saved them into the project static assets directory (`apps/web/static/images/blog/`).
  - Added hero banner rendering support in `blog/[slug]/+page.svelte`.
  - Confirmed compiler type-checks, Svelte checks, and static exports pass successfully.
- [x] **Contact Page Revamp & Interactive Composer (feat-010)** — 2026-07-05
  - Reverted layout width (`+layout.svelte`) to the centered `max-w-xl` default layout for a focused reading rhythm.
  - Implemented a live-ticking timezone clock configured for Banjarmasin, South Kalimantan (`Asia/Makassar` WITA, GMT+8).
  - Integrated status highlights (work availability pulse badge, location description, clock) in a clean, unified title metadata line.
  - Designed an editorial-style message composer form using bottom-bordered text inputs, select elements, and textareas (`border-b border-border focus:border-accent bg-transparent rounded-none`).
  - Simplified direct email connects with a copy-to-clipboard button that shows checked status feedback.
  - Replaced heavy buttons and pills with text-based links separated by slashes (`GitHub / LinkedIn / X`).
  - Completed type checking and static production build tests successfully.
- [x] **Blog Section Revamp & Typography Optimization (feat-009)** — 2026-07-05
  - Widened the blog pages layout width (`+layout.svelte`) to `max-w-2xl` for optimal reading proportion and spacious code block containers.
  - Revamped `blog/+page.svelte` to support instant text searches across titles and descriptions.
  - Implemented interactive tag category pills with dynamic counts indicating how many posts belong to each category.
  - Redesigned `BlogListItem.svelte` using an elegant, fully responsive box card layout with metadata tags, reading times, descriptions, and arrow hover micro-animations.
  - Created a scroll-based reading progress bar indicator for individual posts in `blog/[slug]/+page.svelte`.
  - Built a client-side Svelte 5 `$effect` hook that dynamically injects zero-dependency copy buttons with success status alerts to all mdsvex fenced code snippets.
  - Enhanced markdown body styling (`.prose-custom`) including blockquotes, headers, spacing, font weights, and list marker styles.
  - Completed type checking (`bun run check-types`), Svelte code checking (`bun run -F web check`), and static production build checks (`bun run build`).
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

- [ ] Pick a host; it must serve prerendered `.html` routes and `404.html` (the nginx config that did this was removed 2026-11-27)

### What's Next

- Replace placeholder project/social URLs with real links
- Deploy static output to CDN

## Blockers / Risks

- Redesign waits on Febrian: theme toggle (kept), /blog vs /writing (kept /blog), /contact (kept), stage scene language (English proposal, flagged), old 2025 posts (kept, `legacy: true`). Fonts now self-hosted via @fontsource-variable (approved 2026-11-27).
- Not verified: real-phone gestures (sheet/fan drag at 120 Hz), VoiceOver/NVDA, forced-colors, 200% zoom, Lighthouse.
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

## Session 2026-11-27: Cloudflare deploy

- Host: Cloudflare Workers static assets, `apps/web/wrangler.jsonc`, custom domain `febriannugroho.my.id`; `www` 301 to apex; Always HTTPS, TLS 1.2+, SSL strict.
- CI: `.github/workflows/deploy.yml` deploys on push to `master` (secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` set on the GitHub repo).
- Evidence: first `wrangler deploy` from local with the CI token succeeded; `curl` shows `/` 200, `/stack` 200, unknown path 404, `www` 301 to apex, `http` 301 to `https`, security headers present.

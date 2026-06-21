# Design Spec: Portfolio SvelteKit Rebuild

**Project:** febriannugroho  
**Author:** Febrian Bayu Nugroho  
**Date:** 2026-06-20  
**Status:** Draft — pending review

## Overview

Rebuild the existing Next.js portfolio-minimalist into the SvelteKit monorepo (`apps/web/`), maintaining identical visual design (single-column, max-w-xl, dark/light mode, micro-interactions) while leveraging the Better-T-Stack scaffold (oRPC, Drizzle, PostgreSQL). Blog and Contact get real database backends instead of the previous in-memory/simulated implementations. A new Project Showcase section is added to Home.

---

## Architecture

### Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | SvelteKit 2.58 (Svelte 5.55 runes mode) |
| Styling | Tailwind CSS 4 (OKLCH tokens, CSS-first config) |
| Typography | Plus Jakarta Sans (Google Fonts, variable 200–800) |
| Database | PostgreSQL via Drizzle ORM |
| API | oRPC (server-side router, SvelteKit SSR client) |
| Brand Icons | `@selemondev/svgl-svelte` (named imports, tree-shakeable) |
| UI Icons | `lucide-svelte` (Sun/Moon, ArrowLeft, Send) |
| Validation | Zod |
| Package Manager | Bun |

### File Structure

```
apps/web/
├── src/
│   ├── app.css                    # OKLCH tokens, Plus Jakarta Sans, utilities
│   ├── app.html                   # Root HTML + FOUC prevention script
│   ├── routes/
│   │   ├── +layout.svelte         # Shell: max-w-xl + ThemeToggle
│   │   ├── +page.svelte           # Home (narrative + project cards)
│   │   ├── +error.svelte          # Error/404 boundary
│   │   ├── stack/+page.svelte     # Tools list
│   │   ├── blog/
│   │   │   ├── +page.server.ts    # Load posts from oRPC
│   │   │   ├── +page.svelte       # Post list
│   │   │   └── [slug]/
│   │   │       ├── +page.server.ts
│   │   │       └── +page.svelte
│   │   ├── contact/
│   │   │   ├── +page.server.ts    # Form action + Zod validation
│   │   │   └── +page.svelte
│   │   └── rpc/+server.ts         # oRPC transport (existing, keep)
│   └── lib/components/
│       ├── ProfilePhoto.svelte
│       ├── ThemeToggle.svelte
│       ├── ProjectCard.svelte
│       ├── SocialPill.svelte
│       └── BlogListItem.svelte
├── static/images/                 # Profile photo, Trio Motor logo
└── package.json

packages/
├── db/src/schema/
│   ├── index.ts                   # Exports posts, contacts
│   ├── blog.ts                    # posts table
│   └── contact.ts                 # contacts table
├── db/src/seed.ts                 # Blog seed script
└── api/src/routers/
    ├── index.ts                   # appRouter (healthCheck + blog)
    └── blog.ts                    # list + bySlug procedures
```

---

## Sections

### Section 1 — Design System Port

**`app.css`** contains:

- `@import "tailwindcss"`
- Plus Jakarta Sans via `app.html` preconnect links
- OKLCH custom properties for light and dark modes
- `.dark` class overrides for all tokens
- `@theme` block mapping tokens to Tailwind utilities (`--color-bg`, `--color-fg`, etc.)
- `.link-underline` utility class (accent color, animated underline 0.25s left-to-right)

**Tokens:**

| Name | Light | Dark |
|------|-------|------|
| `--color-bg` | `oklch(1 0 0)` | `oklch(0.25 0 0)` |
| `--color-fg` | `oklch(0.25 0 0)` | `oklch(0.96 0 0)` |
| `--color-primary` | `oklch(0.33 0 0)` | `oklch(0.33 0 0)` |
| `--color-secondary` | `oklch(0.96 0 0)` | `oklch(0.33 0 0)` |
| `--color-border` | `oklch(0.92 0 0)` | `oklch(1 0 0 / 0.10)` |
| `--color-muted` | `oklch(0.52 0 0)` | `oklch(0.43 0 0)` |
| `--color-accent` | `oklch(0.7 0.16 240)` | same |
| `--color-destructive` | `oklch(0.55 0.2 25)` | same |

Typography: `font-sans: 'Plus Jakarta Sans', sans-serif`

---

### Section 2 — Root Layout + Theme Toggle

**`app.html`:** FOUC-prevention inline script before `<body>` renders — reads `localStorage` / `matchMedia`, applies `.dark` to `<html>` before first paint.

**`+layout.svelte`:** Minimal shell — `<main class="mx-auto max-w-xl px-6 py-20 sm:py-32">` wrapping `{@render children()}` + `<ThemeToggle />` component fixed `bottom-6 right-6`.

**`ThemeToggle.svelte`:**

- Reads current theme from `document.documentElement.classList`
- Toggles `.dark` on `<html>`, persists to `localStorage`
- View Transitions API ripple animation (1s ease-in-out, clip-path circle from button center); CSS-only instant fallback
- Respects `prefers-reduced-motion: reduce`
- Pill-shaped (rounded-full, 40×40px), border, backdrop blur

**Deleted:** `components/Header.svelte`, old `+layout.svelte` (QueryClientProvider + TanStack devtools).

---

### Section 3 — Home Page

**`src/routes/+page.svelte`** — single component, static content, no load function.

Structure (top-to-bottom, `space-y-12`):

1. **Intro:** "Hi, my name is **Febrian Bayu Nugroho**" (text-2xl, name font-semibold) + inline `ProfilePhoto` (48×48 rounded-full, hover → 👋 wave emoji via CSS `@keyframes`)
2. **What I do:** "I build web applications and SaaS products." (text-2xl)
3. **Work:** "I'm a Mid Software Engineer at Trio Motor." + company logo 32×32 link (hover spring: `cubic-bezier(0.34, 1.56, 0.64, 1)`)
4. **Tech focus:** Next.js, React, TypeScript icons (svgl-svelte, 36×36, overlap -6°, expand on group hover)
5. **Social platforms:** GitHub, Instagram, LinkedIn, X icons (same overlap pattern)
6. **Project showcase:** "Projects" heading + 2-3 `ProjectCard` in `flex-row flex-wrap`. Each card: title (accent), one-line description (muted), rounded-lg border, hover lift (translateY -2px). Fits single-column flow.
7. **Stack CTA:** "Want to see what I use?" → link to `/stack` (accent)
8. **Separator:** dashed border, `mt-20`
9. **Footer links:** "Read my blog →" + "Get in touch →" (text-sm, muted)

**Animation:** `transition:fly` on sections with `--i` CSS custom property for staggered delay. All animations disabled via `prefers-reduced-motion` media query in `<style>`.

**Components created:** `ProfilePhoto.svelte`, `ProjectCard.svelte`

---

### Section 4 — Stack Page

**`src/routes/stack/+page.svelte`** — static, no load function.

Structure:

1. **Back link:** `← Back to home` (text-sm, muted)
2. **Avatar:** Circle 48×48, rounded-full, bg-secondary, centered initials "FB"
3. **Heading:** "Here are the tools and services I use to build my apps and power them." (text-2xl)

**SEO:** `<svelte:head>` with `<title>Stack — Febrian Bayu Nugroho</title>` and `<meta name="description">`.
4. **Category A** — "Things that power my life": Windsurf, Claude, Warp, Brave, Figma, Notion
5. **Category B** — "Things that power my apps": Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Vercel, Bun

Each item is a `StackRow`: SVG icon 20×20 (svgl-svelte), tool name (font-medium → accent hover), "→" description (muted, text-sm). Items with URLs are full-row clickable `<a>`; no-URL items are plain `<div>`.

DRY via `{#snippet stackRow(item)}` colocated in the page file.

---

### Section 5 — Blog DB Schema + oRPC API

**`packages/db/src/schema/blog.ts`:**

```ts
posts: id (serial PK), slug (text unique), title, description,
       content, date (ISO string), reading_time, created_at
```

**`packages/api/src/routers/blog.ts`:**

- `list` — select all posts ordered by date desc
- `bySlug` — input `{ slug: z.string() }`, returns single post or null

Registered as `blog` namespace in `appRouter`.

**`packages/db/src/seed.ts`:** Inserts 3 placeholder posts (idempotent).

**Database:** EasyPanel PostgreSQL at `43.133.136.49:5432`, credential in `docs/context/note.md` (never committed). Local dev uses `.env` override.

---

### Section 6 — Blog Pages

**`blog/+page.server.ts`:** Load function calls `serverClient.blog.list()` via oRPC server-side client, returns `{ posts }`. `prerender = false`.

**`blog/+page.svelte`:**

- Back link, Title "Blog", Subtitle
- `{#each posts as post (post.slug)}` with stagger `transition:fly` from left
- Each item: date + title (hover accent) + description + arrow icon slide-in
- `-mx-4` hover area with bg-secondary/50 + border

**`blog/[slug]/+page.server.ts`:** Load calls `serverClient.blog.bySlug({ slug: params.slug })`. `error(404)` if null.

**`blog/[slug]/+page.svelte`:**

- Back link, Title, Meta row (date • readingTime)
- Content renderer (simple per-line parser: `##` → h2, `###` → h3, `-` → li, else → p)
- Footer border-top + "All posts" link

**SEO:** `<svelte:head>` per page with title/description meta.

**Component created:** `BlogListItem.svelte`

---

### Section 7 — Contact Page

**`packages/db/src/schema/contact.ts`:**

```ts
contacts: id (serial PK), name, email, subject, message, created_at
```

**`contact/+page.server.ts`:** Form action:

- Zod schema: name (min 2), email (valid), subject (min 3), message (min 10)
- On validation fail: `fail(400, { errors, values })` — per-field messages
- On success: `db.insert(contacts).values(...)`, return `{ success: true }`

**`contact/+page.svelte`:** Two-column grid at `md+`:

- Left: Title "Get in touch", Subtitle, Email mailto link (accent), Availability indicator (green dot CSS pulse + "Currently available"), Social pills (rounded-full, Whisper Gray, hover lift)
- Right: Form fields (Name, Email, Subject, Message textarea 5 rows). Styling: rounded-lg, border, focus:ring accent. Submit button full-width with Send icon (lucide-svelte). `use:enhance` for progressive enhancement — loading state via callback, per-field error display, custom success toast ($state + auto-clear 5s).
- Mobile: single-column stack

**Component created:** `SocialPill.svelte`

---

### Section 8 — Error Page

**`src/routes/+error.svelte`:**

- Centered vertically (`min-h-[50vh]`)
- Status code large (text-6xl)
- Error message (muted)
- "Go back home" link with link-underline animation

---

### Section 9 — Cleanup

**Removed:** `components/Header.svelte`, old `+layout.svelte` (QueryClientProvider + SvelteQueryDevtools), old `+page.svelte` demo content, `src/lib/index.ts`.

**Kept:** `src/routes/rpc/+server.ts` (oRPC transport), `src/lib/orpc.ts` + `orpc.server.ts` (oRPC client setup), `src/lib/index.ts`.

---

## Animation Strategy (Framer Motion → CSS + Svelte)

| Effect | Implementation |
|--------|---------------|
| Page stagger entrance | `transition:fly` + `--i` CSS custom property for delay |
| Profile hover | CSS `:hover` scale(1.1) + `@keyframes` wave emoji |
| Icon group hover | CSS `:hover` on parent → child `translateX` expand |
| Individual icon spring | CSS `transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Theme toggle ripple | View Transitions API (`document.startViewTransition`) |
| Blog item stagger | `transition:fly` from left |
| Social pill lift | CSS `:hover` translateY(-2px) + scale(1.05) |
| Availability dot pulse | CSS `@keyframes` scale + opacity |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all above |

---

## Dependencies Added

| Package | Purpose |
|---------|---------|
| `@selemondev/svgl-svelte` | Brand icons (Next.js, React, TypeScript, GitHub, etc.) |
| `lucide-svelte` | UI icons (Sun, Moon, ArrowLeft, Send) |

---

## Verification

```bash
bun install
bun run check-types           # TypeScript monorepo
bun run -F web check          # SvelteKit sync + svelte-check
bun run db:push               # Push blog + contacts tables
bun run packages/db/src/seed.ts  # Seed blog posts
bun run dev                   # Manual smoke test
```

---

## Implementation Order (Dependency Graph)

```
1. Design tokens + app.css
2. Root layout + ThemeToggle
3. Home page + ProfilePhoto + ProjectCard
4. Stack page
5. Blog DB schema + seed
6. Blog oRPC router
7. Blog pages (list + detail)
8. Contact DB schema
9. Contact page + SocialPill
10. Error page
11. Final cleanup + verification
```

---

## Risks & Notes

- **Icon library performance:** `@selemondev/svgl-svelte` is component-per-icon. Mitigation: named imports only, each page imports ≤10 icons. Monitor Vite pre-bundling time; Iconify CSS is fallback.
- **oRPC server client in load functions:** `createRouterClient` is instantiated per request — this is by design (no shared server state).
- **DB credentials:** `docs/context/note.md` must never be committed. `.env` added to `.gitignore` if not already.
- **EasyPanel host:** `43.133.136.49:5432` — ensure firewall allows inbound from dev machine IP.
- **TanStack Query:** kept in dependencies but no longer used by portfolio pages. Can remove in future cleanup if confirmed unused.

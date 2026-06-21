# Portfolio SvelteKit Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio-minimalist website from Next.js into the SvelteKit monorepo with real PostgreSQL backends for Blog and Contact.

**Architecture:** SvelteKit 5 runes mode + Tailwind CSS 4 OKLCH tokens + oRPC server-side procedures + Drizzle ORM. Single-column layout (max-w-xl), no global nav, floating theme toggle. Pages: Home (static), Stack (static), Blog (DB-backed), Contact (DB-backed form action), Error.

**Tech Stack:** SvelteKit 2.58, Svelte 5.55, Tailwind 4, Plus Jakarta Sans, Drizzle ORM, oRPC, PostgreSQL (EasyPanel), Zod, marked, @selemondev/svgl-svelte, lucide-svelte, Bun.

**Spec:** `docs/superpowers/specs/2026-06-20-portfolio-svelte-rebuild-design.md`

---

## File Map

### Apps/Web — Created

| File | Purpose |
|------|---------|
| `apps/web/src/lib/components/ThemeToggle.svelte` | Dark/light toggle with View Transitions ripple |
| `apps/web/src/lib/components/ProfilePhoto.svelte` | Avatar 48×48 + wave emoji hover |
| `apps/web/src/lib/components/ProjectCard.svelte` | Compact project card for Home |
| `apps/web/src/lib/components/SocialPill.svelte` | Pill button for social links |
| `apps/web/src/lib/components/BlogListItem.svelte` | Blog list item with hover + `transition:fly` |
| `apps/web/src/routes/stack/+page.svelte` | Stack/tools page |
| `apps/web/src/routes/blog/+page.server.ts` | Blog list load (oRPC) |
| `apps/web/src/routes/blog/+page.svelte` | Blog list page |
| `apps/web/src/routes/blog/[slug]/+page.server.ts` | Blog detail load (oRPC + marked) |
| `apps/web/src/routes/blog/[slug]/+page.svelte` | Blog detail page |
| `apps/web/src/routes/contact/+page.server.ts` | Contact form action + Zod |
| `apps/web/src/routes/contact/+page.svelte` | Contact form page |
| `apps/web/src/routes/+error.svelte` | Error/404 page |

### Apps/Web — Modified

| File | Change |
|------|--------|
| `apps/web/src/app.css` | Replace with OKLCH tokens + View Transitions CSS |
| `apps/web/src/app.html` | Add FOUC script, Plus Jakarta Sans preconnect |
| `apps/web/src/routes/+layout.svelte` | Replace with shell layout |
| `apps/web/src/routes/+page.svelte` | Replace with Home page |
| `apps/web/.env` | Update DATABASE_URL to EasyPanel (**DO NOT COMMIT**) |
| `apps/web/package.json` | Add svgl-svelte, lucide-svelte, marked deps |

### Apps/Web — Deleted

| File | Reason |
|------|--------|
| `apps/web/src/components/Header.svelte` | No global nav in portfolio |
| `apps/web/src/lib/index.ts` | Boilerplate export |

### Packages/DB — Created

| File | Purpose |
|------|---------|
| `packages/db/src/schema/blog.ts` | `posts` table |
| `packages/db/src/schema/contact.ts` | `contacts` table |
| `packages/db/src/seed.ts` | Seed 3 blog posts |

### Packages/DB — Modified

| File | Change |
|------|--------|
| `packages/db/src/schema/index.ts` | Export `posts`, `contacts` |
| `packages/db/package.json` | Add `"./schema"` export + `"seed"` script |

### Packages/API — Created

| File | Purpose |
|------|---------|
| `packages/api/src/routers/blog.ts` | `list` + `bySlug` procedures |

### Packages/API — Modified

| File | Change |
|------|--------|
| `packages/api/src/routers/index.ts` | Merge `blogRouter` into `appRouter` |

### Assets

| Action | File |
|--------|------|
| project | `docs\context\profile.webp` |
| project | `docs\context\trio_motor_logo.jpeg` |

> **Note on svgl-svelte icon names:** The PascalCase export names must match the svgl.app catalog. If any import fails at build, check `node_modules/@selemondev/svgl-svelte/dist/` for actual export names (e.g., `TypeScript` vs `Typescript`, `LinkedIn` vs `Linkedin`, `PostgreSQL` vs `Postgresql`, `GitHub` vs `Github`). Task 1 Step 2b verifies this upfront.

---

## Task 1: Environment & Dependencies

- [ ] **Step 1: Update DATABASE_URL (DO NOT COMMIT)**

File: `apps/web/.env`

Replace line:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

With:

```
DATABASE_URL=postgres://febrian:zht6037rzezdxkepnsit@43.133.136.49:5432/postgress-db?sslmode=disable
```

Run: `cat apps/web/.env | grep DATABASE_URL`
Expected: Shows the EasyPanel URL

> ⚠️ **CRITICAL:** This file contains database credentials. It must NOT be committed. Verify `.gitignore` excludes `.env`: run `git check-ignore apps/web/.env`. This file is modified locally only and NOT included in the commit at Step 4.

- [ ] **Step 2: Add npm dependencies**

Run: `cd apps/web && bun add @selemondev/svgl-svelte lucide-svelte marked`
Expected: `bun add` success, `package.json` updated with 3 new dependencies

- [ ] **Step 2b: Verify svgl-svelte named exports**

Run:

```bash
cd apps/web && node -e "
const icons = require('@selemondev/svgl-svelte');
const names = ['NextJs','React','Typescript','Github','Instagram','Linkedin','X','Windsurf','Claude','Warp','Brave','Figma','Notion','Tailwindcss','Postgresql','Prisma','Vercel','Bun'];
names.forEach(n => console.log(n, ':', typeof icons[n]));
"
```

Expected: All names resolve as `function`. If any name is `undefined`, find the correct PascalCase name from the [svgl.app](https://svgl.app/) catalog and update the plan imports before proceeding.

- [ ] **Step 3: Verify clean install**

Run: `bun install`
Expected: No errors, lockfile updated

- [ ] **Step 4: Commit (env excluded)**

```bash
git add apps/web/package.json bun.lock
git commit -m "chore: add portfolio dependencies (svgl-svelte, lucide-svelte, marked)"
```

> `.env` is intentionally excluded — it contains database credentials.

---

## Task 2: Design System — app.css + app.html

- [ ] **Step 1: Replace app.css with OKLCH design tokens and View Transitions CSS**

File: `apps/web/src/app.css` (replace all content)

```css
@import "tailwindcss";

/* ============================================
   Design Tokens — OKLCH Color Space
   ============================================ */

/* Light mode (default) */
:root {
  --color-bg: oklch(1 0 0);
  --color-fg: oklch(0.25 0 0);
  --color-primary: oklch(0.33 0 0);
  --color-secondary: oklch(0.96 0 0);
  --color-border: oklch(0.92 0 0);
  --color-muted: oklch(0.52 0 0);
  --color-accent: oklch(0.7 0.16 240);
  --color-destructive: oklch(0.55 0.2 25);
  --radius-base: 0.625rem;
  --font-sans: "Plus Jakarta Sans", sans-serif;
}

/* Dark mode */
.dark {
  --color-bg: oklch(0.25 0 0);
  --color-fg: oklch(0.96 0 0);
  --color-primary: oklch(0.96 0 0);
  --color-secondary: oklch(0.33 0 0);
  --color-border: oklch(1 0 0 / 0.1);
  --color-muted: oklch(0.43 0 0);
}

/* ============================================
   Tailwind 4 @theme — bind tokens to utilities
   ============================================ */

@theme {
  --color-bg: var(--color-bg);
  --color-fg: var(--color-fg);
  --color-primary: var(--color-primary);
  --color-secondary: var(--color-secondary);
  --color-border: var(--color-border);
  --color-muted: var(--color-muted);
  --color-accent: var(--color-accent);
  --color-destructive: var(--color-destructive);
  --radius-base: var(--radius-base);
}

/* ============================================
   Base styles
   ============================================ */

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-fg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================================
   Utilities
   ============================================ */

.link-underline {
  position: relative;
  text-decoration: none;
  color: var(--color-fg);
}

.link-underline::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 1px;
  background-color: var(--color-accent);
  transition: width 0.25s ease;
}

.link-underline:hover::after {
  width: 100%;
}

/* ============================================
   View Transitions — Theme Ripple
   ============================================ */

.theme-toggle {
  view-transition-name: theme-toggle;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}

::view-transition-new(root) {
  animation: clip-reveal 1s ease-in-out;
}

@keyframes clip-reveal {
  from {
    clip-path: circle(0 at var(--tx) var(--ty));
  }
  to {
    clip-path: circle(200vmax at var(--tx) var(--ty));
  }
}

/* ============================================
   Reduced Motion
   ============================================ */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  ::view-transition-new(root) {
    animation: none;
  }
}
```

- [ ] **Step 2: Update app.html — add FOUC script, Plus Jakarta Sans, remove preload-data**

File: `apps/web/src/app.html` (replace all content)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
      rel="stylesheet"
    />
    %sveltekit.head%
  </head>
  <body>
    <script>
      (function () {
        var stored = localStorage.getItem("theme");
        var prefersDark = matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (stored === "dark" || (!stored && prefersDark)) {
          document.documentElement.classList.add("dark");
        }
      })();
    </script>
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 3: Verify Svelte check passes**

Run: `bun run -F web check`
Expected: 0 errors, 0 warnings

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app.css apps/web/src/app.html
git commit -m "feat: add OKLCH design tokens, Plus Jakarta Sans, FOUC prevention"
```

---

## Task 3: Root Layout + ThemeToggle

- [ ] **Step 1: Delete Header.svelte**

Run: `rm -f apps/web/src/components/Header.svelte`
Expected: File removed (idempotent — no error if already absent)

- [ ] **Step 2: Create ThemeToggle.svelte**

File: `apps/web/src/lib/components/ThemeToggle.svelte`

```svelte
<script lang="ts">
  import { Sun, Moon } from "lucide-svelte";

  let isDark = $state(false);

  function syncTheme() {
    isDark = document.documentElement.classList.contains("dark");
  }

  $effect(() => {
    syncTheme();
  });

  function toggle() {
    const root = document.documentElement;
    const isReduced = matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function apply() {
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
      isDark = root.classList.contains("dark");
    }

    if (!document.startViewTransition || isReduced) {
      apply();
      return;
    }

    const rect = document
      .querySelector(".theme-toggle")!
      .getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.documentElement.style.setProperty("--tx", `${x}px`);
    document.documentElement.style.setProperty("--ty", `${y}px`);

    document.startViewTransition(() => apply());
  }
</script>

<button
  class="theme-toggle fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg/80 backdrop-blur-sm hover:bg-accent/10 transition-colors"
  onclick={toggle}
  aria-label="Toggle theme"
>
  {#if isDark}
    <Sun class="h-5 w-5" />
  {:else}
    <Moon class="h-5 w-5" />
  {/if}
</button>
```

- [ ] **Step 3: Replace root +layout.svelte**

File: `apps/web/src/routes/+layout.svelte` (replace all content)

```svelte
<script lang="ts">
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import "../app.css";

  let { children } = $props();
</script>

<main class="mx-auto max-w-xl px-6 py-20 sm:py-32">
  {@render children()}
</main>

<ThemeToggle />
```

- [ ] **Step 4: Verify Svelte check passes**

Run: `bun run -F web check`
Expected: 0 errors, 0 warnings

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/components/ThemeToggle.svelte apps/web/src/routes/+layout.svelte
git rm apps/web/src/components/Header.svelte 2>/dev/null || true
git commit -m "feat: add root layout shell and ThemeToggle with View Transitions ripple"
```

---

## Task 4: Copy Static Assets

- [ ] **Step 1: Copy images from Next.js project**

Copy these files from the Next.js portfolio `apps/web/` to the SvelteKit project:

- `profile-photo-2.webp` → `apps/web/static/images/profile-photo-2.webp`
- `trio-motor-logo.jpeg` → `apps/web/static/images/trio-motor-logo.jpeg`

If the Next.js source is not accessible, create placeholder images or obtain them from the designer.

Run: `ls apps/web/static/images/`
Expected: Shows both image files

- [ ] **Step 2: Commit**

```bash
git add apps/web/static/images/
git commit -m "assets: add profile photo and Trio Motor logo"
```

---

## Task 5: Home Page — ProfilePhoto + ProjectCard with staggered entrance animations

- [ ] **Step 1: Create ProfilePhoto.svelte**

File: `apps/web/src/lib/components/ProfilePhoto.svelte`

```svelte
<script lang="ts">
  let { src, alt = "Profile photo" } = $props<{
    src: string;
    alt?: string;
  }>();
</script>

<div class="group relative inline-block align-middle">
  <img
    {src}
    {alt}
    class="h-12 w-12 rounded-full border border-border object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-200 group-hover:scale-110"
    width="48"
    height="48"
  />
  <span
    class="pointer-events-none absolute -right-1 -top-1 text-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-safe:group-hover:animate-[wave_0.5s_ease-in-out_infinite]"
    aria-hidden="true"
  >
    👋
  </span>
</div>

<style>
  @keyframes wave {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(20deg);
    }
    75% {
      transform: rotate(-20deg);
    }
  }
</style>
```

- [ ] **Step 2: Create ProjectCard.svelte**

File: `apps/web/src/lib/components/ProjectCard.svelte`

```svelte
<script lang="ts">
  let { title, description, href } = $props<{
    title: string;
    description: string;
    href: string;
  }>();
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="block rounded-lg border border-border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary/50"
>
  <span class="font-medium text-accent">{title}</span>
  <span class="mx-2 text-muted">—</span>
  <span class="text-sm text-muted">{description}</span>
</a>
```

- [ ] **Step 3: Create Home page with staggered fly animations**

File: `apps/web/src/routes/+page.svelte` (replace all content)

```svelte
<script lang="ts">
  import { fly } from "svelte/transition";
  import {
    NextJs,
    React,
    Typescript,
    Github,
    Instagram,
    Linkedin,
    X,
  } from "@selemondev/svgl-svelte";
  import ProfilePhoto from "$lib/components/ProfilePhoto.svelte";
  import ProjectCard from "$lib/components/ProjectCard.svelte";

  const projects = [
    {
      title: "Project One",
      description: "A brief description of the first project",
      href: "#",
    },
    {
      title: "Project Two",
      description: "A brief description of the second project",
      href: "#",
    },
  ];

  const homeSections = [
    "intro",
    "what-i-do",
    "work",
    "tech",
    "social",
    "projects",
    "cta",
  ];

  const techIcons = [
    { component: NextJs, label: "Next.js" },
    { component: React, label: "React" },
    { component: Typescript, label: "TypeScript" },
  ];

  const socialIcons = [
    { component: Github, label: "GitHub", href: "https://github.com/" },
    {
      component: Instagram,
      label: "Instagram",
      href: "https://instagram.com/",
    },
    {
      component: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/",
    },
    { component: X, label: "X", href: "https://x.com/" },
  ];
</script>

<svelte:head>
  <title>Febrian Bayu Nugroho — Software Engineer</title>
  <meta
    name="description"
    content="Personal portfolio of Febrian Bayu Nugroho — Software Engineer building web applications and SaaS products."
  />
</svelte:head>

<div class="space-y-12">
  {#each homeSections as section, i}
    {@const delay = i * 100}
    {#if section === "intro"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          Hi, my name is
          <span class="font-semibold">Febrian Bayu Nugroho</span>
          <ProfilePhoto src="/images/profile-photo-2.webp" />
        </p>
      </section>
    {:else if section === "what-i-do"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          I build <span class="font-semibold">web applications</span>
          and
          <span class="font-semibold">SaaS products</span>.
        </p>
      </section>
    {:else if section === "work"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          I'm a Mid Software Engineer at
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 align-middle"
          >
            <img
              src="/images/trio-motor-logo.jpeg"
              alt="Trio Motor logo"
              class="inline-block h-8 w-8 rounded-lg border border-border object-cover shadow-sm"
              style="transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
              width="32"
              height="32"
            />
          </a>
          <style>
            a:hover img {
              transform: scale(1.1) rotate(3deg);
            }
          </style>
        </p>
      </section>
    {:else if section === "tech"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          <span class="mr-2">I work with</span>
          <span class="group inline-flex items-center align-middle">
            {#each techIcons as icon, j}
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 group-hover:ml-1 {j > 0 ? '-ml-2' : ''}"
              >
                <icon.component
                  width={36}
                  height={36}
                  class="transition-transform duration-300 group-hover:rotate-0 dark:invert"
                  style="transform: rotate(-6deg)"
                  aria-label={icon.label}
                />
              </span>
            {/each}
          </span>
        </p>
      </section>
    {:else if section === "social"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          <span class="mr-2">Find me on</span>
          <span class="group inline-flex items-center align-middle">
            {#each socialIcons as icon, j}
              <a
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 group-hover:ml-1 {j > 0 ? '-ml-2' : ''}"
                aria-label={icon.label}
              >
                <icon.component
                  width={36}
                  height={36}
                  class="transition-transform duration-300 group-hover:rotate-0 dark:invert"
                  style="transform: rotate(-6deg)"
                />
              </a>
            {/each}
          </span>
        </p>
      </section>
    {:else if section === "projects"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <div class="space-y-4">
          <p class="text-2xl leading-8">
            <span class="font-semibold">Projects</span>
          </p>
          <div class="flex flex-row flex-wrap gap-3">
            {#each projects as project}
              <ProjectCard
                title={project.title}
                description={project.description}
                href={project.href}
              />
            {/each}
          </div>
        </div>
      </section>
    {:else if section === "cta"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          Want to see what I use?
          <a href="/stack" class="text-accent hover:underline">Click here.</a>
        </p>
      </section>
    {/if}
  {/each}

  <!-- Separator -->
  <hr class="mt-20 border-dashed border-border" />

  <!-- Footer links -->
  <section class="space-y-1 text-sm">
    <p>
      <a href="/blog" class="text-muted hover:text-fg transition-colors">
        Read my blog →
      </a>
    </p>
    <p>
      <a href="/contact" class="text-muted hover:text-fg transition-colors">
        Get in touch →
      </a>
    </p>
  </section>
</div>

<style>
  @media (prefers-reduced-motion: reduce) {
    section {
      animation: none !important;
    }
  }
</style>
```

- [ ] **Step 4: Verify Svelte check passes**

Run: `bun run -F web check`
Expected: 0 errors, 0 warnings

- [ ] **Step 5: Dev smoke test**

Run: `bun run dev`
Expected: Open `http://localhost:5173` — see Home page with staggered fly-in sections, profile photo with wave, tech icons (overlap hover), project cards

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/components/ProfilePhoto.svelte apps/web/src/lib/components/ProjectCard.svelte apps/web/src/routes/+page.svelte
git commit -m "feat: add Home page with staggered fly animations, ProfilePhoto, ProjectCard"
```

---

## Task 6: Stack Page

- [ ] **Step 1: Create Stack page**

File: `apps/web/src/routes/stack/+page.svelte`

```svelte
<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import {
    Windsurf,
    Claude,
    Warp,
    Brave,
    Figma,
    Notion,
    NextJs,
    React,
    Typescript,
    Tailwindcss,
    Postgresql,
    Prisma,
    Vercel,
    Bun,
  } from "@selemondev/svgl-svelte";

  interface StackItem {
    icon: typeof Windsurf;
    name: string;
    description: string;
    href?: string;
  }

  const lifeTools: StackItem[] = [
    {
      icon: Windsurf,
      name: "Windsurf",
      description: "AI-powered IDE",
      href: "#",
    },
    {
      icon: Claude,
      name: "Claude",
      description: "AI assistant",
      href: "#",
    },
    { icon: Warp, name: "Warp", description: "Modern terminal", href: "#" },
    {
      icon: Brave,
      name: "Brave",
      description: "Privacy-first browser",
      href: "#",
    },
    { icon: Figma, name: "Figma", description: "Design tool", href: "#" },
    {
      icon: Notion,
      name: "Notion",
      description: "Knowledge base",
      href: "#",
    },
  ];

  const appTools: StackItem[] = [
    {
      icon: NextJs,
      name: "Next.js",
      description: "Web framework",
      href: "#",
    },
    { icon: React, name: "React", description: "UI library", href: "#" },
    {
      icon: Typescript,
      name: "TypeScript",
      description: "Type-safe JavaScript",
      href: "#",
    },
    {
      icon: Tailwindcss,
      name: "Tailwind CSS",
      description: "Utility-first CSS",
      href: "#",
    },
    {
      icon: Postgresql,
      name: "PostgreSQL",
      description: "Relational database",
      href: "#",
    },
    {
      icon: Prisma,
      name: "Prisma",
      description: "Type-safe ORM",
      href: "#",
    },
    {
      icon: Vercel,
      name: "Vercel",
      description: "Deployment platform",
      href: "#",
    },
    {
      icon: Bun,
      name: "Bun",
      description: "JavaScript runtime",
      href: "#",
    },
  ];
</script>

<svelte:head>
  <title>Stack — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Tools and services Febrian Bayu Nugroho uses to build apps and power his life."
  />
</svelte:head>

<div class="space-y-12">
  <!-- Back link -->
  <a href="/" class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors">
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <!-- Avatar -->
  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
    <span class="text-sm font-medium text-muted">FB</span>
  </div>

  <!-- Heading -->
  <p class="text-2xl leading-8">
    Here are the tools and services I use to build my apps and power them.
  </p>

  <!-- Life Tools -->
  <div class="space-y-4">
    <h2 class="text-lg font-medium">Things that power my life</h2>
    <div class="space-y-4">
      {#each lifeTools as tool}
        {#if tool.href}
          <a
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3"
          >
            <tool.icon width={20} height={20} class="dark:invert shrink-0" />
            <span class="font-medium hover:text-accent transition-colors">
              {tool.name}
            </span>
            <span class="text-sm text-muted">→ {tool.description}</span>
          </a>
        {:else}
          <div class="flex items-center gap-3">
            <tool.icon width={20} height={20} class="dark:invert shrink-0" />
            <span class="font-medium">{tool.name}</span>
            <span class="text-sm text-muted">→ {tool.description}</span>
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- App Tools -->
  <div class="space-y-4">
    <h2 class="text-lg font-medium">Things that power my apps</h2>
    <div class="space-y-4">
      {#each appTools as tool}
        {#if tool.href}
          <a
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3"
          >
            <tool.icon width={20} height={20} class="dark:invert shrink-0" />
            <span class="font-medium hover:text-accent transition-colors">
              {tool.name}
            </span>
            <span class="text-sm text-muted">→ {tool.description}</span>
          </a>
        {:else}
          <div class="flex items-center gap-3">
            <tool.icon width={20} height={20} class="dark:invert shrink-0" />
            <span class="font-medium">{tool.name}</span>
            <span class="text-sm text-muted">→ {tool.description}</span>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify Svelte check passes**

Run: `bun run -F web check`
Expected: 0 errors, 0 warnings

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/stack/+page.svelte
git commit -m "feat: add Stack page with life and app tools"
```

---

## Task 7: Blog Database Schema + Seed

- [ ] **Step 1: Create blog schema**

File: `packages/db/src/schema/blog.ts`

```ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  readingTime: text("reading_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

- [ ] **Step 2: Update schema index to export posts**

File: `packages/db/src/schema/index.ts`

Replace `export {};` with:

```ts
export { posts } from "./blog";
```

- [ ] **Step 3: Create seed script**

File: `packages/db/src/seed.ts`

```ts
import { db } from "./index";
import { posts } from "./schema/blog";
import { eq } from "drizzle-orm";

const seedPosts = [
  {
    slug: "building-a-saas-with-nextjs-16",
    title: "Building a SaaS with Next.js 16",
    description:
      "Lessons learned from building a production SaaS application with the latest Next.js features.",
    content:
      "## Getting Started\n\nNext.js 16 brings significant improvements to the developer experience.\n\n### Server Components\n\nServer Components are now the default, which means better performance out of the box.\n\n### Key Takeaways\n\n- Use Server Components by default\n- Add 'use client' only when needed\n- Leverage streaming for optimal UX",
    date: "2025-06-15",
    readingTime: "4 min read",
  },
  {
    slug: "a-practical-guide-to-react-19-actions",
    title: "A Practical Guide to React 19 Actions",
    description:
      "How to use React 19 Actions and useActionState for forms, mutations, and more.",
    content:
      "## What Are Actions?\n\nActions provide a way to handle form submissions and data mutations with built-in pending states.\n\n### Basic Example\n\n```tsx\nconst [state, formAction] = useActionState(submitForm, initialState);\n```\n\n### Benefits\n\n- Automatic pending states\n- Progressive enhancement\n- Works without JavaScript",
    date: "2025-05-20",
    readingTime: "6 min read",
  },
  {
    slug: "mastering-tailwind-css-v4-with-oklch",
    title: "Mastering Tailwind CSS v4 with OKLCH",
    description:
      "Deep dive into OKLCH color space and how to leverage it in Tailwind CSS v4.",
    content:
      "## Why OKLCH?\n\nOKLCH provides perceptually uniform colors that look consistent across different hues.\n\n### Setting Up\n\nTailwind v4 supports OKLCH natively through CSS-first configuration.\n\n### Dark Mode\n\nOKLCH makes dark mode color balancing much simpler because lightness is separated from chroma and hue.",
    date: "2025-03-10",
    readingTime: "5 min read",
  },
];

async function main() {
  console.log("Seeding blog posts...");

  for (const post of seedPosts) {
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, post.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(posts).values(post);
      console.log(`  Inserted: ${post.slug}`);
    } else {
      console.log(`  Skipped (exists): ${post.slug}`);
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
```

- [ ] **Step 4: Add schema export + seed script to db package.json**

File: `packages/db/package.json`

Add `"seed"` to `"scripts"`:

```json
"seed": "bun run src/seed.ts"
```

Add explicit `"./schema"` export to `"exports"`:

```json
"./schema": {
  "default": "./src/schema/index.ts"
}
```

The exports map should now be:

```json
"exports": {
  ".": { "default": "./src/index.ts" },
  "./schema": { "default": "./src/schema/index.ts" },
  "./*": { "default": "./src/*.ts" }
}
```

> **Why the schema export:** `./*` → `./src/*.ts` would resolve `@febriannugroho/db/schema` to `./src/schema.ts` (non-existent file, `schema` is a directory). The explicit `./schema` entry maps it to `./src/schema/index.ts`.

- [ ] **Step 5: Push schema to database**

Run: `bun run db:push`
Expected: Schema pushed, `posts` table created

- [ ] **Step 6: Run seed**

Run: `bun run -F @febriannugroho/db seed`
Expected: 3 posts inserted (or "Skipped" if already there)

- [ ] **Step 7: Commit**

```bash
git add packages/db/src/schema/blog.ts packages/db/src/schema/index.ts packages/db/src/seed.ts packages/db/package.json
git commit -m "feat: add blog posts schema, schema export, seed script"
```

---

## Task 8: Blog oRPC Router

- [ ] **Step 1: Create blog router**

File: `packages/api/src/routers/blog.ts`

```ts
import { z } from "zod";
import { publicProcedure } from "../index";
import { db } from "@febriannugroho/db";
import { posts } from "@febriannugroho/db/schema";
import { desc, eq } from "drizzle-orm";

export const blogRouter = {
  list: publicProcedure.handler(async () => {
    return db.select().from(posts).orderBy(desc(posts.date));
  }),

  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .handler(async ({ input }) => {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      return result[0] ?? null;
    }),
};
```

- [ ] **Step 2: Merge blogRouter into appRouter**

File: `packages/api/src/routers/index.ts`

Replace current content with:

```ts
import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { blogRouter } from "./blog";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  blog: blogRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
```

- [ ] **Step 3: Verify types**

Run: `bun run check-types`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add packages/api/src/routers/blog.ts packages/api/src/routers/index.ts
git commit -m "feat: add blog oRPC router with list and bySlug procedures"
```

---

## Task 9: Blog Pages

- [ ] **Step 1: Create blog list load function**

File: `apps/web/src/routes/blog/+page.server.ts`

```ts
import { createRouterClient } from "@orpc/server";
import { appRouter } from "@febriannugroho/api/routers/index";
import { createContext } from "@febriannugroho/api/context";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const serverClient = createRouterClient(appRouter, {
    context: async () =>
      createContext({ headers: event.request.headers }),
  });

  const posts = await serverClient.blog.list();
  return { posts };
};

export const prerender = false;
```

- [ ] **Step 2: Create BlogListItem component with staggered fly animation**

File: `apps/web/src/lib/components/BlogListItem.svelte`

```svelte
<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import { fly } from "svelte/transition";

  let { date, title, description, slug, index = 0 } = $props<{
    date: string;
    title: string;
    description: string;
    slug: string;
    index?: number;
  }>();
</script>

<a
  href="/blog/{slug}"
  class="group -mx-4 block rounded-2xl border border-transparent px-4 py-3 transition-all duration-200 hover:border-border hover:bg-secondary/50"
  in:fly={{ x: -20, duration: 300, delay: index * 100 }}
>
  <span class="text-sm text-muted">{date}</span>
  <span class="ml-3 font-medium group-hover:text-accent transition-colors">
    {title}
  </span>
  <span
    class="ml-2 inline-flex items-center text-sm text-muted opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5"
  >
    <span class="hidden sm:inline">{description}</span>
    <ArrowRight class="ml-1 h-4 w-4 shrink-0" />
  </span>
</a>
```

- [ ] **Step 3: Create blog list page**

File: `apps/web/src/routes/blog/+page.svelte`

```svelte
<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import BlogListItem from "$lib/components/BlogListItem.svelte";
  import type { PageProps } from "./$types";

  let { data } = $props<PageProps>();
</script>

<svelte:head>
  <title>Blog — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Thoughts on software engineering, design, and building products."
  />
</svelte:head>

<div class="space-y-8">
  <!-- Back link -->
  <a
    href="/"
    class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <!-- Header -->
  <div>
    <h1 class="text-3xl font-semibold tracking-tight">Blog</h1>
    <p class="mt-2 text-muted">
      Thoughts on software engineering, design, and building products.
    </p>
  </div>

  <!-- Post list -->
  <div class="space-y-1">
    {#each data.posts as post, i (post.slug)}
      <BlogListItem
        date={post.date}
        title={post.title}
        description={post.description}
        slug={post.slug}
        index={i}
      />
    {/each}
  </div>
</div>
```

- [ ] **Step 4: Create blog detail load function**

File: `apps/web/src/routes/blog/[slug]/+page.server.ts`

```ts
import { createRouterClient } from "@orpc/server";
import { appRouter } from "@febriannugroho/api/routers/index";
import { createContext } from "@febriannugroho/api/context";
import { error } from "@sveltejs/kit";
import { marked } from "marked";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const serverClient = createRouterClient(appRouter, {
    context: async () =>
      createContext({ headers: event.request.headers }),
  });

  const post = await serverClient.blog.bySlug({
    slug: event.params.slug,
  });

  if (!post) {
    error(404, "Post not found");
  }

  const htmlContent = await marked(post.content);

  return { post: { ...post, htmlContent } };
};

export const prerender = false;
```

- [ ] **Step 5: Create blog detail page**

File: `apps/web/src/routes/blog/[slug]/+page.svelte`

```svelte
<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import type { PageProps } from "./$types";

  let { data } = $props<PageProps>();
</script>

<svelte:head>
  <title>{data.post.title} — Febrian Bayu Nugroho</title>
  <meta name="description" content={data.post.description} />
</svelte:head>

<article class="space-y-8">
  <!-- Back link -->
  <a
    href="/blog"
    class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to blog
  </a>

  <!-- Title -->
  <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
    {data.post.title}
  </h1>

  <!-- Meta -->
  <div class="text-sm text-muted">
    {data.post.date} &bull; {data.post.readingTime}
  </div>

  <!-- Content -->
  <div class="prose-custom space-y-4 leading-relaxed">
    {@html data.post.htmlContent}
  </div>

  <!-- Footer -->
  <div class="border-t border-border pt-6">
    <a
      href="/blog"
      class="text-sm text-muted hover:text-fg transition-colors"
    >
      &larr; All posts
    </a>
  </div>
</article>

<style>
  .prose-custom :global(h2) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }

  .prose-custom :global(h3) {
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .prose-custom :global(p) {
    line-height: 1.75;
  }

  .prose-custom :global(ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
  }

  .prose-custom :global(li) {
    margin-top: 0.25rem;
  }

  .prose-custom :global(pre) {
    background: var(--color-secondary);
    border-radius: var(--radius-base);
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.875rem;
  }

  .prose-custom :global(code) {
    font-size: 0.875rem;
    background: var(--color-secondary);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .prose-custom :global(pre code) {
    background: transparent;
    padding: 0;
  }
</style>
```

- [ ] **Step 6: Verify types and Svelte check**

Run: `bun run check-types && bun run -F web check`
Expected: 0 errors

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/routes/blog/ apps/web/src/lib/components/BlogListItem.svelte
git commit -m "feat: add blog list and detail pages with oRPC SSR + marked rendering + staggered fly"
```

---

## Task 10: Contact Database Schema

- [ ] **Step 1: Create contact schema**

File: `packages/db/src/schema/contact.ts`

```ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

- [ ] **Step 2: Update schema index**

File: `packages/db/src/schema/index.ts`

Replace current content with:

```ts
export { posts } from "./blog";
export { contacts } from "./contact";
```

- [ ] **Step 3: Push schema**

Run: `bun run db:push`
Expected: `contacts` table created

- [ ] **Step 4: Commit**

```bash
git add packages/db/src/schema/contact.ts packages/db/src/schema/index.ts
git commit -m "feat: add contacts schema for contact form"
```

---

## Task 11: Contact Page + SocialPill

- [ ] **Step 1: Create SocialPill component**

File: `apps/web/src/lib/components/SocialPill.svelte`

```svelte
<script lang="ts">
  let {
    href,
    label,
    bgColor = "var(--color-secondary)",
  } = $props<{
    href: string;
    label: string;
    bgColor?: string;
  }>();
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-105"
  style="background-color: {bgColor}"
  aria-label={label}
>
  {label}
</a>
```

- [ ] **Step 2: Create contact form action**

File: `apps/web/src/routes/contact/+page.server.ts`

```ts
import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { db } from "@febriannugroho/db";
import { contacts } from "@febriannugroho/db/schema";
import type { Actions } from "./$types";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = contactSchema.safeParse(data);

    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: data,
      });
    }

    try {
      await db.insert(contacts).values(result.data);
      return { success: true };
    } catch {
      return fail(500, {
        error: "Failed to send message. Please try again.",
      });
    }
  },
};
```

- [ ] **Step 3: Create contact page**

File: `apps/web/src/routes/contact/+page.svelte`

```svelte
<script lang="ts">
  import { ArrowLeft, Send } from "lucide-svelte";
  import { enhance } from "$app/forms";
  import SocialPill from "$lib/components/SocialPill.svelte";
  import type { PageProps } from "./$types";

  let { form } = $props<PageProps>();

  let loading = $state(false);
  let toastMessage = $state("");

  function clearToast() {
    setTimeout(() => {
      toastMessage = "";
    }, 5000);
  }

  const socialLinks = [
    { label: "GitHub", href: "https://github.com/", bgColor: "#181717" },
    { label: "LinkedIn", href: "https://linkedin.com/in/", bgColor: "#0A66C2" },
    { label: "X", href: "https://x.com/", bgColor: "#000000" },
  ];
</script>

<svelte:head>
  <title>Contact — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Get in touch with Febrian Bayu Nugroho. Let's build something great together."
  />
</svelte:head>

<div class="space-y-12">
  <!-- Back link -->
  <a
    href="/"
    class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <div class="grid gap-12 md:grid-cols-2">
    <!-- Left: Contact Info -->
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight">Get in touch</h1>
        <p class="mt-2 text-muted">Let's build something great together.</p>
      </div>

      <div>
        <a href="mailto:fbrnngrh@gmail.com" class="text-accent hover:underline">
          fbrnngrh@gmail.com
        </a>
      </div>

      <!-- Availability -->
      <div class="flex items-center gap-2">
        <span
          class="inline-block h-2.5 w-2.5 rounded-full bg-green-500 motion-safe:animate-[pulse_2s_ease-in-out_infinite]"
          aria-hidden="true"
        ></span>
        <span class="text-sm text-muted">
          Currently available for freelance work
        </span>
      </div>

      <!-- Social pills -->
      <div class="flex flex-wrap gap-3">
        {#each socialLinks as link}
          <SocialPill
            href={link.href}
            label={link.label}
            bgColor={link.bgColor}
          />
        {/each}
      </div>
    </div>

    <!-- Right: Form -->
    <div>
      <form
        method="POST"
        use:enhance={({ cancel }) => {
          loading = true;
          return async ({ result }) => {
            loading = false;
            if (result.type === "success") {
              toastMessage = "Message sent! I'll get back to you soon.";
              clearToast();
            }
          };
        }}
        class="space-y-4"
      >
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            class="w-full rounded-lg border border-border bg-bg px-3 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
            value={form?.values?.name ?? ""}
          />
          {#if form?.errors?.name}
            <p class="mt-1 text-sm text-destructive">{form.errors.name[0]}</p>
          {/if}
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            class="w-full rounded-lg border border-border bg-bg px-3 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
            value={form?.values?.email ?? ""}
          />
          {#if form?.errors?.email}
            <p class="mt-1 text-sm text-destructive">{form.errors.email[0]}</p>
          {/if}
        </div>

        <!-- Subject -->
        <div>
          <label for="subject" class="block text-sm font-medium mb-2">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            class="w-full rounded-lg border border-border bg-bg px-3 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
            value={form?.values?.subject ?? ""}
          />
          {#if form?.errors?.subject}
            <p class="mt-1 text-sm text-destructive">{form.errors.subject[0]}</p>
          {/if}
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-medium mb-2">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            class="w-full rounded-lg border border-border bg-bg px-3 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-shadow resize-y"
          >{form?.values?.message ?? ""}</textarea>
          {#if form?.errors?.message}
            <p class="mt-1 text-sm text-destructive">{form.errors.message[0]}</p>
          {/if}
        </div>

        <!-- DB / Server error -->
        {#if form?.error}
          <p class="text-sm text-destructive">{form.error}</p>
        {/if}

        <!-- Server-rendered success (non-JS fallback) -->
        {#if form?.success}
          <p class="text-sm text-green-500">
            Message sent! I'll get back to you soon.
          </p>
        {/if}

        <!-- Submit -->
        <button
          type="submit"
          disabled={loading}
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {#if loading}
            Sending...
          {:else}
            <Send class="h-4 w-4" />
            Send Message
          {/if}
        </button>
      </form>
    </div>
  </div>
</div>

<!-- Toast -->
{#if toastMessage}
  <div
    class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-6 py-3 text-sm text-bg shadow-lg motion-safe:animate-[fadeIn_0.3s_ease-out]"
  >
    {toastMessage}
  </div>
{/if}

<style>
  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.7;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
</style>
```

- [ ] **Step 4: Verify types and Svelte check**

Run: `bun run check-types && bun run -F web check`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/routes/contact/ apps/web/src/lib/components/SocialPill.svelte
git commit -m "feat: add contact form with Zod validation, DB insert, SocialPill"
```

---

## Task 12: Error Page

- [ ] **Step 1: Create error page**

File: `apps/web/src/routes/+error.svelte`

```svelte
<script lang="ts">
  import { page } from "$app/state";
</script>

<div
  class="flex min-h-[50vh] flex-col items-center justify-center text-center"
>
  <h1 class="text-6xl font-semibold tracking-tight">{page.status}</h1>
  <p class="mt-4 text-muted">{page.error.message}</p>
  <a
    href="/"
    class="mt-8 link-underline text-muted hover:text-fg inline-block"
  >
    Go back home
  </a>
</div>
```

- [ ] **Step 2: Verify Svelte check**

Run: `bun run -F web check`
Expected: 0 errors

- [ ] **Step 3: Verify 404 works**

Run: `bun run dev`, then visit `http://localhost:5173/nonexistent`
Expected: Shows 404 page with "Go back home" link

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/routes/+error.svelte
git commit -m "feat: add custom error/404 page"
```

---

## Task 13: Final Cleanup & Verification

- [ ] **Step 1: Delete boilerplate file**

Run: `rm -f apps/web/src/lib/index.ts`
Expected: File removed (idempotent)

- [ ] **Step 2: Full type check**

Run: `bun run check-types`
Expected: 0 errors across entire monorepo

- [ ] **Step 3: Full Svelte check**

Run: `bun run -F web check`
Expected: 0 errors, 0 warnings

- [ ] **Step 4: Manual smoke test checklist**

Run: `bun run dev` and verify:

| URL | Expected |
|-----|----------|
| `/` | Home: staggered fly-in sections, profile photo with wave hover, tech icons overlap+expand, project cards, footer links |
| `/stack` | Stack: back link, avatar FB, two categories with 14 tools, icons visible |
| `/blog` | Blog list: 3 posts with staggered fly-from-left, hover card states, arrow slide-in |
| `/blog/building-a-saas-with-nextjs-16` | Blog detail: rendered markdown with headings, code blocks, back link |
| `/contact` | Contact: two columns, form fields, availability dot pulsing, social pills |
| `/nonexistent` | 404 page with status code |
| Theme toggle | Ripple transition (Chrome/Edge) or instant switch (other browsers), dark mode persists across page loads |

- [ ] **Step 5: Commit**

```bash
git rm -f apps/web/src/lib/index.ts 2>/dev/null || true
git add -A
git commit -m "chore: remove boilerplate, final verification"
```

---

## Verification Summary

After all tasks:

```bash
bun install                          # Clean dependency install
bun run check-types                  # 0 errors
bun run -F web check                 # 0 errors, 0 warnings
bun run db:push                      # posts + contacts tables exist
bun run -F @febriannugroho/db seed   # 3 posts seeded (idempotent)
bun run dev                          # Manual smoke test all routes
```

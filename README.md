# febriannugroho

A 100% static personal portfolio built with SvelteKit 5, TailwindCSS, and mdsvex for blog posts.

## Features

- **SvelteKit 5** — Static site generation (SSG) with `adapter-static`
- **TailwindCSS v4** — Utility-first CSS with OKLCH design tokens
- **mdsvex** — Markdown blog posts compiled at build time
- **Turborepo** — Monorepo build system
- **Husky** — Git hooks for code quality

## Getting Started

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
bun run build
```

Static output is generated in `apps/web/build/`. Deploy to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

## Project Structure

```
febriannugroho/
├── apps/
│   └── web/              # SvelteKit static site
│       ├── src/
│       │   ├── content/blog/   # Markdown blog posts
│       │   ├── lib/components/ # Reusable UI components
│       │   └── routes/         # SvelteKit routes
├── packages/
│   └── config/           # Shared TypeScript config
```

## Available Scripts

- `bun run dev`: Start dev server
- `bun run build`: Build static site
- `bun run check-types`: Check TypeScript types
- `bun run dev:web`: Start only the web app
- `bun run -F web check`: SvelteKit sync + svelte-check

## Git Hooks and Formatting

- Initialize hooks: `bun run prepare`

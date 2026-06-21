# Decision: Home Page Sectioned Layout

**Date:** 2026-06-20  
**Status:** Accepted (deviates from original spec/plan)  
**Scope:** `apps/web/src/routes/+page.svelte`, `ProjectSection.svelte`, `app.css`

## Context

The original portfolio spec (`docs/superpowers/specs/2026-06-20-portfolio-svelte-rebuild-design.md`) defined Home as a **narrative flow** — consecutive `text-2xl` paragraphs with inline overlapping SVG icons, projects mid-page, dashed separator, and small footer links.

After adding the Projects grid, the page felt **disproportionate**: too many large paragraphs competing with structured project cards.

## Decision

Restructure Home into a **sectioned layout** inspired by Andrei Hudovich's portfolio reference:

1. **Hero block** — profile photo, name heading, compact body copy (work + tech focus), primary CTAs (`View stack`, `Get in touch`)
2. **Projects** — uppercase section label, description, 2-column card grid, `View all projects →` aligned right in header
3. **Find me on** — uppercase label, horizontal social links (SVG icon + text label per platform)
4. **Get in touch** — uppercase label, text links to stack, blog, and contact

## What We Keep (unchanged from spec intent)

| Item | Notes |
|------|-------|
| Plus Jakarta Sans | No switch to monospace |
| OKLCH design tokens | Unchanged |
| All existing copy | Same sentences, rearranged and resized |
| svgl-svelte icons | Next.js, React, TypeScript, GitHub, Instagram, LinkedIn, X |
| Project cards | `ProjectCard` + `ProjectSection` unchanged structurally |
| Reveal animations | Staggered `.reveal` on sections |
| max-w-xl single column | Layout shell unchanged |

## What Changed (intentional deviation)

| Original spec | New layout |
|---------------|------------|
| All sections `text-2xl` narrative | Hero `text-2xl` title + `text-base` body |
| Social icons inline in sentence, overlapping/rotated | Horizontal icon + label links |
| Tech icons overlapping group hover | Inline row, flat 28×28 icons |
| Stack CTA as narrative paragraph | Hero button + Get in touch section link |
| Dashed `<hr>` + footer links | Merged into "Get in touch" section |
| Projects after narrative blocks mid-page | Projects immediately after hero |

## Agent Guidance

- **Do not revert** to the old all-`text-2xl` narrative layout without explicit user request.
- New home sections should use `.section-label` for uppercase headings.
- Preserve SVG brand icons; social section uses icon + text, not icon-only overlap.
- Reference this decision when updating `docs/superpowers/specs/` or home page tasks.

## Files Touched

- `apps/web/src/routes/+page.svelte`
- `apps/web/src/lib/components/ProjectSection.svelte`
- `apps/web/src/lib/components/ProfilePhoto.svelte` (optional `class` prop for hero sizing)
- `apps/web/src/app.css` (`.section-label` utility)

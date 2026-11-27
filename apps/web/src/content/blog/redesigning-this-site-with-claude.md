---
title: "Redesigning this site with Claude"
description: "What I learned designing in Figma with an agent and a set of design skills."
lead: "How I redesigned my portfolio in Figma with Claude, handed it off through numbered specs and shipped it with coding agents."
date: "2026-11-18"
readingTime: "4 min read"
slug: "redesigning-this-site-with-claude"
tags: ["Design"]
---

When I decided to redesign this site, I started in Figma instead of an editor and treated the design as a real specification: every layout, state and motion choice written down before any code changed.

## Starting in Figma with design skills

I did the design work in Figma together with Claude, backed by a set of design skills: `better-interface`, `better-layout`, `better-colors`, `better-ui`, `better-accessibility` and `better-motion`, along with Emil Kowalski's `animate`, `choreograph` and `review-animations`. Rather than asking for generic polish, each skill gave the session concrete rules for spacing, contrast, interaction states and timing.

For the overall feel, I used `molly.studio` as a reference. Three details stood out: a single video-like card that shifts colour, a soft colour wash around it, and cards that lift slightly on hover. That gave us a clear bar to aim for without copying the layout. Every screen was drawn for desktop and phone, in light and dark, so dark mode and mobile spacing were decided up front instead of patched in later.

## Handing off to coding agents

Coding agents did the implementation while I reviewed, on SvelteKit 5, Tailwind CSS v4, mdsvex and Bun inside a Turborepo monorepo. Handing an agent a raw Figma link invites guesswork, so I wrote the design down as a numbered handoff package before anyone touched the codebase:

- `01-tokens` for light and dark colours, Inter and Geist Mono typography, spacing, shadows and breakpoints.
- `02-components` for default, hover, press, focus and disabled states.
- `03-ux-pages` for page structure, navigation, dialogs, mobile sheets and accessibility.
- `04-motion` for every duration, easing curve, stagger and reduced-motion fallback.
- `05-content-assets` for copy, logos and open content decisions.
- `06-build-notes` for routes, dependencies, public-content rules and the QA checklist.

Later, when we reworked the home stage after reviewing the live site, that change got its own stage document, "Panggung v3", so the code had one source of truth instead of conflicting notes.

## One stage card, three chapters

The centerpiece of the home page is a single stage card that plays 12 illustrated shots across three colour chapters: the fleet workflow, the CI/CD pipeline and how this site was built. All 12 shots run as one looping 22.8-second video. There are no slider arrows, no progress bars and no slide counters. Hovering does not interrupt playback; clicking the card pauses it and resumes from the remaining time of the current shot.

To keep motion calm and predictable, the motion spec sets hard boundaries. Transitions only animate compositor-friendly properties such as `transform`, `opacity`, `filter` and `clip-path`, never `transition: all`. Hover effects only run on devices with a fine pointer, and cards lift 4 px while text and buttons stay still. Chapter colours change in one 600 ms move, so the colour wash, frame and illustration shift together. Under reduced motion, autoplay turns off, the card rests on the final shot of the active chapter, and clicking steps to the next chapter with a short opacity fade.

## Reviews, numbers and shipping

Once the pages were built, reviews ran through `better-interface`, `better-accessibility`, `break-ui` and `review-animations`. Those passes caught issues that looked fine at a glance: the home bundle was shipping the full GitHub contributions JSON (trimmed from 202 kB down to 35 kB), closing the floating profile card dropped keyboard focus, and the phone agent sheet ignored the back button and backdrop tap.

Before merging, a manual end-to-end pass checked 90 of 90 items across phone and desktop, light and dark themes, and reduced motion. PR #1 landed the redesign in 25 commits across 86 files (+6,959 −2,684). PR #2 moved the deploy to Cloudflare Workers.

> If you want coding agents to build a design faithfully, spend the extra hour writing down the tokens, states and motion numbers before they write a single component.

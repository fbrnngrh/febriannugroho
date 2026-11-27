---
title: "Redesigning this site with Claude"
description: "What I learned designing in Figma with an agent and a set of design skills."
lead: "How I redesigned my portfolio in Figma with Claude, handed it off through numbered specs and shipped it with coding agents."
date: "2026-11-27"
readingTime: "5 min read"
slug: "redesigning-this-site-with-claude"
tags: ["Design"]
---

When I decided to redesign this site, I started in Figma instead of an editor and treated the design as a real specification: every layout, state and motion choice written down before any code changed. Every spacing choice and interaction state had to be settled on canvas instead of left for later in CSS, and that gave the coding agents a concrete target once implementation began.

## Starting in Figma with design skills

I did the design work in Figma together with Claude, backed by a set of design skills: `better-interface`, `better-layout`, `better-colors`, `better-ui`, `better-accessibility` and `better-motion`, along with Emil Kowalski's `animate`, `choreograph` and `review-animations`. Rather than asking for generic polish, each skill gave the session concrete rules for spacing, contrast, interaction states and timing. When a layout or a hover state felt off, we checked it against a rule from the skill instead of trading vague impressions.

For the overall feel, I used `molly.studio` as a reference. Three details stood out: a single video-like card that shifts color, a soft color wash around it, and cards that lift slightly on hover. That gave us a clear bar to aim for without copying the layout. Every screen was drawn for desktop and phone, in light and dark, so dark mode and mobile spacing were decided up front instead of patched in later.

## Handing off to coding agents

Coding agents did the implementation while I reviewed, on SvelteKit 5, Tailwind CSS v4, mdsvex and Bun inside a Turborepo monorepo. Handing an agent a raw Figma link invites guesswork, because visual frames rarely spell out focus order, reduced-motion fallbacks or disabled states. Before anyone touched the codebase, I wrote the design down as a numbered handoff package:

- `01-tokens` for light and dark colors, Inter and Geist Mono typography, spacing, shadows and breakpoints.
- `02-components` for default, hover, press, focus and disabled states.
- `03-ux-pages` for page structure, navigation, dialogs, mobile sheets and accessibility.
- `04-motion` for every duration, easing curve, stagger and reduced-motion fallback.
- `05-content-assets` for copy, logos and open content decisions.
- `06-build-notes` for routes, dependencies, public-content rules and the QA checklist.

Splitting the handoff into six files kept each agent focused on the slice it needed without digging through unrelated decisions. Later, when we reworked the home stage after reviewing the live site, that change got its own stage document, "Panggung v3", so the code had one source of truth instead of conflicting notes.

## One stage card, three chapters

The centerpiece of the home page is a single stage card that plays 12 illustrated shots across three color chapters: the fleet workflow, the CI/CD pipeline and how this site was built. All 12 shots run as one looping 22.8-second video. There are no slider arrows, no progress bars and no slide counters. Hovering does not interrupt playback; clicking the card pauses it and resumes from the remaining time of the current shot.

To keep motion calm and predictable, the motion spec sets hard boundaries. Transitions only animate compositor-friendly properties such as `transform`, `opacity`, `filter` and `clip-path`, never `transition: all`. Hover effects only run on devices with a fine pointer, and cards lift 4 px while text and buttons stay still. In the first version, chapter colors changed in one 600 ms move, so the color wash, frame and illustration shifted together. Under reduced motion, autoplay turns off, the card rests on the final shot of the active chapter, and clicking steps to the next chapter with a short opacity fade.

## Reviews, numbers and shipping

Once the pages were built, reviews ran through `better-interface`, `better-accessibility`, `break-ui` and `review-animations`. Those passes caught issues that looked fine at a glance: the home bundle was shipping the full GitHub contributions JSON (trimmed from 202 kB down to 35 kB), closing the floating profile card dropped keyboard focus, and the phone agent sheet ignored the back button and backdrop tap.

Before merging, a manual end-to-end pass checked 90 of 90 items across phone and desktop, light and dark themes, and reduced motion. PR #1 landed the redesign in 25 commits across 86 files (+6,959 −2,684). PR #2 moved the deploy to Cloudflare Workers.

## Second pass on the live site

Shipping the first version made it easier to spot what still felt off in a real browser. After it went live, I opened the site side by side with `molly.studio`, marked up screenshots of every gap I saw and sent them back to the agents. They fixed each point the same day.

The biggest visual fix was the stage backdrop. In the first live version, the color around the stage read as a box because it combined a rectangular tint with blurred circles clipped by the section edges. We replaced that with one soft radial wash centered on the card that fades out before every edge. Its upper tail now reaches into the first screen, so the hero picks up a tint while the card itself stays below the fold, matching the opening view on `molly.studio`.

Chapter transitions needed two fixes of their own. First, the opening shot of a new chapter briefly showed the old chapter's colors before settling; now each shot carries its own chapter palette, and only the background, frame and glow shift over 600 ms. Second, a `review-animations` pass caught that animating the color variables on the page root restyled every element on every frame. Moving that transition down to the stage section alone kept the rest of the page out of the style recalculation.

Two home page sections also changed shape after the side-by-side review. The "Selected work" carousel became full-bleed with larger cards, up to 680 px wide, that scroll out past the screen edge instead of being cut off at the text column. The Writing section became a row of tall cards on desktop where a hovered card lifts out of the row, while phones keep the stacked card fan.

The last two fixes targeted data displays on the site. The GitHub contribution graph used to look much fuller than my actual profile because it relied on home-made thresholds; it now uses GitHub's own quartile level for each day and shows each day's count in a tooltip on hover. On the Stack page, the fleet map gained real connector lines with arrows, a "fail → back to lead" loop and an "approve ship" line, paired with a 10-second animation where every third loop takes the failing path.

> If you want coding agents to build a design faithfully, spend the extra hour writing down the tokens, states and motion numbers before they write a single component.

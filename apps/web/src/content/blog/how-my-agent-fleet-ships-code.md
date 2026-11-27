---
title: "How my agent fleet ships code"
description: "Planning, building, reviewing and testing with agents while I orchestrate."
lead: "How I split planning, coding, review and copy across specialist agents in T3 Code while keeping two human approval gates."
date: "2026-11-04"
readingTime: "4 min read"
slug: "how-my-agent-fleet-ships-code"
tags: ["Agents"]
---

Most days, I do not write every line of a feature by hand. I run a fleet of coding agents from T3 Code, split by role, with a fixed workflow from rough idea to shipped pull request. My job is to steer the plan, review the output and decide what ships.

## From an idea to a spec and tickets

Every piece of work starts as an issue, a spec or a rough idea dropped into T3 Code. Instead of jumping straight into code, the workflow follows Matt Pocock's skills in order:

1. **Grill the idea** to challenge assumptions and close open questions early.
2. **Write a spec** that states what the change does and what done looks like.
3. **Cut tickets** into small, independent units of work.

Before any agent writes production code, the spec hits my first human gate. I read it and approve it from my phone. If the plan is vague or solves the wrong problem, we fix it while it is still text, not after ten files have changed.

## Splitting the work across roles

Once the spec is approved, JARVIS, the lead agent running on Claude Opus, takes over orchestration. JARVIS plans the execution and delegates tickets with `delegate_task`, one child agent per ticket, so each change stays isolated on its own branch.

Rather than asking one agent to do everything well, the fleet divides work by role:

- **FRIDAY** builds features, taking a ticket from JARVIS, writing the change on its own branch and opening it for review.
- **ULTRON** handles code review.
- **EDITH** runs UI review and end-to-end tests.
- **KAREN** writes copy and documentation, running on Gemini through Antigravity, a different model family on purpose so human-facing wording does not share the coding model's habits.
- **JOCASTA** reads human-facing documents cold as a playtester, catching gaps the author missed.
- **VISION** reviews design frames.

Each role has a narrow brief. That keeps context small and makes it obvious who owns a mistake when something breaks.

## Separate reviewers and deterministic checks

One rule never bends: the reviewer is always a separate agent, never the one that wrote the code. When FRIDAY finishes a ticket, ULTRON reviews the diff cold against the spec and the repo's standards, and EDITH checks the interface and end-to-end flows where UI is involved.

Reviews alone are not enough, so every change also goes through deterministic checks: lint, type-checking, tests and build. Because these runs happen on my own machine, two practical guardrails keep things stable. First, only the tests related to a change run locally; the full suite runs in CI on the pull request. Second, builds share one machine-wide lock, so two builds never run at the same time and fight for CPU or disk.

## Two human gates and the retro loop

When the tickets pass review and checks, the work reaches my second human gate: I review and approve the release from my phone. Two human gates, spec and release, mean nothing ships without my OK, no matter how many agents touched the branch.

Shipping is not the last step. After a feature lands, we run a retro. Any trap, repeated mistake or missing guardrail from the run turns into a new check or rule for the next one. Over time, the fleet gets more reliable not because prompts get longer, but because the checks catch what used to slip through.

> Give agents narrow roles, separate the author from the reviewer and keep the final release behind a human gate.

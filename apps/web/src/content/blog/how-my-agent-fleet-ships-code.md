---
title: "How my agent fleet ships code"
description: "Planning, building, reviewing and testing with agents while I orchestrate."
lead: "How I split planning, coding, review and copy across specialist agents in T3 Code while keeping two human approval gates."
date: "2026-11-27"
readingTime: "7 min read"
slug: "how-my-agent-fleet-ships-code"
tags: ["Agents"]
---

Most days, I do not write every line of a feature by hand. I run a fleet of coding agents from T3 Code, split by role, with a fixed workflow from rough idea to shipped pull request. Instead of asking one chat session to plan, code, test and write copy all at once, each step goes to a specialist with a narrow brief and a clear boundary. My job is to steer the plan, review the output and decide what ships.

## From an idea to a spec and tickets

Every piece of work starts as an issue, a spec or a rough idea dropped into T3 Code. Instead of jumping straight into code, the workflow follows Matt Pocock's skills in order:

1. **Grill the idea** to challenge assumptions and close open questions early.
2. **Write a spec** that states what the change does and what done looks like.
3. **Cut tickets** into small, independent units of work.

Running those three steps in order keeps agents from filling in missing requirements on their own. Grilling forces the hard questions out while the work is still cheap to change. Turning the answers into a spec gives every downstream agent the same definition of done, so the builder and the reviewer judge the result against the same bar. Cutting the spec into small, independent tickets keeps each branch focused on one change instead of bundling unrelated edits together.

Before any agent writes production code, the spec hits my first human gate. I read it and approve it from my phone. If the plan is vague or solves the wrong problem, we fix it while it is still text, not after ten files have changed. That single pause prevents a fleet of fast agents from building the wrong feature in parallel.

## Splitting the work across roles

Once the spec is approved, JARVIS, the lead agent running on Claude Opus, takes over orchestration. JARVIS plans the execution and delegates tickets with `delegate_task`, one child agent per ticket, so each change stays isolated on its own branch. One strict rule keeps orchestration clean: an orchestrator never commits. JARVIS coordinates the sequence, hands out briefs and tracks status, while each child agent commits on its own ticket branch. Keeping commits on ticket branches also makes every diff smaller to review and easier to trace back to a single ticket.

Rather than asking one agent to do everything well, the fleet divides work by role:

- **FRIDAY** builds features, taking a ticket from JARVIS, writing the change on its own branch and opening it for review.
- **ULTRON** handles code review.
- **EDITH** runs UI review and end-to-end tests.
- **KAREN** writes copy and documentation, running on Gemini through Antigravity, a different model family on purpose so human-facing wording does not share the coding model's habits.
- **JOCASTA** reads human-facing documents cold as a playtester, catching gaps the author missed.
- **VISION** reviews design frames.

Each role runs on a deliberately chosen model rather than one default for everything. The lead agent and the reviewers run on Claude Opus, while wording runs on Gemini through Antigravity. Delegation can also cross providers inside the same run: JARVIS can hand a design task to one model and a writing task to another, in parallel, with each child working in its own isolated checkout. Neither agent overwrites the other's files, and each brings the strengths of its model to a narrow slice of the work.

Every agent also receives a written brief for its role before it starts. A brief spells out what the agent owns, what inputs it can trust and what rules it cannot break. For example, a copy brief tells KAREN that every number, label or step must come from a named source, and anything missing is marked for checking instead of guessed. Narrow briefs keep context small, reduce drift during long runs and make it obvious who owns a mistake when something breaks.

That same boundary shapes how prose gets reviewed. JOCASTA reads a document with no spec, no code and no history: only the document itself. Because JOCASTA does not know what the author meant to say or how the feature was built, its blind spots differ from the author's. A missing step, an unexplained label or an assumed piece of context stands out right away to a cold reader.

## Separate reviewers and deterministic checks

One rule never bends: the reviewer is always a separate agent, never the one that wrote the code. When FRIDAY finishes a ticket, ULTRON reviews the diff cold against the spec and the repo's standards, and EDITH checks the interface and end-to-end flows where UI is involved. Those two reviews cover different failure modes: ULTRON inspects the code and conventions on the branch, while EDITH verifies the rendered interface and user flows so visual or behavioral bugs do not slip past a clean diff. Separating author from reviewer applies the same logic as JOCASTA's cold read: an agent that just wrote a patch tends to rationalize its own choices, whereas a fresh agent with only the spec and the diff catches missing edge cases and style drift.

Reviews alone are not enough, because language models can still miss syntax errors, broken types or subtle regressions. Every change therefore goes through deterministic checks: lint, type-checking, tests and build. A ticket does not move forward on a reviewer's word alone; the tooling has to pass too.

Because these runs happen on my own machine, two practical guardrails keep things stable. First, only the tests related to a change run locally; the full suite runs in CI on the pull request. That keeps local feedback fast without overloading the machine during parallel ticket runs. Second, builds share one machine-wide lock, so two builds never run at the same time and fight for CPU or disk. Even when several agents work in parallel across isolated checkouts, heavy build steps queue cleanly behind that lock.

## A real run: redesigning this site

My own portfolio redesign was built this way. Instead of me hand-coding every component and checking every state myself, the fleet ran the work through the same split of roles. Coding agents implemented the changes on their own branches while specialist reviewers checked UI, accessibility and animation separately from the authors.

Because delegation can cross providers in one run, design tasks and writing tasks did not have to wait in a single queue behind one general-purpose agent. A design task could go to one model while a writing task went to another in parallel, each in its own isolated checkout and governed by its own written brief. When a reviewer flagged a problem, the fix went back to an implementer rather than being waved through, and the final result still waited for my approval before going live.

Running the redesign through the fleet was also a useful stress test of the workflow itself. Public copy had to stay grounded in verified facts, UI and animation reviews had to catch issues that looked fine at a glance, and every branch still had to pass deterministic checks before reaching my review queue. Using the fleet on my own site kept the process honest, because I was both the orchestrator and the person living with the shipped result.

## Two human gates and the retro loop

When the tickets pass review and deterministic checks, a finished run pushes its branches and opens pull requests on its own. I do not have to push branches or assemble pull requests by hand after the agents finish. At that point, the work reaches my second human gate: my review on the pull request. I review and approve the release from my phone, and merges, deploys and releases always wait for my go.

Keeping two human gates, one on the spec before code is written and one on the pull request before anything merges, gives the fleet room to move fast without giving it authority to ship. The first gate catches wrong scope before any branch exists, and the second verifies the finished pull requests before any merge, deploy or release happens. Agents can explore, implement, review, re-run checks and open pull requests while I am away from the keyboard, but nothing reaches production without my explicit OK, no matter how many agents touched the branch.

Shipping is not the last step. After a feature lands, we run a retro. Any trap, repeated mistake or missing guardrail from the run turns into a new check or rule for the next one. If a copy brief was too loose, we tighten the brief; if a class of bug slipped past review, we add a check to catch it automatically. Over time, the fleet gets more reliable not because prompts get longer, but because the checks and briefs catch what used to slip through.

> Give agents narrow roles, separate the author from the reviewer and keep the final release behind a human gate.

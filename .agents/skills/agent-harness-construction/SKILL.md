---
name: agent-harness-construction
description: Design and optimize AI agent action spaces, tool definitions, and observation formatting for higher completion rates.
---

# Agent Harness Construction

Use when improving how an agent plans, calls tools, recovers from errors, and converges on completion.

## Core Model

Agent output quality is constrained by:

1. Action space quality
2. Observation quality
3. Recovery quality
4. Context budget quality

## Action Space Design

1. Use stable, explicit tool names.
2. Keep inputs schema-first and narrow.
3. Return deterministic output shapes.
4. Avoid catch-all tools unless isolation is impossible.

## Granularity Rules

- Micro-tools for high-risk operations (deploy, migration, permissions)
- Medium tools for common edit/read/search loops
- Macro-tools only when round-trip overhead dominates

## Observation Design

Every tool response should include:

- `status`: success | warning | error
- `summary`: one-line result
- `next_actions`: actionable follow-ups
- `artifacts`: file paths / IDs

## Error Recovery Contract

For every error path, include:

- root cause hint
- safe retry instruction
- explicit stop condition

## Context Budgeting

1. Keep system prompt minimal and invariant.
2. Move large guidance into skills loaded on demand (`.agents/skills/`).
3. Prefer references to files over inlining long documents.
4. Compact at phase boundaries, not arbitrary token thresholds.

## Architecture Pattern (this repo)

Hybrid: ReAct planning + typed tool execution.

- **Instructions**: `AGENTS.md`
- **State**: `docs/feature_list.json`, `docs/progress.md`
- **Verification**: `init.sh`, `init.ps1`
- **Scope**: feature dependencies in `docs/feature_list.json`
- **Lifecycle**: `docs/session-handoff.md`

## Anti-Patterns

- Too many tools with overlapping semantics
- Opaque tool output with no recovery hints
- Error-only output without next steps
- Context overloading with irrelevant references

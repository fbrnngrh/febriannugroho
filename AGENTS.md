# AGENTS.md

Agent harness for **febriannugroho** — a static SvelteKit 5 monorepo (SvelteKit 5, TailwindCSS, mdsvex, Turborepo, Bun).

## Startup Workflow

Before writing code:

1. **Confirm working directory** — repo root: `d:\PROJECT\experimental\febriannugroho`
2. **Read this file** completely
3. **Read `README.md`** for stack overview and scripts
4. **Run verification** — `./init.sh` (Git Bash/WSL) or `.\init.ps1` (PowerShell)
5. **Read `docs/feature_list.json`** for current feature state
6. **Review recent commits** — `git log --oneline -5`

If baseline verification fails, fix that before adding new scope.

## Project Map

| Area | Path | Notes |
|------|------|-------|
| Web app (SvelteKit) | `apps/web/` | Routes, components, mdsvex blog |
| Shared config | `packages/config/` | TypeScript base config |
| Turborepo tasks | `turbo.json` | Task pipeline and caching |
| Agent harness state | `docs/` | Feature tracker, progress log, handoff |

## Skill Routing

Load skills on demand — do not inline full manuals into chat.

| Task | Skill |
|------|-------|
| Svelte components (`.svelte`, `.svelte.ts`) | `.agents/skills/svelte-core-bestpractices/SKILL.md` |
| Svelte MCP unavailable / CLI fallback | `.agents/skills/svelte-code-writer/SKILL.md` |
| Monorepo tasks, turbo filters, caching | `.agents/skills/turborepo/SKILL.md` |
| Harness design / tool contracts | `.agents/skills/agent-harness-construction/SKILL.md` |

## Svelte Workflow (required for UI work)

When creating or editing Svelte files under `apps/web/`:

1. Use **Svelte MCP** (`list-sections` → `get-documentation` for relevant topics)
2. Follow **Svelte 5 runes mode** — no legacy syntax (`export let`, `on:click`, `<slot>`)
3. Run **`svelte-autofixer`** on changed code until clean
4. Verify with `bun run -F web check`

## MCP Configuration (Multi-IDE)

Project MCP servers are configured across multiple IDEs:

| IDE | Config File | Format |
|-----|-------------|--------|
| Cursor | `.cursor/mcp.json` | JSON |
| Devin | `.devin/config.json` | JSON |
| Zed | `.zed/settings.json` | JSON |
| Claude / Pi / Generic | `.mcp.json` | JSON |

**Servers configured:**

| Server | Purpose |
|--------|---------|
| `better-t-stack` (`bunx create-better-t-stack@latest mcp`) | Better T Stack utilities |
| `context7` (`npx -y @upstash/context7-mcp`) | Library docs lookup |
| `svelte` (`https://mcp.svelte.dev/mcp`) | Svelte 5 documentation & guidance |

> **Windsurf/Devin:** Global MCP config sudah di-setup di `%USERPROFILE%\.codeium\windsurf\mcp_config.json`. Project-level cukup lewat `.devin/config.json`.

## Working Rules

- **One feature at a time** — pick exactly one unfinished item from `docs/feature_list.json`
- **Verification required** — run checks before claiming done
- **Update artifacts** — `docs/progress.md` and `docs/feature_list.json` before ending session
- **Stay in scope** — avoid unrelated file changes
- **Package tasks over root** — add scripts to package `package.json`, register in `turbo.json`
- **Leave clean state** — next session must pass `./init.sh` immediately

## Required Artifacts

- `docs/feature_list.json` — feature state (source of truth)
- `docs/progress.md` — session continuity log
- `docs/session-handoff.md` — optional, for multi-session work
- `init.sh` / `init.ps1` — startup and verification

## Definition of Done

A feature is done only when ALL are true:

- [ ] Target behavior implemented
- [ ] Verification ran (type-check + Svelte check for UI changes)
- [ ] Evidence recorded in `docs/feature_list.json` or `docs/progress.md`
- [ ] Repository restartable from standard startup path

## Verification Commands

```bash
# Full verification (recommended)
./init.sh          # Git Bash / WSL
.\init.ps1         # PowerShell
```

Required checks:

- `bun install`
- `bun run check-types` — TypeScript across monorepo
- `bun run -F web check` — SvelteKit sync + svelte-check

Optional before deploy:

- `bun run build` — generates static output in `apps/web/build/`

## End of Session

1. Update `docs/progress.md` with current state
2. Update `docs/feature_list.json` with feature status
3. Record blockers or risks
4. Commit when work is in a safe state (only when user requests)
5. Leave repo clean for `./init.sh`

## Escalation

| Situation | Action |
|-----------|--------|
| Architecture decisions | Check README / package structure; ask user if unclear |
| Svelte syntax uncertainty | Svelte MCP docs first, then `svelte-core-bestpractices` skill |
| Turborepo task wiring | `turborepo` skill + existing `turbo.json` patterns |
| Repeated verification failures | Update `docs/progress.md`, flag for human review |
| Scope ambiguity | Re-read `docs/feature_list.json` definition of done |

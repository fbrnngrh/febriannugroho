# 05 · Isi dan aset

Teks di bawah disalin dari layar desktop terang. Ponsel memakai teks yang sama kecuali disebut. Skill: better-writing (untuk usulan terjemahan dan teks baru).

> Implementasi: teks situs dikumpulkan di `apps/web/src/lib/content/site.ts`.

## 1. Teks final

### Home · hero

- Nav: Work · Writing · Stack · Email
- Febrian Bayu Nugroho
- Software engineer · Banjarmasin, Indonesia
- Now: redesigning this site
- Hi, I'm Febrian. By day I **ship business systems** for a motorcycle dealer network. By night I run **a small fleet of coding agents** that build software with me.
  - "ship business systems" → detail Dealer. "a small fleet of coding agents" → Stack.
- Scroll

### Home · panggung (caption)

| Slide | Judul | Kalimat | Tautan | Penghitung |
|---|---|---|---|---|
| 1 | Fleet workflow | From an issue to a shipped PR: agents build and review, I approve the spec and the release. | Full fleet map | 01 / 03 |
| 2 | CI/CD pipeline | Every change goes through the same checks, a Docker build and a deploy on EasyPanel. | – | 02 / 03 |
| 3 | Agent orchestration | One lead agent splits the work, four agents build, review, test and write docs. | Full fleet map | 03 / 03 |

### Home · isi adegan panggung

Teks di dalam adegan masih bahasa Indonesia; situs berbahasa Inggris. Usulan terjemahan (perlu ya Febrian):

| Slide · shot | Teks Figma | Usulan Inggris |
|---|---|---|
| S1 · 1 | Issue "Add video stage to the home page", label design, home, "Ditugaskan ke JARVIS" | "Assigned to JARVIS" |
| S1 · 2 | Rencana JARVIS dengan `delegate_task` | (tetap) |
| S1 · 3 | Diff `VideoStage.svelte`, review EDITH | (tetap) |
| S1 · 4 | PR Merged, check-types dan build lulus | "Merged", "check-types passed", "build passed" |
| S2 · 1 | check-types "Gagal" | "Failed" |
| S2 · 2 | FRIDAY: "fix: types in VideoStage", `$ bun run check-types` | (tetap) |
| S2 · 3 | Semua cek lulus | "All checks passed" |
| S2 · 4 | EasyPanel "Deploy dari main ● Live", "GET /health 200" | "Deployed from main ● Live" |
| S3 · 1 | JARVIS "Empat tugas jalan bersamaan" | "Four tasks running in parallel" |
| S3 · 2–3 | FRIDAY / EDITH / ULTRON / KAREN berjalan, lalu selesai | "Running" → "Done" |
| S3 · 4 | `$ fleet check ✓` "Siap untuk review kamu" | "Ready for your review" |

### Home · Selected work

- Label: Selected work. Kontrol: ← → dan "drag for more".

| Kartu | Judul | Deskripsi |
|---|---|---|
| Dealer | Dealer management system | Sales, after-sales and lead follow-up for a dealer network. |
| CI/CD | From manual deploys to CI/CD | More than eight APIs moved to automated pipelines. |
| Fleet | Fleet | My home software factory of coding agents. |
| Sales Tool | Sales Tool | The mobile app sales staff use in the field. |

### Home · About

> I'm a software engineer in Banjarmasin, Indonesia. I joined Trio Motor as an intern and have spent about three years there, now owning several of the systems the business runs on every day.
>
> Most of my recent work is about shipping safely. I moved our deploys from manual pulls on the server to **CI/CD pipelines**, and I'm splitting authentication into one shared service.
>
> Outside work I run a home software factory: agents that plan, build, review and test code while I orchestrate. I'm also learning interface design, which is why this site looks the way it does.

- Experience: "2024–now · Software engineer, Trio Motor" dan "2023–2024 · Programmer intern, Trio Motor".
- LinkPreview pada "CI/CD pipelines": "CI/CD pipelines" / "Case study · 4 min read →".

### Home · Writing (kipas)

- Intro: Notes from shipping systems at work and running an agent fleet at home.

| # | Judul | Tanggal |
|---|---|---|
| 1 | From manual pulls to CI/CD | Oct 14, 2025 |
| 2 | Redesigning this site with Claude | Nov 18, 2026 |
| 3 | How my agent fleet ships code | Nov 04, 2026 |

- Setiap kartu: "Written by Febrian". Penghitung "1 / 3". Tautan "All writing".

### Home · bagian lain

- Shipping in public: "@fbrnngrh ↗", "603 contributions in the last 9 months", legenda "Less" / "More".
- Tools I use: T3 Code · Claude · Antigravity · SvelteKit · Docker + EasyPanel · Figma. Tautan "Full stack".
- Contact: "The fastest way to reach me is email." · fbrnngrh@gmail.com · "Copy email" · GitHub, LinkedIn, Threads, Instagram · "Banjarmasin, Indonesia · 09:41 WITA" (jam diisi langsung).
- Footer: "Built with SvelteKit. Designed with Claude and a few design skills."

### Stack

- "← Home" · **Stack** · "My home software factory: agents in T3 Code build, review and ship. I approve the spec and the release."
- **How the fleet works** · "One lead agent delegates, deterministic checks gate every change, and nothing ships without my OK."
- Node peta:
  - Task: issue · spec · idea
  - T3 Code: control plane, local
  - You · phone: approves spec and ship
  - JARVIS: lead · orchestrator (Opus, Matt Pocock skills, delegate_task)
  - FRIDAY: builds features · ULTRON: code review · EDITH: UI review · E2E · KAREN: copy · docs
  - fleet check: deterministic checks per area (lint, types, tests, build); "fail → back to lead"
  - Ship: "approve ship", "fleet-ship checks, then deploy", "human gate"
  - "retro: findings become new checks"
- Caption: "Click an agent for its role, skills and a run." · "Roles after T3 Code and Matt Pocock's software factory."
- **Also in the kit**:

| Alat | Keterangan |
|---|---|
| Antigravity | Trying new agent workflows |
| PostgreSQL | Default database |
| Bun | Scripts and fast installs |
| Figma | Where this redesign started |
| Notion | Notes and plans |

### Kartu agen · FRIDAY (satu-satunya yang sudah lengkap)

- FRIDAY · builds features
- "Takes a task from JARVIS, writes the change on its own branch and opens it for review."
- Model: Claude · Stack: SvelteKit, Laravel, TypeScript · Skills: tdd, codebase-design, prototype
- Sample run:

```
$ task: add retry to uploads
✓ 3 files changed · 18 tests pass
→ handed to ULTRON for review
```

### Writing

- "← Home" · **Writing** · intro sama dengan Home · filter All / Shipping / Agents / Design.

| Tahun | Judul | Menit · tanggal | Deskripsi |
|---|---|---|---|
| 2026 | Redesigning this site with Claude | 5 min · Nov 18 | What I learned designing in Figma with an agent and a set of design skills. |
| 2026 | How my agent fleet ships code | 7 min · Nov 04 | Planning, building, reviewing and testing with agents while I orchestrate. |
| 2025 | From manual pulls to CI/CD | 6 min · Oct 14 | Moving more than eight APIs from manual server pulls to automated pipelines. |

### Artikel · From manual pulls to CI/CD

- "← Writing" · "Oct 14, 2025 · 6 min read" · tag Shipping
- H1: From manual pulls to CI/CD
- Lead: How we moved more than eight APIs from deploying by hand on the server to pipelines that test, build and ship on every push.
- Sampul berlabel "mockup · fake data": Install 40s · Lint & test 45s · Build image 47s · Deploy to staging running…
- H2: "Why manual pulls stopped working" · "The pipeline we ended up with" (dengan `deploy.yml` dan tombol Copy) · "What changed for the team"
- Penutup: "If you are still deploying by hand, start with staging only…" (lanjutan paragraf di frame 67:2438)
- "How my agent fleet ships code →" · "All writing" · TOC "On this page"
- Isi body lengkap: ambil dari frame 67:2438; artikel ini belum ada di repo.

### Detail proyek

**CI/CD**
- 2025 · Pipelines · tag CI/CD
- Deploy pipeline for 8+ APIs
- From manual pulls on the server to pipelines that test, build and ship on every push.
- Problem: Releases depended on pulling code by hand and a checklist nobody had written down.
- What I built: GitHub Actions workflows with Docker and EasyPanel: test, build, deploy to staging, then promote.
- Result: Every push ships the same way, and rolling back is one click.
- Tag: GitHub Actions, Docker, EasyPanel, Bun · tautan "Read the full write-up"

**Dealer** (draf, data palsu)
- 2024 – now · Web app · tag Dealer
- Dealer management system
- Sales, after-sales and lead follow-up for a dealer network, in one web app.
- Problem: Leads are shared out to many dealers, and every follow-up has a deadline to keep.
- What I built: I designed how it deploys to staging and production, took over one module, and built a sales feature end to end on my own.
- Result: Every staging and production release goes through the deploy plan I designed.
- Tag: PHP, EasyPanel
- Visual mockup berlabel "mockup · fake data": Leads 128 / Follow-up 42 / Closed 17; nama A. Pratama, R. Sari, D. Halim, M. Yusuf.

**Sales Tool** (draf)
- Label "screenshot · demo data" · Mobile app · Backend
- Sales Tool
- The app sales staff use in the field for prospects, follow-ups and monthly targets.
- Problem: Sales staff needed one place on their phone for today's follow-ups and how far they are from target.
- What I built: Built with one colleague. I wrote most of the backend, and I now own its ongoing development.
- Result: Each salesperson opens a wallboard with today's tasks, activity and progress against target.
- Tag: PHP, Mobile app

### Kartu profil

Febrian Bayu Nugroho · Software engineer · Banjarmasin · Now: redesigning this site · "Email me" (→ "Mail app opened") · fbrnngrh@gmail.com · Copy · × · GH / in / Th / IG

### Menu Explore

Close · Work · Writing · Stack · Email · Now: redesigning this site · fbrnngrh@gmail.com

## 2. Logo

Semua SVG asli ada di [assets/logos.md](assets/logos.md) (disalin dari svgl-svelte dan situs resmi). Komponen logo di Figma (halaman Komponen):

| Logo | Node | Catatan |
|---|---|---|
| Claude | 100:1551 | |
| Codex | 100:1554 | |
| Svelte | 100:1558 | |
| TypeScript | 100:1562 | |
| Laravel | 100:1565 | |
| Tailwind | 100:1568 | |
| Figma | 100:1575 | |
| Notion | 100:1579 | |
| GitHub | 100:1582 | isi `currentColor` |
| Docker | 100:1585 | |
| Bun | 109:1619 | |
| PostgreSQL | 109:1631 | |
| Antigravity | 109:1634 | |
| EasyPanel | 114:2126 | dari situs resmi |
| GitHub Actions | 114:2129 | satu warna, isi `currentColor` |
| T3 Code | 114:2130 | **monogram sementara**, ganti dengan logo asli |

Simpan sebagai file `.svg` di `src/lib/assets/logos/` (atau komponen Svelte) dan render inline. Jika semua logo sudah lokal, paket `@selemondev/svgl-svelte` mungkin tidak dibutuhkan lagi (06-build-notes.md §2).

## 3. Gambar

| Aset | Sumber | Catatan |
|---|---|---|
| Foto profil | `static/images/profile-photo-2.webp` (sudah di repo) | `alt="Febrian Bayu Nugroho"`, outline gambar, sajikan ukuran 96 px (2× untuk 48 px) dan ukuran hero |
| Sampul tulisan | Komponen Cover art 124:3599 (Shipping), 3611 (Agents), 3624 (Design), 3642 (Notes) | Ekspor sebagai SVG dari Figma atau bangun dengan CSS |
| Sampul kartu kerja | Showcase card 19:940 (Project = Dealer, Deploy, Fleet, Sales Tool) | Glow per proyek; ekspor ilustrasi sebagai SVG/WebP |
| Galeri Sales Tool | Galeri SCH1 139:2200 | Cek tagline klien (§4) |
| Logo Trio Motor | `static/images/trio-motor-logo.jpeg` | Tidak dipakai di desain baru |
| Gambar blog lama | `static/images/blog/` | Ikut keputusan post lama |

Ekspor aset Figma dengan Figma MCP (`get_design_context` / `get_screenshot` per node) atau dari Figma langsung.

## 4. Placeholder dan hal yang belum final

| Hal | Status | Yang dibutuhkan |
|---|---|---|
| Judul dan tanggal 3 tulisan | Rencana, belum ada di repo | Febrian menulis atau menyetujui judul; dua artikel ("Redesigning this site…", "How my agent fleet…") belum punya halaman |
| Body artikel CI/CD | Ada di Figma, belum di repo | Pindahkan ke `src/content/blog/*.md` |
| Visual Dealer | Mockup dengan data palsu | Pertahankan label "mockup · fake data" |
| Teks detail Dealer dan Sales Tool | Draf | Persetujuan Febrian |
| Kartu agen selain FRIDAY | Belum ada isi | Teks untuk JARVIS, ULTRON, EDITH, KAREN |
| Logo T3 Code | Monogram | File logo asli |
| Tagline klien di gambar Sales Tool | Mungkin perlu diburamkan | Cek gambar; buramkan bila menampilkan nama atau data klien |
| Angka kontribusi (603) | Snapshot | Ambil saat build dengan `scripts/fetch-github-contributions.ts` |
| Teks adegan panggung | Bahasa Indonesia | Keputusan terjemahan (§1) |
| Jam "09:41 WITA" | Contoh | Diisi langsung di klien |

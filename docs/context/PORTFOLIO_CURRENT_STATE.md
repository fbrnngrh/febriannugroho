# Portfolio Minimalist — Dokumentasi Kondisi Saat Ini

**Proyek:** portfolio-minimalist  
**Pemilik:** Febrian Bayu Nugroho  
**Tanggal snapshot:** 20 Juni 2026  
**Status:** In Development (implementasi aktif, belum production-ready penuh)  
**Rencana berikutnya:** Rewrite ke **SvelteKit + Svelte 5 (runes mode)**

Dokumen ini melengkapi `PRD_Febrian_Portfolio_Final.md` dengan dua lapisan:

1. **Kondisi aktual** — layout, halaman, komponen, dan pola desain yang benar-benar ada di codebase Next.js saat ini (Bagian A).
2. **Target rewrite Svelte** — arsitektur, best practices resmi Svelte/SvelteKit, dan keputusan dependency untuk implementasi berikutnya (Bagian B).

Best practices di Bagian B diselaraskan dengan dokumentasi resmi Svelte MCP (`list-sections` / `get-documentation`) dan skill `svelte-core-bestpractices`.

---

# Bagian A — Kondisi Aktual (Next.js)

## 1. Ringkasan Proyek

Portfolio personal dengan filosofi **minimalis dan konten-first**, terinspirasi situs seperti chrisraroque.com. Tidak ada header navigasi global atau footer tradisional. Seluruh halaman berbagi satu kerangka layout sempit di tengah layar, sehingga pengalaman terasa seperti membaca dokumen personal yang rapi, bukan website korporat.

Aplikasi utama berada di monorepo path `apps/web`, dibangun dengan Next.js 16 (App Router), React 19, Tailwind CSS 4, dan Bun sebagai runtime/package manager.

---

## 2. Arsitektur & Tech Stack (Implementasi Aktual)

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16.1.1, App Router |
| UI | React 19.2.3 |
| Bahasa | TypeScript |
| Styling | Tailwind CSS 4 (CSS-first config di `index.css`) |
| Animasi | Framer Motion 12 |
| Tema | next-themes (light / dark / system) |
| Icon | Lucide React, Simple Icons |
| Form | React 19 `useActionState` + Server Actions |
| Validasi | Zod |
| Notifikasi | Sonner (toast) |
| UI primitives | shadcn/ui (Button, Input, Card, dll. — sebagian belum dipakai di semua halaman) |
| Font | Inter (Google Fonts, variable) |

Struktur monorepo: `apps/web` untuk aplikasi, `packages/env` dan `packages/config` untuk shared config. Blog saat ini memakai **data statis in-memory** di `lib/blog.ts`, bukan CMS atau file markdown eksternal.

---

## 3. Layout Global

### 3.1 Root Layout (`app/layout.tsx`)

Semua halaman dibungkus oleh layout yang sama:

- **HTML** dengan `lang="en"` dan `suppressHydrationWarning` (untuk theme hydration).
- **Body** memakai font Inter, antialiased, background dan foreground dari design tokens.
- **Konten utama** berada di elemen `<main>` dengan:
  - Lebar maksimum **576px** (`max-w-xl`)
  - Centered horizontal (`mx-auto`)
  - Padding horizontal **24px** (`px-6`)
  - Padding vertikal **80px** di mobile, **128px** di layar lebih besar (`py-20 sm:py-32`)
- **Theme toggle** fixed di pojok kanan bawah (`bottom-6 right-6`), selalu terlihat di semua halaman, z-index tinggi.

Tidak ada sidebar, navbar, atau footer global. Navigasi antar halaman dilakukan lewat link inline di dalam konten masing-masing halaman.

### 3.2 Providers (`components/providers.tsx`)

Membungkus aplikasi dengan:

- **ThemeProvider** (next-themes): `attribute="class"`, default `system`, mendukung deteksi preferensi OS.
- **Toaster** (Sonner): toast sukses/error, dipakai terutama di halaman Contact.

### 3.3 Pola Navigasi

| Dari | Ke | Pola navigasi |
|------|-----|---------------|
| Home | Stack, Blog, Contact | Link teks inline dengan warna accent |
| Stack, Blog, Contact | Home | Link "Back to home" dengan ikon panah kiri, ukuran teks kecil, warna muted |
| Blog post | Blog list | Link "Back to blog" + "All posts" di bawah artikel |
| 404 | Home | Link "Go back home" dengan underline animasi |

Tidak ada breadcrumb, tab bar, atau menu hamburger.

---

## 4. Halaman & Konten

### 4.1 Home (`/`)

**Tipe:** Client component (`HomeContent`) dengan stagger animation Framer Motion.

**Struktur vertikal** (jarak antar blok ~48px / `space-y-12`):

1. **Intro** — Paragraf besar (text-2xl): "Hi, my name is **Febrian Bayu Nugroho**" diikuti foto profil inline.
2. **What I do** — Paragraf: membangun web applications dan SaaS products.
3. **Work** — Paragraf: Mid Software Engineer di Trio Motor, dengan logo perusahaan (32×32px, rounded, border, shadow) sebagai link eksternal. Logo memiliki hover spring animation (rotate + scale).
4. **Tech focus** — Paragraf dengan tiga ikon tech inline (Next.js, React, TypeScript) dari Simple Icons. Ikon tersusun overlap horizontal; saat hover grup, ikon melebar (`-ml-2` → `ml-1`).
5. **Social platforms** — Paragraf dengan empat ikon sosial (GitHub, Instagram, LinkedIn, X) dengan pola overlap yang sama.
6. **Stack CTA** — Link ke `/stack` dengan teks accent "Click here."
7. **Separator** — Garis putus-putus horizontal (`border-dashed`), margin top besar (~80px).
8. **Footer-style links** — Dua baris teks kecil (text-sm, muted): link ke Blog dan Contact.

**Foto profil:** Avatar bulat 48×48px, border halus, shadow ring tipis. Saat hover muncul emoji 👋 dengan animasi wave berulang.

**Catatan vs PRD:** PRD menyebut "Product Showcase" dengan grid produk; di implementasi saat ini home **tidak** menampilkan daftar produk. Komponen `ProductLink` ada di codebase tapi belum dipakai di home page.

---

### 4.2 Stack (`/stack`)

**Tipe:** Client component dengan animasi stagger.

**Header section:**

- Link kembali ke home
- Avatar placeholder bulat 48×48 dengan inisial "FB" (bukan foto — berbeda dari home)
- Paragraf pembuka besar: "Here are the tools and services I use to build my apps and power them."

**Dua kategori:**

| Kategori | Judul | Isi |
|----------|-------|-----|
| Life tools | "Things that power my life" | Windsurf, Claude, Warp, Brave, Figma, Notion |
| App tools | "Things that power my apps" | Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Vercel, Bun |

**Setiap item stack:**

- Ikon Simple Icons di kiri (20×20px)
- Nama tool (font medium, hover → accent)
- Deskripsi dengan prefix panah "→"
- Item dengan URL menjadi link eksternal penuh; tanpa URL hanya teks statis

**Layout metadata:** `stack/layout.tsx` hanya menambahkan metadata SEO, tidak mengubah layout visual.

**Catatan:** Komponen `ToolCard` ada di codebase dengan styling card (rounded-2xl, hover background) tapi halaman stack saat ini memakai implementasi inline `StackItemRow`, bukan `ToolCard`.

---

### 4.3 Blog List (`/blog`)

**Tipe:** Server component untuk data, client component untuk list animation.

**Header:**

- Link back to home
- Judul "Blog" (text-3xl, semibold)
- Subtitle muted: "Thoughts on software engineering, design, and building products."

**List post:**

- Diurutkan tanggal terbaru dulu
- Setiap item: tanggal, judul, deskripsi
- Hover: background secondary/50, border muncul, judul berubah accent, ikon panah kanan slide in
- Padding negatif horizontal (-mx-4) agar area hover lebih lebar

**Data saat ini (3 artikel placeholder):**

1. Building a SaaS with Next.js 16
2. A Practical Guide to React 19 Actions
3. Mastering Tailwind CSS v4 with OKLCH

---

### 4.4 Blog Post (`/blog/[slug]`)

**Tipe:** Server component async dengan `generateStaticParams` dan `generateMetadata`.

**Struktur artikel:**

- Link "Back to blog"
- Judul besar (text-3xl / sm:text-4xl)
- Meta baris: tanggal • waktu baca
- Konten prose (heading, paragraf, list — parser sederhana per baris)
- Footer artikel: border top + link "All posts"

**Renderer konten:** Parser manual baris-per-baris (bukan MDX). Mendukung `##`, `###`, `- `, dan paragraf biasa.

---

### 4.5 Contact (`/contact`)

**Tipe:** Client component dengan layout dua kolom di layar medium ke atas.

**Header:**

- Link back to home
- Judul "Get in touch"
- Subtitle: "Let's build something great together."

**Kolom kiri — Contact Info:**

- Email: fbrnngrh@gmail.com (link mailto)
- Status availability: dot hijau berdenyut (Framer Motion pulse) + teks "Currently available for freelance work"
- Social pills: Twitter, GitHub, LinkedIn (komponen `SocialPill`)

**Kolom kanan — Form:**

- Field: Name, Email, Subject, Message (textarea 5 baris)
- Submit button full-width, primary color, ikon Send
- State loading: teks "Sending..."
- Validasi server-side via Zod; error per field ditampilkan di bawah input
- Submit via Server Action (`submitContact`) — saat ini **simulasi** (delay 1.5 detik, belum kirim email nyata)
- Toast sukses/error via Sonner

**Layout mobile:** Grid collapse ke satu kolom (info di atas, form di bawah).

---

### 4.6 Error & Not Found

**404 (`not-found.tsx`):**

- Centered vertically (~50vh min-height)
- Angka "404" besar (text-6xl)
- Teks "Page not found"
- Link ke home dengan underline animasi

**Global Error (`global-error.tsx`):**

- Layout HTML/body terpisah (fallback jika root layout crash)
- Pesan error + tombol "Try again"
- Styling masih hardcoded gray/black (belum memakai design tokens penuh)

---

## 5. Komponen UI Reusable

| Komponen | Lokasi | Dipakai di | Fungsi |
|----------|--------|------------|--------|
| `HomeContent` | components/ | Home | Seluruh konten homepage + animasi |
| `ProfilePhoto` | components/ | Home | Avatar + wave emoji hover |
| `ThemeToggle` | components/ | Root layout | Toggle dark/light dengan ripple transition |
| `SocialPill` | components/ | Contact | Pill button sosial dengan hover lift |
| `ToolCard` | components/ | *(belum dipakai)* | Card tool dengan icon box dan hover |
| `ProductLink` | components/ | *(belum dipakai)* | Link produk dengan underline animasi |
| `BlogList` | app/blog/ | Blog | List artikel dengan stagger animation |
| shadcn/ui | components/ui/ | Sebagian | Button, Input, Card, Skeleton, dll. |

---

## 6. Sistem Desain (Ringkasan Implementasi)

Detail lengkap ada di `DESIGN.md` di root proyek. Ringkasan singkat:

- **Color space:** OKLCH via CSS custom properties (light + dark)
- **Accent:** Biru cerah untuk link dan hover states
- **Typography:** Inter, skala besar untuk narasi home (text-2xl), lebih kecil untuk metadata
- **Radius:** Base 10px (0.625rem), pill untuk avatar/toggle, rounded-lg/2xl untuk card dan input
- **Depth:** Umumnya flat; shadow minimal hanya di avatar dan logo
- **Link pattern:** Accent color + underline on hover (utility `.link-underline`)

---

## 7. Animasi & Interaksi

| Elemen | Perilaku |
|--------|----------|
| Page content | Stagger fade-in + slide up (Framer Motion) |
| Profile photo | Scale 1.1 on hover; emoji wave infinite |
| Tech/social icons | Spring rotate + scale; overlap expand on group hover |
| Theme toggle | View Transition API ripple (Chrome/Arc/Edge) atau Framer Motion fallback; icon rotate swap |
| Blog list items | Stagger slide from left |
| Social pills | Hover lift (y: -2) + scale 1.05 |
| Availability dot | Pulse scale + opacity loop |
| Reduced motion | Semua animasi Framer Motion respect `useReducedMotion` |

---

## 8. Dark Mode

- Default mengikuti system preference
- Toggle manual via floating button
- Transisi tema: ripple circular dari posisi tombol (1 detik, ease-in-out)
- `prefers-reduced-motion`: skip animasi view transition
- Ikon tech/social menyesuaikan warna (mis. Next.js hitam → putih di dark mode)

---

## 9. Assets & Media

| Asset | Path | Dipakai |
|-------|------|---------|
| Foto profil | `/images/profile-photo-2.webp` | Home avatar |
| Foto profil alt | `/images/profile-photo.webp` | *(ada, belum dipakai di kode aktif)* |
| Logo Trio Motor | `/images/trio-motor-logo.jpeg` | Home work section |

---

## 10. Perbedaan Signifikan vs PRD

| Aspek | PRD | Implementasi saat ini |
|-------|-----|----------------------|
| Header navigasi | Minimal header | **Dihapus** — tidak ada header.tsx |
| Product showcase di home | Grid produk dengan Lucide icons | **Belum ada** — narasi paragraf saja |
| Stack kategori | Development, Frameworks, Database, Deployment | **"Life" vs "Apps"** — 2 kategori berbeda |
| ToolCard component | Dipakai di stack | **Ada tapi tidak digunakan** — inline row |
| Contact backend | Functional form | **Simulasi** — belum integrasi email/DB |
| Blog | Static atau CMS | **Static in-memory** — 3 post placeholder |
| Global error styling | Design tokens | **Hardcoded** gray/black |

---

## 11. Halaman & Route Map

```
/                     → Home (narasi personal + social + CTA)
/stack                → Daftar tools (life + apps)
/blog                 → List artikel
/blog/[slug]          → Artikel individual (3 slug statis)
/contact              → Form + info kontak
/404                  → Not found (catch-all via not-found.tsx)
```

Tidak ada route lain yang terimplementasi (mis. `/about`, `/projects`, `/uses` terpisah).

---

## 12. Kesimpulan

Portfolio-minimalist saat ini adalah **single-column personal site** dengan lima halaman inti, tanpa chrome navigasi global. Kekuatan desainnya ada pada tipografi besar, whitespace luas, micro-interactions halus, dan dark mode dengan transisi ripple. Beberapa komponen dan fitur dari PRD (product showcase, ToolCard di stack, backend contact nyata) belum terhubung ke halaman aktif — codebase sedang dalam fase implementasi bertahap dengan fondasi layout dan design system yang sudah solid.

Untuk referensi desain semantik (warna, typography, component styling) lihat **`DESIGN.md`** di root repository.

---

# Bagian B — Target Rewrite (SvelteKit + Svelte 5)

> Bagian ini **belum diimplementasi**. Isinya adalah spesifikasi teknis untuk rewrite berikutnya, dengan best practices dari dokumentasi resmi Svelte/SvelteKit.

## 13. Target Tech Stack

| Layer | Saat ini (Next.js) | Target (Svelte) |
|-------|-------------------|-----------------|
| Framework | Next.js 16 App Router | **SvelteKit** (file-based routing, SSR/SSG) |
| UI | React 19 | **Svelte 5** (runes mode) |
| Bahasa | TypeScript | TypeScript (native di Svelte 5) |
| Styling | Tailwind CSS 4 | Tailwind CSS via `npx sv add tailwindcss` |
| Animasi | Framer Motion | CSS transitions + `svelte/transition` / `svelte/motion` (hindari bundle berat jika tidak perlu) |
| Tema | next-themes | CSS class di `<html>` + `localStorage` / `matchMedia` (atau `mode-watcher`) |
| Icon brand / tech | Simple Icons (`react-simple-icons`) | **`@selemondev/svgl-svelte`** (logo SVG sebagai komponen Svelte) |
| Icon UI | Lucide React | Lucide Svelte atau Iconify CSS (lihat §15.5) |
| Form | Server Actions + Zod | **SvelteKit Form Actions** + Zod (validasi di `+page.server.ts`) |
| Notifikasi | Sonner | Toast library Svelte atau custom snippet |
| Blog | In-memory `lib/blog.ts` | Tetap static in-memory dulu; opsi `mdsvex` via `sv add mdsvex` nanti |
| Package manager | Bun | **Bun** (tetap) |
| Scaffolding | — | `bunx sv create` + `bunx sv add tailwindcss` |

### Struktur proyek target (SvelteKit)

```
src/
├── routes/
│   ├── +layout.svelte          # shell global (max-w-xl, theme toggle)
│   ├── +layout.ts              # (opsional) data shared
│   ├── +page.svelte            # Home
│   ├── stack/+page.svelte
│   ├── blog/
│   │   ├── +page.svelte
│   │   └── [slug]/+page.svelte
│   ├── contact/
│   │   ├── +page.svelte
│   │   └── +page.server.ts     # form actions + validasi
│   ├── +error.svelte
│   └── +layout.server.ts       # (opsional) hooks data
├── lib/
│   ├── blog.ts                 # data statis (port dari apps/web)
│   └── components/             # ProfilePhoto, SocialPill, ThemeToggle, dll.
└── app.css                     # design tokens OKLCH (port dari index.css)
static/
└── images/                     # foto profil, logo perusahaan
```

### Pemetaan route Next.js → SvelteKit

| Route saat ini | File SvelteKit target |
|----------------|----------------------|
| `app/page.tsx` | `src/routes/+page.svelte` |
| `app/stack/page.tsx` | `src/routes/stack/+page.svelte` |
| `app/blog/page.tsx` | `src/routes/blog/+page.svelte` |
| `app/blog/[slug]/page.tsx` | `src/routes/blog/[slug]/+page.svelte` |
| `app/contact/page.tsx` + `actions.ts` | `src/routes/contact/+page.svelte` + `+page.server.ts` |
| `app/not-found.tsx` | `src/routes/+error.svelte` |
| `app/global-error.tsx` | error boundary di root layout / `+error.svelte` |

---

## 14. Best Practices Svelte 5 (Runes Mode)

Panduan ini mengacu dokumentasi resmi Svelte 5 dan skill `svelte-core-bestpractices`. **Selalu gunakan runes mode** untuk kode baru — jangan campur pola legacy Svelte 4.

### 14.1 Runes — aturan inti

| Rune | Kapan dipakai | Hindari |
|------|---------------|---------|
| `$state` | State reaktif UI (counter, form input, toggle) | Jangan bungkus semua variabel; non-UI cukup `let` biasa |
| `$state.raw` | Objek/array besar yang hanya di-*reassign*, bukan dimutasi (mis. response API) | — |
| `$derived` | Nilai computed dari state/props | Jangan pakai `$effect` hanya untuk derive |
| `$derived.by` | Computed kompleks (perlu function body) | — |
| `$effect` | Side effect ke DOM/library eksternal | Jangan update state di dalam effect; jangan `if (browser)` — effect tidak jalan di server |
| `$props` | Props komponen | Ganti `export let` |
| `$bindable` | Two-way binding custom input | — |
| `$inspect` | Debug reaktivitas (dev only) | — |

**Contoh pola benar:**

```svelte
<script lang="ts">
  let { type = 'default' } = $props<{ type?: string }>();

  // ✅ derived dari props — akan update saat type berubah
  let accentClass = $derived(type === 'danger' ? 'text-destructive' : 'text-accent');

  // ❌ jangan: let accentClass = type === 'danger' ? ... (tidak reaktif)
</script>
```

### 14.2 Legacy → modern (wajib saat port)

| Legacy (Svelte 4 / React habit) | Modern (Svelte 5) |
|--------------------------------|-------------------|
| `export let foo` | `let { foo } = $props()` |
| `$: doubled = x * 2` | `let doubled = $derived(x * 2)` |
| `on:click` | `onclick` |
| `<slot>` | `{#snippet}` + `{@render children?.()}` |
| `<svelte:component this={X}>` | `<X>` (dynamic import) |
| `use:action` | `{@attach ...}` |
| `class:active={cond}` | `class={['base', cond && 'active']}` (clsx-style) |
| React `useEffect` untuk derive | `$derived` |
| React `useState` + Framer Motion stagger | CSS `@starting-style` / `{#each}` keyed + `transition:` |

### 14.3 Komponen & markup

- **`{#each items as item (item.id)}`** — selalu keyed; jangan pakai index sebagai key.
- **Snippets** — gunakan untuk pola markup berulang (mis. baris stack, item blog) alih-alih render props.
- **`<svelte:head>`** — metadata SEO per halaman (title, description, OG tags).
- **`<svelte:window>` / `<svelte:document>`** — event global (keyboard, scroll, visibility); jangan `onMount`/`$effect` untuk ini.
- **`<svelte:boundary>`** — error boundary + loading async (pengganti Suspense pattern).

### 14.4 Styling (selaras `DESIGN.md`)

- **Scoped CSS** default di `<style>` — cocok dengan komponen portfolio.
- **CSS custom properties** — cara utama parent mengatur child (theming, warna accent):

```svelte
<!-- Parent -->
<StackRow --icon-size="20px" />

<!-- Child -->
<style>
  .icon { width: var(--icon-size, 1.25rem); }
</style>
```

- **`style:--token={value}`** — bind variabel JS ke CSS custom property.
- **Tailwind** — tetap utility-first; token OKLCH dari `app.css` dipertahankan.

### 14.5 State management & SSR (SvelteKit)

- **Jangan simpan state user di variabel modul shared di server** — server stateless; race condition antar request.
- **Form state** — SvelteKit Form Actions + `enhance` progressive enhancement.
- **Shared UI state (theme)** — context via `createContext` (typed), bukan global module `$state` yang bisa bocor antar user SSR.
- **Load functions** — data blog/list di `+page.ts` / `+page.server.ts`; parallel fetch dengan composition (child routes fetch sendiri).

### 14.6 Aksesibilitas & performa (SvelteKit docs)

- Semantik HTML: `<main>`, `<nav>`, `<article>`, label form eksplisit.
- **`prefers-reduced-motion`** — hormati di CSS dan `svelte/transition` (port dari implementasi Framer Motion saat ini).
- **Prerender** — home, stack, blog cocok untuk static (`export const prerender = true` di layout blog).
- **Gambar** — `<enhanced:img>` atau `@sveltejs/enhanced-img` untuk foto profil (LCP).

### 14.7 Tooling saat bootstrap

```bash
bunx sv create portfolio-minimalist-svelte
cd portfolio-minimalist-svelte
bunx sv add tailwindcss eslint prettier vitest
bun add @selemondev/svgl-svelte zod
```

Integrasi lain yang relevan nanti: `mdsvex` (blog markdown), `playwright` (e2e), adapter Vercel/Node sesuai deploy target.

---

## 15. SVG & Brand Icons — `@selemondev/svgl-svelte`

Pengganti **Simple Icons** di implementasi React saat ini. Paket ini menyediakan **logo brand SVG** (GitHub, React, TypeScript, Next.js, Vercel, dll.) sebagai komponen Svelte yang **tree-shakable** — import hanya logo yang dipakai.

### 15.1 Instalasi

```bash
bun add @selemondev/svgl-svelte
```

### 15.2 Penggunaan dasar

```svelte
<script lang="ts">
  import { React, Typescript, Github } from '@selemondev/svgl-svelte';
</script>

<!-- Tech focus di Home -->
<span class="icon-group">
  <React width={20} height={20} class="rotate-[-6deg]" />
  <Typescript width={20} height={20} class="-ml-2 rotate-[-6deg]" />
</span>

<!-- Social di Home / Contact -->
<a href="https://github.com/..." aria-label="GitHub">
  <Github width={20} height={20} />
</a>
```

Props umum: `width`, `height`, `class`, dan atribut SVG lain via spread.

### 15.3 Katalog logo

Browse semua logo tersedia di **[svgl.app](https://svgl.app/)**. Nama export komponen mengikuti konvensi PascalCase dari nama brand (mis. `NextJs`, `Tailwindcss`, `Notion`, `Figma`).

### 15.4 Pemetaan dari implementasi saat ini

| Konteks saat ini | Simple Icons (React) | Target svgl-svelte |
|------------------|---------------------|-------------------|
| Home tech focus | SiNextdotjs, SiReact, SiTypescript | `NextJs`, `React`, `Typescript` |
| Home social | SiGithub, SiInstagram, SiLinkedin, SiX | `Github`, `Instagram`, `Linkedin`, `X` |
| Stack — life tools | SiWindsurf, dll. | Import per logo dari katalog svgl |
| Stack — app tools | SiNextdotjs, SiReact, dll. | Import per logo dari katalog svgl |
| Logo perusahaan (Trio Motor) | Asset raster `/images/trio-motor-logo.jpeg` | **Tetap asset statis** — bukan bagian svgl (logo custom) |

### 15.5 Best practices (SvelteKit Icons docs + svgl-svelte)

1. **Import named, bukan barrel penuh** — `import { React } from '@selemondev/svgl-svelte'`, jangan import seluruh paket sekaligus.
2. **Satu sumber icon brand** — konsolidasi ke svgl-svelte; hindari duplikasi dengan Simple Icons + Lucide untuk logo yang sama.
3. **Icon UI generik** (panah, send, moon/sun theme) — pakai Lucide Svelte atau **Iconify CSS** (disarankan SvelteKit docs untuk performa Vite pre-bundling).
4. **Dark mode** — svgl logo sering punya variant warna; atur via `class="dark:invert"` atau CSS custom property `--icon-color` di parent.
5. **Aksesibilitas** — logo dekoratif: `aria-hidden="true"`; logo sebagai link: `aria-label` di `<a>`, bukan di SVG.

> **Catatan SvelteKit docs:** hindari library yang memuat ribuan file `.svelte` per icon tanpa tree-shaking. `@selemondev/svgl-svelte` dirancang sebagai paket komponen optimized dengan named exports — pola import di §15.2 aman selama tetap per-logo.

---

## 16. Port Fitur per Halaman (Checklist Rewrite)

| Halaman | Prioritas | Catatan port ke Svelte |
|---------|-----------|------------------------|
| Home | P0 | `$props` minimal; stagger → CSS/`transition:fly`; ProfilePhoto + svgl icons |
| Stack | P0 | `{#each}` keyed; snippet `StackRow`; svgl per tool |
| Blog list | P0 | `load` function; `{#each posts as post (post.slug)}` |
| Blog post | P1 | `mdsvex` nanti; sementara port parser atau markdown sederhana |
| Contact | P1 | Form Actions + Zod; `enhance`; toast |
| Theme toggle | P0 | Context + View Transitions API (ripple) — port logic dari `ThemeToggle` |
| 404 / error | P2 | `+error.svelte` + design tokens (perbaiki hardcoded gray) |

Komponen yang belum dipakai (`ProductLink`, `ToolCard`) — implementasikan di Svelte jika PRD diaktifkan, dengan compound/snippet pattern alih-alih boolean props.

---

## 17. Referensi Dokumentasi Svelte (MCP)

Saat implementasi, agent harus konsultasi MCP Svelte dengan urutan:

1. `list-sections` — cari section by `use_cases`
2. `get-documentation` — fetch section relevan
3. `svelte-autofixer` — validasi setiap komponen sebelum merge

Section yang paling relevan untuk proyek ini:

| Topik | Path dokumentasi |
|-------|------------------|
| Runes overview | `svelte/what-are-runes` |
| State & derived | `svelte/$state`, `svelte/$derived` |
| Props & snippets | `svelte/$props`, `svelte/snippet` |
| Routing | `kit/routing` |
| Form contact | `kit/form-actions` |
| Icons | `kit/icons` |
| Tailwind setup | `cli/tailwind` |
| SEO / meta | `svelte/svelte-head`, `kit/seo` |
| A11y | `kit/accessibility` |
| Performance | `kit/performance` |

---

*Bagian A merefleksikan snapshot codebase Next.js per 20 Juni 2026. Bagian B adalah spesifikasi rewrite SvelteKit — diperbarui dengan best practices dari Svelte MCP resmi.*

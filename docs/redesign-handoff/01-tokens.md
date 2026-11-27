# 01 · Token

Sumber: koleksi variabel Figma **"Portfolio color"** (mode Light | Dark) dan **"Spacing & radius"**, ditambah survei semua teks, radius dan shadow di halaman Hi-fi. Koleksi lama "Color" (3:2) dan text style Plus Jakarta Sans adalah token repo lama, **tidak dipakai** lagi.

Skill: better-colors (nama token semantik, kontras), better-typography (skala, line-height, tracking, fitur font), better-layout (kolom, breakpoint), better-ui (radius konsentris, shadow sebagai ring).

> Implementasi: semua token di bawah sudah ditempel di `apps/web/src/app.css` (blok `:root` dan `.dark`). Dokumen ini tetap sumber nilai.

## 1. Warna

Tulis sebagai custom property. Repo memakai class `.dark` (Tailwind `@custom-variant dark`); pertahankan pola itu. Jika tema ikut sistem (keputusan §4.1 di handoff utama), set class `.dark` dari `prefers-color-scheme` di skrip kecil di `app.html` sebelum paint, agar tidak berkedip.

```css
:root {
  color-scheme: light;
  /* dasar */
  --bg-page: #fcfcfc;
  --bg-subtle: #fafafa;
  --surface-default: #ffffff;
  --surface-muted: #f3f3f3;
  --surface-placeholder: #ececec;
  --surface-inverse: #1a1a1a;
  --surface-cover: #f0f0f0;
  --fg-default: #1a1a1a;
  --fg-secondary: #545454;
  --fg-muted: #6b6b6b;
  --fg-faint: #737373;
  --fg-on-inverse: #ffffff;
  --fg-on-inverse-muted: #a3a3a3;
  --line-strong: #6b6b6b;
  --line-default: #a3a3a3;
  --line-soft: #d1d1d1;
  --border-default: #e5e5e5;
  --inverse-tag: #ffffff29;
  --shadow-ring: #00000012;
  --shadow-depth: #00000014;
  --image-outline: #0000001a;
  --focus-ring: var(--fg-default);

  /* aksen proyek */
  --fleet-solid: #8264c8; --fleet-strong: #6a51a4; --fleet-text: #6a51a4;
  --fleet-subtle: #f2effe; --fleet-muted: #e3dcfe;
  --ci-solid: #168040; --ci-text: #116a32; --ci-subtle: #e8f6ea;
  --ci-muted: #c8ecce; --ci-border: #95d7a2; --ci-bg: #f6fbf7;
  --blue-solid: #337bd0; --blue-text: #2863ab; --blue-subtle: #eaf3fe;
  --blue-muted: #cfe3fe; --blue-glow: #9dc7fe;
  --anti-subtle: #eef2fb;
  --orange-text: #9d4616; --orange-muted: #fed8c7;

  /* glow kartu proyek */
  --glow-dealer: #9dc7fe; --glow-ci: #a7e8bd; --glow-fleet: #c9b8fb; --glow-sales: #ffc9a0;
  --glow-opacity: 0.35;        /* "ringan"; 0.5 = "lebih kuat" */

  /* panggung video (stage) */
  --stage-glow-merged: #c4a8fb; --stage-glow-merged-2: #a9b8fb;
  --stage-glow-pass: #9fe3b4;   --stage-glow-pass-2: #a5e3f2;
  --stage-glow-fail: #ffb9ad;   --stage-glow-fail-2: #ffd3a8;
  --stage-glow-claude: #f6b89f; --stage-glow-claude-2: #f8d39f;
  --stage-accent-merged: #8250df; --stage-on-merged: #ffffff;
  --stage-accent-pass: #1a7f37;
  --stage-accent-fail: #cf222e;
  --stage-accent-claude: #d97757; --stage-accent-claude-text: #b5543a;
  --stage-terminal-bg: #161618; --stage-terminal-fg: #ededed;
  --stage-terminal-muted: #a1a1a1; --stage-terminal-ok: #3fb950;
  --stage-diff-add: #eafbef;
  --stage-tint-pass: #e4f0e7; --stage-tint-merged: #f0eafb;
  --stage-tint-claude: #f9e9e4; --stage-tint-fail: #fcebe8;
  --stage-line-pass: #8cbf9b;
  --stage-glow-opacity-1: 0.72; --stage-glow-opacity-2: 0.60; --stage-glow-opacity-3: 0.46;
  --stage-cloud-opacity-1: 0.45; --stage-cloud-opacity-2: 0.36;
}

.dark {
  color-scheme: dark;
  --bg-page: #0e0e0f;
  --bg-subtle: #131315;
  --surface-default: #161618;
  --surface-muted: #222225;
  --surface-placeholder: #26262a;
  --surface-inverse: #ededed;
  --surface-cover: #1f1f22;
  --fg-default: #ededed;
  --fg-secondary: #c2c2c2;
  --fg-muted: #a1a1a1;
  --fg-faint: #808080;
  --fg-on-inverse: #111111;
  --fg-on-inverse-muted: #5c5c5c;
  --line-strong: #8e8e93;
  --line-default: #5c5c62;
  --line-soft: #3a3a3f;
  --border-default: #2a2a2e;
  --inverse-tag: #0000001a;
  --shadow-ring: #ffffff17;
  --shadow-depth: #00000080;
  --image-outline: #ffffff1a;

  --fleet-solid: #7a5fd0; --fleet-strong: #6a51a4; --fleet-text: #b9a6f2;
  --fleet-subtle: #221c38; --fleet-muted: #2c2447;
  --ci-solid: #1b8040; --ci-text: #5fd17f; --ci-subtle: #12291a;
  --ci-muted: #183d25; --ci-border: #1f5a33; --ci-bg: #0f1f15;
  --blue-solid: #5b9bea; --blue-text: #8bb8f0; --blue-subtle: #12233a;
  --blue-muted: #1a3352; --blue-glow: #1f416b;
  --anti-subtle: #16213a;
  --orange-text: #f0a27a; --orange-muted: #3d2216;

  --glow-dealer: #2e6bd9; --glow-ci: #1f9d5a; --glow-fleet: #7a5af0; --glow-sales: #e07a2e;
  --glow-opacity: 0.16;        /* "ringan"; 0.26 = "lebih kuat" */

  --stage-glow-merged: #6e40c9; --stage-glow-merged-2: #4a4fd6;
  --stage-glow-pass: #1f8a4a;   --stage-glow-pass-2: #1f7f9e;
  --stage-glow-fail: #a8302a;   --stage-glow-fail-2: #9a5a1c;
  --stage-glow-claude: #c15f3c; --stage-glow-claude-2: #a8692a;
  --stage-accent-merged: #a371f7; --stage-on-merged: #0e0e0f;
  --stage-accent-pass: #3fb950;
  --stage-accent-fail: #f85149;
  --stage-accent-claude: #d97757; --stage-accent-claude-text: #e08a6d;
  --stage-terminal-bg: #0a0a0b; --stage-terminal-fg: #ededed;
  --stage-terminal-muted: #8f8f8f; --stage-terminal-ok: #3fb950;
  --stage-diff-add: #132a1b;
  --stage-tint-pass: #1b2a1f; --stage-tint-merged: #272133;
  --stage-tint-claude: #352622; --stage-tint-fail: #341e1c;
  --stage-line-pass: #2b6834;
  --stage-glow-opacity-1: 0.40; --stage-glow-opacity-2: 0.32; --stage-glow-opacity-3: 0.24;
  --stage-cloud-opacity-1: 0.18; --stage-cloud-opacity-2: 0.14;
}
```

Di Figma token panggung bernama `molly/*` (nama kerja dari referensi gaya). Di kode pakai `--stage-*` seperti di atas.

### Warna per slide panggung

Warna latar halaman ikut slide yang sedang tampil (keputusan B2). Glow dipasang sebagai lapisan halaman di belakang konten, bukan di dalam kartu panggung.

| Slide | Isi | Glow 1 / glow 2 | Aksen (segmen progres, label) | Tint |
|---|---|---|---|---|
| 1 | Alur fleet, PR merged | `--stage-glow-merged` / `-merged-2` (ungu) | `--stage-accent-merged` | `--stage-tint-merged` |
| 2 | CI/CD: shot 1 gagal, shot 2–4 lulus | shot 1: `--stage-glow-fail` / `-fail-2` (merah); shot 2–4: `--stage-glow-pass` / `-pass-2` (teal-hijau) | `--stage-accent-fail` lalu `--stage-accent-pass` | `--stage-tint-fail` lalu `--stage-tint-pass` |
| 3 | Orkestrasi agen | `--stage-glow-claude` / `-claude-2` (clay) | `--stage-accent-claude` (teks: `-claude-text`) | `--stage-tint-claude` |

Lapisan glow: tiga lingkaran blur dengan opacity `--stage-glow-opacity-1/2/3`, dua "awan" dengan `--stage-cloud-opacity-1/2`. Blur 90–210 px (aura 90/160, awan 110/200). Pakai `filter: blur()` pada elemen yang ukurannya tetap, bukan `backdrop-filter`.

### Kontras (diukur di Figma)

Semua teks lolos AA, nilai terendah 4.58:1. Cincin fokus `--focus-ring` (= fg/default) di atas latar: 16:1. Jangan pakai `--fg-faint` untuk teks di atas `--surface-muted` tanpa mengukur ulang. Aksen teks proyek di mode gelap memakai varian `-text` yang terang (misal `--fleet-text: #b9a6f2`), bukan `-solid`.

### Tailwind v4

Ganti blok `@theme` di `app.css` dengan pemetaan ke variabel di atas, misalnya:

```css
@theme inline {
  --color-page: var(--bg-page);
  --color-subtle: var(--bg-subtle);
  --color-surface: var(--surface-default);
  --color-surface-muted: var(--surface-muted);
  --color-fg: var(--fg-default);
  --color-fg-secondary: var(--fg-secondary);
  --color-fg-muted: var(--fg-muted);
  --color-fg-faint: var(--fg-faint);
  --color-border: var(--border-default);
  --color-line-soft: var(--line-soft);
  --color-fleet: var(--fleet-text);
  --color-ci: var(--ci-text);
  --color-blue: var(--blue-text);
  --color-orange: var(--orange-text);
  /* tambah sesuai kebutuhan komponen */
}
```

Token lama (`--color-accent #02a9f7`, `--color-primary`, dst.) dan utilitas `.link-underline`, `.section-label`, `.reveal`, `.scroll-reveal` di `app.css` diganti. Cari pemakaiannya di `src/` sebelum dihapus.

## 2. Tipografi

Dua keluarga: **Inter** (teks, judul) dan **Geist Mono** (label bagian, kode, angka kecil). Self-host keduanya (variable font, subset Latin) dan `preload` file Inter. `font-display: swap`. Paket yang mungkin dipakai: `@fontsource-variable/inter` dan `@fontsource-variable/geist-mono` atau paket `geist`; perlu ya Febrian sebelum dipasang.

```css
:root {
  --font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", "Geist Mono", ui-monospace, SFMono-Regular, monospace;
}
body {
  font-family: var(--font-sans);
  font-feature-settings: "cv11", "ss01"; /* opsional; cek di browser apakah cocok dengan Figma */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }
.tabular { font-variant-numeric: tabular-nums; }   /* penghitung 1 / 3, durasi, angka stat */
code, pre, .mono { font-family: var(--font-mono); font-variant-ligatures: none; }
```

### Skala

Tracking Figma dalam persen ukuran huruf. Di CSS pakai `em`: −2% = `-0.02em`.

| Peran | Desktop | Ponsel | Line-height | Tracking | Keluarga / berat |
|---|---|---|---|---|---|
| Kalimat hero | 40 px | 24 px | 1.2 (ponsel 34 px) | −0.02em (ponsel −0.01em) | Inter 500 |
| Kalimat hero, ukuran tengah (usulan untuk tablet) | 30 px | – | 1.24 | −0.015em | Inter 500 |
| Tautan menu Explore | – | 44 px | 1.1 | −0.03em | Inter 500 |
| H1 artikel | 32 px | 28 px | 1.2 | −0.02em | Inter 600 |
| Judul modal / sheet | 24 px | 24 px | 1.25 | −0.02em | Inter 600 |
| Judul kartu tulisan (kipas) | 22 px | 22 px | 1.18 | −0.015em | Inter 600 |
| H2 artikel | 20 px | 20 px | 1.3 | −0.01em | Inter 600 |
| Lead artikel | 19 px | 17 px | 1.5 | 0 | Inter 400 |
| Angka stat | 18 px | 18 px | 1.4 | 0 | Inter 600, tabular |
| Body / About | 17 px | 16 px | 1.55 | 0 | Inter 400 |
| Judul kartu kerja, nama | 15 px | 15 px | 1.4 | 0 | Inter 500 |
| Deskripsi kartu, meta, deskripsi Writing | 15 px | 15 px | 1.4 (Writing 1.5) | 0 | Inter 400 |
| Node peta fleet | 14 px | 14 px | 20 px | 0 | Inter 600 |
| Tombol Explore | – | 14 px | 1 | 0 | Inter 500 |
| Footer, teks kecil | 13 px | 13 px | 1.4 | 0 | Inter 400 |
| Tag / chip | 10 px | 10 px | 1.4 | 0.02em | Inter 500 |
| Label bagian ("Selected work", "About") | 13 px | 13 px | 1.4 | 0 | Geist Mono 400 |
| Label mono kecil ("Scroll", "1 / 3") | 12 px | 12 px | 1 | 0 | Geist Mono 400, tabular |
| Label peta fleet | 11 px | 11 px | 16 px | 0 | Geist Mono 400 |
| Blok kode | 14 px | 13 px | 1.6 | 0 | Geist Mono 400, ligatur mati |
| Durasi di kartu artikel | 10 px | 10 px | 1.4 | 0 | Geist Mono 400 |

Ukuran ponsel untuk body (16 px) dan lead (17 px) adalah usulan better-typography; Figma ponsel memakai 15–17 px. Label bagian Geist Mono **tidak** uppercase (beda dengan `.section-label` repo yang uppercase).

Panjang baris: kolom teks 540 px ≈ 62–66 karakter di 17 px. Jangan lebarkan.

## 3. Spacing, radius, shadow

### Spacing

Skala (px): 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 128. Tambahan yang dipakai di layout: 64, 80, 114, 120, 160.

| Pemakaian | Desktop | Ponsel |
|---|---|---|
| Jarak antar bagian Home | 120 | 80 |
| Padding atas halaman (setelah hero) | 160 | 64 |
| Padding bawah halaman | 120 | 114 (ruang untuk profil mengambang) |
| Gutter samping | – (kolom terpusat) | 24 |
| Jarak dalam blok intro hero | 28 | 24 |
| Kontrol berbatas yang bersebelahan | 12 | 12 |
| Tautan tanpa batas (nav, sosial) | 24 antar glyph | 24 |

### Radius

| Token | Nilai | Dipakai di |
|---|---|---|
| `--radius-xs` | 2 | Segmen progres panggung |
| `--radius-tag` | 5 | Tag kecil |
| `--radius-chip` | 6 | Chip, `md` |
| `--radius-button` | 8 | Tombol, `lg` |
| `--radius-email` | 10 | Tombol Email me |
| `--radius-node` | 12 | Node peta fleet |
| `--radius-round` | 16 | Tombol bulat, prev/next |
| `--radius-card` | 20 | Kartu tulisan (kipas) |
| `--radius-stage` | 24 | Panggung, modal (24 = 16 + 8, konsentris dengan isi padding 8) |
| `--radius-pill` | 9999 | Pill, tag |

Aturan konsentris (better-ui): radius luar = radius dalam + padding + border. Pertahankan saat mengubah padding.

### Shadow

Selalu pasang `border: 1px solid transparent` di bawah ring shadow agar mode forced-colors tetap menggambar tepi.

```css
:root {
  --shadow-ring-1: 0 0 0 1px var(--shadow-ring);
  --shadow-node: 0 1px 2px -1px #00000014, 0 4px 8px -4px #00000014;
  --shadow-button: 0 0 0 1px #00000012;
  --shadow-profile: 0 0 0 1px #0000000f, 0 8px 24px -4px #00000014;
  --shadow-post-card: 0 0 0 1px #0000001a, 0 1px 2px -1px #0000000f, 0 16px 32px -12px #0000001a;
  --shadow-modal: 0 0 0 1px #00000012, 0 24px 48px -12px #00000014;
  --shadow-hover-card: 0 0 0 1px #00000012, 0 8px 24px -4px #00000014;
  --shadow-device: 0 1px 2px #0000001a, 0 8px 20px -4px #0000001f, 0 24px 48px -12px #00000029;
}
.dark {
  /* shadow kedalaman hilang di latar gelap: pakai ring putih */
  --shadow-ring-1: 0 0 0 1px #ffffff17;
  --shadow-button: 0 0 0 1px #ffffff17;
  --shadow-profile: 0 0 0 1px #ffffff17, 0 8px 24px -4px #00000080;
  --shadow-post-card: 0 0 0 1px #ffffff1a, 0 16px 32px -12px #00000080;
  --shadow-modal: 0 0 0 1px #ffffff17, 0 24px 48px -12px #00000080;
  --shadow-hover-card: 0 0 0 1px #ffffff17, 0 8px 24px -4px #00000080;
}
```

Gambar konten: `outline: 1px solid var(--image-outline); outline-offset: -1px;` (bukan untuk logo transparan).

## 4. Layout dan breakpoint

Figma menggambar dua ukuran: **ponsel 390** dan **desktop 1440**. Breakpoint di bawah adalah usulan better-layout berdasarkan kapan konten berhenti muat.

| Nama | Lebar viewport | Perilaku |
|---|---|---|
| ponsel | < 768 px | Layout 390: gutter 24, tombol Explore fixed, carousel bleed ke kanan untuk mengintip kartu berikut, sheet untuk detail. |
| tablet | 768–1099 px | Layout desktop satu kolom; panggung `width: min(1040px, 100% - 48px)`; kalimat hero 30 px; nav desktop. |
| desktop | ≥ 1100 px | Layout 1440 penuh. |

Kolom:

```css
:root {
  --col-text: 540px;   /* teks: about, writing, artikel body */
  --col-wide: 760px;   /* selected work, peta fleet, kipas writing */
  --col-stage: 1040px; /* panggung video */
  --col-hero: 880px;   /* blok intro hero */
}
.col-text  { width: min(var(--col-text), 100% - 48px);  margin-inline: auto; }
.col-wide  { width: min(var(--col-wide), 100% - 48px);  margin-inline: auto; }
.col-stage { width: min(var(--col-stage), 100% - 48px); margin-inline: auto; }
```

Ukuran penting dari Figma:

| Elemen | Desktop (1440) | Ponsel (390) |
|---|---|---|
| Hero | 1440×900, layar penuh (`min-height: 100dvh`) | 390×844, layar penuh |
| Blok intro hero | lebar 880, mulai y 276 | lebar 342, mulai y 218 |
| Panggung | 1040×724 | 342×686 |
| Selected work / Writing | 760 | 366 (bleed ke kanan, mengintip) |
| Artikel | body 540; TOC sticky di kiri, x 200, lebar 212 | TOC tidak tampil |
| Nav desktop | kanan atas, y 32, ikut tergulir bersama hero | – |
| Tombol Explore | – | fixed kanan atas (16 dari tepi), 81×35 |
| Profil mengambang | fixed kiri bawah, 24 dari tepi, 48×48 | fixed kiri bawah, 16 dari tepi, 48×48 |

Pakai `dvh` untuk tinggi layar penuh, `env(safe-area-inset-*)` untuk elemen fixed (tambah `viewport-fit=cover` di meta viewport), dan `scroll-padding-top: 72px` di `html`.

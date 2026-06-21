# Design System: Febrian Bayu Nugroho — Portfolio Minimalist

**Project ID:** portfolio-minimalist (local codebase — derived from `apps/web/src/index.css` and component implementations)

---

## 1. Visual Theme & Atmosphere

Portfolio ini mengusung estetika **Quiet Minimalism** — ruang kosong yang sengaja dibiarkan, konten yang berbicara sendiri tanpa dekorasi berlebihan. Kepadatan visual rendah: satu kolom sempit di tengah layar, paragraf besar yang terasa seperti percakapan langsung dengan pemilik situs, bukan brosur perusahaan.

Suasana keseluruhan: **Airy, Personal, dan Confident.** Tidak utilitarian-kaku, tidak juga playful-berlebihan. Sentuhan warmth datang dari foto profil inline, emoji wave saat hover, dan ikon tech/social yang sedikit miring (rotated -6°) seolah ditaruh casual di atas meja. Inspirasi visual mengacu pada personal site modern seperti chrisraroque.com — fokus pada narasi, bukan grid feature.

Dark mode bukan sekadar inversi warna; ia mempertahankan kontras lembut dengan background charcoal dan teks off-white, sehingga mata tetap nyaman saat membaca panjang.

---

## 2. Color Palette & Roles

Sistem warna dibangun di **OKLCH color space** (Tailwind CSS 4) agar lightness terasa konsisten di semua hue. Nilai hex di bawah adalah konversi referensi dari token OKLCH aktual.

### Light Mode

| Nama Descriptive | Hex (approx.) | Peran Fungsional |
|------------------|---------------|------------------|
| **Pure Canvas White** | `#FFFFFF` | Background utama seluruh halaman — ruang bersih untuk konten |
| **Ink Charcoal** | `#252525` | Teks body dan heading utama — kontras tinggi tanpa hitam pekat |
| **Deep Graphite** | `#333333` | Primary actions (tombol submit) — anchor visual untuk CTA |
| **Cloud White** | `#FAFAFA` | Teks di atas primary button |
| **Whisper Gray** | `#F5F5F5` | Secondary surfaces — pill buttons, avatar fallback, hover blog item |
| **Soft Stone Border** | `#EBEBEB` | Garis pemisah, border input, dashed separator |
| **Slate Muted Text** | `#737373` | Metadata, subtitle, back links, deskripsi sekunder |
| **Sky Pulse Blue** | `#48A9E8` | Accent — inline links, hover judul, focus ring, brand highlight |
| **Ember Alert Red** | `#DC4424` | Destructive — pesan error validasi form |

### Dark Mode

| Nama Descriptive | Hex (approx.) | Peran Fungsional |
|------------------|---------------|------------------|
| **Midnight Charcoal** | `#252525` | Background utama — hangat, tidak pure black |
| **Soft Snow Text** | `#FAFAFA` | Teks body dan heading |
| **Elevated Slate** | `#333333` | Card/popover surfaces (jika dipakai) |
| **Muted Steel** | `#434343` | Secondary backgrounds di dark mode |
| **Frosted Border** | `rgba(255,255,255,0.10)` | Border halus — hampir invisible tapi cukup definisi |
| **Sky Pulse Blue** | `#48A9E8` | Accent — tetap sama di kedua mode (identitas brand konsisten) |

### Accent Khusus (di luar token)

| Nama | Nilai | Peran |
|------|-------|-------|
| **Live Green Pulse** | `#22C55E` (green-500) | Availability indicator di halaman Contact — "currently available" |
| **Brand icon colors** | GitHub `#181717`, React `#61DAFB`, TypeScript `#3178C6`, dll. | Warna asli logo tech/social — dipakai di icon tiles, bukan di UI chrome |

---

## 3. Typography Rules

**Font family:** Inter (Google Fonts, variable weight) — sans-serif modern, netral, highly legible di layar kecil maupun besar.

**Karakter tipografi:** Clean dan conversational. Tidak ada display font atau serif — keseluruhan situs terasa seperti medium blog post yang dirapikan.

| Level | Ukuran / Weight | Penggunaan |
|-------|-----------------|------------|
| **Narrative Lead** | 24px / regular (text-2xl, leading-8) | Paragraf utama di Home — "Hi, my name is…", "I build…" |
| **Page Title** | 30–36px / semibold, tracking-tight | Judul halaman Blog, Contact |
| **Article Title** | 30–36px / semibold | Judul blog post individual |
| **Section Heading** | 18px / medium (text-lg) | Judul kategori di Stack ("Things that power my life") |
| **Body / Description** | 16px / regular | Deskripsi blog, teks form label |
| **Meta / Caption** | 14px / regular, muted color | Tanggal post, back links, footer-style links di home |
| **Monospace inline** | text-xs, font-mono | Kode diskon/referral di stack (jika ada) |

**Emphasis pattern:** Kata kunci penting (nama, "web applications", "SaaS products") memakai **font-semibold** di dalam paragraf regular — hierarchy tanpa heading terpisah.

**Prose styling (blog content):** Heading h2 di 20px/semibold dengan margin top besar; paragraf line-height 1.75; list items tanpa styling khusus beyond default.

---

## 4. Component Stylings

### Buttons

- **Primary submit (Contact):** Full-width, background Deep Graphite (light) / inverted di dark, teks Cloud White, **subtly rounded corners** (10px / rounded-lg), padding vertical 12px. Hover: opacity 90%. Disabled: opacity 70%.
- **Theme toggle:** **Pill-shaped** (rounded-full), 40×40px, border Soft Stone, background semi-transparent dengan backdrop blur. Hover: accent tint 10%.
- **Social pills:** **Pill-shaped** (rounded-full), background Whisper Gray, padding horizontal 16px vertical 8px. Hover: lift -2px + scale 1.05.

### Cards / Containers

- **Blog list item (hover state):** **Generously rounded corners** (16px / rounded-2xl), transparent default → Whisper Gray 50% + border on hover. Tidak ada shadow.
- **ToolCard (komponen tersedia):** rounded-2xl, icon box 40×40 rounded-xl dengan secondary background. Hover: icon scale + rotate 5°.
- **Avatar / Profile photo:** **Perfect circle** (rounded-full), 48×48px, border 1px Soft Stone, hairline shadow ring (rgba black/white 8%).
- **Company logo tile:** rounded-lg (8px), 32×32, border + shadow-sm.

### Inputs / Forms

- **Text fields & textarea:** Full width, padding 12px, **subtly rounded corners** (rounded-lg), border Soft Stone, background Pure Canvas. Focus: ring 2px Sky Pulse Blue, no default outline.
- **Labels:** text-sm, font-medium, spacing 8px di atas field.
- **Error text:** text-sm, Ember Alert Red, langsung di bawah field terkait.

### Links

- **Inline accent links:** Sky Pulse Blue, underline on hover (native atau `.link-underline` animated — garis bawah tumbuh kiri-ke-kanan 0.25s).
- **Back navigation links:** Slate Muted Text → Ink Charcoal on hover, dengan ikon ArrowLeft 16px.
- **External tool links (Stack):** Nama tool font-medium, hover → accent color; seluruh row clickable.

### Icons

- **Tech/social tiles (Home):** 36×36px, rounded-lg, brand background color, icon putih/hitam sesuai kontras. Overlap -8px antar tile; expand on group hover.
- **Stack icons:** 20×20px Simple Icons, warna brand asli.
- **Lucide icons:** 16–24px, stroke-based, currentColor.

### Separators

- **Home section divider:** Horizontal dashed line, Soft Stone, margin top 80px — memisahkan narasi utama dari footer-style links.

---

## 5. Layout Principles

### Whitespace Strategy

Whitespace adalah **elemen desain utama**, bukan sisa ruang. Padding vertikal main area sangat besar (80–128px) agar konten "bernafas." Jarak antar section di home 48px (`space-y-12`). Blog dan stack memakai spacing serupa untuk konsistensi ritme vertical.

### Content Width

- **Max width 576px** (max-w-xl) — intentionally narrow, optimal untuk reading length 50–75 karakter per baris.
- **Horizontal padding 24px** — mencegah teks menempel edge di mobile.

### Grid & Alignment

- **Single column default** — semua halaman stack vertikal.
- **Contact page exception:** Two-column grid (md:grid-cols-2) pada layar ≥768px — info kiri, form kanan, gap 48px.
- **Home inline elements:** Avatar, logo, dan icon tiles **inline dengan teks** (align-middle) — blurring boundary antara copy dan visual.

### Fixed Elements

- Hanya **theme toggle** yang fixed (bottom-right 24px). Tidak ada sticky header atau floating nav.

### Responsive Behavior

- Home social/tech icons: overlap collapse tetap di mobile.
- Contact: single column stack di mobile.
- ProductLink (jika dipakai nanti): flex-col di mobile, flex-row di sm+.

### Motion as Layout Feedback

Animasi tidak mengubah layout — hanya opacity, transform, dan clip-path. Stagger entrance memberi urutan baca natural top-to-bottom. Reduced motion preference menonaktifkan translate/scale tapi tetap allow instant theme switch.

---

## 6. Theme Transition Signature

Salah satu signature visual proyek ini adalah **circular ripple reveal** saat toggle dark/light mode:

- Origin: center tombol theme toggle
- Duration: 1 detik, ease-in-out
- Chrome/Arc/Edge: View Transition API dengan clip-path circle expanding to 200vmax
- Fallback browser: Framer Motion overlay dengan pola serupa
- Reduced motion: instant switch, no animation

Ini memberi identitas interaksi yang memorable tanpa mengganggu minimalism halaman.

---

## 7. Design Principles Summary

1. **Content is the interface** — tidak ada chrome navigasi; link hidup di dalam copy.
2. **One column, always** — kecuali contact split yang justified by function.
3. **Accent sparingly** — biru hanya untuk interaksi (link, hover, focus).
4. **Flat by default** — elevation hanya di avatar/logo hairline shadow.
5. **Personality through micro-motion** — wave emoji, tilted icons, ripple theme — bukan through ornament.
6. **Perceptual color consistency** — OKLCH tokens ensure dark mode feels balanced, not inverted.

---

*Design system derived from production codebase snapshot, June 2026. For page-level implementation details, see `docs/PORTFOLIO_CURRENT_STATE.md`.*

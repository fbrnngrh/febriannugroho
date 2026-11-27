# 02 · Komponen dan state

Sumber: halaman **Komponen** (34:1676) dan layar Hi-fi. Skill: build-design (pakai ulang komponen repo bila ada), better-ui, better-accessibility, better-interface.

Aturan state untuk semua komponen interaktif:

- **Hover** hanya di perangkat dengan pointer halus: bungkus dengan `@media (hover: hover) and (pointer: fine)`. Hover tidak pernah menggeser posisi.
- **Tekan** (`:active`) memberi umpan balik dalam 100 ms.
- **Fokus** memakai `:focus-visible`: cincin 2 px `--focus-ring`, offset 2 px. Jangan hilangkan outline tanpa pengganti.
- **Disabled** di desain ini hampir tidak ada; jika perlu: `opacity: 0.4; cursor: not-allowed;` dan `aria-disabled="true"` atau `disabled`.
- Nilai motion state ada di 04-motion.md §2.

## 1. Pemetaan ke repo

| Komponen repo sekarang | Jadi | Figma |
|---|---|---|
| `ProjectCard.svelte` | **WorkCard** (kartu Selected work). Buang `hover:-translate-y-0.5` dan `transition-all`. | 19:940 Showcase card, 289:16453 WF/WorkCard, 289:16471 WF/WorkCard mobile, 24:1263 |
| `BlogListItem.svelte` | **WritingRow** (baris daftar Writing) | layar Writing 67:2322 |
| – (baru) | **PostCard** (kartu kipas Writing di Home) | 289:16550 Hi-fi/PostCard, 241:16652 Hi-fi/Writing kipas (C1) |
| `BackLink.svelte` | **BackLink** ("← Home", "← Writing") | 288:16461 Interaksi/Tautan kembali |
| `CopyCodeButton.svelte` | **CopyButton** (blok kode artikel dan "Copy email") | layar Artikel, Contact |
| `GitHubContributionCalendar.svelte` | **ShippingInPublic** | 26:1771 Section/Shipping in public |
| `ProfilePhoto.svelte` | dipakai di **FloatingProfile** dan hero | 27:1183 Floating profile |
| `SocialPill.svelte` | **SocialLinks** (tautan teks GitHub, LinkedIn, Threads, Instagram) | Contact, kartu profil |
| `StackToolItem.svelte` | **ToolList** ("Tools I use") dan **KitRow** ("Also in the kit") | 27:1200 Stack/Inline list |
| `ThemeToggle.svelte` | tergantung keputusan tema (handoff utama §4.1) | – |
| – (baru) | **SiteNav** desktop | 288:16441 Interaksi/Tautan nav (Perangkat=Desktop) |
| – (baru) | **ExploreButton** + **ExploreMenu** ponsel | 288:16472, menu 277:14039 / 277:14082 |
| – (baru) | **Hero** | layar Home 65:1506 |
| – (baru) | **VideoStage** + PauseButton + ProgressSegments | 205:18366 Panggung video v2, 205:22165 versi ponsel, 292:16535 Tombol jeda, adegan 204:14062–14877 |
| – (baru) | **WritingFan** + FanArrow + FanDots | 241:16652, 292:16562 Tombol panah kipas |
| – (baru) | **LinkPreview** (pratinjau tautan di About) | 26:1171 Accent/Link preview |
| – (baru) | **EmailMeButton** (pesawat kertas) | 121:3800 |
| – (baru) | **FleetMap** + AgentNode + AgentCard | 104:2817, 103:2047 versi ponsel, 112:2110 Avatar/Agent |
| – (baru) | **ProjectDialog** (modal desktop / sheet ponsel) | Detail CI/CD 67:2607, Dealer 213:10640, Sales 213:12031 |
| – (baru) | **Sheet** (dasar sheet ponsel) | 67:2123, 67:3226 |
| – (baru) | **ArticleToc** ("On this page", sticky) | layar Artikel 67:2438 |
| – (baru) | **CoverArt** (sampul tulisan) | 124:3599 / 3611 / 3624 / 3642 |
| – (baru) | **StatusDot**, **ArrowLink**, **Highlight** | 18:930, 18:916, 18:940 |

Komponen `WF/PostCard` (11:694) dan `WF/StackItem` (11:700) adalah wireframe lama; abaikan.

## 2. Komponen dan state

### Tautan nav (SiteNav, desktop)

Work · Writing · Stack · Email, kanan atas, Inter 15 / 500, `--fg-muted`, jarak 24 antar glyph.

| State | Tampilan |
|---|---|
| Default | `--fg-muted`, tanpa garis bawah |
| Hover | warna ke `--fg-default`, garis bawah 1 px tumbuh dari kiri |
| Tekan | `opacity: 0.64` |
| Fokus | cincin fokus 2/2 |
| Aktif (halaman sekarang) | `--fg-default`, `aria-current="page"` |

"Email" adalah `mailto:`. Nav ikut tergulir bersama hero (tidak sticky).

### Tautan kembali (BackLink)

"← Home" / "← Writing", Geist Mono 13 atau Inter 15 sesuai layar, `--fg-muted`. State sama dengan tautan nav; panah tidak bergerak saat hover.

### Tombol Explore (ponsel)

Pill 81×35, Inter 14 / 500, fixed kanan atas. Isi: teks "Explore". Saat menu terbuka, berubah menjadi tombol Close.

| State | Tampilan |
|---|---|
| Default | `--surface-default`, `--shadow-button` |
| Tekan | `scale: 0.96` + lapisan `--fg-default` 6% |
| Fokus | cincin fokus |
| Atribut | `aria-expanded`, `aria-controls="explore-menu"`, area sentuh min 44×44 (pakai pseudo-element) |

### Menu Explore (ponsel)

Layar penuh. Isi: tombol Close; tautan Work / Writing / Stack / Email (Inter 44 / 500, −0.03em); "Now: redesigning this site"; fbrnngrh@gmail.com. Tautan memakai state tekan `opacity: 0.64`. Terang 277:14039, gelap 277:14082.

### WorkCard (Selected work)

Empat kartu: Dealer, CI/CD, Fleet, Sales Tool. Desktop 760 kolom dengan panah ← → dan teks "drag for more"; ponsel bleed kanan dengan kartu berikut mengintip.

| State | Tampilan |
|---|---|
| Default | gambar sampul dengan glow proyek (`--glow-*` × `--glow-opacity`), judul Inter 15/500, deskripsi Inter 15/400 `--fg-muted` |
| Hover | lapisan `--fg-default` 4% + shadow y8 blur24 spread −8, 10%. Posisi tetap. |
| Tekan | lapisan `--fg-default` 8% |
| Fokus | cincin fokus mengikuti radius kartu |
| Aksi | membuka ProjectDialog. Elemen = `<button>` dengan nama aksesibel = judul kartu, atau `<a>` ke URL detail jika detail dijadikan rute. |

### Panah carousel

Tombol bulat radius 16, `--shadow-button`. Disabled di ujung daftar: `opacity: 0.4` + `disabled`. Label: "Previous project" / "Next project".

### PostCard (kipas Writing di Home)

Tiga kartu bertumpuk menyerupai kipas, radius 20, `--shadow-post-card`, sampul CoverArt, judul Inter 22/600, tanggal, "Written by Febrian", penghitung "1 / 3" (Geist Mono, tabular).

| State | Tampilan |
|---|---|
| Hover (kartu depan) | lapisan 4% + `--shadow-hover-card` |
| Tekan | lapisan 8% |
| Fokus | cincin fokus |
| Kartu belakang | tidak bisa difokus (`inert` atau `tabindex="-1"` pada tautan di dalamnya) |

Panah kipas (292:16562): Arah Kiri/Kanan × State Default/Hover/Pressed. Titik indikator: area sentuh 24 px. Nama: "Previous post" / "Next post"; titik: "Show post 2 of 3".

### WritingRow (halaman Writing)

Judul Inter 15/500, deskripsi Inter 15/400, meta "5 min · Nov 18". Seluruh baris adalah satu tautan. Hover: judul ke `--fg-default` + garis bawah; tekan: `opacity: 0.64`.

### Filter Writing

All / Shipping / Agents / Design. Pakai `<button aria-pressed>` dalam grup berlabel "Filter posts", atau tautan dengan query `?tag=`. Terpilih: latar `--surface-inverse`, teks `--fg-on-inverse`.

### Tombol jeda panggung

292:16535, Ikon {Jeda, Putar} × Perangkat × State. 32 px desktop, 44 px ponsel. `aria-label` "Pause showcase" / "Play showcase" dan `aria-pressed`.

### Segmen progres panggung

Empat segmen per slide, radius 2, terisi per shot dengan aksen slide. Dekoratif (`aria-hidden`); status slide diumumkan lewat teks "01 / 03".

### LinkPreview

Muncul di About saat hover **dan** fokus pada "CI/CD pipelines". Isi: "CI/CD pipelines" / "Case study · 4 min read →". Tutup dengan Esc, tetap terbuka saat pointer pindah ke pratinjau (WCAG 1.4.13). Tidak dipakai di layar sentuh: di sana tautan langsung membuka detail.

### FloatingProfile

27:1183, State {Collapsed, Open, Focus}. Collapsed: foto 48×48, `--shadow-profile`, fixed kiri bawah. Open: kartu dengan nama, "Software engineer · Banjarmasin", "Now: redesigning this site", EmailMeButton, alamat email + Copy, tombol ×, tautan GH / in / Th / IG. Tombol pemicu: `aria-expanded`, nama "Open profile"; tombol ×: "Close profile". Esc menutup dan fokus kembali ke foto.

### EmailMeButton (pesawat kertas)

121:3800, State {Idle, Hover, Ditekan, Terbang·tengah, Terbang·keluar, Selesai} × Gerak {Penuh, Dikurangi}. Radius 10. Aksi: buka `mailto:`. Label berubah ke "Mail app opened" dalam region `aria-live="polite"`. Nilai motion di 04-motion.md §8.

### CopyButton

"Copy email" dan Copy di blok kode. Setelah klik: ikon centang + "Copied" selama 2 s, lalu kembali. Pengumuman lewat `aria-live="polite"`. Gagal (clipboard ditolak): lihat 03-ux-pages.md §5.

### FleetMap, AgentNode, AgentCard

104:2817 Langkah {0 Diam … 6 Ship}; versi ponsel 103:2047. Node agen adalah `<button>` bernama "Open JARVIS card" dst. Avatar/Agent 112:2110: Agen {JARVIS, FRIDAY, ULTRON, EDITH, KAREN} × Ukuran {24, 40, 64} × State {Diam, Aktif}. Avatar adalah karakter orisinal (bukan karakter film).

| State node | Tampilan |
|---|---|
| Default | radius 12, `--shadow-node` |
| Hover | lapisan 4% |
| Tekan | `scale: 0.96`, 100 ms |
| Fokus | cincin fokus |
| Aktif (dalam alur) | avatar State=Aktif, cincin aksen fleet |

AgentCard: popover di desktop (dari node, offset 8 px), sheet di ponsel. Isi contoh FRIDAY ada di 05-content-assets.md. Hanya FRIDAY yang sudah punya isi; empat agen lain perlu teks.

### ProjectDialog

Modal di desktop (radius 24, `--shadow-modal`), sheet di ponsel. Struktur: label tahun dan jenis, tag, judul Inter 24/600, ringkasan, Problem / What I built / Result, tag teknologi, tautan "Read the full write-up" (hanya CI/CD). Tombol Tutup dengan area 44 px. Dealer dan Sales Tool memakai label "mockup · fake data" / "screenshot · demo data".

### Status dot

18:930 {Rest, Pulse}. Dipakai di "Now: redesigning this site". Pulse mati di reduced motion.

### Kontribusi (ShippingInPublic)

26:1771 Color {Mono, Hijau}. Desain memakai **Mono**. "@fbrnngrh ↗", "603 contributions in the last 9 months", legenda Less / More. Sel kalender `aria-hidden`; ringkasan teks yang dibaca pembaca layar.

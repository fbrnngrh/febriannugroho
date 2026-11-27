# 03 · UX per halaman

Skill: better-layout (struktur, urutan, sticky), better-accessibility (nama, fokus, keyboard, kontras), better-writing (state kosong dan error), build-design.

## 1. Kerangka situs

```
<a class="skip-link" href="#main">Skip to content</a>   ← elemen fokus pertama
<header> SiteNav (desktop) | ExploreButton (ponsel, fixed) </header>
<main id="main"> … halaman … </main>                   ← satu <main> per halaman
<FloatingProfile/>                                        ← fixed kiri bawah, semua halaman
<dialog id="explore-menu"> … </dialog>                    ← ponsel
```

| Elemen | Perilaku |
|---|---|
| Nav desktop | Di dalam hero, kanan atas. **Ikut tergulir** bersama hero, tidak sticky. Di halaman selain Home: di bagian atas halaman, juga tidak sticky. |
| Tombol Explore (ponsel) | **Fixed** kanan atas di semua halaman. |
| Profil mengambang | **Fixed** kiri bawah di semua halaman (desktop 24 px, ponsel 16 px dari tepi, plus safe area). |
| TOC artikel | **Sticky** di kiri, desktop saja. |
| Anchor | `html { scroll-padding-top: 72px; }` agar target tidak tertutup tombol Explore. |

Pastikan profil mengambang tidak menutupi konten terakhir: padding bawah halaman ponsel 114 px sudah memperhitungkannya.

## 2. Halaman

### Home (`/`)

Urutan desktop dan ponsel sama:

1. **Hero** layar penuh. Nama, "Software engineer · Banjarmasin, Indonesia", "Now: redesigning this site" (dengan status dot), kalimat hero, petunjuk "Scroll" di bawah tengah. Aura hanya di bawah hero; pojok kiri atas kosong.
   - Frasa bergaris bawah di kalimat hero adalah tautan: "ship business systems" membuka detail Dealer; "a small fleet of coding agents" ke Stack.
2. **Panggung video** (01b): 3 slide × 4 shot, berganti sendiri, caption di bawah ("Fleet workflow" … "01 / 03"), tautan "Full fleet map" ke Stack (slide 1 dan 3), tombol jeda.
3. **Selected work** (02): label mono, carousel 4 WorkCard.
4. **About** (03): tiga paragraf, LinkPreview pada "CI/CD pipelines", daftar Experience.
5. **Writing** (04): intro, kipas 3 PostCard, "1 / 3", tautan "All writing".
6. **Shipping in public** (04b): kalender kontribusi.
7. **Tools I use** (05): daftar logo, tautan "Full stack".
8. **Contact** (06): kalimat, email + "Copy email", tautan sosial, "Banjarmasin, Indonesia · 09:41 WITA" (jam lokal WITA, diperbarui di klien).
9. **Footer** (07).

Jam WITA: hitung di klien dengan `Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit' })`. Saat SSR/prerender tampilkan tanpa jam agar tidak salah.

### Stack (`/stack`)

1. Header: "← Home", "Stack", kalimat pengantar.
2. "How the fleet works" + kalimat.
3. **Peta fleet**: Task → T3 Code → JARVIS → 4 agen → fleet check → Ship, dengan You · phone sebagai gerbang manusia. Alur animasi jalan sendiri saat terlihat.
4. Caption: "Click an agent for its role, skills and a run." dan "Roles after T3 Code and Matt Pocock's software factory."
5. "Also in the kit": 5 baris alat.

Klik agen: desktop membuka popover di samping node; ponsel membuka sheet. Klik agen juga menghentikan alur animasi.

### Writing (`/blog` atau `/writing`)

"← Home", judul, intro, filter All / Shipping / Agents / Design, daftar dikelompokkan per tahun (2026, 2025). Filter memfilter di klien; simpan pilihan di URL (`?tag=agents`) agar bisa dibagikan dan tombol back bekerja.

### Artikel (`/blog/[slug]`)

"← Writing", meta "Oct 14, 2025 · 6 min read", tag, H1, lead, sampul, body dengan H2 dan blok kode (tombol Copy), kalimat penutup, "Next post →", "All writing". TOC "On this page" sticky di kiri pada desktop, dibangun dari H2. Tandai H2 yang sedang dibaca dengan `aria-current="location"` (IntersectionObserver).

### Detail proyek (ProjectDialog)

Dibuka dari WorkCard dan dari tautan di kalimat hero. Desktop: modal tengah. Ponsel: sheet dari bawah. Usulan: beri setiap detail URL hash (`/#work/ci-cd`) agar bisa dibagikan dan tombol back menutupnya; build boleh memilih rute penuh jika lebih sederhana.

### Halaman 404 (`+error.svelte`)

Tidak didesain. Pakai kolom teks, judul "Page not found", kalimat "The page you're looking for isn't here.", tautan "← Home". Ikut token baru.

### `/contact`

Tidak ada di desain. Isinya sudah ada di bagian Contact Home dan kartu profil. Keputusan Febrian: hapus atau redirect ke `/#contact`.

## 3. Navigasi

### Desktop

- Work → scroll halus ke Selected work di Home (600 ms, lihat 04-motion.md). Dari halaman lain: ke `/#work`.
- Writing → halaman Writing. Stack → `/stack`. Email → `mailto:fbrnngrh@gmail.com`.
- Tautan halaman aktif: `aria-current="page"`.

### Ponsel: menu Explore

1. Tombol Explore (fixed) → menu layar penuh terbuka (250 ms). Tombol menjadi Close.
2. Fokus pindah ke tautan pertama (Work). Latar belakang `inert`. Scroll halaman dikunci.
3. Tutup lewat: tombol Close, Esc, tombol back browser (push state kecil saat membuka), atau memilih tautan.
4. Setelah tutup: fokus kembali ke tombol Explore (kecuali pindah halaman; saat itu fokus ke `<h1>` halaman baru).

Implementasi yang disarankan: `<dialog>` dengan `showModal()` (memberi `inert` dan trap fokus gratis).

### Dialog dan sheet

- Modal detail proyek (desktop) dan semua sheet (ponsel): `<dialog>` + `showModal()`.
- Saat buka: fokus ke judul dialog (`tabindex="-1"` pada judul). Saat tutup: fokus kembali ke pemicu.
- Tutup lewat tombol Tutup, Esc, klik latar, atau back. Sheet juga bisa diseret ke bawah, tetapi selalu ada tombol Tutup (WCAG 2.5.7).
- Popover kartu agen (desktop): `popover` atribut atau komponen non-modal; Esc menutup dan fokus kembali ke node.

### Transisi antar halaman

Cross-fade 250 ms (04-motion.md §4). Setelah navigasi, pindahkan fokus ke `<h1>` halaman baru dan umumkan judulnya.

## 4. Alur prototipe di Figma

| Alur | Mulai | Yang ditunjukkan |
|---|---|---|
| Situs lengkap · desktop terang | 65:1506 | Home → panggung → kartu kerja → modal detail → Stack → kartu agen → Writing → Artikel → kembali |
| Situs lengkap · desktop gelap | 67:3804 | sama, tema gelap |
| Situs lengkap · ponsel terang | 65:2052 | sama, dengan menu Explore dan sheet |
| Situs lengkap · ponsel gelap | 67:3902 | sama, tema gelap |
| Profil · pesawat kertas (×4) | frame Profil | buka profil, Email me terbang, "Mail app opened", kembali |
| Animasi scroll (×5) | 127:11718 dst. | tahapan reveal: Sebelum / Tahap / Sesudah |

Yang tidak bisa ditunjukkan prototipe ada di 06-build-notes.md §1.

## 5. State kosong, loading, error

Desainnya statis (adapter-static), jadi sebagian besar state ini jarang terjadi. Teks di bawah adalah usulan better-writing; belum ada frame di Figma.

| Tempat | Kasus | Perilaku |
|---|---|---|
| Filter Writing | Tidak ada tulisan untuk tag | "No posts in Design yet." + tombol "Show all posts" |
| Daftar Writing | Belum ada tulisan sama sekali | Sembunyikan kipas di Home dan bagian Writing; halaman Writing: "No posts yet." |
| Kalender kontribusi | Data snapshot gagal diambil saat build | Sembunyikan kalender, tetap tampilkan "@fbrnngrh ↗". Jangan tampilkan angka 0. |
| Gambar (sampul, foto) | Memuat | Latar `--surface-placeholder` dengan `aspect-ratio` tetap; tidak ada lompatan layout |
| Gambar | Gagal | Tetap latar placeholder, `alt` tetap ada |
| Copy email / kode | Clipboard ditolak | "Couldn't copy. Select the address to copy it." lalu pilih teks alamat |
| Email me | Tidak ada aplikasi email | `mailto:` tidak bisa dideteksi; alamat email selalu terlihat dan bisa disalin di sebelahnya |
| Panggung video | JavaScript belum jalan | Tampilkan shot terakhir slide 1 secara statis |
| Halaman tidak ada | 404 | Lihat §2 |
| Font | Belum termuat | `font-display: swap` dengan fallback `system-ui` |

## 6. Aksesibilitas

Dari kartu Aksesibilitas (70:4189) dan catatan Hi-fi.

**Struktur**
- Skip link pertama, satu `<main>`, satu `<h1>` per halaman, heading berurutan.
- Bahasa: `<html lang="en">`.

**Nama aksesibel**
- Node agen: "Open JARVIS card"; tutup: "Close JARVIS card".
- Tombol jeda: "Pause showcase" / "Play showcase" + `aria-pressed`.
- Panah carousel: "Previous project" / "Next project"; panah kipas: "Previous post" / "Next post".
- Profil: "Open profile" / "Close profile".
- Tombol Explore: "Explore" dengan `aria-expanded`.
- Foto: `alt="Febrian Bayu Nugroho"`. Logo alat: `alt=""` karena nama alat tertulis di sebelahnya.
- Ikon sosial singkat (GH, in, Th, IG): beri `aria-label` lengkap ("GitHub", "LinkedIn", "Threads", "Instagram").

**Urutan fokus** (Home desktop): skip link → nav (Work, Writing, Stack, Email) → tautan di kalimat hero → tombol jeda panggung → "Full fleet map" → panah carousel → kartu kerja → tautan About → kipas (kartu depan, panah, titik) → "All writing" → "@fbrnngrh" → "Full stack" → email, Copy, sosial → profil mengambang.

Urutan DOM sama dengan urutan visual; jangan pakai `order` atau `row-reverse` untuk memindah konten.

**Keyboard**
- Semua yang bisa diklik bisa dicapai Tab dan diaktifkan Enter/Space.
- Carousel dan kipas: tombol panah; kipas juga ←/→ saat fokus di dalamnya.
- Esc menutup menu, dialog, sheet, popover, LinkPreview.

**Target**
- Tombol tutup 44 px. Tautan sosial tinggi 21 px dengan jarak 24 px; di ponsel area sentuh 44 px lewat pseudo-element.
- Titik kipas 24 px.

**Gerak** (WCAG 2.2.2): panggung yang berganti sendiri punya tombol jeda dan berhenti saat hover/fokus. Reduced motion: panggung mulai dalam keadaan jeda.

**Warna** bukan satu-satunya penanda: status gagal/lulus di panggung juga ditulis sebagai teks ("Failed", "Passed").

**Fokus** terlihat di semua tema: cincin 2 px `--focus-ring`, offset 2 px, kontras 16:1.

**Masih perlu dites di build**: zoom 200%, lebar 320 px, pembaca layar sungguhan (VoiceOver iOS dan NVDA), mode forced-colors.

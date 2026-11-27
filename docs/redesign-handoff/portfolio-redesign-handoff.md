# Redesign portfolio · handoff utama

Tanggal: 27 Nov 2026. Figma: file `M4H1HkuEiWyZTToDQ6Iml2`, halaman **Hi-fi**. Repo: `fbrnngrh/febriannugroho` (apps/web).

Format link Figma: `https://www.figma.com/design/M4H1HkuEiWyZTToDQ6Iml2/?node-id=<id>`, dengan `:` pada ID diganti `-` (contoh 65:1506 → `node-id=65-1506`).

## 1. Ringkasan desain

- **Arah visual:** Opsi A monochrome. Inter untuk teks, Geist Mono untuk label dan kode. Satu warna aksen per proyek (fleet ungu, CI hijau, dealer biru, sales oranye).
- **Home:** hero layar penuh (aura hanya di bawah hero), lalu satu **panggung video** bergaya studio dengan 3 slide yang berganti sendiri: alur fleet (ungu), CI/CD (merah lalu teal), orkestrasi agen (clay). Warna latar halaman ikut warna slide.
- **Selected work:** carousel 4 kartu (Dealer, CI/CD, Fleet, Sales Tool); kartu membuka modal di desktop dan sheet di ponsel.
- **Writing di Home:** kipas 3 kartu yang bisa digeser.
- **Stack:** peta orkestrasi fleet dengan agen yang bisa diklik (popover di desktop, sheet di ponsel).
- **Writing dan Artikel:** daftar per tahun dengan filter, halaman artikel dengan TOC sticky.
- **Profil mengambang** di kiri bawah dengan tombol "Email me" berbentuk pesawat kertas.
- **Ponsel:** tombol Explore fixed di kanan atas membuka menu layar penuh.

## 2. Layar final (link node)

| Layar | Desktop terang | Ponsel terang | Desktop gelap | Ponsel gelap |
|---|---|---|---|---|
| Home | 65:1506 | 65:2052 | 67:3804 | 67:3902 |
| Stack | 67:1506 | 67:1718 | 67:4267 | 67:4477 |
| Kartu agen (popover / sheet) | 67:1914 | 67:2123 | 67:4673 | 67:4882 |
| Writing | 67:2322 | 67:2392 | 67:5081 | 67:5132 |
| Artikel | 67:2438 | 67:2527 | 67:5176 | 67:5227 |
| Detail CI/CD (modal / sheet) | 67:2607 | 67:3226 | 67:5271 | 67:5406 |
| Detail Dealer | 213:10640 | 213:11066 | 213:10853 | 213:11548 |
| Detail Sales Tool | 213:12031 | 213:12405 | 213:12218 | 213:12861 |
| Profil mengambang terbuka | 82:4949 | 122:8088 | 122:7986 | 122:8655 |
| Menu Explore (ponsel) | – | 277:14039 | – | 277:14082 |

Frame alur scroll (Sebelum/Tahap/Sesudah): 127:11718, 127:11900, 127:11998, 127:12252, 127:14079.

### Frame spesifikasi (halaman Hi-fi)

| Frame | ID | Catatan |
|---|---|---|
| Motion mikro 27 Nov | 291:14262 | **Paling baru, menang jika bentrok.** Hover, tekan, halaman, modal, sheet, menu. |
| Motion scroll spec | 128:10439 | Scroll reveal per elemen. |
| Panggung v2 catatan | 207:1660 | Panggung video. |
| Catatan prototipe | 216:17059 | Kipas Writing, batas prototipe, placeholder. |
| Motion alur fleet | 105:6878 | Timeline peta fleet. |
| Pesawat kertas | 123:8905 | Tombol Email me. |
| Hero stagger | 88:5425 | Urutan masuk hero. |
| Motion (better-motion+gestures) | 73:4328 | Lebih lama; sebagian nilai sudah diganti 291:14262. |

### Halaman Komponen

| Bagian | ID |
|---|---|
| Token warna | 68:2847 |
| Aksesibilitas | 70:4189 |
| Catatan hi-fi | 68:3140 |

Daftar component set lengkap ada di 02-components.md.

### Alur prototipe (Present)

Empat alur "Situs lengkap": desktop terang (65:1506), desktop gelap (67:3804), ponsel terang (65:2052), ponsel gelap (67:3902). Ditambah 4 alur "Profil · pesawat kertas" dan 5 alur "Animasi scroll". Set Device ke None dan Fit width saat Present. Rincian di 03-ux-pages.md.

## 3. Urutan kerja yang disarankan untuk build

1. **Update dependency** dulu (06-build-notes.md §2), pastikan `bun run check-types` dan `bun run build` lulus sebelum desain disentuh.
2. **Token dan font** (01-tokens.md): ganti token di `app.css`, pasang Inter + Geist Mono, ganti `motion.ts` ke nilai baru.
3. **Layout dasar**: `+layout.svelte` baru (skip link, satu `<main>`, nav desktop, tombol Explore, profil mengambang), lebar kolom 540/760/1040.
4. **Komponen kecil** dengan state lengkap (02-components.md): tautan nav, tautan kembali, tombol, kartu kerja, kartu tulisan, chip.
5. **Halaman**: Home → Writing → Artikel → Stack. Lalu dialog detail proyek dan kartu agen.
6. **Motion** (04-motion.md): hover/tekan, reveal, transisi halaman, dialog/sheet, menu Explore, lalu yang besar: panggung video, kipas Writing, peta fleet, pesawat kertas.
7. **Review dengan skill**: better-interface (ringkasan), better-accessibility, break-ui untuk data terburuk (judul panjang, nama agen panjang), review-animations. Terapkan temuannya.
8. **QA**: checklist di 06-build-notes.md §5.

## 4. Keputusan yang perlu jawaban Febrian

1. **Tombol tema:** Figma tidak punya toggle tema; situs mengikuti tema sistem. Repo sekarang punya ThemeToggle. Pilihan: ikut sistem saja, atau pertahankan toggle (letak belum didesain).
2. **Rute Writing:** tetap `/blog`, atau pindah ke `/writing` dengan redirect dari `/blog`.
3. **Halaman `/contact`:** isinya pindah ke bagian Contact di Home dan kartu profil. Hapus rute atau redirect ke `/#contact`.
4. **Bahasa adegan panggung:** teks di dalam adegan panggung video masih bahasa Indonesia, sedangkan situs berbahasa Inggris. Usulan terjemahan ada di 05-content-assets.md.
5. **Tiga post lama 2025** (React 19, Next.js 16, Tailwind OKLCH) tidak ada di desain. Dibuang, disimpan sebagai draft, atau tetap tampil.
6. **Paket baru** yang dibutuhkan (font, mungkin `motion`): perlu ya sebelum dipasang. Lihat 06-build-notes.md §3.

## 5. Placeholder yang masih terbuka

Judul dan tanggal tulisan, visual Dealer, teks detail Dealer dan Sales Tool, logo T3 Code (masih monogram), tagline klien di gambar Sales Tool (mungkin perlu diburamkan), angka kontribusi GitHub (snapshot, bukan data langsung). Rinciannya di 05-content-assets.md §4.

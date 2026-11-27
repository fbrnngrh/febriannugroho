# 06 · Catatan build

Ikuti juga `AGENTS.md` di repo (skill Svelte, runes mode, `svelte-autofixer`, verifikasi `bun run -F web check`, `docs/feature_list.json`).

## 1. Yang tidak bisa ditunjukkan Figma

Semua ini dirancang dan nilainya ada di 04-motion.md, tetapi prototipe Figma tidak bisa memperlihatkannya:

- Panggung berhenti saat hover, fokus, keluar layar atau tab tersembunyi, lalu lanjut dari shot yang sama.
- Warna latar halaman yang berganti mengikuti slide panggung (di Figma dibuat per frame).
- Scroll reveal yang dipicu posisi scroll (di Figma digambar sebagai frame Sebelum / Tahap / Sesudah, 127:11718 dst.).
- Alur fleet yang berulang tiap 6 s dan berhenti saat agen diklik.
- Seret kipas Writing dua arah dan pegas setelah dilepas.
- Seret sheet ke bawah dengan ambang jarak dan kecepatan.
- TOC artikel yang sticky dan menandai bagian aktif.
- Filter Writing dan panah carousel yang benar-benar menggulir.
- Toggle tema (tidak didesain; menunggu keputusan).
- Jam WITA langsung, kalender kontribusi dari data build.
- Pesawat kertas yang membuka aplikasi email sungguhan.
- Lebar antara 390 dan 1440 (tablet): breakpoint di 01-tokens.md §4 adalah usulan.

## 2. Tugas: update semua dependency

Febrian minta semua dependency di-update. Kerjakan **sebelum** redesign, sebagai commit terpisah, agar error dari update tidak tercampur dengan perubahan desain. Versi terbaru tidak bisa dicek dari sesi desain (registry npm diblokir di sini), jadi build harus mengeceknya sendiri.

Versi sekarang (dari `package.json`, 27 Nov 2026):

**Root (`package.json`)**

| Paket | Versi | Catatan |
|---|---|---|
| turbo | ^2.9.16 | |
| husky | ^9.1.7 | |
| lint-staged | ^17.0.7 | Konfigurasi `lint-staged` berisi perintah kosong `""`; isi dengan perintah format/lint yang benar atau hapus |
| typescript | catalog `^6` | |
| @types/node | catalog `^22.13.14` | Sesuaikan dengan versi Node/Bun yang dipakai |
| bun (`packageManager`) | 1.3.14 | Juga dipin di `Dockerfile` (`oven/bun:1.3.14-alpine`) |

**apps/web**

| Paket | Versi | Catatan |
|---|---|---|
| @sveltejs/kit | ^2.58.0 | |
| svelte | ^5.55.5 | |
| @sveltejs/vite-plugin-svelte | ^7.0.0 | Ikut versi Vite |
| vite | ^8.0.10 | |
| @sveltejs/adapter-static | ^3.0.10 | |
| svelte-check | ^4.4.6 | |
| tailwindcss | ^4.2.4 | |
| @tailwindcss/vite | ^4.2.4 | Samakan dengan tailwindcss |
| mdsvex | ^0.12.3 | Cek kompatibilitas dengan Svelte 5 terbaru |
| lucide-svelte | ^1.0.1 | Cek apakah paket ini masih yang direkomendasikan untuk Svelte 5 atau sudah ada penggantinya |
| @selemondev/svgl-svelte | ^2.15.0 | Mungkin bisa dihapus setelah logo pindah ke SVG lokal (05-content-assets.md §2) |

**Lain**

| Hal | Versi | Catatan |
|---|---|---|
| Image runtime `Dockerfile` | nginx:1.27-alpine | Update ke versi stabil terbaru |

Langkah:

1. `bun outdated` di root dan `apps/web`, catat versi saat ini → terbaru.
2. `bun update --latest` (atau per paket untuk major), lalu `bun install` agar `bun.lock` ikut.
3. Baca catatan rilis setiap **major** yang naik dan terapkan perubahan wajibnya.
4. Verifikasi: `bun run -F web check`, `bun run build`, `docker build .` jika Docker dipakai untuk deploy.
5. Script root `check-types` menjalankan `turbo run check-types`, tetapi `apps/web` tidak punya script `check-types` (adanya `check`). Tambahkan `"check-types": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"` di `apps/web` atau ubah pipeline, supaya pengecekan tipe benar-benar jalan.

## 3. Paket baru yang mungkin dibutuhkan (perlu ya Febrian)

| Kebutuhan | Pilihan | Alternatif tanpa paket |
|---|---|---|
| Font Inter + Geist Mono | `@fontsource-variable/inter`, `@fontsource-variable/geist-mono` atau `geist` | Unduh file woff2 dan taruh di `static/fonts/` dengan `@font-face` |
| Pegas yang membawa kecepatan (kipas, sheet) | `motion` (fungsi `animate`) | CSS `linear()` di 04-motion.md §7 dan transisi `--ease-drawer` |
| Sheet ponsel | pustaka sheet untuk Svelte | Tulis sendiri di atas `<dialog>` (04-motion.md §5) |

## 4. Rute dan struktur

| Sekarang | Usulan | Keputusan |
|---|---|---|
| `/` | Home baru | – |
| `/stack` | Stack baru dengan peta fleet | – |
| `/blog`, `/blog/[slug]` | Writing dan Artikel | Tetap `/blog` atau `/writing` + redirect |
| `/contact` | Masuk ke Contact Home + kartu profil | Hapus atau redirect ke `/#contact` |
| `+error` | 404 dengan token baru | – |
| `+layout.svelte` | Skip link, nav, Explore, profil mengambang, view transition; `max-w-xl`/`2xl` diganti kolom 540/760/1040 | – |
| `src/content/blog` | Tiga post 2025 lama tidak ada di desain; artikel CI/CD baru | Buang / draft / tetap |

Detail proyek: usulan URL hash (`/#work/ci-cd`) agar bisa dibagikan. Build boleh memilih rute penuh (`/work/ci-cd`) jika lebih sederhana; perilaku modal/sheet tetap sama.

## 5. Aturan konten publik

- Jangan menyebut org atau repo GitHub kantor, detail internal sistem kantor, spesifikasi server atau data klien.
- Detail kontrak, gaji dan pencarian kerja tidak ditampilkan.
- Dealer dan Sales Tool hanya data palsu, berlabel "mockup · fake data" / "screenshot · demo data".
- Buramkan tagline atau nama klien di gambar Sales Tool bila terlihat.
- Karakter agen adalah avatar orisinal; jangan memakai tampilan karakter film.

## 6. Checklist QA

**Visual**
- [ ] Setiap layar dibandingkan dengan frame Figma di 4 kolom (desktop/ponsel × terang/gelap).
- [ ] Lebar 320, 390, 768, 1100, 1440 dan 1920: tidak ada yang terpotong, tumpang tindih atau scroll horizontal.
- [ ] Zoom 200%: teks tidak terpotong, kontrol penting tetap terjangkau.
- [ ] Data terburuk (skill break-ui): judul tulisan sangat panjang, nama agen panjang, 0 tulisan, 1 tulisan, kontribusi gagal dimuat.

**Interaksi**
- [ ] Hover hanya di pointer halus; tidak ada hover yang "nyangkut" di layar sentuh.
- [ ] Semua state tekan terasa dalam 100 ms.
- [ ] Menu Explore, dialog, sheet, popover: buka, tutup lewat Esc/back/tombol/latar, fokus kembali ke pemicu.
- [ ] Seret sheet dan kipas di ponsel sungguhan (bukan simulasi).
- [ ] Panggung berhenti saat hover, fokus, keluar layar, tab tersembunyi; lanjut dari shot yang sama.

**Aksesibilitas**
- [ ] Skip link, satu `<main>`, heading berurutan, `lang="en"`.
- [ ] Urutan fokus sama dengan urutan visual; cincin fokus terlihat di kedua tema.
- [ ] Pembaca layar (VoiceOver iOS, NVDA): nama tombol, pengumuman "Copied" dan "Mail app opened".
- [ ] Kontras diukur ulang di browser untuk kedua tema.
- [ ] Forced-colors: kartu dan tombol tetap punya tepi.
- [ ] `prefers-reduced-motion: reduce`: semua baris tabel 04-motion.md §12.

**Kinerja**
- [ ] Hanya `transform`, `opacity`, `filter` yang dianimasikan; tidak ada `transition: all`.
- [ ] Lapisan glow tidak menyebabkan paint seluruh halaman tiap frame (cek Performance panel).
- [ ] Font dimuat dengan `preload` dan `font-display: swap`; tidak ada pergeseran layout besar.
- [ ] Lighthouse: Performance, Accessibility, Best Practices dan SEO dicatat sebelum dan sesudah.

**Review dengan skill**
- [ ] better-interface (ringkasan semua dimensi), better-accessibility, better-typography, better-colors, review animasi (animate/choreograph/gestures). Terapkan temuannya, jangan hanya dicatat.

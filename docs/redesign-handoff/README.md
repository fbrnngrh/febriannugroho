# Handoff redesign portfolio · indeks

Desain final ada di Figma, file **M4H1HkuEiWyZTToDQ6Iml2**, halaman **Hi-fi**. Kodenya dikerjakan di repo yang sudah ada, `fbrnngrh/febriannugroho` (apps/web: SvelteKit 5 + Tailwind v4 + mdsvex, Bun + Turborepo).

Paket ini menjelaskan **UI, UX dan micro animation**. Semua nilainya sudah siap dipakai di CSS/Svelte. Dokumen ini ditulis memakai skill desain yang terpasang: Jakub better-interface, better-typography, better-colors, better-layout, better-accessibility, better-motion, better-ui, better-writing; Emil animate, choreograph, gestures; dan build-design untuk cara memetakannya ke kode.

## Urutan baca

| File | Isi |
|---|---|
| [portfolio-redesign-handoff.md](portfolio-redesign-handoff.md) | **Mulai di sini.** Ringkasan, link Figma tiap layar, urutan kerja build, keputusan yang perlu jawaban Febrian. |
| [01-tokens.md](01-tokens.md) | Warna terang/gelap (termasuk warna aura tiap slide), tipografi Inter + Geist Mono, spacing, radius, shadow, breakpoint, kolom 540/760/1040. Ditulis sebagai CSS siap tempel. |
| [02-components.md](02-components.md) | Daftar komponen dengan state default, hover, tekan, fokus, disabled, dan pemetaan ke komponen repo. |
| [03-ux-pages.md](03-ux-pages.md) | Struktur tiap halaman, navigasi (nav desktop, menu Explore ponsel), elemen sticky/fixed, 4 alur prototipe, state kosong/loading/error, aksesibilitas. |
| [04-motion.md](04-motion.md) | Semua durasi, easing, delay, stagger: hover, tekan, transisi halaman, modal, sheet, menu Explore, panggung video, kipas Writing, scroll reveal, alur fleet, pesawat kertas, reduced motion. Dengan potongan CSS/Svelte. |
| [05-content-assets.md](05-content-assets.md) | Teks final tiap layar, logo SVG, foto, dan daftar placeholder. |
| [06-build-notes.md](06-build-notes.md) | Hal yang tidak bisa ditunjukkan Figma, tugas update semua dependency (dengan versi sekarang), rute, aturan konten publik, checklist QA. |
| [assets/logos.md](assets/logos.md) | SVG asli semua logo alat (salinan dari design-review). |

## Aturan yang berlaku untuk build

- Kerjakan di repo yang sama. Desain di Figma adalah sumber kebenaran; jika ada nilai yang berbeda antar frame, pakai yang tercatat di dokumen ini (konflik dicatat di 04-motion.md).
- Pakai skill yang ada saat membangun: **build-design** untuk Figma → kode, **better-*** untuk review, **animate / choreograph / gestures** untuk motion. Temuan review langsung diterapkan, bukan hanya didaftar.
- Situs publik: jangan menyebut org atau repo GitHub kantor, detail internal sistem kantor, spesifikasi server atau data klien. Dealer dan Sales Tool hanya memakai data palsu berlabel "mockup · fake data".
- Instal paket baru, push dan perubahan yang tidak bisa dibatalkan tetap menunggu ya dari Febrian.

## Bagian Figma yang relevan

| Halaman | Isi |
|---|---|
| Hi-fi (64:1506) | Semua layar final, 4 kolom: desktop terang, ponsel terang, desktop gelap, ponsel gelap. Juga frame spesifikasi motion dan catatan. |
| Komponen (34:1676) | Component set dengan variant state, logo, token warna, kartu aksesibilitas. |
| Eksplorasi (arsip) (0:1) | Versi lama. Jangan dipakai untuk build. |

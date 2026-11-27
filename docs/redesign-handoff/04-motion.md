# 04 · Motion dan micro interaction

Sumber, dari yang paling baru: **Motion mikro 27 Nov** (291:14262), Panggung v2 catatan (207:1660), Catatan prototipe (216:17059), Motion scroll spec (128:10439), Motion alur fleet (105:6878), Pesawat kertas (123:8905), Hero stagger (88:5425), Motion better-motion+gestures (73:4328, sebagian sudah diganti).

Skill: animate (gerbang "perlu animasi atau tidak", alat, properti, kurva, durasi), choreograph (urutan dan stagger), gestures (sheet dan kipas yang diseret), better-motion (nilai pasti), animation-performance (hanya `transform`, `opacity`, `filter`).

## 0. Aturan umum

- Hanya animasikan `transform` / `translate` / `scale` / `rotate`, `opacity`, `filter`, `clip-path`. Jangan `width`, `height`, `top`, `left`, `margin`. `transition-property` tidak pernah `all`.
- Tidak pernah `ease-in` untuk UI. Tidak pernah `scale(0)`; masuk dari `0.96–0.98`.
- Hover hanya di `@media (hover: hover) and (pointer: fine)`. Hover tidak menggeser posisi.
- Pakai **transition** (bukan keyframes) untuk apa pun yang bisa dipicu berulang cepat.
- Aksi dari keyboard dan yang dipakai ratusan kali sehari tidak dianimasikan (contoh: memindah fokus).
- Reduced motion = lebih sedikit dan lebih lembut, bukan nol: sisakan fade opacity 150–200 ms.

### Token motion

Ganti isi `src/lib/motion.ts` dan variabel `--motion-*` di `app.css`:

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);          /* dasar untuk masuk/keluar dan state */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);      /* scroll halus ke anchor */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);       /* sheet ponsel */
  --ease-stage: cubic-bezier(0.645, 0.045, 0.355, 1);  /* crossfade warna panggung */
  --ease-flow: cubic-bezier(0.2, 0, 0, 1);             /* alur fleet, pesawat kertas */

  --dur-press: 100ms;
  --dur-release: 150ms;
  --dur-hover: 150ms;
  --dur-card: 200ms;
  --dur-page: 250ms;
  --dur-menu-in: 250ms;
  --dur-menu-out: 150ms;
  --dur-reveal: 300ms;
  --dur-dialog: 350ms;
  --dur-dialog-out: 150ms;
  --dur-sheet: 350ms;
  --dur-stage-bg: 700ms;
}
```

```ts
// src/lib/motion.ts
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
export const EASE_STAGE = [0.645, 0.045, 0.355, 1] as const;
export const EASE_FLOW = [0.2, 0, 0, 1] as const;
export const bezier = (e: readonly number[]) => `cubic-bezier(${e.join(", ")})`;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

### Nilai yang bentrok (dan yang dipakai)

| Hal | Lama (73:4328 / lainnya) | **Dipakai** (291:14262) |
|---|---|---|
| Popover kartu agen | 250 ms | **350 ms** ease-out, keluar 150 ms |
| Sheet ponsel | 500 ms | **350 ms** `--ease-drawer` |
| Pergantian halaman | tidak ada / 150 ms | **250 ms** cross-fade |
| Easing dasar repo | `cubic-bezier(0.22, 1, 0.36, 1)` | **`cubic-bezier(0.23, 1, 0.32, 1)`** |
| Garis bawah tautan | `width` 250 ms `ease` | **`scale` 150 ms ease-out** dari kiri |
| Antar shot panggung (prototipe Figma) | Smart animate 400 ms | **240 ms** opacity + geser 8 px di kode (Smart animate hanya cara Figma meniru) |

## 1. Hover

```css
.link { position: relative; color: var(--fg-muted); transition: color var(--dur-hover) var(--ease-out); }
.link::after {
  content: ""; position: absolute; inset-inline: 0; bottom: -2px; height: 1px;
  background: currentColor;
  scale: 0 1; transform-origin: left;
  transition: scale var(--dur-hover) var(--ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .link:hover { color: var(--fg-default); }
  .link:hover::after { scale: 1 1; }
}

.card { position: relative; border: 1px solid transparent; box-shadow: var(--shadow-ring-1);
  transition: box-shadow var(--dur-card) var(--ease-out); }
.card::before { content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: var(--fg-default); opacity: 0; pointer-events: none;
  transition: opacity var(--dur-card) var(--ease-out); }
@media (hover: hover) and (pointer: fine) {
  .card:hover { box-shadow: var(--shadow-ring-1), 0 8px 24px -8px #0000001a; }
  .card:hover::before { opacity: 0.04; }
}
```

> Diperbarui 27 Nov 2026 (review situs live §3): nilai lama terlalu halus sampai terasa tidak ada. Aturan baru: **kartu boleh naik 4 px; teks dan tombol tidak bergeser.** Gerak hanya di `(hover: hover) and (pointer: fine)` dan `prefers-reduced-motion: no-preference`.

| Elemen | Hover | Durasi |
|---|---|---|
| Tautan nav, kembali, teks | warna ke `--fg-default`, garis bawah tumbuh dari kiri | 150 ms |
| Kartu Selected work | sampul naik 4 px + shadow `0 18px 40px -14px` 22% (gelap 60%), isi sampul `scale 1.03` (300 ms), ikon expand geser 2 px ↗ | 200 ms |
| Kipas Writing | kartu depan naik 4 px + `--shadow-hover-card`, juga kartu "coming soon" (tanpa kursor pointer); kartu samping ±8° | pegas kipas |
| Baris Writing | lapisan fg 4% + shadow y8 blur24 spread −8 10% | 200 ms |
| Panggung video | bingkai naik 2 px, petunjuk "Click to pause" muncul; **video tidak dijeda** (§6) | 200 / 150 ms |
| Node agen | lapisan fg 4% | 150 ms |
| Email me | lihat §8 | 200 ms |
| Tombol jeda, panah | latar ke `--surface-muted` | 150 ms |

## 2. Tekan

```css
.press { transition: scale var(--dur-release) var(--ease-out); }
.press:active { scale: 0.96; transition-duration: var(--dur-press); }
.link:active { opacity: 0.64; transition: opacity var(--dur-press) var(--ease-out); }
.card:active::before { opacity: 0.08; transition-duration: var(--dur-press); }
.explore-button:active::before { opacity: 0.06; }   /* + scale 0.96 dari .press */
```

| Elemen | Tekan | Masuk / lepas |
|---|---|---|
| Tombol Explore, tombol bulat, node agen, Copy | `scale: 0.96` (+ lapisan fg 6% di Explore) | 100 / 150 ms |
| Tautan | `opacity: 0.64` | 100 ms |
| Kartu | lapisan fg 8% | 100 ms |

Tambahkan `-webkit-tap-highlight-color: transparent` pada elemen yang punya state tekan sendiri.

## 3. Masuk hero (load pertama)

Dari Hero stagger (88:5425) dan scroll spec. Hanya saat load pertama, bukan saat kembali ke Home lewat navigasi klien.

| Elemen | Mulai | Durasi | Gerak |
|---|---|---|---|
| Nama + baris peran | 0 ms | 300 ms | opacity 0→1, translateY 12→0, blur 4→0 |
| "Now: …" + kalimat hero | 100 ms | 300 ms | sama |
| Frasa tautan / sisa blok | 200 ms | 300 ms | sama |
| Petunjuk "Scroll" | 500 ms | 300 ms | opacity saja |
| Aura bawah hero | 0 ms | 500 ms | opacity saja |

Ganti `in:fly={{ y: 20, duration: 400 }}` di `+page.svelte` dengan pola reveal di §9.

## 4. Pergantian halaman

Cross-fade 250 ms ease-out dengan View Transitions API di SvelteKit:

```ts
// src/routes/+layout.svelte
import { onNavigate } from "$app/navigation";
onNavigate((navigation) => {
  if (!document.startViewTransition) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await navigation.complete;
    });
  });
});
```

```css
::view-transition-old(root),
::view-transition-new(root) { animation-duration: 250ms; animation-timing-function: var(--ease-out); }
/* profil mengambang dan tombol Explore tidak ikut berkedip */
.floating-profile { view-transition-name: floating-profile; }
.explore-button { view-transition-name: explore-button; }
::view-transition-group(floating-profile), ::view-transition-group(explore-button) { animation: none; }
```

Scroll halus ke anchor (Work): 600 ms `--ease-in-out`. CSS `scroll-behavior: smooth` tidak bisa diatur durasinya; pakai fungsi kecil dengan `requestAnimationFrame`, atau terima kecepatan bawaan browser. Reduced motion: lompat langsung.

## 5. Modal, popover, sheet, menu Explore

### Modal detail proyek (desktop) dan popover kartu agen

```css
dialog.modal {
  opacity: 0; scale: 0.98;
  transition: opacity var(--dur-dialog-out) var(--ease-out), scale var(--dur-dialog-out) var(--ease-out),
              overlay var(--dur-dialog-out) allow-discrete, display var(--dur-dialog-out) allow-discrete;
}
dialog.modal[open] {
  opacity: 1; scale: 1;
  transition-duration: var(--dur-dialog);
}
@starting-style { dialog.modal[open] { opacity: 0; scale: 0.98; } }
dialog.modal::backdrop { background: #0000; transition: background var(--dur-dialog) var(--ease-out),
  overlay var(--dur-dialog) allow-discrete, display var(--dur-dialog) allow-discrete; }
dialog.modal[open]::backdrop { background: #0006; }
@starting-style { dialog.modal[open]::backdrop { background: #0000; } }
```

- Masuk 350 ms, keluar 150 ms, ease-out.
- Modal: `transform-origin` tengah (tidak terikat pemicu).
- Popover agen: `transform-origin` di sisi node, offset 8 px dari node.

### Sheet ponsel (detail proyek, kartu agen)

- Masuk: `translateY(100%) → 0`, 350 ms `--ease-drawer`. Keluar: kebalikannya, ke bawah.
- Opacity overlay mengikuti posisi sheet (satu sumber nilai): `overlay = 1 - y / height`.
- **Seret** (gestures): selama jari menempel, sheet mengikuti 1:1, tanpa easing. Lewat batas atas: rubber-band 0.2. Saat dilepas: tutup jika `y > 40% tinggi` **atau** kecepatan `> 500 px/s`; kalau tidak, kembali ke 0 dengan `--ease-drawer` 350 ms, tanpa pantulan.
- Tulis `transform` langsung di elemen sheet, bukan lewat variabel CSS di parent. Jangan update state Svelte di setiap `pointermove`.
- Tautan dan tombol di dalam sheet tidak memulai seret (`data-no-drag`, cek di `pointerdown`).
- `touch-action: none` pada pegangan sheet; `overscroll-behavior: contain` pada isi yang bisa di-scroll.
- Esc, back, tombol Tutup dan klik overlay menutup.
- Pilihan implementasi: tulis sendiri di atas `<dialog>`, atau pakai pustaka sheet untuk Svelte (perlu ya untuk instal). Vaul asli hanya untuk React.

### Menu Explore

- Buka 250 ms, tutup 150 ms, ease-out. Opacity 0→1 dan translateY 8→0 untuk panel.
- Semua tautan muncul **bersamaan**, tanpa stagger (dipakai sering; choreograph: satu entrance per kontainer).
- Tombol Explore → Close: crossfade label 150 ms.

## 6. Panggung video (Home)

> **Diganti 27 Nov 2026 oleh dokumen 07 "Panggung v3"** (paket handoff: satu kartu video, tiga babak warna; belum disimpan di repo). Bagian ini hanya ringkasan; angka lengkap, gerak per shot, dan QA ada di dokumen 07. Implementasi: `src/lib/components/stage/VideoStage.svelte` + `stage/scenes/*.svelte`.

| Hal | Nilai |
|---|---|
| Bentuk | satu kartu media, 12 shot dalam 3 babak diputar sebagai satu video berulang (22,8 s); **tanpa** counter, segmen, garis progres atau tombol |
| Lama tiap shot | 1.8 s; shot terakhir tiap babak 2.2 s |
| Isi antar shot | crossfade 240 ms, lama `opacity 1→0` + `-8px`, baru `opacity 0→1` + `8px→0`, `cubic-bezier(0.23, 1, 0.32, 1)` |
| Dalam shot | satu gerak utama, masuk 300 ms ease-out, stagger 0 / 60 / 100 / 130 ms, tanpa pantulan |
| Warna babak | `@property` `--scene-*`, `--stage-c`, `--stage-c2` di `:root` (`html[data-stage]`), transisi **600 ms** `--ease-stage`; aura hero, glow, bingkai, ilustrasi berubah bersama |
| Caption | berganti di crossfade yang sama dengan isi |
| Glow | satu set 6 lapisan blur; tepi `mask-image`, bukan `overflow: hidden` |
| Jeda | kartu = `<button aria-pressed>`; klik / Space menjeda, label "Paused" 150 ms; lanjut dari sisa waktu shot |
| Hover | tidak menjeda |
| Berhenti sendiri | terlihat < 10%, tab tersembunyi, fokus keyboard di kartu |
| Scroll | `animation-timeline: view()` scale 0.8→1, range `entry 0% cover 45%`; fallback IO 0.92→1 + opacity 500 ms |
| Ponsel | kartu 1:1, ilustrasi `xMidYMid slice` (zona aman x 200–760 dari 960) |

Reduced motion: tidak autoplay, tidak ada scale saat scroll; kartu diam di shot terakhir babak aktif, klik pindah babak (crossfade 200 ms, warna 200 ms), `aria-label` "Show next scene".

## 7. Kipas Writing (Home)

Tiga kartu bertumpuk. Kartu depan bisa diseret ke samping (ponsel) atau diganti dengan panah / titik / ←→.

| Hal | Nilai |
|---|---|
| Ganti kartu (tombol, keyboard) | spring mass 1, stiffness 260, damping 32 (≈0.4–0.5 s, tanpa pantulan) |
| Setelah diseret dan dilepas | spring damping 24 (sedikit pantulan, ±3%) |
| Arah | geser kanan = kartu sebelumnya, geser kiri = kartu berikut (dua arah) |
| Seret | 1:1 mengikuti jari, `touch-action: pan-y` agar scroll vertikal tetap jalan |
| Lepas | ganti kartu jika geser > 30% lebar kartu atau kecepatan > 500 px/s |
| Masuk scroll | kartu depan 0 ms, dua kartu belakang +60 ms bersamaan |

Spring di atas sebagai CSS `linear()` (dihitung dari persamaan pegas, tanpa pustaka):

```css
:root {
  /* stiffness 260, damping 32, mass 1 · 500 ms */
  --spring-fan: linear(0, 0.063, 0.194, 0.342, 0.481, 0.601, 0.699, 0.776, 0.835, 0.88, 0.914, 0.938, 0.956, 0.969, 0.978, 0.985, 0.989, 0.993, 0.995, 0.996, 1);
  /* stiffness 260, damping 24, mass 1 · 550 ms (setelah swipe) */
  --spring-fan-release: linear(0, 0.079, 0.25, 0.444, 0.624, 0.77, 0.878, 0.951, 0.996, 1.019, 1.029, 1.03, 1.026, 1.02, 1.015, 1.009, 1.006, 1.003, 1.001, 1, 1);
}
.fan-card { transition: translate 500ms var(--spring-fan), rotate 500ms var(--spring-fan), scale 500ms var(--spring-fan); }
.fan-card.released { transition-duration: 550ms; transition-timing-function: var(--spring-fan-release); }
```

Jika ingin pegas yang membawa kecepatan lepas jari (lebih fisik), pakai `animate()` dari paket `motion` dengan `{ type: "spring", mass: 1, stiffness: 260, damping: 32, velocity }`; ini paket baru, perlu ya Febrian.

Reduced motion: ganti kartu dengan crossfade opacity 200 ms, tanpa geser dan rotasi. Seret tetap boleh (gerak dari pengguna sendiri), lepas tanpa pantulan.

## 8. Pesawat kertas · Email me

| Fase | Nilai |
|---|---|
| Hover | pesawat `translate(6px, -3px) rotate(-12deg)`, jejak opacity 0→0.55, latar tombol 100→88%, 200 ms ease-out |
| Tekan | `scale: 0.96`, 150 ms |
| Terbang | mulai 80 ms setelah tekan; ke `translate(70px, -34px) rotate(-32deg) scale(0.8)`, opacity 0; total 420 ms: 160 ms linear lalu 260 ms `--ease-flow` |
| Label keluar | "Email me" opacity 0 + naik 4 px, 150 ms, mulai +120 ms |
| Label masuk | "Mail app opened" dari +4 px, 200 ms ease-out |
| Centang | scale 0.25→1, blur 4→0, spring durasi 0.3 s tanpa pantulan (pakai `--ease-out` 300 ms) |
| Kembali | setelah 2000 ms; pesawat masuk dari 8 px kiri, 300 ms ease-out; label kembali "Email me" |
| Pengumuman | region `aria-live="polite"` membaca "Mail app opened" |

Urutan di kode: jalankan animasi, lalu buka `mailto:` sekitar 120 ms setelah tekan agar terbang terlihat sebelum aplikasi email mengambil fokus.

Reduced motion (variant Dikurangi): tanpa terbang dan rotasi; label crossfade opacity 150 ms saja.

## 9. Scroll reveal

Ganti `.scroll-reveal` dan action `inview` dengan nilai ini. Action yang ada (`src/lib/actions/inview.ts`, observer bersama) bisa dipertahankan; ubah opsi default dan class.

```css
.js [data-reveal] { opacity: 0; translate: 0 12px; filter: blur(4px); }
[data-reveal].is-in {
  opacity: 1; translate: 0 0; filter: blur(0);
  transition-property: opacity, translate, filter;
  transition-duration: 300ms;
  transition-timing-function: var(--ease-out);
  transition-delay: var(--reveal-delay, 0ms);
}
[data-reveal="fade"] { translate: none; filter: none; }
[data-reveal="noblur"] { filter: none; }
@media (prefers-reduced-motion: reduce) {
  .js [data-reveal] { translate: none; filter: none; }
  [data-reveal].is-in { transition: opacity 200ms ease-out; transition-delay: 0ms; }
}
```

```html
<!-- app.html, sebelum CSS: state tersembunyi hanya jika JS jalan -->
<script>document.documentElement.classList.add("js")</script>
```

Opsi observer: `threshold: 0`, `rootMargin: "0px 0px -15% 0px"` (ponsel `-10%`), jalan sekali lalu `unobserve`. Jika banyak elemen masuk dalam satu frame (lompatan cepat), tampilkan bersama tanpa delay (batch).

| Elemen | Pemicu | Delay / gerak |
|---|---|---|
| Hero | load pertama | 0 / 100 / 200 ms, "Scroll" +300 (§3) |
| Panggung | terikat scroll | scale 0.8 → 1 dan glow membuka (§6 / dokumen 07); bukan `data-reveal` |
| Aura | – | opacity saja, 500 ms |
| Judul Selected work, Writing, Tools I use | 85% | `data-reveal` biasa (12 px + blur 4 px, 300 ms) |
| Kartu Selected work | 85% | 0 / 60 / 120 ms; kartu ke-4 bersama ke-3 |
| Paragraf About | 85% | 0 / 0 / 80 / 160 ms; Experience 240 ms |
| Kipas Writing | 85% | depan 0, dua belakang +60 ms |
| Logo Tools I use | 85% | satu blok, tanpa blur (`noblur`) |
| Contact | 85% | judul 0, email 100, sosial 200 ms |
| Footer | 95% | `fade` |
| Header halaman Stack / Writing / Artikel | load pertama | langkah 100 ms |
| Peta fleet | 85% | translateY 16, 400 ms; judul 0, peta 100 ms |
| Baris Writing | 85% per baris | 40 ms, hanya 6 baris pertama; sisanya tanpa delay |
| Body artikel | – | statis |
| Gambar artikel | 85% | `fade` |
| Isi modal / sheet | – | tanpa reveal di dalam |

## 10. Alur fleet (halaman Stack)

> Diperbarui 27 Nov 2026 (review situs live §6, Figma 67:1511). Putaran lama 6 s dengan titik 7 px terlalu cepat (±4 dari 6 s tidak ada yang bergerak).

Penghubung: satu SVG di belakang kartu, posisi dari `getBoundingClientRect` (ulang saat resize), ortogonal dengan sudut 8 px, panah 6×6. Garis diam solid seperti Figma; garis yang aktif membawa lapisan putus-putus `4 4` yang mengalir (`stroke-dashoffset 0 → -16`, 900 ms linear, berulang). Ditambah loop "fail → back to lead" (ungu `--fleet-text`, putus 3 3) dan garis "approve ship" (abu, solid, panah ke Ship).

Paket: kepala 10 px dengan ekor gradien 24 px, `offset-path` mengikuti garis, Web Animations API (`element.animate()` dengan `delay`); jeda = `animation.pause()`.

Timeline 10 s:

| Waktu | Kejadian |
|---|---|
| 0 | paket Task → T3 Code (800 ms) |
| 800 | cincin T3 Code |
| 1400 | paket T3 → JARVIS (900 ms) |
| 2300 | JARVIS aktif |
| 2400 | 4 paket JARVIS → agen (1000 ms, stagger 0 / 80 / 140 / 180) |
| 3400–5600 | agen bekerja: avatar aktif, `scale 1 → 1.04` 1.2 s |
| 5600 | merge ke fleet check (900 ms) |
| 6500 | chip cek menyala satu per satu (120 ms) |
| 7200–8000 | paket pass → Ship (800 ms); 7300 garis approve dari ponsel |
| 8000 | Ship menyala |
| 9200 | jeda |
| 10000 | ulang |

Satu dari tiga putaran memakai jalur gagal (11,5 s): di 6500 "tests" merah, 6900 paket kembali lewat loop ke JARVIS (900 ms), 8200 cek diulang dan lulus, 8800 approve, 9500 Ship.

- Mulai saat 50% peta terlihat; jeda saat < 10% terlihat atau tab tersembunyi.
- Jeda saat hover atau fokus di peta, atau lewat tombol jeda. Klik agen menghentikan putaran (sampai kartu ditutup). Lanjut dari titik yang sama.
- Reduced motion: tetap di Langkah 0 (Diam), garis diam, tanpa paket.

## 11. Lain-lain

| Hal | Nilai |
|---|---|
| Copy → "Copied" | ikon crossfade scale 0.25→1 + blur 4→0, 300 ms `--ease-flow`; kembali setelah 2 s |
| Status dot "Now" | pulse lambat (opacity), mati di reduced motion |
| LinkPreview | masuk opacity + scale 0.98→1, 150 ms ease-out; keluar 100 ms |
| Ganti tema | matikan semua transisi selama ganti (`disableTransitionOnChange`: tambah class yang set `transition: none !important` selama satu frame) |
| Gambar | tanpa animasi selain reveal fade |

## 12. Ringkasan reduced motion

| Hal | Perilaku |
|---|---|
| Hover | warna saja; garis bawah muncul tanpa tumbuh (opacity 150 ms) |
| Tekan | tanpa scale; opacity/lapisan tetap |
| Reveal | opacity 200 ms, tanpa geser dan blur, tanpa delay |
| Pergantian halaman | tanpa view transition |
| Modal / sheet / menu | fade opacity 150–200 ms, tanpa scale dan geser |
| Panggung | jeda dari awal, shot terakhir tiap slide, crossfade 200 ms |
| Kipas | crossfade 200 ms |
| Alur fleet | diam di langkah 0 |
| Pesawat kertas | variant Dikurangi: crossfade label 150 ms |
| Scroll ke anchor | lompat langsung |

## 13. Cek rasa (tidak bisa dinilai dari kode)

Rekam dan putar per frame (DevTools Animations, kecepatan 10–25%): crossfade warna panggung 700 ms (harus terasa satu gerakan, bukan dua lapisan), kipas setelah swipe (pantulan ±3% wajar atau terlalu ramai), seret sheet di ponsel sungguhan 120 Hz, dan terbang pesawat kertas sebelum aplikasi email terbuka.

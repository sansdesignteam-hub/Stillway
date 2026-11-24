# Brief Developer: Foundation V2 (D-134)

Status: disetujui pengguna 23 Nov 2026 (D-134, D-135). Kerjakan hanya foundation: warna, token, dan tipografi. Layout, gerak, latar, dan konten section tetap seperti production `81318d9` (D-131).

## Acuan

- `context/Visual Directions V2/Moodboard.md` §2 (warna, v2.1) dan §3 (tipografi).
- Figma "Website AI - 1 Stillway", halaman Foundation `64:5`: 🌈 Color Palette `10067:9850`, 🎨 Token Color System `10068:11282`, 🆃 Typography `10068:12435`. Kalau Moodboard berbeda dengan Figma, yang dipakai Figma.
- Abaikan variabel font pada komponen Header/Title Documentation di Figma (Inter, DM Sans, heading_1 36/48). Itu sisa template, bukan nilai Stillway.

## 1. Warna (`web-v2/src/styles/tokens.css`)

1. Tambahkan skala primitive (`--neutral-*`, `--ochre-*`, `--cocoa-*`, alpha) seperti blok CSS di Moodboard §2.6.
2. Jadikan main colors alias dari skala:

| Token | Lama | Baru |
|---|---|---|
| `--paper` | #F7F5F0 | `var(--neutral-50)` #F9F5EF |
| `--sand` | #EFE6DB | `var(--neutral-100)` #F0E8DD |
| `--night` | #17120F | `var(--cocoa-950)` #1B0B06 |
| `--stone` | Ink 65% | `var(--neutral-600)` #6B655F (solid) |
| `--cocoa` | — | `var(--cocoa-900)` #341C12 (baru, lihat poin 6) |
| `--ink`, `--ochre`, `--line`, `--led-*` | tetap | tetap |

3. Turunan yang memakai RGB lama ikut diganti: `--stone-on-night`, `--line-on-night`, dan glow/dusk yang menyebut `var(--night)`.
4. **Hex lama yang ditulis langsung** di luar `tokens.css` perlu diganti dengan token atau `color-mix()` dari token. Hasil pencarian 23 Nov:
   - `rgb(247 245 240 / …)` (Paper lama): `AppPhone.astro:375`, `Details.astro:95`, `Specs.astro:418`, `Finishes.astro:97`, `Features.astro:106`, `Activity.astro:74`, `Activity.astro:131`, `Close.astro:248`
   - `rgb(239 230 219 / …)` (Sand lama): `Stage.astro:64`, `Details.astro:69`
   - `rgb(23 18 15 / …)` (Night lama): `nav.css:301`, `Insight.astro:68`
   - `<meta name="theme-color" content="#F7F5F0">`: `layouts/Base.astro:25`
   - Cek juga warna latar atau fog di scene Three.js dan gambar yang di-tint ke Paper/Night. Kalau sambungan foto ke latar terlihat belang (misalnya foto S02 dinding bayangan daun atau tepi foto S07 ke Sand), laporkan dan jangan mengubah fotonya.
5. Teks sekunder di Night tetap memakai Paper 65% (7.71:1), bukan `text-cocoa-soft` (D-135).
6. **Cocoa dipakai (D-135):** panel dan kartu yang sudah ada di section gelap (Night/Dusk) memakai `--cocoa` (`bg-cocoa-surface`), menggantikan panel transparan berbasis Night/Paper lama. Kandidat: panel Insight S05 (`Insight.astro:68`, sekarang `rgb(23 18 15 / 0.62)`), kartu Features S08 (`Features.astro:106`, `rgb(247 245 240 / 0.1)`), dan panel/kartu lain di S03, S04, dan S11. Jangan menambah panel baru. Kalau panel harus tetap tembus pandang supaya foto atau ring di belakangnya terlihat, pakai Cocoa dengan alpha dan catat alasannya. Label ochre kecil di atas Cocoa memakai ochre/400 (4.02:1 untuk Ochre biasa terlalu rendah). Daftar elemen yang berubah masuk ke laporan.

## 2. Tipografi

1. Weight: Display dan Heading **500** (sebelumnya `--w-heading: 450`), Paragraph 400, Label/Buttons 500, Mono 400 (Medium 500 hanya untuk eyebrow).
2. Buat variabel per text style (size, line height, letter spacing dalam px) dari Moodboard §3.1, misalnya `--t-display-1-size`, atau utility class `.t-heading-1` dan seterusnya. Penamaannya bebas asal konsisten.
3. Petakan setiap teks di section S01–S11 ke text style terdekat. Kolom "Contoh pemakaian" di §3.1 masih usulan. Saat ini ada ±64 `font-size` lepas dan 5 `font-weight` lepas di luar `tokens.css`.
4. Teks yang tidak cocok dengan style mana pun tanpa merusak layout (contoh: wordmark hero yang sekarang `clamp(7rem, 24vw, 23rem)` dibandingkan dengan Display 1 275.4 px) **dicatat dalam laporan, jangan diberi ukuran baru**.
5. **Peralihan Desktop → Mobile (D-135):** Display dan Heading memakai `clamp()` linear dari nilai Mobile di lebar 390 ke nilai Desktop di 1440 (size, line height, dan letter spacing). Label, Paragraph, Buttons, dan Mono memakai satu nilai di semua lebar layar.

## 3. Mode inspect (D-135)

Masalah: `.stage` (`components/Stage.astro:24`) adalah layer `fixed` dengan `pointer-events: none`, dan hanya `a`/`button` yang diberi `auto`. Picker DevTools melewati elemen ber-`pointer-events: none`, jadi yang terpilih adalah `.track` kosong di `.tracks` (`pages/index.astro:44`), bukan teks atau gambar.

Perbaikan: tambahkan mode inspect yang hanya aktif lewat `?inspect` di URL. Perilaku normal tidak berubah.

```ts
// sebelum initMotion(), mis. di scripts/motion.ts
if (new URLSearchParams(location.search).has('inspect')) document.documentElement.classList.add('inspect');
```

```css
/* global.css */
html.inspect .stage { pointer-events: auto; }
html.inspect .tracks { pointer-events: none; }
```

Scene yang tidak aktif sudah `visibility: hidden` (story.ts:160), jadi picker tidak akan memilih scene lain. State yang opacity 0 di scene yang sama bisa ikut terpilih; kalau mengganggu, beri `pointer-events: none` pada `[data-a]` yang sedang tak terlihat saat mode inspect. Cek bahwa scroll wheel/trackpad, link anchor, dan tombol tetap jalan di mode inspect, dan perilaku tanpa `?inspect` sama dengan sebelumnya.

## 4. Jangan diubah

Layout, posisi, gerak/ScrollTrigger, foto, model 3D, material ring, warna Gold/Silver/Black (D-100), copy, dan latar per section (Moodboard §2.4).

## 5. Alur kerja

- Branch `Developer`. Push ke staging (Preview Vercel, D-130). Merge ke `main` dan production hanya atas perintah pengguna.
- Sebelum diserahkan, Claude Code memeriksa screenshot desktop 1440 dan mobile 390 untuk S01–S11 di staging, lalu membandingkannya dengan production.
- Laporan berisi: daftar perubahan token, tabel pemetaan teks ke text style per section, teks yang tidak cocok, dan section yang tampak berubah (terutama section Night karena Night menjadi lebih cokelat).

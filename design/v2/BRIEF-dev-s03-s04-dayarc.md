# Brief Developer: D-137, lalu sambungan S03 → S04 (Lensa) dan S04 Day arc (D-138)

Status: disetujui pengguna 23 Nov 2026. Kerjakan di branch `Developer` di atas `aced467`. Urutannya: bagian A lebih dulu (kecil, satu commit), lalu bagian B.

Sumber utama: Figma "Website AI - 1 Stillway", section Design `40004245:50`. Ambil nilai lewat Figma MCP (`get_design_context` per frame); salinan PNG ada di `design/v2/references/`. Kalau brief ini berbeda dengan Figma, yang dipakai Figma.

## A. D-137: penyempurnaan D-136

1. **Mobile:** kalimat kecil S02 ("No score to chase…") yang naik saat sambungan 02 → 03 lewat di belakang ring, sama seperti teks besarnya. Lapisan teks lainnya tidak berubah.
2. **Ring S03 hangat:** selama sambungan 02 → 03 (setelah gelap) dan di seluruh S03, ring tampil hangat dan selaras dengan cahaya pojok dan latar cokelat: perak dengan pantulan keemasan/cokelat seperti frame S03 di Figma (`40004471:5860`, salinan `s03-s04-lens-A.png`). Sekarang ring gelap kebiruan dengan rim dingin; rim dingin diganti cahaya/env hangat. Material tetap satu `silver_polished` (D-085), dan ring tetap terbaca perak, bukan Gold. Lampu sensor hijau tetap.

## B. D-138: sambungan 03 → 04 dan S04

### Frame Figma

| Frame | Node | Salinan PNG |
|---|---|---|
| 03→04 State A · Malam selesai (0%) | `40004471:5860` | `s03-s04-lens-A.png` |
| 03→04 State B · Pagi di dalam ring (40%) | `40004471:6083` | `s03-s04-lens-B.png` |
| 03→04 State C · Lensa terbuka (60%) | `40004471:6306` | `s03-s04-lens-C.png` |
| 03→04 State D · = 04 State 1 (100%) | `40004471:6529` | `s03-s04-lens-D.png` |
| 04 State 1 – 5 | `40004410:3751`, `:3773`, `:3797`, `:3823`, `:3847` | `s04-dayarc-state1…5.png` |
| Ringkasan baris 04 | — | `s03-s04-storyboard-overview.png` |

### Catatan state dari Figma (teks asli)

- **Baris 03 → 04:** "MALAM KE PAGI · Night → Dawn glow ochre · 4 state · ring yang sama (satu asset) jadi lensa: pagi terlihat lewat lubang ring, foto berubah jadi kartu aktif Day arc; State D = 04 State 1."
- **A (0%):** "Akhir S03 State 4 (BROKEN 2×, ring di kanan). Angka S03 mulai ikut scroll naik keluar; ring bergeser ke tengah dan berputar menghadap kamera. Glow fajar ochre naik dari bawah; jam 23:10 → 05:30."
- **B (40%):** "Pagi di dalam ring. Ring di tengah, membesar ×1.1 → ×1.6; foto 07:40 muncul di lubangnya (mask bulat lonjong), ikut membesar seperti kamera mendekat."
- **C (60%):** "Lensa terbuka. Ring melebar keluar layar (×4, blur 28, memudar) saat kamera menembus lubang; foto mengecil dan berubah jadi kartu 264×352 (radius 220 → 12) di puncak busur."
- **D (100%):** "Kartu aktif 07:40 di puncak busur, foto 09:00 & 10:30 naik masuk sepanjang busur, judul + paragraf dan jam 07:40 naik. Jam navbar 05:30 → 07:40. Sama dengan 04 State 1."
- **Baris 04:** "07:40 → 15:30 · Night + Ember glow · 5 state (1 per foto) · Layout Day arc."
- **04 State 1:** "Foto 07:40 di puncak busur (264×352), foto berikutnya berjajar di busur seperti matahari bergerak sepanjang hari (176×236, makin redup). Jam besar + status di tengah bawah foto aktif; foto + jam berpusat di y 482, x 720."
- **04 State 2:** "Scroll memutar busur ke kiri (rotasi di pusat 720, 1758 · R 1340 · 12° per foto, scrub). 09:00 naik ke puncak & membesar; 07:40 turun ke kiri dan meredup. Jam bergulir per digit, status & jam navbar berganti dengan gerak naik."
- **04 State 3:** "10:30 di puncak. Kartu yang sudah lewat (kiri) lebih redup dari yang akan datang (kanan)."
- **04 State 4:** "12:30 di puncak."
- **04 State 5:** "15:30 di puncak, kartu kanan habis. Lalu seluruh busur turun keluar bawah, layar gelap; ring naik dari bawah (04 → 05)."

### Aturan

- Ring di sambungan adalah ring 3D yang sama (satu asset). Pembesaran dan blur di State C dilakukan pada ring 3D atau lapisannya, bukan dengan gambar ring baru.
- Foto memakai foto S04 yang sudah ada (`design/assets/v1/home/S3p-*` dan aset S04 di `web-v2`). Pilih ukuran gambar yang cukup tajam untuk kartu aktif.
- Judul, paragraf, jam besar, status, dan label jam di kartu memakai text style foundation (D-134). Copy (status tiap jam) diambil dari Figma.
- Busur diskalakan terhadap lebar viewport (R dan pusat dihitung dari 1440).
- **Mobile 390:** tidak ada frame mobile di Figma. Usulkan versi mobile yang mempertahankan ide Day arc (kartu aktif di tengah, busur lebih kecil), lalu laporkan dengan screenshot supaya Claude Code bisa memeriksanya sebelum pengguna meninjau.
- Reduced motion: fade pendek per state.
- Sambungan 04 → 05 hanya berubah sejauh yang ditulis di State 5 (busur turun keluar, layar gelap, ring naik dari bawah). S05 dan section lain tidak berubah.

## Alur kerja

- `npm run build` lulus, lalu push ke `origin/Developer` (staging, D-130). Jangan merge ke `main` dan jangan deploy production.
- Laporan: commit untuk A dan B, status Preview, dan frame desktop 1440 serta mobile 390 untuk A, untuk tiap state sambungan 03 → 04, dan untuk S04 State 1–5, berdampingan dengan frame Figma yang sesuai.

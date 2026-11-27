# Brief Developer — QA mayor Stillway

Acuan [QA Figma](https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004517-3883). PM memeriksa keempat kartu melalui Figma MCP setelah menyaring opacity. Keempatnya 100%. Lewati kartu yang diredupkan. Kerjakan dalam urutan berikut. F-02 masuk bersama G-09 karena menyangkut pergantian keluarga font yang sama.

1. **G-09 · Tipografi** ([kartu](https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004517-4463)). Terapkan Hanken Grotesk dan petakan teks halaman ke style Foundation di bawah. Display 1 khusus wordmark hero dan footer. Display 2 khusus teks besar. Verifikasi judul S10/S11, big text “see your night.”, teks panjang, wordmark dan metrik S03 pada desktop/mobile. Pertahankan adaptasi responsif yang diperlukan dan jelaskan pengecualiannya. AppPhone adalah mockup berskala, periksa proporsinya setelah pergantian font.
   - **F-02 · Keluarga font** ([kartu](https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004519-4047)). Gunakan Hanken Grotesk untuk heading, body, label, data, dan jam di seluruh website V2. Hapus pemakaian Geist, Geist Mono, serta serif judul. Label data dan jam memakai Hanken Grotesk kapital. Nama style `Mono` di Foundation merujuk pada tracking, dengan keluarga font tetap Hanken Grotesk. Laporkan F-02 dan G-09 masing-masing dengan bukti dan commit yang relevan.
2. **G-10 · Grid dan spacing** ([kartu](https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004517-4479)). Di acuan 1440 × 900, 12 kolom, margin 40 px, kolom 84 px, gutter 32 px. Posisi atas konten y 144, baris bawah y 860, spacing kelipatan 4/8 px. Gunakan token bersama dan audit section per section. Adaptasikan tinggi viewport dan mobile agar konten tidak terpotong serta pertahankan komposisi khusus yang dibutuhkan motion.
3. **SL-02 · Cahaya S03 State 1** ([kartu](https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004517-4654)). Hanya satu sisi tepi ring terkena cahaya dingin, bagian lain tenggelam di Night. Terapkan pada State 1. Usulan PM untuk menyelaraskan D-137/D-140 adalah menggeser masuknya cahaya hangat dan LED hijau ke transisi menuju State 2 sehingga urutan siluet → cahaya hangat → LED tetap terbaca. Pertahankan karakter hangat pada State 2–4. Cek transisi dua arah, fallback ring dan reduced motion.
4. **HE-02 · Progres global** ([kartu](https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004517-5016)). Indikator vertikal tipis, fixed di kiri viewport, mengikuti pola [VITURE Mobile Dock Mini](https://www.viture.com/mobile-dock-mini). Satu titik per section, total 11. Section aktif menjadi pill terisi aksen dari token yang sudah tersedia sesuai D-168. Gunakan posisi section dari alur scroll yang ada. Pertahankan progres lokal S09. Cek kontras, benturan dengan konten dan sinkronisasi dari hero sampai footer termasuk deep link, resize, scroll mundur dan reduced motion. Indikator berfungsi sebagai penanda posisi.

## Typography Foundation

Semua style menggunakan Hanken Grotesk. Ukuran, line height dan tracking dalam px.

| Style | Weight | Size | Line height | Tracking |
|---|---:|---:|---:|---:|
| Display/Display 1 | 500 | 275.4 | 204 | -8.26 |
| Display/Display 2 | 500 | 160 | 152 | -4.8 |
| Display/Display 3 | 500 | 96 | 104 | -2.88 |
| Display/Display 4 | 500 | 72 | 72 | -2.16 |
| Heading/Heading 1 | 500 | 56 | 56 | -1.68 |
| Heading/Heading 2 | 500 | 32 | 36 | -0.64 |
| Heading/Heading 3 | 500 | 24 | 26 | -0.48 |
| Label/Large | 500 | 20 | 28 | -0.2 |
| Label/Medium | 500 | 16 | 24 | 0 |
| Label/Small | 500 | 15 | 22 | 0 |
| Label/X-Small | 500 | 12 | 16 | 0 |
| Paragraph/Large | 400 | 20 | 28 | -0.2 |
| Paragraph/Medium | 400 | 16 | 24 | 0 |
| Paragraph/Small | 400 | 14 | 20 | 0 |
| Paragraph/X-Small | 400 | 12 | 16 | 0 |
| Buttons/Medium | 500 | 16 | 24 | 0 |
| Buttons/Small | 500 | 15 | 22 | -0.15 |
| Mono/Large | 400 | 16 | 22 | 1.28 |
| Mono/Medium | 500 | 13 | 20 | 1.04 |
| Mono/Small | 400 | 13 | 20 | 1.04 |
| Mono/X-Small | 400 | 11 | 16 | 0.88 |

## Hasil yang diminta

Kerjakan di `web-v2/` pada worktree `Developer`, baseline `d0bf6a6`. Ikuti AGENTS.md dan konteks proyek. Jalankan `npm ci` bila dependensi lokal perlu disinkronkan. Buat commit per kartu atau kelompok yang terkait, jalankan `npm run build`, cek desktop 1440 × 900 dan mobile 375 px, lalu push ke `origin/Developer` untuk preview Vercel. Production menunggu persetujuan pengguna. Sertakan bukti sebelum/sesudah ketika relevan, status dan commit per kartu, link staging atau status deploy, dan batas verifikasi. Kembalikan laporan kepada PM untuk review dan pembaruan Figma.

> **ARSIP · 23 Nov 2026:** revisi v3 di-rollback (D-131). Dokumen ini hanya catatan, bukan acuan kerja.

# Brief Developer: Revisi V2 mengikuti dokumen v3

Dari: Claude Code (main, Project Manager) · 23 November 2026 · Dasar: D-103 sampai D-125
Untuk: Developer (`web-v2/`, branch `Developer`)
Status: **Fase 1 disetujui dan berjalan (D-125).** Fase 2–4 menunggu arahan.
- Pekerjaan baru dimulai setelah pengguna memberi lampu hijau per fase.
- P1–P12 di §2 sudah diputuskan (D-113 sampai D-118, D-123).

## 0. Acuan

1. **Target tampilan:** frame Figma Design 1440 (`ejtNpUf0FdEYMgAbcENMCH`, `40004245:50`), dibaca lewat Figma MCP. **Kalau MCP gagal, berhenti dan lapor ke PM.**
2. **Alur:** `context/Visual Directions V2/Storyboard.md` (v3). Storyboard 2 di Figma masih memuat catatan lama. Bila bertentangan dengan `.md`, ikuti `.md`. Daftarnya di `design/v2/REVIEW-v3-storyboard-qa-moodboard.md` §2.
3. **Temuan dan prioritas:** `QA.md`. **Token:** `Moodboard.md` §2.7–2.8 dan §3.1 (D-111).
4. **Tetap berlaku:**
   - D-067 / D-106: angka tanpa `*`.
   - D-069 / D-074: tanpa cart; tombol hanya memunculkan catatan inline.
   - D-083: logo navbar berupa teks.
   - D-085 / D-112: satu ring `silver_polished` yang harus terbaca silver.
   - D-099, D-100: S10 dan FAQ.
   - D-021: semua teks website berbahasa Inggris.
5. **Keputusan yang mengubah build:**
   - D-104: S04 Day arc.
   - D-105 + D-124: S02 memakai label "WHY STILLWAY" dan underline ochre. **Latar tetap dinding bayangan daun** (D-088).
   - D-107: S06 memakai meja kayu dengan tangan foto `A-1-hand-left-alpha.png`. Tangan 3D tidak dipakai.
   - D-108: S03 disorot cahaya hangat cocoa/200, lalu sensor hijau menyala.
   - D-109: Dusk S05 dibuat dari Cocoa.
   - D-110: legenda S08 boleh diklik di desktop (opsional).
   - D-111: token warna dan tipe baru.

6. **Keputusan 23 Nov (lanjutan):**
   - D-118: pantulan moss di Hero S01 tetap. Sambungan 01→02 tidak boleh ada lompatan warna.
   - D-119: semua teks memakai text style terbaru, semua warna memakai token. Cek ulang per section terhadap Figma.
   - D-120: sambungan memakai pola "konten bergulir, ring sticky". Kartu Sambungan 02→03 menjadi contoh baku.
   - D-121: S07 dibuat halus seperti obsidianassembly.com. Penutup "The everyday." **tidak scale-up**: foto lingkungan bergulir naik dari bawah di belakang kartu yang tetap di tengah. Buka situs Obsidian di browser sebagai acuan rasa scroll.
   - D-122: A-01 cukup perbaikan ukuran gambar di build. Foto asli sudah 1060×1484.

## 1. Fase kerja (urutan dari laporan Developer)

| Fase | Isi | Temuan QA |
|---|---|---|
| **1 · Fondasi** | Model panel naik dari bawah dengan ring sticky tanpa fade: `story.ts` ditulis ulang. Bagian masuk/keluar di 11 modul. Jam navbar memakai keyframe. Tema navbar berganti mengikuti tepi panel. Teks berganti dengan gerak naik. Token warna dan text style baru. | W-04, A-06, G-03/M-01, G-09, G-13, G-04 |
| **2 · S01–S05** | H-03 dan G-01 (ring terbaca silver). S02 menurut D-105. Cahaya S03 menurut D-108. Lensa 03→04 dibangun bersama Day arc. S05 memakai Dusk cocoa dan kartu kaca 432 px. | H-03, W-01, W-02, SL-02, A-05, A-07, A-02, I-01, I-02, I-03 |
| **3 · S06–S08** | Meja kayu: ring menggelinding, jatuh, lalu masuk ke jari tangan foto. Sambungan 06→07. Layout S07 versi 23 Nov. S08 State 4 dengan lampu merah. Ring S08 di web dibuat lebih terang sampai terbaca silver, disamakan dengan cadangan baru 3D Designer (D-127). Pasang cadangan `fb-s08-*` dan `fb-s06-finger-polished` (D-127). | D-01, D-02, D-03, S7-01, F-01 |
| **4 · S09–S11 + global** | Pusat vertikal y 482. Wordmark footer kapital. Navbar aktif, progres, deep link, 404, favicon/og, alt, spasi H2. Panjang scroll per section. | G-10, G-11, C-01, HE-01 sampai HE-07, G-06, G-07, G-08 |

Ritme kerja tiap fase: kerjakan di branch `Developer`, PM memeriksa hasilnya terhadap Figma Design, lalu pengguna meninjau. Merge dan deploy hanya atas perintah pengguna (D-086).

## 2. Pertanyaan teknis Developer

**P1–P5 sudah diputuskan pengguna pada 23 Nov (D-113 sampai D-117) dan menggantikan usulan di tabel.** P1 berbeda dari usulan: ring tegak, lubang menghadap kamera, menggelinding sejajar meja (acuan `design/v2/references/s06-ref-5-roll-flat-strip.png` dan `s06-ref-6-roll-flat-user.png`). P3 memakai jejak 2 salinan ring sesuai Storyboard. P7 sudah dijawab D-118 (pantulan Hero tetap, tanpa netralisasi). P6 dan P8–P12 disetujui sesuai usulan (D-123).

| # | Pertanyaan | Usulan |
|---|---|---|
| P1 | Gelinding S06 tidak fisik bila dilihat dari samping | Gelinding fisik: sumbu ring kira-kira menghadap kamera (sudut 3/4 ≤ 30°), rotasi = jarak ÷ jari-jari. "Tampak samping" di State 2 dicapai saat ring melambat di dekat tepi meja, sebelum miring jatuh. |
| P2 | Urutan jatuh ke jari | Persentase scroll: 75–88% tangan naik lalu berhenti (Frame A→B); 80–95% ring miring dari tepi, sumbunya berputar 90° sambil jatuh, masuk dari ujung jari lalu turun ke pangkal; 95–100% ring mendarat dengan sedikit pantulan, tag [ SILVER ] dan teks penuh muncul (Frame C). |
| P3 | Jejak gerak (salinan ring transparan) | Tidak memakai salinan ring. Diganti streak atau motion blur tipis, hanya di desktop. Di mobile dan reduced motion tidak ada. |
| P4 | Kilau 600 ms di 02→03 | Kilau terikat ke scroll, karena aturan global: semua gerak mengikuti scroll. |
| P5 | Mask dan blur lensa 03→04 | Mask memakai proyeksi lingkar dalam ring (`clip-path`), lalu berubah ke 264×352 dengan radius 120 → 12. Blur hanya di desktop; mobile tanpa blur. |
| P6 | y 482 dan busur hanya untuk 1440×900 | Pusat = (bawah navbar + tinggi viewport) / 2, dengan tinggi header yang dipakai kode. Busur diskalakan terhadap lebar viewport (R = 1340 × vw/1440), pusat-y dihitung supaya foto + jam tetap di pusat. Mobile menyusul (Storyboard §6 no. 6). |
| P7 | Pantulan moss S01 (D-081) vs silver (D-112) | Env moss tetap dipakai, tetapi saturasi dan warnanya dinetralkan sampai ring terbaca silver. Pengguna meninjau di S01. |
| P8 | Breakpoint text style | Display dan Heading memakai `clamp()` dari nilai Mobile (390) ke Desktop (1440). Paragraph, Label, dan Mono berganti di satu breakpoint, 768 px. |
| P9 | Lampu merah S08 terlalu singkat | State 4 mendapat satu tinggi layar penuh plus jeda. Rentang warna diskalakan ulang tanpa mengubah urutan hijau → biru → ungu → merah. |
| P10 | 06→07 tanpa ring sticky | Pada pose akhir S06, frame tangan + ring dirender (snapshot canvas ke tekstur) lalu menjadi kartu Night. Pose sama persis, jadi tidak ada lompatan. Sesuai Storyboard: "ring di foto kartu". |
| P11 | Batas EVENING | 16:40 = AFTERNOON; mulai 17:00 = EVENING (17:10 dan 17:30 EVENING). |
| P12 | Panjang scroll (HE-04) | Target maksimal ±4 tinggi layar per section. S07 dipendekkan dari 7,6. |

## 3. Aset yang dibutuhkan (bukan pekerjaan Developer)

- **S04:** tidak perlu foto baru (D-122).
- **S06:** tekstur meja kayu pinus, diekspor dari Figma Design · 06. Developer bisa mengambilnya lewat Figma MCP `download_assets`.
- **S08:** gambar cadangan `fb-s08-*` untuk reduced motion dan mode tanpa WebGL (hijau, biru, ungu, merah), dibuat 3D Designer.
- **S06 reduced motion:** gambar cadangan ring di jari dengan finish polished, menggantikan A-1b yang brushed. Dibuat 3D Designer atau Visual Director.
- **G-06:** favicon dan og:image 1200×630.

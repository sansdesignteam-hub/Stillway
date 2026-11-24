> **ARSIP · 23 Nov 2026:** revisi v3 di-rollback (D-131). Dokumen ini hanya catatan, bukan acuan kerja.

# Developer — tinjauan teknis Storyboard v3, QA, Moodboard, REVIEW PM (23 Nov 2026)

Tugas hanya-baca. Tidak ada kode yang diubah, tidak ada commit, push, atau deploy. `git status` di worktree Developer bersih (Developer `4c1a1df`; kode `web-v2/` sama dengan main `81318d9`).

## A. Yang sudah dibaca

- **Dokumen (dibaca penuh):**
  - `context/decisions.md`: D-001 sampai D-102, plus bagian "Hal yang masih terbuka".
  - `Storyboard.md` v3 (416 baris).
  - `QA.md` (183 baris).
  - `Moodboard.md` (370 baris).
  - `design/v2/REVIEW-v3-storyboard-qa-moodboard.md`.
- **Figma MCP (berhasil):**
  - `create_session` berjalan.
  - `get_metadata` Design `40004245:50` dibaca penuh (1893 baris). Isinya semua frame state S01–S11, plus baris transisi 02→03 A–C, 03→04 A–C, 04→05 A–C, dan 06 Tangan & ring A–C.
  - `get_screenshot` diambil untuk 9 frame: 02→03 B, 03→04 B dan C, 04→05 A, 04 State 2, 06 State 1, 06 B dan C, 08 State 4.
  - Frame lain hanya dibaca lewat metadata, tanpa screenshot.
- **Yang gagal:** tidak ada. Server MCP `figcraft` gagal terhubung, tetapi tidak dipakai di tugas ini.

## B. Arsitektur

**Yang sudah ada:** `Stage.astro` + `story.ts` sudah memakai satu ring sticky.
- Ada satu stage `position: fixed` dan satu canvas WebGL (`RingStage`). Ring diatur oleh `Pose` per section.
- Section memakai "track" kosong yang hanya memberi panjang scroll.
- Ring diapit oleh lapisan belakang (z 1) dan lapisan depan (z 3) tiap scene.

**Yang bertentangan dengan model "panel naik, tanpa cross-fade":**
1. **Background dibuat cross-fade.**
   - Background adalah satu elemen `stage__bg` yang warnanya di-lerp pada 30–70% tiap sambungan.
   - Ada juga `stage__dusk` (mask gradient) dan `stage__wipe` (pita gradient "sunset/rise/plain"). Semuanya cross-fade atau wipe lembut, bukan panel bertepi lurus.
2. **Konten masuk dan keluar dengan opacity.** Hampir semua konten memakai `put(el, {o})`, termasuk G-03 (teks yang crossfade).
3. **Ring di-fade lewat `pose.alpha`.**
   - Yang memakai `canvas.style.opacity`: activity, insight, details, specs, features, app, finishes, close, placeholder.
   - Di akhir S06, ring diganti foto A-1b.
   - Keduanya melanggar aturan "ring tidak pernah fade atau diganti gambar".
4. **Jam hanya punya dua titik** (time → timeEnd, atau berganti di 70%). Storyboard butuh beberapa titik per sambungan, misalnya 23:10 → 05:30 → 07:40 dan 15:30 → 16:40 → 17:10 → 17:30.
5. **Tema navbar** dihitung dari `darkW > 0.5`, bukan dari posisi tepi panel.

**Yang perlu dirombak:**
- **Tumpukan panel menggantikan bg/dusk/wipe.**
  - Tiap section punya panel background sendiri (foto, Paper, Night+glow, Dusk, meja kayu) di stage.
  - Panel di-`translateY(100% → 0)` mengikuti progres sambungan, dengan tepi lurus.
- **Konten lama keluar dengan bergerak naik (`yv`), bukan opacity.**
- **Konten baru dipotong tepat di tepi panel.**
  - Ini harus lewat `clip-path` pada elemen anak lapisan, bukan pada root scene. `clip-path`, `opacity`, dan `transform` pada root scene membuat stacking context baru, sehingga teks belakang naik ke depan ring (lihat komentar di `Stage.astro`).
  - Lapisan depan section lama (z 3, di atas ring) juga harus dipotong dari bawah oleh panel baru.
- **Ring keluar layar lewat pose** (y > 0.6), bukan lewat `alpha`.
- **Jam memakai daftar keyframe.**
- **Tema navbar berganti** saat tepi panel melewati y 64.
- **Reduced motion:** fade maksimal 250 ms (sekarang `--fade-reduced` 300 ms), dan panel tetap naik.

**Bobot:** besar. `story.ts` (277 baris) ditulis ulang, ditambah bagian masuk/keluar di kesebelas modul `sections/*.ts`.

## C. Bobot kerja dan risiko

| Kelompok | Bobot | Catatan dan risiko |
|---|---|---|
| Transisi: model panel, 01→02 sampai 10→11, W-04, A-06 | **Besar** | Dikerjakan pertama karena menjadi fondasi semua yang lain. A-06 (ring naik dari bawah, gaya Viture) mudah setelah model panel ada. G-03/M-01 (teks bergerak naik) menyentuh semua section, jadi sebaiknya sekalian. |
| H-03 (gold → silver di 01→02) | Kecil–sedang | Materialnya sudah sama: `silver_polished`, `gloss = 1`. Kesan gold datang dari env foto hero lewat `pose.photo` dan 9 blend env. Env itu sengaja tidak dinetralkan sesuai D-081 ("pantulan lingkungan berlumut"). Perbaikannya mengubah tampilan yang disetujui di D-081 (lihat D-7). |
| A-05 (03→04, ring jadi lensa) | **Sedang–besar** | Foto 07:40 harus di-mask oleh lubang ring 3D. Caranya: proyeksikan lingkar dalam ring ke layar tiap frame, lalu pakai `clip-path` ellipse/polygon di foto DOM. Setelah itu lingkaran berubah jadi persegi 264×352 (radius 120 → 12). "Ring melebar keluar layar (blur)" butuh `filter: blur` di canvas layar penuh, dan ini mahal. Harus dibangun bersama Day arc. |
| S04 Day arc (A-07) | **Sedang** | `Activity.astro` (296 baris) dan `activity.ts` (121 baris) ditulis ulang. Geometrinya absolut untuk 1440×900 (R 1340, pusat 720/1758), jadi perlu aturan skala untuk viewport lain. Belum ada desain mobile. Jam memakai digit bergulir. A-01 butuh foto sumber 2× (sekarang 281×399), dan foto itu harus dibuat Visual Director, bukan dev. |
| S06 meja, gelinding, jatuh (D-02, D-03) dan tangan 3D (D-102) | **Besar, terblokir** | **Status tangan 3D:** GLB tangan belum ada. Di `design/3d/v2/` baru ada `BRIEF-3d-s06-hand.md` (target ≤ 3 MB Draco, 30–60 ribu segitiga, rig opsional), dan render masih menunggu persetujuan. **Usulan:** seluruh adegan masuk ke satu scene three.js (meja sebagai plane bertekstur, tangan GLB, ring). Dengan begitu "kamera mendekat" (frame C) cukup satu gerakan kamera, dan jari menutupi bagian belakang ring secara alami. Kode sekarang bisa dibuang: finger-proxy lathe untuk foto A-1, swap ke A-1b, dan alas Sand. Shadow catcher S01 bisa dipakai ulang untuk bayangan di meja. **Yang masih kurang:** tekstur meja baru ada di Figma (perlu diekspor). Cadangan reduced motion A-1b (D-095, brushed) tidak lagi cocok dengan tangan 3D. |
| S08 lampu merah (F-01) | **Kecil–sedang** | **Isi GLB:** sudah ada node `led_power` (material `LED_Power`, mesh 0,4×0,4 mm) di jendela `Sensor_B` (z +0,0033…+0,0037). Posisinya cermin dari `led_main` di `Sensor_A`, dan `Contact_1`/`Contact_2` ada di antara keduanya, yaitu "dua titik kecil". Jadi jendela bawah = jendela B, sesuai Figma 08 State 4. **Yang sudah jalan:** `stage.setLed('off')` sudah menyalakan `led_power` merah. **Yang kurang:** sprite flare dan point light bounce hanya diikat ke `led_main`, jadi perlu anchor kedua di `led_power`. Juga perlu wash merah, `states` 3 → 4 di `sections.ts`, legenda yang meredup, copy baru, dan cek pose agar jendela B terlihat di bawah. Tidak ada cadangan `fb-s08-*` di `public/ring-fallback/` (merah juga tidak), sehingga reduced motion dan mode tanpa WebGL di S08 tidak punya gambar. |
| Token warna dan tipe (G-09, G-13) | **Sedang**, menyentuh semua section | **Warna:** `tokens.css` mendapat skala Neutral/Ochre/Cocoa dan nama 🎨 Token Color. Pemakaian sekarang: `var(--paper)` 46×, `--night` 12×, `--stone` 15×, ditambah ±14 literal rgb/hex warna lama (BG di `story.ts`, gradient `Stage`, dan lainnya). Stone berubah dari rgba ke solid #6B655F. Untuk Dark Mode, `text-surface` = neutral-400. **Tipe:** skala `clamp()` cair diganti text style Desktop/Mobile. Ada ±70 `font-size` lepas (15px ×15, 14px ×11, …). Heading 450 → 500 cukup ganti satu variabel. Night #17120F → #1B0B06 jauh lebih cokelat, jadi env night, Dusk (K7), dan semua gradient perlu dicek ulang. Risiko regresi visual ada di 11 section. |
| Perbaikan kecil (REVIEW §4) | Kecil masing-masing | **Langsung dikerjakan:** G-04 (tabel `dayparts`: Evening ≤ 17:30), G-07, G-08, C-01, HE-02, HE-06 (`history.replaceState`), HE-07 (404 Astro), HE-01 (pill aktif), I-01, I-02, A-02. **Butuh aset:** G-06 (favicon dan og:image), A-01 (foto 2×). **Sedang:** G-10/G-11 (y 482, lihat D-6), I-03 (kartu kaca 432 dengan `backdrop-filter` blur 60, lihat E), S7-01 (`Specs.astro` 476 baris + `specs.ts` 249 baris, layout baru). |

**Urutan yang saya sarankan:** model panel dan teks naik → token dan tipe → S08 merah → 03→04 dengan Day arc → S07 → S06 (setelah GLB tangan disetujui).

## D. Hal yang tidak jelas, bertentangan, atau tidak mungkin (belum ada di REVIEW §1–§3)

1. **Gelinding S06 tidak konsisten secara fisik.**
   - "Rotasi = jarak ÷ jari-jari" ke kanan menuju tepi meja hanya mungkin jika sumbu ring kira-kira menghadap kamera, jadi lubang ring terlihat.
   - State 2 meminta "tampak samping ±90°", dan Figma State 1 memakai sudut 3/4. Dari samping, ring yang menggelinding akan bergerak mendekat atau menjauh dari kamera, bukan ke kanan.
   - Perlu dipilih: gelinding fisik (lebih menghadap depan) atau gelinding yang distilisasi.
2. **Arah sumbu ring S06 harus berputar ±90° saat jatuh.** Sumbunya mendatar saat menggelinding, tetapi harus tegak searah jari saat mendarat. Ring lalu turun dari ujung ke pangkal jari. Pembagian gerak tidak didefinisikan: Storyboard memakai "ring jatuh ke jari", D-102 memakai "tangan naik masuk ke ring", dan di Figma B tangan sudah berhenti. Perlu satu urutan dengan persentase scroll.
3. **Jejak gerak S06.** Figma State 1 dan B menampilkan 2–3 salinan ring semi-transparan. Ini bertabrakan dengan "satu ring, tidak pernah fade". Secara teknis butuh draw tambahan dengan material physical/clearcoat transparan, yang rawan masalah sorting. Perlu konfirmasi apakah salinan ini boleh, atau diganti motion blur/streak tipis.
4. **Animasi berbasis waktu di sistem yang serba scrub.** Kilau menyapu band "±600 ms" (02→03) adalah durasi waktu, sementara aturan global "semua mengikuti scroll" dan fade ≤ 250 ms. Perlu dipilih: kilau terikat ke scroll, atau diputar sekali (dan diputar lagi saat scroll mundur).
5. **Lensa 03→04.** Spesifikasi mask foto di lubang ring dan blur saat ring "melebar keluar layar" belum ada. Usul: tanpa blur, atau blur hanya di desktop.
6. **Aturan y 482 dan geometri busur hanya didefinisikan untuk 1440×900.**
   - Perlu rumus umum: pusat = (64 + vh) / 2.
   - Kode memakai `--header-h` 76 / 60. REVIEW hanya menyebut selisih 76 vs 64 di Moodboard.
   - Busur R 1340 berpusat (720, 1758) belum punya aturan untuk 1512×827, 1920×1080, atau 390×844.
7. **H-03/G-01 bertentangan dengan D-081.** D-081 meminta pantulan lingkungan berlumut di S01, dan env foto inilah yang membuat ring tampak gold. Membuat S01 terbaca silver berarti mengubah tampilan D-081. K10 hanya merujuk D-085.
8. **Text style hanya punya mode Desktop dan Mobile.** Belum ada breakpoint atau interpolasi di antara 390 dan 1440. Kode sendiri memakai dua breakpoint berbeda (719 dan 760 px) dan ukuran cair. Perlu keputusan: satu breakpoint (berapa px) atau `clamp()` di antara dua nilai.
9. **Lampu merah S08 hanya dapat 10% scroll section (90–100%).** Dengan 1 state = 1 viewport, itu sekitar 0,3 tinggi layar, terlalu singkat untuk dibaca. Usul: State 4 dapat satu viewport penuh ditambah hold.
10. **06→07 tanpa ring sticky.** Ring 3D di jari harus hilang tanpa fade. Ini hanya bisa dengan render-to-texture ke kartu, atau dengan kartu foto hasil render tangan 3D, yang berarti ring diganti gambar. REVIEW §3 menyebut masalahnya, tetapi belum menyebut kedua opsi teknis ini.
11. **Navbar di 03→04 State B (Figma) menulis "07:10 MORNING"**, tercatat di REVIEW §2. Tambahan: Figma 04→05 A menulis 16:40 AFTERNOON. Ini cocok dengan `.md`, dan dengan aturan G-04 (17:30 EVENING) batas Evening harus ada di antara 16:40 dan 17:30.

## E. Risiko performa dan mobile

- **GPU dan memori.**
  - Canvas WebGL sekarang layar penuh dengan DPR 2 (1,5 di HP).
  - Tangan GLB ≤ 3 MB dengan tekstur kulit kira-kira 20× ukuran ring (150 KB). Harus di-lazy-load menjelang S06 dan dibuang setelahnya.
  - Jejak gerak S06 menambah 2–3 draw ring per frame.
- **Blur.** `filter: blur` pada canvas (03→04) dan `backdrop-filter` blur 60 di atas canvas (kartu S05) sangat mahal di iOS Safari. Perlu cadangan gradient semi-opak untuk mobile.
- **Model panel.** Animasi `clip-path` memicu repaint tiap frame, bukan hanya compositing. Saat sambungan, dua panel layar penuh tampil bersamaan, ditambah foto besar (hero 3840, dinding S02). Ini berisiko jank di HP kelas menengah.
- **Panjang scroll.** Dari `sections.ts` sekarang total ±51 tinggi layar. S07 7,6, S04 5,6, S06 5,6, sedangkan HE-04 meminta maksimal 3–4. Menambah state S08 dan urutan A–C S06 membuatnya lebih panjang.
- **Address bar iOS.** Perubahan tinggi viewport saat address bar muncul atau hilang bisa membuat tepi panel bergetar (kode memakai lvh/svh).
- **Belum ada frame mobile.** Day arc, meja S06 dengan tepi di x 720, dan sumbu simetris S07 x 40–1400 semuanya desktop saja (M-02, Storyboard §6 no. 6). Ini risiko terbesar: build mobile harus menebak.
- **Reduced motion dan cadangan gambar.** Tidak ada cadangan S08. Cadangan S06 A-1b tidak cocok dengan tangan 3D.

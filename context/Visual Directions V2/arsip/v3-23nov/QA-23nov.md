# Stillway — QA live website vs Storyboard, Visual direction & 10 Usability Heuristics

Tanggal cek: 20 Nov 2026 (dicek ulang 16:10; diselaraskan dengan Design & Storyboard 23 Nov) · Live: https://stillway-two.vercel.app/ (desktop 1512×827 dan mobile 390px)
Pembanding: `Storyboard.md` (v3 · 20 Nov), `Moodboard.md`, section **Design** 1440px di Figma (target dev), dan 10 Usability Heuristics (Nielsen).
- Design: https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004245-50
- Board QA: https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004269-1170

**Catatan:** storyboard mengatur alur cerita (urutan, isi state, gerak ring, sambungan). Layout dan visual boleh berubah; acuan tampilan final adalah section Design.

**Prioritas:** P1 = wajib sebelum review klien · P2 = sebaiknya di sprint ini · P3 = polish · Keputusan = perlu keputusan Sans / klien dulu.

**Ringkasan:** 45 temuan — 4 selesai (G-02, HE-05, HE-08, A-04), 41 terbuka: P1: 3 · P2: 25 · P3: 11 · Keputusan: 2. Skor heuristic rata-rata: 3.0 / 5 (sebelumnya 2.7).

## 1. Status per section

| # | Section | Status | Catatan |
|---|---|---|---|
| 01 | Hero | Sudah dibangun | Arah visual sudah benar (storyboard diupdate ke build); sisa: material ring di sambungan 01→02 |
| 02 | Why Stillway | Sudah dibangun | Hampir sesuai; label, underline & transisi teks belum |
| 03 | Sleep summary | Sudah dibangun | Layout dibalik (angka kiri, ring kanan); ring hitam |
| 04 | Activity & rest | Sudah dibangun | Sesuai alur; foto buram & awal section terlalu gelap. Design · 04 diganti layout Day arc (23 Nov); live belum ikut (A-07) |
| 05 | Daily insight | Sudah dibangun | Sesuai alur; daypart & kontras paragraf |
| 06 | Product details | Sudah dibangun | Ring di lantai Sand, belum meja kayu & adegan jatuh (D-02); layout State 4 (D-03); tangan + ring belum natural (D-01) |
| 07 | Specs & benefits | Sudah dibangun | Design diubah 23 Nov (tanpa kartu data & pill, layout simetris, "The everyday."); live belum ikut (S7-01) |
| 08 | Features | Sudah dibangun | State off / lampu merah belum ada (F-01) |
| 09 | The app | Sudah dibangun | Sesuai; Design disamakan dengan live. HP belum di tengah vertikal (G-11) |
| 10 | Finishes & pricing | Sudah dibangun | Sesuai; Design disamakan dengan live. Konten belum di tengah vertikal (G-11); heading 52 → 56 (G-09) |
| 11 | Closing, FAQ & footer | Sudah dibangun | Wordmark footer belum kapital (C-01); heading 52 → 56 (G-09) |

## 2. 10 Usability Heuristics

Skor 1–5 (5 = sangat baik). Kolom Temuan merujuk ke ID di §5.

| # | Heuristic | Skor | Status | Yang sudah baik | Masalah utama | Temuan |
|---|---|---|---|---|---|---|
| H1 | Visibility of system status | 3/5 | Sebagian | Jam & daypart navbar berjalan mengikuti cerita (bagus). | Tanpa state aktif & progres; awal S04 terasa kosong; status lampu off belum terlihat. | HE-01, HE-02, A-02, G-04, F-01 |
| H2 | Match between system and the real world | 4/5 | Baik | Metafora satu hari (06:50 → 06:50) & bahasa sederhana. | Label "Rhythm" tidak sesuai tujuan link; beberapa angka/copy beda dengan storyboard. | HE-03, W-03, A-03, D-01 |
| H3 | User control and freedom | 3/5 | Sebagian | Tombol home/back-to-top & skip link ada. | Section pin panjang, susah melewati cerita. | HE-04 |
| H4 | Consistency and standards | 2/5 | Kurang | Logo, font, navbar theme konsisten. | Material ring berganti-ganti; elemen storyboard belum lengkap; a11y heading/alt; token warna & tipe belum ikut Design. | G-01, H-03, W-02, SL-01, G-06, G-07, G-08, G-11, G-13, C-01, S7-01 |
| H5 | Error prevention | 3/5 | Sebagian | CTA & link navbar sekarang mendarat di section yang sudah dibangun (HE-05 selesai). | Belum ada konfirmasi ukuran sebelum "Choose …" ditekan. | HE-05 ✓ |
| H6 | Recognition rather than recall | 4/5 | Baik | Angka sebelumnya diredupkan di S03; busur foto S04 (yang aktif di puncak) menunjukkan posisi. | Label "WHY STILLWAY" tersembunyi. | W-01 |
| H7 | Flexibility and efficiency of use | 3/5 | Sebagian | Focus ring terlihat (outline ochre); skip link; reduced-motion CSS ada. | Tidak ada deep link per section; versi mobile belum diputuskan. | HE-06, M-02 |
| H8 | Aesthetic and minimalist design | 3/5 | Sebagian | Satu ide per layar, palet tenang, tipografi kuat. | Teks crossfade bertabrakan, transisi terlalu banyak fade, foto buram, kontras rendah. | G-03, G-10, G-12, W-04, A-01, A-05, A-06, A-07, I-01, I-02, I-03, SL-02, M-01, D-02, D-03 |
| H9 | Help users recognize, diagnose, and recover from errors | 2/5 | Kurang | Ada gambar fallback bila 3D gagal dimuat. | 404 bawaan Vercel tanpa jalan kembali yang jelas. | HE-07 |
| H10 | Help and documentation | 2/5 | Kurang | FAQ 6 pertanyaan dan teks sizing kit sudah ada (HE-08, G-02 selesai). | Penjelasan lampu merah/off belum ada di S08. | F-01, HE-08 ✓, G-02 ✓ |

## 3. Sudah diputuskan

- Hero: arah visual live (foto pagi + wordmark raksasa + ring 3D di atas batu) sudah benar. Storyboard, moodboard & dokumen sudah diupdate ke build (20 Nov).
- Design S07, S09, S10, S11 disamakan 1:1 dengan layout live (20 Nov); warna tetap mengikuti Design.
- S06: ring menggelinding di meja kayu pinus terang, tepi meja di tengah layar, lalu jatuh ke tangan (D-02). State 4 teks atas, aset bawah (D-03).
- S08: tambah State 4 "off / baterai habis" dengan lampu merah di jendela sensor bawah (F-01).
- Wordmark besar hero & footer selalu kapital "STILLWAY" (C-01).
- Layout rata tengah: pusat konten di tengah antara bawah navbar dan bawah layar (G-11).
- Tipografi & warna (23 Nov): text style format template (Display/Heading Geist Medium, letter spacing px) dan variable 🌈 Primitive / 🎨 Token Color; Cocoa lebih cokelat (Night #1B0B06, Cocoa #341C12); text-surface solid Neutral/600 (G-09, G-13).
- Hero (23 Nov): daftar fitur memakai ikon Icon Base (moon, workout-run, sparkles) menggantikan bullet lingkaran.
- S04 (23 Nov): layout Day arc (Opsi A) dipilih dan diterapkan di Design & Storyboard (A-07, A-04 selesai).
- Aksen tetap Ochre (23 Nov); eksplorasi aksen pengganti ditutup.
- S07 (23 Nov): kartu data dan pill "MADE FOR EVERY HOUR" dihapus; layout simetris di sumbu y 482; penutup "The everyday." (S7-01).

## 4. Perlu diputuskan

1. Sleep: pertahankan angka kiri / ring kanan seperti live? (SL-01)
2. Satu material ring untuk semua section (silver) — gold/black hanya di S10. (G-01)
3. Label "Simulated data" di S03, S05, S09: hapus seperti di S07, atau pertahankan. (G-12)

## 5. Temuan


### Global

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| G-01 | P1 | H4 | Visual | Ring tidak konsisten antar section | Material ring berganti: S01 gold dengan refleksi moss, S02 silver, S03 hitam/gunmetal, S05 champagne. | Satu ring yang sama (silver, inner hitam matte, logo tone-on-tone) di semua section. Yang berubah hanya cahaya per section. Finish lain hanya di S10. |
| G-02 | ✓ Selesai | H10 | Storyboard | Section 06–11 masih placeholder | Dicek ulang 20 Nov 16:10: S06–S11 sudah dibangun, tidak ada placeholder lagi. | Bangun 1:1 dari frame Design · 06–11 (state di kanan tiap section). |
| G-03 | P2 | H8 | Visual | Teks crossfade saling menumpuk | Saat scroll di antara state, kalimat lama dan baru tampil bersamaan dan hurufnya bertabrakan (S02 kalimat 1→2; di mobile juga S03 23:10 di atas bayangan 7h 12m). | Kalimat lama selesai memudar dulu (±40% jarak) baru kalimat baru masuk, atau geser vertikal 24–40px supaya tidak menumpuk. |
| G-04 | P2 | H1 | Copy | Daypart navbar belum pas di 17:30 | 17:30 tertulis AFTERNOON. | 17:30 EVENING. Urutan: 06:50 MORNING → 07:10 → 23:10 LAST NIGHT → 07:40–10:30 MORNING → 12:30 MIDDAY → 15:30 AFTERNOON → 17:30 EVENING → 21:00/22:00 NIGHT → 06:50 TOMORROW. |
| G-06 | P2 | H4 | Teknis | Favicon & share image belum brand | Favicon = ikon panah/kursor oranye (#C6613F). Tidak ada og:image / twitter card. | Favicon dari wordmark/huruf "S" (Ink/Paper). Tambah og:image 1200×630 (hero) + og:title/description. |
| G-07 | P3 | H4 | Teknis | Heading H2 tanpa spasi | H2 terbaca "Activityand rest." (span tanpa spasi) dan "Everything it noticed.One calm view.". | Tambah spasi/line-break yang terbaca screen reader (mis. <br> + spasi atau aria-label). |
| G-08 | P3 | H4 | Teknis | Alt text gambar dekoratif | Beberapa img tanpa atribut alt (bg hero, wall, shadow). | Gambar dekoratif pakai alt="" eksplisit; foto S04 sudah punya alt (bagus). |
| G-09 | P2 | H4 | Visual | Ukuran font belum ikut skala tipe | Title & paragraf memakai banyak ukuran berbeda (mis. 44/48/56/65 untuk judul, 14/15/17/18 untuk body). S10 "Turn it yourself." & S11 "Questions, briefly." 52px, "see your night." 158px. Caption S07 dan pernyataan S11 ditulis kapital (CSS uppercase) dengan font sans. | Semua teks memakai text style (Moodboard.md §3.1, format template, font Geist / Geist Mono): Display 2 (160) hanya untuk big text, Display 1 wordmark 275, Display 4 metrik 72 (Display dan Heading Geist Medium), Heading 1 56, Heading 2 32, Heading 3 24, Paragraph Large–X-Small 20/16/14/12, Label Large–X-Small 20/16/15/12, Buttons Medium/Small 16/15, Mono 16/13/11. Pakai variable 🆃 Typography (Size, Line Height, Letter Spacing dalam px; display_1 … mono_xs; desktop/mobile) sebagai token CSS. Kapital hanya untuk label Mono dan wordmark; caption S07 dan "Sleep on it…" S11 sentence case (Design 23 Nov). |
| G-10 | P2 | H4 | Visual | Grid, margin & spacing belum konsisten | Jarak antar elemen dan posisi atas konten berbeda di tiap section. | Grid 12 kolom (margin 40 · kolom 84 · gutter 32), konten rata atas mulai y 144, baris bawah berakhir y 860, spacing kelipatan 4/8 (Moodboard.md §6.0). |
| G-12 | Keputusan | H8 | Copy | Label "Simulated data" di beberapa section | Label kecil "Simulated data" / "SIMULATED DATA" ada di S03, S04, kartu S05, S09; footer sudah menulis "All app data is simulated." | Sudah dihapus di S07 dan eksplorasi S04 (lebih bersih). Putuskan: hapus juga di S03, S05, S09 (cukup footer), atau pertahankan. |
| G-13 | P2 | H4 | Teknis | Token warna build belum ikut Design | Build masih memakai warna lama: Night #160E09, Cocoa #2B201A, Stone = Ink 65% (opacity). | Pakai token variable Figma (Foundation · 🌈 Color Palette / 🎨 Token Color System; salinan teks di `Moodboard.md` §2.7–2.8): Night #1B0B06 (cocoa/950), Cocoa #341C12 (cocoa/900), skala Cocoa baru, text-surface = Neutral/600 #6B655F (solid). Nama token CSS mengikuti 🎨 Token Color. |
| G-11 | P2 | H4 | Visual | Konten layout tengah belum di tengah vertikal | S09: HP terlalu dekat ke navbar (atas ±35px, bawah ±60px). S10: judul + panel atas ±37px, bawah ±110px (1512×827). | Pusat konten utama di tengah antara bawah navbar dan bawah layar (Design 1440×900: y 482), jarak atas = jarak bawah. Berlaku untuk semua layout rata tengah: ring S01–S02, S03 & S08 State 1, S07 State 1–2 & 7, S09, S10, S11 State 1. Footer/progress tetap menempel di bawah (y 860). |

### S01 Hero

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| H-03 | P1 | H4 | Visual | Ring gold → silver di sambungan 01→02 | Di akhir hero (scroll ±2400) ring berubah material dari gold ke silver. | Material sama dari awal; frame akhir hero = frame awal S02 (ring silver, ukuran sama). Lihat Design · 01 State 4. |

### S02 Why

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| W-01 | P2 | H6 | Visual | Label "WHY STILLWAY" tidak terlihat | Label hanya sr-only (1×1 px). | Tampilkan label mono kecil di State 1 (lihat Design · 02 State 1). |
| W-02 | P2 | H4 | Visual | Underline ochre di State 4 belum ada | "keeps the pattern." tanpa garis. | Underline ochre 4px di bawah "pattern." (Design · 02 State 4). |
| W-03 | P3 | H2 | Copy | Paragraf beda tipis dengan storyboard | "Sleep, heart rate and temperature already move in a daily pattern, whether you look or not." | Pakai copy live (lebih enak dibaca); storyboard ikut diupdate. |
| W-04 | P2 | H8 | Visual | Transisi 02 → 03 terlalu banyak fade | Teks fade out, background Paper → Night cross-fade, dan ring berganti material (silver → hitam): terasa putus. | Ring sticky (material sama), panel Night naik dari bawah dengan tepi lurus, konten 02 ikut naik keluar; cahaya ring meredup sampai rim light. Lihat `Storyboard.md`. |

### S03 Sleep

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| SL-01 | Keputusan | H4 | Storyboard | Posisi ring & angka terbalik dari storyboard | Angka di kiri, ring di kanan (terpotong tepi). | Storyboard: ring kiri, angka kanan. Rekomendasi: pertahankan live (lebih mudah dibaca), storyboard diupdate. |
| SL-02 | P2 | H8 | Visual | Cahaya ring terlalu terang di State 1 | Ring tampil penuh seperti product shot. | Hanya tepi ring terkena cahaya dingin dari satu sisi; sisanya tenggelam di Night. |

### S04 Activity

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| A-01 | P1 | H8 | Teknis | Foto aktif buram (resolusi rendah) | Sumber foto 281×399 px ditampilkan ±857 px device (≈3× upscale). | Export minimal 900×1260 (2×) AVIF/WebP untuk foto aktif; thumbnail boleh tetap kecil. |
| A-02 | P2 | H1 | Visual | Awal section terlalu lama gelap | Di scroll ±10800 layar hampir hitam, judul & foto 07:40 masih sangat redup. | Foto 07:40 sudah aktif di 0% section; pudar masuk maksimal ±15% jarak scroll. |
| A-03 | P3 | H2 | Copy | Durasi status beda dengan storyboard | 07:40 25 min walk, 10:30 15 min stretch. | Ikuti build (storyboard diupdate ke angka build). |
| A-04 | ✓ Selesai | H4 | Visual | Filmstrip tidak di tengah & jarak tidak rata | Digantikan layout Day arc (A-07); filmstrip tidak dipakai lagi. | Lihat A-07. |
| A-05 | P2 | H8 | Visual | Transisi 03 → 04 terputus | Angka hilang, ring keluar, lalu filmstrip muncul: malam dan pagi tidak tersambung. | Ring sebagai lensa: ring menghadap kamera, pagi 07:40 terlihat lewat lubangnya, lalu kamera menembus lubang dan lingkaran jadi foto aktif di puncak busur (Design · 03 → 04, `Storyboard.md`). |
| A-07 | P2 | H8 | Visual | Layout S04 belum ikut Design baru (Day arc) | Filmstrip 5 foto, foto aktif 432×612, jam & status kiri bawah, daftar jam kanan bawah, "Simulated data". | Ikuti Design · 04 & `Storyboard.md` 04 (Opsi A dipilih 23 Nov): 5 foto di busur (R 1340, pusat 720/1758, 12° per foto), foto aktif 264×352 di puncak, jam Display 4 + status satu baris di bawahnya, foto + jam berpusat di y 482; busur berputar mengikuti scroll (scrub), digit jam bergulir. Tanpa counter, daftar jam, "Simulated data". |
| A-06 | P2 | H8 | Visual | Transisi 04 → 05 belum menyatu | Foto terakhir memudar, lalu ring muncul bersama panel Dusk: terasa dua adegan terpisah. | Gaya Viture: konten S04 naik keluar, layar gelap, ring muncul dari bawah dengan rim light lalu berhenti di posisi S05 (Design · 04 → 05). |

### S05 Insight

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| I-01 | P2 | H8 | Visual | Paragraf di bawah kartu kontras rendah | Paragraf ±30% opacity di atas Dusk gelap, sulit dibaca (gagal WCAG AA). | Naikkan ke ≥65% opacity atau hapus; kartu app tetap fokus. |
| I-03 | P2 | H8 | Visual | Kartu insight terlalu kecil dan datar | Kartu ±360 px melayang di lubang ring yang besar, hierarki lemah, teks kecil, terasa seperti placeholder. | Kartu kaca 432 px (kolom 5–8): tag pill, angka 7h 12m, line chart semalam, jam settled/up, satu kalimat insight; background blur halus + cahaya hangat di belakang (Design · 05 State 3–4, referensi Viture Pro 2). Sudah diperbaiki di Design. |
| I-02 | P3 | H8 | Visual | Teks menimpa ring di State 2 | "Everything it noticed. One calm view." redup di atas ring macro. | Storyboard: teks bergeser ke pinggir. Beri jarak dari ring / pudar penuh sebelum kamera masuk lubang. |

### S06 Details

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| D-02 | P2 | H8 | Visual | Ring belum menggelinding di meja kayu & jatuh dari tepi | Ring berdiri di lantai Sand polos di kanan-tengah dan hanya berputar di tempat (State 1–3); tidak ada meja dan adegan jatuh. | Meja kayu pinus terang (tekstur dari foto referensi Sans), tepi kanan meja tepat di tengah layar (x 720). Ring menggelinding dari kiri → sampai tepi → miring jatuh → masuk ke jari tangan yang naik dari bawah (Design · 06 State 1–3 dan A–B). |
| D-03 | P2 | H8 | Visual | Layout State 4 belum "teks atas, aset bawah" | "Then, it just fits." di kiri, foto tangan + ring di kanan. | Teks rata tengah di atas (pola Oryzo), tangan naik dari bawah di tengah; tag [ SILVER ] di samping jari (Design · 06 State 4 / C). |
| D-01 | P3 | H2 | Visual | Ring di jari belum realistis & natural | Foto tangan + ring masih terlihat tempelan (komposit): bayangan, oklusi jari, dan perspektif belum natural. Catatan Sans: storytelling-nya sudah bagus. | Tangan naik dari bawah, ring berputar sambil jatuh ke jari (Design · 06 State A–C, Storyboard "Detail State 4"). Saat final, ring dirender realistis: bayangan kontak, jari menutupi sisi belakang ring, perspektif sama dengan foto. |

### S07 Specs

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| S7-01 | P2 | H4 | Visual | Layout S07 belum ikut Design 23 Nov | Kartu data [ BATTERY ] / [ SIZE ] / [ WEIGHT · THICKNESS ] / [ WATER RATING ] + "Simulated data", pill "MADE FOR EVERY HOUR", caption tersebar, chip "Ring shown where it's worn." | Ikuti Design · 07 & `Storyboard.md` 07: tanpa kartu data & pill; State 3–6 simetris di sumbu y 482 (kiri: judul di atas garis + kalimat di bawah; kanan: counter di atas + spesifikasi & catatan di bawah, rata kanan; garis penuh x 40–1400); State 7 "The everyday." satu baris (Display 2) + satu baris caption, berpusat di y 482. Gerak mengikuti Obsidian Assembly. |

### S08 Features

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| F-01 | P2 | H1 | Visual | State "off / baterai habis" belum ada | Hanya satu baris kecil "Red means it's off." di bawah legenda; lampu tidak pernah merah. | State 4: "Red means it's off." + "When the battery runs out, one small red light shows in the lower sensor window."; lampu merah kecil di jendela sensor bawah, hijau/biru/ungu meredup (Design · 08 State 4). |

### S11 Closing

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| C-01 | P3 | H4 | Visual | Wordmark footer belum kapital | Wordmark besar di footer tertulis "Stillway" (huruf kecil), beda dengan hero "STILLWAY". | "STILLWAY" kapital, Geist Medium, selebar layar (x 40–1400), sama dengan wordmark hero; hover shine tetap (Design · 11 State 4). |

### Mobile

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| M-01 | P2 | H8 | Visual | Mobile (390px): tumpukan teks saat transisi | S02 dan S03 di mobile menampilkan kalimat lama & baru bersamaan. | Sama dengan G-03; cek ulang semua section yang di-pin di 390px. |
| M-02 | P3 | H7 | Storyboard | Versi mobile S02–S10 belum diputuskan | Belum ada keputusan section mana yang tetap pin. | Lihat `Storyboard.md` §6 no. 6; buat frame mobile setelah desktop final. |

### UX · Heuristic

| ID | Prioritas | Heuristic | Tipe | Temuan | Live sekarang | Seharusnya |
|---|---|---|---|---|---|---|
| HE-01 | P2 | H1 | UX | Navbar tidak menunjukkan posisi (tanpa state aktif) | Saat scroll, tidak ada link navbar yang aktif; user tidak tahu sedang di bab mana. | Pill aktif per bab: Rhythm (S02–S05), The ring (S06–S08), The app (S09), Finishes (S10), FAQ (S11). |
| HE-02 | P2 | H1 | UX | Tidak ada indikator progres di halaman ±43 layar | Halaman sangat panjang (±27.000 px), satu-satunya penanda hanya jam navbar. | Progress tipis di navbar atau penanda "01 / 11" di pojok; pola footer progress S09 bisa dipakai global. |
| HE-03 | P3 | H2 | UX | Link "Rhythm" mendarat di layar tanpa konteks | Klik Rhythm → S03 State 1 yang hanya berisi ring di layar gelap, tanpa judul. | Arahkan ke awal S02 atau ke state yang sudah ada judulnya ("Last night, in one view."). |
| HE-04 | P2 | H3 | UX | Section di-pin terlalu panjang | Beberapa section butuh banyak scroll untuk 1 perubahan (hero ±3 layar, S04 ±6 layar) dan tidak bisa dilewati selain lewat navbar. | Maksimal ±3–4 tinggi layar per section; setiap scroll terasa menghasilkan perubahan; anchor navbar selalu mendarat di awal section. |
| HE-05 | ✓ Selesai | H5 | UX | CTA & link navbar berujung ke placeholder | Dicek ulang 20 Nov 16:10: "Find your size" → #finishes, The ring → #details, The app → #app, FAQ → #faq; semua sudah dibangun. | Selama belum dibangun: sembunyikan/disable link yang belum ada, atau arahkan CTA ke section yang sudah jadi. Final: ikuti Design S06–S11. |
| HE-06 | P3 | H7 | UX | URL tidak berubah saat pindah section | Klik anchor tidak mengubah hash (#sleep, #finishes); section tidak bisa dibagikan/di-bookmark. | Update hash (history.replaceState) per section dan dukung deep link saat halaman dibuka. |
| HE-07 | P3 | H9 | UX | Halaman 404 masih default Vercel | URL salah (mis. /size-guide) menampilkan 404 hitam bawaan Vercel. | 404 bergaya Stillway (Night + wordmark) dengan satu tombol kembali ke awal. |
| HE-08 | ✓ Selesai | H10 | UX | Belum ada bantuan sebelum membeli | Dicek ulang 20 Nov 16:10: S10 punya teks sizing kit, S11 punya FAQ 6 pertanyaan. Sisa penjelasan lampu merah → F-01. | Link "Free sizing kit" di dekat pilihan ukuran (S10), FAQ singkat di S11 (Sizing, Compatibility, Battery, Returns, lampu merah). |

## 6. Catatan untuk dev

- Section 06–11 sudah dibangun; revisi berikutnya mengikuti frame **Design · 06–11** (setiap section punya state di sebelah kanan). Teks di Design adalah teks asli, warna pakai variable `🎨 Token Color` (format template, alias ke `🌈 Primitive Color`; Moodboard.md §2.8), navbar pakai komponen `Nav` (Theme Dark/Light + jam & daypart).
- Ring di Design S01, S03, S05 masih memakai render dari build sekarang (gold / hitam / champagne) sebagai acuan posisi. Setelah G-01 diputuskan, materialnya diganti satu ring silver yang sama.
- Foto tangan S06 dan render ring di jari masih placeholder (D-01); tekstur meja kayu sudah ada di Figma. Daftar aset di `Storyboard.md` §4.
- Dokumen `UPDATE-SITUS-IKUT-STORYBOARD.md` (19 Nov) sudah usang dan diarsipkan; pakai `Storyboard.md` + dokumen ini.
- Logo = wordmark "Stillway" saja (teks) di navbar; wordmark besar hero & footer kapital "STILLWAY". Tanpa ring mark/ikon.
- Angka bertanda `*` dan label "Simulated data" = contoh, bukan data produk.
- Yang sudah baik dan perlu dipertahankan: skip link, focus ring ochre, reduced-motion CSS, gambar fallback 3D, alt text foto S04, kartu app S05 sebagai UI asli.

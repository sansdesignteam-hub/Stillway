# D-181 Developer: plate foto + proxy alas tak terlihat, latar resolusi tinggi

Aset 3D: 3D-Designer `52e750c` (`design/3d/v2/plate/`, `s01-pedestal-pose.json`). Build `npm run build` berhasil.

## Yang dikerjakan
- **Latar = plate.** `web-v2/scripts/hero-plate.mjs` membuat set AVIF + WebP dari master PNG 3D Designer. Drop baru dengan nama file sama cukup menjalankan ulang skrip; kode tidak berubah.
- **`<picture>`/`srcset`/`sizes`**: desktop 1280/1920/2560/3632 dengan `sizes="max(114vw, 200lvh)"` (lebar foto di layar saat diam = cover × zoom 1,14). Ponsel memakai plate ponsel sendiri (alas 0,62× dirender langsung oleh 3D Designer): ponsel potret mengambil potongan tengah 50% (908/1280/1816, tinggi penuh 2072), jendela sempit non-potret mengambil frame penuh (960/1280/1920).
- **First paint**: versi 960 (AVIF 28 KB) di-preload dan tampil sebagai latar CSS, lalu digantikan ukuran yang cocok. Poster ring ikut di-preload pada ukuran yang cocok (`imagesrcset`).
- **Proxy alas**: `s01-pedestal.glb` dipakai tanpa material. Satu pass depth (`colorWrite=false`, `renderOrder −2`) untuk oklusi ring, satu catcher bayangan PCSS di geometri yang sama (atas, bibir, sisi) dan di bidang meja. Proxy tidak menjatuhkan bayangan.
- **Tanpa gelap ganda**: catcher di alas ditimbang dengan n·l lampu kunci (sisi kiri/depan tidak kena lampu, jadi hampir tidak digelapkan); catcher meja dikalikan dengan mask analitik bayangan alas sendiri (prisma persegi-bulat sepanjang arah lampu), karena bayangan alas sudah ada di plate.
- **Dihapus**: material oak, tint, env alas, contact shade/AO alas buatan web, `fb-s01-pedestal-alpha.webp`, `hero-warm-desk-v2-*.webp`. Contact shade kecil **ring → alas** tetap ada (ring tidak ada di plate).
- **Poster**: `ring-s01*` (ring + bayangan ring, transparan) di atas plate. Versi ponsel dirender di framing ponsel, jadi CSS scale/translate poster dihapus.
- **Kepadatan bayangan** diukur dari alpha overlay 3D Designer: meja 0,80, atas alas 0,80, sisi 0,10 (`CATCH` di `stage.ts`; JSON bisa menimpa lewat `desk.catcher_opacity`, `pedestal.catcher_opacity`, `pedestal.catcher_side_opacity`). Warna catcher tidak lagi lewat tone mapping, supaya sama persis dengan `#2A1608` di overlay.

## Ukuran file (`D181_file_sizes.json`)
| File | AVIF | WebP | Anggaran AVIF |
| --- | --- | --- | --- |
| plate-s01-960 | 28,2 KB | 30,4 KB | |
| plate-s01-1280 | 46,1 KB | 53,2 KB | |
| plate-s01-1920 | 88,7 KB | 104,9 KB | |
| plate-s01-2560 | **140,5 KB** | 163,6 KB | ≤ 250 KB |
| plate-s01-3632 | **266,7 KB** | 287,2 KB | ≤ 450 KB |
| plate-s01-mp-1816 (ponsel potret) | 72,7 KB | 70,5 KB | |
| ring-s01-3632 / -1920 (poster) | 54,9 / 30,2 KB | 233 / 97,9 KB | |

Semua AVIF pada kualitas 70 (batas atas skrip); tidak ada yang perlu diturunkan untuk masuk anggaran. Lebar terbesar 3632 px (sumbernya 3632, bukan 3640; tidak di-upscale).

Yang diunduh (Chrome, dicek dari network): 1440@1x → plate 1920; 1440@2x → plate 3632; 375@3x → potongan potret 1816; 700×500@1x → plate ponsel 1280.

## Bukti
- `D181_1440_1x_vs_figma.jpg`, `D181_1440_2x_vs_figma.jpg`: web vs Figma `40004725:5602`.
- `D181_pedestal_closeup_poster_live_figma.jpg`: close-up alas, poster | 3D hidup | Figma.
- `D181_375_live_vs_3d_still.jpg`: 375 hidup vs still ponsel 3D Designer. Tidak ada frame Figma 375 di repo, jadi tidak ada perbandingan Figma untuk ponsel.
- `D181_sharpness_1440_2x_old1818_vs_plate3632.jpg`: kiri = file lama 1818 px di-resample ke framing 1440@2x (simulasi bicubic, bukan screenshot build lama), kanan = screenshot build ini.
- `D181_onion_poster_vs_live_1440.jpg`, `_375.jpg`: poster | hidup | 50/50 | selisih ×4.
- `D181_frames_1440.jpg`, `_375.jpg`: u 0 → 3 (teks keluar, zoom, keluar ke S02).
- `D181_tilt_strip.jpg`, `D181_clearance_check.txt`, `D181_wordmark_ring_bbox.txt`, `D181_perf.txt`.

## Terbukti
- Siluet alas plate dan proxy berimpit; ring, alas, dan bayangan poster berimpit dengan frame 3D (onion-skin 1440 dan 375).
- Clearance dan bbox wordmark **sama persis dengan D-180c** (jarak 36 px, ring tidak pernah menembus alas).
- Area bayangan tanpa ring, poster vs hidup (rata-rata 8-bit): meja kiri 39,2 vs 39,9; atas alas kiri 118,5 vs 120,0; bawah ring 58,8 vs 59,6.
- fps 1440: diam 59,6–59,7, tilt 57,8–58,2. 375: 60 / 60.

## Belum cocok / catatan jujur
- **Bentuk bayangan di atas alas** tidak identik dengan Cycles: selisih ×4 memperlihatkan pita di tepi depan bayangan (PCSS satu arah vs lampu area). Di pita itu bayangan hidup menjangkau sedikit lebih jauh ke depan daripada Cycles: 97 vs 107 pada satu sampel (css 450–600 × 710–750), dan angkanya tidak berubah saat `side` diturunkan dari 0,13 ke 0,10, jadi ini soal bentuk bayangan, bukan kepadatan. Penyebabnya belum dicari.
- **Ring hidup lebih putih/terang** daripada ring poster Cycles (sudah begitu sejak D-179; tidak disentuh di tugas ini). Cross-fade poster → 3D karena itu masih terlihat pada ring, tidak pada alas.
- **fps dengan CPU throttle 4×** tidak stabil di mesin ini: tiga kali jalan memberi diam 60 / 55 / 49 dan tilt 55 / 4,8 / 59. Satu kali ada jeda 1,35 detik. Mesin sedang dipakai render Cycles; penyebabnya belum dipastikan, jadi angka throttle belum bisa dipakai sebagai bukti.
- Saat ring terangkat (u ≈ 0,5), contact shade oval ring masih terlihat memudar di atas alas (perilaku D-179, tidak diubah).
- Alas di Figma lebih dalam, sudut lebih bulat, oak lebih hangat. Itu bagian drop D-181b dari 3D Designer; web tinggal menjalankan ulang skrip dan menyalin JSON + GLB.
- `context/decisions.md` belum saya ubah: D-181 adalah brief PM, belum ada persetujuan pengguna atas hasilnya.

---

# D-181b: drop 3D-Designer `0742ce3` (alas dan ring dicocokkan ke Figma)

## Yang dikerjakan
- GLB + JSON disalin, `hero-plate.mjs` dijalankan ulang pada plate/overlay baru. Tidak ada perubahan kode untuk aset; `pedestal.position`, `top_y`, `size_mm`, `s01_scale` dibaca dari JSON. Satu perbaikan: pemeriksaan clearance (`?inspect`) sekarang menghitung alas yang tidak lagi di titik asal.
- Lampu spill plate **tidak** ditambahkan di web.
- `heroBg.ringLeft` diukur ulang: 0,3897 → **0,3957** (532 px pada 1440×900, 731 px pada 1920×1080, tilt maksimum termasuk). `wordGap` 36 → 33.
- Kepadatan bayangan ring (`CATCH`) diukur ulang dari overlay baru: meja 0,55, atas alas 0,34, sisi 0,15 (sebelumnya 0,80 / 0,80 / 0,10). Bayangan lebih tipis karena spill plate tidak dihalangi ring. Contact shade ring 0,85 → 0,45.
- Nada ring hidup: porsi env paper di meja 0,35 → 0,6 dan gain env ring 1,6 → 1,85.

## Hasil terukur
- **Ukuran file**: AVIF 2560 = 142,0 KB (≤ 250), 3632 = 269,6 KB (≤ 450), 1920 = 89,1 KB, 960 = 28,5 KB, potret ponsel 1816 = 74,7 KB; poster ring AVIF 3632 = 48,2 KB (`D181b_file_sizes.json`).
- **Wordmark 1440×900**: 145,1 → **149,6 px**, jarak bbox 33 px. 193,59 px baru tercapai pada 1920×1080 (jarak 97 px). Pada 1440×900 ukuran Figma tidak bisa dicapai dengan aturan bbox: lebar "Stillway" 193,59 px berakhir di x 634, sedangkan tepi kiri bbox ring (dengan tilt) di x 532. Figma sendiri menumpuk ring di atas huruf "ay".
- **Clearance**: diam −0,0002 mm (0,2 µm, pembulatan posisi JSON), minimum setelah lepas 0,0000–0,0082 mm; tidak ada tembus yang terlihat (`D181b_clearance_check.txt`).
- **fps, tiga kali jalan, Blender diam** (`D181b_perf.txt`): 1440 diam 60,2–60,3 / tilt 60,2–60,3; **throttle CPU 4× diam 60,0–60,3 / tilt 60,0–60,1**; 375 60 / 60. Jeda pada pengukuran D-181 tidak muncul lagi.
- **Nada ring, poster vs hidup** (rata-rata RGB semua piksel ring pada 1440@2x): poster 133 / 119 / 109; hidup sebelum 102 / 90 / 81, sesudah 108 / 98 / 89.
- **Bayangan atas alas** (kiri ring, tanpa ring): poster 96,8, hidup 99,2 (plate tanpa bayangan 126,6).

## Belum cocok
- Ring hidup masih ±19% lebih gelap dari poster pada rata-rata: liner dalam lebih gelap dan pita depan bawah netral putih, sedangkan poster hangat di sana. Pita luar atas sekarang dekat. Cross-fade masih terlihat pada ring.
- Bayangan ring di **meja kiri-depan** lebih tipis di web: poster menggelapkan 11 tingkat, hidup 5–6 (39,7 vs 45,2). Menaikkan opacity meja 0,44 → 0,55 hampir tidak mengubahnya, jadi penyebabnya bukan kepadatan; kemungkinan mask bayangan alas atau penumbra jauh, belum diperiksa.
- Di Figma ada bayangan kontak gelap di bawah ring; di still Cycles dan di web bayangan itu tipis. Web mengikuti still, sesuai tugas.
- Tidak ada frame Figma 375; 375 dibandingkan dengan still ponsel 3D Designer.

Bukti: `D181b_1440_2x_vs_figma.jpg`, `D181b_onion_figma_vs_live_1440.jpg`, `D181b_onion_poster_vs_live_1440.jpg` / `_375.jpg`, `D181b_375_live_vs_3d_still.jpg`, `D181b_pedestal_closeup_poster_live_figma.jpg`, `D181b_frames_1440.jpg` / `_375.jpg`, `D181b_tilt_strip.jpg`.

---

# D-181c: polish (nada ring, kontak, bayangan meja)

## 1. Nada ring (hidup vs poster, piksel ring)
- Hanya saat ring berdiri di alas (mengikuti `rest`, memudar saat ring terangkat; close-up dan S02 tidak berubah): exposure ring ×1,9, pantulan env pada liner ×0,3, pita sedikit lebih hangat (×1 / 0,94 / 0,90).
- Rata-rata RGB semua piksel ring, hidup ÷ poster (`D181c_ring_tone_before_after.txt`):

| | R | G | B |
| --- | --- | --- | --- |
| 1440@2x sebelum (`fe96176`) | 0,814 | 0,823 | 0,816 |
| 1440@2x sesudah | **0,984** | **1,004** | **1,006** |
| 375@3x sesudah | 0,995 | 1,032 | 1,050 |

- Yang belum cocok: distribusinya. Piksel yang gelap di poster 37–63% lebih terang di web (liner dan pantulan gelap di pita), piksel yang terang di poster 15–18% lebih gelap. Rata-ratanya cocok, kontras ring hidup lebih rendah daripada poster. Pada 375 kanal biru 5% di atas poster (target ±3% tidak tercapai di kanal itu).

## 2. Kontak ring → alas
- Inti kontak gelap dan sempit ditambahkan di bawah bagian pita yang menyentuh sisi atas, dihitung dari vertex ring pada pose frame itu (termasuk hover tilt), ditambah oval lembut yang sudah ada. Keduanya memudar saat ring terangkat (hilang 1,5 mm di atas alas).
- `D181c_contact_closeup_before_after_figma.jpg`, `D181c_tilt_contact_strip.jpg` (kontak mengikuti tilt).
- **Untuk 3D Designer:** overlay poster belum punya kontak gelap ini (bayangannya tipis), jadi saat cross-fade poster → hidup kontaknya muncul. Overlay perlu kontak yang sama. Kontak di Figma masih lebih besar dan lebih gelap daripada versi web; sebagian besar karena sisi bawah ring Figma memantulkan gelap.

## 3. Bayangan meja kiri-depan
- **Penyebab:** bukan jangkauan catcher atau PCSS. Bentuk bayangan hidup dan Cycles berimpit. Di plate ada lampu spill kedua; di area yang tertutup alas dari lampu itu (kiri-depan), lampu kunci menjadi satu-satunya cahaya, sehingga bayangan ring di still lebih pekat di sana (alpha overlay 0,70–0,74 vs 0,40–0,45 di tempat lain).
- **Perbaikan:** catcher meja sekarang memakai mask analitik kedua (bayangan alas dari arah lampu spill) untuk menaikkan kepadatan hanya di area itu (0,80 vs 0,50). Tidak ada lampu yang ditambahkan.
- Hasil (sampel meja kiri, poster vs hidup; plate tanpa bayangan 51,0): sebelum 39,7 vs 45,2; sesudah 39,7 vs **42,7**. Selisih turun dari 5,5 ke 3,0 tingkat, belum nol. Arah dan penumbra lampu spill saya setel dengan mata terhadap still (posisi lampu hanya ada sebagai teks di JSON).
- Sisi depan alas: `side` 0,15 → 0,10.

## Lain-lain
- fps dua kali jalan: 60,1–60,4 di semua kondisi termasuk throttle 4× (`D181c_perf.txt`). Clearance tidak berubah (`D181c_clearance_check.txt`).
- Bukti: `D181c_onion_poster_vs_live_1440.jpg`, `_375.jpg`, `D181c_frames_1440.jpg`.

---

# D-181d: final (3D-Designer `82f67c3` + `4cbf9fd`)

Overlay/still baru disalin dan `hero-plate.mjs` dijalankan ulang; plate, GLB tidak berubah, JSON kini berisi `lights.spill`.

## 1. Bayangan meja: model lampu spill dari JSON
- Mask yang disetel dengan mata diganti model fisik di catcher: `alpha = K / (K + S + A)`. K = lampu kunci (n·l), S = lampu spill di titik itu dari `lights.spill` (nilai hadap 2,374 × (d0/d)² × cos, nol di tempat alas menutupinya, penumbra dari disk Ø60 mm), A = ambient. Hanya A yang disetel: meja 0,15, atas alas 0,58. Tidak ada lampu yang ditambahkan; ring tidak diterangi spill.
- Hasil (`D181d_shadow_regions.txt`, rata-rata 0–255, plate tanpa bayangan → poster → hidup):

| Area | Plate | Poster | Hidup |
| --- | --- | --- | --- |
| Meja kiri-depan | 51,0 | 39,7 | 42,4 |
| Meja kiri jauh | 47,7 | 40,3 | 44,0 |
| Meja strip depan | 50,0 | 38,0 | 38,3 |
| Atas alas, kiri ring | 126,6 | 95,7 | 97,8 |
| Atas alas, ujung kanan | 139,4 | 49,3 | 52,3 |
| Atas alas, kiri-depan | 121,6 | 66,7 | 57,5 |

- **Belum tertutup:** meja kiri-depan masih 2,7 tingkat lebih terang dari poster (awal 5,5), kiri jauh 3,7. A fisik dari overlay adalah 0,29; saya memakai 0,15 untuk mengimbangi penumbra PCSS yang melebar jauh dari ring, jadi ini kompensasi, bukan angka terukur.

## 2. Kontak ring → alas
- Dua oval datar diganti oklusi di dalam catcher alas: jarak 3D ke strip pita yang menyentuh sisi atas (dari vertex per frame, mengikuti tilt), alpha 1 dalam ±2 mm, hilang di ±11,5 mm, ditambah oklusi lebih lebar sepanjang garis singgung pita. Ukurannya diambil dari alpha overlay `82f67c3`. Karena ada di catcher, oklusi tidak keluar dari alas.
- Pusat oklusi digeser 3,5 mm ke sisi lampu sepanjang pita, karena di overlay oklusinya condong ke sana. Ini penyesuaian terhadap gambar, bukan turunan geometri.
- Ujung kanan atas alas cocok (49,3 vs 52,3); kiri-depan atas alas hidup lebih gelap (57,5 vs 66,7).
- `D181d_contact_closeup_poster_live_figma.jpg`, `D181d_tilt_strip.jpg`.

## 3. Nada ring vs poster `4cbf9fd`
- Cara: kurva luma pada output material ring sendiri (setelah tone mapping), aktif hanya saat ring berdiri (`rest`) dan memudar saat terangkat. Lima simpul memetakan persentil luma ring hidup ke persentil poster. Ini grade, bukan perubahan pencahayaan; exposure tambahan dan tint pita dari D-181c dicabut.
- Persentil luma piksel ring (`D181d_ring_percentiles.txt`):

| | p05 | p25 | p50 | p75 | p95 | rata-rata RGB |
| --- | --- | --- | --- | --- | --- | --- |
| 1440@2x poster | 2 | 17 | 100 | 117 | 252 | 99 / 92 / 87 |
| 1440@2x hidup | 3 | 16 | 99 | 118 | 251 | 101 / 94 / 88 |
| 375@3x poster | 2 | 23 | 101 | 116 | 250 | 102 / 93 / 86 |
| 375@3x hidup | 4 | 17 | 100 | 121 | 248 | 103 / 94 / 87 |

- Desktop: p50/p75/p95 dalam 1%; p25 16 vs 17 (−6%, satu tingkat); p05 3 vs 2. **Ponsel: p25 17 vs 23 (−26%), di luar target 5%**; p75 +4%. Simpul kurva disetel pada 1440 saja.
- **Sebaran di ruang tidak sama walau persentilnya cocok:** sisi bawah pita poster gelap (memantulkan alas), pita bawah ring hidup terang. Kurva luma tidak bisa memindahkan pantulan. Cross-fade poster → hidup karena itu masih terlihat di pita bawah.

## Lain-lain (terukur)
- AVIF 2560 = 142,0 KB, 3632 = 269,6 KB, 1920 = 89,1 KB, 960 = 28,5 KB, potret ponsel 1816 = 74,7 KB; poster ring AVIF 3632 = 48,7 KB (`D181d_file_sizes.json`).
- fps dua kali jalan: 60,0–60,3 di semua kondisi termasuk throttle 4× (`D181d_perf.txt`).
- Wordmark 1440×900 149,6 px, jarak bbox 33 px; clearance diam −0,0002 mm (pembulatan JSON), tidak berubah.
- Tidak ada frame Figma 375; 375 dibandingkan dengan still ponsel 3D Designer (`D181d_375_live_vs_3d_still.jpg`).
- Bukti lain: `D181d_1440_2x_vs_figma.jpg`, `D181d_onion_figma_vs_live_1440.jpg`, `D181d_onion_poster_vs_live_1440.jpg` / `_375.jpg`, `D181d_pedestal_closeup_poster_live_figma.jpg`, `D181d_shadow_only_poster_top_live_bottom.jpg`, `D181d_frames_1440.jpg` / `_375.jpg`.

---

# D-181e: bercak hitam di dalam ring (laporan pengguna pada `12010a9`)

- **Di mana:** ring 3D hidup. Poster bersih, jadi tidak ada yang perlu dikirim ke 3D Designer.
- **Penyebab:** z-fighting di depth buffer, bukan grade, bukan bayangan, bukan material. Sejak D-179 ring S01 dirender dengan kamera foto berlensa panjang (ring ±3500 px dari kamera, lebih jauh di layar besar), sedangkan near plane tetap 1. Depth 24-bit hanya memisahkan ±0,7–3 px (±0,05–0,2 mm) di posisi ring. Kaca sensor, titik LED, dan bingkainya berada beberapa perseratus milimeter di atas liner, sehingga saling berebut piksel dan tampil berbintik.
- **Kenapa baru terlihat hitam:** bintiknya sudah ada sejak D-179 (abu terang). Grade D-181d menggelapkan separuh gelap bintik itu menjadi hitam. Produksi bersih karena belum memakai kamera foto D-179.
- **Uji toggle** (`?inspect&near=1`, `&nograde`, `&noshadow`; `D181e_sensors_1440_2x_rest_before_nograde_noshadow_after_poster.jpg`): dengan near = 1 bercak tetap ada saat grade dimatikan dan saat shadow map dimatikan; dengan near baru bercak hilang tanpa mengubah yang lain. Pantulan liner ×0,3 dan normal map sensor tidak diuji terpisah, karena perbaikan near saja sudah menghilangkannya.
- **Perbaikan:** `camera.near = max(1, 0,02 × F)` (mengikuti lensa). Tidak ada objek yang lebih dekat dari 0,1 F. Grade, bayangan, dan material tidak diubah.
- **Hasil:** sensor, titik LED, dan liner bersih pada 1440@2x diam dan tilt (`D181e_sensors_1440_2x_tilt_before_after.jpg`) serta 375@3x (`D181e_sensors_375_3x_before_after_poster.jpg`). Persentil luma ring tetap 3/16/99/118/251 (poster 2/17/100/117/252). fps 59,8–60,4 (`D181e_perf.txt`), clearance tidak berubah. Urutan scroll u 0 → 3 dijalankan ulang tanpa galat, tetapi belum saya periksa frame per frame untuk section lain.

---

# D-182: tepi ring, refleksi ala produksi, pembersihan (permintaan pengguna)

## 1. Pixelation
- **Penyebab:** resolusi render, bukan MSAA (aktif, tanpa render target/post pass), bukan near plane, bukan ukuran CSS. Ponsel dibatasi DPR 1,5 (375@3x: canvas 562 px lalu diperbesar 2×); layar 1× dirender 1×, sehingga highlight tipis pada chrome dan lengkung tipis tampak bertangga (MSAA hanya menghaluskan siluet).
- **Perbaikan:** desktop supersample sampai 2× dengan anggaran ±5,6 MP (1440×900: 2880×1800, juga di layar 1×; jendela lebih besar tidak turun di bawah min(DPR, 1,5)); ponsel DPR maks 2,5 (375@3x: 937×2030). Ini menggantikan batas DPR 1,5 pada D-052.
- **Garis bergerigi** pada pantulan bawah pita: sambungan kiri-kanan foto env; kedua sisi sekarang di-cross-fade.

## 2. Refleksi
- Beda produksi (`182048e`) vs staging sebelumnya: env produksi = foto adegan 100%, band 1,5, liner 1,0, rig matahari + hemisphere aktif, tanpa grade. Staging: 60% paper, gain 1,85, liner ×0,3, rig mati saat di alas, grade kurva luma.
- Sekarang mengikuti produksi, dengan foto meja hangat sebagai env. **Satu penyimpangan:** 25% env paper tetap dicampur saat di alas, karena dengan foto saja pita terbaca cokelat/gunmetal, bukan silver.
- **Gerak:** env berayun pelan (±0,38 rad, periode ±11 dan ±27 detik) plus sedikit mengikuti pointer; ring tidak bergerak. Mati untuk reduced motion; hilang bersama env foto.
- Bayangan kontak, near plane, tilt, geometri/clearance, wordmark: kodenya tidak diubah (clearance tidak diukur ulang).

## Poster vs hidup (persentil luma piksel ring, `D182_poster_left_live_right.jpg`)
| | p05 | p25 | p50 | p75 | p95 | RGB rata-rata |
| --- | --- | --- | --- | --- | --- | --- |
| 1440@2x poster | 2 | 20 | 90 | 111 | 216 | 95/81/72 |
| 1440@2x hidup | 32–33 | 49–52 | 95–105 | 151–158 | 245 | 118–122 / 106–110 / 97–101 |
| 375@3x poster | 2 | 18 | 91 | 115 | 248 | 93/85/80 |
| 375@3x hidup | 23 | 44–46 | 66 | 142–144 | 186–188 | 100–102 / 88–90 / 79–81 |

Rentang = beberapa saat berbeda dalam ayunan. Cara ukur berbeda dari D-181d (mask di sini dari alpha canvas), jadi angka poster tidak sama persis dengan tabel lama. **Cross-fade poster → hidup sekarang jelas terlihat** (liner poster hitam, hidup cokelat gelap). Keputusan PM: render ulang poster oleh 3D Designer ke tampilan ini atau tidak.

## 3. Pembersihan
- `?inspect` (termasuk hook QA dan mode inspect D-135) hanya ada di dev server; `&near`, `&nograde`, `&noshadow` dihapus. Skrip QA lama yang memakai `?inspect` harus dijalankan pada `npm run dev`.
- S02–S11 (`D182_sections_1440.jpg`, `_375.jpg`, 23 posisi): tidak terlihat clipping atau z-fighting, tanpa galat JS. Frame awal S06 menangkap meja sebagai blok di kiri atas (di tengah transisi; belum dibandingkan dengan build sebelumnya). Close-up S01 sekarang juga memakai rig dan env baru.

## fps (jujur)
Mesin sedang baterai 19% dan Chrome terkunci 30 fps, juga pada `about:blank` dan produksi, jadi **60 fps pada vsync belum terbukti**. Tanpa batas frame: build ini 96–105 fps (p95 ±20 ms), produksi 98–104, pada 1440, throttle CPU 4×, dan 375 (perf.mjs memakai DPR 1, jadi tidak menguji 2×/3×). Ponsel asli belum diuji.

Bukti lain: `D182_closeup_1440_2x_before_after.jpg`, `D182_closeup_375_3x_before_after.jpg`, `D182_prod_left_staging_right.jpg`, `D182_motion_1440.jpg`, `D182_motion_375.jpg` (6 frame, jarak ±2 detik).

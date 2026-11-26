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

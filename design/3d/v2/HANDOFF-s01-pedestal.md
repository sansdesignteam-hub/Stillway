# Handoff: alas cincin hero S01 3D (D-179)

## D-186: plate dibangun ulang di foto baru 3840×2400 (menggantikan semua file `-3632`)

Dari: 3D Designer · Untuk: Developer (`web-v2/`) · 27 November 2026
Status: **draf, menunggu tinjauan pengguna.** Bagian D-181 sampai D-182d di bawah tetap berlaku untuk cara kerja (plate + proxy tak terlihat, overlay ring, kontak AO, grade ring); semua angka frame, kamera, lampu, dan nama file di sana digantikan oleh bagian ini.

Sumber: `design/assets/v2/s01/Hero_BG_Stillway_New_3840x2400.avif` (16:10, native).

### File (`plate/`, semua 3840×2400; file `-3632` dihapus dari branch)

| File | Ukuran |
| --- | --- |
| `plate-s01-3840.png` (desktop) / `plate-s01-mobile-3840.png` | 8,2 MB / 8,2 MB |
| `still-s01-3840.png` / `still-s01-mobile-3840.png` | 8,2 MB / 8,3 MB |
| `ring-overlay-s01-3840.webp` (`.png`) | 303 KB (917 KB) |
| `ring-overlay-s01-mobile-3840.webp` (`.png`) | 157 KB (467 KB) |
| `layer-pedestal-rgba-3840.png`, `layer-desk-multiply-3840.png` (+ `-mobile-`) | 0,3–0,5 MB |

`s01-pedestal.glb` **tidak berubah** (77 KB). `s01-pedestal-pose.json` diperbarui. Identitas `still = plate + ring-overlay` tetap.

### Yang harus diubah di web

- `heroBg.v1Ratio` = 3840/2400. `anchor` (0,503; 0,8), `zoomFrom` 1,14, dan `subjectOrigin` (0,5; 0,86) boleh tetap.
- `heroBg.cam` = `{ frameW: 3840, frameH: 2400, focalPx: 8180.18, shiftY: 0.147901 }` (lensa 76,689 mm pada sensor 36 mm). **Posisi kamera dan `lookAt` tidak berubah.**
- Posisi/quaternion ring, `s01_scale` 1,125, posisi alas, dan proxy: tidak berubah.
- `lights.key`: posisi `[0.185, 0.25, -0.117]`, arah `[-0.5618, -0.7471, 0.3553]`, elevasi 48,3° (bergeser 0,7° dari D-180).
- `lights.spill` (hanya di plate): posisi `[0.12, 0.058, -0.047]`, arah `[-0.8588, -0.3865, 0.3364]`, elevasi 22,7°, jarak 140 mm, kerucut penumbra 24,2°, warna linear `(1; 0,52; 0,22)`.
- Set responsif plate/overlay perlu dibuat ulang dari file `-3840`; `sizes` desktop sekarang `max(114vw, 182.4lvh)` (cover 16:10 × 1,14).
- Pada viewport 16:9 foto 16:10 terpotong atas-bawah (dulu terpotong kiri-kanan pada 16:10). `ringLeft` sebagai fraksi lebar foto perlu diukur ulang: pada 1440×900 ring tetap di 552 px dari kiri (kotak ring 1104–1806 px @2x), tetapi fraksi fotonya berubah.

### Kalibrasi kamera

- Foto baru adalah **gambar baru** dari adegan yang sama, bukan crop plate lama: pencocokan fitur (SIFT) lama↔baru tidak menemukan kecocokan. Jadi tidak bisa diregistrasi seperti D-181; kalibrasi dilakukan pada geometri foto itu sendiri.
- Kemiringan bidang meja diukur dari dua pasang tepi tegak lurus yang terletak di meja (perspektif lemah, `sin²δ = tan a₁ · tan a₂`): laptop (+8,1° / −32,3°) → **17,5°** di v ≈ 0,65; buku (15,3° / 17,4°) → **17,0°** di v ≈ 0,55. Kamera kita menunduk 17,5° di v 0,65 dan 15,9° di v 0,55, dan 20,1° di alas. Selisih ±1°, dalam ketelitian ukur (±2°, foto buatan AI).
- Karena itu pose kamera (elevasi 19°, azimut −6°, jarak 232 mm) dipertahankan. Lensa dan shift diturunkan supaya **frame diam web** (cover × 1,14 di sekitar anchor, viewport 16:10) menghasilkan gambar pinhole yang sama dengan plate D-181b: 70 → 76,689 mm, `shiftY` 0,135 → 0,147901.
- Serat meja di foto miring ±2° (turun ke kanan); alas diputar −6° terhadap kamera seperti di Figma, jadi serat alas dan serat meja tidak sejajar (±12° di bidang meja). Itu wajar untuk benda lepas.
- Angka kamera di JSON diproyeksikan ulang dengan matematika gaya three.js: selisih 0,002 px pada 1920.
- Batas: baris keyboard tidak konvergen secara terukur, tepi buku konvergen ke horizon sekitar v ≈ −0,2, horizon kamera kita di v = −0,437. Kamera cocok di daerah alas; ini bukan rekonstruksi penuh lensa foto.

### Lampu

- Lampu foto baru, dari sinar kamera ini: kaki lampu di meja pada Blender (69; 73) mm, bukaan kap ±34 mm di atas meja. Di plate lama kaki lampu ada di (74; 76). Jadi terhadap alas lampu hampir tidak pindah (5 mm ke kiri, 3 mm lebih dekat).
- `lights.key` dan `lights.spill` digeser sebesar perpindahan itu. Arah key berubah 0,7°.
- **Tidak diubah, perlu diketahui:** azimut spill (±22° dari sumbu X) dan key (±32°) adalah pilihan D-181b yang mengikuti arah bayangan Figma. Azimut geometris lampu dari alas ±45°. Bayangan alas di plate jadi jatuh lebih ke kiri daripada yang dihasilkan lampu foto secara fisik (yang akan lebih ke arah kamera).
- Warna cahaya plate lebih hangat (key `(1; 0,60; 0,30)`, spill `(1; 0,52; 0,22)`), nada meja untuk bounce `(179, 104, 48)`, oak `OAK_HUE` 0,495 / `OAK_SAT` 0,8: meja baru lebih jingga (rata-rata sekitar alas 198/116/53, dulu 186/123/79) dan alas D-181b tampak pucat-merah muda di atasnya. `lights.key.color` untuk web tidak diubah.

### Kecocokan (terukur)

| | Kita | Figma |
| --- | --- | --- |
| Alas, frame diam web 2880×1800 | 887, 1272, 1976, 1645 | 886, 1266, 1982, 1640 |
| Ring | 1104, 570, 1806, 1408 | 1088, 598, 1805, 1408 |

- Lebar ring 702 px = 24,4% lebar frame. Sama dengan D-181b (selisih ≤ 1 px).
- Proxy GLB vs alas di plate: selisih bbox 0 px, pita selisih maksimum **0,5 px pada 1920** (1 px pada 3840), desktop dan ponsel.
- Luma ring (ukuran skrip ini, frame diam): desktop **27/47/66/146/194**, ponsel **27/47/67/145/195**. Sama dengan D-182d, yang setara 23/45/64/142/188 pada ukuran Developer; kesetaraan itu belum diverifikasi ulang di web.
- Kontak AO D-181c tetap (jangkauan 12 mm, gamma 2,8, lantai 0,10).

### Bukti (`renders/s01-plate/`)

- `s01-plate-still-onion-figma.webp`: onion-skin still vs Figma di frame diam web.
- `s01-plate-realism-closeup.webp` (still, alas + ring + meja), `s01-plate-realism-plate-only.webp`, `s01-plate-realism-detail-100pct.png` (100%).
- `s01-plate-proxy-overlay.webp`, `-closeup.png`, `s01-plate-report.json`.
- `s01-plate-vs-figma*.webp/png`, `s01-plate-mobile-1920.png`, `s01-plate-mobile-still-375.png`.

### Penilaian realisme (jujur)

- **Pada ukuran halaman: meyakinkan.** Perspektif alas cocok dengan meja, nadanya sekarang menyatu dengan meja jingga, bayangan kontak rapat, bayangan lembut ke kiri-depan searah sisi terang buku dan laptop.
- **Pada 100% masih ada tanda CG:**
  - Tepi alas lebih tajam daripada meja di sekitarnya. Foto melunak ke arah depan (v > 0,85); alas tidak diberi blur kedalaman supaya siluetnya tetap sama dengan proxy.
  - Pori di ujung kanan alas besar dan terlalu teratur; sisi depan sangat jenuh (kanal biru hampir 0).
  - Meja di foto agak mengilap (garis pantulan lampu), tetapi alas tidak punya pantulan samar di meja.
  - Arah bayangan mengikuti konvensi D-181b, bukan azimut geometris lampu (lihat Lampu).
- **Ring:** sengaja dicocokkan ke ring hidup (D-182d), jadi tampak bersih seperti render, kurang fotografis dibanding ring Figma (p50 66 vs 58, p95 194 vs 210).
- Skala serat alas sebanding dengan serat meja di kedalaman yang sama (garis ±6–10 px pada 3840).

### Belum dikerjakan / terbuka

- Belum diuji di `web-v2/` (cross-fade poster → ring hidup, set responsif, ponsel).
- `fallback/fb-s01-pedestal*` dan `s01-pedestal-build.py` (kamera 70 mm, foto 1818) masih versi D-179; tidak dipakai plate ini.
- Keputusan pengguna: apakah arah bayangan mengikuti Figma (sekarang) atau lampu foto (±45°).

---

## D-181: plate foto + proxy tak terlihat (menggantikan alas yang di-shade real-time)

Dari: 3D Designer · Untuk: Developer (`web-v2/`) · 26 November 2026
Status: **draf, menunggu tinjauan pengguna.** Bagian D-179/D-180 di bawah tetap berlaku untuk pose ring, kamera, dan lampu kunci. Yang berubah: alas tidak lagi di-shade di web.

### D-181b: alas dan ring dicocokkan ke Figma di frame web (revisi PM)

Semua file di `plate/`, `s01-pedestal.glb`, dan `s01-pedestal-pose.json` **diganti dengan nama yang sama**. Nilai di bawah menggantikan angka D-181 awal dan D-179 yang bertentangan.

- **Acuan ukur = frame diam web**: foto `cover` × zoom 1,14 di sekitar `heroBg.anchor` (0,503; 0,8). Perbandingan D-181 awal memakai cover zoom 1, sehingga di web alas dan ring tampil ±15% lebih besar daripada Figma.
- **Alas (GLB baru, pivot tetap tengah-bawah):** 36,4 × 18,6 × 6,2 mm, sudut denah R 7,5, bibir R 1,1. `pedestal.position` = `[0, 0, -0.0027]` (2,7 mm menjauh dari kamera), `top_y` = 0,0062.
- **Ring:** `s01_scale` 1,35 → **1,125**, posisi `[0.001, 0.019662, -0.0013]`, quaternion sama (kemiringan Figma tetap). Titik terendah menumpu di bagian datar sisi atas, tanpa tembus.
- **Kecocokan di frame web 2880×1800** (kotak Figma dibaca dari gambar, ±6 px):

| | Kita | Figma |
| --- | --- | --- |
| Alas (x0, y0, x1, y1) | 888, 1272, 1976, 1645 | 886, 1266, 1982, 1640 |
| Ring (x0, y0, x1, y1) | 1105, 570, 1807, 1408 | 1088, 598, 1805, 1408 |

- Lebar ring 702 px = 24,4% frame (Figma 24,9%). Ring kita ±28 px lebih tinggi di bagian atas karena kemiringannya dipertahankan.
- **Penyimpangan dari catatan PM, perlu keputusan:** PM meminta alas lebih dalam (±1,3 : 1) dengan lebar di layar tetap. Dengan kamera kita (elevasi 19°), balok sedalam itu menampilkan sisi atas jauh lebih dalam daripada Figma, dan lebar lama 16% lebih besar daripada Figma di frame web. Saya mencocokkan **siluet di layar** (onion-skin), sehingga balok 3D-nya 1,96 : 1 dan lebih sempit. Kalau proporsi 3D 1,3 : 1 yang diinginkan, ubah `PED_WDH` di `s01-pedestal-build.py` lalu jalankan ulang (±35 menit).
- **Cahaya:** tambahan lampu "spill" hangat rendah dari kanan, **hanya di plate** (jangan ditambahkan di web). Sisi kanan atas lebih terang, bibir kanan mendapat highlight, sisi kiri dan depan teduh, bayangan alas panjang dan lembut ke kiri-depan. Lampu ini tidak mengenai ring dan ring tidak menjatuhkan bayangan darinya, jadi bayangan ring hidup tetap dari `lights.key`.
- **Kayu:** lebih hangat (madu/rose), kontras serat lebih tinggi, pori lebih gelap.
- **Nada ring poster:** dibuat lebih putih agar mendekati ring hidup (env glossy netral 1,1 → 1,55, exposure +0,2). Belum dibandingkan piksel dengan ring hidup; cek cross-fade di web.
- **Kecocokan proxy:** pita selisih 0,5 px pada 1818, desktop dan ponsel.
- **Bukti baru:** `renders/s01-plate/s01-plate-still-onion-figma.webp` (onion-skin still vs Figma). Semua perbandingan berdampingan sekarang memakai frame diam web.
- **Akibat untuk web:** `heroBg.ringLeft` perlu diukur ulang (ring lebih kecil), dan pada ponsel alas kini lebih kecil pada faktor 0,62 yang sama.
- Ukuran file baru: plate 5,5 MB, plate ponsel 5,5 MB, still 5,7 / 5,6 MB, overlay ring WebP 220 KB (ponsel 119 KB), GLB 77 KB.

### D-181c: kontak ring, angka lampu spill, kontras ring

- **Kontak ring → alas:** still dan kedua `ring-overlay` sekarang memuat oklusi kontak gelap dan sempit di bawah pita yang menyentuh. Sumbernya pass AO Cycles jarak pendek (jangkauan 12 mm, dengan ÷ tanpa ring), gamma 2,8, lantai 0,10. Kontak ini bagian dari alpha bayangan overlay, **bukan** bagian plate. Bukti: `renders/s01-plate/s01-plate-contact-closeup-vs-figma.png`.
- **Lampu spill (`lights.spill` di JSON, ruang meja three.js, konvensi sama dengan `lights.key`):** posisi `[0.125, 0.058, -0.05]`, target `[0, 0.004, 0]`, arah `[-0.8617, -0.3723, 0.3447]`, elevasi 21,9°, jarak 145 mm, disk Ø60 mm (kerucut penumbra 23,4°), warna linear `(1; 0,62; 0,34)`. Intensitas relatif terhadap lampu kunci: 2,37× pada permukaan yang menghadap lampu, 1,20× pada sisi atas datar di target, dengan falloff kuadrat terbalik dari posisi lampu. Hanya menerangi alas + meja; ring tidak menerima dan tidak menghalanginya.
- **Kontras ring (luma 8-bit pada piksel ring, frame diam web):**

| | p05 | p25 | p50 | p75 | p95 | rata-rata |
| --- | --- | --- | --- | --- | --- | --- |
| Poster | 26,6 | 52,4 | 117,0 | 140,5 | 243,1 | 110,3 |
| Figma | 8,8 | 25,8 | 58,1 | 158,2 | 210,0 | 89,8 |

  Ring Figma lebih gelap di bagian gelap dan tengah daripada poster, dan sedikit lebih redup di highlight. Poster tidak diubah. Saran: **web yang bergerak** di bagian gelap (liner dan pantulan gelap diturunkan ke arah poster). Highlight web (15–18% di bawah poster) sudah setingkat Figma, jadi biarkan. Kalau kesetiaan penuh ke Figma diinginkan, poster dan web sama-sama perlu nada tengah yang lebih gelap; itu membalik permintaan "lebih putih" D-181b, jadi perlu keputusan PM.

### D-181d: ring poster ke kesetiaan Figma (keputusan PM)

Hanya pass ring yang dirender ulang. Plate tidak berubah. `still-s01(-mobile)-3632.png` dan `ring-overlay-s01(-mobile)-3632` diganti dengan nama yang sama. Bagian "lebih putih" dari D-181b dan tabel kontras D-181c di bawah tidak berlaku lagi.

- Krom lebih kontras: look AgX High Contrast, env glossy netral 1,5, exposure 0.
- Sisi bawah ring memantulkan gelap seperti Figma: di pass ring, ring ikut menghalangi lampu spill, alas tidak terlihat oleh sinar glossy, dan meja yang dipantulkan memakai nada redup latar depan foto.
- Kontak AO D-181c tetap.
- Luma 8-bit pada piksel ring, frame diam web:

| | p05 | p25 | p50 | p75 | p95 | rata-rata |
| --- | --- | --- | --- | --- | --- | --- |
| Poster baru | 1,8 | 16,8 | 93,2 | 114,2 | 254,4 | 86,9 |
| Figma | 8,8 | 25,8 | 58,1 | 158,2 | 210,0 | 89,8 |
| Poster D-181c | 26,6 | 52,4 | 117,0 | 140,5 | 243,1 | 110,3 |

- Rata-rata sekarang setingkat Figma. Yang belum: bagian gelap sedikit lebih hitam daripada Figma, nada tengah masih lebih terang (p50 93 vs 58), dan highlight lebih terang (p95 254 vs 210).
- Bukti: `renders/s01-plate/s01-plate-ring-closeup-vs-figma.png`.
- **Akibat untuk web:** pencocokan nada ring hidup vs poster dari D-181c perlu diulang terhadap poster baru.

### D-182b: ring poster mengikuti ring hidup D-182 (Developer `a7eea87`)

Hanya `still-s01(-mobile)-3632.png` dan `ring-overlay-s01(-mobile)-3632` yang berubah (nama sama). Plate, GLB, pose JSON, dan kontak AO tetap. Bagian nada ring di D-181d tidak berlaku lagi.

- Skrip: `s01-ring-live-pass.py`, lalu `s01-plate-build.py -- comp`. Cycles dengan env web (`env/hero-env-warm.jpg` diputar 0,6π + 25% env paper, di ruang kamera), rig web, material band web, AgX exposure 1,15. Setelah itu kurva luma, gain warna, dan tint hangat pada bagian gelap (grade, bukan hasil fisik).
- Luma piksel ring, 1440@2x frame diam, p05/25/50/75/95: **33 / 50 / 100 / 155 / 245** (target 33/50/100/155/245; sebelumnya 2/17/93/114/254).
- Bukti: `renders/s01-plate/s01-ring-poster-vs-live-D182b.jpg` (kiri poster baru, kanan crop ring hidup dari `D182_poster_left_live_right.jpg`; crop tidak diregistrasi piksel).
- Belum diuji di web (cross-fade) dan 375 tidak disetel ke angka ring hidup ponsel (p50 66). Di crop bukti, ring hidup tampak lebih sempit daripada poster; pose tidak diubah, Developer perlu memeriksa apakah itu ayunan/tilt saat capture.

### D-182d: grade ulang ke ring hidup terukur (menggantikan angka D-182b)

Kurva saja, tanpa render ulang; desktop dan ponsel punya kurva sendiri. Nama file sama; plate, GLB, pose tetap. Sumber target: `d182c-poster/README.md` (Developer), ring diam, ayunan netral: live 1440 23/45/64/142/188, 375 23/45/65/142/188. Target D-182b (p50 100) diambil dari kondisi yang keliru.

Diukur di sini (pass ring, frame diam desktop): desktop **27/47/66/146/194**, ponsel **27/47/67/145/195**. Angka ini sengaja di atas target karena mask Developer membaca poster `f59c740` beberapa tingkat lebih rendah daripada ukuran di sini; perkiraan dalam ukuran Developer = angka live, belum diverifikasi di web. `s01-ring-poster-vs-live-D182b.jpg` sudah usang.

### File

Semua 3632×2072, frame dan kamera sama dengan foto latar. Folder `plate/`:

| File | Isi | Ukuran |
| --- | --- | --- |
| `plate-s01-3632.png` | **Plate desktop**: foto upscaled + alas Cycles (bayangan kontak, AO, bounce). Tanpa ring, tanpa bayangan ring | 5,5 MB |
| `plate-s01-mobile-3632.png` | **Plate ponsel**: alas + bayangannya dengan transform 0,62× / −14% di sekitar O = (0,5 W; 0,86 H) | 5,5 MB |
| `still-s01-3632.png` / `still-s01-mobile-3632.png` | Gambar diam cadangan: plate + ring pose Figma + bayangan ring | 5,7 / 5,6 MB |
| `ring-overlay-s01-3632.webp` (`.png`) | **Lapisan poster RGBA**: ring + bayangan ring, transparan, di frame plate. Pengganti `fb-s01-pedestal-alpha.webp` | 242 KB (838 KB) |
| `ring-overlay-s01-mobile-3632.webp` (`.png`) | Sama, untuk transform ponsel | 145 KB (455 KB) |
| `layer-pedestal-rgba-3632.png`, `layer-desk-multiply-3632.png` (+ `-mobile-`) | Pass terpisah: alas RGBA dan lapisan multiply bayangan meja | 0,2–0,5 MB |

Lainnya: `s01-pedestal-pose.json` (diperbarui), `s01-plate-build.py` (skrip), `s01-plate.blend` (scene), bukti di `renders/s01-plate/`.

- `still` = `plate` + `ring-overlay` (source-over di sRGB), identik sampai pembulatan 8-bit. Jadi poster = plate + overlay, dan overlay bisa memudar ke ring 3D tanpa loncatan pada alas.
- Bayangan ring di overlay berwarna `#2A1608` (warna catcher web) dengan alpha yang luminansinya sama dengan render Cycles, di meja **dan** di atas/bibir/sisi depan alas.
- PNG adalah master. Set responsif AVIF/WebP dibuat Developer dari sini.

### Kamera (hasil kalibrasi ulang)

- Foto upscaled **adalah foto 1818×1037 yang diregangkan ke seluruh frame**, bukan crop. Diukur dengan phase correlation pada 44 patch: `u = 1,99768·x − 0,09`, `v = 1,99800·y + 0,03`, sisa 0,3 px rms.
- Karena itu semua **fraksi frame tidak berubah**, dan kamera D-179 tetap: 70 mm, `shiftY` 0,135, posisi dan `lookAt` sama. `heroBg.cam` tidak perlu diubah; cukup tata plate dengan kotak `cover` yang sama.
- Rasio piksel plate (3632/2072) berbeda 0,014% dari 1818/1037, yaitu 0,25 px pada 3632. Abaikan.
- `camera.check_points` di JSON berisi 9 titik alas (koordinat three.js) beserta posisinya di plate dalam fraksi. Pakai untuk menguji kamera web. Angka kamera di JSON saya proyeksikan ulang dengan matematika gaya three.js: selisih terhadap Blender 0,001 px pada 1818.

### Proxy

- Mesh: `s01-pedestal.glb` yang sama, posisi `[0, 0, 0]`, tanpa rotasi, skala 1 (tidak berubah).
- Tidak di-shade: `colorWrite = false`, `depthWrite = true`, ditambah catcher bayangan multiply untuk bayangan ring.
- **`castShadow` proxy = false.** Bayangan alas ke meja sudah ada di plate. Kalau proxy ikut menjatuhkan bayangan, catcher meja menggelapkannya dua kali.
- Kecocokan siluet (`renders/s01-plate/s01-plate-proxy-overlay.webp`, garis cyan = GLB): selisih bbox 0 / 0,5 px, pita selisih maksimum **0,5 px pada 1818** (batas brief ≤ 1 px). Versi ponsel juga 0,5 px.

### Ponsel

- Transform `p' = O + 0,62·(p − O) + (0; −0,14·H)` **dirender langsung di kamera** (lensa × 0,62 = 43,4 mm, `shift_y` 0,081875), bukan di-resample dari pass desktop. Secara geometri sama persis dengan CSS scale + translate.
- Alasannya: bayangan ring keluar dari tepi bawah frame desktop. Kalau lapisan desktop diperkecil, bayangan itu terpotong lurus di tengah meja. Render langsung menghasilkan bayangan utuh dan alas yang tajam.
- Akibatnya untuk web: di ponsel, catcher meja perlu menjangkau area di bawah tepi frame desktop (bukan dipotong pada kotak frame).

### Material dan cahaya plate

- Oak: Poly Haven *Oak Veneer 01* 2K (CC0), diffuse + roughness + normal, diproyeksikan dari tiga sumbu di ruang objek dan dicampur menurut normal. Sambungan UV di sudut denah dan bibir dari D-179 hilang.
- Pori terbuka: guratan gelap pendek searah serat, ikut menekan normal. Figur scan diredam 30% agar tidak terbaca sebagai veneer bergaris.
- Bibir R 1,1 sedikit lebih terang dan lebih halus (roughness −0,16), coat tipis 0,04.
- Cahaya: lampu kunci yang sama dengan JSON (disk Ø55 mm, arah dan penumbra 9,4° sama), jadi bayangan ring hidup menyambung bayangan alas di plate. Env untuk pass alas 0,14 (pass ring tetap 0,28 seperti poster D-179).
- Bayangan dan bounce di meja dihitung sebagai rasio dua render (meja dengan alas ÷ meja kosong) lalu dikalikan ke foto dalam cahaya linear. Foto di luar area itu tidak disentuh.

### Bukti (`renders/s01-plate/`)

- `s01-plate-vs-figma.webp`, `s01-plate-still-vs-figma.webp`: berdampingan dengan Figma `40004725:5602` pada framing web (cover 1440×900 @2x).
- `s01-plate-vs-figma-closeup.png`, `s01-plate-still-vs-figma-closeup.png`: close-up alas.
- `s01-plate-proxy-overlay.webp`, `-closeup.png`, `s01-plate-report.json`: siluet proxy dan angkanya.
- `s01-plate-mobile-1816.png`, `s01-plate-mobile-still-375.png`: versi ponsel.

### Terbukti vs usulan

- **Terbukti (Cycles + pengukuran):** plate, still, overlay, kecocokan proxy 0,5 px, registrasi foto upscaled, angka kamera di JSON.
- **Usulan, belum diuji di `web-v2/`:** flag material proxy, opacity catcher, dan kepadatan bayangan ring hidup. Cocokkan dengan `still-s01-3632.png`.

### Keterbatasan

- Bentuk alas tetap slab 41 × 25,6 × 6,8 mm (sama dengan GLB). Alas di Figma lebih dalam, sudutnya lebih bulat, dan warnanya sedikit lebih merah muda; itu tidak saya ubah karena geometri proxy harus sama.
- Latar Figma memakai foto dengan zoom ±1,10 (diukur), sedangkan web memakai cover zoom 1. Jadi buku dan laptop di perbandingan berdampingan tidak berimpit; alas dan ring yang dibandingkan.
- Lapisan `layer-desk-multiply` dipotong di 1, jadi bounce hangat beberapa persen di sisi terang alas hanya ada di plate, bukan di lapisan itu.
- Pose ring di still sama dengan D-179. Kecocokan ring vs Figma tidak dikerjakan ulang di tugas ini.

---

Dari: 3D Designer · Untuk: Developer (`web-v2/`) · 26 November 2026
Status: **draf, menunggu tinjauan pengguna** (bayangan harus dinilai halus dulu sebelum struktur teks hero diganti, D-179 poin 3).

## File (`design/3d/v2/`)

| File | Isi | Ukuran |
| --- | --- | --- |
| `s01-pedestal.glb` | Alas kayu, 1 mesh `S01_Pedestal`, material `S01_Pedestal_Oak` (baseColor + metallicRoughness + normal, WebP 1024 px tertanam), geometri Draco | **87 KB** |
| `s01-pedestal-pose.json` | Pose alas, ring, kamera, lampu, dan shadow catcher (Three.js Y-up, meter) | 3 KB |
| `s01-pedestal-build.py` | Skrip Blender headless: model → bake → GLB → render → pose JSON | |
| `s01-pedestal.blend` | File kerja (mesh + material sumber prosedural `S01_Pedestal_Oak_src`, fake user) | 118 KB |
| `s01-pedestal-review.blend` | Scene review: GLB alas + GLB ring + kamera + lampu + shadow catcher | 1,2 MB |
| `tex/s01-pedestal-{basecolor,roughness,normal}.png` | Master atlas 1024 px (sudah tertanam di GLB sebagai WebP) | |
| `fallback/fb-s01-pedestal.webp` | Still 1440×900: ring + alas + bayangan di atas latar baru | 65 KB |
| `fallback/fb-s01-pedestal-960.webp` | Sama, 960×600 untuk mobile | 33 KB |
| `fallback/fb-s01-pedestal-alpha.webp` / `.png` | Ring + alas + bayangan meja **transparan**, frame foto 1818×1037 (letakkan dengan `background-size: cover` yang sama seperti foto) | 94 KB / 0,8 MB |
| `renders/s01-pedestal/s01-pedestal-review-1440x900.png` | Review desktop di atas latar baru | |
| `renders/s01-pedestal/s01-pedestal-shadow-closeup.png` | Close-up bayangan: ring → atas alas → sisi depan alas → meja | |
| `renders/s01-pedestal/s01-pedestal-material.png` | Alas saja (cek serat dan fillet) | |

Latar: `design/assets/v2/s01/hero-warm-desk-v2-1818.webp` / `-960.webp` (dari Visual Director, tidak diubah).

## Bentuk dan skala

- Slab persegi panjang: **lebar 41,0 mm (X) × kedalaman 25,6 mm × tebal 6,8 mm** (revisi PM: dinding depan ≈ 0,17 × lebar).
- Sisi tegak dan datar. Sudut denah R 5,3 mm (0,13 × lebar). Roundover tepi atas R 1,1 mm (bibir lembut dengan garis highlight tipis), tepi bawah R 0,35 mm (garis kontak rapat). Normal sisi atas/bawah dikunci datar (weighted normal), jadi tidak ada gradasi shading di permukaan atas.
- Skala sama dengan ring V2: Ø luar ring 23,84 mm = **0,58 × lebar alas**.
- Origin = tengah sisi bawah, di bidang meja. Sisi atas pada `y = 0.0068` m.

## Material

- **Foto oak CC0:** Poly Haven *Oak Veneer 01* (https://polyhaven.com/a/oak_veneer_01, lisensi **CC0**). Sumber 2K ada di `tex/src-oak-veneer-01/`. Satu tile dipetakan ke 260 mm. Lewat UV bantu `proj`, serat mengikuti X di atas/bawah dan depan/belakang, sedangkan sisi pendek memakai proyeksi Y-Z. Warna sedikit lebih terang dan kurang jenuh (Hue/Sat) agar mendekati acuan. Hasilnya di-bake ke atlas 1024 (UV `proj` dihapus sebelum export).
- `roughness` 0,72–0,84 (tanpa kilap), `metalness` 0, specular rendah. `normalMap` serat + pori, normalScale 1.
- Three.js: `MeshStandardMaterial` dari GLB sudah cukup. Pastikan `material.map.colorSpace = SRGBColorSpace` (GLTFLoader sudah melakukannya). Tidak perlu `envMapIntensity` tinggi; 0,4–0,6 cukup agar kayu tidak tampak plastik.

## Pose (`s01-pedestal-pose.json`)

- Alas di `[0, 0, 0]` tanpa rotasi. **Ring S01 diperbesar `ring.s01_scale` = 1,35** (hanya S01, agar proporsinya sama dengan Figma `40004725:5602`; section lain tetap skala 1). Ring condong ±25–30° ke belakang-kanan dan bertumpu pada tepi bawah band di atas alas, tanpa tembus. Bukaan menghadap penonton/kanan-atas sehingga kedua jendela sensor dan titik LED terlihat. "Stillway" berada diagonal di band kiri-bawah depan. Posisi `[0.003, 0.022955, -0.001]`, quaternion `[-0.477263, -0.148561, -0.830874, 0.244539]` (xyzw, Y-up). Posisi dan quaternion sudah memperhitungkan skala 1,35, jadi set `ring.scale.setScalar(1.35)`. Bandingkan di `renders/s01-pedestal/s01-pedestal-review-vs-figma.png` dan overlay `s01-pedestal-review-onion-figma.png`.
- Kamera: 70 mm (sensor 36 mm), elevasi 19°, jarak 232 mm, FOV vertikal 16,7° pada rasio foto 1818×1037, dengan geser optik ke bawah (Blender `shift_y` 0,135) supaya alas duduk di ±82% tinggi frame. Nilai posisi/lookAt ada di JSON.
- Lampu kunci: hangat (#FFB370) dari kanan belakang atas, posisi `[0.19, 0.25, -0.12]`, elevasi ±50° (searah lampu meja di foto; dinaikkan agar bayangan ring jatuh di atas alas). Three.js: `DirectionalLight` #FFB370 intensitas 2,6, `HemisphereLight` #FFD9B0/#3A2414 0,25, alas `envMapIntensity` 0,35, tanpa fill depan. Bayangan alas dan ring jatuh ke **kiri depan**.

## Bayangan (inti D-179)

- Alas: `castShadow = true` **dan** `receiveShadow = true`. Hanya dengan ini bayangan ring bisa jatuh ke permukaan atas, turun ke sisi depan/fillet, lalu menyambung ke meja (lihat close-up).
- Ring: `castShadow = true`.
- Meja: plane besar di `y = 0` dengan `ShadowMaterial` (opacity ±0,5, warna #2A1608), transparan di atas foto CSS. Jangan pakai stencil/mask dari foto lagi (D-178 dihapus oleh D-179).
- Shadow map: `PCFSoftShadowMap` atau `VSMShadowMap`, `mapSize` 2048, kamera bayangan dibatasi ±0,06 m di sekitar alas agar texel kecil. Mulai dari `bias -0.0002`, `normalBias 0.0004`; naikkan normalBias bila muncul acne di fillet.
- Penumbra di render berasal dari area light Ø55 mm. Di Three.js tiru dengan `shadow.radius` (PCFSoft) atau `blurSamples` (VSM).

## Terbukti vs usulan

- **Terbukti (Blender Cycles):** GLB ini sendiri yang diimpor ulang ke scene review, jadi render, fallback, dan GLB konsisten. Ukuran, pose ring, dan arah bayangan sesuai render.
- **Usulan:** angka lampu/bayangan Three.js di JSON adalah titik awal; belum diuji di `web-v2/` (D-046, saya tidak menyentuh kode web). Cocokkan dengan `s01-pedestal-review-1440x900.png`.

## Keterbatasan

- Ring di render memakai env `v2-env-paper.exr` yang dihangatkan + lampu kunci, bukan rig `heroV1` di web. Finish/GLB ring sama, tapi pantulan di web akan sedikit berbeda.
- Pencocokan perspektif ke foto dilakukan secara visual (foto tidak punya data kamera). Skala ring/alas sengaja lebih besar daripada objek di foto, sama seperti acuan layout.
- Sambungan proyeksi terlihat tipis di sudut denah (depan → sisi pendek) dan di bibir atas. Sisi pendek memakai serat memanjang horizontal, bukan end grain asli (tidak ada scan end grain CC0 yang dipakai). Sisi depan masih menampilkan sedikit figur cathedral. Lihat `renders/s01-pedestal/s01-pedestal-material-vs-ref.png`.
- Fallback 1440×900/960×600 adalah crop `cover` di tengah. Untuk rasio layar lain, pakai versi alpha (frame foto penuh) di atas foto dengan `cover` yang sama.

## D-180: konvensi lampu kunci (diverifikasi)

- `lights.key.position [0.19, 0.25, -0.12]` **sudah benar** untuk Three.js Y-up (Blender `(x, y, z)` → `(x, z, -y)`). Lampu Cycles ada di Blender (0,190; 0,120; 0,250) m dan diarahkan ke (0, 0, 0,004). Arah cahaya Three.js `direction_unit` = (−0,570, −0,738, +0,360): ke kiri, ke bawah, dan ke **arah kamera (+Z)**. Elevasinya 47,6°. Jadi bayangan ring di atas alas jatuh ke **kiri-depan**, panjangnya ±0,9 × tinggi bagian ring yang menghasilkan bayangan.
- Bukti: `renders/s01-pedestal/s01-key-area-vs-sun.png` (hanya lampu kunci). Area light Cycles dan SUN Cycles dengan arah yang persis sama sama-sama menjatuhkan bayangan ke kiri-depan. Konversi JSON tidak salah. Bayangan "kiri-belakang" yang panjang di web berasal dari sisi web. Cek di runtime: `lampKey.getWorldPosition()` dikurangi `lampKey.target.getWorldPosition()`, lalu transformasikan dengan `desk.matrix` invers. Hasilnya harus sejajar dengan `−direction_unit`. Kalau tidak, light/target tidak berada di ruang `desk`, atau target belum ditambahkan / diperbarui.
- Agar bayangan tegas: VSM 2048, bounds ±0,045 m, `radius` 6 (±0,5 mm). Jangan memalsukan penumbra Cycles dengan radius besar. Key 3,0, hemisphere 0,15, pedestal env 0,25. Pada render Cycles, env hanya mengangkat cahaya secara merata dan tidak membentuk bayangan.

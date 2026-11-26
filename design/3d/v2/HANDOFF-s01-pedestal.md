# Handoff: alas cincin hero S01 3D (D-179)

## D-181: plate foto + proxy tak terlihat (menggantikan alas yang di-shade real-time)

Dari: 3D Designer · Untuk: Developer (`web-v2/`) · 26 November 2026
Status: **draf, menunggu tinjauan pengguna.** Bagian D-179/D-180 di bawah tetap berlaku untuk pose ring, kamera, dan lampu kunci. Yang berubah: alas tidak lagi di-shade di web.

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

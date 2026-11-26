# Handoff: alas cincin hero S01 3D (D-179)

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
| `fallback/fb-s01-pedestal.webp` | Still 1440×900: ring + alas + bayangan di atas latar baru | 64 KB |
| `fallback/fb-s01-pedestal-960.webp` | Sama, 960×600 untuk mobile | 33 KB |
| `fallback/fb-s01-pedestal-alpha.webp` / `.png` | Ring + alas + bayangan meja **transparan**, frame foto 1818×1037 (letakkan dengan `background-size: cover` yang sama seperti foto) | 86 KB / 0,8 MB |
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

- Alas di `[0, 0, 0]` tanpa rotasi. Ring bersandar ke belakang-kanan, bertumpu pada tepi bawah band di atas alas (titik terendah tepat di `top_y`, tanpa tembus), sedikit di kanan tengah. Bukaan menghadap kamera-kanan sehingga sisi dalam, dua jendela sensor, dan titik LED terlihat. "Stillway" ada di band kiri-bawah depan dan terbaca atas→bawah, seperti Figma `40004725:5602`. Posisi `[0.003, 0.018997, -0.001]`, quaternion `[-0.342653, -0.04484, -0.915502, 0.205997]` (xyzw, Y-up). Bandingkan di `renders/s01-pedestal/s01-pedestal-review-vs-figma.png`. Dengan skala ring tetap (Ø 0,58 × lebar alas), ring tampak lebih kecil daripada di Figma, dan puncaknya belum menyentuh huruf 'y'. Kalau perlu, perbesar dengan kamera/crop di web, bukan dengan skala ring.
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

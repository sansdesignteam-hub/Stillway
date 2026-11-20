# Laporan 3D Designer: tangan 3D S06 V2 (tahap 1)

Dari: 3D Designer · Untuk: Claude Code (main), pengguna · 20 November 2026
Dasar: D-102, brief `design/3d/v2/BRIEF-3d-s06-hand.md`.
Status: **draf tahap 1, menunggu tinjauan pengguna. Jangan dipasang di website dulu** (pengguna, 20 November 2026: "Nanti jangan dipasang dulu di Website, saya ada pertanyaan nanti"). Belum ada perubahan di `web-v2/` atau `web/` (D-046). File V1/V2 lain tidak diubah (D-070); `stillway-ring-v2.blend` hanya dibaca untuk mengambil ring.

## 1. Yang diserahkan

| File | Isi |
| --- | --- |
| `stillway-hand-v2.blend` | File kerja Blender 5.3: tangan kiri `Hand_L` + rig `Hand_L_rig` di bawah `Hand_Root`, ring dari `stillway-ring-v2.blend` (collection `Stillway_Ring`, material Silver di-set ke `silver_polished`), kamera `Cam_S06_Hand` (FOV 30°) dan `Cam_RingSeat`, animasi naik frame 1–100, env Paper polished. Versi web ada di collection `Hand_Web`. |
| `renders/hand-front.png` | Pose akhir, 1920×1000, latar Paper #F7F5F0, framing sama dengan screenshot S06 sekarang |
| `renders/hand-front-alpha.png` | Sama, latar transparan (calon cadangan *reduced motion*, lihat pertanyaan 8) |
| `renders/hand-ring-seat.png` | Close-up ring di pangkal telunjuk, 1600×1600, "Stillway" terbaca horizontal |
| `renders/hand-rise-01..04.png` | Urutan naik: frame 19, 40, 58, 100 (04 = pose akhir, sama dengan `hand-front`) |
| `renders/hand-skin-compare.png` | Kiri foto A-1, kanan tangan 3D, skala mm sama dan ujung jari sejajar |
| `renders/hand-cycles-vs-web.png` | Kiri render Cycles (SSS + rambut), kanan pratinjau Eevee dengan GLB web (tanpa SSS, tanpa rambut), mewakili tampilan Three.js |
| `stillway-hand-v2_web.glb` | GLB uji untuk tahap 2: **799 KB**, 29.016 segitiga, Draco, tekstur WebP 2K |
| `tex/hand_{basecolor,roughness,normal}.png` | Hasil bake 2048 px (sumber tekstur GLB) |

## 2. Jalur produksi dan alasannya

Jalur yang dipakai: **jalur 1 dengan model scan berlisensi CC0**, lalu diubah di Blender lewat Blender MCP.

- Blender MCP yang tersambung adalah add-on MCP resmi Blender 5.3 (eksekusi Python, render, inspeksi). Integrasi Sketchfab, Hyper3D Rodin, dan Hunyuan3D **tidak tersedia** di server ini, jadi jalur 2 (generate dari A-1) tidak bisa dipakai tanpa layanan tambahan. Hak pakai foto A-1 juga masih terbuka, jadi mesh hasil generate dari foto itu akan mewarisi pertanyaan yang sama.
- Modeling manual dari nol tidak akan serealistis bentuk hasil scan dalam waktu yang sama.
- Model dasar yang dipakai berasal dari bundle resmi Blender dan berlisensi CC0, sehingga paling bersih untuk portofolio.

### Sumber dan lisensi

| Item | Isi |
| --- | --- |
| Aset | "Hand - Realistic" dari **Human Base Meshes bundle v1.4.1** (Blender Studio / Blender Foundation) |
| Pembuat | Dan Ulrich (metadata aset di dalam file) |
| Lisensi | **CC0 1.0** (metadata aset `license = "CC0"`). Bebas dipakai, termasuk komersial dan portofolio, tanpa wajib atribusi. |
| URL unduhan | https://download.blender.org/demo/asset-bundles/human-base-meshes/human-base-meshes-bundle-v1.4.1.zip |
| Halaman produk | https://www.blender.org/download/demo-files/ (bagian Assets). Halaman ini menolak akses otomatis (HTTP 403) dari mesin ini, jadi bukti lisensi yang saya periksa langsung adalah metadata aset di file. |
| SHA-256 zip | `811f43accbb31a88266d932f8f5563b2d13586fca0ba2693aad1f5fe582b3515` |
| Atribusi (sukarela) | "Hand base mesh: Blender Studio, Human Base Meshes (CC0), by Dan Ulrich" |

Tidak ada aset lain dari luar. Kulit, kuku, kerut, urat, dan rambut dibuat prosedural di Blender. Ring dan env adalah aset proyek sendiri.

## 3. Yang dikerjakan pada model

1. Mesh kanan dicerminkan menjadi **tangan kiri**, lalu detail multires diterapkan (3.300 vertex).
2. Lengan bawah diperpanjang ±24 cm ke bawah dan ujungnya ditutup, jadi selalu keluar dari bingkai bawah.
3. **Rig ringan**: 21 tulang (lengan, telapak, 4 jari × metakarpal + 3 ruas, ibu jari 3 ruas), bobot otomatis. Rig ada di `.blend`; GLB web masih mesh statis (lihat pertanyaan 3).
4. Pose A-1 / D-072: punggung tangan ke kamera, telunjuk tegak (miring 3,9° ke kiri, A-1 2,9°), jari tengah/manis/kelingking menekuk santai, ibu jari tegak di samping. Nilai pose tersimpan di teks `hand_pose.json` di dalam `.blend`.
5. Proporsi disesuaikan ke A-1: telunjuk dipanjangkan 12% (ruas 1 dan 2) dan 6% (ujung). Sebelumnya jarak pangkal→ujung 55 mm, sedangkan A-1 ±66 mm.
6. **Pas di ring**: ring Ø dalam 19,2 mm, tetapi jari scan di pangkal 20,9 × 20,2 mm. Pangkal telunjuk dirampingkan maksimal 15% (shape key `seat_slim`, halus ke arah buku jari dan ruas tengah). Hasilnya: radius jari maksimum di dalam ring **9,30 mm vs. 9,60 mm**, celah ±0,3 mm, tidak menembus band.
7. Shape key `tendons`: urat tendon halus dari buku jari ke pergelangan.

| Ukuran | Nilai |
| --- | --- |
| Mesh dasar | 3.640 vertex, 7.276 segitiga |
| Render (subdiv 2) | ±116 rb segitiga + rambut 8.000 helai induk × 4 anak |
| Web (subdiv 1, diterapkan) | 14.510 vertex (17.300 setelah pisah UV), **29.016 segitiga** |

## 4. Kulit (Cycles)

- Principled BSDF, **subsurface Random Walk (Skin)**, radius 1,0 / 0,38 / 0,20 × 3,5 mm, IOR 1,4.
- Detail prosedural memakai `rest_position`, jadi tekstur ikut bergerak bersama mesh: pori (Voronoi ±0,7 mm), kerut silang halus, **kerut buku jari** (garis melengkung di PIP/DIP telunjuk dan IP ibu jari; samar di jari yang menekuk karena kulitnya teregang), urat tipis di punggung tangan, variasi warna (bercak, ujung jari dan buku jari lebih merah, lipatan lebih gelap), roughness bervariasi.
- **Kuku**: masker elips dari atribut koordinat jari, warna merah muda dengan lunula dan tepi bebas, roughness 0,22 dan coat tipis (lebih mengkilap dari kulit), alur kutikula.
- **Rambut**: partikel hair 8.000 helai, 6 mm, rebah ke arah jari, tebal di lengan bawah, tipis di punggung tangan dan ruas pertama jari, Principled Hair (melanin 0,88).
- **Warna kulit dikalibrasi ke A-1** dengan sampling area yang sama (sRGB, setelah render dan tone mapping AgX):

| Area | Foto A-1 | Tangan 3D |
| --- | --- | --- |
| Telunjuk, kulit tanpa rambut | (216, 156, 116) | (201, 143, 108) |
| Telunjuk dekat ring | (207, 144, 105) | (202, 145, 109) |
| Punggung tangan | (179, 119, 77) | (198, 140, 104) |

Hue sama, cokelat sawo matang / tan medium, bukan kulit gelap seperti Oryzo. Punggung tangan 3D sedikit lebih terang karena foto A-1 punya bayangan samping yang lebih kuat dan rambut lebih gelap.

**Lampu tambahan (usulan):** `Hand_Key`, softbox hangat dari kiri atas dengan *light linking* **hanya ke tangan**. Tanpa lampu ini tangan terlihat rata di env Paper. Ring tetap hanya disinari env Paper polished seperti di handoff ring. Di Three.js padanannya adalah `DirectionalLight` dengan layer khusus tangan.

## 5. Kamera dan pose akhir

- `Cam_S06_Hand`: perspektif, **FOV vertikal 30°**, jarak 0,4255 m dari ring. Pada 1920×1000, skalanya ≈ 4,36 px/mm, jadi ring 23,84 mm ≈ 104 px, sama dengan screenshot S06. Tangan diletakkan seperti di screenshot: ujung telunjuk di x ≈ 1305 px dan 124 px dari atas (screenshot: ±1330 px dan ±120 px).
- Supaya ring tidak terlihat dari bawah, kamera sejajar tinggi ring dan posisi tangan di layar diatur dengan **lens shift** (x −0,373, y −0,094, satuan tinggi frame). Di Three.js padanannya adalah `camera.setViewOffset(...)`. Trik memutar ring 10° dari `s06-pose.json` tidak bisa dipakai lagi karena ring kini ada di jari 3D. Gantinya, **seluruh tangan dimiringkan 10° ke belakang**, sehingga bukaan atas ring tetap terlihat.
- Ring: sumbu searah telunjuk, sisi logo menghadap kamera, **"Stillway" horizontal** (D-072), lihat `hand-ring-seat.png`. Material `silver_polished` (D-085), env `v2-env-paper-polished.exr`.

## 6. Gerak naik (usulan)

- Ring diam di titik pangkal (origin). Tangan naik lurus **sepanjang sumbu ring** sejauh **270 mm** (mulai dari bawah bingkai), dengan easing `power2.out` selama frame 1→100.
- Di awal, tangan sedikit miring (−6° X, +10° Z). Kemiringan ini hilang sebelum ujung jari mencapai ring (offset 90 mm), sehingga jari masuk lurus.
- Frame tinjauan: 01 = frame 19 (offset 181 mm, baru ujung jari terlihat), 02 = frame 40 (99 mm, ujung jari mendekati ring), 03 = frame 58 (49 mm, ring di ruas ujung/DIP), 04 = frame 100 (duduk di pangkal).
- Cek tabrakan per frame: saat ring melewati buku jari DIP (frame 55–61), jari paling jauh masuk **0,44 mm** ke band (resolusi mesh dasar; tidak terlihat di render). Pada pose akhir tidak ada tabrakan.

## 7. Web (rencana tahap 2, sudah disiapkan)

`stillway-hand-v2_web.glb`, **799 KB** (target ≤ 3 MB):

| Bagian | Ukuran |
| --- | --- |
| Geometri Draco (29.016 segitiga, pos 14 bit) | 78 KB |
| `hand_normal` WebP 2K | 513 KB |
| `hand_basecolor` WebP 2K | 108 KB |
| `hand_roughness` (kanal G metallicRoughness) WebP 2K | 98 KB |

- Ekstensi: `KHR_draco_mesh_compression`, `EXT_texture_webp` (keduanya required), `KHR_materials_sheen` (sheen hangat 0,25/0,18/0,15, roughness 0,5) sebagai pengganti SSS yang murah. Single-sided.
- Node: `Hand_Web_Root` (identitas, `extras.riseAxis_gltf` = [−0,067, 0,982, −0,178], `riseDistance_m` = 0,27), anak `Hand_L_web` (pose akhir), dan `Ring_Seat` (posisi = origin). Untuk menempatkan ring: salin quaternion `Ring_Seat` ke node `Stillway_Ring_Root` dari GLB ring polished (menggantikan rotasinya sendiri).
- Gerak: `handRoot.position = -riseAxis * d`, d dari 0,27 → 0.
- Base color sudah memasukkan warna hangat, dan urat di normal map dibuat lebih halus untuk web karena tidak ada rambut yang menutupinya. Usulan tambahan untuk Three.js: `MeshPhysicalMaterial` + sheen dari GLB, `envMapIntensity` ±1, DirectionalLight hangat khusus tangan. Bila perlu kesan SSS lebih kuat, wrap lighting kecil lewat `onBeforeCompile`.
- Tidak ada rambut di GLB, jadi versi web tampak lebih halus (lihat `hand-cycles-vs-web.png`).

## 8. Keterbatasan

- Detail kulit **prosedural**, bukan tekstur scan. Dari dekat (close-up) kulit masih terlihat sedikit "CG" dibanding foto: buku jari yang menekuk terlalu mulus, tidak ada sidik jari atau kerut telapak.
- Mesh dasar beresolusi sedang. Bentuk tulang buku jari dan urat besar kurang tegas dibanding A-1.
- Telapak tangan 3D ±9% lebih lebar daripada A-1 pada skala mm yang sama.
- Rambut hanya ada di render Cycles.
- Ring bersinggungan 0,44 mm saat melewati buku jari DIP (sangat singkat).
- Render tinjauan memakai 128–192 sampel + denoise, bukan kualitas akhir.

## 9. Pertanyaan terbuka untuk pengguna

1. **Warna kulit**: apakah tone di `hand-skin-compare.png` sudah sesuai ("cokelat seperti sekarang")? Perlu lebih gelap atau lebih kemerahan?
2. **Sudut dan gaya naik**: lurus sepanjang sumbu telunjuk dengan sedikit putaran di awal (usulan), atau naik vertikal murni? Perlu **jeda** di bawah ring sebelum masuk?
3. **Rig jari**: perlukah jari bergerak (misalnya tangan naik setengah terbuka, lalu jari menekuk setelah ring duduk)? Rig sudah ada. GLB berkulit (skinned) akan menambah ±50–100 KB.
4. **Proporsi**: telunjuk sudah dipanjangkan agar mirip A-1, tetapi telapak masih sedikit lebih lebar. Perlu dirampingkan?
5. **Rambut di web**: diterima tanpa rambut, atau dicoba rambut tipis yang di-bake ke tekstur / kartu rambut di tahap 2?
6. **Lampu tangan**: boleh menambah lampu khusus tangan (softbox hangat) di S06, atau tangan harus hanya memakai env Paper seperti ring?
7. **Kamera web**: setuju memakai `setViewOffset` (lens shift) + tangan miring 10°, menggantikan rotasi koreksi ring di `s06-pose.json`?
8. **Reduced motion**: pakai `hand-front-alpha.png` (3D) untuk menggantikan A-1b (D-095), atau tetap A-1b?
9. **Lengan baju**: C-02 memakai kemeja linen oatmeal (D-058). Perlu manset/lengan baju di bawah bingkai, atau lengan telanjang seperti A-1?

# D-179 Tahap 1: latar baru, alas 3D, bayangan

Commit kode: `4766476` (branch Developer). Aset 3D: 3D-Designer `e7337a6`. Build `npm run build` berhasil.

## Yang dikerjakan
- **Latar**: `hero-warm-desk-v2-1818/960.webp` di `web-v2/public/hero/`. Versi 960 di-preload untuk first paint. Cover dan zoom D-177 (1,14 → 1 desktop, 1,1 → 1 mobile) tetap dipakai. File latar lama dihapus.
- **Alas 3D**: `s01-pedestal.glb` dan `s01-pedestal-pose.json` di `web-v2/public/models/` dipasang di canvas ring yang sama. Pose ring, tinggi istirahat, kamera, lampu, dan catcher **dibaca dari JSON saat runtime**. Jadi GLB/JSON revisi (alas lebih tebal) bisa langsung ditukar tanpa mengubah kode. Di S01 kamera stage memakai kamera foto: focal 70 mm, principal point shift_y 0,135, dan ikut CSS cover + zoom. Karena itu alas menempel pada foto selama zoom. Ring berdiri di atas alas sesuai pose JSON, lalu naik ke pose melayang dari u 0 sampai 0,9. Mouse tilt, bob, dan breathe dimatikan selama ring berdiri.
- **Bayangan**: satu lampu kunci hangat (#FFB370) dari kanan-belakang-atas sesuai JSON. Pengaturannya `VSMShadowMap` 2048 (1024 di ponsel), radius 18, 24 sampel, dan bounds ±0,06 m. Alas memakai `castShadow` + `receiveShadow`, ring memakai `castShadow`. Meja memakai `ShadowMaterial` transparan (opacity 0,5, #2A1608) ditambah contact shade lembut di bawah alas. **Stencil-mask D-178 sudah dihapus seluruhnya.** Di adegan meja, rig D-177 diturunkan 60% supaya lampu kunci menjadi sumber cahaya dominan. Kalau tidak, bayangan di atas alas hampir tidak terlihat.
- **Keluar ke S02**: alas, catcher, dan lampu memudar bersama foto (u 2,05–2,8). Kamera tetap memakai kamera foto sampai alas tersisa ≤1/8, baru kembali ke lensa default, sehingga alas tidak bergeser terhadap foto. S02 tidak berubah (frame 5).
- **Poster/fallback**: `fb-s01-pedestal-alpha.webp` diletakkan **di dalam elemen foto** (frame 1818×1037 yang sama), jadi ikut zoom foto. Poster dipakai untuk first paint (preload), reduced motion, dan tanpa WebGL. Saat 3D siap, poster cross-fade 0,9 s, bersamaan dengan fade-in canvas. Intro scale foto (1,08 → 1) dihapus karena alas 3D akan "tergelincir" bila foto bergeser sendiri.
- **Mobile**: ponsel potret menutup foto berdasarkan tingginya. Pada skala 1, alas (~490 px) melebar melewati 375 px dan terbaca sebagai meja. Karena itu ring + alas + bayangan diskalakan **0,62** di sekitar titik asal alas (foto 0,5 / 0,86), dengan nilai yang sama untuk 3D dan poster (`heroBg.mobile.subject`). **Bayangan cincin aktif di mobile.** Alasannya, ring sekarang berdiri di atas alas, jadi bayangannya adalah bayangan kontak yang membuat ring terlihat menapak, bukan ring melayang jauh di atas permukaan seperti pada D-177. Biayanya dibatasi dengan shadow map 1024.

## Bukti
- `D179_1440_frames.jpg`: awal (ring di atas alas), u 0,5 ring terangkat, u 1,5 close-up, u 2,4 exit, u 3 S02.
- `D179_375_frames.jpg`: urutan yang sama di 375×812.
- `D179_shadow_closeup_poster_vs_3d.jpg` / `D179_shadow_closeup_3d.png` (2×): bayangan ring berjalan dari permukaan atas, melewati tepi depan, lalu ke meja di kiri depan. Tidak ada garis potong, bidang persegi, atau banding.
- `D179_poster_vs_3d.jpg`: poster vs 3D pada 1440 dan 375. Kontur alas dan posisi ring tepat berimpit.
- `D179_reduced_nowebgl.jpg`: reduced motion dan tanpa WebGL pada 1440/375, ditambah still S02.

## Terbukti vs usulan
- **Terbukti** (headless Chrome lokal, build produksi): penempatan alas/ring cocok dengan poster, bayangan halus, exit tanpa pergeseran, S02 sama, dan fallback berjalan.
- **Usulan / diatur dengan mata**: `LAMP 8`, `PED_ENV 0.55`, dan tint oak `(1, 0.88, 0.58)` (AgX membuat oak tampak merah muda) di `stage.ts`. Akan disesuaikan lagi setelah material/lampu revisi dari 3D Designer masuk.

## Batasan
- Bayangan 3D di atas alas masih **lebih gelap dan lebih tegas** daripada render Cycles, karena area light Ø50 mm hanya ditiru dengan blur VSM. Bisa dilunakkan lewat radius atau opacity setelah PM meninjau.
- Shading ring 3D berbeda dari still karena env web + rig (sudah disebut di handoff). Perbedaan ini terlihat sekilas selama cross-fade 0,9 s.
- Env pantulan ring (`hero-env-warm.jpg`) masih berasal dari foto lama yang ada alasnya. Tidak diganti di tahap ini.
- Di 375, teks intro lama menumpuk di bagian bawah alas. Struktur teks diatur di Tahap 2.
- Preview Vercel: lihat status pada laporan worker_done.

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

## Tahap 1b (bcd0960)
- Alas, pose JSON, dan still alpha dari 3D Designer bcd0960 sudah terpasang: tebal 6,8 mm, sisi tegak, top_y 0,0068, ring y 0,01872. Ring otomatis duduk di permukaan atas yang baru dan kode tidak berubah.
- Lampu dibaca dari JSON: key #FFB370 2,6 di [0,19, 0,25, −0,12], hemisphere 0,25, pedestal env 0,35. Rig depan D-177 dimatikan saat adegan meja ditampilkan (tanpa front fill). Di atas nilai JSON hanya ada tiga gain yang diatur dengan mata: `LAMP_GAIN 2`, `PED_ENV_GAIN 5` (pengganti pantulan meja dari GI Cycles, karena web tidak punya GI), dan tint oak `(1, 0.93, 0.5)`. Setelan baseColor sudah benar (sRGB, dicek di runtime). Warna peach/merah muda muncul karena tone mapping AgX mendesaturasi oranye. Tint mengembalikan warna honey. Serat kayu sekarang terbaca.
- Bayangan: VSM dengan map 1024 dan radius 40. VSM mem-blur dalam satuan texel, jadi map yang lebih kasar menghasilkan penumbra lebar seperti Cycles. Densitas turun karena env lebih terang. Bandingkan di `D179b_shadow_closeup_poster_vs_3d.jpg`: tepinya sekarang lembut dan nilainya mendekati poster. Bentuknya masih sedikit lebih panjang dan sempit daripada poster.
- Frame: `D179b_frames.jpg`, berisi 3D 1440 vs poster, u 0,5, exit, serta 3D 375 vs poster.
- Env ring `hero-env-warm.jpg` **tidak dibangun ulang**. Env ini dipakai sebagai equirect yang diputar 0,6π lalu di-blur oleh PMREM. Alas di foto lama hanya menempati area kecil, sehingga pantulan ring didominasi warna meja, lampu, dan dinding yang sama di foto lama maupun baru. Perbedaannya tidak terlihat di close-up maupun frame u 1,5.

## Tahap 1c: ronde 3 (6a8aee8 + 7ee3358)
- Aset dari 3D Designer sudah dipasang: oak foto CC0, sudut R5.3, pose ring istirahat dari Figma (condong ke belakang-kanan, logo di kiri bawah), dan still alpha baru. Kode tidak perlu diubah untuk pose karena semuanya dibaca dari JSON.
- `ring.s01_scale` (opsional, JSON) didukung. Nilainya hanya dipakai saat ring beristirahat di S01, lalu ikut blend `rest` kembali ke ukuran lift-off (u 0 → 0,9) tanpa lonjakan. Bila nilainya tidak ada, dianggap 1.
- Rotasi dan siluet: `D179c_ring_onion_diff.jpg` (2×, live vs poster, onion-skin 50/50, difference ×2,5). Siluet menumpuk; selisih hanya muncul di garis sorot tepi bibir ring, sekitar 1–3 px. Rona hijau pada gambar difference adalah artefak konversi ffmpeg, bukan selisih warna. Konvensi kuaternion JSON (xyzw, rotasi objek root GLB) sudah diverifikasi benar. Tiga varian koreksi 180° yang diuji justru membuat posisinya lebih jauh dari poster.
- Eksposur ring: saat adegan meja, env bergeser `DESK_PAPER 0.35` ke studio paper (poster disinari env paper bernuansa hangat), dan env band dikali `RING_DESK_ENV 1.6`. Keduanya memudar bersama meja, dan langkah photo→paper berlanjut dari titik itu tanpa pop. Ring live sekarang perak terang seperti poster. **Sisa perbedaan:** poster sedikit lebih hangat, dan sisi luar band kirinya lebih gelap/kontras.
- Frame: `D179c_frames.jpg` (1440 live/poster/lift/exit/S02, 375 live/poster/exit). Close-up bayangan: `D179c_shadow_closeup_poster_vs_3d.jpg`.

## Tahap 1d: pose final 43f5c91 (disetujui PM)
- JSON (`s01_scale` 1.35, posisi/kuaternion baru) dan still alpha baru sudah dipasang; GLB tidak berubah. Ring membesar ×1,35 saat diam dan kembali ke 1 selama lift (u 0 → 0,9, lihat frame "u0.5").
- Onion-skin/difference ring: `D179d_ring_onion_diff.jpg`. Siluet dan rotasi menumpuk, selisih hanya di garis sorot tepi. Frame: `D179d_frames.jpg`, `D179d_375_live_vs_poster.jpg`. Bayangan: `D179d_shadow_closeup_poster_vs_3d.jpg`.
- Arahan "lebih ke kanan dari tengah" ala Figma **tidak** diterapkan. Posisi live ditentukan oleh JSON dan harus identik dengan poster Cycles, sehingga menggeser ring di web akan merusak kecocokannya dengan poster. Pergeseran ini perlu dibuat di JSON + still oleh 3D Designer.
- Warna: ring live tampil perak terang seperti Figma, sedangkan poster Cycles lebih gelap/hangat. Akibatnya cross-fade masih memperlihatkan perubahan nada. Ada dua pilihan: menyamakan eksposur poster di render 3D Designer, atau menurunkan `DESK_PAPER`/`RING_DESK_ENV` di web, yang akan menjauhkannya dari Figma.

## Tahap 2: struktur teks hero (Figma 40004725:5602) + poster netral e344d6a
- Wordmark "Stillway" ditulis title case di kiri atas: x 40, y 126,3, 193,59 px, line 143,4, tracking −5,81 px ditambah −4,92 px per huruf dari frame. Cincin menumpuk huruf "y". Elemen lama dihapus: "Understand your rhythm.", $299, dan tiga fitur. Grup Bawah: "SCROLL DOWN" (Mono/Medium) di kiri bawah dan intro Heading 2 selebar 389 px (3 baris) di kanan bawah. Scrim Figma (gradasi 18% → 0 → 0 → 35%) terpasang. Navbar tidak berubah.
- Scroll: wordmark naik, intro bergeser ke kanan, dan scroll hint memudar (`D179s2_text_fade_1440.jpg`).
- **Mobile 375 (keputusan):** wordmark selebar layar (`(100vw−40)/3.1`) di bawah nav. Intro (3 baris) berada di atas "SCROLL DOWN" di bagian bawah. Ring + alas dinaikkan `subjectDy −0.14` dari tinggi foto supaya teks tidak menutupi alas. Skala mobile 0,62 dan pergeseran ini sekarang dihitung sebagai skala/geser 2D kamera foto (focal + principal point di sekitar titik asal alas). Perhitungan ini persis sama dengan `scale` + `translate` CSS pada poster, sehingga siluet poster = 3D di 375 (tepi ring/alas cocok ±2 px). Ini menggantikan skala 3D di dunia, yang hanya mendekati.
- Poster netral-perak e344d6a sudah dipasang. `D179s2_ring_tone_poster_vs_live.jpg` (1440 + 375): nada ring live dan poster sekarang sama-sama perak netral, jadi cross-fade tidak lagi menggeser nada.
- Tuning: `LAMP_GAIN 2.3`, `PED_ENV_GAIN 2.6`, dan tint oak `(1, 0.9, 0.42)` untuk menaikkan densitas bayangan dan saturasi oak. **Batas:** bayangan ring di atas alas pada live masih sedikit lebih terang dan lebih pendek daripada poster (`D179s2_shadow_closeup_poster_vs_3d.jpg`).
- Bukti: `D179s2_1440_vs_figma.jpg` (Figma | live | poster), `D179s2_375.jpg`, `D179s2_text_fade_1440.jpg`.

# Handoff: ring 3D di hero (D-051) dan CTA (D-052)

Dari: 3D Designer · Untuk: Developer · 18 November 2026 · Status: **draf uji, menunggu tinjauan pengguna**

## File

| File | Isi |
| --- | --- |
| `ring/stillway-ring-silver_web.glb` | Model untuk web, 78 KB, kompresi Draco, LED mati. Ukuran nyata dalam meter (diameter luar ±23,8 mm). |
| `ring/stillway-ring-silver.glb` | Versi tanpa kompresi (778 KB), hanya untuk cadangan/inspeksi. |
| `ring/stillway-ring-silver.blend` | File kerja Blender 5.3 (collection `Stillway_Ring`). |
| `hero-test/index.html` | Prototipe hero lengkap: layout sama dengan `web/` hero, scroll + mouse, cadangan foto. **Bukan kode produksi.** |
| `hero-test/env.jpg` | Environment map (foto hero 1024 px) untuk pantulan silver. |
| `hero-bg/H-01-hero-bg-noshadow.png` | **Pengganti `H-01-hero-bg.png` di hero.** Bayangan ring yang tercetak di batu dihapus (edit AI gpt-image hanya di area bayangan, ditempel ke foto asli 2556×1448; bagian lain identik). Bayangan kini dibuat Three.js. |

Jalankan uji: `cd design && python3 -m http.server 8765`, lalu buka `http://localhost:8765/3d/hero-test/`. `?p=0..1` membekukan progres scroll, `?mx=-1..1&my=-1..1` mensimulasikan mouse.

## Yang perlu dipasang di `web/`

1. Dependensi: `three` (uji memakai 0.170.0). Decoder Draco: salin `three/examples/jsm/libs/draco/gltf/` ke `public/draco/` agar tidak bergantung CDN.
2. `<canvas>` transparan di atas `.hero__stage--front`, di atas wordmark (`z-index` sama dengan ring sekarang), `pointer-events: none`.
3. `<picture data-hero-ring>` yang ada **tetap dipakai**: sebagai poster saat GLB dimuat, sebagai acuan posisi/ukuran mendarat (bounding box-nya dibaca setiap resize), dan sebagai cadangan bila WebGL gagal atau `prefers-reduced-motion: reduce`. Setelah model siap: canvas fade in, gambar fade out.
4. Kamera perspektif FOV 30°, jarak diatur supaya 1 unit = 1 px CSS di z=0. Posisi ring diambil dari elemen DOM, jadi tidak perlu koordinat baru.
5. Pencahayaan: `scene.environment` = `env.jpg` sebagai equirect lewat PMREM (rotasi Y 0,6π), `DirectionalLight` hangat `#ffe2b8` intensitas 2,2 dari kiri atas, `HemisphereLight` 0,35. Tone mapping AgX, exposure 1,15.
6. Pose foto dihitung dari vektor (lihat `setPose` di uji): `POSE = { theta: 66, phi: 50, psi: 0, scale: 1.0 }`. Sumbu bukaan condong `theta`° dari kanan layar ke atas dan `phi`° menjauhi kamera; sensor berada di dinding dalam yang menghadap kamera. Pose yang sama dipakai di awal (melayang) dan akhir (mendarat).
7. Bayangan: `DirectionalLight` khusus bayangan (intensitas 0, `castShadow`, PCFSoft, map 1024) dan bidang `ShadowMaterial` (warna `#1c140b`) di titik terendah ring saat mendarat, dimiringkan 0,32 rad menghadap kamera. Opasitas bayangan naik dari 0 ke 0,55 saat ring mendekati batu. Div `.hero__contact` tetap ada, tapi lebih tipis (0,35).

## Motion (ganti tween `ring` di `motion.ts`, yang lain tetap)

- **Scroll**: pakai progres ScrollTrigger hero yang sudah ada (`scrub: 0.9`). Pada rentang 0–0,72: posisi dan skala ring berpindah dari float (tengah, lebar `min(30vw, 62% tinggi pin)`) ke pose mendarat. Selama itu ring **berputar pelan pada sumbu vertikal satu putaran penuh (2π → 0)**, sehingga awal dan akhir sama-sama menampilkan sensor, dan miring z −9° → 0°. Dim, wordmark, contact shadow, dan offer tetap memakai timeline yang sekarang.
- **Mouse** (hanya `(hover: hover) and (pointer: fine)` dan lebar ≥ 720 px; **mobile tanpa tilt**, D-051): tilt mengikuti kursor, maksimal ±0,22 rad (X) dan ±0,32 rad (Y), dengan damping 0,06 per frame. Kekuatannya turun ke 35% setelah ring mendarat.
- **Idle**: ayunan naik-turun dan miring yang sama dengan `heroBob`, memudar saat ring mendarat.
- Render hanya saat hero terlihat (IntersectionObserver). Di Orca/Chromium M-series terukur ±165 fps.

## Belum diputuskan / perlu diuji

- Mobile: disetujui 3D tanpa tilt. Usulan DPR maksimal 1,5 belum diuji di perangkat asli.
- Finish Black dan Gold belum dibuat (material bisa diganti di Three.js).
- Arah bayangan (`SHADOW_DIR`) disetel kira-kira dari foto; perlu tinjauan mata.
- Pantulan memakai foto hero itu sendiri sebagai pendekatan; belum ada HDRI asli.

## CTA penutup (D-052)

Uji: `http://localhost:8765/3d/cta-test/` (`?p=0..1` progres, `?cmp=1` tampilkan foto). Model GLB, loader, dan struktur `setPose` sama dengan hero; yang berbeda:

- **Latar**: `H-04-night-bg.png` apa adanya (`cta-test/night-bg.jpg` + `env-night.jpg` untuk pantulan). Tidak perlu latar baru: ring melayang, tidak ada bayangan di batu.
- **Posisi/ukuran**: dibaca dari `<div data-close-ring>` yang ada (cutout `H-05-...-crop.png` tetap sebagai poster dan cadangan), sama seperti hero.
- **Pose**: `POSE = { theta: 118, phi: 45, psi: -35, scale: 0.76, roll: 45 }`; `roll` memiringkan ring di bidang layar agar condong seperti cutout.
- **Cahaya malam**: exposure 1,7; `environmentIntensity` 2,2; `DirectionalLight` biru `#a9c0ff` 4,5 dari kanan atas; rim putih-biru `#dfe8ff` 3,0 dari kiri belakang; hemisphere `#6f86c8` 0,4. Silver `envMapIntensity` 3,2.
- **LED sensor menyala**: material `LED_*` diberi `emissive #ff9a3c`, intensitas 2,6 ± 0,5 (napas pelan). Di hero LED tetap mati.
- **Motion**: pakai window scrub yang sama dengan tween sekarang (`.close` dari `top 90%` ke `top top`): ring turun dari atas ±1,1 lebar ring dan berputar satu setengah putaran (−1,2π → 0) sambil miring −14° → 0, lalu melayang pelan (±6 px). Tilt mouse sama seperti hero (nonaktif di mobile).
- Satu renderer WebGL dibagi pakai dengan hero, atau canvas CTA dibuat saat section mendekat, agar tidak ada dua konteks WebGL aktif.

Status: **draf**. Dibanding cutout `H-05`, silver 3D masih lebih gelap/biru dan sensor lebih kecil; perlu setel mata sebelum disetujui.

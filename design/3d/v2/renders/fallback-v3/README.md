# Fallback v3: S08 Features dan akhir S06 (reduced motion / tanpa WebGL)

Dibuat 23 November 2026 oleh 3D Designer lewat Blender MCP (Blender 5.3, Cycles). Dasar: D-085, D-107, D-112, D-122, QA F-01 dan D-01. **Status (D-127):** `fb-s06-finger-polished` disetujui apa adanya. Keempat cadangan S08 disetujui dengan syarat ring dibuat lebih terang sampai terbaca silver; render ulang v2 (di bawah) menjawab syarat itu. Developer memasang semuanya di Fase 3. Belum disalin ke `web-v2/public/ring-fallback/`.

Ring = GLB web `stillway-ring-v2-silver_web.glb` dengan nilai `silver_polished` (D-085): normal map dan anisotropi mati, band 0,92/0,92/0,93 roughness 0,06, dengan envMapIntensity 1,5 ditiru lewat lobe gloss tambahan. Ukiran 0,28 roughness 0,38. AgX, exposure 0.

| File | Ukuran | PNG (master) | WebP |
| --- | --- | --- | --- |
| `fb-s08-green-polished` | 1024×1024 | 528 KB | 62 KB |
| `fb-s08-blue-polished` | 1024×1024 | 531 KB | 64 KB |
| `fb-s08-violet-polished` | 1024×1024 | 529 KB | 62 KB |
| `fb-s08-red-polished` | 1024×1024 | 515 KB | 60 KB |
| `fb-s06-finger-polished` | 579×1198 (sama dengan foto A-1) | 822 KB | 116 KB |

Semua file memakai **background transparan**. Pada S08, glow dan flare yang jatuh di luar ring disimpan sebagai warna + alpha. Di atas Night #1B0B06 hasilnya hampir sama dengan blending additive di web.

## S08: pose `close()` desktop dari `sections/features.ts` (state 2–4)

- Pose: `x 0.25, y −0.04, w 0.64, uncap 1, rx −0.36, ry −0.5, rz 0.12` (Euler three `YXZ`), `spin −0.36`, tanpa pitch dan roll.
- Kamera sama dengan `stage.ts` di viewport 1440×900: FOV vertikal 30°, z = 1679,4 px, menghadap −Z. Gambar 1024² mencakup **1160 px CSS** dengan pusat di pivot ring, yaitu (1080, 486) px CSS dari kiri atas. Perspektifnya sama persis dengan ring yang berada di kanan layar.
- Cara menempatkan di 1440×900: `<img>` 1160×1160 px, left 500, top −94. Untuk viewport lain: lebar gambar = 1,2587 × (w·W), dan pusat gambar di pivot (W/2 + x·W, H/2 − y·H).
- Diameter luar ring 921,6 px CSS (813,5 px gambar).
- Cahaya v1 (commit `3f5de60`, terbaca gunmetal; diganti v2, lihat bagian berikut): env `v2-env-night-polished.exr` × 1,77 (`light 1, rim 0.55`), sun rim dari (900, 420, −650) dengan kuat 7,7, rim fill dari (−700, 260, 900) dengan kuat 1,76 (#dfe8ff), LED emisi 1,6, point light pantulan 1,2 W di 0,08·ringSize ke arah sumbu (sama dengan `bounce` di stage.ts).
- Flare: sprite yang sama dengan `stage.ts` `flareTex` (glow radial dan satu streak tipis, rotasi −0,42 rad, ukuran 0,6·ringSize, additive). Pusat sprite (px gambar dari kiri atas):
  - hijau, biru, ungu (`led_main`, Sensor_A): (316.6, 366.4), sprite 439 px
  - merah (`led_power`, Sensor_B, jendela bawah di bawah dua titik kontak): (245.9, 543.5), sprite 382 px (0,85×, "satu lampu kecil"). `led_main` mati (#1c1c1e, tanpa emisi).
- Usulan untuk web F-01: pada state merah, flare dan `bounce` dipindahkan ke anchor `led_power` dengan offset yang sama ke arah sumbu. Web saat ini belum punya state ini.

## S08 v2: pencahayaan silver (D-127)

Pose, kamera, ukuran 1024², posisi lampu, flare, dan material (`silver_polished`) **tidak berubah**. Pusat flare sama persis dengan v1. Yang berubah hanya cahaya: semua cahaya v1 tetap dipakai, lalu ditambah **dua area light putih berbentuk disk yang lembut**. Hasilnya, band luar dan bevel terbaca silver terang dengan gradasi dan highlight jelas. Dinding dalam tetap gelap, dan lampu sensor tetap satu-satunya bagian yang bersinar. Rata-rata nilai piksel ring naik dari 0,33 (v1) ke 0,50 (v2).

Nilai untuk Developer (Fase 3, menyamakan web S08). Posisi memakai px CSS di ruang three, relatif ke pusat layar, dengan y ke atas dan z ke kamera, di viewport 1440×900. Semua lampu diarahkan ke pusat layar (0, 0, 0), bukan ke ring:

| Cahaya | Nilai |
| --- | --- |
| HDRI | `v2-env-night-polished.exr`, rotasi 0°, strength 1,77 (= `environmentIntensity` web saat `light 1, rim 0.55`), saturasi asli |
| Rim (sun / DirectionalLight) | dari (900, 420, −650), #dfe8ff, kuat 7,7 (= `14 × rim`) |
| Rim fill (sun) | dari (−700, 260, 900), #dfe8ff, kuat 1,76 (= `3.2 × rim`) |
| **Key 1 (baru)** | area disk Ø 1000 px, dari (−300, 900, 1200), putih, 120 W (Blender) |
| **Key 2 (baru)** | area disk Ø 1000 px, dari (900, −500, 1100), putih, 40 W (Blender) |
| LED, pantulan, flare | sama dengan v1 |

Catatan penerjemahan ke three.js: area light Blender paling dekat dengan `RectAreaLight` (perlu `RectAreaLightUniformsLib`), ukuran ±1000×1000 px, `lookAt(0, 0, 0)`. Watt Blender tidak sama dengan intensitas three, jadi samakan dengan mata terhadap `fb-s08-*-polished.png`. Patokannya: bevel atas dan band kanan putih-silver, band bawah abu-silver bergradasi, dinding dalam abu gelap, dan tidak ada sorotan yang lebih terang dari pendar lampu. Cara lain: dua `DirectionalLight` lembut dari arah yang sama, ditambah `environmentIntensity` sedikit lebih tinggi. Hasilnya lebih "keras", karena pantulan cermin dari directional light hanya berupa titik kecil.

Uji yang ditolak: env `v2-env-paper-polished` (strength 1,0 atau 1,6, beberapa rotasi) membuat band krem/keemasan (melanggar D-112) dan dinding dalam terlalu terang. Versi Paper yang dinetralkan (saturasi 0,1) memang silver, tetapi dinding dalam ikut terang. Karena itu v2 tetap memakai env Night dari web, ditambah key light.

Mengulang: `S08_LIGHT_V2` di `build_fallback_v3.py` (`S08_LIGHT_V1` = nilai lama).

## S06 akhir: ring di pangkal telunjuk A-1 alpha (D-072, QA D-01)

- Menggantikan cadangan A-1b brushed (D-095). Gambar memakai ukuran dan posisi yang sama dengan `design/assets/v2/A-1-hand-left-alpha.png`, jadi bisa langsung menggantikan foto tangan di reduced motion dengan variabel CSS yang sama (`--hx`, `--hy`, `--hs`).
- Pose ring mengikuti `s06-pose.json` `onFinger`: langkah dunia three `x −90, y −90, x +10, z +2.9`, sama dengan `fingerPose` di `details.ts` tanpa koreksi pandang karena kamera sudah lurus ke dudukan. Pusat band di dudukan (343, 360) px foto, diameter luar 122 px foto.
- Kamera: FOV vertikal 30° untuk tinggi foto, jarak 2235,5 px foto (= camZ web saat tangan setinggi viewport), sumbu kamera melalui dudukan, shift (−53,5, −239) px.
- Komposit: proxy jari (lathe dari profil `s06-pose.json` × 1,02, miring 2,9°) dipakai sebagai holdout di pass ring, sehingga sisi belakang ring tertutup jari, dan sebagai shadow catcher di pass bayangan. Bayangan kontak dikalikan ke foto di ruang linear (gain 1,5). Ring di-alpha-over di atasnya.
- Cahaya: env `v2-env-paper-polished.exr` × 1,0, **diputar 160° di sumbu vertikal** supaya pantulan softbox tidak menutupi logo. Ditambah satu area light lembut dari depan kiri atas (−500, 900, 1500) dengan kuat 22 W, mengikuti arah cahaya di foto, untuk bayangan kontak. Ini pilihan cahaya untuk gambar diam saja; ring 3D live di web tetap memakai env tanpa rotasi, sehingga pantulannya sedikit berbeda.

## Mengulang

`build_fallback_v3.py` (dijalankan di Blender lewat MCP) dan `fallback-v3.blend` (scene `FB_V3`):

```python
g = {}; exec(open(".../design/3d/v2/renders/fallback-v3/build_fallback_v3.py").read(), g)
g["build_all"]()   # atau g["setup_scene"](); g["s08"]("red"); g["s06"]()
```

Scene dibangun di "ruang three.js": empty `THREE_ROOT` membawa rotasi glTF Y-up → Z-up, sedangkan pivot, spinner, kamera, dan lampu memakai koordinat dan urutan rotasi `stage.ts`. Nilai setelan ada di `S08_TUNE`, `S08_RED`, dan `S06_TUNE`.

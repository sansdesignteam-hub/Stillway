# Handoff: ring V2 (tahap 1 + tahap 2)

Dari: 3D Designer · Untuk: Developer (`web-v2/`), Visual Director · 19 November 2026
Status: tahap 1 (logo, LED) **disetujui** (D-071, D-072). Tahap 2 (brushed web, Black/Gold, env V2, cadangan) **draf, menunggu tinjauan pengguna**. Proxy jari S06 menunggu foto tangan dari Visual Director.

## File

| File | Isi |
| --- | --- |
| `stillway-ring-v2-silver_web.glb` | Model web, **147 KB** (geometri Draco + normal map brushed 19 KB), ±43 rb segitiga, 10 mesh, finish default Silver. Satuan meter (Ø luar 23,8 mm, lebar 8 mm). `Ring_Shell` punya UV (`TEXCOORD_0`). LED mati. |
| `finishes.json` | Parameter Silver/Black/Gold untuk `MeshPhysicalMaterial` + preset env per section |
| `env/v2-env-{paper,night,dusk,lamp}.exr` | Environment map V2, EXR half-float DWAA 1024×512, 49–97 KB per file |
| `tex/ring-brushed-normal.png` | Sumber normal map brushed (sudah tertanam di GLB) |
| `fallback/fb-*.png` / `.webp` | Cadangan pose kunci, transparan 1024 px (3D-7). PNG = master, WebP = untuk web |
| `ring-test/index.html` | Halaman uji Three.js: finish, env, LED. Bukan kode produksi |
| `stillway-ring-v2.blend` | File kerja Blender 5.3. Collection `Stillway_Ring` (model), kamera render `Cam_*`, `Engrave_Cutter` (tersembunyi, untuk mengedit logo), mesh cadangan `Ring_Shell_V1_orig` (fake user). |
| `renders/*.png` | Render acuan 2048 px, latar netral, LED hijau menyala. Lihat tabel di bawah. |

File V1 di `design/3d/ring/` tidak diubah.

Uji: `cd design/3d/v2 && python3 -m http.server 8777`, lalu buka `http://localhost:8777/ring-test/`. Parameter: `?finish=silver|black|gold`, `?env=paper|night|dusk|lamp`, `?led=%2334E07A|off`, `?spin`, `?alpha`.

## Logo (D-061)

- Teks **"Stillway"** saja, Geist Medium, tracking −3%, tinggi huruf kapital ±2,0 mm, panjang ±10 mm, kedalaman **0,10 mm**.
- Posisi: sisi luar, berseberangan dengan jendela sensor. Teks mengikuti arah band dan dibaca dari bawah ke atas bila lubang ring ada di kiri, seperti `ring-logo-engrave-ref.png`.
- **Metode: geometri** (boolean exact ke `Ring_Shell`), bukan normal/roughness map. Alasannya:
  1. Paling mirip referensi. Dinding huruf benar-benar menangkap dan menahan cahaya, jadi tepi huruf berkilau atau gelap mengikuti sudut. Efek ini sulit ditiru normal map pada logam mengkilap.
  2. Hasilnya sama di Blender, Three.js, dan semua render acuan, tanpa UV atau tekstur tambahan.
  3. Murah: +2,3 rb segitiga, tanpa permintaan file tambahan.
  - Normal permukaan di sekitar huruf diset ulang ke normal silinder (custom normals), sehingga tidak ada artefak shading dari boolean.
- Tone-on-tone: dasar huruf memakai material `Ring_Silver_Engrave` (silver lebih gelap dan lebih kasar), sehingga hurufnya terbaca tanpa warna tambahan.

## Mesh dan material (nama di GLB)

| Mesh | Material | Catatan |
| --- | --- | --- |
| `Ring_Shell` | `Ring_Silver` + `Ring_Silver_Engrave` | 2 primitive. Finish tahap 2 cukup mengganti kedua material ini. |
| `Ring_Liner` | `Ring_Liner_Black` | Bagian dalam hitam matte |
| `Sensor_A_Frame`, `Sensor_A_Glass` | `Sensor_Frame_Black`, `Sensor_Glass` | Jendela A (lampu utama) |
| **`led_main`** | **`LED_Main`** | Lampu jendela A: hijau / biru / ungu |
| `Sensor_B_Frame`, `Sensor_B_Glass` | sama | Jendela B, tidak menyala |
| **`led_power`** | **`LED_Power`** | Titik merah, hanya menyala saat ring "mati" |
| `Contact_1`, `Contact_2` | `Contact_Metal` | Pad pengisian daya |

Root: `Stillway_Ring_Root`. Kedua material LED sudah **terpisah** (tidak dibagi dengan mesh lain), jadi aman diubah langsung.

## Mengganti warna LED (Three.js)

```js
const ring = gltf.scene;
const ledMain  = ring.getObjectByName('led_main').material;   // MeshStandardMaterial
const ledPower = ring.getObjectByName('led_power').material;

const LED = { heartRate: '#34E07A', sleep: '#3B8CFF', recovery: '#A06BFF', off: '#FF3B30' };

ledMain.emissive.set(LED.heartRate);      // Color.set memakai sRGB → linear otomatis
ledMain.emissiveIntensity = 2.2;          // usulan 1,5–3 dengan AgX + toneMapped=false; lebih tinggi jadi putih. 0 = mati
ledMain.toneMapped = false;               // agar warna tidak pucat jadi putih

// Transisi S08 (hijau 25–50%, ke biru 50–75%, ke ungu 75–100%):
const a = new THREE.Color(LED.heartRate), b = new THREE.Color(LED.sleep), c = new THREE.Color(LED.recovery);
function setLed(p) { // p = progres scroll section 0..1
  const t1 = THREE.MathUtils.smoothstep(p, 0.5, 0.75), t2 = THREE.MathUtils.smoothstep(p, 0.75, 1.0);
  ledMain.emissive.copy(a).lerp(b, t1).lerp(c, t2);
}

// Ring mati: matikan led_main, nyalakan titik merah
ledMain.emissiveIntensity = 0;
ledPower.emissive.set(LED.off); ledPower.emissiveIntensity = 6; ledPower.toneMapped = false;
```

Flare dan pantulan lampu ke permukaan dalam (PLAN-v2 §2, S08) dibuat di kode, bukan di model: sprite additive kecil + `PointLight` berwarna sama di depan `led_main`.

## Tahap 2: brushed, finish, dan cahaya

### Brushed di web
- `Ring_Shell` diberi UV silinder: `u` = 36 ulangan di sepanjang keliling, `v` = lebar band. Normal map brushed 32×512 px (garis searah keliling) diulang di UV itu, dengan `normalScale` 0,5.
- `KHR_materials_anisotropy`: kekuatan 0,55, rotasi π/2. Kilau memanjang **melintang** terhadap garis brushing, seperti logam brushed asli. Three.js membaca keduanya langsung dari GLB (r170 diuji). Tangent dihitung dari UV di shader, jadi tidak perlu atribut `TANGENT`.
- Silver yang sebelumnya "putih dan kusam" terutama karena env-nya rata. Env V2 punya softbox terang dan area gelap, sehingga perak punya kontras logam.

### Finish (`finishes.json`)
Ganti properti dua material yang ada, jangan buat material baru, supaya UV/normal map tetap terpakai:

```js
const F = await (await fetch('/3d/finishes.json')).json();
function apply(m, p) {
  m.color.setRGB(...p.color, THREE.LinearSRGBColorSpace);
  m.metalness = p.metalness; m.roughness = p.roughness;
  if ('anisotropy' in p) { m.anisotropy = p.anisotropy; m.anisotropyRotation = p.anisotropyRotation; }
  if ('normalScale' in p) m.normalScale.setScalar(p.normalScale);
  m.clearcoat = p.clearcoat || 0; m.clearcoatRoughness = p.clearcoatRoughness || 0;
}
apply(shellMat, F.gold.shell); apply(engraveMat, F.gold.engrave);   // shellMat = 'Ring_Silver', engraveMat = 'Ring_Silver_Engrave'
```

| Finish | Material | Kesan |
| --- | --- | --- |
| Silver | Logam brushed, warna stainless hangat, roughness 0,18 | Seperti referensi |
| Black | Logam hitam (seperti lapisan DLC), roughness 0,20, clearcoat tipis 0,25 | Kilau gelap berlapis, bukan plastik |
| Gold | **Opsi B (D-079):** emas kuning 18K cerah, linear 1,00/0,80/0,34, roughness 0,11, normalScale 0,35 | Dipasangkan dengan env Lamp netral (D-069: Gold → Lamp light) |

Ukiran tetap tone-on-tone di setiap finish: dasar huruf lebih gelap dan lebih kasar.

### Env map dan rig per section
- Muat dengan `EXRLoader` (format DWAA didukung Three.js r170), lalu `PMREMGenerator.fromEquirectangular`. Orientasi sudah sama dengan Blender, jadi `environmentRotation` = 0.
- Renderer: `AgXToneMapping`, exposure 1,0. Tidak perlu lampu tambahan; semua cahaya ada di env. Untuk S08, tambah `PointLight` kecil berwarna LED di depan `led_main` (jangkauan ±6 mm) untuk pantulan ke dalam ring.
- Muat lazy: Paper dulu, Night saat mendekati S03, Dusk saat mendekati S05, Lamp hanya bila Gold dipilih.

| Preset | Isi | Section |
| --- | --- | --- |
| `paper` | Studio hangat netral: softbox atas, strip kiri/kanan, flag gelap, lantai krem | S01, S02, S06, S10 Silver/Black |
| `night` | Hampir hitam, satu strip rim dingin dari belakang-samping | S03, S08, S11 (S11: tambah Ember glow CSS) |
| `dusk` | Matahari rendah ochre + glow cakrawala, langit gelap | S05 (S11 cadangan memakai dusk yang diputar 84° agar glow datang dari atas) |
| `lamp` | Lampu hangat ±3500 K (dinetralkan, D-079) + pantulan dinding krem, strip kanan, flag gelap. 91 KB | S10 Gold (juga aman untuk Silver/Black) |

Transisi antar env: crossfade dua env (render dua kali tidak perlu). Cukup tween `scene.environmentIntensity` turun → ganti env → naik dalam ±0,4 detik scroll, atau lerp warna latar CSS bersamaan.

### Cadangan pose kunci (`fallback/`, 3D-7)
PNG transparan 1024 px (master, ±0,5–0,8 MB) dan WebP q82 (12–36 KB, **total ±420 KB untuk 16 file**). Dipakai untuk poster loading, reduced motion, dan WebGL gagal; muat per section.

| File | Pose | Env |
| --- | --- | --- |
| `fb-s01-34`, `fb-s01-front` | S01 3/4 dan menghadap kamera, LED hijau samar. `fb-s01-34` = pose web-v2 `ANGLE.threeQuarter` (rx −0,15, ry −0,85, spin 0; D-075) | paper |
| `fb-s02-34` | S02 state 1 web-v2 (threeQuarter, ry −1,0) | paper |
| `fb-s03-rim` | S03 state 1 web-v2 (threeQuarter, ry −0,95), hanya tepi kena cahaya dingin | night |
| `fb-s05-macro` | S05 kamera di depan lubang ring, LED hijau samar | dusk |
| `fb-s06-front`, `fb-s06-side`, `fb-s06-45` | S06 berdiri: menghadap kamera, samping (logo), 45° | paper |
| `fb-s06-finger` | S06 pose akhir di jari (tafsiran B, D-072): sumbu vertikal, teks horizontal | paper |
| `fb-s08-green`, `fb-s08-blue`, `fb-s08-violet` | S08 dekat jendela sensor, lampu menyala + pantulan | night |
| `fb-s10-silver`, `fb-s10-black`, `fb-s10-gold` | S10 tiga finish | paper / paper / lamp |
| `fb-s11` | S11 dengan Ember glow dari atas | dusk (diputar) |

Pose cadangan adalah pose acuan. Developer menyamakan pose 3D di setiap state dengan file ini (kamera `Cam_*` di `.blend`).

### Anggaran (PLAN-v2 §4)
| Item | Anggaran | Hasil |
| --- | --- | --- |
| Model + tekstur | ≤ 160 KB | **147 KB** |
| Env map | 4 × ≤ 100 KB | 49 / 78 / 97 / 95 KB (lazy) |
| Segitiga | ≤ 60 rb | ±43 rb |
| Cadangan (WebP) | ±8 × ≤ 80 KB | 16 × ≤ 36 KB |
| Jalur normal (GLB + env Paper) | | ±240 KB, di luar `three` + `EXRLoader` |

## Render acuan (`renders/`)

| File | Kamera (`.blend`) | Untuk |
| --- | --- | --- |
| `v2-ring-logo-closeup.png` | `Cam_LogoCloseup` | Close-up logo seperti referensi |
| `v2-ring-hero-pose.png` | `Camera` | Pose hero (sama dengan pratinjau V1) |
| `v2-ring-ref-34.png` | `Cam_Ref34` | **RING_REF** Visual Director: 3/4 sisi luar, logo terbaca |
| `v2-ring-front.png` | `Cam_Front` | Tampak depan (melalui lubang) |
| `v2-ring-side.png` | `Cam_Side` | Tampak samping (band dari tepi, 90° dari logo) |
| `v2-finish-silver.png`, `v2-finish-black.png`, `v2-finish-gold.png` | `Cam_Ref34` | Pembanding finish tahap 2 (Blender EEVEE, env V2) |
| `web-threejs-*.png` | sama | Pembanding finish yang sama di Three.js (`ring-test/`) |
| `v2-ring-upright-10.png` | `Cam_Upright10` | Permintaan VD no. 4, tafsiran A: ring berdiri, logo menghadap kamera, teks vertikal dibaca dari bawah ke atas, kamera 10° dari atas |
| `v2-ring-axis-vertical-10.png` | `Cam_AxisVertical10` | Permintaan VD no. 4, tafsiran B: sumbu ring vertikal (seperti di jari yang terangkat), kamera 10° dari atas. Di pose ini teks jadi **horizontal** |

Pose akhir S06 memakai tafsiran B (`v2-ring-axis-vertical-10.png`, D-072). Render tahap 1 dibuat dengan env lama dan finish satin. Render tahap 2 (`v2-finish-*`, `fallback/`) memakai brushed dan env V2.

## S06 Product details: gelinding dan ring masuk ke jari (persiapan, belum dibangun)

Data lengkap: `s06-pose.json`. Implementasi acuan yang bisa dijalankan: `ring-test/s06.html` (`?p=0..1` progres section, `?proxy` menampilkan proxy jari merah). Foto: `A-1-hand-left-alpha.png` dari Visual Director (commit 7023283); salinan uji ada di `ring-test/hand/`.

**Kamera:** sama dengan V1 hero, yaitu perspektif FOV 30° dengan jarak `(innerHeight/2)/tan(15°)`, sehingga 1 unit = 1 px CSS di z = 0. Posisi ring dan foto dihitung dari DOM, jadi tidak ada koordinat tetap.

**Pose akhir di jari (D-072):** langkah rotasi dunia berurutan `x −90, y −90, x +10, z +2,9`:
- sumbu ring mengikuti telunjuk, logo menghadap kamera, teks horizontal;
- `x +10` = kamera ±10° dari atas, `z +2,9` = kemiringan telunjuk di foto;
- tambahkan **koreksi pandang**: `x = atan2(ring.y, d)`, `y = atan2(−ring.x, d)`. Tangan ada di kanan layar, jadi tanpa koreksi ini logo terlihat dari samping. Hasil terukur: logo 0,5° dari arah kamera.
- Ukuran: diameter luar ring = **122 px foto** × (lebar foto tampil / 579). Pusat band di dudukan **(343, 360)**.

**Proxy jari:** `LatheGeometry` dari profil di JSON (radius per tinggi sepanjang sumbu, dalam px foto), diputar `z +2,9` saja, diletakkan di dudukan, `colorWrite: false`, dan dirender sebelum ring. Proxy dan jalur turun **tetap di bidang foto** (z = 0). Kemiringan 10° hanya ada di pose ring; kalau proxy ikut miring, parallax perspektif menggesernya keluar dari jari (sudah diuji).

**Ukuran jari terukur:** lebar telunjuk di dudukan 96–100 px, bukan 85 px seperti di README Visual Director. Angka 85 px adalah bagian tersempit dekat ujung. Karena itu ring 122 px (Ø dalam ±19 mm) pas dengan jari. Ini juga cocok dengan A-1b.

**Timeline (progres section):**

| p | Isi |
| --- | --- |
| 0–0,25 | Gelinding di alas Sand. Sudut gulir = jarak / jari-jari (searah jarum jam saat ke kanan). Overshoot 6% R di 0,22, lalu kembali dan diam di 0,25 menghadap kamera dengan logo di atas |
| 0,25–0,40 | Slerp ke `side` (band ke kamera) |
| 0,50–0,67 | Slerp ke `edge45` (yaw 45° + miring 20°) |
| 0,67–0,80 | Tangan fade in. Ring pindah ke 40 px foto di atas ujung jari, mengecil ke ukuran jari, slerp ke pose jari, koreksi pandang masuk |
| 0,80–1,00 | Turun sepanjang sumbu telunjuk ke dudukan (power2.inOut). Proxy menutup bagian belakang ring |

Jarak gelinding di halaman uji: dari −R sampai 40% lebar layar (±55% di desktop sesuai Storyboard; mobile 40%). Bayangan kontak di alas belum dibuat. Usulan: elips blur CSS di bawah ring, opasitasnya mengikuti jarak ke alas.

**Bukti** (`renders/s06/`, layar 1440×900):
- `s06-p1.00.png` dan `s06-p1.00-zoom.png`: overlay pose akhir di atas foto
- `s06-p0.90.png` dan `s06-p0.90-zoom.png`: ring sedang turun, bagian belakang tertutup proxy
- `s06-p0.90-proxy-debug.png`: proxy ditampilkan merah
- `s06-p0.00` sampai `s06-p0.75`: jalur gelinding dan pose

## Gold dan Lamp final (D-079)

- `gold` di `finishes.json` = opsi B. Opsi A dan C tidak aktif lagi; nilainya disimpan di `_archive` dalam `finishes.json` sebagai catatan, dan render lamanya tetap di `renders/gold-options/`.
- `env/v2-env-lamp.exr` di-bake ulang: lampu ±3500 K (dulu ±2700 K oranye), dinding pantul krem, dan dasar ruang hangat-netral. Suasana 22:00 tetap hangat, tapi Gold tidak lagi kecokelatan. Ukuran 91 KB (sebelumnya 97 KB).
- Pembanding env Lamp baru (`renders/lamp-v2/`): `sheet-lamp.png` (atas Blender, bawah Three.js; Silver / Black / Gold), file per finish `blender-*-lamp.png` dan `web-*-lamp.png`, serta `web-gold-paper.png`.
- Di Blender, bagian gelap Gold sedikit lebih zaitun daripada di Three.js. Acuannya tampilan web.

Fallback S01–S03 dirender ulang dengan pose web-v2 (kamera `Cam_WebPose` di `.blend`, dihitung dari Euler three.js `YXZ` → kamera Blender, jarak sama dengan stage web).

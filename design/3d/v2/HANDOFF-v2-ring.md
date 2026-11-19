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
| Gold | Emas kuning 18K (F0 ±0,95/0,74/0,36 linear), roughness 0,17 | Dipasangkan dengan env Lamp (D-069: Gold → Lamp light) |

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
| `lamp` | Lampu tungsten hangat + pantulan dinding | S10 Gold |

Transisi antar env: crossfade dua env (render dua kali tidak perlu). Cukup tween `scene.environmentIntensity` turun → ganti env → naik dalam ±0,4 detik scroll, atau lerp warna latar CSS bersamaan.

### Cadangan pose kunci (`fallback/`, 3D-7)
PNG transparan 1024 px (master, ±0,5–0,8 MB) dan WebP q82 (12–36 KB, **total ±420 KB untuk 16 file**). Dipakai untuk poster loading, reduced motion, dan WebGL gagal; muat per section.

| File | Pose | Env |
| --- | --- | --- |
| `fb-s01-34`, `fb-s01-front` | S01 3/4 dan menghadap kamera, LED hijau samar | paper |
| `fb-s02-34` | S02 3/4 | paper |
| `fb-s03-rim` | S03, hanya tepi kena cahaya dingin | night |
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

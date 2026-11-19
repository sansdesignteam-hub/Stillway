# Handoff: ring acuan V2 (tahap 1)

Dari: 3D Designer · Untuk: Developer (`web-v2/`), Visual Director · 19 November 2026
Status: **draf, menunggu tinjauan pengguna** (D-061, D-062, D-070). Finish Black/Gold, HDRI, dan aset lain menyusul di tahap 2.

## File

| File | Isi |
| --- | --- |
| `stillway-ring-v2-silver_web.glb` | Model web, **120 KB**, Draco, ±43 rb segitiga, 10 mesh. Satuan meter (Ø luar 23,8 mm, lebar 8 mm). Tanpa UV dan tekstur. LED mati. |
| `stillway-ring-v2.blend` | File kerja Blender 5.3. Collection `Stillway_Ring` (model), kamera render `Cam_*`, `Engrave_Cutter` (tersembunyi, untuk mengedit logo), mesh cadangan `Ring_Shell_V1_orig` (fake user). |
| `renders/*.png` | Render acuan 2048 px, latar netral, LED hijau menyala. Lihat tabel di bawah. |

File V1 di `design/3d/ring/` tidak diubah.

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
ledMain.emissiveIntensity = 8;            // usulan 6–12 dengan tone mapping AgX; 0 = mati
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

## Catatan material web

- Di Blender, `Ring_Silver` memakai brushed asli (anisotropi + bump halus searah keliling). Di GLB anisotropi **sengaja dimatikan**, karena model tanpa UV/tangent dan anisotropi Three.js butuh tangent. Di web finish tampil sebagai satin (roughness 0,26). Brushed untuk web (UV + tekstur/anisotropi) bisa ditambahkan di tahap 2 jika dibutuhkan.
- Pantulan butuh `scene.environment` (env V1 `hero-test/env.jpg` bisa dipakai sementara; HDRI studio V2 di tahap 2).

## Render acuan (`renders/`)

| File | Kamera (`.blend`) | Untuk |
| --- | --- | --- |
| `v2-ring-logo-closeup.png` | `Cam_LogoCloseup` | Close-up logo seperti referensi |
| `v2-ring-hero-pose.png` | `Camera` | Pose hero (sama dengan pratinjau V1) |
| `v2-ring-ref-34.png` | `Cam_Ref34` | **RING_REF** Visual Director: 3/4 sisi luar, logo terbaca |
| `v2-ring-front.png` | `Cam_Front` | Tampak depan (melalui lubang) |
| `v2-ring-side.png` | `Cam_Side` | Tampak samping (band dari tepi, 90° dari logo) |
| `v2-ring-upright-10.png` | `Cam_Upright10` | Permintaan VD no. 4, tafsiran A: ring berdiri, logo menghadap kamera, teks vertikal dibaca dari bawah ke atas, kamera 10° dari atas |
| `v2-ring-axis-vertical-10.png` | `Cam_AxisVertical10` | Permintaan VD no. 4, tafsiran B: sumbu ring vertikal (seperti di jari yang terangkat), kamera 10° dari atas. Di pose ini teks jadi **horizontal** |

Permintaan no. 4 berisi dua syarat yang tidak bisa terpenuhi bersamaan: sumbu vertikal dan teks dibaca dari bawah ke atas. Karena itu disediakan dua tafsiran. Visual Director/pengguna memilih salah satu untuk pose akhir S06.

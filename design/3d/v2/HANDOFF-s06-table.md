# Handoff: meja kayu pinus S06 (D-144)

Dari: 3D Designer · Untuk: Developer (`web-v2/`), lewat Project Manager · 24 November 2026
Status: **draf, menunggu tinjauan pengguna.** Brief: `BRIEF-3d-s06-wood.md` (checkout Project Manager).

## File

| File | Isi |
| --- | --- |
| `s06-table.glb` | Model web, **492 KB** total: 1 mesh `S06_Table`, 188 segitiga, UV atlas, material `S06_Table_Pine` (base color + metallicRoughness + normal, 2048² WebP di dalam GLB, `EXT_texture_webp`). Single-sided. |
| `tex/s06-table-{basecolor,roughness,normal}.webp` | Tekstur yang sama, terpisah (275 / 102 / 106 KB). Roughness ada di kanal G (glTF ORM, metal = 0 di B). |
| `renders/s06-table-review.png` | Tinjauan 1440×900: ring di tengah meja (x 420 layar), sedang menggelinding. |
| `renders/s06-table-review-edge.png` | Tinjauan 1440×900: ring tepat di tepi kanan meja (x 708 layar). |
| `s06-table.blend` | File kerja Blender 5.3. Scene `Scene` = aset, scene `S06_Table_Review` = kamera S06 + ring + GLB meja yang diimpor ulang. Render tinjauan memakai GLB hasil ekspor, jadi yang terlihat di render sama dengan aset web. |
| `s06-table-build.py` | Skrip pembuat semua file di atas (geometri, tekstur, ekspor, render). |

Ring (`stillway-ring-v2-silver-polished_web.glb`, `silver_polished`) tidak diubah.

## Ukuran dan titik acuan

Satuan GLB **meter**, skala nyata yang sama dengan ring (Ø luar 23,84 mm). Sumbu three.js (Y ke atas):

| | Nilai |
| --- | --- |
| **Origin** | titik tempat ring meninggalkan meja: permukaan atas (y 0), **tepi kanan (x 0)**, kedalaman jalur ring (z 0) |
| Lebar (x) | −0,200 … 0 m (200 mm, sisi kiri keluar bingkai) |
| Tebal (y) | −0,030 … 0 m (30 mm) |
| Dalam (z) | −0,1168 (belakang) … +0,0332 m (depan, menghadap kamera) |
| Bevel | 0,8 mm, 3 segmen, di semua tepi. Permukaan datar berakhir di x −0,8 mm. |

### Penempatan di stage (kamera S06: FOV 30°, z = H/2 / tan 15°)

```js
const s = D / 0.02384;                 // D = diameter ring di layar (px), skala yang sama dengan ring
table.scale.setScalar(s);
table.position.set(0, ringCentreY - D / 2, 0);   // px dari tengah layar, y ke atas; x 0 = tepi di tengah layar
// ring menggelinding di z = 0 (band 8 mm → z ±4 mm, masih di atas meja)
```

- Tepi kanan selalu tepat di x 720 (1440) atau di tengah layar mana pun, karena origin di x 0 dan kamera melihat lurus ke sumbu z.
- Komposisi render (meniru Figma State 1, 1440×900): **D = 320 px, garis kontak di y layar 740** (`ringCentreY = −130`). Dengan itu tepi belakang meja jatuh di y layar ±600 (seperti Figma) dan tepi depan di ±845, jadi sisi depan terlihat sebagai pita tipis di bawah.
- Rumus bila D atau tinggi kontak berubah (c = jarak garis kontak di bawah tengah layar, px; camZ = H/2 / tan 15°; k = D / 23,84 px per mm):
  - y layar tepi belakang = H/2 + c · camZ / (camZ + 116,8 · k)
  - y layar tepi depan = H/2 + c · camZ / (camZ − 33,2 · k)
- **Titik jatuh:** ring mulai miring saat pusatnya melewati x ≈ −0,8 mm · k (±11 px pada D 320) dan lepas dari meja di x 0. Pusat ring di tepi = (0, ringCentreY, 0).
- Lebar 200 mm cukup sampai layar ±2700 px lebar pada komposisi ini. Mobile memakai rumus yang sama (meja ikut D).

## Serat

- Arah serat **sepanjang sumbu X** (arah gelinding), lurus dan halus. Pinus terang dengan latewood amber tipis; cincin tumbuh ±1,5 mm (pinus tumbuh lambat), lebarnya tidak seragam.
- Serat dibuat sebagai medan cincin 3D di sekitar empulur kayu, jadi tiap sisi konsisten seperti satu papan asli:
  - **Atas:** flat-sawn. Garis lurus di depan dan di jalur gelinding, katedral lembut di belakang.
  - **Depan:** edge grain. Garis lurus lebih rapat, sedikit lebih hangat dan gelap dari atas. Ini sisi "yang sedikit berbeda" di brief. Serat ujung (end grain) secara fisik hanya bisa muncul di ujung papan, karena serat berjalan kiri–kanan seperti di Figma.
  - **Kanan (tepi jatuh):** end grain, berupa busur cincin, lebih gelap dan kasar. Dari kamera S06 bidang ini tegak lurus layar, jadi yang terlihat hanya bevel sebagai garis tipis di x 720.
- Satu mata kayu kecil (oval ±6 × 9 mm, warna diredam) di x −55, z −47 mm, di belakang jalur gelinding dan kiri dari titik berhenti. Ring tidak melewatinya.
- Kerapatan tekstur: 0,098 mm/texel di atas dan depan, 0,125 mm/texel di kanan.

## Material dan pencahayaan (yang dipakai di render)

- Pakai material dari GLB apa adanya (`MeshStandardMaterial`; GLTFLoader sudah mengatur sRGB/linear). Normal map berkonvensi OpenGL, tangent dihitung dari UV (tanpa atribut `TANGENT`). Roughness 0,42–0,70 (latewood lebih licin), metal 0.
- **Penting:** set `tex.anisotropy = renderer.capabilities.getMaxAnisotropy()` untuk ketiga tekstur. Meja dilihat dari sudut rendah, jadi tanpa ini serat di belakang jadi kabur.
- Renderer: AgX, exposure 1,0, env `paperPolished` intensitas 1,0 (sama dengan ring di S06).
- **Key** = `DirectionalLight('#FFE6C7', ±2,5–3)` dari (−600, 900, 700) px relatif ke target di origin (kiri atas, sedikit di depan). Render memakai sun 3,2 dengan sudut lunak 4°.
- **Fill** = `HemisphereLight('#FFF1DC', '#D9CCB8', ±0,75)`. Env polished punya langit-langit gelap, jadi tanpa fill permukaan atas meja jadi abu-abu. Hemisphere hanya menambah cahaya difus, sehingga pantulan ring tidak berubah. Dengan key dan fill ini, rata-rata warna kayu di render (207, 194, 180) hampir sama dengan Figma (213, 198, 178).
- **Bayangan kontak ring di meja:**
  1. `castShadow` pada ring, `receiveShadow` pada meja, `PCFSoftShadowMap`, mapSize 2048, kamera bayangan ortografik yang rapat di sekitar jalur ring (±1,2 D), `shadow.radius` ±4, `normalBias` kecil. Bayangan jatuh ke belakang-kanan ring seperti di render.
  2. Tambahkan bayangan kontak lunak tepat di titik sentuh (plane kecil dengan gradasi radial gelap, opacity ±0,35, lebar ±0,5 D, tinggi ±0,06 D, ikut posisi x ring; `depthWrite` false, sedikit di atas permukaan). Shadow map saja tidak memberi gelap rapat di kontak yang terlihat di render.
  3. Saat ring lewat tepi dan jatuh, pudarkan bayangan kontak dalam ±0,05 D gerak.

## Belum dikerjakan / terbuka

- Jejak gerak (salinan ring transparan) dan animasi jatuh adalah tugas Developer (brief `BRIEF-dev-s06-roll-fall.md`); tidak ada di render ini.
- Bila Developer memakai D atau tinggi kontak lain dari Figma, posisi tepi belakang/depan ikut rumus di atas. Tidak perlu aset baru.
- Bila pengguna ingin serat lebih rapat atau lebih jarang, mata kayu dihapus, atau warna lebih pucat, ubah parameter di bagian atas `s06-table-build.py` (`RING_MM`, `KNOT_*`, `EARLY`/`LATE`) lalu jalankan ulang `textures()` dan `export()`.

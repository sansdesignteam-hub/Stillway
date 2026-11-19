# Rencana 3D untuk Website V2

Dari: 3D Designer · Untuk: pengguna, Claude Code (koordinator), Developer, Visual Director · 19 November 2026
Status: **usulan, belum disetujui.** Belum ada perubahan model. Pemodelan baru dimulai setelah pengguna menjawab pertanyaan di §6.

Sumber: `Storyboard.md` (§2 per section, §3 sambungan, §4 aset, §5 feedback 02, §6 hal terbuka), `Moodboard.md` (§2.3 warna lampu, §4 logo), D-059, D-060, dan handoff V1 `HANDOFF-hero-ring.md`. Jika berbeda, Figma "Website AI - 1 Ring" yang dipakai.

V1 (`web/`) dibekukan. Semua file baru V2 masuk ke `design/3d/v2/` dan memakai nama baru (`stillway-ring-v2*.glb`). File V1 di `design/3d/ring/` tidak ditimpa.

---

## 1. Titik awal: model V1

`ring/stillway-ring-silver_web.glb` (78 KB, Draco). Ukuran nyata dalam meter.

| Bagian | Isi | Segitiga |
|---|---|---|
| `Ring_Shell` | Badan perak, Ø luar 23,8 mm, lebar 8 mm, tepi chamfer | 20.992 |
| `Ring_Liner` | Bagian dalam hitam matte | 13.824 |
| `Sensor_A_*` | Bingkai + kaca + LED hijau, dinding dalam | 2.496 |
| `Sensor_B_*` | Bingkai + kaca + LED merah, dinding dalam | 2.496 |
| `Contact_1/2` | 2 pad logam (pengisian daya) | 960 |
| **Total** | 10 mesh, 7 material, **tanpa UV dan tanpa tekstur** | **±40.800** |

Kesimpulan: bentuk dasar sudah sesuai §4 Storyboard (perak, chamfer, dalam hitam matte, jendela sensor, 2 pad). Yang belum ada: **logo engraving**, **UV di badan luar** (syarat engraving), **LED yang bisa berganti warna**, **finish Black dan Gold**, dan **environment map netral** (V1 memakai foto hero sebagai pantulan).

Catatan: di worktree ini ada perubahan `.blend` dan `_preview.png` yang belum di-commit dan bukan bagian tugas ini. Tidak saya sentuh dan tidak ikut commit.

---

## 2. Kebutuhan per section

Label kolom **Model**: ✅ V1 bisa dipakai apa adanya · 🔧 perlu perubahan · 🆕 perlu aset baru. Semua section memakai **satu model** dengan logo, sesuai §4 Storyboard.

| # | Kebutuhan 3D | Model | Yang dibutuhkan | Pekerjaan 3D Designer | Pekerjaan Developer |
|---|---|---|---|---|---|
| 01 Hero | Besar di tengah, napas ±2%; miring lalu berputar menghadap kamera; kilau tepi ikut cahaya pagi | ✅ + 🔧 logo | Env map **Day** (studio krem hangat) menggantikan foto hero. Tanpa bayangan di batu (latar Paper + Dawn glow) | Env Day, pose awal/akhir, rig cahaya Day | Tween pose, skala napas |
| 02 Why Stillway | Tengah, sudut 3/4, berputar pelan sampai hampir menghadap kamera | ✅ | Rig Day yang sama | Pose 3/4 dan pose akhir | Rotasi Y mengikuti scroll |
| 03 Sleep summary | Latar Night; hanya tepi ring yang kena cahaya dingin dari satu sisi; pindah ke kiri | ✅ | Rig **Night-rim**: env sangat redup + 1 directional dingin dari belakang-samping (rim). Warna rim untuk cahaya produk, bukan UI | Setel rig rim | Transisi rig 02 → 03 (lerp intensitas ±1 detik scroll) |
| 05 Daily insight | Ring membesar sampai kamera masuk ke lubang ring; kartu app di dalam lubang | 🔧 | Badan dalam (liner) dan chamfer harus tetap halus saat memenuhi layar. Kartu app = UI HTML di atas canvas (bukan tekstur) | Uji close-up; jika permukaan dalam terlihat bersudut, naikkan segmen liner/shell (perkiraan +10–15 rb segitiga) atau versi LOD close-up | Animasi kamera dolly (FOV tetap), near plane cukup kecil, rig **Dusk** (ochre → night) |
| 06 Product details | Gelinding di alas Sand → sisi samping (±90°) → dari tepi (45°) → turun dari ujung jari ke pangkal jari dan menyatu dengan tangan | 🔧 + 🆕 | (a) Rotasi gelinding = jarak / jari-jari (r = 11,9 mm skala layar) agar tidak meluncur; overshoot + goyang balik. (b) Bayangan nyata di alas (satu shadow map). (c) **Foto tangan cut-out** (Visual Director, §4 Storyboard). (d) **Proxy jari** tak terlihat (silinder depth-only, `colorWrite: false`) yang dicocokkan ke foto, sehingga bagian belakang ring tertutup jari | Kurva gelinding, posisi logo saat berhenti ("logo di atas"), proxy jari + pose akhir yang cocok dengan foto, bayangan kontak di jari | Scroll scrub maju-mundur, shadow map hanya aktif di section ini |
| 08 Features | Kamera dekat ke jendela sensor (ring besar di kanan, 3/4); lampu hijau #34E07A → biru #3B8CFF → ungu #A06BFF; flare tipis; cahaya memantul ke permukaan dalam; bagian lain normal | 🔧 | (a) Material LED dengan `emissive` yang warnanya di-lerp per scroll (hijau penuh 25–50%, ke biru 50–75%, ke ungu 75–100%). (b) **Flare**: sprite additive kecil di depan kaca sensor (murah, tanpa post-processing). (c) **Pantulan ke dalam ring**: `PointLight` kecil berwarna sama di depan sensor, jangkauan ±6 mm. (d) Rig **Night + Ember** | Pisahkan LED jadi satu material bersama; tekstur flare (PNG 128 px); setel intensitas | Lerp warna mengikuti scroll; sambungan 08 → 09 (ungu redup → hijau sesaat → ring keluar ke atas) |
| 10 Finishes & pricing | Drag/swipe 360° hanya rotasi (tanpa zoom), tombol ‹ ›, kembali ke pose awal setelah diam; ganti bahan Silver / Black / Gold (warna + kilap); Gold memakai **Lamp light** | 🔧 | 3 preset material untuk `Ring_Shell` (logo tetap terbaca di semua finish), rig **Lamp** (hangat) | Preset material Black dan Gold + rig Lamp, render pembanding per finish | Kontrol drag (rotasi Y + sedikit X, inersia, idle ±4 detik → kembali), `pointer-events` aktif hanya di area ring section ini |
| 11 Closing | Di tengah di belakang teks, mengecil, lalu keluar ke atas bersama glow; finish dari Section 10 ikut terbawa | ✅ | Rig Night + Ember (sama dengan CTA V1 D-052, LED menyala sesuai keputusan §6) | Pose dan rig (turunan CTA V1) | Tween posisi ke atas, glow sebagai elemen CSS di belakang canvas |
| Semua | Logo "Stillway" tone-on-tone di sisi luar | 🔧 | Lihat §3 | — | — |

Section 04, 07, 09 **tanpa ring 3D** (ring hanya di foto atau tidak tampil). Loop render berhenti di section ini.

**Foto di 04 dan 07** harus memakai bentuk ring dan logo yang sama (§4 Storyboard). Usulan: setelah model V2 disetujui, saya menyediakan render acuan (turntable dan 6 sudut, latar netral) untuk Visual Director sebagai acuan image generation. Ini bukan aset web.

---

## 3. Logo engraving di ring

Usulan teknis (menunggu persetujuan logo, §6 pertanyaan 3):

- **Teknik**: laser-etch tone-on-tone dibuat sebagai **peta kekasaran + normal map tipis** pada badan luar, bukan geometri boolean. Bagian yang di-etch jadi sedikit matte dan sedikit lebih gelap, sehingga terlihat saat kilau lewat dan hilang di sudut tertentu, seperti etch asli.
  - Butuh UV silinder baru di `Ring_Shell` (V1 tidak punya UV).
  - Tekstur 2048 × 256 (strip keliling), KTX2/WebP: perkiraan **20–40 KB**.
  - Alternatif geometri (teks di-boolean ke shell): lebih "nyata" saat sangat dekat, tetapi menambah ±10–20 rb segitiga dan rawan artefak shading di permukaan melengkung. Tidak disarankan.
- **Isi dan ukuran (usulan)**: lockup ring mark + wordmark "Stillway" (Geist Medium, tracking −3%), tinggi huruf ±1,4 mm di band selebar 8 mm, panjang ±14 mm dari keliling 75 mm. Posisi di sisi luar, berseberangan dengan jendela sensor, agar terbaca saat ring menghadap kamera ("logo di atas" di Section 06, 25%).
- **Sumber**: perlu file vektor lockup (SVG) dari Visual Director / Figma Branding (`40004128:83`).

---

## 4. Anggaran performa (usulan)

Arsitektur yang disarankan: **satu canvas WebGL fixed** untuk seluruh halaman, satu renderer, satu model. Ring berpindah antar section lewat pose dan rig cahaya, sehingga sambungan tanpa potongan (§3 Storyboard) dan tidak ada beberapa konteks WebGL.

| Item | Anggaran | Catatan |
|---|---|---|
| Model GLB V2 (Draco) | ≤ 120 KB | V1 78 KB + UV + kemungkinan segmen ekstra untuk close-up 05 |
| Tekstur logo | ≤ 40 KB | KTX2 atau WebP |
| Env map | 3–4 × ≤ 100 KB | Day, Night/Ember, Dusk, Lamp; JPG/WebP 1024 × 512, dimuat lazy per section. Alternatif: 1 env + rig cahaya berbeda (lebih ringan, kurang variasi) |
| Flare sprite | ≤ 10 KB | |
| Foto tangan cut-out (S06) | ≤ 250 KB | Aset Visual Director, WebP dengan alpha |
| **Total payload 3D** | **≤ 0,7 MB** di luar `three` (±156 KB gzip di V1) | Tidak perlu `postprocessing`/bloom |
| Segitiga | ≤ 60 rb | V1 ±41 rb |
| Draw call | ≤ 12 | 10 mesh + flare + proxy jari (bisa digabung) |
| Bayangan | 1 shadow map 1024, hanya di S06 | Mati di section lain |
| DPR | maks 2 desktop, 1,5 mobile | Turunkan otomatis bila frame > 20 ms berturut-turut |
| Frame | 60 fps laptop menengah, ≥ 30 fps mobile menengah | V1 terukur ±165 fps di Chromium M-series |
| Render | Hanya saat ring tampil (S01–03, 05, 06, 08, 10, 11) | IntersectionObserver per section |
| Reduced motion / WebGL gagal | Reduced motion: pose diam per state + fade ±300 ms (tanpa aset tambahan). WebGL gagal: poster per section render dari Blender (±8 × ≤ 80 KB, lazy) | Poster dibuat setelah semua pose final |

Semua angka adalah perkiraan, belum diuji di perangkat asli.

---

## 5. Urutan kerja

| Tahap | Isi | Butuh dari | Hasil |
|---|---|---|---|
| 0 | **Persetujuan** rencana ini dan jawaban §6 | Pengguna | Keputusan dicatat Claude Code di `decisions.md` |
| 1 | Model V2: UV badan luar, LED satu material bersama, cek close-up liner | Jawaban §6 no. 1 | `v2/stillway-ring-v2.blend` + GLB |
| 2 | Logo engraving | SVG lockup + persetujuan logo (§6 no. 3) | Tekstur etch, render cek di 3 finish |
| 3 | Env map dan rig cahaya: Day, Night-rim, Dusk, Night + Ember, Lamp | — | `v2/env/*`, nilai rig |
| 4 | Halaman uji `v2/ring-test/` (seperti `hero-test`): semua pose per state + `?s=01..11&p=0..1`, transisi rig, LED 3 warna, drag S10, finish | — | Prototipe untuk tinjauan pengguna, bukan kode produksi |
| 5 | Section 06: kurva gelinding + proxy jari | Foto tangan cut-out final (Visual Director) | Pose akhir cocok dengan foto |
| 6 | Finish Black dan Gold | Persetujuan tampilan (§6 no. 4) | Preset material |
| 7 | Render acuan untuk foto S04/S07 + poster cadangan | Model final | `v2/renders/` |
| 8 | `v2/HANDOFF-v2.md` untuk Developer (`web-v2/`) | Tahap 1–7 disetujui | Handoff |

Tahap 3 dan 4 bisa dimulai tanpa menunggu logo (memakai model V1). Tahap 1 dan 2 menunggu jawaban §6.

---

## 6. Pertanyaan untuk pengguna

1. **Jendela sensor dan lampu (Storyboard §6 no. 2).** Model V1 punya dua jendela sensor (A hijau, B merah). Storyboard menyebut satu "jendela sensor" yang berganti warna hijau → biru → ungu, dan merah berarti mati.
   - Usulan: jendela A menyala dengan tiga warna, jendela B tetap gelap (tidak menyala). Merah tidak ditampilkan di 3D, cukup di copy, sesuai Storyboard.
   - Apakah cukup memperlakukan biru/ungu sebagai **lampu status mode** (visual saja) sampai ada konfirmasi tim hardware? Karena ini proyek konsep, "tim hardware" mungkin tidak ada; mohon dipastikan siapa yang memberi konfirmasi.
   - Apakah LED juga menyala di Section 11 (seperti CTA V1, oranye) atau mati? Oranye tidak ada di daftar warna lampu Moodboard §2.3, jadi usulan saya: **mati** atau **hijau redup**.
2. **Logo di ring (Storyboard §6 no. 3).** Apakah logo "Stillway" di ring sudah disetujui klien/pengguna? Jika ya:
   - Isi: lockup lengkap (ring mark + wordmark) atau wordmark saja? Usulan: lockup lengkap.
   - Posisi: sisi luar, berseberangan dengan sensor. Setuju?
   - Teknik: etch tone-on-tone lewat tekstur (usulan) atau geometri?
   - Mohon file vektor lockup (SVG) dari Figma Branding.
3. **Tangan di Section 06.** Usulan: tangan tetap **foto cut-out 2D** (aset Visual Director) dengan proxy jari 3D tak terlihat untuk menutup bagian belakang ring. Model tangan 3D tidak disarankan (berat, rawan tampak palsu). Setuju? Pose jari di foto harus menghadap kamera agar ring bisa diselaraskan.
4. **Finish Black dan Gold.** Usulan ilustratif: Black = logam hitam satin (kilap sedang), Gold = emas kuning hangat agak muda (bukan rose gold). Apakah ada acuan warna/kilap yang diinginkan?
5. **Env map**: 4 env per suasana (lebih realistis, ±400 KB) atau 1 env + rig cahaya berbeda (lebih ringan)? Usulan: 4 env, dimuat lazy.
6. **Mobile (Storyboard §6 no. 4)** memengaruhi 3D: apakah ring tetap satu canvas 3D di mobile untuk semua section, atau di section tertentu diganti poster diam? Keputusan ini sebaiknya diambil bersama Developer.

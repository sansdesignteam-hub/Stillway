# A-5 Tangan memegang ponsel, S09 "The app" (D-160)

Status: **dibuat dengan AI, menunggu tinjauan pengguna sebelum dipasang.** Dibuat 24 November 2026 oleh Visual Director. Brief: `design/v2/BRIEF-vd-s09-hand.md` (checkout Project Manager).

- **Alat:** `gpt-image-bridge` lewat `design/assets/v1/scripts/genref.sh` (Codex CLI `image_generation`, referensi dilampirkan). Backend model gambar dipilih oleh Codex. Prompt lengkap ada di `design/v2/scripts/s09-hand-phone.sh`.
- **Referensi:** pose dari `_work/refs/pose.png` (salinan `s09-ref-uh-vitals.png`, hanya untuk pose), kulit dan tangan dari `design/assets/v2/A-1-hand-left.png` (C-02, sawo matang, D-058).
- **Metode alpha:** AI membuat foto di atas latar putih polos dengan layar **hijau chroma**. `design/v2/scripts/s09-hand-phone-finish.py` lalu:
  1. meluruskan ponsel (A −0,07°, B +0,15°, C 0°);
  2. memperbesar ke 1600×2400 (Lanczos 1,5625×);
  3. mencocokkan persegi membulat ke area hijau dan membuat area itu transparan. Pil kamera tetap terlihat (opaque);
  4. mengubah latar putih menjadi transparan dengan unmixing warna di tepi (tidak ada halo putih di latar gelap).
- **Hasil cek:** tidak ada piksel hijau yang tersisa, tidak ada jari di atas layar, dan sudut layar bersih (dicek dengan latar magenta).

## File

| Variasi | Master (alpha) | Web (alpha) | Lapisan depan | Pose |
|---|---|---|---|---|
| **A** (utama) | `../A-5-hand-phone.png` 1600×2400 | `A-5-hand-phone-2400.webp` (1600×2400), `-1600.webp` (1067×1600) | `../A-5-hand-phone-front.png` + `-front-2400/1600.webp` | Tangan kiri seperti referensi Ultrahuman: ibu jari di tepi kiri, empat ujung jari di tepi kanan |
| B | `../A-5-hand-phone-b.png` 1600×2400 | `A-5-hand-phone-b-2400.webp`, `-1600.webp` | `../A-5-hand-phone-b-front.png` + webp | Tangan kanan, cermin A: ibu jari di kanan, tiga ujung jari di kiri |
| C | `../A-5-hand-phone-c.png` 1600×2400 | `A-5-hand-phone-c-2400.webp`, `-1600.webp` | tidak ada (tidak ada jari di depan bingkai) | Tangan kiri, pegangan lebih rendah; ponsel lebih banyak terlihat |

Angka di nama file webp adalah **tinggi** gambar. Ukuran file: master PNG sekitar 1,3–1,7 MB, webp-2400 sekitar 120–155 KB, dan webp-1600 sekitar 78–104 KB.

Pratinjau untuk tinjauan pengguna (bukan untuk web): `_preview/A-5-overview.png` (tiga variasi, layar gelap di atas Paper dan Ink) dan `_preview/<file>-preview.png` (Paper, Ink, serta lapisan depan disorot magenta).

## Koordinat layar untuk Developer

Satuan: piksel gambar 1600×2400 (x ke kanan, y ke bawah, dari pojok kiri atas). Persentase dihitung terhadap lebar/tinggi gambar. Radius sudut layar berbentuk lingkaran (sama untuk x dan y).

| Variasi | x | y | lebar | tinggi | radius | % (left / top / width / height) | Rasio t/l |
|---|---|---|---|---|---|---|---|
| **A** | **425** | **155** | **764** | **1595** | **78,5** | 26,563 / 6,458 / 47,750 / 66,458 | 2,09 |
| B | 403 | 175 | 784 | 1613 | 100,7 | 25,188 / 7,292 / 49,000 / 67,208 | 2,06 |
| C | 436 | 157 | 723 | 1553 | 95,6 | 27,250 / 6,542 / 45,188 / 64,708 | 2,15 |

**Pil kamera** (bagian dari gambar dan tetap opaque, jadi status bar UI harus memberi ruang untuk pil ini). Format x, y, lebar, tinggi:
- A: 714, 173, 189 × 56
- B: 676, 199, 239 × 65
- C: 698, 181, 214 × 63

**Bingkai luar ponsel** (x, y, lebar, tinggi, radius; tebal bezel):
- A: 410, 140, 794 × 1625, r 93,5; bezel 15
- B: 381, 153, 828 × 1657, r 122,7; bezel 22
- C: 421, 142, 753 × 1583, r 110,6; bezel 15

Rasio layar sedikit lebih lebar dari 19,5:9 (2,17). Ini mengikuti hasil AI. Saran: UI HTML sebaiknya fleksibel secara vertikal (padding atas/bawah), bukan memakai tinggi tetap.

### Jari di depan bingkai

Tidak ada jari yang menutup layar di variasi mana pun. Ada ujung jari yang menumpuk **bingkai luar** (bezel hitam). Bagian itu dipisahkan ke lapisan `-front`:

- **A:** tiga ujung jari di tepi kanan, x 1183–1210, y 990–1467 (selebar ±25 px, hanya menyentuh garis bingkai).
- **B:** ibu jari di tepi kanan, x 1187–1215, y 859–1087; tiga ujung jari di tepi kiri, x 375–405, y 1063–1535.
- **C:** tidak ada, sehingga lapisan depan tidak diperlukan.

Lapisan depan berukuran sama (1600×2400) dan berada di posisi yang sama, jadi cukup ditumpuk tepat di atas master.

### Urutan lapisan yang disarankan

```
z1  UI HTML app (D-159)        di dalam persegi layar, border-radius = radius × skala
z2  A-5-hand-phone.webp         tangan + ponsel, layar transparan
z3  tab pill kaca               menumpuk bagian bawah ponsel/tangan
z4  A-5-hand-phone-front.webp   ujung jari di depan bingkai (opsional; tanpa ini pill menutup ujung jari)
```

Contoh CSS (skala dari lebar kontainer):

```css
.s09-phone { position: relative; aspect-ratio: 1600 / 2400; container-type: inline-size; }
.s09-phone > * { position: absolute; }
.s09-phone .hand, .s09-phone .front { inset: 0; width: 100%; height: 100%; }
.s09-phone .screen {            /* variasi A */
  left: 26.5625%; top: 6.4583%; width: 47.75%; height: 66.4583%;
  border-radius: calc(78.5 / 1600 * 100cqw);
  overflow: hidden;
}
```

**Tepi bawah:** pergelangan tangan keluar lurus dari tepi bawah gambar dan terpotong keras, tanpa fade. Tempelkan gambar ke tepi bawah section. Kalau gambar harus mengambang, pakai mask di CSS, misalnya `mask-image: linear-gradient(to bottom, #000 85%, transparent)`.

## Catatan proses

- Ketiga variasi berasal dari run pertama, tanpa edit AI dan tanpa retouch manual. Raw asli (1024×1536) ada di `_work/raw-a.png`, `raw-b.png`, dan `raw-c.png`.
- Resolusi: model menghasilkan 1024×1536, lalu diperbesar 1,5625× ke tinggi 2400. Detail kulit masih tajam pada ukuran tampil di web (±600–900 px CSS). Untuk tampilan di atas 1600 px fisik, gambar akan sedikit lembut.
- Bulu halus lengan di tepi kiri/kanan pergelangan dipertahankan. Celah latar putih di antara bulu dibuang supaya tidak terlihat garis putih di latar gelap.
- Anatomi sudah dicek pada crop penuh: A memiliki ibu jari dan 4 jari, B dan C memiliki ibu jari dan 3–4 jari yang terlihat. Tidak ada cincin, jam, maupun logo.

---

# A-6 Foto latar layar Recovery, S09 "The app" (D-163)

Status: **dibuat dengan AI, menunggu tinjauan pengguna sebelum dipasang.** Dibuat 24 November 2026 oleh Visual Director. Brief: `design/v2/BRIEF-vd-s09-recovery-bg.md` (checkout Project Manager).

Foto penuh layar di belakang dial/gauge Recovery. Tangan C-02 (sawo matang, seperti A-1) beristirahat dan memakai **satu ring Stillway Silver polished** (D-061, D-085) di jari manis. Latar berupa gradasi lembut cocoa gelap ke ungu-plum (warna mode Recovery #A06BFF dibenamkan ke Night/Cocoa), dengan cahaya hangat dari samping seperti lampu tidur dan kontras sedang. Tidak ada teks, logo, atau watermark. Rasa diambil dari `s09-ref-oura-recovery-photo.png`, tetapi gambar itu **tidak dilampirkan** ke model supaya merek dan teksnya tidak ikut, dan komposisinya juga tidak ditiru.

## File

| Variasi | Master PNG | Web (WebP q84) | Isi |
|---|---|---|---|
| A | `../A-6-recovery-bg-a.png` 1290×2796 | `A-6-recovery-bg-a-1290.webp` (1290×2796, ±105 KB), `-860.webp` (860×1864, ±49 KB) | Tangan kiri telungkup dari kiri bawah, punggung tangan menghadap kamera. Cahaya hangat dari kiri. Ukiran **"Stillway"** terlihat (dua L benar, huruf "y" melengkung di tepi band). Ring tampak perak hangat karena memantulkan cahaya lampu. |
| B | `../A-6-recovery-bg-b.png` 1290×2796 | `A-6-recovery-bg-b-1290.webp` (±62 KB), `-860.webp` (±26 KB) | Tangan kanan miring dan setengah terbuka dari kanan bawah. Rim light hangat dari kanan, lebih gelap dan lebih "malam". Ring terlihat tiga-perempat dengan pantulan ungu. Ukiran menghadap ke dalam, jadi band terlihat polos (D-073). |

**Angka di nama file webp adalah lebar** (berbeda dengan A-5, yang memakai tinggi). Master PNG berukuran sekitar 4 MB karena grain halus. Pakai webp untuk web.

**Ruang UI:** sekitar 0–50% tinggi atas hanya berisi gradasi gelap tanpa detail, jadi aman untuk dial dan angka putih. Tangan mulai sekitar 52% (A) dan 56% (B) tinggi. Pada mock, kalimat di bawah dial (y ≈ 1390 dari 2796) belum menyentuh jari A. Sisi kiri/kanan foto boleh terpotong sedikit (`object-fit: cover`) karena tangan dan ring berada di tengah 70% lebar.

Pratinjau untuk tinjauan pengguna (bukan untuk web): `_preview/A-6-recovery-bg-preview.png` menampilkan foto polos dan **mock dial** (busur 240° dengan skala 0–100, angka 64 = HRV hari ini dari `copy.ts` bars[6] × 80, Geist). Mock dial ini hanya ilustrasi; desain dial dibuat Developer (D-163).

## Proses dan prompt

- **Alat:** `gpt-image-bridge` lewat `design/assets/v1/scripts/genref.sh` (Codex CLI `image_generation`, referensi dilampirkan dengan `-i`). Codex memilih backend model gambar. Diminta 1024×2224, model mengembalikan **851×1848** (sudah 9:19,5).
- **Prompt lengkap:** `design/v2/scripts/s09-recovery-bg.sh` (BASE + AVOID + variasi A/B). Raw: `_work/recovery/raw-a.png`, `raw-b.png`. Keduanya dari run pertama, tanpa edit AI dan tanpa retouch.
- **Referensi:** (1) `design/assets/v2/A-1-hand-left.png` untuk kulit dan tangan C-02; (2) `../everyday/_work/refs/finishes.png` untuk finish Silver polished (hanya ring kiri); (3) `../everyday/_work/refs/logo.png` untuk geometri band dan ukiran.
- **Finishing:** `design/v2/scripts/s09-recovery-bg-finish.py`: crop tengah 9:19,5 (hanya ±3 px), Lanczos 1,516× ke 1290×2796, unsharp ringan, dan grain luminans halus. Tidak ada perubahan warna/exposure. Skrip yang sama membuat pratinjau mock dial.
- **Pemeriksaan:** crop resolusi penuh. A dan B sama-sama memiliki ibu jari + 4 jari, dan ring berada di jari manis. Ukiran A terbaca "Stillway". Tidak ada teks atau logo lain.

## Batasan

- Resolusi asli 851 px lebar, di-upscale 1,5× ke 1290. Pada ukuran ponsel di web (±300–430 px CSS), hasilnya tajam. Pada crop penuh, kulit sedikit lembut.
- Ukiran pada A lebih kontras daripada tone-on-tone di render 3D, sama dengan catatan A-11b. Ukiran AI tidak bisa diatur persis.
- Ring pada A bernuansa perak hangat/champagne karena cahaya lampu. Ini masih perak polished (selaras D-137), tetapi perlu dicek pengguna apakah sudah terbaca Silver.
- Ring bukan produk nyata; ini aset ilustratif untuk portofolio.

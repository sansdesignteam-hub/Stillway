# Aset meta website V2 — favicon dan og:image (QA G-06)

Status: **usulan, menunggu tinjauan pengguna.** Dibuat 23 November 2026 oleh Visual Director atas tugas PM (dasar D-122, QA G-06). `web-v2/` tidak diubah; Developer yang memasang.

## File

| File | Ukuran piksel | Ukuran file | Pakai |
|---|---|---|---|
| `favicon.svg` | viewBox 32×32 | 1 KB | `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` |
| `favicon-32.png` | 32×32 (RGBA) | 1,8 KB | `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">` (cadangan browser tanpa SVG) |
| `apple-touch-icon.png` | 180×180 (RGB, tanpa transparansi) | 7 KB | `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` |
| `og-image.jpg` | 1200×630 | 150 KB | `og:image`, `twitter:image` (`twitter:card` = `summary_large_image`) |

## Favicon

- Huruf "S" dari logo teks Stillway, **Geist Medium (wght 500)**. Logo = teks tanpa ring mark (D-083, Moodboard §4).
- Ink #231F20 di atas Paper #F9F5EF (Moodboard §2.1). Tile Paper dengan radius 7/32 agar tetap terbaca di tab gelap.
- SVG memakai outline glyph asli (path), jadi tidak bergantung pada font. Tinggi huruf 22/32; di 16 px tebal garis ±1 px dan masih terbaca.
- Apple touch icon dibuat penuh tanpa sudut membulat (iOS membulatkan sendiri), huruf setinggi 104/180.

## og:image

- **Sumber:** `design/3d/v2/renders/s01-polished/s01-polished-landed-p1.png` (render three.js S01 dari GLB ring acuan V2 dengan material `silver_polished` di atas latar Hero, D-071/D-085). Bukan gambar AI, jadi ring dan engraving "Stillway" sama dengan ring acuan dan logonya bersih (D-073). Pantulan lumut tetap ada sesuai D-118; ring tetap terbaca silver.
- **Crop 1:1** (x 120–1320, y 150–780 dari render 1440×900), tanpa resample, sehingga ring tetap tajam. Overlay debug di kiri bawah render berada di luar crop.
- **Wordmark "STILLWAY"**: kapital, Geist Medium, tracking −3% (aturan Display 1), lebar dari margin 40 sampai 1160 seperti hero (x 40–1400 di 1440). Warna Paper.
- **Scrim**: Night #1B0B06 dari atas (±42% di tepi atas, habis di ±62% tinggi) ditambah redup 10% merata, seperti lapisan gelap hero live, agar wordmark terang terbaca di dinding plaster.
- Ring berada di tengah sehingga tetap terlihat bila platform memotong gambar jadi persegi.
- Satu-satunya teks: "STILLWAY" (bahasa Inggris). Tidak ada harga atau tagline; `og:title` dan `og:description` diisi Developer.

## Membuat ulang

Script: `design/v2/scripts/meta-og.py` dan `design/v2/scripts/meta-favicon.py` (Python + Pillow, numpy, fontTools).
Font: instance wght 500 dari `geist-latin-wght-normal.*.woff2` (paket npm `geist`), dibuat dengan `fontTools.varLib.instancer`.

```sh
python meta-og.py <s01-polished-landed-p1.png> Geist-Medium.ttf og-image.jpg 0.42 120 150
python meta-favicon.py Geist-Medium.ttf <folder-output>
```

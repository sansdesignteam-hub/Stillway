# Latar Hero S01 V2 — outpaint (D-080)

Status: **AI-generated (outpaint + refine detail), foto asli di tengah identik piksel; menunggu tinjauan pengguna.** Dibuat 19 November 2026 oleh Visual Director.

- **Sumber:** `design/3d/hero-bg/H-01-hero-bg-noshadow.png`, 2556×1448, tanpa bayangan ring (D-051). Ini latar Hero V1.
- **Tujuan:** ring zoom in sementara latar foto zoom out (pola oryzo.ai). Skala latar bisa turun dari 1,0 ke ±0,45 tanpa tepi kosong.
- **Alat:** `gpt-image-bridge` (`design/assets/v1/scripts/genref.sh`, Codex `image_generation`), ditambah script di `design/v2/scripts/`:
  `hero-outpaint.sh` → `hero-composite.py` → `hero-tiles.py split` → `hero-refine.sh` → `hero-tiles.py merge`.

## File

| File | Ukuran | Pakai |
|---|---|---|
| `H-01-hero-bg-v2-outpaint-5760x3840.png` | 5760×3840 (3:2), 26 MB | Master |
| `hero-bg-v2-5760.webp` | 5760×3840, q80, 1,5 MB | Web desktop retina |
| `hero-bg-v2-3840.webp` | 3840×2560, q80, 0,9 MB | Web desktop DPR 1 (semua koordinat × 2/3) |
| `hero-bg-v2-mobile-2160x3840.webp` | 2160×3840 (9:16), q80, 0,5 MB | Web mobile; crop tengah master |
| `hero-bg-v2-mobile-1080x1920.webp` | 1080×1920, q80, 0,2 MB | Web mobile ringan (koordinat × 1/2) |

## Posisi foto asli (untuk Developer)

**Master / `hero-bg-v2-5760.webp` (5760×3840):**

| | px | relatif terhadap kanvas |
|---|---|---|
| Offset foto asli (kiri, atas) | **(1602, 1196)** | left 27,8125% · top 31,1458% |
| Ukuran foto asli | **2556 × 1448** | width 44,375% · height 37,7083% |
| Pusat foto asli | (2880, 1920) = **pusat kanvas** | 50% · 50% |
| Inti identik piksel (tanpa feather) | x 1742–4017, y 1336–2503 (2276 × 1168) | — |
| Pita sambungan (feather) | 140 px di sisi dalam tepi foto asli | Campuran asli + perluasan |

Terverifikasi: inti identik byte-per-byte dengan sumber. 76,5% piksel di seluruh persegi foto asli identik; sisanya ada di pita feather 140 px.

**`hero-bg-v2-3840.webp`:** offset (1068, 797,3), ukuran 1704 × 965,3.

**Mobile `hero-bg-v2-mobile-2160x3840.webp`** (crop master x 1800–3960, y 0–3840): foto asli di **(−198, 1196)**, ukuran 2556 × 1448, sehingga melewati tepi kiri dan kanan crop 198 px. Pusat foto = (1080, 1920) = pusat crop. Untuk versi 1080×1920, semua angka × 0,5.

**Cara pakai (usulan):** atur ukuran elemen latar sehingga persegi foto asli tepat menutup viewport seperti Hero V1 di skala 1 (`width = coverWidth / 0.44375`, dipusatkan). Lalu animasikan `scale` di sekitar pusat. Batas aman (tanpa tepi kosong):
- desktop 16:9 dan lebih lebar: s ≥ 0,45;
- desktop 16:10: s ≥ 0,42;
- mobile 390×844 dengan crop mobile: s ≥ 0,38.

Target zoom out 0,5 aman di semua ukuran tersebut.

## Proses dan status AI

1. **Outpaint (tahap 1):** sumber diperkecil ke 682×386 di tengah kanvas abu-abu 1536×1024 (`_work/in-3x2.png`). Model mengisi border (`_work/out-3x2.png`) dengan prompt: dinding plaster hangat dengan bayangan daun di atas, lumut dan pakis di bawah, cahaya pagi yang sama, tanpa ring/bayangan ring/batu baru/teks (lihat `hero-outpaint.sh`).
2. **Registrasi + komposit:** posisi foto di hasil model dicari dengan korelasi (skor 0,981, skala 1,000), lalu hasil di-upscale 3,75× ke 5760×3840 dan foto asli ditempel kembali di (1602, 1196) dengan feather 140 px.
3. **Refine detail (tahap 2):** karena upscale 3,75× terlalu lunak, 8 tile 2100×1400 di sekeliling foto asli dikirim ulang ke model ("keep this exact image … restore crisp detail", `hero-refine.sh`). Pergeseran tile terukur 0 px (korelasi 0,91–0,99). Tile digabung dengan feather 260 px. Tone frekuensi rendah diambil dari komposit tahap 1 agar tidak ada pita warna antar-tile. Setelah itu foto asli ditempel lagi.
4. **Pemeriksaan:** crop 100% di sambungan dinding atas, lumut kiri bawah, dan overlap tile; dinding juga dicek dengan kontras dinaikkan 2,2×. Tidak ada ring, bayangan ring, atau objek baru yang mencolok. Perluasan memuat satu tanaman kecil baru di tengah kanan dan lebih banyak daun pohon di kanan atas; keduanya sesuai prompt dan tidak mencolok.

Catatan: detail perluasan adalah hasil AI. Pada skala 1 perluasan tidak terlihat (di luar viewport). Pada skala 0,5 kerapatannya ±1 px master per 0,25 px CSS, jadi tetap tajam di layar.

`_work/` berisi input/output tahap 1 dan tile (in/out) untuk audit. Tidak untuk web.

# Latar S02 "Why Stillway" — soft shadow wall (D-088)

Status: **AI-generated (gpt-image), di-grade ke Paper dan di-upscale; menunggu tinjauan pengguna.** Dibuat 19 November 2026 oleh Visual Director.
**Tone: opsi B, Paper hangat #F7F5F0, dipilih pengguna** (lewat koordinator, sebelum gambar final dibuat). Opsi A (putih dingin) tidak dilanjutkan.

- **Referensi:** `design/v2/references/s02-ref-shadow-wall.png` (dinding putih, bayangan daun palem, bidang cahaya jendela, satu daun di kanan atas).
- **Alat:** `gpt-image-bridge` (`design/assets/v1/scripts/genref.sh`) dengan referensi di atas. Script: `design/v2/scripts/s02-wall.sh` (prompt lengkap) dan `design/v2/scripts/s02-finish.py` (grade + upscale + ekspor).

## File final (opsi B)

| File | Ukuran | Pakai |
|---|---|---|
| `s02-wall-B-desktop-2880x1620.png` | 2880×1620 (16:9) | Master desktop |
| `s02-wall-B-desktop-2880x1620.webp` | 58 KB | Web desktop retina |
| `s02-wall-B-desktop-1920x1080.webp` | 26 KB | Web desktop DPR 1 |
| `s02-wall-B-mobile-1440x2560.png` | 1440×2560 (9:16) | Master mobile |
| `s02-wall-B-mobile-1440x2560.webp` | 31 KB | Web mobile retina |
| `s02-wall-B-mobile-1080x1920.webp` | 20 KB | Web mobile ringan |

Pakai sebagai `background-size: cover; background-position: center top` (daun tetap di sudut kanan atas). Preview di atas layout S02 1440: `_work/preview-desktop-1440.png`.

## Komposisi dan tone (terukur)

- Satu daun palem hijau (sedikit out of focus) di **sudut kanan atas** (±20% frame). Bayangan daun lembut menyapu **tepi atas**, dengan bidang cahaya jendela samar di kanan. **Tengah dan setengah bawah bersih**: area ring dan "keeps the pattern." tidak terkena bayangan.
- Dinding bersih di-grade ke Paper. Median area tengah/bawah: desktop (247, 244, 239), mobile (246, 244, 240), praktis sama dengan `--paper` #F7F5F0, jadi tidak ada lompatan warna dari S01.
- Kontras rendah: di pita tengah-bawah luminance terendah 217/255 (desktop) dan 230/255 (mobile). Bayangan terdalam di pita atas ±12% di bawah dinding. Teks Ink #231F20 tetap kontras penuh.
- Grain halus (σ 1,1) ditambahkan setelah upscale supaya gradien tidak banding.
- Catatan desktop: daun berada di belakang tombol navbar "Find your size". Tombol itu punya latar sendiri, jadi tetap terbaca. Jika ingin daun lebih jauh dari navbar, pakai `background-position: center 20%` (daun naik sebagian keluar frame).

## Sambungan (usulan Visual Director)

- **Masuk dari S01:** S01 berakhir di Paper polos. Pasang latar S02 dengan **opacity 0 → 1 selama 30–70% sambungan 01 → 02**, di atas warna dasar Paper. Karena dinding bersih = Paper, yang terlihat "muncul" hanya bayangan dan daun, tanpa perubahan warna dasar. Tambahkan gerak kecil: latar `translateY(2%) → 0` dan `scale(1.03) → 1`, seperti cahaya pagi yang perlahan tajam. Reduced motion: fade 300 ms saja.
- **Selama S02:** latar diam. Opsional: parallax sangat kecil (±1–2% Y). Bayangan jangan dianimasikan agar teks tetap tenang.
- **Keluar ke S03 (Night):** ikuti sambungan Storyboard 02 → 03. Pada 0–30% teks memudar. Pada 30–80% **latar foto memudar lebih dulu** (opacity 1 → 0 pada 30–55%), lalu warna dasar **Paper → Night** cross-fade (45–80%). Bayangan daun hilang sebelum ruangan gelap, sehingga tidak ada fase "dinding abu-abu kotor" di tengah transisi. Ring tetap di tengah dan rim light naik sesuai storyboard.

## Proses

1. Opsi A (putih dingin, `_variants/A-*-raw.png`) dibuat sebelum pilihan pengguna masuk. Hasilnya terlalu pudar dan bayangan hampir tidak terbaca, sehingga tidak dilanjutkan.
2. Opsi B: dua sampel desktop dan dua mobile (`_work/B-*-raw-1/2.png`). **Varian 2** dipilih untuk keduanya: daun tepat di sudut, bayangan hanya di tepi atas, tengah paling bersih, dan desktop-mobile konsisten. Varian 1 menaruh daun lebih ke tengah atas.
3. `s02-finish.py`: gain per kanal agar median dinding bersih = #F7F5F0 (desktop 1,008 / 1,038 / 1,062), upscale Lanczos (desktop 1,72×, mobile 1,53×; aman karena isinya lembut/out of focus), grain, lalu ekspor PNG + WebP q84.

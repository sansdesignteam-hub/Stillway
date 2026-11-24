# A-11b "The Everyday": foto latar akhir S07 dibuat ulang (D-152)

Status: **dibuat dengan AI (gpt-image lewat Codex), di-upscale, belum di-retouch manual. Menunggu pengguna memilih satu variasi sebelum dipasang (D-152).** Dibuat 24 November 2026 oleh Visual Director sesuai brief `design/v2/BRIEF-vd-everyday.md` (checkout Project Manager).

Pengganti `design/assets/v1/home/A-11-package-flatlay.png` (1448×1086). Set dan suasananya sama: batu granit pucat, lumut dan pakis di tepi, dinding plaster krem dengan bayangan daun, cahaya hangat dari kiri atas, dock krem dengan kabel putih melingkar. **Sizing kit dihapus.** Penggantinya adalah tiga ring Stillway dengan desain yang sama dalam tiga finish polished (D-085): Silver, Black, dan Gold 18K cerah (D-100).

## File

| Variasi | Master PNG | Web | Ukuran | Susunan |
|---|---|---|---|---|
| A | `../A-11b-everyday-a.png` | `A-11b-everyday-a-2880.webp`, `-1920.webp` | 2880×1920 (3:2) | Dock + kabel di kiri atas, ring **Gold duduk di dock**. **Silver berdiri** di kiri bawah. **Black rebah** di kanan bawah. Tengah kosong paling lebar. |
| B | `../A-11b-everyday-b.png` | `A-11b-everyday-b-2880.webp`, `-1920.webp` | 2880×1920 | Dock kosong + kabel di kiri atas. **Black rebah** di kiri bawah dengan "Stillway" mendatar. **Silver berdiri dan Gold bersandar padanya** di kanan bawah. Paling terlihat seperti "dipakai sehari-hari". Ukiran Gold dibuat polos (lihat catatan). |
| C | `../A-11b-everyday-c.png` | `A-11b-everyday-c-2880.webp`, `-1920.webp` | 2880×1920 | Kebalikan A: dock + kabel di **kanan atas** dengan ring **Black di dock**. **Silver berdiri** di kiri atas. **Gold rebah** di kanan bawah. Kabel keluar dari batu ke dinding. |

WebP q84. Master PNG untuk arsip dan crop. Ketiganya memakai warna dan exposure asli hasil AI (hangat, sedang). Developer menurunkan exposure di web (D-153).

**Ruang teks:** area tengah batu (sekitar 25–75% lebar, 30–70% tinggi) dibiarkan kosong untuk "The / Everyday" dan kartu foto. Pada mock 1200 px, benda tidak berada di bawah kata "Everyday". Di B, ring Silver/Gold berada sedikit di bawah huruf "ay". Di C, dock berada di kanan atas, dekat ujung "Everyday".

## Proses dan prompt

- **Alat:** `gpt-image-bridge` lewat `design/assets/v1/scripts/genref.sh` (Codex CLI `image_generation`, referensi dilampirkan dengan `-i`). Codex memilih backend model gambar. Model mengembalikan 1536×1024.
- **Prompt lengkap:** `design/v2/scripts/everyday-v2.sh` (blok SET ronde 2, DOCK, RINGS, QUIET, AVOID + susunan A/B/C). Jalankan dengan `ROUND=2 ./design/v2/scripts/everyday-v2.sh all`.
- **Referensi:**
  1. `design/assets/v1/home/A-11-package-flatlay.png`: set, cahaya, dan komposisi.
  2. `_work/refs/finishes.png`: baris atas `design/3d/v2/renders/polished-finishes/sheet-blender.png` (branch 3D-Designer), Silver / Black / Gold polished. Dipakai sebagai acuan finish, bukan `v2-finish-*.png` brushed, karena D-085 menetapkan semua finish V2 glossy.
  3. `_work/refs/logo.png`: `v2-ring-logo-closeup.png` diperkecil ke 1024 px, untuk geometri band, sensor dalam, dan ukiran.
- **Ronde 1 (ditolak, `_work/rejected-round1/`):** tekstur granit membentuk pola anyaman/kain berulang dan terlihat tidak nyata. Edit AI untuk memperbaiki batu (`PASS=fix`, `fix-*.png`) justru memperburuknya: pola tetap ada dan muncul bercak lichen seperti stempel.
- **Ronde 2 (dipakai, `_work/raw2-*.png`):** prompt batu diganti menjadi "smooth weathered granite, subtle mottling, sparse fine flecks, never a repeating grid/mesh/knit pattern" dengan ruang tajam f/4 dan lensa 85 mm. Pada ukuran tampilan, batu terbaca sebagai batu. Pada zoom 2× masih ada sedikit tekstur mikro AI.
- **Perbaikan B (ukiran):** ukiran pada ring Gold terbaca **"Stilway"** (L-nya satu). Dua edit AI untuk mengukir ulang dengan ejaan benar tetap menghasilkan "Stilway" atau mengubah framing. Sesuai D-073 (logo harus bersih atau tidak terlihat), band Gold dibuat **polos** lewat edit AI frame penuh (`_work/b-gold-plain-out.png`). Hanya area ukiran (kotak berfeather, tidak menyentuh ring Silver) yang ditempel ke raw (`design/v2/scripts/everyday-patch-b.py`). Asli: `_work/raw2-b-orig.png`.
- **Finishing:** `design/v2/scripts/everyday-finish.py`: Lanczos 1,875× ke 2880×1920, unsharp ringan (threshold menjaga batu tetap lembut), dan grain luminans halus. Tanpa perubahan warna/exposure.
- **Pemeriksaan:** semua ukiran yang terlihat sudah dicek di crop resolusi penuh dan terbaca "Stillway" (dua L): A Silver; B Silver, Black; C Silver, Black. Gold di A dan C menghadap ke dalam (tanpa ukiran terlihat). Gold di B polos.

## Batasan yang perlu diketahui

- **Resolusi:** detail asli 1536 px, di-upscale ke 2880. Pada layar 1920 terlihat tajam (1,25×). Pada retina 2880, batu dan lumut sedikit lembut. Ring dan dock tetap bersih. Jika perlu lebih tajam, variasi yang dipilih bisa diproses dengan tile refinement seperti hero (D-080).
- **Ukiran:** ukiran "Stillway" sedikit lebih kontras daripada tone-on-tone di render 3D, terutama pada Black (abu terang). Ukiran di AI tidak bisa diatur persis.
- **A:** ring Gold berdiri miring di dalam cup dock. Pada ukuran tampilan terlihat wajar, tetapi posisi ini bukan cara mengecas yang presisi.
- Ring bukan produk nyata; ini aset ilustratif untuk portofolio.

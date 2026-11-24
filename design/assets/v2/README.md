# Aset gambar V2 — log AI

Status: **AI-generated, belum di-retouch manual, menunggu tinjauan pengguna.** Dibuat 19 November 2026 oleh Visual Director sesuai D-064, D-065, D-071–D-073.

- **Alat:** `gpt-image-bridge` lewat `design/assets/v1/scripts/genref.sh` (Codex CLI `image_generation`, referensi dilampirkan dengan `-i`). Backend model gambar dipilih oleh Codex.
- **Prompt:** lengkap di `design/v2/scripts/v2-assets.sh` (A-1, A-1b, A-2, A-3, A-4). Prompt edit retouch dicatat di tabel di bawah. Rencana dan komposisi: `design/v2/REPORT-v2-assets.md`.
- **Karakter:** C-02 (`design/assets/v1/masters/C-02-character.png`, D-058).
- **Acuan ring** (branch 3D-Designer, `design/3d/v2/renders/`):
  - *lama* = `v2-ring-ref-34.png` / `v2-ring-axis-vertical-10.png` (satin, lebih terang);
  - *brushed* = `v2-ring-ref-34-brushed.png` / `v2-ring-axis-vertical-10-brushed.png` (pewter hangat, brushing tegas). Acuan ini datang setelah batch pertama.
- **Resolusi:** model mengembalikan ukuran sedikit lebih kecil dari yang diminta (mis. 1254² bukan 1536², 1122×1402 bukan 1232×1536). Ini cukup untuk web; untuk hero full-bleed A-3 (1672×941) perlu upscale bila ditampilkan di atas 1440 px.
- **Aturan logo (D-073):** logo harus bersih atau tidak terlihat. Logo yang rusak dihapus lewat edit AI; tempelan dari render tidak diperlukan sejauh ini.

## File final

| ID | File | Ukuran | Acuan ring | Status / keputusan |
|---|---|---|---|---|
| A-1 | `A-1-hand-left-alpha.png` | 579×1198, RGBA | — (tanpa ring) | **Pilihan untuk 3D Designer.** Dari variasi v0, di-flip horizontal, lalu di-cut-out dengan `design/v2/scripts/cutout.py` (key warna latar + dekontaminasi tepi). |
| A-1 | `A-1-hand-left.png` | 1254×1254 | — | Versi penuh v0 yang sudah di-flip, di atas latar Paper. |
| A-1b | `A-1b-hand-with-ring.png` | 1254×1254 | **brushed** (`axis-vertical-10-brushed`) | Edit AI dari `A-1-hand-left.png`. Ring di pangkal telunjuk; "Stillway" **horizontal, terbaca** (D-072). Untuk cadangan reduced motion / WebGL gagal dan frame awal transisi S06 → S07. Hasil edit bisa sedikit mengubah tangan dibanding A-1 (tidak dipakai bersamaan). |
| A-2 | `A-2-card-night.png` | 1122×1402 | lama | **Dipertahankan.** Logo "Stillway" terbaca, searah lingkar ring. Ring di telunjuk kiri; ibu jari + 4 jari. Lampu meja hangat. |
| A-2 | `A-2-card-desk.png` | 1122×1402 | lama | Ukiran asli acak → **edit AI: band polos** (D-073). Keyboard tanpa huruf. |
| A-2 | `A-2-card-move.png` | 1071×1339 (crop 4:5) | lama | Ukiran acak + lantai pasir pantai → **2× edit AI**: lantai studio rata, band polos. Di-crop tengah ke 4:5. |
| A-2 | `A-2-card-rinse.png` | 1122×1402 | lama | Ukiran acak → **edit AI: band polos**. Ring basah di telunjuk kiri. |
| A-3 | `A-3-everyday.png` | 1672×941 | lama | **Dipertahankan.** Studio Paper/Sand, C-02 duduk di sepertiga kanan, ruang kosong di tengah untuk teks. Ring kecil di tangan kiri. |
| A-4 | `A-4-box-studio.png` | 1448×1086 | **brushed** (`ref-34-brushed`) + `masters/R-kit.png` | **Dibuat ulang dengan acuan brushed.** Ring + dock + baki 8 sampel (6–13). Logo "Stillway" bersih. |
| A-11b | `A-11b-everyday-a.png`, `-b.png`, `-c.png` | 2880×1920 | polished Silver/Black/Gold (`polished-finishes/sheet-blender.png`) | **D-152, baru 24 Nov 2026.** Pengganti foto latar akhir S07 (`v1/home/A-11-package-flatlay.png`): sizing kit diganti tiga ring Stillway. 3 variasi menunggu pilihan pengguna. Detail, prompt, dan catatan: `everyday/README.md`. |
| A-5 | `A-5-hand-phone.png` (+ `-b`, `-c`, lapisan `-front`) | 1600×2400, RGBA, layar transparan | — (tanpa ring) | **D-160, baru 24 Nov 2026.** Tangan C-02 memegang ponsel hitam tanpa logo untuk S09; latar dan layar transparan. 3 variasi, A utama; menunggu tinjauan pengguna. Koordinat layar, lapisan, dan prompt: `app/README.md`. |
| A-6 | `A-6-recovery-bg-a.png`, `-b.png` | 1290×2796 (9:19,5) | polished Silver (`polished-finishes/sheet-blender.png`) | **D-163, baru 24 Nov 2026.** Foto latar layar Recovery di app S09: tangan C-02 beristirahat memakai ring Stillway Silver, nuansa ungu–cocoa malam, ruang tenang di atas untuk dial. 2 variasi menunggu tinjauan pengguna. Prompt dan catatan: `app/README.md`. |

### Keputusan acuan per foto (setelah acuan brushed tiba)

| Foto | Keputusan | Alasan |
|---|---|---|
| A-1b | Dibuat ulang (brushed) | Ring besar dan menjadi fokus. Versi lama (`_variants/A-1b-hand-with-ring-oldref.png`) jelas lebih terang dan rata dibanding pewter brushed. |
| A-4 | Dibuat ulang (brushed) | Ring besar. Versi lama (`_variants/A-4-box-studio-oldref.png`) putih-perak terang, jelas berbeda warna dan kilap. |
| A-2 (4 kartu) | Tidak dibuat ulang | Ring kecil di jari dan sudah tampil satin-brushed abu-abu hangat di bawah cahaya adegan. Selisih warna dengan acuan brushed tidak terlihat jelas pada ukuran kartu. |
| A-3 | Tidak dibuat ulang | Ring hanya beberapa piksel di frame lebar. |

## Data untuk 3D Designer (A-1, S06 State 4)

Koordinat dalam piksel `A-1-hand-left-alpha.png` (579×1198; x ke kanan, y ke bawah). File ini = crop dari `A-1-hand-left.png` dengan offset (50, 56).

| Titik | x | y | Catatan |
|---|---|---|---|
| Ujung telunjuk | 326 | 23 | Titik awal ring turun |
| Sendi tengah (PIP) | 335 | ≈240 | |
| **Dudukan ring (pusat band)** | **343** | **≈360** | Ruas proksimal, tepat di atas sela jari; cocok dengan posisi ring di A-1b |
| Buku jari (MCP) | 346 | ≈470 | Batas bawah |
| Sumbu telunjuk | — | — | Garis lurus ujung → dudukan; condong **2,9°** dari vertikal (ujung sedikit ke kiri): x = 325,7 + 0,0514·(y − 24) |
| Lebar jari di ruas proksimal | 85 px | | Diameter luar ring di foto ≈ 100–120 px (A-1b: lebar band ±120 px, tinggi band ±63 px dalam koordinat penuh) |

Pose: tangan **kiri**, punggung tangan ke kamera, ibu jari di kanan gambar, kamera sejajar pangkal telunjuk ±10° dari atas. Ring akhir: sumbu = sumbu telunjuk, sisi logo menghadap kamera, teks horizontal (`v2-ring-axis-vertical-10-brushed.png`).

## Catatan proses (jujur)

- **A-1 tangan kanan:** prompt pertama meminta "thumb to the left". Dengan punggung tangan menghadap kamera, itu menghasilkan **tangan kanan** di ketiga variasi. Saya memperbaikinya dengan **flip horizontal** (secara anatomi menjadi tangan kiri yang benar), lalu mengoreksi prompt di script ("thumb on the viewer's right"). Asli yang belum di-flip ada di `_variants/raw/`.
- **Variasi A-1:** v0 (telunjuk paling tegak, 2,9°) dipilih. v10 (3,7°) dan v20 (0,6°) beserta cut-out-nya ada di `_variants/`.
- **Prompt edit retouch A-2:** "Keep this exact image: same man, same pose, same hands, same framing, same light and colours. Only change the ring on his finger: remove the engraved letters completely so the outer band is a plain, clean satin-brushed silver surface with no text or marks…". Untuk Move ditambah penggantian lantai pasir dengan "smooth matte sand-coloured studio floor (seamless plaster)", lalu satu edit lagi untuk menghapus goresan sisa.
- Setiap tangan sudah diperiksa dengan crop resolusi penuh (5 digit, ring di telunjuk kiri).

## `_variants/`

Asli sebelum edit (`*-raw.png`), hasil antara (`*-plain*.png`), versi acuan lama (`*-oldref.png`), variasi A-1 v10/v20, dan `raw/` (A-1 sebelum flip). Tidak untuk web.

# Brief 3D Designer: meja kayu pinus untuk S06 (D-144)

Status: disetujui pengguna 24 Nov 2026 (D-144). Kerjakan di branch `3D-Designer` dengan Blender MCP. `web-v2/` dikerjakan Developer (D-046); kamu hanya membuat aset dan render tinjauan.

## Tujuan

Di S06 ring menggelinding tegak di atas meja, lalu jatuh dari tepi kanan meja ke jari. Pengguna ingin alasnya **bertekstur kayu dan realistis**. Di Figma (`06 · Product details`) alasnya meja **kayu pinus terang**; tepi kanan meja berada tepat di tengah layar (x 720 dari 1440).

Referensi (checkout Project Manager, `/Users/zaimmaulana/Orca/projects/Smart Ring/design/v2/references/`):
- `s06-state1.png` … `s06-state3.png`: frame Figma, ring di atas meja kayu pinus, tepi kanan meja di tengah.
- `s06-ref-roll-upright-ghosts.png`: cara ring menggelinding tegak di atas alas.

## Yang dibuat

1. **Model meja** (blok sederhana): permukaan atas tempat ring menggelinding, sisi depan menghadap kamera, dan tepi kanan yang tegas dengan bevel kecil (tepi tempat ring jatuh). Ukuran nyata, sesuai skala ring (`design/3d/v2/stillway-ring-v2.blend`, diameter luar ring 23,84 mm; lihat `design/3d/v2/s06-pose.json`). Bagian kiri boleh keluar bingkai.
2. **Material kayu pinus terang**, fotoreal: serat kayu lurus yang halus, sedikit mata kayu boleh, roughness bervariasi, warna hangat pucat yang selaras dengan latar Paper #F9F5EF dan Sand #F0E8DD. Tidak boleh terlihat seperti tekstur datar/plastik. Tepi depan menunjukkan serat ujung yang sedikit berbeda.
3. **Ekspor untuk web:** `design/3d/v2/s06-table.glb` (geometri rendah poli, UV rapi) dengan tekstur PBR (base color, roughness, normal; 2K, WebP/KTX2 bila bisa), ukuran total sekecil mungkin (target < 1,5 MB). Sertakan juga `design/3d/v2/tex/` untuk tekstur terpisah bila perlu.
4. **Render tinjauan** 1440×900 dari sudut kamera S06 (perspektif FOV 30°, setara hero V1, lihat `s06-pose.json`): meja di kiri bawah dengan tepi kanan di x 720, ring silver_polished tegak di atas meja dengan lubang menghadap kamera, latar Paper. Simpan di `design/3d/v2/renders/s06-table-review.png`. Render kedua dengan ring tepat di tepi meja.
5. Catatan singkat untuk Developer: ukuran meja, titik tepi kanan (koordinat), arah serat, dan saran pencahayaan (kontak bayangan ring di meja).

## Batasan

- Jangan ubah model ring atau material `silver_polished` (D-085).
- Workspace kamu masih punya perubahan `.blend` yang belum di-commit dari pekerjaan sebelumnya (`design/3d/ring/stillway-ring-silver.blend`, `.blend1`). **Jangan dibuang dan jangan ikut di-commit**; buat file meja terpisah.
- Commit dan push ke branch `3D-Designer`. Jangan merge ke `main`.

## Laporan

Kirim ke Project Manager: commit, path GLB dan tekstur, ukuran file, dan dua render tinjauan. Project Manager meneruskan ke pengguna dan Developer.

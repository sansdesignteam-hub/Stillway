# Brief D-181 — alas hero serealistis Figma + latar resolusi tinggi

Penilaian pengguna setelah D-180: alas 3D masih kurang realistis dibanding Figma `40004725:5602`. Acuannya `design/assets/v2/s01/hero-text-layout-ref.png` (alas oak foto-asli, bayangan dan bounce lembut). Pengguna juga meminta latar resolusi tinggi yang tetap ringan. Kedua worker memakai model **Fable 5.2** atas permintaan pengguna.

## Mengapa alas real-time kurang realistis
Kayu yang dirender real-time di WebGL tidak punya global illumination: tidak ada bounce hangat dari meja, tidak ada ambient occlusion di tepi bawah, tidak ada pantulan halus pada lip, dan penumbra bayangan hanya diaproksimasi. Kayu jadi terlihat datar seperti tempelan. Figma terlihat nyata karena alas dan cahayanya menyatu dalam satu foto.

## Pendekatan (keputusan PM): plate foto + proxy 3D tak terlihat
Alas **tidak lagi di-shade real-time**. Alas dirender sekali secara fotorealistis di Cycles ke dalam foto latar, lalu web hanya memakai bentuk alas tak terlihat untuk menerima bayangan cincin yang bergerak.

- **Plate** = foto meja beresolusi tinggi + alas hasil render Cycles. Pencahayaannya sudah lengkap: bayangan kontak alas ke meja, bounce hangat, AO, highlight lip, serta pori dan serat oak.
- **Proxy** = mesh alas yang sama di web, tidak terlihat. Proxy hanya (a) menerima bayangan cincin lewat PCSS sebagai lapisan multiply di atas plate, termasuk sisi dan tepinya, dan (b) menulis depth agar oklusi benar.
- Hasilnya, kualitas alas setara render offline, sementara bayangan cincin tetap hidup mengikuti hover tilt dan lift. Beban GPU juga turun karena alas tidak di-shade.
- Pendekatan ini menggantikan "alas di-shade real-time" pada D-179. Pendekatan mask-dari-foto D-178 gagal karena tidak ada geometri yang cocok. Sekarang geometrinya ada (`s01-pedestal.glb`) dan kamera fotonya sudah disamakan.

## Latar resolusi tinggi
- Foto `hero-warm-desk-nopedestal-src.png` (1818 px) di-upscale 2× (Magnific, mode fotografi, kreativitas rendah) menjadi 3632 px. File hasil disimpan PM di `design/assets/v2/s01/hero-warm-desk-v2-upscaled-3636.jpg (3632×2072)`.
- Alasan: di layar retina 1440 CSS px (2880 px fisik) dengan zoom 1,14, gambar butuh ±3300 px. Sumber 1818 px menjadi lembek saat diperbesar.

## 3D Designer (Fable 5.2)
1. Kalibrasi ulang kamera terhadap plate upscaled. Render alas di Cycles (sampel tinggi, denoise) **ke plate**: oak dari scan foto 2K dengan normal dan roughness, pori terbuka, lip R1,1 dengan sheen tipis, AO tepi bawah, bayangan kontak lembut ke kiri-depan, dan bounce hangat ke meja. Acuan tampilan: alas pada `hero-text-layout-ref.png`.
2. Output:
   - `plate-s01-3632.png`: plate tanpa cincin dan tanpa bayangan cincin.
   - Gambar diam cadangan: plate + cincin pose Figma + bayangan cincin, dalam framing yang sama.
   - Pose JSON yang memperbarui kamera dan transform proxy.
   - Render "proxy overlay" yang menumpuk siluet proxy di atas plate. Toleransi tepi ≤1 px pada 1818 px.
3. Sertakan perbandingan berdampingan plate vs Figma, dengan close-up alas.
4. Jangan menyentuh `web-v2/`. Commit dan push ke `origin/3D-Designer`, lalu `worker_done`.

## Developer (Fable 5.2)
1. Latar: buat set responsif dari plate, AVIF + WebP dengan lebar 1280, 1920, 2560, dan 3640 lewat `<picture>`/`srcset` dan `sizes`. Preload hanya ukuran yang cocok untuk first paint (atau versi 960 lalu upgrade). Anggaran: AVIF 2560 ≤ 250 KB, 3640 ≤ 450 KB. Hanya layar besar/retina yang mengunduh versi besar. Laporkan ukuran semua file dan bandingkan ketajaman pada 1440@2x.
2. Ganti mesh alas yang di-shade dengan **proxy**: `colorWrite=false` + depth untuk oklusi, ditambah catcher bayangan PCSS (multiply) pada permukaan atas, sisi, lip, dan meja. Penumbra PCSS D-180c tetap dipakai. Hapus contact shade alas buatan web, karena sekarang sudah ada di plate.
3. Pertahankan wordmark D-180, hover tilt di sekitar titik kontak, clearance, scale blend, keluar ke S02, dan kesamaan poster = 3D (onion-skin).
4. Bukti: build, push, preview Ready, 1440@1x dan @2x serta 375 vs Figma, close-up alas, ukuran file, fps diam/tilt, onion-skin, lalu `worker_done`.
5. Mulai setelah 3D Designer push. Sambil menunggu, siapkan pipeline gambar responsif menggunakan plate sementara (foto upscaled tanpa alas).

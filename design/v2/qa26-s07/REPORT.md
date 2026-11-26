# S07 foto dan layout teks penutup (D-175) — laporan Developer

Baseline `0335c24`, commit `26f79f9`. `npm run build` lulus. Diperiksa dengan Chrome headless pada 1440 × 900 dan 375 × 812.

## Aset
- Lima PNG dari `/tmp/stillway-d175-s07.IqcurO/` disalin ke `design/assets/v2/s07/`.
- Kartu: `s07-night`, `s07-desk`, `s07-move`, `s07-rinse` (1024 × 1536), dioptimasi oleh `Img.astro`.
- Foto penutup: `s07-everyday` (1672 × 941), diekspor ke webp 960 dan 1672 lewat `getImage`. Ukuran sumbernya lebih kecil dari webp 2880 sebelumnya.
- Alt text keempat kartu dan foto penutup diperbarui sesuai isi foto.

## Hasil
- Deret kartu dari kiri ke kanan: Night (pria tidur) → Desk (ring di charger) → Move (pria berkacamata) → Rinse (tangan di tepi air). Lihat `S07_row_1440.png` dan `S07_row_375.png`.
- Headline "Through the day.", masuknya kartu (scale + fade), urutan tumpukan Night → Desk → Move → Rinse, dan timing D-172 tidak berubah. Kartu terakhir tetap Rinse.
- Penutup:
  - Heading putih **"The everyday."** dalam satu baris, satu ukuran, rata tengah, di depan kartu Rinse. Lebarnya ±86 % bidang foto (5,93 em, diukur), di desktop maupun mobile.
  - Caption putih **"Ring shown where it’s worn."** rata tengah di bawah kartu, satu baris di 375 px.
  - Bayangan teks yang sudah ada menjaga keterbacaan di area terang. Komposisi foto tidak diubah. Lihat `S07_end_1440.png` dan `S07_end_375.png`.
- Parallax, urutan reveal (foto → kartu → kata → caption) dan sambungan ke S08 tetap.

## Bukti
- `S07_forward_1440.jpg` dan `S07_forward_375.jpg`: frame dari state 1 sampai penutup.
- `S07_backward_1440_360px-steps.jpg`: scroll mundur dari penutup ke "Through the day."

## Batas
- Belum diuji di Safari/iOS dan perangkat fisik; tidak ada rekaman video.
- Foto penutup bersumber 1672 px, sehingga di layar sangat lebar (> 1672 px fisik) gambar sedikit diperbesar.
- Production menunggu pengguna.

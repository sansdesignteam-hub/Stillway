# Revisi staging 26 Nov (D-172) — laporan Developer

Baseline `f59be50`. `npm run build` lulus. Diperiksa dengan Chrome headless pada 1440 × 900, 375 × 812 dan 375 × 600, termasuk `?reduced-test`. Bukti motion berupa urutan frame dari awal, tengah, sampai akhir.

| Catatan | Commit | Hasil | Bukti |
|---|---|---|---|
| 1 S03 · 2× | `e7f184c` | Statistik terakhir tidak lagi terkena `back`, `gone` maupun dimming. Angka "2×" tetap tampil penuh di slot yang sama sampai keluar 1:1 menuju S04, dan "A picture of the night…" tetap di bawahnya. Dua statistik sebelumnya tetap berganti seperti semula. Logikanya bergantung pada posisi scroll, sehingga hasilnya sama saat scroll maju maupun mundur. | `S03_2x_hold_frames.jpg` |
| 2 S04 · foto | `ba1dcb2` | Lima file dari `/tmp/stillway-d172-s04.Eq7bFB/` disalin ke `design/assets/v2/s04/` dan dioptimasi oleh `Img.astro`. Urutan: 07:40 rel treadmill → 09:00 tangan dekat wajah → 10:30 tangan memegang ring → 12:30 pria berkacamata → 15:30 ring dengan cahaya amber. Lensa S03→S04 memakai kartu DOM yang sama, jadi gambar 07:40 baru juga tampil di lensa. Teks alt diperbarui. Motion busur dan label waktu/state tetap. | `S04_photo_order.jpg` |
| 3 S07 | `a1a008a` | "Through" dan "the day." memisah ke kiri/kanan sambil mengecil (`transform-origin 0 0`) hingga muat di ruang antara margin dan deret kartu (jarak 20 px). Kata tidak lagi di-clip. Kata selesai memisah (u 0.1–0.62) sebelum kartu muncul (0.45–1.06, berurutan dari kiri). Kartu muncul dengan scale 0.72→1 dan fade di posisi tujuan, tanpa naik dari bawah. Saat menutup, Night berada paling atas, lalu Desk, Move, Rinse. Nama data aktual kartu ketiga adalah "Move", bukan "Lace". Tumpukan berakhir dengan Rinse untuk "Everyday". Di mobile, kata berada di atas/bawah deret dan diskalakan agar muat. | `S07_intro_frames.jpg` |
| 4 S09→S10 mobile | `4eb0b07` | Di mobile, S09 (teks, HP/tangan) kini naik 1:1 tanpa fade; mask navbar G-14 menyembunyikan bagian yang lewat di bawah bar. Kolom S10 menyusul langsung di bawahnya (track `data-tin` = 1 di mobile). Hasilnya terbaca sebagai satu halaman tanpa crossfade. Crossfade antar-mode di dalam S09 tetap. Membuka halaman dengan `#finishes` dan tautan nav sama-sama menaruh judul di y 72. Reduced motion tetap memakai fade singkat. | `S09-S10_mobile_frames.jpg`, `reduced_motion_checks.png` |

## Batas
- Belum diuji di Safari/iOS dan perangkat fisik. Bukti berupa urutan frame, bukan rekaman video.
- Di mobile, saat semua kartu S07 menutup, kata yang keluar ke samping masih sempat bersinggungan sebentar dengan tumpukan. Perilaku ini sama seperti sebelumnya.
- Kalau hash `#finishes` diubah langsung di URL saat halaman sudah terbuka, browser melompat ke awal track tanpa offset. Ini perilaku bawaan browser untuk semua section; tautan nav dan membuka halaman dengan hash tidak terpengaruh.
- Isi preview Vercel tidak dapat dibuka dari sesi ini karena memerlukan login.

## Revisi setelah review PM (D-172)
| Catatan | Commit | Hasil | Bukti |
|---|---|---|---|
| S07 kata dan kartu | `ea7e242` | Setelah State 2, "Through" dan "the day." tidak lagi bergeser ke tepi. Keduanya memudar di tempat (u 1.0–1.1) dalam keadaan utuh, di dalam layar. Kartu baru mulai menutup menjadi tumpukan setelahnya (u 1.1–1.75), jadi tidak ada huruf yang terpotong tepi atau tertutup kartu, baik di desktop maupun di mobile. Masuknya kartu (scale + fade) dan urutan layer dari kiri ke kanan tetap. Hasilnya sama saat scroll maju maupun mundur. Reduced motion: di State 2 (u = 1) kata masih tampil penuh; di State 3 kata sudah hilang. | `S07_row-to-stack_forward.jpg`, `S07_row-to-stack_forward_375.jpg`, `S07_row-to-stack_backward.png` (frame u 0.9–2.3, jarak 0.05–0.15) |
| Reduced motion S09→S10 mobile | `731c7fd` | Sebelumnya S09 memudar 0,3 detik sambil kolom S10 sudah masuk dari bawah. Sekarang, khusus reduced motion di mobile, S09 hilang seketika (transisi opacity dimatikan pada batas ini) tepat saat track S10 dimulai, ketika kolom S10 masih di bawah layar (y ≥ 796 dari 812). Fade reduced motion di bagian lain tetap. | `S09-S10_reduced_mobile_probe.txt` |

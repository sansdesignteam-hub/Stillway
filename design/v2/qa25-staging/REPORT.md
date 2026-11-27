# Revisi review staging 25 Nov (D-171) — laporan Developer

Baseline `4126fa7`. `npm run build` lulus. Diperiksa dengan Chrome headless pada 1440 × 900, 375 × 812 dan 375 × 600, termasuk `?reduced-test`.

| Catatan | Commit | Hasil | Bukti |
|---|---|---|---|
| 1 HE-02 | `5eb96d2` | 11 titik 3 px dengan opacity 40%. Section aktif tampil sebagai garis horizontal pendek (8 × 2 px, 6 px di mobile). Warnanya hitam di latar terang dan putih di latar gelap/foto. Indikator muncul saat posisi scroll berubah dan tersembunyi setelah 2,5 detik tanpa scroll (teruji: aktif setelah scroll, tersembunyi setelah 2,8 detik). Deep link `#finishes` → titik 10; scroll mundur ke S09 → titik 9. Tanpa transisi saat reduced motion. | `HE-02_S02_S09_S11_after.jpg` |
| 2 S07 | `39be0be` | Ukuran "Everyday" dihitung dari lebar foto, yaitu 80% (≈ 277 px di 1440, ≈ 70 px di 375). Fontnya tetap Hanken Grotesk 500 dan muat di mobile. | `S07_everyday_after.jpg` |
| 3 S09 | `cd3b24c` | Label kiri bawah dan "Scroll down", garis progres serta persentase sudah dihapus. Isi layar HP tetap. | `HE-02_S02_S09_S11_after.jpg` |
| 4 S02 | `543743e` | Label visual dihapus. `h2#why-title` tetap ada sebagai `sr-only` untuk `aria-labelledby`. | `HE-02_S02_S09_S11_after.jpg` |
| 5 S11 | `246be96` | Footer tidak lagi `min-height: 100svh`. Jaraknya memakai padding atas 96 px dan gap baris 64 px (48 px di mobile). Posisi akhir scroll menaruh bagian bawah footer di bawah layar (`close.ts`). Fokus keyboard pada footer tetap membawa halaman ke state 4. | `HE-02_S02_S09_S11_after.jpg` |
| 6 S10 mobile | `397f733` | Di bawah 720 px, judul "Find your size and finish.", area ring, panah dan panel lengkap menjadi satu kolom yang bergerak 1:1 dengan scroll. Tinggi track S10 dihitung dari tinggi kolom. Tidak ada pin, fade, atau perubahan skala ring. Ring mengikuti area dragnya. Nav/deep link `#finishes` menaruh judul di bawah navbar. Pemilihan finish, lampu, ukuran dan CTA teruji. Saat resize ke desktop, perilaku desktop kembali dan transform kolom dibersihkan. Reduced motion memakai still di area ring. Desktop tidak diubah. | `S10_mobile_flow.jpg` |

## Batas
- Belum diuji di Safari/iOS dan perangkat fisik.
- Pada reduced motion dan tanpa WebGL, panah putar disembunyikan seperti sebelumnya, sehingga ada ruang kosong kecil di bawah still.
- Isi preview Vercel tidak dapat dibuka dari sesi ini karena memerlukan login.

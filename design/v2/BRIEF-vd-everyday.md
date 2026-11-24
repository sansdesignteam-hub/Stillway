# Brief Visual Director: foto "The Everyday" dibuat ulang (D-152)

Status: disetujui pengguna 24 Nov 2026 (D-152). Hasil gambar AI wajib ditinjau pengguna sebelum dipasang di web.

## Konteks

Akhir S07 menampilkan foto besar full-bleed dengan teks putih "The / Everyday" di atasnya (D-149–D-151). Sekarang foto itu `design/assets/v1/home/A-11-package-flatlay.png`: batu berlumut, charger, sizing kit, dan satu ring. Pengguna menilai **sizing kit (deretan ring abu-abu) tidak terlihat nyata**, dan resolusinya kurang (1448×1086).

Kata pengguna: "sizing kit yang ada object mirip seperti cincin terlihat tidak real. Menurutku bisa diganti dengan object cincin sebenarnya, cuma beda warna atau karakteristik cincinnya, sehingga sesuai dengan Stillway."

## Yang dibuat

Foto baru dengan suasana dan komposisi yang sama seperti A-11:
- Batu granit pucat berlumut, lumut dan pakis di tepi, cahaya matahari hangat dari kiri atas dengan bayangan daun lembut (set N2-02 "moss rock studio", D-035).
- Charger/dock bundar krem dengan kabel putih melingkar, tetap ada.
- **Sizing kit dihapus.** Gantinya **ring Stillway sungguhan dalam 2–3 finish**: Silver polished, Black, dan Gold 18K cerah (D-085, D-100). Masing-masing ring adalah desain Stillway yang sama: band rata, sisi dalam gelap dengan tonjolan sensor, ukiran teks "Stillway" tone-on-tone di sisi luar (D-061). Susun alami di atas batu (satu berdiri, satu rebah, satu di dock bila cocok), bukan berjajar seperti produk katalog.
- Ring harus terlihat nyata dan konsisten dengan render 3D: acuan `design/3d/v2/renders/v2-finish-silver.png`, `v2-finish-black.png`, `v2-finish-gold.png` (branch `3D-Designer`), `design/assets/v1/home/A-11-package-flatlay.png` (komposisi), dan `design/v2/references/s07-ref-everyday-layout.png` (cara foto dipakai di web).

## Syarat teknis

- Landscape, ≥ 2560 px lebar (target 2880×1800 atau 3:2), tajam di layar 1920.
- Sisakan area tenang di kiri–tengah untuk teks putih besar "The / Everyday" dan kartu foto di tengah; benda utama (dock, ring) jangan tepat di bawah teks yang paling besar, cukup di sekitarnya, seperti referensi layout.
- Exposure sedang (jangan terlalu terang), warna hangat; Developer akan menurunkan exposure sedikit lagi di web (D-153).
- Tanpa teks, logo tambahan, atau watermark selain ukiran "Stillway" di ring.

## Alat dan keluaran

- Buat dengan `/gpt-image-bridge`. Catat prompt dan status AI di README aset.
- Buat 2–3 variasi, simpan di `design/assets/v2/A-11b-everyday-*.png`.
- Commit dan push ke branch `Visual-Director`. Jangan merge ke `main`.

## Laporan

Kirim ke Project Manager: commit, path tiap variasi, ukuran piksel, dan catatan singkat perbedaan antar variasi. Project Manager meneruskan ke pengguna untuk dipilih, lalu ke Developer.

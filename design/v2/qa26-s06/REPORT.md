# S06 ring jatuh dan masuk ke jari (D-173) — laporan Developer

Baseline `11d993c`. `npm run build` lulus. Diperiksa dengan Chrome headless pada 1440 × 900 dan 375 × 812, termasuk scroll mundur dan `?reduced-test`. Pada reduced motion, ring 3D tidak dipakai dan halaman menampilkan still fallback, sama seperti mode tanpa WebGL. Nilai u pada nama frame dihitung sebagai `details:X` = u X − 1 (tin 1).

| Bagian | u | Hasil |
|---|---|---|
| Gelinding dan tepi meja | 0 → 2.55 | Tidak berubah: gelinding tegak tanpa jejak (D-145), lalu ring miring di sudut meja. |
| Scene 1: kamera mengikuti | 2.55 → 3.2 | Ring lepas dari sudut, sempat turun lebih dulu sehingga arah jatuh terbaca, lalu frame bergeser memusatkannya. Meja naik keluar komposisi dengan arah gerak berlawanan dengan ring yang jatuh. Ring tidak pernah fade dan tetap satu ring 3D yang sama. |
| Ring sendirian di udara | 3.2 → 3.6 | Ring berada di tengah frame, berputar pada tiga sumbu dan turun perlahan. Ukurannya ±1,12 × ukuran di meja (1,25 × di mobile). |
| Scene 2: tangan naik | 3.35 → 4.45 | Foto A-1 naik lurus dari bawah layar ke posisi akhir sementara ring masih turun. Ring melambat dan memutar orientasinya menyamping terhadap telunjuk sampai tepat di atas ujung jari. |
| Masuk ke jari | 4.45 → 5 | Ring melewati ujung jari dan meluncur ke pangkal. Pose `onFinger` dan proxy jari menangani occlusion, dan bayangan duduk muncul di akhir. |
| Teks | 5 → 5.3 | Heading **“Then, it just fit.”** dan body S06 yang ada baru muncul setelah ring duduk; sebelumnya tersembunyi. |
| Ke S07 | > 5.6 | Tetap naik 1:1 (D-147). |

Reduced motion / tanpa WebGL: state 3 menampilkan still ring di udara di atas tangan, state 4 still di atas ujung jari, state 5 A-1b (ring di jari) beserta teks.

## Bukti
- `S06_fall_forward_1440.jpg`: u 2.4–5.9, dari tepi meja → jatuh → tangan naik → di atas ujung jari → terpasang → teks → keluar ke S07.
- `S06_fall_forward_375.jpg`: urutan yang sama di mobile.
- `S06_fall_backward_1440.jpg`: scroll mundur u 5.0 → 2.6.
- `S06_reduced_nowebgl.jpg`: reduced motion / still fallback di desktop dan mobile.

## Batas dan kebutuhan aset
- Aset yang ada cukup untuk alur ini. Tidak ada aset baru yang diperlukan.
- Reduced motion tidak memakai transform, sehingga foto tangan sudah di posisi akhir sejak state 3. Still ring di state 4 sedikit di atas ujung jari dan belum memiliki occlusion seperti versi 3D.
- Di mobile, pada awal jatuh sisa meja CSS sempat terlihat sebentar di bawah navbar sebelum hilang (u ≈ 3.1).
- Belum ada rekaman video; bukti berupa urutan frame rapat. Belum diuji di Safari/iOS dan perangkat fisik. Production menunggu pengguna.

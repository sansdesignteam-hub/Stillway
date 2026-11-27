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

## D-174 — Timing dan kehalusan (commit `7e10e7c`)

S06 sekarang 8 state, bertambah 2 layar scroll. Linimasa baru dalam u:
- Ikut kamera: 2.55 → 3.75. Dip mengikuti kurva sinus lembut, lalu pemusatan kembali memakai smootherstep, jadi tidak menyentak.
- Ring berputar di udara dengan sisa momentum gelinding. Laju sudut berkurang progresif (1 − (1 − τ)^1.8) sampai cocok dengan orientasi telunjuk.
- Putaran ekstra (1 putaran ry dan ≥ 1 putaran spin searah gelinding) ditetapkan sekali di sudut meja. Pembulatan putaran terdekat per frame dihapus, jadi tidak ada lompatan 2π atau arah putar yang berbalik.
- Tangan naik pada 4.3 → 6 sementara ring masih turun. Ring mendekati ujung jari pada 4.7 → 6.
- Meluncur ke pangkal jari pada 5.6 → 6.7, tumpang tindih dengan fase mendekat (keduanya smootherstep). Ring tidak berhenti di ujung jari; MEET→SLIDE menjadi satu gerak.
- Heading dan body muncul pada 6.85 → 7.2, setelah ring duduk.

Kontinuitas, diukur dengan sampling `details.ring(u)` sebanyak 4000 langkah pada u 2.4 → 7.0 (`D174_pose_continuity_*.json`): perubahan maksimum per langkah ≤ 0.0066 rad untuk sudut dan ≤ 0.001 untuk posisi atau ukuran. Tidak ada lompatan maupun lonjakan percepatan.

Perbandingan sebelum/sesudah dengan input scroll yang sama, yaitu 135 px per langkah (0,15 layar) pada 1440 × 900, satu frame tiap langkah:
- Sebelum (`D174_before_1440_135px-steps.jpg`): dari sudut meja sampai duduk ±13 langkah (±1,95 layar).
- Sesudah (`D174_after_1440_135px-steps.jpg`): ±23 langkah (±3,45 layar), sekitar 1,75× lebih panjang.

Bukti lain:
- Mobile 375 × 812 dengan langkah 122 px (0,15 layar): `D174_after_375_122px-steps.jpg`.
- Scroll mundur dengan langkah 270 px: `D174_after_backward_1440_270px-steps.jpg`.
- Reduced motion / tanpa WebGL (`D174_reduced_nowebgl.jpg`): state 3–4 still ring di udara tanpa tangan, state 5–6 still di atas ujung jari dengan foto tangan, state 7 A-1b beserta teks, lalu keluar ke S07.

Sambungan S06→S07 tetap 1:1. Gelinding di meja (u ≤ 2.55) tidak berubah.

Batas:
- Belum ada rekaman video; bukti berupa sampel frame dengan jarak scroll tercatat.
- Belum diuji di Safari/iOS dan perangkat fisik. Production menunggu pengguna.

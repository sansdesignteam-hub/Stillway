# QA mayor 25 Nov — laporan Developer (D-169, D-170)

Baseline `d0bf6a6`, branch `Developer`, `web-v2/`. Build lokal lulus (`npm run build`). Pengecekan dilakukan dengan Chrome headless pada 1440 × 900, 1440 × 700 dan 375 × 812, termasuk `?reduced-test` untuk reduced motion.

| Kartu | Status | Commit | Bukti |
|---|---|---|---|
| G-09 Tipografi | Selesai | `ed5ac78` | `G-09_before-after_1440.jpg`, `G-09_after_1440.jpg`, `G-09_after_375.jpg` |
| F-02 Hanken Grotesk di seluruh V2 (D-170) | Selesai, satu commit dengan G-09 | `ed5ac78` | sama dengan G-09 |
| G-10 Grid dan spacing | Selesai, dengan pengecualian di bawah | `45885ea` | `G-10_after_1440x900.jpg`, `G-10_after_1440x700.jpg`, `G-10_after_375.jpg` |
| SL-02 Cahaya S03 State 1 | Selesai | `2568693` | `SL-02_before-after.jpg`, `SL-02_transition_1440.jpg` |
| HE-02 Progres global | Selesai | `a644066` | `HE-02_1440_375.jpg` |

## G-09 dan F-02
- Geist diganti Hanken Grotesk Variable (`@fontsource-variable/hanken-grotesk` 5.3.0). Geist dihapus dari dependensi. Geist Mono dan headline serif tidak dipakai di V2, dan sisa namanya hanya ada di komentar riwayat.
- Token Mono Foundation ditambahkan. Label kapital (kaki hero, kicker S11 dan tanda tangan footer) sebelumnya tidak cocok dengan style mana pun. Sekarang label tersebut memakai Mono/Medium dan Mono/Large dalam Hanken Grotesk. Label jam dan data tetap kapital.
- Display 1 hanya dipakai pada wordmark hero dan footer. Kata "Everyday" S07 dipindah ke Display 2. "see your night." memakai Display 2. Judul S10/S11 memakai Heading 1.
- Pengecualian yang dipertahankan: ramp responsif Display/Heading (D-135) dari nilai mobile di 390 ke nilai desktop di 1440; angka besar S03 (`--n`, slot motion); kata latar S02 "rhythm" dan "it's wearable" (12vw, edge-to-edge); teks AppPhone yang diskalakan dengan `--u`. Proporsi AppPhone sudah diperiksa setelah pergantian font dan tidak ada yang bergeser.

## G-10
- Token bersama: gutter 32 di 1440 (kolom 84, margin 40), `--col`, `--grid`, `--content-top` (y 144 di tinggi 900, lebih kecil di layar pendek/ponsel), `--content-bottom` (baris bawah y 860) dan `--space-1..10` (4/8).
- Section yang disesuaikan: S01 dan S11 memakai grid 12 kolom dengan gutter bersama. S02, S04, S05, S06, S10 dan S11 berpatokan pada atas/bawah bersama. Celah dan padding di luar kelipatan 4/8 dipindah ke langkah 4/8.
- Tidak diubah karena dibutuhkan motion: pose ring, garis S07, geometri meja S06 dan posisi kartu S04/S05. Ukuran internal komponen (lingkaran hitung, tombol ukuran) belum diaudit satu per satu terhadap Figma.

## SL-02
- Kanal pose baru `edge`: satu cahaya dingin dari belakang kiri tanpa fill dan tanpa pengangkatan env, sehingga hanya satu tepi band yang terkena dan sisanya tenggelam di Night.
- Urutan (usulan PM untuk D-137/D-140): 02→03 gelap, lalu tepi dingin. State 1→2: cahaya sudut (5–40%), ring hangat (15–60%), lalu LED hijau (50–80%). State 2–4 tetap hangat.
- Semua nilai bergantung pada posisi scroll, sehingga scroll mundur membalik urutannya. Pada reduced motion, ring langsung berpindah dari State 1 dingin ke State 2 hangat. Still fallback S03 yang ada sudah menampilkan tampilan gelap State 1. Belum ada still hangat atau hijau untuk State 2–4 (aset 3D Designer).

## HE-02
- `Progress.astro`: 11 titik fixed di kiri, di tengah margin halaman. Section aktif tampil sebagai pill Cocoa (Cocoa/400 di latar terang, Cocoa/300 di Night dan foto). Kontras dengan latar sekitar 4:1 atau lebih.
- Indikator dikendalikan `story.ts` dari section yang sama dengan jam dan chapter navbar. Hasil cek: deep link `#finishes` → titik 10. Scroll mundur close → features → sleep → why → hero menghasilkan 11, 8, 3, 2, 1. Setelah resize, indikator tetap sesuai dengan hash.
- Indikator hanya penanda posisi: `aria-hidden`, tanpa tautan, tanpa transisi saat reduced motion, dan tersembunyi tanpa JS. Progres lokal S09 tidak diubah.

## Batas verifikasi
- Belum diuji di Safari/iOS atau perangkat fisik (D-168: pengguna akan menguji manual).
- Preview Vercel `stillway-two` untuk `a644066` berstatus selesai, tetapi URL branch meminta login Vercel, sehingga isinya tidak bisa dibuka dari sesi ini.
- Ditemukan, tetapi di luar cakupan: setelah viewport di-resize, posisi scroll dalam px tetap sama sehingga halaman bisa pindah section. Indikator, jam dan hash tetap saling sinkron.
- Halaman `dev-app.astro` diabaikan oleh git (lokal saja). Import fontnya diperbarui di disk.

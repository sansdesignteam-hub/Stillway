# Hero S01 foto meja hangat (D-177) — laporan Developer

Baseline `c9bc8aa`, commit `b7e6bdc`. `npm run build` lulus. Diuji dengan Chrome headless pada 1440 × 900 dan 375 × 812, termasuk `?reduced-test` (still fallback).

## Foto dan crop
- Sumber asli `design/assets/v2/hero/hero-warm-desk.png` (1672 × 941, SHA-1 d010b5e…).
- Varian di `public/hero/`: `hero-warm-desk-1672.webp` (73 KB) untuk desktop dan mobile, `hero-warm-desk-960.webp` (18 KB) untuk first paint (preload) sekaligus srcset kecil.
- Webp hero lama (outpaint) dan env lumut dihapus.
- Foto tidak di-outpaint, jadi zoom-out kini bergerak dari 1,14 (mobile 1,1) turun ke cover. Titik pusat zoom ada di alas kayu (`heroBg.anchor` 0.496 / 0.745), jadi tepi kosong tidak pernah terbuka dan titik mendarat tetap di tempat.
- Dim foto diturunkan dari 0,3 ke 0,12 karena foto sudah bernuansa malam. Wordmark, teks dan navigasi tetap terbaca (lihat screenshot); di area lampu navbar tetap memakai panel gelapnya.
- Di mobile, cover 16:9 memperlihatkan bagian tengah foto: alas di bawah, cincin melayang di atasnya; lampu dan laptop terpotong.

## Bayangan (rig 3D)
- Arah cahaya bayangan dari lampu kanan atas di belakang cincin (`SHADOW_DIR` 0.9, 1, −0.45), sehingga bayangan jatuh ke kiri depan, menjauhi lampu.
- Penerima bayangan berbentuk persegi panjang membulat seukuran permukaan atas alas (lebar 0,33 dan kedalaman 0,082 foto), jadi bayangan berhenti di tepi alas.
- Opacity 0,42 berkurang hingga 60 % semakin tinggi cincin di atas alas, agar bayangan terasa lembut.
- Perbandingan bayangan aktif/nonaktif: `D177_shadow_on_off.jpg`.

## Refleksi dan rig khusus S01
Semua lampu di bawah memudar mengikuti `pose.photo`, jadi S02 dan section lain tidak berubah.
- Kunci: lampu hangat `0xffdcb2` dari kanan atas, intensitas 2,6.
- Hemisphere: dinding gelap hangat di atas, pantulan kayu hangat dari bawah, intensitas 0,55.
- Fill lembut dari kiri, intensitas 0,35.
- Env S01: `hero-env-warm.jpg`, foto meja dalam bentuk equirect, di-blur dan diturunkan saturasinya (0,45) supaya Silver tetap Silver.
- Transisi ke S02 tetap memakai blend foto → paper yang sudah ada (9 langkah); hasilnya terlihat pada frame 2.6–3.2.

## Fallback dan reduced motion
- Still `fb-s01-polished` dirender di atas foto lumut sehingga memantulkan hijau. Sementara ini dinetralkan dengan CSS (grayscale + sepia ringan); pola dedaunan masih samar terlihat.
- Still bayangan (dipotong untuk batu V1, arahnya berlawanan) dimatikan.
- Saat WebGL siap, still berganti ke ring 3D di posisi yang sama, karena pose float tidak berubah.

## Kebutuhan aset untuk 3D Designer
- `fb-s01-polished` (frame 1024, ring 640 px di (512, 442), pose float S01 yang sama) dirender dengan env meja hangat: lampu kanan atas dan pantulan kayu dari bawah, tanpa pantulan hijau.
- Pasangannya `fb-s01-polished-shadow`: bayangan jatuh ke kiri depan di atas alas.
- Percobaan render dari stage web dengan latar transparan menghasilkan warna tembaga, jadi tidak dipakai (`D177_rejected_warm_still_render.png`).

## Bukti
- `D177_hero_1440_first.png`, `D177_hero_375_first.png`: frame awal hero.
- `D177_hero_1440_states.jpg`: u 0 → 0.6 → 1.4 → 2.0 → 2.6 → 3.2, yaitu hero awal, teks keluar, zoom, close-up, transisi, lalu S02.
- `D177_hero_375_states.jpg`: urutan yang sama di mobile.
- `D177_shadow_on_off.jpg`, `D177_reduced_fallback.jpg`.

## Batas
- Bayangan PCFSoft tidak bisa diatur tingkat blur-nya per jarak, jadi ketajamannya tetap; yang menyesuaikan jarak hanya intensitasnya.
- Belum diuji di Safari/iOS dan perangkat fisik. Production menunggu pengguna.

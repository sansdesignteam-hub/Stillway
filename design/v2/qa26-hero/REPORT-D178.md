# Koreksi refleksi dan bayangan hero (D-178) — laporan Developer

Baseline `293337a`, commit `16a7bfe`. `npm run build` lulus. Diuji dengan Chrome headless pada 1440 × 900 dan 375 × 812. Mode yang diperiksa: 3D normal, WebGL diblokir (sama dengan poster saat first paint atau loading lambat sebelum WebGL siap), dan `?reduced-test`.

## 1. Refleksi dan poster
- **Penyebab:** poster `fb-s01-polished` dirender di atas foto lumut. Filter CSS D-177 hanya meredam warnanya; pola daunnya tetap terlihat.
- **Perbaikan:**
  - Poster baru `fb-s01-warm.webp` dirender dari ring S01 live dengan rig meja hangat, pada framing still yang sama (1024, ring 640 px di (512, 442)), lalu di-matte dari dua capture berlatar hitam dan putih.
  - Poster lama dan filter CSS dihapus.
- **Bukti:** first paint, loading lambat, reduced dan no-WebGL kini menampilkan ring yang sama dengan 3D (`D178_1440_nowebgl_reduced_3d.jpg`, `D178_375_…`).
- **Selisih poster vs 3D:** di desktop praktis nol; di mobile beberapa piksel karena perspektif kamera berbeda saat ring berada di atas tengah layar.
- Ring 3D sendiri sejak D-177 sudah memakai env meja hangat dan cahaya dari kanan.

## 2. Bayangan
- **Penyebab garis potong:**
  - D-177 hanya punya satu penerima bayangan, yaitu permukaan atas alas.
  - Batas kamera bayangan (±1,6–2,6 × lebar ring) memotong bayangan berupa garis lurus.
- **Perbaikan:**
  - Ditambah penerima kedua di meja, satu tinggi sisi alas lebih rendah, dengan lubang seukuran tapak alas dan area di belakangnya yang tertutup alas. Bayangan kini berlanjut dari atas alas ke meja tanpa garis potong.
  - Arah cahaya dibuat lebih menyamping dari lampu kanan atas, sehingga bayangan jatuh ke kiri.
  - Opacity 0,6, berkurang seiring tinggi ring.
  - Batas kamera bayangan diperluas menjadi ±7 × lebar ring, map 2048.
- **Bukti:** `D178_shadow_closeup_3d.png`, `D178_closeup_poster_vs_3d_motion.jpg` (poster, lalu u 0 / 0.25 / 0.5 / 0.75 saat ring bergerak), `D178_shadow_pass_isolated.png` (bayangan saja, tanpa garis potong).
- **Fallback:** `fb-s01-warm-shadow.webp` diambil dari selisih pass bayangan live (on/off), dengan area ring di-mask dan tepi di-feather, dalam frame dua kali lebih lebar. Di mobile, ring melayang tanpa bayangan seperti sebelumnya.

## Evaluasi: perlukah objek 3D baru?
**Terbukti dari pengujian (dua penerima datar, aset yang ada):**
- Bayangan kontinu dari atas alas ke meja, tanpa garis potong dari batas kamera maupun tepi penerima.
- Arahnya ke kiri, menjauhi lampu.
- Perspektif mengikuti kemiringan foto (rotasi penerima −π/2 + 0,32, sama dengan D-177).
- Dampak performa: satu mesh tambahan sekitar 100 segitiga dan shadow map 2048 (sebelumnya 1024), hanya aktif di S01.

**Belum sempurna (pengamatan):**
- Sisi depan dan kiri alas tidak menerima bayangan; yang menerima hanya bidang atas dan meja. Di close-up, bayangan meja tampak muncul dari balik sudut kiri alas tanpa menuruni sisinya.
- Lubang penerima meja diturunkan dari foto sebagai persegi panjang membulat. Tepinya bisa meleset beberapa piksel dari kontur alas asli, paling terlihat di sudut kiri bawah.
- Ketajaman bayangan tetap (PCF soft); yang berubah terhadap jarak hanya intensitasnya.

**Usulan (belum diuji):**
- Satu objek minimum: proxy alas berupa rounded box khusus shadow (tidak terlihat, hanya menerima bayangan dan menutup meja di belakangnya), dengan dimensi dan posisi yang dicocokkan ke alas di foto: lebar, kedalaman, tinggi, dan radius sudut.
- Dengan proxy ini sisi alas menerima bayangan, occlusion meja menjadi tepat, dan dua penerima datar beserta lubangnya bisa diganti satu proxy plus satu bidang meja.
- Biaya: kurang dari 1k segitiga dan tanpa tekstur. Bisa dibuat Developer dari primitif Three.js, atau oleh 3D Designer bila perlu presisi dari foto (fSpy/kalibrasi kamera).
- Bayangan dengan blur yang membesar sesuai jarak (PCSS) atau dibuat statis (baked) adalah opsi lanjutan; keduanya tidak wajib.

## Batas
- Belum diuji di Safari/iOS dan perangkat fisik. "Loading lambat" disimulasikan dengan memblokir WebGL (poster bertahan), bukan dengan throttle jaringan.
- Handoff 3D (`design/3d/v2/HANDOFF-v2-ring.md`) masih menyebut poster lama `fb-s01-polished`; file web-nya sudah diganti.
- Production menunggu pengguna.

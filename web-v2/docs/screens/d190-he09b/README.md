# HE-09b (D-190) — tombol pill mengikuti hover ayocin.com

- `he09b-frames.jpg`: diam → 300/420/520 ms (dari 900) → hover penuh untuk navbar Night, navbar Paper, CTA Finishes, CTA Closing; baris bawah ayocin.com "Order Now".
- `he09b-rim-4x.jpg`: rim 2 px pada 4× (hover kiri/kanan, lingkaran saat diam).
- `he09b-mobile-focus.jpg`: 375×812 (navbar, menu, CTA Finishes) dan fokus keyboard.

Cara: lingkaran = isian `--btn-dot` yang di-clip, inset 2 px; hover membuka clip sampai penuh (0,9 s `cubic-bezier(0.77,0,0.18,1)`, tanpa delay, sama dengan isian ayocin). Label tidak di-cross-fade: salinannya berada di dalam isian dengan warna lawan, jadi huruf terbelah dua warna tepat di tepi isian.

Berbeda dari brief: transisi warna teks pill ayocin (0,8 s, delay 0,2 s) tidak dipakai, karena itulah yang membuat huruf samar (terlihat juga di frame 450 ms ayocin).

Keterbatasan:
- HP: CTA navbar hanya panah, jadi pill = lingkaran; tampilan diam dan hover sama.
- Diuji di Chrome headless (emulasi), bukan Safari atau perangkat fisik. Frame tengah diambil dengan menghentikan transisi pada waktu tertentu. Tap sentuh tidak direkam.

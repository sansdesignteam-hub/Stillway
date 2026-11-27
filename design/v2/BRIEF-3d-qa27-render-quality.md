# Brief 3D Designer — QA 27 Nov · kualitas render close-up ring (G-18; G-17 sudah diperbaiki pengguna, D-188)

Keputusan: D-187 di `context/decisions.md` (worktree PM). Sumber: Figma QA-27 Nov 2026, kartu G-17 (`40004774:6592`) dan G-18 (`40004774:6616`). Kerjakan **setelah** D-186 selesai dan dilaporkan.

1. **[SELESAI, D-188: tidak perlu dikerjakan] G-17 · Bercak hitam/titik-titik di jendela sensor.** Di staging, Hero State 1 (06:50, ring di atas dudukan kayu): dua jendela sensor dan dua titik LED di sisi dalam ring tampil berbercak hitam/titik-titik seperti noise atau tekstur kotor. Close-up berikutnya (sensor dengan LED hijau) sudah bersih. Target: jendela sensor dan LED bersih dan halus, kaca gelap dengan pantulan lembut. Cek material/texture map (roughness/normal), resolusi tekstur, mipmap/anisotropy, normal map seam, shadow acne (shadow bias / normalBias di web), dan noise render (denoise/samples) pada gambar diam/plate. Pengguna menetapkan layout dan latar hero sudah final; yang diperbaiki hanya kualitas render ring.
2. **G-18 · Tepi grafir "Stillway" bergerigi di ring hitam.** Di S03 Sleep State 1 (23:10, ring hitam), tepi huruf grafir tampil sebagai garis putih tipis putus-putus (aliasing), terlihat seperti tempelan. Target: tepi grafir halus dan menyatu dengan band, dengan bevel/chamfer kecil di tepi huruf, anti-aliasing cukup, dan highlight tepi yang lembut serta kontinu.

Acuan kualitas: ring emas di Hero State 1 (di atas batu). Jendela sensor, titik LED, dan grafir di sana sudah halus. Samakan semua close-up ring lain dengan acuan ini; temukan lokasi persisnya di staging https://stillway-two-git-developer-sans-brothers.vercel.app.

Bila perbaikan ada di sisi web (shader, shadow bias, tekstur GLB, pixel ratio), siapkan aset/parameter dan catatan pemasangan untuk Developer; jangan ubah `web-v2/` sendiri. Bukti: crop close-up sebelum/sesudah pada kamera yang sama (sensor hero, grafir S03 ring hitam) dan commit di branch `3D-Designer`.

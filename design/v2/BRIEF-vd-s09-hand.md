# Brief Visual Director: tangan memegang ponsel untuk S09 (D-160)

Status: disetujui pengguna 24 Nov 2026 (D-160). Gambar AI; pengguna meninjau sebelum dipasang.

## Konteks

S09 "The app" menampilkan ponsel dengan UI app Stillway dalam HTML (D-159, gaya app Ultrahuman). Pengguna ingin ponselnya **dipegang tangan** seperti referensi Ultrahuman:
- `design/v2/references/s09-ref-uh-vitals.png`, `s09-ref-uh-sleep.png`, `s09-ref-uh-longevity.png` (tangan memegang ponsel dari bawah kiri, ibu jari di tepi kiri, jari-jari melingkar di belakang/kanan, latar putih, tab pill menumpuk bagian bawah ponsel).

## Yang dibuat

- Tangan pria dewasa karakter C-02, kulit **sawo matang / tan medium** seperti foto tangan S06 (`design/assets/v2/A-1-hand-left-alpha.png`), kuku pendek bersih, tanpa cincin (ring tidak dipakai di S09). Pose memegang ponsel tegak seperti referensi; boleh tangan kiri atau kanan, pilih yang paling alami.
- **Ponsel hitam modern tanpa logo/merek** (bingkai tipis, sudut membulat, pulau kamera berbentuk pil di atas, tanpa tombol mencolok). Rasio layar ±19,5:9 seperti iPhone.
- **Layar kosong dan transparan (alpha)**, sudut layar membulat bersih, supaya Developer menaruh UI HTML di belakangnya. Jari tidak menutupi area layar.
- **Latar transparan (alpha)**; tangan keluar dari tepi bawah bingkai (lengan terpotong di bawah, dipudarkan halus atau keluar bingkai), sehingga di web bisa naik dari bawah tanpa tepi potong terlihat.
- Pencahayaan studio lembut dan netral-hangat, cocok untuk latar Paper terang maupun gelap; bayangan dalam (antara jari dan ponsel) natural.
- Resolusi tinggi: tinggi gambar ≥ 2400 px.

## Keluaran

- `design/assets/v2/A-5-hand-phone.png` (master, alpha) dan versi web `design/assets/v2/app/A-5-hand-phone-1600.webp`, `-2400.webp` (alpha).
- **Catatan koordinat untuk Developer** (`design/assets/v2/app/README.md`): posisi dan ukuran persegi layar dalam piksel gambar (x, y, lebar, tinggi, radius sudut), plus apakah ada jari yang berada di depan bingkai ponsel. Bila memungkinkan, sertakan juga lapisan terpisah untuk ibu jari/jari yang menumpuk bingkai (`A-5-hand-phone-front.png`) supaya tab pill bisa berada di antara.
- 2 variasi pose bila memungkinkan.
- Pakai `/gpt-image-bridge`; catat prompt dan status AI. Commit dan push ke `Visual-Director`, jangan merge ke `main`.

## Laporan

Commit, path file, ukuran, koordinat layar, dan render pratinjau dengan layar diisi warna gelap untuk tinjauan pengguna.

# Brief Visual Director: foto latar layar Recovery di app S09 (D-163)

Status: disetujui pengguna 24 Nov 2026. Gambar AI; pengguna meninjau sebelum dipasang.

## Konteks

Layar Recovery di ponsel S09 akan memakai foto latar penuh dengan dial/gauge recovery di atasnya. Acuan rasa: `design/v2/references/s09-ref-oura-recovery-photo.png` (tangan rileks memakai ring, cahaya hangat lembut penuh layar, latar gradasi warna tunggal, foto dipakai sebagai latar UI). Jangan meniru merek, teks, atau komposisi persis referensi.

## Yang dibuat

- Potret vertikal untuk layar ponsel (rasio ±9:19,5, mis. 1290×2796), ruang tenang di sepertiga atas–tengah untuk dial dan angka putih.
- Tangan pria C-02 (kulit sawo matang, seperti `design/assets/v2/A-1-hand-left-alpha.png`) dalam pose rileks/istirahat, memakai **ring Stillway Silver polished** dengan ukiran "Stillway" benar (D-061, D-085); ring terlihat jelas tapi tidak dominan.
- Nuansa **ungu–cocoa gelap** (warna mode Recovery #A06BFF dibenamkan ke Night/Cocoa), cahaya lembut hangat dari samping, kontras sedang, kesan malam yang tenang. Bukan oranye seperti referensi.
- Tanpa teks, logo, atau watermark.
- 2 variasi (pose/arah cahaya berbeda).

## Keluaran

- Master `design/assets/v2/A-6-recovery-bg-a.png`, `-b.png`; web `design/assets/v2/app/A-6-recovery-bg-{a,b}-1290.webp` dan `-860.webp`.
- Catat prompt + status AI di `design/assets/v2/app/README.md`.
- Pakai `/gpt-image-bridge`. Commit dan push ke `Visual-Director`, jangan merge ke `main`.

## Laporan

Commit, path, ukuran, dan pratinjau dengan mock dial + angka putih di atasnya.

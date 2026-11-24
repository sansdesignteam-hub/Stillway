# Brief Developer: S09 app diperkaya (D-163)

Status: disetujui pengguna 24 Nov 2026. Kerjakan di branch `Developer` di atas `f55056a`. Gaya tetap D-162 (tenang, Stillway, bukan tiruan Ultrahuman/Oura). Pakai skill `/Users/zaimmaulana/.agents/skills/design-taste-frontend` (references/app-screens.md) dan cek crop layar penuh sebelum melapor.

Referensi (`design/v2/references/`): `s09-ref-uh-vitals-detail.png`, `s09-current-sleep.png`, `s09-ref-uh-sleep-detail.png`, `s09-ref-oura-recovery-photo.png`.

## Kata pengguna

1. "Kamu boleh menambah detail data lagi supaya tampilannya lebih menarik" (acuan kepadatan app Ultrahuman, ultrahuman.com/id/ring-pro).
2. "Untuk tampilan sleep ini keren, cuma untuk settled dan woke briefly, bisa kamu buat jadi card saja, atau bisa kamu buat graphicnya juga seperti referensi. Jadi kamu boleh menambahkan detail lagi."
3. "Untuk recovery juga sama, untuk grafiknya kurang menarik. Kamu bisa juga membuat ada background image nya kaya gini dengan tampilan monitor recovery lebih outstanding."

Kalimat Heart rate "Steady through the day, up once on the stairs." disetujui.

## Yang dibuat

Isi layar boleh lebih tinggi dari layar; gerak D-161 (kartu masuk berurutan, count-up, grafik tergambar, isi layar bergulir pelan ke atas) memperlihatkan bagian bawah.

### Heart rate
- Pertahankan bagian atas (58 bpm + kalimat + pita hari).
- Tambah 3–4 kartu kecil kaca dalam grid 2 kolom, masing-masing chip label kecil + nilai + grafik mini yang berbeda jenisnya, misalnya: Resting HR minggu ini (titik + garis acuan putus-putus), HRV siang (garis), Skin temperature deviation (+0.1 °C, penanda pada skala), Active minutes (cincin/progres).
- Warna: grafik hijau mode + putih; status pendek bila perlu (mis. "Within your usual range"), tidak menyuruh.

### Sleep
- Pertahankan tampilan sekarang (7h 12m, blok tahap, kunci Deep/REM/Light).
- "Settled 23:10" dan "Woke briefly 2×" menjadi dua kartu kaca dengan grafik kecil (mis. jam settle pada garis malam; dua tanda bangun pada garis waktu).
- Tambah detail seperti referensi: hypnogram tahap per waktu (batang/blok bertingkat), "Sleep cycles · 5" dengan pita siklus, dan "Restless periods" atau "Time in bed".

### Recovery
- Layar memakai **foto latar penuh** (tangan memakai ring Stillway, nuansa ungu-cocoa, seperti rasa foto Oura di referensi). Visual Director sedang membuatnya (`design/assets/v2/app/A-6-recovery-bg-*.webp`); sementara itu pakai latar gradasi gelap ungu-cocoa dengan struktur yang sama, siap diganti.
- **Monitor recovery berupa dial/gauge**: busur besar dengan skala tick, penanda posisi, nilai besar (HRV 64 ms atau skor recovery) dan label status ("Steady"), label ujung skala. Gerak: jarum/penanda bergerak dan nilai count-up.
- Di bawahnya tetap ringkasan minggu (tujuh hari) dan detail kecil (Resting heart rate 58 bpm, Slept 7h 12m) dalam kartu kaca di atas foto (teks tetap terbaca).

## Aturan

- Teks Inggris, font Geist, warna netral untuk teks (D-156); warna mode hanya pada data/glow.
- Angka baru konsisten dengan website (58 bpm, 82 bpm 15:30, 23:10 → 06:22, 7h 12m, Broken 2×, HRV 64). Copy baru = draf; tulis daftarnya di laporan.
- Tanpa nama/logo/copy Ultrahuman atau Oura. Tanpa tab pill dan beam (D-162).
- Desktop 1440 + mobile 390. Reduced motion: fade pendek.
- `npm run build` lulus, push ke `origin/Developer` (staging). Jangan merge ke `main`.

## Laporan

Commit, crop layar ponsel penuh tiap mode (termasuk bagian bawah yang bergulir), urutan gerak, daftar angka/copy baru, poin anti-slop yang dicek.

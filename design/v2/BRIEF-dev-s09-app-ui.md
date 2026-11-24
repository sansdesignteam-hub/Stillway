# Brief Developer: perbaikan kecil (D-158) dan UI app S09 gaya Ultrahuman (D-159)

Status: disetujui pengguna 24 Nov 2026. Kerjakan di branch `Developer` di atas `1ee3479`. Dua commit: A (D-158) lalu B (D-159).

## A. D-158 — perbaikan kecil

1. **S04 judul:** "Activity" putih, sama dengan "and rest." (`fix-s04-activity-grey.png`).
2. **S05 chip "LAST NIGHT":** garis luar putih tipis/transparan (mis. Paper 40–50%), bukan ochre (`fix-s05-chip-border.png`).
3. **S08 legenda:** baris "Red means it’s off." memakai grid yang sama dengan baris di atasnya: titik di kolom yang sama, jarak titik → teks sama, ukuran teks sama dengan label legenda (Heart rate/Sleep/Recovery) (`fix-s08-red-row.png`). Cek State 3 dan 4, desktop dan mobile.

## B. D-159 — UI app S09 seperti app Ultrahuman

### Referensi (`design/v2/references/`)

- `s09-ref-uh-vitals.png`: grid kartu kaca (Heart rate dengan grafik garis bergerigi, Cardio age dengan cincin progres, Resting HR / HRV dengan grafik titik + garis acuan putus-putus), latar gelap bergradasi maroon, tab pill "Sleep · Vitals · Powerplugs · Longevity" di bawah.
- `s09-ref-uh-sleep.png`: kartu skor tidur dengan garis waktu, kartu "Sleep Stages" dengan batang tahap berwarna, angka besar, hypnogram batang; gradasi teal.
- `s09-ref-uh-longevity.png`: angka besar di tengah, chip status, sorot cahaya vertikal dari panel, ikon kontributor; gradasi hijau.
- Situs: https://www.ultrahuman.com/id/ring-pro/ (bagian app). Buka di browser untuk melihat detail glass, cahaya, dan transisi antar-tab.

### Yang dibuat

Ambil **gaya**, bukan konten atau merek:
- **Layar app:** status bar iOS (9:41, sinyal, baterai), latar gelap dengan gradasi/cahaya warna per mode yang naik dari bawah/atas seperti referensi.
- **Warna per mode (tafsiran PM, D-159):** Heart rate = hijau (`--led-heart-rate`), Sleep = biru (`--led-sleep`), Recovery = ungu (`--led-recovery`), masing-masing dibenamkan ke Night/Cocoa sehingga terasa seperti maroon/teal di referensi (bukan neon penuh). Warna terang penuh hanya untuk aksen grafik, titik, dan status kecil.
- **Kartu kaca:** sudut besar (±16–20 px), latar semi-transparan dengan blur, garis tepi tipis terang, chip label kecil kapital di kiri atas tiap kartu.
- **Isi tiap mode** (pakai copy dan angka yang sudah ada di `content/copy.ts` app, D-066; tambah seperlunya dengan label simulasi):
  - **Heart rate:** kartu "Resting 58 bpm" + grafik garis bergerigi sepanjang hari dengan titik "now"; kartu puncak "Peak 82 bpm · 15:30 stairs"; kartu kecil lain bergaya Resting HR/HRV dengan grafik titik + garis acuan putus-putus.
  - **Sleep:** kartu ringkasan "7h 12m" + garis waktu "Settled 23:10 → Up 06:22"; kartu tahap tidur (Deep 1h 24m, REM 1h 36m, Light 4h 12m) sebagai batang berwarna dengan persen; hypnogram batang seperti referensi.
  - **Recovery:** angka besar di tengah (mis. HRV hari ini) dengan chip status singkat ("Steady day, calm evening."), sorot cahaya dari panel seperti referensi Longevity, grafik HRV minggu ini (Mon–Sun) dengan hari ini penuh warna.
- **Tab pill kaca** di bawah ponsel (menumpuk tepi bawah ponsel seperti referensi): "Heart rate · Sleep · Recovery", tab aktif disorot, mengikuti state scroll S09 (tetap label, bukan wajib bisa diklik; klik untuk lompat boleh).
- Transisi antar-mode halus (crossfade + gerak naik kecil kartu, cahaya berganti warna).
- Font Geist saja (D-156). Teks Inggris. Label "Simulated data" tetap ada di section.
- UI tetap HTML/CSS/SVG (bukan gambar), tajam di retina.

### Batasan

- Jangan pakai nama, logo, ikon, atau copy Ultrahuman ("Powerplugs", "Longevity", "Ultra Age", dst.).
- Layout section S09 di luar ponsel (teks kiri/kanan, footer) tidak berubah kecuali perlu memberi ruang tab pill.
- Desktop 1440 dan mobile 390. Reduced motion: fade pendek.
- `npm run build` lulus, push ke `origin/Developer` (staging). Jangan merge ke `main`.

## Laporan

Commit A dan B, status Preview, frame S04 judul, S05 chip, S08 State 3–4, dan S09 tiap mode (desktop + mobile) berdampingan dengan referensi Ultrahuman yang sesuai, plus crop layar ponsel ukuran penuh.

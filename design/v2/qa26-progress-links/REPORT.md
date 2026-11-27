# Penanda progres global menjadi link section (D-176) — laporan Developer

Baseline `c63c694`, commit `999c00c`. `npm run build` lulus. Diuji dengan Chrome headless pada 1440 × 900 (mouse/keyboard), 375 × 812 (touch) dan `?reduced-test`. Log lengkap ada di `D176_qa_log.txt`.

## Implementasi
- `<nav aria-label="Page sections">` berisi 11 `<a>`. Hero mengarah ke `#top`; section lain ke `#id` masing-masing. Nama aksesibel diambil dari daftar section: Hero, Why Stillway, Sleep summary, Activity & rest, Daily insight, Product details, Specs & benefits, Features, The app, Finishes & pricing, "Closing, FAQ & footer".
- Navigasi memakai `initAnchors` yang sudah ada: Lenis menuju state 1 section, dengan landing dan hash yang sama seperti navbar.
- Section aktif ditandai `aria-current="location"` dan dash yang sudah ada. Titik dan dash tidak berubah ukuran maupun posisi.
- Target klik 24 × 24 px, bertumpuk tanpa tumpang tindih di margin kiri (desktop 36 × 24, sampai tepi konten di x 40).
- Saat idle-hidden (2,5 detik tanpa scroll, D-171): opacity 0 dan `pointer-events: none`, jadi tidak menangkap klik maupun tap.
- Indikator tampil saat scroll, saat salah satu penanda mendapat fokus keyboard (`:focus-visible`), dan tetap tampil selama mouse berada di atasnya (hanya perangkat hover, supaya tap di layar sentuh tidak membuatnya menempel).
- Outline fokus memakai `--focus`: gelap di latar terang, putih di latar gelap. z-index 40, di bawah navbar (50) dan menu (80).

## Hasil uji
- Klik/tap penanda pertama, tengah dan terakhir (10, 6, 11, 1) berpindah ke section yang tepat. Hash dan penanda aktif sesuai: #finishes, #details, #close, lalu tanpa hash untuk Hero.
- Mobile: tap ke Finishes & pricing menaruh judul S10 di y 72, sama dengan nav/deep link D-171.
- Idle: setelah 3 detik indikator tersembunyi dan titik tengah penanda tidak lagi menangkap tap (`hitIsMarker: false`). Jika pointer masih di atasnya, indikator tetap tampil dan bisa diklik.
- Keyboard: Tab membawa fokus ke penanda dan menampilkan indikator, yang tetap tampil selama fokus ada di sana. Enter menavigasi; hash dan `aria-current` ikut diperbarui.
- Reduced motion: navigasi berpindah langsung tanpa animasi; hasil hash dan penanda aktif sama.
- Deep link `#app` → "The app". Link Home dan "Back to top" → y 0, penanda Hero aktif.
- Menu mobile terbuka di atas indikator (backdrop menu yang menerima tap).

## Batas
- Di mobile, jarak antar titik menjadi 24 px (sebelumnya ±11 px) karena ukuran target; kolomnya lebih tinggi (±264 px).
- Di mobile, target 24 px menutupi 8 px tepi kiri area konten, dan hanya selama indikator tampil.
- Belum diuji di Safari/iOS, perangkat fisik, atau screen reader nyata. Production menunggu pengguna.

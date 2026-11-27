# Brief Visual Director — F-07 favicon dari logo 03A

Keputusan: D-188 di `context/decisions.md` (worktree PM). Kartu Figma F-07 (`40004772:8299`, QA-27 Nov). Logo navbar dan footer sudah memakai lockup 03A ("Dua takik") sejak D-183. Yang belum ada adalah ikon tab peramban (favicon) dan ikon perangkat dari logo baru itu. Favicon lama D-126 (huruf "S") diganti.

Sumber: `design/assets/v2/logo/stillway-lockup-03a-dark.svg` dan `-light.svg` (Figma `40004769:5851`, node `5897` / `6023`), acuan `logo-03a-ref.png`. Simbolnya adalah elips cincin dengan dua takik di kiri lockup.

Buat di `design/assets/v2/meta/` (branch `Visual-Director`):
1. `favicon.svg`: hanya simbol 03A tanpa wordmark, bentuk dan proporsi sama persis dengan lockup (ambil path dari SVG, jangan digambar ulang). Persegi, simbol di tengah dengan margin aman. Dukung tema terang/gelap tab lewat `@media (prefers-color-scheme: dark)` di dalam SVG (Ink di tema terang, Paper di tema gelap; nilai warna dari Variable Figma terbaru, D-168), atau gunakan versi dengan latar agar terbaca di kedua tema. Pilih salah satu dan jelaskan alasannya.
2. `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png` 180×180 (latar solid, tanpa transparansi), `icon-192.png` dan `icon-512.png`. Pastikan dua takik tetap terbaca di 16 dan 32 px; bila hilang, buat penyederhanaan optis kecil khusus ukuran kecil dan catat.
3. og:image tidak diubah.

Bukti: lembar pratinjau PNG yang menampilkan semua ukuran di latar terang dan gelap, plus simulasi tab peramban 16/32 px. Commit di branch `Visual-Director`, lalu lapor path file dan commit. Pemasangan di `web-v2` dikerjakan Developer setelah PM meninjau.

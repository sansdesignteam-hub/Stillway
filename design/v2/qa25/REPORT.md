# Laporan Developer — Revisi MINOR QA 25 Nov

Branch `Developer`, brief `design/v2/BRIEF-dev-qa25-minor.md`. `npm run build` lulus (tiap commit juga dibuild).
Screenshot: `<kode>_<bagian>_<lebar>.jpg` (1512×827 dan 375×812), dari preview lokal di Chrome headless.

| Kode | Status | Commit | Catatan |
|---|---|---|---|
| R-04, G-03, M-01 | Selesai | a1ad082, 73a6ff4 | S02, S03, S06, S08, S10: teks lama keluar dulu. Cross-fade layar HP S09 (D-165) tidak diubah. |
| HR-01 | Selesai | 84ef94b | |
| G-14 | Selesai | 84ef94b | Konten dipudarkan sebelum area navbar; ring 3D 06→07 dan 08→09 pudar lebih awal. |
| G-15 | Selesai | 84ef94b | Jam ganti saat gelap mulai terlihat dari bawah. |
| HE-01 | Selesai | 84ef94b | `aria-current="location"`. |
| HE-06 | Selesai | 84ef94b | Hash = id section (`#why` …, `#faq`); reload mengikuti posisi scroll browser. |
| G-16 | Selesai, 1 deviasi | 60b26ac | 12 stop + grain untuk 02→03, →S11, Dusk→Paper, Night→Paper. Ujung gelap memakai Night (Cocoa/950), bukan Neutral/950, supaya menyatu dengan latar section. Nilai hex token di Figma berbeda dari `tokens.css` (token warna = MAYOR, tidak disentuh). |
| HR-02, W-01, W-05 | Selesai | d47409c | Kalimat W-05 lebih panjang: di desktop jadi dua baris supaya tidak menabrak ring. |
| A-01 | Selesai | d40966a | AVIF/WebP 540, 800, 1060 w. |
| I-02 | Selesai | d40966a | Redup State 2 dihapus, ring digeser ke kanan, teks hilang penuh sebelum kamera masuk lubang. |
| I-04 | Selesai | d40966a | |
| D-04 | Selesai | d40966a | Meja + ring pudar di u 2.55–2.85, tangan naik setelahnya. |
| F-17 | Selesai | 485b7f0 | |
| M-06 | Selesai | 485b7f0 | Panel mobile dipadatkan; nama di bawah swatch disembunyikan visual (tetap terbaca screen reader). |
| M-03, M-05, M-08, M-09 | Selesai | c0a8b99 | |
| M-04 | Selesai | c0a8b99 | Terpotong tidak tereproduksi di 375×812; legenda tetap dipindah ke atas ring. |
| M-07 | Selesai | c0a8b99 | Wordmark footer ikut dirapikan agar tidak melebarkan layar. |
| G-07 | Selesai | 87cf80e | Belum diuji dengan screen reader asli. |
| HE-07 | Selesai | 87cf80e | Teks baru "This page is not here." / "Back to the start" = draf, perlu persetujuan. Belum dicek di staging. |

Belum diuji: perangkat fisik dan Safari/iOS. Tidak di-merge ke `main`.

# Brief Developer — revisi hasil review staging Stillway

Sumber: enam catatan pengguna dan screenshot pada 25 November 2026 (D-171). Baseline branch Developer 4126fa7. Kerjakan di web-v2/ dan deploy ke staging melalui origin/Developer.

1. **HE-02, indikator global.** Buat lebih minimal seperti screenshot 1 dan [VITURE Mobile Dock Mini](https://www.viture.com/mobile-dock-mini). Susunan vertikal 11 titik dengan penanda aktif berupa garis pendek horizontal, mengikuti bentuk yang terlihat di referensi. Gunakan hitam di latar terang, putih di latar gelap, dan titik nonaktif dengan opacity lembut. Sembunyikan setelah 2,5 detik tanpa scroll, tampilkan kembali saat posisi scroll bergerak. Cek kontras antar-latar, scroll dua arah, deep link, reduced motion, dan mobile.
2. **S07, “Everyday”.** Besarkan mendekati screenshot 3. Sebagai acuan desktop, lebar kata sekitar 80% bidang foto pada komposisi 1440px. Pertahankan Hanken Grotesk dan cek agar teks tetap muat di mobile. Screenshot 2 menunjukkan tampilan yang terlalu kecil.
3. **S09, hapus keterangan bawah dan progres lokal.** Hapus label yang berganti antara “Heart rate”, “Sleep”, dan “Recovery” di kiri bawah layar, serta seluruh kelompok “Scroll down”, garis progres, dan persentasenya di kanan bawah (screenshot 4). Label dan metrik di dalam layar HP tetap diperlukan untuk simulasi.
4. **S02, hapus label “WHY STILLWAY”.** Hapus label visual di kiri atas (screenshot 5). Pertahankan nama aksesibel section jika label tersebut dipakai sebagai referensi ARIA.
5. **S11, footer mengikuti tinggi konten.** Hilangkan ruang kosong berlebih antara tautan “Back to top” dan wordmark (screenshot 6). Gunakan padding/gap yang wajar tanpa memaksa footer mengisi tinggi viewport. Cek desktop, mobile, posisi akhir scroll, dan akses keyboard.
6. **S10, alur mobile Size and finish.** Tampilkan judul, ring, dan panel pilihan dalam alur scroll biasa dengan tinggi mengikuti konten (screenshot 7). Hilangkan pin, fade, dan perubahan skala ring yang dipicu scroll untuk alur mobile ini. Pastikan menuju dan keluar dari S10 tetap mulus, CTA/nav tetap menuju bagian yang benar, dan pemilihan finish, pencahayaan, ukuran, serta interaksi ring tetap bekerja. Pertahankan perilaku desktop sesuai lingkup yang diminta. Cek 375px dan viewport pendek, scroll dua arah, resize, serta reduced motion.

## Screenshot pengguna

1. `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/f8dce200-5e8c-4055-9d31-f8b6a5912486/orca-paste-1795599588249-ec133ff4-5100-463c-80ba-fd0b0709b086.png`
2. `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/ff506169-2f19-4142-a012-f0faa7feb8f2/orca-paste-1795599795332-fb243801-9585-4cbe-8bb9-d48a93760e07.png`
3. `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/e5ab3c41-b65a-49a8-9e51-68f3f3058152/orca-paste-1795599883418-33b02438-147c-40e4-b9f1-c3aea0f3f40a.png`
4. `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/e704cf8a-3777-447e-9909-51c76282f0c6/orca-paste-1795599951052-2ed64358-d01e-44d1-bccc-386c7a264ceb.png`
5. `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/a84c5beb-2731-46dd-8180-1d07806b1517/orca-paste-1795600036757-01199391-891b-4bdd-977d-98965e369c4d.png`
6. `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/8cdea828-4bfd-4923-81f0-d79ef672c8a8/orca-paste-1795600178349-63e823c6-e43c-44da-9257-140b58d8fe35.png`
7. `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/12d8ef03-3002-4ab4-ae00-a40fe2e55668/orca-paste-1795600250062-7b22639b-3667-447d-99b9-f74349085785.png`

Jalankan npm run build dan periksa hasil desktop/mobile dengan bukti visual. Laporkan status, commit dan bukti setiap catatan, lalu push ke origin/Developer. PM meninjau hasil dan mengurus Figma. Production menunggu instruksi pengguna.

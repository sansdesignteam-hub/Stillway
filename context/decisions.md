# Catatan keputusan proyek

Diperbarui: 17 November 2026.

## Status

Brand Stillway dan fokus fase ini pada Home/landing page telah disetujui. Strategy Director menangani strategi pesan, struktur konten, dan copywriting website. Visual Director menangani arahan visual, storytelling visual, konsep/style, dan image generation. Developer mengimplementasikan Home sebagai kode (Astro, lokal); pekerjaan dimulai setelah handoff Visual Director (D-022 sampai D-025). Perangkat, jumlah frame, serta CTA Home masih terbuka.

## Keputusan yang telah disetujui

Sumber seluruh keputusan awal: instruksi pengguna pada 17 November 2026.

| ID | Keputusan | Alasan / dasar |
| --- | --- | --- |
| D-001 | Proyek konsep Smart Ring e-commerce untuk portofolio Sans Brothers. | Tujuan yang dinyatakan pengguna; rincian tujuan portofolio dicatat pada D-008 sampai D-010. |
| D-002 | Nyatakan proyek sebagai design exploration, bukan produk atau klien nyata. | Menjaga konteks dan atribusi karya tetap jujur. |
| D-003 | Susun brief melalui pertanyaan bertahap sebelum desain. | Pengguna ingin ikut menentukan arah dan lingkup. |
| D-004 | Nama, fitur, harga, serta konten fiktif boleh diusulkan dengan label ilustratif dan perlu persetujuan. | Eksplorasi konsep diperbolehkan, tetapi usulan bukan keputusan. |
| D-005 | Jangan mengarang hasil bisnis, testimoni nyata, atau pengujian pengguna. | Studi kasus harus menjelaskan pekerjaan dan bukti yang benar-benar ada. |
| D-006 | Simpan konteks bersama di folder proyek dan arahkan Codex serta Claude Code ke sumber yang sama. | Menjaga kesinambungan keputusan lintas alat. |
| D-007 | Tunggu persetujuan arah dan ruang lingkup sebelum membuat desain atau website. | Batas tahap kerja yang diminta pengguna. |
| D-008 | Pembaca utama portofolio adalah calon klien e-commerce dan founder brand. | Jawaban pengguna nomor 1 pada 17 November 2026. |
| D-009 | Kemampuan yang ingin ditonjolkan: brand storytelling, art direction, dan UX e-commerce. | Jawaban pengguna nomor 2 pada 17 November 2026; urutan prioritas di antara ketiganya belum ditetapkan. |
| D-010 | Pesan yang ingin dibangun: “Sans brothers mampu mengembangkan bisnis product dari calon client melalui website dan landing page”. | Jawaban pengguna nomor 3 pada 17 November 2026. Ini adalah tujuan persepsi portofolio, bukan hasil bisnis yang sudah terbukti pada proyek konsep. |
| D-011 | Pasar produk konsep adalah internasional. | Jawaban pengguna nomor 2 pada tahap konsep, 17 November 2026. Negara belum ditentukan; baseline bahasa Inggris dan USD diterima bersama konsep pada D-014. |
| D-012 | Posisi harga/brand adalah premium yang masih masuk akal. | Jawaban pengguna nomor 3 pada tahap konsep, 17 November 2026; paket nominal kemudian disetujui pada D-015. |
| D-013 | Gunakan Sensiq, Oura, dan Happy Ring pada domain Fiftyseven sebagai bahan analisis serta rekomendasi konsep. | Referensi diberikan pengguna pada 17 November 2026. Rekomendasi kemudian diterima pada D-014 dan D-015. |

## Persetujuan konsep dan handoff

Sumber: pesan pengguna pada 17 November 2026: “1. Setuju”, “2. Jadikan konsep”, dan instruksi menggunakan AI agent lain untuk visual di Figma.

| ID | Keputusan | Alasan / dasar |
| --- | --- | --- |
| D-014 | Terima konsep memahami ritme tubuh sehari-hari, audiens asumsi profesional/pelaku kreatif sekitar 28–45 tahun, karakter tenang/peka/jelas, tiga pilar tidur–aktivitas/istirahat–insight harian, serta arah fotografi natural dan detail material. “Understand your rhythm.” menjadi copy kerja ilustratif; baseline website berbahasa Inggris dengan USD. | Pengguna menyetujui rekomendasi konsep pada pertanyaan nomor 1. Rekomendasi menghubungkan storytelling, art direction, dan keputusan pembelian. Nama brand dan detail teknis belum ditentukan. |
| D-015 | Paket konsep: satu model USD 299; tanpa langganan wajib; Silver, Black, Gold dengan harga sama; charger dan sizing kit termasuk. | Pengguna menjawab “Jadikan konsep” pada pertanyaan nomor 2. Harga dan paket fiktif untuk eksplorasi UX, bukan hasil validasi biaya atau margin. |
| D-016 | Visual selanjutnya dikerjakan pengguna dengan AI agent lain di Figma; siapkan konteks dan hasil telaah kompetitor agar bisa dibaca agent tersebut. | Instruksi langsung pengguna. Ini menetapkan media kerja berikutnya, belum jumlah halaman, frame, atau kedalaman interaksi. |

## Persetujuan nama, fase, dan peran

Sumber: pesan pengguna pada pembahasan lingkup, 17 November 2026.

| ID | Keputusan | Alasan / dasar |
| --- | --- | --- |
| D-017 | Nama brand konsep adalah Stillway. | Pengguna menyatakan setuju Stillway. Ketersediaan domain dan merek belum diperiksa. |
| D-018 | Fase ini hanya berfokus pada Home/landing page. | Pengguna mempersempit lingkup; usulan Product, Cart, dan sizing overlay terpisah tidak diambil untuk fase ini. Desktop/mobile dan prototype belum dipilih. |
| D-019 | Strategy Director membantu strategi konten dan copywriting website. | Pengguna menetapkan tambahan tanggung jawab agent strategi. |
| D-020 | Visual Director mengarahkan visual, storytelling, konsep/style, dan image generation. | Pembagian peran dinyatakan pengguna untuk worktree visual. Konsep brand yang disetujui tetap menjadi dasar; usulan perubahan perlu dicatat. |
| D-021 | Seluruh output website dan mockup website berbahasa Inggris, termasuk navigasi, headline, body copy, CTA, FAQ, label, dan microcopy. Diskusi serta dokumen strategi internal boleh berbahasa Indonesia. | Pengguna menegaskan bahwa website ditujukan untuk pasar internasional dan meminta output web berbahasa Inggris. Memperjelas baseline D-014. |

## Persetujuan peran Developer dan implementasi Home

Sumber: pesan pengguna pada 17 November 2026 yang menjawab pertanyaan bagian 12 di `dev-proposal.md`: “1. Iya, peran developer boleh dicatat di decision.md”, “2. Stack Astro karena nanti copy bakal ada penyesuaian lagi.”, “3. Waktu mulai nunggu dari Visual Director”, dan “4. Hosting cukup lokal dulu, nanti akan saya sambungkan dengan Vercel.”

| ID | Keputusan | Alasan / dasar |
| --- | --- | --- |
| D-022 | Peran Developer adalah mengimplementasikan Home/landing page sebagai kode yang bisa dibuka di browser. Interaksi yang masuk lingkup adalah I-1 sampai I-5 di `dev-proposal.md`: pemilih finish Silver/Black/Gold tanpa add-to-cart, FAQ accordion, CTA anchor ke section produk, navigasi anchor dengan header sticky, dan label concept project. Product, Cart, checkout, pembayaran, akun, backend, form pengumpulan data, dan aplikasi penuh tetap di luar lingkup. | Jawaban “Iya” pada pertanyaan nomor 1, yang menanyakan Home berbentuk kode dengan I-1 sampai I-5 sekaligus pencatatan peran Developer. Melengkapi D-018 (Home saja). I-6 (cuplikan aplikasi bersimulasi) dan I-7 (motion) belum disetujui. Teks, tujuan CTA, dan struktur section tetap mengikuti keputusan Strategy Director/Visual Director yang belum ditetapkan. |
| D-023 | Stack implementasi adalah Astro dengan output statis. | Pengguna memilih Astro karena copy akan disesuaikan lagi; copy dapat dipisah ke file konten. Versi Astro dipilih saat scaffolding. |
| D-024 | Implementasi dimulai setelah handoff dari Visual Director (frame dan token Figma), bukan memakai wireframe netral lebih dulu. | Jawaban pengguna nomor 3. Belum ada file Figma atau token saat keputusan ini dicatat. |
| D-025 | Hosting cukup lokal untuk saat ini. Pengguna sendiri yang nanti akan menghubungkan ke Vercel. | Jawaban pengguna nomor 4. Belum ada publikasi publik; waktu dan pengaturan Vercel (misalnya `noindex`) diputuskan kemudian. |

Persetujuan membuat rincian tersebut menjadi dasar konsep, bukan fakta produk nyata atau bukti riset pengguna. Ringkasan operasional handoff: `figma-handoff.md`. Catatan kompetitor beserta sumber dan keterbatasan: `references.md`.

## Hal yang masih terbuka

1. Bukti desain yang akan mendukung tujuan portofolio; target pembaca dan tiga kemampuan utama sudah ditentukan.
2. Spesifikasi teknis rinci, kompatibilitas, rentang ukuran, serta aturan sizing kit, pengiriman, dan retur. Konsep, audiens asumsi, dan paket utama sudah disetujui.
3. Rumusan tantangan rinci dan cara mengevaluasi kualitas; arahnya adalah pemahaman nilai produk dan kejelasan pemilihan ukuran/finish sebelum membeli.
4. Urutan section, CTA utama dan tujuan CTA Home; alur pembelian lintas halaman berada di luar fase ini.
5. Cakupan visual Figma: halaman/frame, desktop/mobile, tingkat interaktivitas, waktu, dan batas pekerjaan. Mockup/prototype rinci belum disetujui. Home berbentuk kode disetujui untuk dijalankan secara lokal (D-022, D-025); breakpoint mengikuti frame Figma.
8. Implementasi: I-6 (cuplikan aplikasi bersimulasi) dan I-7 (motion); waktu dan pengaturan publikasi di Vercel; apakah demo ditautkan dari studi kasus.
6. Referensi dan kebutuhan aset berikut sumber, hak pakai, serta atribusinya.
7. Narasi studi kasus, peran, bukti proses, dan keterbatasan.

## Antrean pembahasan

- Tahap 1 selesai: target pembaca, tiga kemampuan utama, dan pesan portofolio telah ditentukan. Bukti konkretnya akan mengikuti lingkup.
- Tahap 2: konsep brand, produk, audiens asumsi, dan paket disepakati; nama Stillway dipilih; detail operasional masih terbuka.
- Tahap 3: Home/landing page dipilih; struktur section, CTA, perangkat, dan hasil akhir rinci dibahas berikutnya.
- Tahap 4: referensi, aset, serta struktur studi kasus.
- Tahap 5: tinjau brief lengkap dan catat persetujuan arah serta ruang lingkup.

## Aturan pembaruan

Tambahkan keputusan hanya setelah persetujuan eksplisit. Sertakan tanggal, alasan yang benar-benar diberikan atau disetujui, serta sumber persetujuan. Jika keputusan berubah, tandai keputusan lama sebagai digantikan dan tautkan penggantinya. Sinkronkan ringkasan di `brief.md`.

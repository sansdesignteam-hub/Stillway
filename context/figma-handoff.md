# Handoff untuk AI agent Figma

Diperbarui: 17 November 2026. Dokumen ini merangkum konteks agar agent baru dapat melanjutkan tanpa riwayat chat. Tidak ada file Figma atau visual yang dibuat pada tahap penyusunan brief.

> **Pembaruan 18 November 2026:** Dokumen ini ditulis sebelum build berjalan. Keputusan terbaru ada di `decisions.md`: tidak ada prototype Figma, Versi 1 dibangun langsung di `web/` oleh Developer (D-028, D-036); aset memakai set nature (D-032 sampai D-035); motion GSAP/Lenis diizinkan (D-036); objek 3D dibuka kembali (D-047) dengan 3D Designer (D-046). Jika bagian di bawah bertentangan, ikuti `decisions.md`.

## Urutan membaca

1. `../AGENTS.md` — aturan kerja.
2. `decisions.md` — sumber keputusan dan persetujuan pengguna.
3. `brief.md` — brief proyek dan bagian yang belum final.
4. `references.md` — hasil telaah kompetitor, URL, interpretasi, dan keterbatasan.
5. Dokumen ini — ringkasan praktis untuk melanjutkan.

Jika ringkasan berbeda dengan catatan keputusan, gunakan `decisions.md` dan klarifikasi konflik sebelum melanjutkan.

## Tujuan dan status

Design exploration Smart Ring e-commerce untuk portofolio Sans Brothers. Bukan klien atau produk nyata. Target pembaca portofolio: calon klien e-commerce dan founder brand. Kemampuan yang harus terlihat: brand storytelling, art direction, dan UX e-commerce.

Pesan yang ingin dibangun: Sans Brothers mampu membantu mengembangkan bisnis produk melalui website dan landing page. Ini tujuan persepsi portofolio, bukan hasil bisnis yang sudah dibuktikan.

Brand yang disetujui adalah **Stillway**. Fokus fase ini **Home/landing page saja** (D-017, D-018). Usulan Product, Cart, sizing overlay terpisah, dan prototype belanja lintas halaman tidak masuk fase ini.

**Pembagian peran:** Strategy Director menangani strategi pesan, struktur konten, dan copywriting website. Visual Director menangani arahan visual, storytelling visual, konsep/style, dan image generation. Storytelling visual menerjemahkan pesan ke urutan adegan, fokus gambar, dan ritme halaman; perubahan pesan atau klaim produk perlu dikoordinasikan melalui catatan keputusan.

Home dikembangkan dalam dua versi visual (D-026). Versi 1 memakai Arah A “One Day, in Light” dari `visual-directions.md`; Versi 2 memakai arah dari teman pengguna. Jangan mencampur sistem visual kedua versi. Media visual berikutnya tetap Figma. Perangkat, jumlah frame, tingkat prototype, jadwal, dan kriteria selesai masih terbuka. Baca `home-copy.md` untuk usulan struktur section; copy belum final. Jangan menetapkan draft sebagai keputusan tanpa persetujuan pengguna.

## Dasar konsep yang disetujui — tetap ilustratif

| Aspek | Dasar yang harus dipertahankan |
| --- | --- |
| Konsep | Memahami ritme tubuh sehari-hari melalui tidur, aktivitas, dan istirahat. |
| Positioning | Premium yang masih masuk akal, pasar internasional. |
| Audiens asumsi | Profesional/pelaku kreatif sekitar 28–45 tahun, rutinitas padat, tertarik wellness, menghargai desain dan kesederhanaan. Bukan persona berbasis riset. |
| Karakter brand | Tenang, peka, dan jelas. |
| Copy kerja | “Understand your rhythm.” Ilustratif; belum diperiksa ketersediaannya. |
| Pilar fitur | Ringkasan pola tidur; keseimbangan aktivitas–istirahat; insight harian sederhana melalui aplikasi pendamping. |
| Produk | Satu model, USD 299. |
| Finish | Silver, Black, Gold; harga sama untuk ketiganya. |
| Paket | Charger dan sizing kit termasuk; tanpa langganan wajib. |
| Baseline konten | Bahasa Inggris, USD. Tidak berarti semua negara, bahasa, atau mata uang masuk cakupan. |
| Arah visual | Fotografi keseharian bercahaya alami, detail material ring, visualisasi data secukupnya. |

Font, palet, bentuk ring rinci, dimensi, bahan teknis, ketahanan air, masa baterai, akurasi, rentang ukuran, kompatibilitas, serta kebijakan pengiriman/retur belum ditentukan. Gunakan label placeholder atau ajukan usulan untuk persetujuan; jangan menjadikannya fakta secara diam-diam. Harga merupakan keputusan kreatif, bukan validasi biaya produksi atau margin.

## Cara memakai referensi

- Sensiq — https://sensiq.co/: pelajari urutan sinyal → pola → insight dan penjelasan nilai tanpa langganan. Shop now menuju waitlist saat ditelaah, sehingga bukan bukti alur transaksi lengkap.
- Oura — https://ouraring.com/: pelajari kaitan pesan lifestyle, kategori manfaat, penjelasan aplikasi, dan pemilihan produk/finish. Halaman produk yang dibaca: https://ouraring.com/store/rings/oura-ring-5.
- Happy Ring — https://happyring.fiftyseven.co/: pelajari struktur penjelasan teknologi. Halaman ini berfokus pada clinical care/trials dan Request a Demo, berbeda dari e-commerce konsumen.

Telaah konten web dilakukan pada 17 November 2026. Tampilan aktual desktop dan hero mobile kemudian ditinjau Visual Director pada tanggal yang sama; lihat bagian “Telaah visual tampilan aktual” di `references.md`. Checkout dan interaksi hover belum diverifikasi. Jangan menyebut art direction usulan sebagai hasil audit visual kompetitor. Situs dan harga dapat berubah.

Gunakan referensi untuk prinsip, bukan menyalin identitas, layout, copy, atau aset. Klaim, testimoni, angka statistik, dan sertifikasi kompetitor tidak berlaku bagi produk konsep ini.

## Tantangan dan pekerjaan berikutnya

Arahan masalah yang perlu dijabarkan dalam scope: menjelaskan kegunaan produk dan alasan harga premium, lalu membantu pembeli memilih ukuran serta finish dengan jelas.

1. Home/landing page telah dipilih. Sepakati perangkat, frame, dan tingkat interaksi sebelum produksi.
2. Gunakan nama Stillway. Tetapkan detail produk yang benar-benar dibutuhkan scope; semua usulan baru tetap ilustratif sampai disetujui.
3. Terjemahkan struktur pesan Home dari Strategy Director ke storytelling visual. Struktur section dan CTA perlu disepakati; jangan memperluas ke halaman belanja lain.
4. Susun daftar aset sesuai scope sebelum produksi: render ring tiap finish dengan geometri konsisten, foto pemakaian untuk skala, detail material, charger/sizing kit, foto keseharian, dan cuplikan aplikasi berdata simulasi bila diperlukan.
5. Catat sumber, izin, atribusi, dan apakah aset dibuat sendiri, berlisensi, atau dihasilkan AI. Aset-aset tersebut belum tersedia di folder ini.
6. Simpan keputusan, alasan, alternatif, dan bukti proses untuk studi kasus; perbarui `decisions.md` serta `brief.md` ketika pengguna menyetujui perubahan.

## Kejujuran dalam hasil dan studi kasus

- Cantumkan status design exploration/concept project dengan jelas.
- Labeli data aplikasi sebagai simulasi; jangan tampilkan sebagai rekaman kesehatan seseorang.
- Jangan mengarang testimoni, pelanggan, penghargaan, hasil konversi, riset pengguna, atau pengujian partisipan.
- Jangan menambahkan klaim klinis, diagnosis, akurasi, sertifikasi, atau jaminan keamanan yang tidak ada dasarnya.
- Evaluasi internal, walkthrough, pemeriksaan aksesibilitas, dan review visual harus dilaporkan sesuai metode aktualnya. Semuanya tidak otomatis membuktikan efektivitas bisnis atau validasi pengguna.
- Struktur studi kasus awal ada di `brief.md` bagian 7 dan masih menunggu peninjauan pengguna.

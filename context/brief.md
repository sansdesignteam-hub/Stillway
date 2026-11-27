# Brief konsep Smart Ring e-commerce

Status: konsep, paket, nama Stillway, dan fokus fase Home/landing page disetujui; struktur section, CTA, dan perangkat masih terbuka. Implementasi Home berbentuk kode (Astro, lokal) disetujui dan sudah berjalan di `web/` (D-022 sampai D-025, D-036 sampai D-045). Baca `figma-handoff.md` untuk melanjutkan dengan AI agent lain.
Sumber keputusan: `decisions.md`.

**Versi 2 (status 23 November 2026):** kesebelas section V2 terbangun di `web-v2/` dan live di https://stillway-two.vercel.app/ (D-094, D-101). Revisi v3 (Storyboard/QA/Moodboard 23 Nov) sempat dikerjakan sebagai Fase 1, lalu **di-rollback** karena tidak sesuai ekspektasi (D-131): dokumen kembali ke Storyboard v2 REV 3 dan Moodboard v2 (19 Nov), dan kode kembali ke production `81318d9`. Dokumen v3 diarsipkan di `context/Visual Directions V2/arsip/v3-23nov/`. Staging = Preview branch `Developer`: https://stillway-two-git-developer-sans-brothers.vercel.app (D-130). **Foundation** (palet, 🎨 Token Color, text style Geist) dari halaman Foundation Figma diadopsi lagi tanpa bagian v3 lainnya (D-134); salinannya di `Moodboard.md` §2–3 (v2.1), dan cara penerapannya di kode ditetapkan D-135 (brief `design/v2/BRIEF-dev-foundation.md`). Sambungan S02 → S03 diubah menjadi scroll biasa dengan ring sticky, cahaya pojok, dan sensor hijau (D-136, brief `design/v2/BRIEF-dev-s02-s03-scroll.md`). Ring S03 dibuat hangat dan teks kecil S02 mobile lewat di belakang ring (D-137). Sambungan S03 → S04 (Lensa) dan S04 Day arc dirombak dari Figma Design (D-138, brief `design/v2/BRIEF-dev-s03-s04-dayarc.md`). Cahaya hangat cocoa dari S03 dipakai juga untuk section gelap lain (D-139). Sambungan S04 → S05 dan kartu kaca S05 dirombak (D-142, brief `design/v2/BRIEF-dev-s04-s05-insight.md`). S05 tanpa reflow teks dan kartu beranimasi (D-143). S06 dirombak: ring menggelinding tegak di meja kayu 3D, jatuh, lalu masuk ke jari (D-144). Tanpa jejak gerak (D-145), meja kayu 3D disetujui (D-146), dan sambungan 06 → 07 tanpa efek kartu (D-147). Latar S02 polos (D-148). S07 dirombak dari Figma dengan akhir "The everyday" bergaya obsidianassembly.com (D-149). Foto "The everyday" diganti ke flat-lay batu (D-150), kartu di belakang teks (D-151), foto dibuat ulang Visual Director dengan ring Stillway asli (D-152), exposure diturunkan (D-153). S08 mengikuti Figma termasuk lampu merah (D-154).

**QA V2, 25 November 2026.** Revisi minor dan sinkronisasi warna menunggu review di staging (D-167, D-168). Putaran mayor awal mencakup G-09, G-10, SL-02, dan HE-02 dengan urutan tersebut. Kartu yang diredupkan dikecualikan (D-169). F-02 dikerjakan bersama G-09 dan PM meninjau hasil sebelum memperbarui status Figma (D-170).

**Review staging V2.** Pengguna meminta enam penyesuaian di HE-02 dan S02, S07, S09, S10, S11 (D-171).

**Review staging 26 November 2026.** Revisi lanjutan mencakup ukuran metrik 2× S03, aset foto S04, motion dan urutan kartu S07, serta transisi mobile S09→S10 (D-172).

**S06, 26 November 2026.** Transisi jatuh menjadi dua adegan: kamera mengikuti ring berputar, lalu tangan naik dan ring masuk ke jari. Copy muncul setelah ring terpasang (D-173). Jatuhnya diperlambat dan putaran menuju jari diperhalus (D-174).

**S07.** Empat foto kartu dan latar penutup diperbarui dari Figma. Heading penutup menjadi satu baris dengan caption terpusat (D-175).

**Navigasi progres.** Titik indikator global kini ditetapkan sebagai tautan ke section masing-masing (D-176).

**Hero S01.** Foto meja hangat dari Figma menjadi latar hero, dengan bayangan dan refleksi ring disesuaikan (D-177).

**Hero S01.** Refleksi awal dan bayangan disesuaikan dengan meja hangat dan referensi pengguna (D-177, D-178).

## Konteks yang disepakati

Design exploration untuk portofolio Sans Brothers. Bukan proyek klien atau produk nyata. Arah dan ruang lingkup harus disetujui sebelum desain atau implementasi dimulai.

## 1. Tujuan portofolio dan kemampuan

Disetujui melalui jawaban pengguna pada 17 November 2026:

- Pembaca utama: calon klien e-commerce dan founder brand.
- Kemampuan yang ditonjolkan: brand storytelling, art direction, dan UX e-commerce.
- Pesan yang ingin dibangun, dalam kata-kata pengguna: “Sans brothers mampu mengembangkan bisnis product dari calon client melalui website dan landing page”.

Tujuan tersebut adalah persepsi yang ingin dibangun melalui portofolio, bukan klaim hasil bisnis proyek ini.

Usulan penerjemahan ke bukti desain, belum disetujui: narasi nilai produk yang mudah dipahami, art direction yang membedakan brand, dan alur yang membantu calon pembeli memahami produk, memilih varian/ukuran, serta melanjutkan pembelian. Bentuk dan cakupan bukti menunggu persetujuan lingkup.

## 2. Brand, produk, dan audiens

Disetujui pada 17 November 2026 (D-011, D-012, D-014, D-015):

- Konsep: smart ring untuk memahami ritme tubuh sehari-hari melalui tidur, aktivitas, dan istirahat.
- Pasar internasional; posisi premium yang masih masuk akal; baseline konten bahasa Inggris dan USD. Negara penjualan spesifik belum ditetapkan.
- Ketentuan bahasa (D-021): seluruh teks yang tampil pada website dan mockup wajib berbahasa Inggris, termasuk navigasi, CTA, FAQ, label, dan microcopy. Dokumen strategi internal serta diskusi boleh berbahasa Indonesia.
- Audiens asumsi: profesional dan pelaku kreatif sekitar 28–45 tahun dengan rutinitas padat, tertarik pada wellness, serta menghargai desain dan kesederhanaan.
- Karakter brand: tenang, peka, dan jelas. Copy kerja ilustratif: “Understand your rhythm.” Nama brand: Stillway (D-017); ketersediaan nama/copy belum diperiksa.
- Pilar fitur konseptual: ringkasan pola tidur, keseimbangan aktivitas–istirahat, serta insight harian sederhana melalui aplikasi pendamping. Aplikasi penuh tidak otomatis masuk deliverable.
- Art direction: fotografi keseharian dengan cahaya alami, detail material ring, dan visualisasi data secukupnya. Font Geist dan motion GSAP/Lenis dipakai pada build Versi 1 (D-036, D-037); palet dan layout final mengikuti tinjauan pengguna.
- Paket ilustratif: satu model USD 299, tanpa langganan wajib; Silver, Black, Gold dengan harga sama; charger dan sizing kit termasuk.

Semua rincian produk tetap fiktif meski disetujui sebagai dasar konsep. Audiens merupakan asumsi, bukan hasil riset pengguna. Harga belum divalidasi terhadap biaya produksi atau kelayakan bisnis. Tidak ada klaim manfaat klinis atau akurasi yang disetujui.

Alternatif awal performa olahraga dan teknologi sebagai aksesori tidak dipilih sebagai fokus utama. Dasar rekomendasi dan batas telaah kompetitor ada di `references.md`.

## 3. Tantangan desain

Usulan, belum disetujui: menjelaskan nilai produk sebelum detail teknis; menghubungkan storytelling dengan alasan harga premium; membantu pembeli memahami ukuran, finish, isi paket, kompatibilitas, dan total biaya; serta menjaga kesinambungan dari eksplorasi menuju simulasi pembelian. Lihat `references.md`.

## 4. Struktur halaman dan alur pengguna

Fase ini hanya Home/landing page (D-018). Struktur section dan CTA belum disetujui. Usulan struktur konten untuk pembahasan ada di `home-copy.md`. Product, Cart, dan sizing overlay terpisah tidak masuk fase ini.

## 5. Ruang lingkup hasil akhir

Strategy Director menangani strategi pesan, struktur konten, dan copywriting website (D-019). Visual Director mengarahkan visual, storytelling visual, konsep/style, dan image generation (D-020), dengan media visual Figma sesuai D-016. Fokus fase ini Home/landing page saja. Perangkat, jumlah frame, prototype, jadwal, dan kriteria selesai masih perlu ditentukan. Developer mengimplementasikan Home sebagai kode dengan Astro, berjalan lokal, dengan interaksi I-1 sampai I-5 dari `dev-proposal.md`. Pekerjaan dimulai setelah handoff frame dan token dari Visual Director; Vercel akan dihubungkan pengguna nanti (D-022 sampai D-025). Transaksi, backend, halaman lain, dan aplikasi penuh tidak masuk lingkup yang disetujui. Lihat `figma-handoff.md`.

## 6. Referensi dan aset

Daftar persiapan di bawah adalah usulan awal, belum disetujui dan belum dikumpulkan:

- Referensi brand dan art direction, dengan catatan aspek yang dipelajari.
- Referensi e-commerce: penjelasan produk, pemilihan varian, ukuran ring, serta pembelian; pilih sesuai alur final.
- Visual produk: bentuk ring, material/warna, sudut kamera, detail, dan skala saat dipakai.
- Visual pendukung: fotografi lifestyle, ilustrasi fitur, atau tampilan aplikasi hanya jika dibutuhkan konsep.
- Identitas dan UI: logo, tipografi, ikon, palet, serta copy ilustratif.
- Untuk setiap aset: sumber, status dibuat/dilisensikan/dihasilkan AI, izin penggunaan, atribusi, dan kegunaan. Jangan menganggap aset dari situs referensi boleh dipakai ulang.

Referensi dari pengguna telah dibaca melalui konten web, lalu tampilan aktualnya ditinjau pada 17 November 2026 (desktop dan hero mobile; checkout tidak diperiksa). Catatan sumber, temuan visual, dan batas tinjauan ada di `references.md`. Arah visual: Home dikembangkan dalam dua versi. Versi 1 memakai Arah A “One Day, in Light” (`visual-directions.md`); Versi 2 memakai arah dari teman pengguna; versi final dipilih kemudian (D-026, D-027). Visual Director saat ini hanya mengerjakan Versi 1 untuk desktop 1440 dan mobile 390, dalam 4–6 frame, dengan satu gambar bayangan ring (D-048, D-049, D-050, D-031). Aset Versi 1 memakai set nature “moss rock studio” (D-032 sampai D-035). Build dikerjakan langsung oleh Developer tanpa prototype Figma (D-028); motion GSAP, Lenis, dan layout menyimpang dari wireframe diizinkan (D-036); revisi layout mengikuti referensi pengguna (D-037 sampai D-045). Objek 3D kembali diizinkan di web (D-047); hero memakai ring 3D Three.js yang mengikuti mouse dan berputar saat scroll, dengan foto cutout sebagai cadangan (D-051); section CTA penutup juga memakai ring 3D (D-052); serah terima teknis untuk Developer ada di `design/3d/HANDOFF-hero-ring.md`. Website kini punya dua versi (D-059): V1 di `web/` dibekukan, V2 dibangun di `web-v2/` dari `context/Visual Directions V2/`, di-deploy sebagai project Vercel kedua. Visual Director memberi handoff visual V2, Developer membangun, Strategy Director menangani copy, 3D Designer menangani 3D; Claude Code di main mengoordinasikan (D-060, menggantikan D-048) sebagai Project Manager, dan memilih model AI ringan atau berat sesuai bobot tiap tugas (D-184). Keputusan V2 berikutnya (D-061 sampai D-070): logo teks “Stillway” di-engrave di ring, LED satu jendela, satu canvas WebGL, aset studio Paper/Sand, copy dari `home-copy-v2.md`, spesifikasi konsep tanpa label ilustratif, tanpa cart/newsletter, project Vercel `stillway-v2`.

## 7. Struktur studi kasus

Usulan awal, belum disetujui:

1. Pembuka: design exploration mandiri untuk Sans Brothers, peran, lingkup, dan periode aktual.
2. Tujuan: kemampuan yang ingin diperlihatkan dan alasan memilih kategori smart ring.
3. Brief: konsep produk, audiens asumsi, tantangan, serta batas eksplorasi.
4. Referensi dan eksplorasi: sumber, alternatif, serta alasan memilih atau menolak arah.
5. Keputusan desain: kaitkan arsitektur informasi, alur pembelian, visual, dan interaksi dengan brief.
6. Hasil akhir: tampilkan artefak yang benar-benar dibuat dan jelaskan kedalaman fungsinya.
7. Evaluasi: hanya pemeriksaan atau pengujian yang benar-benar dilakukan, lengkap dengan metode serta batasannya.
8. Refleksi: hal yang berhasil menurut kriteria brief, kompromi, dan langkah validasi berikutnya.

Jangan mengganti hasil bisnis dengan angka fiktif. Jika belum ada pengujian pengguna, nyatakan hal tersebut; evaluasi internal tidak boleh disebut validasi pengguna.

## Gerbang persetujuan

- [x] Tujuan portofolio dan tiga kemampuan utama disetujui (17 November 2026).
- [x] Arah konsep, karakter brand, audiens asumsi, dan paket produk disetujui (17 November 2026).
- [x] Nama brand Stillway ditetapkan.
- [ ] Rumusan tantangan rinci ditetapkan.
- [ ] Halaman, alur, dan hasil akhir beserta batasnya disetujui.
- [ ] Kebutuhan referensi, aset, dan narasi studi kasus ditinjau.
- [ ] Pengguna menyetujui brief serta memberi arahan untuk masuk tahap desain.

Tujuan portofolio, arah konsep, dan paket produk telah disepakati. Pengguna akan melanjutkan visual melalui agent Figma lain; fokus fase ini Home/landing page; lingkup produksi rinci masih terbuka. Build Home Versi 1 (Astro, lokal) sudah dimulai di `web/` sesuai D-036; copy dan token tambahan di dalamnya masih draf. Peran 3D Designer ditetapkan (D-046), dan objek 3D kembali diizinkan di web (D-047, menggantikan poin 3 D-037); hero memakai ring 3D Three.js (D-051); rincian 3D lainnya masih dibahas pengguna bersama 3D Designer.

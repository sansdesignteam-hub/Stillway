# Stillway — struktur pesan Home

Status: USULAN STRUKTUR KONTEN, belum disetujui (penyesuaian Versi 1 ada di bagian khusus). Semua copy baru adalah draf ilustratif, bukan fakta produk nyata. Nama dan paket utama telah disetujui; sumber keputusan ada di `decisions.md`.

## Peran halaman

Usulan: memperkenalkan Stillway kepada pengunjung yang baru mengenal produk, menjelaskan kegunaannya, lalu mengarahkan ke ringkasan produk/paket dalam halaman yang sama. Sumber traffic belum ditentukan.

CTA utama usulan: **Explore Stillway**, menuju bagian produk/paket di Home. Ini menjaga alur sesuai lingkup satu halaman. CTA pembelian ke halaman Product memerlukan keputusan tujuan dan lingkup lanjutan.

## Urutan pesan yang diusulkan

| Bagian | Pertanyaan pembaca | Pesan yang perlu disampaikan |
| --- | --- | --- |
| Hero | Apa ini dan mengapa relevan? | Stillway adalah smart ring untuk memahami pola tidur, aktivitas, dan istirahat. |
| Konteks keseharian | Mengapa saya ingin memahami pola itu? | Kaitkan informasi dengan rutinitas sehari-hari dan perhatian pada tubuh. Hindari menjanjikan perubahan kesehatan. |
| Tiga pilar | Apa yang bisa saya lihat? | Ringkasan tidur, keseimbangan aktivitas–istirahat, insight harian. |
| Pengalaman ring + aplikasi | Bagaimana informasi ditampilkan? | Jelaskan peran ring dan aplikasi pendamping secara sederhana; contoh data diberi label simulasi. |
| Produk dan paket | Apa pilihan dan biayanya? | USD 299; tiga finish dengan harga sama; charger dan sizing kit termasuk; tanpa langganan wajib. |
| FAQ | Apa yang perlu saya pahami sebelum lanjut? | Biaya berulang, isi paket, pilihan finish. Detail teknis/operasional yang belum diputuskan tetap menjadi kebutuhan konten internal. |
| Penutup | Langkah selanjutnya apa? | Ulangi CTA utama yang disepakati. Sertakan status concept project pada konteks portofolio/demo. |

Ini adalah arsitektur pesan, bukan perintah layout atau jumlah section visual. Visual Director dapat mengusulkan penggabungan adegan atau section sepanjang cakupan pesan dipertahankan dan perubahan dikoordinasikan.

## Draf hero untuk dibahas

- Eyebrow: **Meet Stillway**
- Headline: **Understand your rhythm.** (copy kerja yang telah diterima dalam konsep)
- Supporting copy: **A smart ring that brings your sleep, activity, and rest into one everyday view.**
- CTA usulan: **Explore Stillway**
- Informasi paket: **$299 · Charger and sizing kit included · No required subscription**

Supporting copy dan CTA belum disetujui. Headline emosional diimbangi penjelasan langsung tentang kategori dan fungsi produk. Copy section lengkap akan dikembangkan setelah tujuan CTA disepakati.

## Penyesuaian untuk Versi 1 (Arah A, D-026)

Status: USULAN, belum disetujui. Sumber: `visual-directions.md` (worktree Visual Director). Urutan pesan di atas tetap menjadi acuan; hanya urutan visualnya mengikuti waktu dalam sehari. Versi 2 belum memiliki arah, sehingga bagian ini tidak berlaku untuknya.

### Pemetaan bab waktu ke pesan

| Waktu | Bab | Pesan |
| --- | --- | --- |
| 06:40 | Hero | Headline, supporting copy, baris paket, CTA. |
| 08:00–13:00 | Konteks keseharian | Mengapa memahami pola itu relevan bagi rutinitas. |
| Pagi / siang / sore | Tiga pilar | Tidur sebagai ringkasan pagi, aktivitas–istirahat pada siang, insight harian pada sore. |
| 18:30 | Ring + aplikasi | Peran ring dan aplikasi; contoh data berlabel simulasi. |
| 19:30 | Produk dan paket | USD 299, tiga finish, isi paket, tanpa langganan wajib. |
| 21:00 | FAQ | Biaya berulang, isi paket, pilihan finish. |
| 23:00 | Penutup | CTA utama dan catatan concept project. |

Syarat pemetaan pilar: tidur → pagi, aktivitas–istirahat → siang, insight → sore tidak boleh mengubah pesan. Copy tidur berupa ringkasan, bukan diagnosis; copy insight tidak menjanjikan hasil. Tiga pilar harus tetap terbaca sebagai tiga hal yang berdiri sendiri.

### Microcopy usulan (bahasa Inggris, ilustratif)

- Penanda waktu: `06:40 · Morning`, `12:30 · Midday`, `16:30 · Afternoon`, `18:30 · Evening`, `19:30 · Evening`, `21:00 · Night`, `23:00 · Night`. Jam dan label hanyalah titik awal; jam pilar mengikuti adegan Visual Director.
- Label UI aplikasi: `Simulated data`. Wajib pada setiap potongan UI aplikasi; berlaku lebih tinggi daripada aturan anti-slop tanpa caption.
- Toggle cahaya di bab produk: `Daylight` / `Lamp light`. Toggle finish: `Silver` / `Black` / `Gold`.
- Pilar: `Sleep` · `Activity & rest` · `Daily insight`. Judul pilar dan copy isi menyusul setelah struktur disetujui.

### Catatan concept project (bentuk belum disepakati)

- Opsi usulan: keterangan kecil permanen di footer, `Stillway is a concept project — a design exploration, not a real product.`, ditambah satu baris serupa dekat CTA di bab 23:00. Hero tidak diberi banner.
- Alasan: D-002 mewajibkan proyek dinyatakan sebagai design exploration. Catatan harus jujur namun ringan agar tidak mengganggu pengalaman.

### Catatan koordinasi

- Aturan anti-slop Visual Director menghindari caption penjelas pada gambar. Copy konteks dan pilar diletakkan pada blok teks di samping atau di bawah foto, bukan di atas foto.
- Perubahan microcopy yang memengaruhi frame dikoordinasikan ke Visual Director melalui pengguna; jangan mengubah copy secara sepihak di Figma.

## Batas copy

- Suara: tenang, jelas, peka; bahasa Inggris untuk website, penjelasan strategi dapat berbahasa Indonesia.
- Gunakan fitur dan paket yang telah disetujui sebagai dasar. Jangan menambahkan spesifikasi, akurasi, janji kesehatan, sertifikasi, kebijakan, atau hasil bisnis.
- Tidak ada testimoni atau statistik pengguna yang tersedia. Cerita dan demonstrasi produk memakai konteks ilustratif.
- Konfirmasi teknis yang masih terbuka: bentuk data aplikasi, kompatibilitas, mekanisme sizing kit, spesifikasi, pengiriman, dan retur. Jangan memasukkan placeholder internal sebagai copy publik final.
- Review copy: kejelasan kategori/nilai, konsistensi penawaran, satu CTA utama, tujuan link sesuai scope, dan semua klaim dapat ditelusuri ke keputusan konsep.

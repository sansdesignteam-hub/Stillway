# Stillway — usulan arah visual Home

Status: **Arah A disetujui sebagai dasar Versi 1 Home (D-026).** Arah B dan C tidak dipakai, kecuali satu gambar bayangan ring dari B (D-030). Spesifikasi kerja Versi 1 ada di bagian “Versi 1 — spesifikasi kerja”. Versi 2 memakai arah dari teman pengguna, dan versi final dipilih kemudian (D-027). Rincian di bawah, seperti warna, font, komposisi, dan daftar aset, masih berupa usulan kerja. Disusun pada 17 November 2026 setelah meninjau tampilan aktual referensi (lihat “Telaah visual tampilan aktual” di `references.md`). Seluruh nilai warna, font, dan komposisi masih berupa titik awal. Teks berbahasa Inggris di bawah merupakan contoh microcopy, bukan copy final; copy tetap menjadi wewenang Strategy Director.

Dasar yang dipegang: konsep ritme tubuh harian (tidur, aktivitas, istirahat), karakter tenang–peka–jelas, fotografi bercahaya alami, detail material, visualisasi data secukupnya, serta paket USD 299 dengan tiga finish dan tanpa langganan wajib.

Batas: data aplikasi selalu berlabel simulasi. Tidak ada klaim akurasi, kesehatan, sertifikasi, testimoni, atau statistik.

---

## Arah A — “One Day, in Light” (Satu hari dalam cahaya)

**Ide utama.** Halaman Home dibaca sebagai satu hari: scroll menggerakkan waktu dari pagi hingga malam. Cahaya, suhu warna latar, dan penanda waktu menuntun cerita, sementara ring hadir pada setiap momen. Ritme tidak hanya dikatakan, tetapi dialami pembaca melalui struktur halaman.

**Alasan cocok untuk portofolio.** Arah ini menunjukkan tiga kemampuan sekaligus: storytelling yang membentuk arsitektur halaman, art direction lewat sistem cahaya yang konsisten, dan UX e-commerce saat finish ditampilkan dalam dua kondisi cahaya untuk membantu pemilihan. Tidak ada referensi yang memakai struktur waktu.

**Storytelling, dari hero hingga penutup**

| Waktu | Adegan | Isi pesan (mengikuti `home-copy.md`) |
| --- | --- | --- |
| 06:40 | Hero: cahaya pagi rendah dari jendela, tangan dengan ring di atas linen dan cangkir. | Headline, supporting copy, dan baris paket. |
| 08:00–13:00 | Dua atau tiga momen tanpa wajah: meja kerja, berjalan, jeda. | Konteks keseharian. |
| Pagi, siang, sore | Tiga pilar dipetakan ke waktu: tidur sebagai ringkasan pagi (“last night”), keseimbangan aktivitas–istirahat pada siang, insight harian pada sore. Tiap pilar terdiri atas satu foto dan satu potongan UI simulasi. | Tiga pilar. |
| 18:30 | Ring + aplikasi: makro sisi luar/dalam ring, ponsel di tangan dengan satu kalimat insight. | Pengalaman ring + aplikasi. |
| 19:30 | Produk di bawah cahaya lampu hangat: tiga finish dari sudut yang sama, isi paket di atas permukaan meja. | Produk dan paket. |
| 21:00 | FAQ tipografis di atas latar yang lebih gelap. | FAQ. |
| 23:00 | Ring di samping charger pada nakas, latar biru-tinta. | CTA penutup dan catatan concept project. |

**Tipografi.** Display serif berkontras rendah dan tidak condensed (kandidat: Newsreader Display Light) untuk menghindari serif condensed Oura dan grotesk rapat Sensiq/Happy. Body memakai sans humanis (kandidat: Inter atau Geist). Angka waktu memakai monospace kecil (kandidat: IBM Plex Mono) karena berfungsi sebagai penanda posisi, bukan dekorasi.

**Warna.** Empat keadaan latar yang berpindah perlahan, dengan teks grafit `#1F1E1C` pada keadaan terang:

- Dawn `#F2EDE4`
- Day `#F6F5F1`
- Dusk `#E8DBC8`
- Night `#151820` dengan teks `#ECE8E1`

Tidak ada warna aksen UI selain warna material ketiga finish. Kontras setiap keadaan wajib memenuhi WCAG AA.

**Komposisi.** Foto horizontal lebar (16:9 hingga 21:9) pada pagi, lalu bingkai semakin dekat menjelang malam. Pada desktop, rail waktu vertikal berada di kiri; pada mobile, rail berubah menjadi chip waktu sticky kecil di atas. Teks diletakkan di area bayangan foto agar terbaca tanpa overlay gelap.

**Treatment produk.** Ring selalu tampil dalam cahaya kontekstual, tanpa latar putih studio. Di section produk, setiap finish dapat dilihat dalam “Daylight” dan “Lamp light” karena Gold, Silver, dan Black berubah karakter di bawah cahaya berbeda. Ini interaksi fungsional untuk keputusan finish.

**Motion.** ~~Warna latar berinterpolasi mengikuti scroll dan garis hari terisi sebagai progres halaman.~~ Direvisi setelah pemeriksaan anti-slop: setiap bab waktu memakai latar datar sendiri tanpa animasi, dan gerak dibatasi pada satu momen signature. Lihat “Konsep motion (GSAP)” di bawah.

**Fotografi/render dan aset (± 12)**

- 1 hero pagi.
- 2–3 momen siang.
- 3 plate pilar.
- 2 makro ring (luar dan dalam).
- 3 finish × 2 cahaya untuk section produk.
- 1 flatlay paket (ring, charger, sizing kit).
- 1 plate malam.
- 3 potongan UI simulasi, dibuat di Figma (bukan AI).

Ruang gunakan satu interior yang sama. Fokus pada tangan dan objek, bukan wajah.

**Hubungan dengan referensi.** Dari Oura: kesinambungan foto tangan bercahaya hangat menuju produk. Dari Sensiq: setiap pernyataan disertai satu potongan data kecil. Dari Happy Ring: satu mekanisme scroll signature yang konsisten. Pembeda Stillway: waktu sebagai struktur, cahaya sebagai bahasa, tanpa aksen neon, tanpa testimoni.

**Risiko/kompromi.**

- Produksi foto paling berat. Konsistensi tangan, ruang, dan geometri ring pada gambar AI sulit, sehingga perlu ring master dan retouch.
- Perpindahan warna menambah kerja desain dan development serta pemeriksaan kontras.
- Section malam berisiko terasa berat.
- Ada risiko jatuh ke klise iklan “day in the life”. Mitigasinya: batasi empat keadaan cahaya, pertahankan bingkai tenang, dan hindari model berpose.

---

## Arah B — “Shadow Clock” (Bayangan sebagai jam)

**Ide utama.** Ring diperlakukan sebagai objek kriya. Bayangannya di bawah sinar matahari bergeser seperti jam matahari, sehingga ritme divisualkan melalui satu objek dan bayangannya. Halaman disusun seperti katalog objek/galeri: plate bernomor, caption kecil, dan ruang kosong yang lapang.

**Alasan cocok untuk portofolio.** Arah ini menonjolkan art direction dan menghasilkan metafora visual yang paling mudah dikenali dan dimiliki brand. Produksi realistis karena still life lebih mudah dikontrol daripada foto manusia.

**Storytelling.**

1. **Hero:** ring berdiri di atas batu kapur, bayangan panjang melengkung, headline di ruang kosong.
2. **Konteks + tiga pilar:** triptych ring yang sama dengan bayangan pagi, siang, dan sore. Satu sistem gambar mewakili tidur, aktivitas–istirahat, dan insight.
3. **Ring + aplikasi:** ilustrasi garis potongan ring dan ponsel dengan alur sederhana, tanpa daftar sensor.
4. **Material:** makro tepi dan finish, ditambah satu foto in-hand untuk skala.
5. **Produk:** tiga finish sebagai plate bernomor (“No. 01 Silver”) dengan label ala kartu museum dan flatlay paket di atas kertas.
6. **FAQ:** disusun sebagai catatan indeks.
7. **Penutup:** bayangan terpanjang saat senja, lalu CTA.

**Tipografi.** Serif teks klasik untuk headline (kandidat: Source Serif 4 Display) dan caption sans small caps dengan tracking lebar (kandidat: Geist).

**Warna.** Plaster `#ECE7DF`, batu `#CFC6B8`, dan grafit `#2A2826`. Satu warna dingin abu-biru dipakai hanya untuk bayangan dan garis data.

**Komposisi.** Grid editorial asimetris, plate persegi/portrait, caption mengikuti baseline, dan ruang kosong 40–60% layar.

**Treatment produk.** Produk menjadi pusat dengan sudut studio konsisten dan fidelitas material tertinggi.

**Motion.** Minimal: bayangan hero berotasi mengikuti scroll (3–5 frame) dan plate muncul perlahan.

**Aset (± 14).** Render master 3 finish × 3–4 sudut, seri bayangan 3–5 frame, makro, 1 foto in-hand, flatlay paket, ilustrasi garis vektor (Figma), dan 1–2 potongan UI simulasi.

**Hubungan dengan referensi.** Sensiq memakai properti batu/kayu dan fokus objek; Happy Ring menjadikan objek sebagai panggung. Stillway membedakan diri melalui cahaya matahari alami, metafora jam bayangan, dan presentasi katalog.

**Risiko/kompromi.**

- Cenderung terasa seperti perhiasan atau barang mewah, lebih mahal daripada “premium yang masih masuk akal”.
- Manfaat “memahami tubuh” kurang terasa.
- Minim kehadiran manusia sehingga keterhubungan dengan audiens melemah.
- Bayangan yang konsisten secara fisik sulit dicapai dengan AI; render 3D lebih aman.

---

## Arah C — “Rhythm Dial” (Lingkar ritme)

**Ide utama.** Satu bentuk grafis, yaitu lingkar 24 jam yang menggemakan bentuk ring, menjadi bahasa visual utama. Bentuk ini muncul di hero, pilar, aplikasi, dan pemilih finish. Halaman terasa seperti instrumen yang tenang dan mudah dibaca.

**Alasan cocok untuk portofolio.** Arah ini memperlihatkan pemikiran sistem dan UX paling kuat: satu bentuk menghubungkan produk, data, dan UI pembelian. Arah ini juga paling kaya interaksi untuk Developer.

**Storytelling.**

1. **Hero:** render ring di tengah lingkar 24 jam tipis dengan busur tidur, titik aktivitas, dan celah istirahat. Data diberi label simulasi.
2. **Konteks:** lingkar “terurai” menjadi garis hari horizontal dengan tiga sisipan foto.
3. **Pilar:** setiap pilar menyorot satu segmen lingkar dengan warnanya.
4. **Aplikasi:** UI ponsel memakai lingkar yang sama.
5. **Produk:** lingkar menjadi pemilih finish; paket ditampilkan sebagai diagram exploded berlabel.
6. **FAQ:** daftar bersih.
7. **Penutup:** lingkar menyelesaikan satu hari penuh, lalu CTA.

**Tipografi.** Grotesk presisi (kandidat: Geist atau Inter Display) dengan angka monospace.

**Warna.** Latar `#F5F4F0` dan tinta `#121212`. Warna pilar redup: tidur indigo `#3E4A7A`, aktivitas tanah liat `#C2694A`, istirahat sage `#8FA58A`.

**Komposisi.** Grid Swiss 12 kolom yang ketat dengan lingkar sebagai jangkar di tengah.

**Treatment produk.** Render studio netral dengan lingkar sebagai bingkai.

**Motion.** Lingkar tergambar mengikuti scroll, segmen dapat di-hover, dan pemilih finish interaktif.

**Aset (± 9).** 2–3 foto lifestyle, render ring 3 finish, sistem lingkar vektor, potongan UI simulasi, dan diagram paket.

**Hubungan dengan referensi.** Mengambil logika sinyal → pola → insight dari Sensiq, angka dan tipografi besar dari Happy Ring, dan layar aplikasi Oura. Pembeda Stillway: satu bentuk data yang menyatukan geometri produk, data, dan UI.

**Risiko/kompromi.**

- Paling dekat dengan konvensi kategori yang berbasis data/teknologi, sehingga bisa terasa dingin dibanding karakter “tenang, peka”.
- Data di posisi utama mudah dibaca sebagai klaim akurasi.
- Ruang untuk memperlihatkan art direction fotografi paling sempit.
- Beban development paling besar.

---

## Rekomendasi Visual Director

**Pilih Arah A — “One Day, in Light”**, dengan meminjam satu elemen dari B: plate bayangan ring di section material/produk sebagai detail signature.

Alasan:

1. Hanya A yang menjadikan konsep “understand your rhythm” sebagai struktur halaman, bukan sekadar headline. Hal ini paling meyakinkan bagi founder dan calon klien e-commerce yang menilai kemampuan storytelling.
2. Arah fotografi yang telah disetujui (keseharian, cahaya alami, detail material) dipakai sepenuhnya, bukan dikecilkan.
3. Konsep bertemu keputusan pembelian: finish dilihat dalam dua cahaya. Ini bukti UX e-commerce yang konkret dan tidak memerlukan klaim tambahan.
4. Paling jauh dari pola kategori yang terlihat di ketiga referensi.

Kompromi yang diterima: produksi aset paling berat. Mitigasi:

- Buat ring master terlebih dahulu: geometri dan tiga finish dikunci, lalu dipakai sebagai referensi di setiap generasi gambar.
- Satu interior.
- Tangan dan objek tanpa wajah.
- Empat keadaan cahaya.

## Catatan untuk dibawa ke Strategy Director, jika A dipilih

- Urutan pesan `home-copy.md` dipertahankan, tetapi “Konteks keseharian” dan “Tiga pilar” dipetakan ke waktu dalam sehari. Perlu konfirmasi bahwa pemetaan tidur → pagi, aktivitas–istirahat → siang, dan insight → sore tidak mengubah pesan.
- Diperlukan microcopy penanda waktu (contoh: “06:40 · Morning”), label “Simulated data”, serta label toggle “Daylight / Lamp light”.
- Catatan concept project dapat mengikuti pola jujur arsip FIFTYSEVEN, tetapi dengan bentuk yang lebih ringan, misalnya di footer atau sebagai keterangan kecil. Bentuknya perlu disepakati.

## Versi 1 — spesifikasi kerja

Status: arah, gambar bayangan, perangkat, dan jumlah frame disetujui (D-026, D-029, D-030, D-031). Konsep motion dan aturan di bawah adalah **usulan Visual Director**; tingkat interaksi belum diputuskan.

### Frame (D-027)

| # | Frame | Isi |
| --- | --- | --- |
| 1 | Home penuh — desktop 1440 | Seluruh bab dari 06:40 hingga 23:00. |
| 2 | Home penuh — mobile 390 | Bab yang sama dalam satu kolom dengan chip waktu sticky. |
| 3–6 | State interaksi (2–4) | Kandidat: finish dalam Daylight vs Lamp light; menu mobile terbuka; FAQ terbuka; momen signature pada posisi awal/akhir. |

### Gambar bayangan ring (D-026)

**Fungsi.** Satu gambar diam di bab 18:30 (material). Gambar memperlihatkan bentuk dan finish ring melalui cahaya, bukan melalui daftar spesifikasi. Tidak ada animasi, caption, maupun teks di atas gambar.

**Brief gambar (usulan).**

- **Objek:** ring Stillway dari gambar acuan, finish **Silver**. Silver dipilih karena paling netral dalam membaca bentuk bayangan; perlu persetujuan.
- **Penempatan:** ring berbaring datar di permukaan, bukan berdiri. Posisi ini masuk akal secara fisik dan menghasilkan bayangan elips panjang.
- **Permukaan:** batu kapur honed atau plaster tanpa glasir, dengan tekstur mikro nyata. Tanpa urat marmer.
- **Cahaya:** satu sumber matahari keras dari sudut rendah (±10–15°), sekitar 4500K.
  - Bayangan tajam di titik kontak dan makin lembut menjauhi ring (penumbra realistis).
  - Cahaya yang memantul dari sisi dalam ring yang mengilap boleh membentuk satu kilau kecil di dalam bayangan. Detail ini harus konsisten dengan arah cahaya.
- **Kamera:** sudut miring sekitar 60–70° dari atas, kesan lensa makro 100mm, ruang tajam cukup untuk seluruh ring. Ring berada di sepertiga kiri dan bayangan mengalir ke ruang kosong; komposisi tidak simetris di tengah.
- **Grading:** permukaan mendekati token Dusk `#E8DBC8`, hitam tidak pekat, tanpa vignette.

**Ciri “slop” yang menyebabkan gambar ditolak.**

- Profil, lebar, atau ketebalan ring berbeda dari gambar acuan.
- Muncul tonjolan sensor, ukiran, teks, atau logo yang tidak ada di acuan.
- Arah bayangan tidak cocok dengan arah highlight, atau muncul lebih dari satu bayangan.
- Ring tampak melayang tanpa bayangan kontak.
- Kilap plastik ala CGI, HDR berlebihan, atau ketajaman berlebih.
- Lens flare, glow, partikel bokeh, gradasi latar, atau vignette.
- Properti dekoratif: daun, bunga kering, lipatan linen, tetesan air, batu/kayu bertekstur (pola Sensiq), atau marmer mewah.
- Komposisi simetris di tengah layaknya foto katalog generik.

**Proses.** Gambar acuan ring dibuat lebih dulu, lalu 4–6 varian dihasilkan dengan acuan tersebut. Pilih satu varian, retouch, kemudian catat alat, prompt, tanggal, dan status “AI-generated” di log aset.

### Konsep motion (GSAP) — usulan

Prinsip: gerak hanya dipakai untuk menjelaskan sesuatu. Dalam satu halaman ada **satu momen signature yang digerakkan scroll** dan **satu interaksi fungsional**. Selebihnya hanya entrance hero sekali saat halaman dimuat dan respons hover/klik.

| Elemen | Perilaku | Implementasi | Alasan |
| --- | --- | --- | --- |
| Latar bab waktu | Statis. Setiap bab memiliki latar datar sendiri (Dawn → Day → Dusk → Night); batas antarbab tegas. | Tanpa animasi. | Pergantian waktu sudah terbaca dari layout. Interpolasi latar sepanjang halaman akan menjadi gerak dekoratif. |
| Entrance hero | Sekali saat load. Lapisan gelap tipis di atas foto memudar (0.15 → 0) seperti cahaya pagi naik, lalu baris headline naik 12px dan muncul. | `gsap.timeline()`, durasi 0.9 detik, `power2.out`, stagger antarbaris 0.08. Lapisan memakai opacity, bukan `filter`, agar ringan. | Membangun suasana pagi tanpa mengulang pola reveal di setiap section. |
| Rail waktu | Penanda waktu aktif berpindah saat bab baru masuk viewport; angka berganti dengan geser vertikal 0.3 detik. Tanpa garis progres yang di-scrub. | `ScrollTrigger.create({ trigger: bab, start: "top center", end: "bottom center", onToggle })`. | Rail berfungsi sebagai navigasi dan orientasi, bukan hiasan. |
| **Momen signature: “Light moves across the desk”** (bab siang, pilar aktivitas–istirahat) | Section di-pin sekitar 1,5 layar. Dua plate dari adegan dan kamera yang sama (cahaya 09:00 dan 15:00) ber-crossfade mengikuti scroll, sementara angka rail berjalan 09:00 → 15:00. | `gsap.timeline({ scrollTrigger: { trigger, start: "top top", end: "+=150%", pin: true, scrub: 0.6 } })` memakai `ease: "none"` pada crossfade. Hanya opacity yang dianimasikan. | Satu-satunya momen yang membuat pembaca mengalami perubahan waktu; konsep “rhythm” menjadi gerak. |
| Finish dalam dua cahaya (bab produk) | Klik Silver/Black/Gold dan Daylight/Lamp light untuk mengganti gambar dengan crossfade 0.45 detik. Tidak terkait scroll. | `gsap.to()` dengan opacity, `power2.inOut`. Status tombol memakai `aria-pressed`. | Interaksi yang membantu keputusan pembelian. |
| Hover dan klik | Tombol naik 1px saat hover dan mengecil ke 0.98 saat ditekan. Garis bawah tautan tergambar dari kiri dalam 0.25 detik. Accordion FAQ membuka dalam 0.35 detik. | CSS transition atau `gsap.to()` dengan `power1.out`. | Respons yang tenang dan konsisten. |
| Gambar bayangan ring | Statis. | — | Kekuatannya ada pada cahaya, bukan gerak. |

**Mobile 390.** Momen signature tidak di-pin. Crossfade tetap di-scrub saat gambar melintasi viewport (`start: "top 75%"`, `end: "bottom 25%"`) agar tidak terasa seperti scroll-jacking. Rail berubah menjadi chip sticky di atas.

**Reduced motion.** Gunakan `gsap.matchMedia()` dengan `(prefers-reduced-motion: reduce)`: tanpa pin, tanpa scrub, tanpa entrance. Momen signature menampilkan plate 15:00 secara statis dengan penanda waktunya, dan crossfade finish berganti seketika. Semua konten tetap terlihat.

**Yang tidak dipakai.**

- Fade-in di setiap section atau kartu.
- Parallax pada teks.
- Smooth-scroll yang membajak scroll.
- Ring yang berputar (turntable).
- Counter angka.
- Carousel otomatis.
- Easing bounce/elastic.
- Kursor kustom.

**Catatan performa untuk Developer.**

- Hanya `opacity` dan `transform` yang dianimasikan.
- Kedua plate momen signature berukuran identik dan memakai AVIF/WebP.
- Hanya gambar hero yang di-preload.
- `will-change` dipasang hanya selama section di-pin.
- Panggil `ScrollTrigger.refresh()` setelah font dan gambar dimuat.
- Buat ScrollTrigger berurutan dari atas ke bawah.

**Handoff Figma.** Frame Figma bersifat statis. Motion didokumentasikan lewat anotasi pada frame dan tabel ini. Jika prototype dipilih, gunakan Smart Animate untuk state finish/cahaya dan FAQ.

### Aturan anti-slop Versi 1

Disusun dari telaah referensi dan prinsip skill `design-taste-frontend` (leonxlnx/taste-skill). Skill tersebut dibaca, tetapi tidak dipasang.

1. Satu gagasan per layar; setiap bab maksimal 1–2 layar pada 1440×900.
2. Tepi konten kiri dan kanan sama; grid konsisten di setiap bab.
3. Produk tampil besar dan utuh paling banyak di tiga section, dengan gambar berbeda di setiap section.
4. Setiap janji pada headline harus terlihat di gambar; tidak ada gambar suasana yang kosong makna.
5. Satu gaya tombol, satu gaya kartu, satu skala radius, satu skala heading.
6. Tanpa testimoni, angka, logo pers, atau klaim yang tidak tersedia (sejalan dengan D-005).
7. Gambar tanpa caption penjelas. **Pengecualian proyek:** label “Simulated data” pada UI aplikasi tetap wajib karena aturan kejujuran proyek lebih tinggi daripada aturan skill.
8. Tanpa ungu/lavender, neon, gradasi dekoratif, atau glassmorphism.
9. Foto AI didokumentasikan sebagai AI-generated. Skill menyarankan foto stock nyata, tetapi proyek ini memakai image generation sesuai peran Visual Director.

## Pertanyaan yang belum dijawab (diajukan bertahap)

1. ~~Pemilihan arah~~ — terjawab pada D-026 dan D-030: Versi 1 = A ditambah 1 gambar bayangan ring.
2. ~~Cakupan perangkat~~ — terjawab pada D-029: desktop 1440 + mobile 390.
3. ~~Jumlah frame~~ — terjawab pada D-031: 4–6 frame.
4. Tingkat interaksi: frame statis, prototype Figma untuk interaksi kunci, atau build oleh Developer.
5. Metode aset: AI penuh, atau ring master 3D/AI ditambah plate lifestyle AI.

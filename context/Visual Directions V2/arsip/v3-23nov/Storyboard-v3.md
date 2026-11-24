# Stillway — Storyboard

Versi: **v3 · 20 Nov 2026**. Versi ini menggabungkan Storyboard v2 dengan semua revisi 20 Nov: ring sticky, sinkron ke website live, meja kayu S06, lampu merah S08, wordmark kapital, dan aturan tengah vertikal.
Versi lama disimpan di `arsip/`.

**Figma "Website AI - 1 Stillway"**
- Storyboard 2 · Revisi ring sticky (acuan alur): https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004287-1270
- Design 1440px (acuan tampilan untuk dev): https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004245-50
- QA board: https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=40004269-1170
- Live: https://stillway-two.vercel.app/

**Isi dokumen ini:** alur halaman, yaitu urutan section, apa yang terjadi di setiap posisi scroll, cara satu section menyambung ke section berikutnya, dan aset yang dibutuhkan. Warna, font, logo, dan referensi visual ada di `Moodboard.md`. Temuan live vs storyboard ada di `QA.md`.

**Urutan acuan bila ada perbedaan:** Figma Design + Foundation (variable & text style) → Storyboard 2 di Figma → dokumen ini → `QA.md` → `Moodboard.md`. Dokumen/section berlabel arsip tidak dipakai.

**Cara membaca**
- Tiap section di-pin. Selama section tampil, scroll menggerakkan isi section dari state ke state.
- **State** = satu posisi kunci. Persentase scroll dihitung relatif terhadap section itu sendiri.
- Kolom **Ring** menjelaskan apa yang dilakukan ring di state itu.
- Angka bertanda `*` atau label "Simulated data" adalah contoh, bukan data produk.
- **Storyboard = alur cerita.** Urutan, isi tiap state, gerak ring, dan sambungan wajib diikuti. Tampilan final ada di section **Design**.

---

## 1. Konsep: The Quiet Day

Scroll = satu hari penuh. Ring adalah satu-satunya yang tetap terjaga sementara kamu menjalani hari. Jam di navbar ikut berjalan:

`06:50 → 07:10 → 23:10 (kilas balik semalam) → 07:40–15:30 → 17:30 → 21:00 → 22:00 → 06:50 besok pagi`

- **Tokoh:** satu ring yang sama di seluruh halaman, tidak pernah diganti gambar lain. Ring tidak tampil sebagai objek di tiga section:
  - Section 04: ring hanya terlihat di jari pada foto.
  - Section 07: ring ada di foto kartu.
  - Section 09: tanpa ring sama sekali.
- **Nada:** pola, bukan vonis. "A picture of the night, not a verdict on it."

| Act | Section |
|---|---|
| Act 1 · Hook | 01 Hero · 02 Why Stillway |
| Act 2 · Rhythm | 03 Sleep summary · 04 Activity & rest · 05 Daily insight |
| Act 3 · Object | 06 Product details · 07 Specs & benefits · 08 Features · 09 The app |
| Act 4 · Choice | 10 Finishes & pricing · 11 Closing, FAQ & footer |

### Peta section

| # | Section | Jam | Background | State | Ring | Inti section |
|---|---|---|---|---|---|---|
| 01 | Hero | 06:50 | Foto pagi (batu + moss) → Paper | 4 | Di atas batu → kamera masuk lewat lubang ring | Wordmark "STILLWAY" raksasa, kamera mendekat lalu masuk ke ring |
| 02 | Why Stillway | 07:10 | Paper | 4 | Di tengah, berputar pelan | 3 kalimat bergantian, kata besar di belakang ring |
| 03 | Sleep summary | 23:10 | Night | 4 | Disorot, lalu ke kanan | 3 angka muncul satu per satu |
| 04 | Activity & rest | 07:40–15:30 | Night + cocoa glow | 5 | Di jari pada foto | Day arc: 5 foto di busur, foto aktif di puncak, jam besar + status di bawahnya |
| 05 | Daily insight | 17:30 | Dusk cocoa | 4 | Naik dari bawah → memenuhi layar | Kartu kaca app di lubang ring |
| 06 | Product details | 21:00 | Paper + meja kayu | 4 (+ detail A–C) | Menggelinding di meja → jatuh dari tepi → masuk ke jari | Tepi meja tepat di tengah layar, tangan naik dari bawah |
| 07 | Specs & benefits | 21:00 | Sand → foto lingkungan | 7 | Di foto kartu | 4 kartu momen 1/4–4/4, penutup "The everyday." |
| 08 | Features | 21:00 | Night | 4 | Dekat ke jendela sensor | Lampu hijau → biru → ungu → merah (off) |
| 09 | The app | 21:00 | Paper | 3 | Tidak tampil | HP di tengah, layar app ikut scroll |
| 10 | Finishes & pricing | 22:00 | Sand | 4 | Bisa diputar user | Pilih finish, cahaya, ukuran, 1 tombol utama |
| 11 | Closing, FAQ & footer | 06:50 | Night + glow amber | 4 | Di tengah → keluar ke atas | Satu kanvas gelap sampai footer |

### Tiga momen kunci
- **Momen cahaya (02 → 03):** satu-satunya momen sorotan di halaman. Lampu padam, ring disorot dengan kilau, lalu sensor menyala hijau. Hijau hanya untuk LED sensor, bukan warna UI. Lihat Design "02 → 03 · Lampu & sensor", State A–C.
- **Ring sebagai lensa (03 → 04):** pagi terlihat lewat lubang ring. Ring berputar menghadap kamera dan membesar, foto 07:40 muncul di lubangnya, lalu kamera menembus lubang dan lingkaran berubah jadi foto aktif di puncak busur S04. Lihat Design "03 → 04 · Malam ke pagi", State A–C.
- **Ring naik dari bawah (04 → 05),** gaya [Viture Mobile Dock Mini](https://www.viture.com/mobile-dock-mini). Konten S04 naik keluar sampai layar gelap kosong, lalu ring muncul dari tepi bawah dengan rim light cocoa dan berhenti di posisi S05. Lihat Design "04 → 05 · Siang ke senja", State A–C.

### Aturan gerak untuk seluruh halaman
- **Ring sticky:** ring ada di satu layer sticky (pinned stage) di atas semua section. Ring tidak pernah muncul atau hilang lewat fade. Yang berubah hanya posisi, ukuran, rotasi, dan cahaya, mengikuti scroll (scrub).
- **Panel:** setiap section = satu panel (background + konten). Pindah section = panel berikutnya naik dari bawah dengan tepi lurus dan menutup panel sebelumnya, sementara konten lama ikut naik keluar layar. Tidak ada cross-fade background.
- **Teks:** di dalam section, kalimat berganti dengan bergerak naik: kalimat lama naik dan mengecil, kalimat baru naik dari bawah. Bukan crossfade.
- **Fade:** hanya untuk elemen kecil (angka, label, glow), maksimal ±250 ms.
- **Navbar:** berganti theme (Dark/Light) tepat saat tepi panel melewati navbar.
- **Section tanpa ring 3D (04, 07, 09):** ring keluar ke atas layar sebelum panel penuh, lalu masuk lagi dari bawah bersama panel berikutnya. Pengecualian 03 → 04: ring menjadi lensa.
- **Sambungan:** frame akhir satu section sama dengan frame awal section berikutnya (lihat §3). Tidak ada potongan mendadak.
- **Klik:** tidak ada klik yang wajib. Satu-satunya interaksi ada di Section 10: memutar ring, memilih finish, cahaya, ukuran, dan beli.
- **Reduced motion:** panel tetap naik dengan scroll biasa. Ring langsung di posisi akhir tiap state, tanpa animasi dan tanpa loop.

### Aturan layout (desktop 1440 × 900)
- **Grid:** 12 kolom, margin kiri/kanan 40, kolom 84, gutter 32.
- **Layout rata atas:** konten mulai di y 144.
- **Layout rata tengah:** pusat konten utama di **y 482**, yaitu tengah antara bawah navbar (64) dan bawah frame (900), jadi jarak atas = jarak bawah. Berlaku untuk ring di S01–S02, S03 dan S08 State 1, S07 State 1–2 dan 7, S09, S10, dan S11 State 1.
- **Baris bawah** (footer, progress, counter) berakhir di y 860.
- **Tipografi:** semua teks memakai text style (format template: Display 1–4, Heading 1–3, Label, Paragraph, Buttons, Mono; `Moodboard.md` §3.1), tanpa ukuran lepas. Kapital hanya untuk label Mono dan wordmark; caption, judul, dan kalimat sans sentence case. Display 2 (160) hanya untuk teks besar. Wordmark besar hero dan footer selalu kapital "STILLWAY", Geist Medium, selebar layar.

---

## 2. Detail per section

### 01 · Hero (Act 1 · 06:50 · Foto pagi → Paper)
**Tujuan:** kesan pertama dalam ±3 detik: tenang, hangat, satu objek. Fitur hanya disebut sebagai daftar singkat; detailnya di section berikutnya.
**Copy:** "STILLWAY" (wordmark) / "Understand your rhythm." / Sleep summary · Activity and rest · Daily insight / "$299" / "A smart ring that brings your sleep, activity, and rest into one everyday view." / "Scroll down".
**Visual:** foto pagi full-bleed (batu + moss, cahaya rendah hangat), wordmark putih raksasa selebar layar, ring 3D berdiri di atas batu di depan wordmark.

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Foto pagi, wordmark raksasa, tagline kiri, daftar fitur kanan dengan ikon (moon · workout-run · sparkles dari Icon Base, 20 px, icon-white), intro kiri bawah | Di atas batu, "bernapas" pelan (membesar ±2% lalu kembali) |
| 2 | 33% | Wordmark, daftar dan intro naik keluar layar; kamera mendekat | Membesar dan miring; pantulan lingkungan bergeser di permukaan |
| 3 | 67% | Kamera masuk lewat lubang ring; jendela sensor menyala hijau (petunjuk Section 08) | Memenuhi layar |
| 4 | 100% | Panel Paper naik dari bawah menutup foto; navbar berganti ke theme terang saat tepi panel lewat | Satu objek, pusatnya di y 482, ukurannya sama dengan awal Section 02 |

### 02 · Why Stillway (Act 1 · 07:10 · Paper)
**Tujuan:** memberi alasan untuk peduli sebelum fitur muncul. Ring di tengah, teks bercerita di sekitarnya. Ini bukan halaman About us.
**Copy:**
- Kalimat utama: "Your body already keeps a rhythm." → "Most devices turn it into a score." → "Stillway just keeps the pattern."
- Paragraf kecil: "Sleep, heart rate and temperature already move in a daily pattern, whether you look or not." / "Scores, streaks and red alerts make rest feel like homework." / "No score to chase. Just what your days look like, kept quietly."

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Kata besar "rhythm" samar di belakang ring, label kecil "WHY STILLWAY" | Di tengah (y 482), sudut 3/4 |
| 2 | 33% | Kalimat 1 besar di kiri, paragraf kecil di kanan (pola Oryzo) | Berputar pelan sedikit ke kiri |
| 3 | 67% | Kalimat 1 naik dan mengecil jadi baris kecil redup; kalimat 2 naik dari bawah | Berputar lebih jauh |
| 4 | 100% | "keeps the pattern." lebar penuh di belakang ring (pola Sofi), underline ochre; lalu semua konten naik keluar saat panel Night naik | Hampir menghadap kamera, menutupi bagian tengah teks besar; tetap sticky |

### 03 · Sleep summary (Act 2 · 23:10 · Night)
**Tujuan:** data pertama: ringkasan tidur semalam dalam satu layar. Isinya hanya ring + 3 angka, tanpa HP, layar app, foto, atau grafik.
**Copy:** "Last night, in one view." [ SETTLED ] 23:10 · [ RESTED ] 7h 12m · [ BROKEN ] 2× (Simulated data).

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Panel Night sudah menutup layar, jam navbar 23:10; heading "Last night, in one view." naik dari kiri bawah | Di tengah (y 482), disorot cahaya hangat cocoa/200 dari atas; sensor di sisi dalam menyala hijau, pendarnya jatuh ke band |
| 2 | 33% | SETTLED 23:10 naik dari bawah ke posisinya di kiri | Bergeser ke kanan (sesuai build, QA SL-01), berputar sangat pelan |
| 3 | 67% | RESTED 7h 12m naik; angka pertama naik dan mengecil jadi baris kecil redup | Tetap berputar pelan |
| 4 | 100% | BROKEN 2× naik terakhir, lalu ketiga angka naik keluar bersama panel | Menghadap kamera, lalu jadi lensa ke Section 04 |

### 04 · Activity & rest (Act 2 · 07:40 → 15:30 · Night + cocoa glow)
**Tujuan:** menunjukkan bahwa ritme bukan hanya tidur. Ada saat bergerak dan beristirahat sepanjang hari.
**Copy:** "Activity and rest." + "Through the day the ring keeps two quiet tallies: the time you spend moving and the moments you stop. Seen together they show the rhythm of a day."

**Layout Day arc** (dipilih 23 Nov dari eksplorasi, Opsi A; ref. MotionSites "Coastal Cards", Osmo "Radial Cards Slider"):
- Kiri atas: judul satu baris (Heading 1) + paragraf (Paragraph Medium), mulai y 144.
- Busur: lingkaran R 1340 dengan pusat (720, 1758), 12° per foto, garis orbit tipis. Foto aktif 264×352 di puncak busur (radius 12, garis putih tipis); foto lain 176×236, diputar mengikuti busur, label jam Mono di bawah tiap foto, makin redup menjauh dari puncak (yang sudah lewat lebih redup dari yang akan datang).
- Jam besar (Display 4) + satu baris status di tengah bawah foto aktif (jarak 22). Foto aktif + jam berpusat di y 482, x 720.
- Tanpa counter, daftar jam, dan label "Simulated data". Jarak minimum foto samping ke blok judul 24.

| State | Scroll | Foto di puncak | Status |
|---|---|---|---|
| 1 | 0% | 07:40 jalan | Moving · 25 min walk |
| 2 | 25% | 09:00 membaca + kopi | Resting · 40 min focus |
| 3 | 50% | 10:30 peregangan | Moving · 15 min stretch |
| 4 | 75% | 12:30 makan siang | Resting · 30 min lunch |
| 5 | 100% | 15:30 tangga | Moving · 20 min stairs; lalu busur turun keluar bawah, layar gelap |

- **Gerak:** scroll memutar busur di pusatnya (scrub). Foto berikutnya naik ke puncak & membesar, foto sebelumnya turun ke kiri & meredup. Jam bergulir per digit; status dan jam navbar berganti dengan gerak naik.
- **Ring:** hanya terlihat di jari pada foto.

### 05 · Daily insight (Act 2 · 17:30 · Dusk cocoa)
**Tujuan:** klimaks bagian data. Semua yang dicatat ring muncul sebagai satu kartu sederhana di app.
**Copy:** "Everything it noticed. One calm view." Kartu kaca "LAST NIGHT · 7h 12m" + line chart semalam + "SETTLED 23:10 / UP 06:22" + satu kalimat insight ("You took more short pauses this afternoon than on most weekdays.") + "Simulated data".

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Dusk cocoa sudah menutup layar; eyebrow [ 17:30 · DAILY INSIGHT ] + judul di kiri bawah | Naik dari bawah (gaya Viture), berhenti di kanan-tengah, lalu sticky |
| 2 | 33% | Teks bergeser ke pinggir | Membesar; kilau di tepi bergerak |
| 3 | 67% | Kartu kaca muncul di lubang ring (±45% opacity, sedikit lebih kecil); cahaya hangat di belakangnya mulai terlihat lewat blur | Memenuhi layar (kamera masuk ke lubang ring) |
| 4 | 100% | Kartu kaca terbaca penuh + satu paragraf kecil di bawahnya | Diam |

**Kartu kaca** (referensi gaya [Viture Pro 2](https://www.viture.com/pro2), bukan tiru persis):
- **Ukuran:** lebar 432 px (kolom 5–8), padding 32, gap 24, radius 40, tinggi mengikuti isi (±413 px).
- **Isi dari atas:**
  - Header: pill `LAST NIGHT` di kiri, `SIMULATED DATA` di kanan.
  - Angka `7h 12m` (Display 4, 72).
  - Line chart halus semalam: garis putih 2 px, area gradien, dua titik ochre = terbangun 2×, label `SETTLED 23:10` dan `UP 06:22`.
  - Garis pemisah, lalu kalimat insight (Paragraph Large 20/28).
- **Bahan:** gradien putih 16% ke cocoa gelap 80%, stroke putih tipis, **background blur 60**, gradien 6 stop supaya halus, bayangan lembut.
- **Cahaya:** di belakang kartu ada cahaya hangat (radial, layer blur 140) supaya efek kaca terlihat.
- Kartu dibuat sebagai UI asli (teks bisa dibaca dan dipilih), bukan gambar. Di Figma: komponen `Card / Last night`.

### 06 · Product details (Act 3 · 21:00 · Paper + meja kayu)
**Tujuan:** menjawab "seperti apa bentuk dan bahannya?" Ring dilihat sebagai benda nyata yang bergerak, bukan daftar spesifikasi.
**Copy:** "Made to be forgotten." → "One quiet band" ("A single band with nothing raised on its surface to catch on a sleeve or a keyboard. There is no front to remember and no wrong way to put it on.") → "Softened edges" ("Both edges are bevelled where they meet the finger, so the ring sits easily at night and slides on without catching.") → "Then, it just fits." ("Slip it on in the morning and stop thinking about it.")

**Meja & kamera:**
- Meja kayu pinus terang (tekstur dari foto referensi Sans, serat horizontal), permukaan mulai y 600.
- **Tepi kanan meja tepat di tengah layar (x 720).** Kanan tepi kosong, itu ruang jatuh.
- **Konsep:** ring menggelinding, sampai di tepi meja, jatuh, lalu masuk ke jari tangan yang naik dari bawah.

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0 → 25% | Judul "Made to be forgotten." di kiri atas; meja kayu di kiri bawah | **Menggelinding** dari kiri di atas meja menuju tepi; berputar sesuai jarak tempuh supaya terlihat menggelinding, bukan meluncur; jejak gerak tipis di belakang |
| 2 | 33% | Teks langkah 1 "One quiet band" | Dekat tepi meja, tampak samping (±90°); pantulan berubah mengikuti sudut |
| 3 | 67% | Teks langkah 2 "Softened edges" | Sampai di tepi meja dan mulai miring jatuh ke kanan (±22°); jejak gerak tipis ke bawah |
| 4 | 75 → 100% | **Teks rata tengah di atas** ("Then, it just fits." + satu kalimat; pola Oryzo: teks atas, aset bawah). Tangan naik dari bawah; tag [ SILVER ] di samping jari | Jatuh berputar ke jari, mendarat di pangkal jari, lalu diam (urutan A–C di bawah) |

**Urutan State 4 (blok "Detail State 4" di Storyboard 2):**

| Frame | Scroll | Isi |
|---|---|---|
| A | 75% | Ring lepas dari tepi meja dan jatuh di sisi kanan; teks mulai muncul (samar). Tangan tanpa ring naik dari tepi bawah, hanya ujung jari terlihat |
| B | 88% | Tangan berhenti di posisi akhir. Ring berputar sambil jatuh ke ujung jari; jejak gerak tipis dari tepi meja |
| C | 100% | Kamera mendekat ke tangan, meja keluar frame. Ring mendarat di pangkal jari dan berhenti; tag [ SILVER ] muncul; teks penuh. Sama dengan State 4 |

**Aturan gerak:**
- **Gelinding:** rotasi = jarak ÷ jari-jari, supaya terlihat menggelinding, bukan meluncur. Jarak gelinding ±40% lebar layar di desktop.
- **Jatuh:** dari tepi meja, ring jatuh dengan percepatan (ease power2.in) sambil berputar. Ukurannya mengecil ke skala ring di jari.
- **Tangan:** translateY 100% → 0 (ease-out, scrub). Ring mendarat dengan sedikit pantulan.
- **Scroll:** semua gerak mengikuti scroll, jadi user bisa maju-mundur.
- **Reduced motion:** langsung keadaan akhir (ring di jari).
- **Versi final:** ring di jari dirender realistis, dengan bayangan kontak, jari menutupi sisi belakang ring, dan perspektif sama dengan foto (QA D-01).
- **Tidak ada di section ini:** memutar ring sendiri (ada di Section 10) dan pembahasan sensor (ada di Section 08).

### 07 · Specs & benefits (Act 3 · 21:00 · Sand → foto lingkungan)
**Tujuan:** menjawab "cocok untukku?" lewat empat momen sehari-hari yang disajikan seperti koleksi kartu (pola [Obsidian Assembly](https://obsidianassembly.com/), layout & animasi). Tiap kartu cukup satu kalimat + satu spesifikasi; tanpa kartu data. Angka bertanda `*`.
**Copy:**
- "Through the day."
- (I) Night: "Sleeps with you. Charges while you don't." / kanan "Up to 7 days on a charge." / kiri-bawah "Top up on the dock while you shower."
- (II) Desk: "Sized to forget." / "Sizes 6–13." / "Try them on with the sizing kit before you choose."
- (III) Move: "Light enough to lose track of." / "About 4 g, 2.6 mm thin." (tanpa catatan kiri-bawah)
- (IV) Rinse: "Hands in water. Ring stays on." / "Water resistant to 100 m." / "Washing up, rain, a swim."
- Penutup: "The everyday." + "Ring shown where it's worn."

| State | Scroll | Isi |
|---|---|---|
| 1 | 0% | "Through the day." (Display 2), pusat di y 482; tanpa elemen lain |
| 2 | 20% | Teks Display terbelah: "Through" dari x 40 dan "the day." sampai x 1400 masuk ke belakang deretan kartu; 4 kartu foto Night / Desk / Move / Rinse (180×225, jarak 20) di tengah |
| 3 | 38% | Kartu merapat jadi tumpukan; (I) Night di depan · 1/4 |
| 4 | 54% | (II) Desk · 2/4 |
| 5 | 70% | (III) Move · 3/4 |
| 6 | 85% | (IV) Rinse · 4/4 |
| 7 | 100% | Kartu Rinse mengecil di tengah; foto lingkungan di frame inset (24 atas/bawah, 40 kiri/kanan, radius 14); "The everyday." satu baris (Display 2, sentence case seperti State 1) di depan kartu + satu baris caption (Paragraph Large) di bawah kartu; kartu + caption berpusat di y 482 |

**Layout State 3–6 (satu layout untuk empat kartu, simetris di sumbu y 482):**
- **Tumpukan kartu:** kartu depan 392×490 tepat di tengah (pusat y 482), radius 6. Dua kartu berikutnya menumpuk di belakang (352 dan 312 lebar) dan mengintip di atas & bawah.
- **Sumbu:** garis tipis penuh x 40–1400 di y 482, di belakang tumpukan.
- **Kiri (kolom 1–3, x 40–356):** judul "(I) Night" (Heading 2) di atas garis; kalimat utama (Paragraph Large) di bawah garis.
- **Kanan (kolom 10–12, x 1084–1400, rata kanan):** counter n/4 di atas garis; spesifikasi (Paragraph Large) di bawah garis, lalu catatan kecil (Paragraph Medium, text-surface) 8 px di bawahnya.
- **Jarak:** semua teks 16 px dari garis, jadi kedua kolom berpusat di sumbu yang sama.
- **Orbit:** tiga elips tipis di belakang tumpukan.

**Gerak (scrub, pola Obsidian Assembly):**
- Masuk dari State 2: 4 kartu merapat jadi tumpukan, "Through"/"the day." keluar ke samping, garis tumbuh dari tengah ke kedua sisi.
- Ganti kartu: kartu depan naik ke belakang tumpukan (mengecil 0.9, meredup), kartu berikutnya maju dari belakang dan membesar ke tengah.
- Judul muncul per huruf dari balik garis; caption naik per baris (mask), spesifikasi menyusul ±80 ms; lingkaran counter terisi; orbit berputar pelan.
- Penutup: kartu mengecil ke tengah, foto lingkungan membesar dari balik kartu jadi full-bleed, "The everyday." muncul dari blur ke tajam, lalu caption naik.

**Ring:** hanya terlihat di foto kartu.

### 08 · Features (Act 3 · 21:00 · Night)
**Tujuan:** satu fitur saja: lampu sensor yang warnanya mengikuti waktu. Semuanya lewat scroll, tanpa chip, hotspot, atau klik.

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | [ FEATURES ] + "Inside the ring."; jendela sensor menyala hijau samar sebagai petunjuk | Di tengah (y 482), melayang pelan |
| 2 | 50% | "One light, tuned to the task.", lampu **hijau** (Heart rate), legenda 3 warna (label, bukan tombol), tag [ SENSOR · LIGHT ] | Kamera dekat ke jendela sensor (ring besar di kanan, sudut 3/4), lalu diam |
| 3 | 75 → 90% | "Blue at night. Violet by morning.", lampu **biru** lalu **ungu** | Posisi sama, hanya warna lampu yang berubah |
| 4 | 100% | **Off / baterai habis:** "Red means it's off." + "When the battery runs out, one small red light shows in the lower sensor window." Hijau, biru, ungu di legenda meredup | Lampu **merah** kecil di **jendela sensor bawah** (jendela kedua, di bawah dua titik kecil): bloom + flare tipis + wash merah lembut |

**Detail lampu:**
- **Rentang warna:** hijau penuh 25–50%, berganti ke biru 50–75%, ke ungu 75–90%, lalu merah (off) 90–100%.
- **Tampilan:** lampu bercahaya lembut dengan flare tipis, cahayanya memantul ke permukaan dalam ring. Hanya lampu yang bersinar; bagian lain ring tetap normal.
- **Opsional di desktop:** label legenda bisa diklik untuk lompat ke posisi warna itu.
- **Klaim:** biru dan ungu adalah lampu status mode, bukan klaim sensor. Copy tidak boleh menulis "biru mengukur oksigen". Perlu konfirmasi tim hardware.

### 09 · The app (Act 3 · 21:00 · Paper)
**Tujuan:** lanjutan langsung dari Section 08. Tiap warna lampu dibaca ulang di app dengan urutan yang sama. Satu state = satu fitur utama.

**Layout** (pola Sofi, mengikuti website live):
- Tanpa ring. HP 300×618 diam di tengah, pusatnya di y 482, dengan status bar 21:00 dan dynamic island. Di bawah layar ada tab bar Heart rate / Sleep / Recovery, dan di bawah HP label "SIMULATED DATA".
- Kiri: chip warna lampu + deskripsi pendek. Kanan: satu kalimat.
- Footer di y 860: nama bagian di kiri, "Scroll down" + progress + persen di kanan.

| State | Scroll | Lampu | Layar app | Kiri | Kanan |
|---|---|---|---|---|---|
| 1 | 33% | ● Hijau | Heart rate: kartu gradasi amber "Resting 58 bpm" · "Peak on the stairs, 15:30.", grafik garis putih dengan puncak "82 bpm · 15:30" | "The green light, read back. Your heart rate through the day, at a glance." | "Resting 58 bpm. Peak on the stairs, 15:30." |
| 2 | 66% | ● Biru | Sleep: catatan "23:10 · Settled — A picture of the night, not a verdict on it." + kartu gelap "Rested 7h 12m", Settled 23:10 · Up 06:22, bar Deep 1h 24m / REM 1h 36m / Light 4h 12m | "The blue light, read back. Your night, in order: when you settled, how deep you went." | "Deep, light and REM sleep, laid out across the night." |
| 3 | 100% | ● Ungu | Recovery: "HRV · this week — Steady day, calm evening.", 7 bar (hari ini paling gelap) | "The violet light, read back. How the night sat against the rest of your week." | "HRV across the week, with today in full colour." |

- **Gerak:** yang bergerak hanya isi layar app (bergeser ke atas mengikuti scroll halaman). HP diam, tidak ada scroll terpisah di dalam HP.
- **Chip dan deskripsi:** berganti dengan bergerak naik di setiap state.
- **Layar app:** dibuat sebagai UI asli, bukan gambar.

### 10 · Finishes & pricing (Act 4 · 22:00 · Sand)
**Tujuan:** setelah paham, baru memilih. Satu panel menjawab semua pertanyaan beli: finish, cahaya, ukuran, isi box, harga.
**Copy:**
- Judul: "Turn it yourself." → "Find your size and finish."
- Harga: "Stillway Ring" · "$299*" · "Every finish, same price. No required subscription."
- Pilihan: Finish Silver / Black / Gold · Daylight / Lamp light · Size 6–13 · "Not sure? A sizing kit comes first, so you can try before you settle."
- "30-night trial · In the box: the ring, a charging dock, and a sizing kit."
- Tombol: "Choose [finish] · $299".

**Layout** (mengikuti website live, konten pusat di y 482):
- **Kiri:** judul (Heading 1, 56) sejajar tepi atas panel. Ring render tanpa kotak foto di tengah kolom kiri, dengan "‹ Drag to turn ›" di bawahnya.
- **Kanan:** panel 480 × 613, radius 16.

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | "Turn it yourself."; finish default Silver, Daylight | User bisa memutar ring 360° (drag / swipe), hanya berputar, tanpa zoom. Tombol ‹ › lompat ke sudut tertentu. Kembali ke pose awal kalau dibiarkan beberapa detik |
| 2 | 33% | User memilih Black; tombol "Choose Black · $299" | Bahan ring ikut berganti (warna + kilap), bukan hanya warnanya |
| 3 | 67% | User memilih Gold + Lamp light; latar #D8CEC1 dan glow amber di kiri, panel ikut menghangat | Pantulan ring lebih hangat |
| 4 | 100% | Judul berganti "Find your size and finish."; panel sama | Diam di finish yang dipilih |

### 11 · Closing, FAQ & footer (Act 4 · 06:50 besok · Night + glow amber)
**Tujuan:** penutup dalam satu background gelap yang tidak terputus, dari kalimat penutup sampai footer (pola oryzo.ai). Jam kembali ke 06:50, sama seperti Hero.
**Copy:**
- "Tomorrow morning, see your night."
- CTA: "Find your size and finish →" + "No required subscription · Sizing kit included · 30-night trial".
- FAQ "Questions, briefly.":
  - How do I find my size? (terbuka: "A sizing kit comes in the box. Wear a sample size for a day and a night, then choose the size that feels right. Stillway comes in sizes 6 to 13.")
  - Does it work with my phone?
  - How long does the battery last, and how do I turn it off?
  - Can I return it?
  - Is there a subscription?
  - Is Stillway a medical device?
- Pernyataan: "Sleep on it. Stillway keeps the pattern."
- Footer:
  - "©STILLWAY x SANS BROTHERS" · "A concept project by Sans Brothers." · "Stillway is a concept project and is not for sale. Product images are AI-generated. All app data is simulated."
  - "Business enquiry" · "E. hello@sansbrothers.com"
  - Link section + "Back to top ↑"

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Eyebrow Mono "TOMORROW MORNING," + "see your night." (Display 2, 160) di depan ring | Di tengah (y 482), besar, di belakang teks |
| 2 | 33% | Satu tombol + satu baris kecil di bawah | Mengecil, tetap di tengah |
| 3 | 67% | FAQ satu kolom 560 px di tengah (accordion, pertanyaan pertama terbuka, garis tipis, ikon + / −) | Keluar ke atas bersama glow |
| 4 | 100% | "Sleep on it. Stillway keeps the pattern." (Heading 1, sentence case) rata kanan + footer 3 kolom + wordmark **"STILLWAY" kapital** selebar layar (Geist Medium, x 40–1400, bawah huruf di y 860), sama dengan hero | Tidak tampil (logo = wordmark saja) |

**Hover pada wordmark footer:**
- **Gerak:** satu garis kilap putih-hangat menyapu dari kiri ke kanan, sama seperti kilau di tepi ring.
- **Warna:** krem #E9DCC8 → putih → amber #F4C98E → krem.
- **Waktu:** miring ±20°, ±0,9 detik, sekali per hover.
- **Touch device:** kilau diputar sekali saat wordmark terlihat.
- **Reduced motion:** wordmark cukup sedikit lebih terang saat di-hover.

---

## 3. Sambungan antar section

Di Figma (Storyboard 2), tiap sambungan punya kartu **Transisi** (akhir, awal, background/jam, gerak ring) dan kartu **Sambungan**. Semua memakai model panel naik + ring sticky. Tidak ada cross-fade background.

| Sambungan | Awal (0–40%) | Akhir (40–100%) | Ring (sticky) | Jam |
|---|---|---|---|---|
| 01 → 02 | Foto dan teks hero naik keluar | Panel Paper naik sampai menutup layar; "rhythm" berhenti di belakang ring; navbar Dark → Light | Mundur dari lubang ke ukuran penuh, tetap di tengah | 06:50 → 07:10 |
| 02 → 03 | Panel Night naik; konten 02 ikut naik keluar | Panel menutup layar; navbar Light → Dark | Diam di tengah. Lampu padam (ring hampir siluet), lalu sorotan cocoa dari atas + satu kilau putih menyapu band (±600 ms), lalu sensor menyala hijau | 07:10 → 23:10 |
| 03 → 04 | Angka dan panel 03 naik keluar; sensor padam | Foto 07:40 muncul di lubang ring, lalu lingkaran jadi foto aktif 264×352 di puncak busur (radius 120 → 12); foto lain masuk di sepanjang busur | Ring sebagai lensa: menghadap kamera, membesar ×1.6, lalu melebar keluar layar (blur) saat kamera menembus lubang | 23:10 → 05:30 → 07:40 |
| 04 → 05 | Busur foto turun keluar bawah, jam & judul naik keluar; layar gelap kosong | Eyebrow + heading naik di kiri bawah | Muncul dari bawah dengan rim light cocoa, berhenti di kanan-tengah, lalu sticky | 15:30 → 16:40 → 17:10 → 17:30 |
| 05 → 06 | Kartu app naik keluar; ring zoom out | Panel Paper + meja kayu naik; navbar Dark → Light | Turun ke meja di kiri, lalu mulai menggelinding | 17:30 → 21:00 |
| 06 → 07 | Foto tangan + ring mengecil jadi kartu (radius 0 → 16) sambil panel Sand naik | "Through the day." naik ke tengah; kartu bergabung ke deretan kartu sebagai kartu Night | Tidak ada ring sticky; ring tetap di jari pada foto | 21:00 |
| 07 → 08 | Panel Night naik; foto "The everyday." naik keluar | Ring ikut naik, berhenti di tengah; lampu hijau samar | Masuk dari bawah bersama panel, lalu sticky | 21:00 |
| 08 → 09 | Judul dan legenda naik keluar; lampu kembali hijau sesaat | Panel Paper naik dengan HP di tengah; navbar Dark → Light | Naik dan mengecil keluar dari atas layar | 21:00 |
| 09 → 10 | Panel 09 (HP + deskripsi) naik keluar | Panel Sand naik: judul, ring, panel pilihan | Masuk dari bawah, berhenti di tengah kolom kiri, lalu bisa diputar | 21:00 → 22:00 |
| 10 → 11 | Judul dan panel pilihan naik keluar | Panel Night + glow amber naik dengan teks closing; navbar Light → Dark | Finish yang dipilih bergeser ke tengah dan membesar di belakang teks | 22:00 → 06:50 |

---

## 4. Aset yang dibutuhkan

| Section | Aset | Status |
|---|---|---|
| 01 | Foto pagi full-bleed (batu + moss, tanpa ring) | Sudah ada di build |
| 01, 02, 03, 05, 06, 08, 10, 11 | Ring yang sama: perak, tepi chamfer, bagian dalam hitam matte, 2 pad oval, 2 jendela sensor (lampu bisa berganti warna, termasuk merah di jendela bawah), logo "Stillway" kecil tone-on-tone di sisi luar | Wajib (QA G-01: satu material silver) |
| 04 | 5 foto momen (07:40, 09:00, 10:30, 12:30, 15:30) | Sudah ada di build; ekspor ulang resolusi 2× (QA A-01) |
| 06 | Tekstur meja kayu pinus terang (foto referensi Sans, serat horizontal) | Sudah ada di Figma |
| 06 | Foto tangan **tanpa ring dan tanpa background** (satu jari terangkat), naik dari tepi bawah | Baru |
| 06 | Render ring di jari: bayangan kontak, oklusi jari, perspektif sama dengan foto | Baru (QA D-01) |
| 07 | 4 foto kartu potret (Night, Desk, Move, Rinse) + 1 foto lingkungan "The everyday." | Sudah ada di build |
| 08 | Tidak ada foto; lampu hijau / biru / ungu / merah dibuat di 3D | — |
| 09 | Tidak ada foto; layar app dibuat sebagai UI | — |
| 10 | Ring dalam 3 finish (Silver / Black / Gold) + cahaya Daylight / Lamp light | Sudah ada di build (3D) |
| 11 | Tidak ada foto; ring render closing sama dengan 3D | — |

**Prompt foto tangan (Section 06):** "A relaxed hand cut out on a plain warm cream backdrop (#F9F5EF), one finger raised and slightly apart from the others, no ring, no props, no room, soft even studio light, photoreal skin, generous empty space on the left, no text."

Setiap foto yang memperlihatkan ring harus memakai bentuk ring acuan dan logo yang sama. Hanya finish yang boleh berbeda, dan itu hanya di Section 10.

---

## 5. Riwayat keputusan

### 20 Nov 2026 (v3)
- Ring sticky + panel naik untuk semua sambungan; tidak ada cross-fade background.
- Design S07, S09, S10, S11 disamakan 1:1 dengan layout website live; warna tetap mengikuti Design.
- S06: ring menggelinding di meja kayu pinus terang, tepi meja tepat di tengah layar, lalu jatuh dan masuk ke jari tangan yang naik dari bawah. State 4 memakai pola "teks atas, aset bawah".
- S08: tambah State 4 "off / baterai habis", lampu merah di jendela sensor bawah.
- S05: kartu insight jadi kartu kaca 432 px dengan line chart dan background blur (gaya Viture Pro 2).
- Wordmark besar hero dan footer selalu kapital "STILLWAY".
- Layout rata tengah: pusat konten di y 482 (jarak atas = jarak bawah).

### 23 Nov 2026
- Text style memakai format template (Display/Display 1–4, Heading/Heading 1–3, Label/Large–X-Small, Paragraph/Large–X-Small, Buttons/Medium–Small, Mono/Large–X-Small; Medium = 16 px di semua grup) dengan ukuran Stillway; style template lama (Inter/DM Sans) dihapus; **semua teks di Design memakai text style**. Variable 🆃 Typography juga format template (Font Family/Heading · Body · Mono = Geist / Geist Mono, Size/display_1 … mono_xs, Line Height, Font Weight), desktop/mobile, terhubung ke tiap style. Tabel di halaman Foundation → 🆃 Typography diisi nilai Stillway.
- Kapital manual dihapus: caption S07 dan pernyataan S11 jadi sentence case; label kecil memakai Mono.
- Satu weight per grup text style: Display 1–4 semua Geist Medium (sebelumnya campur Medium/Regular/Light), letter spacing Display −3%. Heading 1–3 juga Geist Medium (sebelumnya Regular). Semua letter spacing kini dalam px dan terhubung ke variable `Letter Spacing/<key>` (desktop/mobile). Tabel di Foundation → 🆃 Typography ikut diupdate.
- Hero: bullet lingkaran di daftar fitur diganti ikon dari library Icon Base (Sleep summary = moon, Activity and rest = workout-run, Daily insight = sparkles).
- S04: layout Day arc (Opsi A) dipilih dan diterapkan di Design · 04, Storyboard 2, dan transisi 03 → 04 (lensa terbuka ke foto di puncak busur) & 04 → 05. Opsi B & C tetap di section eksplorasi sebagai arsip.
- Aksen tetap Ochre (Primary di variable); eksplorasi aksen pengganti ditutup. Blok Moodboard yang dobel dengan variable/Foundation (skala warna, kontras, turunan, LED, type scale lama) dihapus dari section Moodboard Figma.
- S07: pill "MADE FOR EVERY HOUR" + garisnya dihapus dari State 1–2 (tidak menambah informasi).
- S07 Specs & benefits (feedback Sans): layout teks ditata ulang ala Obsidian Assembly — tumpukan kartu di tengah (y 482), layout simetris di sumbu y 482 (kiri: judul di atas garis + kalimat di bawah; kanan: counter di atas + spesifikasi & catatan di bawah, rata kanan); kartu data [ BATTERY ] / [ SIZE ] / [ WEIGHT ] / [ WATER RATING ] dan "Simulated data" dihapus; State 7 jadi "The everyday." satu baris (gaya Stillway, seperti "Through the day.") dengan satu baris caption di bawah kartu. Gerak & transisi mengikuti Obsidian Assembly.
- S04 Activity & rest: eksplorasi layout dari feedback klien di section baru "04 · Activity & rest — Eksplorasi layout" (kanan section QA). Opsi A · Day arc: foto di busur seperti jalur matahari, busur berputar mengikuti scroll, jam besar di tengah bawah (ref. MotionSites "Coastal Cards", Osmo "Radial Cards Slider"). Opsi B · Split + penggaris waktu: foto setinggi layar di kanan dengan wipe + parallax, penggaris 06:00–17:00 bergerak di bawah penanda ochre tetap, strip thumbnail (ref. Osmo "Parallax Image Gallery with Thumbnails" + "Scroll Ruler"). Opsi C · Jam terbelah + garis hari (pengganti Opsi B yang kurang cocok dengan gaya Stillway): satu foto 300×400 di tengah (y 482), jam Display 2 terbelah di kiri & kanan foto ("07" · foto · "40", pola "Through the day." S07 / Obsidian "Origin Objects"), status satu baris di bawah foto, garis hari 5 jam di bawah (progress ochre); gerak: foto baru naik dalam mask, digit jam bergulir. Alur cerita tetap; belum dipilih.
- Warna: collection "Stillway · Color" diganti format template — `🌈 Primitive Color` (Neutral, Primary Ochre, Secondary Cocoa, Accent lampu sensor, Alpha) dan `🎨 Token Color` (Button, Background, Text, Stroke, Icon, Logo, Sensor; Light/Dark). Semua warna di Design sudah memakai token; tampilan tidak berubah. Dokumentasi Color Palette & Token Color System di halaman Foundation ikut diupdate. Skala Cocoa dibuat lebih cokelat (chroma naik) supaya beda dengan Neutral: Night #1B0B06, Cocoa #341C12. text-surface & icon-surface sekarang solid Neutral/600 (Dark: Neutral/400), bukan opacity; alpha 65% dihapus.

### 17 Nov 2026 · respons feedback review (Bubbles)

| # | Feedback | Respons |
|---|---|---|
| 01 | Belum full storytelling | Ring jadi satu tokoh di 11 section; setiap section terhubung lewat Transisi + Sambungan |
| 02 | Gerak ring tidak realistis | Ring terlihat seperti benda nyata: pantulan dan cahaya ikut berubah saat bergerak |
| 03 | Aset masih dummy, terasa monoton | Setiap section punya suhu cahaya dan komposisi sendiri; daftar aset di §4 |
| 04 | Tampilan belum menyatu | Satu palet, satu keluarga huruf (Geist), satu wordmark dari navbar sampai footer, satu gaya gerak |
| 05 | Belum setara referensi | Ring realistis, transisi tanpa potongan, satu sistem visual; referensi per section di `Moodboard.md` §6 |

### Referensi utama
- **Oryzo / Lusion** (oryzo.ai): ruang gelap yang mengisolasi produk, teks atas aset bawah, penutup + footer di satu background, wordmark selebar layar.
- **Obsidian Assembly:** teks terbelah + kartu foto (S07).
- **Sofi:** HP diam di tengah dengan deskripsi kiri/kanan (S09), teks lebar penuh di belakang objek (S02).
- **Viture** (Mobile Dock Mini, Pro 2): objek naik dari bawah di layar gelap (04 → 05), kartu kaca blur (S05).

---

## 6. Masih perlu diputuskan

1. **Material ring:** satu ring silver untuk semua section; gold dan black hanya di S10 (QA G-01).
2. **Sleep S03:** pertahankan angka kiri / ring kanan seperti live (QA SL-01).
3. **Spesifikasi resmi:** baterai, rating air, berat, ukuran, harga ($299*), kompatibilitas.
4. **Lampu sensor:** fungsi tiap warna (termasuk merah = off) perlu dikonfirmasi tim hardware.
5. **Logo di produk:** konfirmasi logo "Stillway" di ring ke klien sebelum semua aset dibuat ulang.
6. **Versi mobile:** dari section yang di-pin (02–10), mana yang tetap bergerak mengikuti scroll dan mana yang jadi tumpukan statis. Memutar ring di Section 10 menjadi swipe.
7. **Section 06 di jam 21:00:** background terang di malam hari; cek apakah terasa janggal setelah dibangun dengan meja kayu.
8. **Angka app** (Section 05, 09): masih contoh; tunggu data resmi produk.
9. **Label "Simulated data"** di S03, S05, S09: sudah dihapus di S04 eksplorasi & S07; hapus juga di section lain (footer sudah menulis "All app data is simulated") atau pertahankan — QA G-12.

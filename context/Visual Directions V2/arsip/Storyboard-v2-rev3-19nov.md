# Stillway — Storyboard

Versi: v2 (REV 3) · 19 Nov 2026
Sumber: Figma "Website AI - 1 Ring"
- Storyboard 1 · Feedback, analisa & audit: https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Ring?node-id=40004136-50
- Storyboard 2 · Full storyboard (Section 01–11): https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Ring?node-id=40004036-51

Dokumen ini berisi **alur halaman**: urutan section, apa yang terjadi di setiap posisi scroll, cara satu section menyambung ke section berikutnya, dan aset yang dibutuhkan. Warna, font, logo, dan referensi visual ada di `Moodboard.md`. Kalau dokumen ini berbeda dengan Figma, yang dipakai Figma.

**Cara membaca:**
- Tiap section di-pin. Selama section itu tampil, scroll menggerakkan isi section dari state ke state.
- **State** = satu posisi kunci. Persentase scroll dihitung relatif terhadap section itu sendiri.
- Kolom **Ring** menjelaskan apa yang dilakukan ring di state itu.
- Angka bertanda `*` atau label "Simulated data" adalah contoh, bukan data produk.

---

## 1. Konsep: The Quiet Day

Scroll = satu hari penuh. Ring adalah satu-satunya yang tetap terjaga sementara kamu menjalani hari. Jam di navbar ikut berjalan:

`06:50 → 07:10 → 23:10 (kilas balik semalam) → 07:40–15:30 → 17:30 → 21:00 → 22:00 → 06:50 besok pagi`

- **Tokoh:** satu ring yang sama di seluruh halaman, tidak pernah diganti gambar lain. Ring tidak tampil sebagai objek di tiga section:
  - Section 04: ring hanya terlihat di jari pada foto.
  - Section 07: ring ada di foto kartu.
  - Section 09: tanpa ring sama sekali.
- **Nada:** pola, bukan vonis. "A picture of the day, not a verdict on it."

| Act | Section |
|---|---|
| Act 1 · Hook | 01 Hero · 02 Why Stillway |
| Act 2 · Rhythm | 03 Sleep summary · 04 Activity & rest · 05 Daily insight |
| Act 3 · Object | 06 Product details · 07 Specs & benefits · 08 Features · 09 The app |
| Act 4 · Choice | 10 Finishes & pricing · 11 Closing, FAQ & footer |

### Peta section

| # | Section | Jam | Background | State | Ring | Inti section |
|---|---|---|---|---|---|---|
| 01 | Hero | 06:50 | Paper + Dawn glow | 4 | Besar, center | Wordmark menjauh, ring miring lalu menghadap kamera |
| 02 | Why Stillway | 07:10 | Paper | 4 | Center, berputar pelan | 3 kalimat bergantian, kata besar di belakang ring |
| 03 | Sleep summary | 23:10 | Night | 4 | Kiri, hanya tepinya kena cahaya | 3 angka muncul satu per satu |
| 04 | Activity & rest | 07:40–15:30 | Night | 5 | Di jari pada foto | Filmstrip 5 foto, 1 foto aktif, jam besar + status |
| 05 | Daily insight | 17:30 | Dusk | 4 | Zoom sampai memenuhi layar | Kartu app di lubang ring |
| 06 | Product details | 21:00 | Paper + alas Sand | 4 | Gelinding → samping → tepi → masuk ke jari | Ring menggelinding masuk, tangan tanpa background |
| 07 | Specs & benefits | 21:00 | Sand → foto full-bleed | 5 | Di foto kartu | 4 kartu momen, 1/4–4/4 |
| 08 | Features | 21:00 | Night | 3 | Dekat ke jendela sensor | Lampu hijau → biru → ungu mengikuti scroll |
| 09 | The app | 21:00 | Paper | 3 | Tidak tampil | HP di tengah, layar app ikut scroll |
| 10 | Finishes & pricing | 22:00 | Sand | 4 | Bisa diputar user | Pilih finish dan ukuran, 1 tombol utama |
| 11 | Closing, FAQ & footer | 06:50 | Night + Ember glow | 4 | Center → keluar ke atas | Satu kanvas gelap sampai footer |

**Aturan gerak untuk seluruh halaman:**
- **Sambungan:** frame akhir satu section sama dengan frame awal section berikutnya, atau disambung lewat langkah di §3. Tidak ada potongan mendadak.
- **Klik:** tidak ada klik yang wajib. Satu-satunya interaksi ada di Section 10 (memutar ring, memilih finish, ukuran, beli).
- **Reduced motion:** untuk pengguna yang mematikan animasi, setiap state langsung tampil dengan fade pendek (±300 ms), tanpa gerak besar dan tanpa loop.

---

## 2. Detail per section

### 01 · Hero (Act 1 · 06:50 · Paper + Dawn glow)
**Tujuan:** kesan pertama dalam ±3 detik: tenang, hangat, satu objek. Belum jualan dan belum menjelaskan fitur.
**Copy:** "Understand your rhythm." / "A smart ring that brings your sleep, activity, and rest into one everyday view." / link kecil "Explore Stillway".

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Wordmark "Stillway" besar di belakang (samar), Dawn glow di belakang ring | Besar di tengah, "bernapas" pelan (membesar ±2% lalu kembali) |
| 2 | 33% | Wordmark memudar sambil naik | Naik sedikit dan mulai miring; kilau di permukaan ikut bergeser |
| 3 | 67% | Headline memudar | Berputar menghadap kamera; kilau di tepi mengikuti cahaya pagi |
| 4 | 100% | Kata "rhythm" mulai muncul samar | Kembali ke tengah, ukurannya sama dengan awal Section 02 |

### 02 · Why Stillway (Act 1 · 07:10 · Paper)
**Tujuan:** memberi alasan untuk peduli sebelum fitur muncul. Ring di tengah, teks bercerita di sekitarnya. Ini bukan halaman About us.
**Copy:**
- Kalimat utama: "Your body already keeps a rhythm." → "Most devices turn it into a score." → "Stillway just keeps the pattern."
- Paragraf kecil (draft): "Heart rate, temperature and sleep already move in a daily pattern." / "Scores, streaks and red alerts make rest feel like homework." / "No score to chase. Just what your days look like, kept quietly."

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Kata besar "rhythm" samar di belakang ring, label kecil "WHY STILLWAY" | Tengah, sudut 3/4 |
| 2 | 33% | Kalimat 1 besar di kiri, paragraf kecil di kanan (3 kolom, pola Oryzo) | Berputar pelan sedikit ke kiri |
| 3 | 67% | Kalimat 2 menggantikan kalimat 1; kalimat 1 jadi baris kecil redup | Berputar lebih jauh |
| 4 | 100% | "keeps the pattern." lebar penuh di belakang ring (pola Sofi), underline ochre | Hampir menghadap kamera, menutupi bagian tengah teks besar |

### 03 · Sleep summary (Act 2 · 23:10 · Night)
**Tujuan:** data pertama: ringkasan tidur semalam dalam satu layar. Isinya hanya ring + 3 angka. Tanpa HP, layar app, foto, atau grafik.
**Copy:** "Last night, in one view." [ SETTLED ] 23:10 · [ RESTED ] 7h 12m · [ BROKEN ] 2× (Simulated data).

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Layar gelap, jam navbar 23:10 | Di tengah; hanya tepinya yang terkena cahaya dingin dari satu sisi |
| 2 | 33% | SETTLED 23:10 muncul di kanan | Pindah ke kiri, berputar sangat pelan |
| 3 | 67% | RESTED 7h 12m muncul; angka pertama meredup | Tetap berputar pelan |
| 4 | 100% | BROKEN 2× muncul, lalu ketiga angka memudar menuju Section 04 | Menghadap kamera |

### 04 · Activity & rest (Act 2 · 07:40 → 15:30 · Night)
**Tujuan:** menunjukkan bahwa ritme bukan hanya tidur, ada saat bergerak dan beristirahat sepanjang hari. Mengikuti build yang sudah ada; yang diubah hanya peralihan masuk dan keluarnya.
**Copy:** "ACTIVITY and rest." + "Through the day the ring keeps two quiet tallies: the time you spend moving and the moments you stop. Seen together they show the rhythm of a day."

**Layout:**
- Kiri atas: judul + paragraf pendek.
- Tengah: filmstrip 5 foto. Foto aktif besar dalam bingkai putus-putus, foto lain kecil berjajar (pola Oryzo "So portable").
- Kiri bawah: jam besar, titik status, durasi, "Simulated data".
- Kanan bawah: daftar jam, jam yang aktif terang.

| State | Scroll | Foto aktif | Status (selain 09:00 masih draft, samakan dengan build) |
|---|---|---|---|
| 1 | 0% | 07:40 jalan | Moving · 15 min walk |
| 2 | 25% | 09:00 membaca + kopi | Resting · 40 min focus |
| 3 | 50% | 10:30 peregangan | Moving · 5 min stretch |
| 4 | 75% | 12:30 makan siang | Resting · 30 min lunch |
| 5 | 100% | 15:30 tangga | Moving · 20 min stairs → foto lain keluar ke kiri, bingkai memudar, foto menggelap ke Dusk |

- **Gerak:** setiap langkah scroll, strip bergeser ke kiri dan foto berikutnya masuk ke bingkai. Jam besar, status, daftar jam, dan jam navbar ikut berganti.
- **Ring:** hanya terlihat di jari pada foto.

### 05 · Daily insight (Act 2 · 17:30 · Dusk)
**Tujuan:** klimaks bagian data: semua yang dicatat ring muncul sebagai satu kartu sederhana di app.
**Copy:** "Everything it noticed. One calm view." Kartu app "LAST NIGHT · 7h 12m" + progress bar + "Simulated data".

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Background Dusk, judul di kiri bawah | Besar di kanan-tengah, muncul saat foto terakhir Section 04 memudar |
| 2 | 33% | Teks bergeser ke pinggir | Membesar; kilau di tepi bergerak |
| 3 | 67% | Kartu app muncul di dalam lubang ring | Memenuhi layar (kamera masuk ke lubang ring) |
| 4 | 100% | Kartu app terbaca penuh | Diam |

Kartu app dibuat sebagai UI asli (teks bisa dibaca dan dipilih), bukan gambar.

### 06 · Product details (Act 3 · 21:00 · Paper + alas Sand)
**Tujuan:** menjawab "seperti apa bentuk dan bahannya?" Ring dilihat seperti objek di tangan, bukan daftar spesifikasi. Background terang dari awal sampai akhir.
**Copy:** "Made to be forgotten." → "One quiet band" → "Softened edges" → "Then, it just fits."

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0 → 25% | Ring **menggelinding** dari kiri di atas alas, melambat, lalu berhenti di tile. Judul muncul di kiri | Berputar sesuai jarak tempuh supaya terlihat menggelinding, bukan meluncur. Sedikit lewat lalu bergoyang balik, kemudian diam menghadap kamera |
| 2 | 33% | Sisi samping, teks langkah 1 | Berputar ±90°, pantulan berubah mengikuti sudut |
| 3 | 67% | Dari tepi, teks langkah 2 | Miring 45°, pantulan memanjang di sisi |
| 4 | 100% | Foto **tangan tanpa background** (cut-out, satu jari terangkat) di kanan, "Then, it just fits." di kiri (pola Sofi / Sensiq) | Meluncur turun dari atas ujung jari ke pangkal jari, lalu menyatu dengan ring di foto |

**Urutan gelinding (blok detail di bawah strip):**

| Frame | Isi |
|---|---|
| 0% | Ring berdiri di alas, setengah terpotong di tepi kiri (lanjutan dari Section 05). Judul belum muncul |
| 8% | Ring bergerak ke kanan dan berputar searah jarum jam. Logo "Stillway" ikut berputar, bayangan di alas ikut bergeser |
| 16% | Ring melambat; judul mulai muncul |
| 22% | Ring sedikit lewat dari titik berhenti, lalu bergoyang balik seperti benda asli |
| 25% | Ring diam menghadap kamera, logo di atas |

- **Scroll:** gerak mengikuti scroll, jadi user bisa maju-mundur.
- **Jarak gelinding:** ±55% lebar layar di desktop, ±40% di mobile.
- **Reduced motion:** ring langsung tampil diam di posisi akhir.
- **Tidak ada di section ini:** memutar ring sendiri (ada di Section 10) dan pembahasan sensor (ada di Section 08).

### 07 · Specs & benefits (Act 3 · 21:00 · Sand → foto full-bleed)
**Tujuan:** menjawab "cocok untukku?" lewat empat momen sehari-hari yang disajikan seperti koleksi kartu (pola Obsidian Assembly). Angka bertanda `*`.
**Copy:**
- "Through the day."
- (I) Night "Sleeps with you. Charges while you don't."
- (II) Desk "Sized to forget."
- (III) Move "Light enough to lose track of."
- (IV) Rinse "Hands in water. Ring stays on."
- Penutup: "The Everyday — Ring shown where it's worn."

| State | Scroll | Isi |
|---|---|---|
| 1 | 0% | "Through the day" besar di tengah + label pill "MADE FOR EVERY HOUR" |
| 2 | 25% | Teks terbelah ("Through" ke kiri, "the day" ke kanan); 4 kartu foto masuk dari bawah |
| 3 | 50% | (I) Night · 1/4: kartu membesar ke tengah, counter dengan progress lingkaran, garis orbit, panel mini baterai (bisa digeser per hari) |
| 4 | 75% | 2/4 Desk (slider ukuran) → 3/4 Move (bar berat ~4 g*) → 4/4 Rinse (rating air) |
| 5 | 100% | Kartu mengecil, foto lingkungan di belakangnya membesar jadi full-bleed, "The Everyday" |

Ring hanya terlihat di foto kartu.

### 08 · Features (Act 3 · 21:00 · Night)
**Tujuan:** satu fitur saja: lampu sensor yang warnanya mengikuti waktu. Semuanya lewat scroll, tanpa chip, hotspot, atau klik. Bentuk ring sudah dibahas di Section 06, baterai di Section 07, dan app ada di Section 09.

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | "Inside the ring.", jendela sensor menyala hijau samar sebagai petunjuk | Di tengah, melayang pelan |
| 2 | 50% | "One light, tuned to the task.", lampu **hijau** (Heart rate), legenda 3 warna (label, bukan tombol), tag [ SENSOR · LAMPU ] | Kamera dekat ke jendela sensor (ring besar di kanan, sudut 3/4), lalu diam |
| 3 | 100% | "Blue at night. Violet by morning.", lampu **biru** (±75%) lalu **ungu** (100%), satu baris kecil "Red means it's off." | Posisi sama, hanya warna lampu yang berubah |

**Detail lampu (blok di bawah strip):**
- **Panel:** 3 panel besar sama persis dengan strip: 50% hijau · ±75% biru · 100% ungu.
- **Off (merah):** tidak dijadikan state atau panel. Cukup satu baris copy; detailnya ada di FAQ Section 11.
- **Rentang warna:** hijau penuh 25–50%, berganti ke biru 50–75%, berganti ke ungu 75–100%.
- **Tampilan lampu:**
  - Lampu bercahaya lembut dengan flare tipis (seperti screenshot dari klien).
  - Cahayanya memantul ke permukaan dalam ring.
  - Hanya lampu yang bersinar; bagian lain ring tetap normal.
- **Opsional di desktop:** label legenda bisa diklik untuk lompat ke posisi warna itu. Tidak wajib.
- **Klaim:** biru dan ungu adalah lampu status mode, bukan klaim sensor. Copy tidak boleh menulis "biru mengukur oksigen". Perlu konfirmasi tim hardware.

### 09 · The app (Act 3 · 21:00 · Paper)
**Tujuan:** lanjutan langsung dari Section 08. Tiap warna lampu dibaca ulang di app, dengan urutan yang sama; satu state = satu fitur utama, tanpa layar ringkasan umum.
**Layout (pola Sofi):**
- Tanpa ring.
- HP di tengah dan tidak bergerak.
- Deskripsi pendek di kiri atas dan kanan bawah.
- Chip warna lampu di atas deskripsi kiri.
- Footer: label aktif di kiri, "scroll down" + progress + persen di kanan.

| State | Scroll | Lampu | Layar app | Kiri | Kanan |
|---|---|---|---|---|---|
| 1 | 0% | ● Hijau | Heart rate: 58 bpm resting, grafik 24 jam, puncak 82 bpm di tangga 15:30 | "The green light, read back. Your heart rate through the day, at a glance." | "Resting 58 bpm. Peak on the stairs, 15:30." |
| 2 | 50% | ● Biru | Sleep: "Settled 23:10 · up 06:22", tahap tidur, Deep / REM / Light | "The blue light, read back. Your night, in order: when you settled, how deep you went." | "Deep, REM and light sleep, measured minute by minute." |
| 3 | 100% | ● Ungu | Recovery: HRV 7 hari (hari ini paling terang) + Readiness 82 · "An easy day ahead." | "The violet light, read back. One number tells you how the night paid off." | "HRV across the week, with today in full colour." |

- **Gerak:** yang bergerak hanya isi layar app (bergeser ke atas mengikuti scroll halaman). HP diam, dan tidak ada scroll terpisah di dalam HP.
- **Kartu aktif:** diberi outline ochre.
- **Chip dan deskripsi:** berganti pelan (crossfade) di setiap state.
- **Layar app:** dibuat sebagai UI asli, bukan gambar.

### 10 · Finishes & pricing (Act 4 · 22:00 · Sand)
**Tujuan:** setelah paham, baru memilih. Satu panel menjawab semua pertanyaan beli: finish, ukuran, isi box, harga.
**Copy:**
- "Turn it yourself." → "Find your size and finish."
- Finish: Silver / Black / Gold.
- Harga: "$299*" · "No required subscription."
- "In the box: the ring, a charging dock, and a sizing kit."
- Satu tombol utama.

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | Panel pilihan di kanan, finish default Silver | User bisa memutar ring 360° (drag mouse / swipe). Hanya berputar, tanpa zoom. Tombol ‹ › untuk lompat ke sudut tertentu. Kembali ke pose awal kalau dibiarkan beberapa detik |
| 2 | 33% | User memilih Black | Bahan ring ikut berganti (warna + kilap), bukan hanya warnanya |
| 3 | 67% | User memilih Gold; pencahayaan berganti ke Lamp light, panel ikut menghangat | Pantulan ring jadi lebih hangat |
| 4 | 100% | Ukuran, isi box, harga + satu tombol utama | Diam di finish yang dipilih |

### 11 · Closing, FAQ & footer (Act 4 · 06:50 besok · Night + Ember glow)
**Tujuan:** penutup dalam satu background gelap yang tidak terputus, dari kalimat penutup sampai footer (pola oryzo.ai). Jam kembali ke 06:50, sama seperti Hero.
**Copy:**
- "Tomorrow morning, see your night."
- CTA: "Find your size and finish →" + "No subscription · Free sizing kit · 30-night trial".
- FAQ: "Questions, briefly." (Sizing, Compatibility, Battery, Returns).
- Pernyataan: "Sleep on it. Stillway keeps the pattern."
- Disclaimer: "Stillway is a concept project and is not for sale."

| State | Scroll | Isi | Ring |
|---|---|---|---|
| 1 | 0% | "TOMORROW MORNING," kecil + "see your night." besar di depan ring | Di tengah, di belakang teks |
| 2 | 33% | Satu tombol + satu baris kecil | Mengecil, tetap di tengah |
| 3 | 67% | FAQ satu kolom sempit (accordion), tanpa panel putih; tombol diulang di bawah | Keluar ke atas bersama glow |
| 4 | 100% | Kalimat caps + footer + logo lockup selebar layar (sedikit terpotong) | Hanya sebagai ring mark di logo |

**Hover pada logo footer:**
- **Gerak:** satu garis kilap putih-hangat menyapu dari kiri ke kanan, sama seperti kilau di tepi ring.
- **Warna:** krem #E9DCC8 → putih → amber #F4C98E → krem.
- **Waktu:** miring ±20°, ±0,9 detik, sekali per hover.
- **Ring mark:** ikut berkilau, mulai sedikit lebih awal.
- **Touch device:** kilau diputar sekali saat logo terlihat.
- **Reduced motion:** logo cukup sedikit lebih terang saat di-hover.

---

## 3. Sambungan antar section

Di Figma, tiap sambungan punya kartu **Transisi** (akhir, awal, background/jam, gerak ring) dan kartu **Sambungan** (frame akhir → langkah → frame awal).

| Sambungan | Awal (0–30%) | Tengah (30–70%) | Akhir (70–100%) |
|---|---|---|---|
| 01 → 02 | Sudah sama: ring di tengah, ukuran sama | Dawn glow memudar ke Paper | Jam 06:50 → 07:10 |
| 02 → 03 | Teks besar dan kalimat kecil memudar | Paper → Night; ring tetap di tengah dan sedikit membesar; cahaya hanya tersisa di tepi ring | Jam 07:10 → 23:10 |
| 03 → 04 | Tiga angka memudar | Ring mengecil dan memudar di kiri; background tetap Night | Judul + filmstrip masuk, foto 07:40 aktif; jam 23:10 → 07:40 |
| 04 → 05 | Bingkai, jam besar, status, daftar jam memudar | Foto 15:30 menggelap; Dusk naik dari bawah | Ring muncul di kanan-tengah; jam 15:30 → 17:30 |
| 05 → 06 | Kartu app memudar | Kamera mundur dari dalam ring; ring mengecil dan turun ke alas di kiri; Dusk → Paper, alas Sand muncul | Ring berdiri di alas (= frame pertama Section 06), langsung menggelinding; jam 17:30 → 21:00 |
| 06 → 07 | Foto tangan mengecil jadi kartu, sudutnya membulat | Paper → Sand; kartu memudar | "Through the day" muncul; kartu yang sama kembali sebagai kartu Night |
| 07 → 08 | Foto full-bleed menggelap; "The Everyday" memudar | Ring di kartu berganti jadi ring utama di posisi yang sama, sedikit membesar | "Inside the ring." + lampu hijau samar |
| 08 → 09 | Judul memudar; lampu ungu meredup lalu menyala hijau sesaat (urutan mulai lagi dari hijau) | Ring mengecil dan keluar ke atas; Night → Paper; HP naik ke tengah dengan layar Heart rate | Chip hijau, deskripsi, footer muncul |
| 09 → 10 | Isi layar HP dan deskripsi memudar; HP bergeser ke kanan dan melebar jadi panel | Paper → Sand; ring muncul di kiri, tile di belakangnya | Isi panel muncul; jam 21:00 → 22:00 |
| 10 → 11 | Panel keluar ke kanan | Ring dengan finish pilihan pindah ke tengah; Sand → Night + Ember glow | "TOMORROW MORNING, see your night." muncul; jam 22:00 → 06:50 |

---

## 4. Aset yang dibutuhkan

| Section | Aset | Status |
|---|---|---|
| 01, 02, 03, 05, 06, 08, 10, 11 | Ring yang sama: perak, tepi chamfer, bagian dalam hitam matte, 2 pad oval, jendela sensor (lampu bisa berganti warna), logo "Stillway" kecil tone-on-tone di sisi luar | Wajib |
| 04 | 5 foto momen (07:40, 09:00, 10:30, 12:30, 15:30) | Sudah ada di build; cek ring di foto sama dengan ring acuan + logo |
| 06 | Foto tangan **tanpa ring dan tanpa background** (cut-out di latar krem #F7F5F0, satu jari terangkat) | Baru |
| 07 | 4 foto kartu potret (Night, Desk, Move, Rinse) + 1 foto lingkungan full-bleed, ring di jari dengan logo | Baru |
| 08 | Tidak ada foto; referensi 3 warna lampu ada di Figma | — |
| 09 | Tidak ada foto; layar app dibuat sebagai UI | — |
| 10 | Ring dalam 3 finish: Silver / Black / Gold (bentuk dan logo sama) | Wajib |
| 11 | Tidak ada foto | — |

**Prompt foto tangan (Section 06):** "A relaxed hand cut out on a plain warm cream backdrop (#F7F5F0), one finger raised and slightly apart from the others, no ring, no props, no room, soft even studio light, photoreal skin, generous empty space on the left, no text."

Setiap foto yang memperlihatkan ring harus memakai bentuk ring acuan dan logo yang sama. Hanya finish yang boleh berbeda, dan itu hanya di Section 10.

---

## 5. Feedback, analisa & audit (Storyboard 1)

### Respons atas feedback review (Bubbles, 17 Nov)

| # | Feedback | Respons |
|---|---|---|
| 01 | Belum full storytelling | Ring jadi satu tokoh di 11 section; setiap section terhubung lewat Transisi + Sambungan |
| 02 | Gerak ring tidak realistis | Ring harus terlihat seperti benda nyata: pantulan dan cahaya ikut berubah saat bergerak. Foto datar yang hanya digeser tidak dipakai |
| 03 | Aset masih dummy, terasa monoton | Setiap section punya suhu cahaya dan komposisi sendiri; daftar aset di §4 |
| 04 | Tampilan belum menyatu | Satu palet (5 warna), satu keluarga huruf (Geist), satu logo dari navbar sampai footer, satu gaya gerak |
| 05 | Belum setara referensi | Ring yang realistis, transisi tanpa potongan, satu sistem visual; referensi per section di `Moodboard.md` §6 |

### Analisa 3 referensi utama
- **Aevion / Riotters** (drone.riotters.com):
  - Diambil: produk yang sama di semua bab, kalimat yang menyala per baris, judul besar + satu fakta [ TAG ].
  - Tidak diambil: gaya blueprint industrial.
- **Oryzo / Lusion** (oryzo.ai):
  - Diambil: ruang gelap yang mengisolasi produk, produk berputar mengikuti scroll, teks mengapit produk, penutup + footer di satu background.
  - Tidak diambil: humor satir.
- **VITURE Mobile Dock Mini:**
  - Diambil: satu ide per layar, satu angka besar, konteks pemakaian manusia.
  - Tidak diambil: palet gaming.

### Audit section lama → baru

| Section lama | Keputusan | Jadi |
|---|---|---|
| Navigation | Ringkas | Tetap tampil di semua section + jam waktu-hari |
| Hero | Ambil | 01 Hero |
| Three Pillars | Gabung | Dipecah jadi 03 Sleep, 04 Activity & rest, 05 Daily insight |
| Product & Finish | Geser | 10 Finishes & pricing |
| App Insight | Ambil | 05 Daily insight |
| Size & Package | Gabung | Panel di 10 |
| Material Detail | Ambil | 06 Product details (gelinding → samping → tepi → tangan) |
| Details & FAQ | Ringkas | FAQ di 11 |
| Final CTA | Ambil | 11, kembali ke 06:50 |
| Footer | Ringkas | Bagian dari 11 + logo lockup dengan kilau saat hover |

**Section baru tanpa padanan lama:** 02 Why Stillway, 07 Specs & benefits, 08 Features (lampu sensor), 09 The app.
**Dibuang atau diredam:**
- Banner promosi.
- Gerak berlebihan di luar ring.
- Teks panjang.
- Foto yang berulang.
- Kartu fitur sejajar ala dashboard.
- Panel putih terpisah di penutup.

---

## 6. Masih perlu diputuskan

1. **Spesifikasi resmi:** baterai, rating air, berat, ukuran, harga ($299*), dan kompatibilitas.
2. **Lampu sensor:** fungsi tiap warna perlu dikonfirmasi tim hardware (biru/ungu sebagai lampu status mode).
3. **Logo di produk:** konfirmasi logo "Stillway" di ring ke klien sebelum semua aset dibuat ulang.
4. **Versi mobile:** dari section yang di-pin (02–10), mana yang tetap bergerak mengikuti scroll dan mana yang jadi tumpukan statis. Memutar ring di Section 10 menjadi swipe.
5. **Section 04:** status dan durasi selain 09:00 perlu disamakan dengan copy di build.
6. **Section 06 di jam 21:00:** background terang di malam hari; cek apakah terasa janggal setelah dibuild.
7. **Angka app** (Section 05, 09): masih contoh; tunggu data resmi produk.
8. **Referensi Horizon dari Fanny:** link belum ada.

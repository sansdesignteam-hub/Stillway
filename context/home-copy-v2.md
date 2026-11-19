# Stillway — Home copy V2

Versi: draf 1 · 19 November 2026 · Strategy Director
Status seluruh dokumen: **DRAF, belum disetujui.** Setiap blok di bawah berstatus draf sampai pengguna menyetujuinya; keputusan dicatat di `decisions.md` oleh Claude Code di main, bukan di sini.

Sumber: `context/Visual Directions V2/Storyboard.md` (REV 3), `Moodboard.md`, Figma "Website AI - 1 Ring" Storyboard 2 (node `40004036:51`, teks dibaca 19 Nov 2026 dan sama dengan Storyboard.md), copy V1 di `context/home-copy.md` dan `web/src/content/home.ts`. Keputusan acuan: D-002, D-004, D-005, D-014, D-015, D-021, D-022, D-059, D-060.

## Cara membaca

- Semua copy yang tampil di website berbahasa Inggris (D-021). Catatan internal berbahasa Indonesia.
- Kolom/tanda **Asal**:
  - `V1` = dipakai ulang dari build V1 (`web/src/content/home.ts`) atau `home-copy.md`, tanpa perubahan.
  - `V1~` = dari V1 dengan penyesuaian kecil.
  - `SB` = dari Storyboard/Figma V2 apa adanya.
  - `SB~` = dari Storyboard V2, disunting Strategy Director (alasan di catatan).
  - `NEW` = copy baru dari Strategy Director.
- `*` atau label **Simulated data** / **Illustrative** = angka rekaan, bukan spesifikasi atau data produk. Aturan: setiap angka produk (spesifikasi, harga) diberi `*` dan keterangan "Illustrative"; setiap angka app/tubuh berada di dekat label "Simulated data".
- **Batas klaim:** tidak ada diagnosis, akurasi, manfaat kesehatan, atau janji hasil. Ring "notes", "keeps", "shows"; tidak "measures precisely", "improves", atau "tells you what to fix". Nada: "A picture of the day, not a verdict on it."
- Copy yang membutuhkan keputusan pengguna diberi tanda **[Q-n]**, merujuk ke daftar pertanyaan di akhir.

## 0 · Global

### Navbar (tampil di semua section) — draf

| Elemen | Copy | Asal |
| --- | --- | --- |
| Logo | Ring mark + `Stillway` | SB (Moodboard §4) |
| Link | `Rhythm` · `The ring` · `The app` · `Finishes` · `FAQ` | V1~ (tambah `The app` untuk Section 09) |
| CTA | `Find your size` → anchor ke Section 10 | NEW (menyatu dengan CTA penutup V2; V1 memakai `Explore Stillway`) [Q-6] |
| Menu mobile | `Menu` / `Close` | V1 |

Target anchor usulan: Rhythm → 03, The ring → 06, The app → 09, Finishes → 10, FAQ → 11.

### Jam navbar — draf

Format: `HH:MM · Daypart`. Daypart mengikuti tabel V1 (`Morning` 05–12, `Midday` 12–14, `Afternoon` 14–18, `Evening` 18–21, `Night` 21–05). Asal: V1 (dayparts) + SB (jam).

| Section | Jam tampil | Catatan |
| --- | --- | --- |
| 01 Hero | `06:50 · Morning` | |
| 02 Why Stillway | `07:10 · Morning` | |
| 03 Sleep summary | `23:10 · Last night` | NEW: label `Last night` menggantikan `Night` agar kilas balik tidak terbaca sebagai malam hari ini |
| 04 Activity & rest | `07:40` → `09:00` → `10:30` → `12:30 · Midday` → `15:30 · Afternoon` | ikut foto aktif |
| 05 Daily insight | `17:30 · Afternoon` | |
| 06–09 | `21:00 · Night` | jam diam selama empat section; disengaja di Storyboard |
| 10 Finishes & pricing | `22:00 · Night` | |
| 11 Closing | `06:50 · Tomorrow` | NEW: `Tomorrow` menandai hari berikutnya, sama dengan jam Hero |

Aksesibilitas: jam bersifat dekoratif (`aria-hidden`), tidak dibacakan pada setiap perubahan.

### Label simulasi dan concept project — draf

| Elemen | Copy | Asal |
| --- | --- | --- |
| Label data app/tubuh | `Simulated data` | V1 |
| Keterangan spesifikasi | `*Illustrative. Stillway is a concept, so specs are not final.` | NEW |
| Catatan concept (Section 10 dan footer) | `Stillway is a concept project and is not for sale.` | V1 (= SB) |

---

## Act 1 · Hook

### 01 · Hero — 06:50 · Paper + Dawn glow — draf

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Wordmark latar: `Stillway` · Eyebrow: `Meet Stillway` · Headline: `Understand your rhythm.` · Sub: `A smart ring that brings your sleep, activity, and rest into one everyday view.` · Link: `Explore Stillway` | V1 (headline = copy kerja D-014; sub dan link V1 home-copy.md) |
| 2 · 33% | (wordmark memudar; tanpa copy baru) | — |
| 3 · 67% | (headline memudar) | — |
| 4 · 100% | Kata latar `rhythm` mulai muncul (milik Section 02) | SB |

Microcopy: petunjuk scroll `Scroll down` (V1). Baris paket V1 (`$299 · Charger and sizing kit included · No required subscription`) **tidak** dipakai di Hero karena Storyboard: "belum jualan". Muncul kembali di Section 10.
Alt ring: `The silver Stillway ring, standing upright in soft morning light.` (NEW)

### 02 · Why Stillway — 07:10 · Paper — draf (section baru)

Tujuan pesan: alasan peduli sebelum fitur. Kontras dengan kompetitor yang berbasis skor, tanpa menyebut merek lain.

| State | Besar (kiri) | Kecil (kanan) | Asal |
| --- | --- | --- | --- |
| 1 · 0% | Label: `WHY STILLWAY` · kata latar `rhythm` | — | SB |
| 2 · 33% | `Your body already keeps a rhythm.` | `Sleep, heart rate and temperature already move in a daily pattern, whether you look or not.` | SB~ (urutan "Heart rate, temperature and sleep" dibalik agar tidur di depan, sesuai pilar; tambahan klausa penutup) |
| 3 · 67% | `Most devices turn it into a score.` | `Scores, streaks and red alerts can make rest feel like homework.` | SB~ ("make" → "can make" agar tidak terbaca sebagai klaim faktual tentang produk lain) |
| 4 · 100% | `Stillway just keeps the pattern.` · teks lebar: `keeps the pattern.` | `No score to chase. Just what your days look like, kept quietly.` | SB |

Catatan: "No score to chase" bertentangan dengan `Readiness 82` di Section 09 Storyboard. Copy 09 di bawah sudah disesuaikan; lihat [Q-3].

---

## Act 2 · Rhythm

### 03 · Sleep summary — 23:10 · Night — draf

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Kicker: `Last night` · (layar gelap) | NEW |
| 2 · 33% | Headline: `Last night, in one view.` · Angka 1: `[ SETTLED ] 23:10` | V1 (headline) + SB |
| 3 · 67% | Angka 2: `[ RESTED ] 7h 12m` | SB |
| 4 · 100% | Angka 3: `[ BROKEN ] 2×` · baris kecil: `A picture of the night, not a verdict on it.` · `Simulated data` | SB + V1~ (kalimat penutup diambil dari body V1 Sleep) |

Konsistensi data (semua Simulated): settled 23:10, up 06:22, rested 7h 12m, broken 2×. Angka yang sama dipakai lagi di 05 dan 09. Data V1 (6 h 58 m) tidak dipakai di V2.
Aksesibilitas: label kurung dibaca sebagai "Settled at 23:10", "Rested 7 hours 12 minutes", "Broken twice".

### 04 · Activity & rest — 07:40 → 15:30 · Night — draf

| Elemen | Copy | Asal |
| --- | --- | --- |
| Judul | `Activity and rest.` (tampilan: `ACTIVITY` caps + `and rest.`) | V1 / SB |
| Body | `Through the day the ring keeps two quiet tallies: the time you spend moving and the moments you stop. Seen together they show the rhythm of a day.` | V1 |
| Label | `Simulated data` | V1 |

Status per state. **[Q-4]** Storyboard dan build V1 berbeda pada tiga momen; usulan Strategy Director ada di kolom terakhir.

| State | Jam | Storyboard V2 | Build V1 | Usulan V2 |
| --- | --- | --- | --- | --- |
| 1 · 0% | 07:40 | Moving · 15 min walk | Moving · 25 min walk | `Moving · 25 min walk` (ikut build) |
| 2 · 25% | 09:00 | Resting · 40 min focus | Resting · 40 min focus | `Resting · 40 min focus` (sama) |
| 3 · 50% | 10:30 | Moving · 5 min stretch | Moving · 15 min stretch | `Moving · 15 min stretch` (ikut build) |
| 4 · 75% | 12:30 | Resting · 30 min lunch | Resting · 30 min lunch | `Resting · 30 min lunch` (sama) |
| 5 · 100% | 15:30 | Moving · 20 min stairs | Moving · 20 min stairs and errands | `Moving · 20 min stairs` (ikut Storyboard; lebih pendek dan cocok dengan puncak heart rate "on the stairs, 15:30" di Section 09) |

Alasan: Storyboard sendiri meminta status selain 09:00 "disamakan dengan build", kecuali 15:30 yang dipersingkat agar sinkron dengan Section 09.
Alt foto (NEW, karakter C-02 sesuai D-058): `07:40 — A man walking outside in early light, the ring on his left index finger.` · `09:00 — Reading with a coffee at a desk, the ring in view.` · `10:30 — A short stretch beside the desk.` · `12:30 — Lunch at a table, the ring resting on the hand.` · `15:30 — Taking the stairs on an errand.` (Visual Director/Developer perlu menyesuaikan dengan foto akhir.)

### 05 · Daily insight — 17:30 · Dusk — draf

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Headline: `Everything it noticed.` | SB |
| 2 · 33% | Headline lengkap: `Everything it noticed. One calm view.` | SB |
| 3 · 67% | Kartu app muncul (lihat di bawah) | SB |
| 4 · 100% | Body (opsional, di pinggir): `In the evening the app gathers the day into one view you can read and put down. It describes what happened. It does not tell you what to fix.` | V1~ (dari body "One line a day") |

Kartu app (UI HTML, semua Simulated):
- `LAST NIGHT` · `7h 12m` · progress bar (rested terhadap target tidur pribadi; tanpa label persen)
- Baris kecil: `Settled 23:10 · Up 06:22`
- Baris insight: `You took more short pauses this afternoon than on most weekdays.` (V1)
- `Simulated data`

---

## Act 3 · Object

### 06 · Product details — 21:00 · Paper + Sand — draf

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0–25% | Headline: `Made to be forgotten.` | V1 / SB |
| 2 · 33% | `One quiet band` — `A single band with nothing raised on its surface to catch on a sleeve or a keyboard. There is no front to remember and no wrong way to put it on.` | V1~ (diringkas dari dua paragraf V1; V2 menolak teks panjang) |
| 3 · 67% | `Softened edges` — `Both edges are bevelled where they meet the finger, so the ring sits easily at night and slides on without catching.` | V1~ (diringkas) |
| 4 · 100% | `Then, it just fits.` — `Slip it on in the morning and stop thinking about it.` | SB (judul) + NEW (body) |

Langkah "Sensors on the inside" dari V1 tidak dipakai di sini; sensor dibahas di 08 (sesuai Storyboard).
Alt: `The Stillway ring rolling to a stop on a sand-coloured tile.` · `A hand on a plain cream background, the ring settling at the base of one raised finger.` (NEW)

### 07 · Specs & benefits — 21:00 · Sand → full-bleed — draf (section baru)

Angka spesifikasi semuanya rekaan dan menunggu [Q-1]. Nilai di bawah adalah placeholder ilustratif dengan `*`; tidak boleh tampil tanpa catatan kaki `*Illustrative…` (lihat §0).

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Headline: `Through the day.` · Pill: `MADE FOR EVERY HOUR` | SB |
| 2 · 25% | Headline terbelah `Through` / `the day.` · 4 kartu: `(I) Night` · `(II) Desk` · `(III) Move` · `(IV) Rinse` | SB |
| 3 · 50% | Kartu 1/4 lihat tabel kartu | SB + NEW |
| 4 · 75% | Kartu 2/4 → 3/4 → 4/4 | SB + NEW |
| 5 · 100% | `The Everyday` · caption `Ring shown where it's worn.` | SB |

Isi kartu:

| Kartu | Judul | Tag | Fakta (ilustratif) | Kontrol | Asal |
| --- | --- | --- | --- | --- | --- |
| (I) Night · 1/4 | `Sleeps with you. Charges while you don't.` | `[ BATTERY ]` | `Up to 7 days* on a charge. Top up on the dock while you shower.` | Panel mini: `Mon`…`Sun` + sisa baterai per hari, label `Simulated data` | SB (judul) + NEW |
| (II) Desk · 2/4 | `Sized to forget.` | `[ SIZE ]` | `Sizes 6–13*. Try them on with the sizing kit before you choose.` | Slider ukuran: `Size 9*` | SB + NEW |
| (III) Move · 3/4 | `Light enough to lose track of.` | `[ WEIGHT · THICKNESS ]` | `About 4 g*, 2.6 mm* thin.` | Bar berat: `4 g*` | SB (judul, 4 g) + NEW |
| (IV) Rinse · 4/4 | `Hands in water. Ring stays on.` | `[ WATER RATING ]` | `Water resistant to 100 m*. Washing up, rain, a swim.` | Rating: `100 m*` | SB + NEW |

Catatan:
- Tag Storyboard berbahasa Indonesia (`[ UKURAN ]`, `[ BERAT · TEBAL ]`, `[ BATERAI ]`, `[ RATING AIR ]`) diterjemahkan karena D-021.
- 7 hari, ukuran 6–13, 2,6 mm, dan 100 m adalah angka placeholder Strategy Director, lazim di kategori smart ring, bukan klaim produk. Ganti dengan keputusan [Q-1]. Jika pengguna ingin menghindari angka sama sekali, setiap kartu bisa hanya memakai judul dan tag.
- Kartu Night tidak boleh menyiratkan tidur lebih baik. "Sleeps with you" berarti dipakai saat tidur.

### 08 · Features: sensor light — 21:00 · Night — draf (section baru)

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Headline: `Inside the ring.` · sub: `One small window, facing your skin.` | SB + NEW |
| 2 · 50% | Headline: `One light, tuned to the task.` · Tag: `[ SENSOR · LIGHT ]` · Legenda: `● Green · Heart rate` `● Blue · Sleep` `● Violet · Recovery` | SB~ (tag `LAMPU` → `LIGHT`) |
| 3 · 100% | Headline: `Blue at night. Violet by morning.` · baris kecil: `Red means it's off.` | SB |

Body per warna (muncul kecil di dekat legenda, crossfade mengikuti warna aktif):
- Green: `By day, a green light while the ring follows your heart rate.` (NEW)
- Blue: `At night it dims to blue while the ring keeps track of your sleep.` (NEW)
- Violet: `By morning it turns violet as the night is put together.` (NEW)

Batas klaim (wajib):
- Biru dan ungu adalah **lampu status mode**, bukan panjang gelombang sensor. Copy tidak boleh menyebut biru/ungu mengukur sesuatu (mis. oksigen). Copy di atas hanya mengaitkan warna dengan mode/waktu.
- Catatan Figma panel lampu ("Ring menghitung HRV dan skor pulih", "membaca detak jantung dan langkah") adalah catatan internal, bukan copy publik. Jangan dipindahkan ke website.
- Menunggu konfirmasi fungsi warna (Storyboard §6 butir 2, bukan bagian tugas ini tetapi memengaruhi copy).

### 09 · The app — 21:00 · Paper — draf (section baru)

Tanpa ring. HP diam di tengah; isi layar ikut scroll. Semua angka layar app **Simulated data** dan menunggu [Q-2].

| State | Chip | Kiri atas | Kanan bawah | Footer aktif | Asal |
| --- | --- | --- | --- | --- | --- |
| 1 · 0% | `● GREEN LIGHT · HEART RATE` | `The green light, read back. Your heart rate through the day, at a glance.` | `Resting 58 bpm. Peak on the stairs, 15:30.` | `Heart rate` | SB |
| 2 · 50% | `● BLUE LIGHT · SLEEP` | `The blue light, read back. Your night, in order: when you settled, how deep you went.` | `Deep, light and REM sleep, laid out across the night.` | `Sleep` | SB~ (lihat catatan) |
| 3 · 100% | `● VIOLET LIGHT · RECOVERY` | `The violet light, read back. How the night sat against the rest of your week.` | `HRV across the week, with today in full colour.` | `Recovery` | SB~ (lihat catatan) |

Footer kanan: `Scroll down` · progress · `33%` / `66%` / `100%`. Label tetap: `Simulated data` di bawah HP.

Isi layar app (UI HTML):
- Heart rate: `Resting` `58 bpm` · grafik `00:00–24:00` · anotasi `Peak 82 bpm · 15:30 stairs`.
- Sleep: `Settled 23:10 · Up 06:22` · `7h 12m` · tahap `Deep` `REM` `Light` (durasi per tahap, tanpa skor).
- Recovery: HRV 7 hari `Mon`–`Sun`, hari ini paling terang · baris `Steady day, calm evening.` (SB) · `Readiness 82 · An easy day ahead.` **[Q-3]**

Catatan suntingan:
- "measured minute by minute" (SB) diganti karena menyiratkan presisi/akurasi klinis.
- "One number tells you how the night paid off" (SB) diganti karena bertentangan dengan pesan Section 02 ("Most devices turn it into a score… No score to chase") dan menyiratkan penilaian. Jika pengguna mempertahankan Readiness 82, kalimat kiri bisa kembali ke versi SB, tetapi Section 02 perlu ditulis ulang. Lihat [Q-3].
- "Recovery" dan "HRV" boleh tampil sebagai nama fitur app; jangan ditambah janji ("helps you recover").

---

## Act 4 · Choice

### 10 · Finishes & pricing — 22:00 · Sand — draf

Paket mengikuti D-015 (disetujui): $299, tanpa langganan wajib, Silver/Black/Gold harga sama, dock pengisi daya dan sizing kit termasuk.

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Headline: `Turn it yourself.` · hint: `Drag to turn` (mobile: `Swipe to turn`) · tombol `‹` `›` (aria: `Previous angle` / `Next angle`) · Finish default `Silver` | SB + NEW (hint, aria) |
| 2 · 33% | Finish: `Black` | SB |
| 3 · 67% | Finish: `Gold` · toggle cahaya `Daylight` / `Lamp light` | SB + V1 |
| 4 · 100% | Headline: `Find your size and finish.` · lihat panel | SB |

Panel:
- Legend: `Finish` — `Silver` · `Black` · `Gold` (V1)
- `Size` — `Not sure? A sizing kit comes first, so you can try before you settle.` (NEW, sesuai D-015) · pilihan ukuran `6*`–`13*` [Q-1]
- Harga: `$299*` · `Every finish, same price. No required subscription.` (V1~ ; `*` mengikuti Storyboard — catatan: harga sudah disetujui sebagai harga konsep D-015, jadi `*` di sini berarti "concept price", bukan nilai yang belum diputuskan)
- `In the box: the ring, a charging dock, and a sizing kit.` (SB = V1)
- Tombol utama: `Choose {finish} · $299` → **[Q-6]** (checkout di luar lingkup D-022)
- Catatan: `Stillway is a concept project and is not for sale.` (V1)

### 11 · Closing, FAQ & footer — 06:50 tomorrow · Night + Ember glow — draf

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Kicker caps: `TOMORROW MORNING,` · besar: `see your night.` | SB |
| 2 · 33% | Tombol: `Find your size and finish →` · baris mono: `No required subscription · Sizing kit included` | SB~ (lihat catatan) [Q-5] |
| 3 · 67% | FAQ (di bawah) · tombol diulang | SB |
| 4 · 100% | Pernyataan caps: `SLEEP ON IT. STILLWAY KEEPS THE PATTERN.` · footer | SB |

Catatan baris mono: Storyboard menulis `No subscription · Free sizing kit · 30-night trial`. Disunting karena (a) D-015 menyebut "no required subscription", bukan "no subscription"; (b) "Free" tersirat dari "included" dan lebih aman; (c) **30-night trial** adalah kebijakan retur yang belum diputuskan (decisions.md, hal terbuka 2). Jika pengguna menyetujui trial, baris kembali menjadi `No required subscription · Sizing kit included · 30-night trial*`.

**FAQ — `Questions, briefly.`** (SB; 4 topik Storyboard + 2 wajib dari V1, format accordion)

| # | Pertanyaan | Jawaban | Asal |
| --- | --- | --- | --- |
| 1 · Sizing | `How do I find my size?` | `A sizing kit comes in the box. Wear a sample size for a day and a night, then choose the size that feels right.` | V1~ |
| 2 · Compatibility | `Does it work with my phone?` | `The Stillway app is planned for iPhone and Android.*` | NEW [Q-1] |
| 3 · Battery | `How long does the battery last, and how do I turn it off?` | `Up to 7 days* on a charge, and it tops up on the dock. To switch it off, hold it on the dock until the light turns red.*` | NEW [Q-1] (Storyboard: cara mematikan ring dijelaskan di FAQ; mekanisme belum ada, jadi ini placeholder) |
| 4 · Returns | `Can I return it?` | `Returns details are still being decided.` — **jangan tampil sebelum [Q-5] dijawab** | NEW [Q-5] |
| 5 · Subscription | `Is there a subscription?` | `No. The $299 price includes the ring and the companion app. There is no required subscription.` | V1 |
| 6 · Medical | `Is Stillway a medical device?` | `No. Stillway shows patterns in your sleep, activity, and rest. It does not diagnose, treat, or prevent any condition.` | V1 |

Usulan: FAQ 5 dan 6 dipertahankan dari V1 walau Storyboard hanya menyebut empat topik. FAQ 6 penting karena V2 menambah heart rate, HRV, dan Recovery. Jika harus empat, gabungkan 5 ke jawaban Section 10 dan pertahankan 6. Pertanyaan "Do the finishes cost different amounts?" (V1) dihapus karena sudah dijawab di panel 10. "Is Stillway a real product?" (V1) dipindah ke disclaimer footer.

**Footer** (V1, wording dari pengguna 17 Nov 2026, disetujui D-045)

| Elemen | Copy | Asal |
| --- | --- | --- |
| Signature | `©STILLWAY x SANS BROTHERS` | V1 (approved) |
| Credit | `A concept project by Sans Brothers.` | V1 (approved) |
| Disclaimer | `Stillway is a concept project and is not for sale. Product images are AI-generated. All app data is simulated.` | V1~ (kalimat pertama diganti versi SB; sisanya V1 approved) |
| Kontak | `Business enquiry` · `E. hello@sansbrothers.com` | V1 (approved) |
| Menu | `Rhythm` · `The ring` · `The app` · `Finishes` · `FAQ` | V1~ |
| Back to top | `Back to top` | V1 |
| Lockup | ring mark + `Stillway` (hover shine) | SB |

Tidak dipakai: "share" dan "email newsletter" dari Figma. Form newsletter adalah form pengumpulan data yang berada di luar lingkup D-022, dan "share" belum punya tujuan. Lihat [Q-7].

---

## Ringkasan asal copy

| Asal | Blok |
| --- | --- |
| V1 tanpa ubah | Hero headline/sub/link, `Simulated data`, Activity & rest judul/body, `Made to be forgotten.`, finish/cahaya, isi box, catatan concept, FAQ subscription & medical, footer |
| V1 disunting | Langkah 06, body 05, FAQ sizing, navbar, disclaimer |
| Storyboard/Figma | 02 kalimat utama, 03 angka, 05 headline, 07 judul kartu, 08 headline, 09 deskripsi state 1, 10 headline, 11 closing |
| Baru | Jam/daypart tambahan, 07 fakta dan tag EN, 08 body warna, 09 suntingan, 10 hint/size/tombol, FAQ compatibility/battery/returns, alt text |

## Pertanyaan untuk pengguna

Dari Storyboard §6 butir 1, 2, 5, 7 plus temuan copy.

- **[Q-1] Spesifikasi resmi (§6.1).** Baterai, rating air, berat/tebal, rentang ukuran, dan kompatibilitas belum ada. Usulan: pakai placeholder ilustratif di dokumen ini (7 hari*, 100 m*, 4 g*/2,6 mm*, ukuran 6–13*, iPhone & Android*) dengan catatan kaki `*Illustrative`. Alternatifnya, kartu 07 tanpa angka. Pilih yang mana? Harga $299 sudah disetujui (D-015).
- **[Q-2] Angka app (§6.7).** Angka di 03, 05, dan 09 (23:10, 7h 12m, 2×, 58/82 bpm, 06:22) dibuat konsisten satu sama lain dan berlabel `Simulated data`. Apakah set ini disetujui sebagai data contoh V2, atau menunggu data dari pihak lain?
- **[Q-3] Readiness 82 vs "No score to chase".** Section 02 menolak skor, sedangkan Section 09 menampilkan skor Readiness 82 dan kalimat "One number tells you how the night paid off." Usulan Strategy Director: hapus angka Readiness dan pertahankan HRV mingguan + `Steady day, calm evening.` Hapus skor, atau pertahankan dan tulis ulang Section 02?
- **[Q-4] Status Section 04 (§6.5).** Usulan: 07:40 `25 min walk` dan 10:30 `15 min stretch` (ikut build V1), 15:30 `20 min stairs` (ikut Storyboard agar cocok dengan Section 09). Setuju?
- **[Q-5] 30-night trial dan retur.** Storyboard memakai "30-night trial" dan FAQ Returns, tetapi kebijakan retur belum diputuskan. Setujui trial 30 malam sebagai kebijakan konsep (berlabel ilustratif), atau hapus dari copy?
- **[Q-6] Tujuan tombol utama.** Checkout di luar lingkup (D-022). Usulan: CTA navbar dan Section 11 `Find your size` / `Find your size and finish →` menuju Section 10; tombol Section 10 `Choose {finish} · $299` membuka catatan singkat `Stillway is a concept project and is not for sale.` tanpa keranjang. Setuju, atau tombol 10 tanpa aksi?
- **[Q-7] Footer V2.** Figma menambah "share" dan "email newsletter". Newsletter berarti form pengumpulan data (di luar D-022). Usulan: tidak dipakai. Setuju?
- **(Terkait §6.2, bukan copy)** Fungsi lampu biru/ungu perlu dikonfirmasi. Copy 08 sudah ditulis sebagai lampu mode; jika fungsinya berubah, copy 08 dan 09 perlu ditinjau ulang.

## Usulan keputusan (untuk dicatat Claude Code di main setelah disetujui)

1. `context/home-copy-v2.md` menjadi sumber copy V2; `web-v2/` membaca dari sini. Copy V1 (`home-copy.md`, `web/`) tetap dibekukan.
2. Data simulasi V2 memakai satu set konsisten (settled 23:10, up 06:22, rested 7h 12m, broken 2×) yang menggantikan set V1 (6 h 58 m) hanya di V2.
3. Semua angka spesifikasi V2 memakai `*` dan catatan kaki `*Illustrative…` sampai [Q-1] dijawab.

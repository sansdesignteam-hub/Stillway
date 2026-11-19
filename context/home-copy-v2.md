# Stillway — Home copy V2

Versi: draf 2 · 19 November 2026 · Strategy Director
Status dokumen: **sumber copy V2** (D-066; copy V1 di `home-copy.md` dan `web/` dibekukan). Blok yang disetujui lewat D-066 sampai D-069 diberi tanda **DISETUJUI** beserta ID keputusannya. Blok lain tetap **DRAF** sampai ditinjau pengguna. Keputusan dicatat di `decisions.md` oleh Claude Code di main, bukan di sini.

Sumber: `context/Visual Directions V2/Storyboard.md` (REV 3), `Moodboard.md`, Figma "Website AI - 1 Ring" Storyboard 2 (node `40004036:51`, teks dibaca 19 Nov 2026 dan sama dengan Storyboard.md), copy V1 di `context/home-copy.md` dan `web/src/content/home.ts`. Keputusan acuan: D-002, D-004, D-005, D-014, D-015, D-021, D-022, D-045, D-058, D-059, D-060, D-062, D-066 sampai D-069.

## Cara membaca

- Semua copy yang tampil di website berbahasa Inggris (D-021). Catatan internal berbahasa Indonesia.
- **Status** per blok: `DISETUJUI (D-xxx)` atau `DRAF`. Jika hanya sebagian blok yang disetujui, statusnya ditulis per baris.
- **Asal**:
  - `V1` = dipakai ulang dari build V1 (`web/src/content/home.ts`) atau `home-copy.md`, tanpa perubahan.
  - `V1~` = dari V1 dengan penyesuaian kecil.
  - `SB` = dari Storyboard/Figma V2 apa adanya.
  - `SB~` = dari Storyboard V2, disunting Strategy Director (alasan di catatan).
  - `NEW` = copy baru dari Strategy Director.
- **Angka:**
  - Spesifikasi dan harga (baterai 7 hari, 100 m, 4 g / 2,6 mm, ukuran 6–13, iPhone & Android, $299) adalah **angka konsep** yang tampil **tanpa** `*` dan tanpa label "Illustrative" (D-067, pengecualian yang disetujui pengguna). Kejujuran konteks dijaga oleh disclaimer concept project di footer dan di S10.
  - Angka app/tubuh tetap berada di dekat label **Simulated data** (set data disetujui D-066).
- **Batas klaim:** tidak ada diagnosis, akurasi, manfaat kesehatan, atau janji hasil. Ring "notes", "keeps", "shows"; tidak "measures precisely", "improves", atau "tells you what to fix". Nada: "A picture of the day, not a verdict on it."

## 0 · Global

### Navbar (tampil di semua section)

| Elemen | Copy | Asal | Status |
| --- | --- | --- | --- |
| Logo | Ring mark + `Stillway` | SB (Moodboard §4) | DRAF (logo di ring sendiri hanya teks, D-061; lockup navbar tidak diubah D-061) |
| Link | `Rhythm` · `The ring` · `The app` · `Finishes` · `FAQ` | V1~ (tambah `The app` untuk S09) | DRAF |
| CTA | `Find your size` → anchor ke S10 | NEW | **DISETUJUI (D-069)** |
| Menu mobile | `Menu` / `Close` | V1 | DRAF |

Target anchor usulan: Rhythm → 03, The ring → 06, The app → 09, Finishes → 10, FAQ → 11.

### Jam navbar — DRAF

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

### Label simulasi dan concept project

| Elemen | Copy | Asal | Status |
| --- | --- | --- | --- |
| Label data app/tubuh | `Simulated data` | V1 | DISETUJUI sebagai aturan (D-066 menyetujui set data simulasi) |
| Catatan concept (S10 dan footer) | `Stillway is a concept project and is not for sale.` | V1 (= SB) | **DISETUJUI (D-067, D-069)** |

Baris "Keterangan spesifikasi `*Illustrative…`" dari draf 1 **dihapus** (D-067).

---

## Act 1 · Hook

### 01 · Hero — 06:50 · Paper + Dawn glow — DRAF

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Wordmark latar: `Stillway` · Eyebrow: `Meet Stillway` · Headline: `Understand your rhythm.` · Sub: `A smart ring that brings your sleep, activity, and rest into one everyday view.` · Link: `Explore Stillway` | V1 (headline = copy kerja D-014; sub dan link V1 home-copy.md) |
| 2 · 33% | (wordmark memudar; tanpa copy baru) | — |
| 3 · 67% | (headline memudar) | — |
| 4 · 100% | Kata latar `rhythm` mulai muncul (milik Section 02) | SB |

Microcopy: petunjuk scroll `Scroll down` (V1). Baris paket V1 (`$299 · Charger and sizing kit included · No required subscription`) **tidak** dipakai di Hero karena Storyboard: "belum jualan". Muncul kembali di S10.
Alt ring: `The silver Stillway ring, standing upright in soft morning light.` (NEW)

### 02 · Why Stillway — 07:10 · Paper — DRAF (section baru)

Tujuan pesan: alasan peduli sebelum fitur. Kontras dengan kompetitor yang berbasis skor, tanpa menyebut merek lain. Pesan "no score" kini konsisten dengan S09 karena Readiness dihapus (D-066).

| State | Besar (kiri) | Kecil (kanan) | Asal |
| --- | --- | --- | --- |
| 1 · 0% | Label: `WHY STILLWAY` · kata latar `rhythm` | — | SB |
| 2 · 33% | `Your body already keeps a rhythm.` | `Sleep, heart rate and temperature already move in a daily pattern, whether you look or not.` | SB~ (urutan dibalik agar tidur di depan, sesuai pilar; tambahan klausa penutup) |
| 3 · 67% | `Most devices turn it into a score.` | `Scores, streaks and red alerts can make rest feel like homework.` | SB~ ("make" → "can make" agar tidak terbaca sebagai klaim faktual tentang produk lain) |
| 4 · 100% | `Stillway just keeps the pattern.` · teks lebar: `keeps the pattern.` | `No score to chase. Just what your days look like, kept quietly.` | SB |

---

## Act 2 · Rhythm

### 03 · Sleep summary — 23:10 · Night

| State | Copy | Asal | Status |
| --- | --- | --- | --- |
| 1 · 0% | Kicker: `Last night` · (layar gelap) | NEW | DRAF |
| 2 · 33% | Headline: `Last night, in one view.` · Angka 1: `[ SETTLED ] 23:10` | V1 (headline) + SB | headline DRAF · angka **DISETUJUI (D-066)** |
| 3 · 67% | Angka 2: `[ RESTED ] 7h 12m` | SB | **DISETUJUI (D-066)** |
| 4 · 100% | Angka 3: `[ BROKEN ] 2×` · baris kecil: `A picture of the night, not a verdict on it.` · `Simulated data` | SB + V1~ | angka **DISETUJUI (D-066)** · baris kecil DRAF |

Set data V2 (D-066, Simulated): settled 23:10, up 06:22, rested 7h 12m, broken 2×. Dipakai lagi di S05 dan S09. Data V1 (6 h 58 m) tidak dipakai di V2.
Aksesibilitas: label kurung dibaca sebagai "Settled at 23:10", "Rested 7 hours 12 minutes", "Broken twice".

### 04 · Activity & rest — 07:40 → 15:30 · Night

| Elemen | Copy | Asal | Status |
| --- | --- | --- | --- |
| Judul | `Activity and rest.` (tampilan: `ACTIVITY` caps + `and rest.`) | V1 / SB | DRAF |
| Body | `Through the day the ring keeps two quiet tallies: the time you spend moving and the moments you stop. Seen together they show the rhythm of a day.` | V1 | DRAF |
| Label | `Simulated data` | V1 | DISETUJUI (D-066) |

Status per state — **DISETUJUI (D-066)**:

| State | Jam | Status |
| --- | --- | --- |
| 1 · 0% | 07:40 | `Moving · 25 min walk` |
| 2 · 25% | 09:00 | `Resting · 40 min focus` |
| 3 · 50% | 10:30 | `Moving · 15 min stretch` |
| 4 · 75% | 12:30 | `Resting · 30 min lunch` |
| 5 · 100% | 15:30 | `Moving · 20 min stairs` (sinkron dengan puncak heart rate "on the stairs, 15:30" di S09) |

Alt foto (NEW, DRAF, karakter C-02 sesuai D-058): `07:40 — A man walking outside in early light, the ring on his left index finger.` · `09:00 — Reading with a coffee at a desk, the ring in view.` · `10:30 — A short stretch beside the desk.` · `12:30 — Lunch at a table, the ring resting on the hand.` · `15:30 — Taking the stairs on an errand.` (Visual Director/Developer perlu menyesuaikan dengan foto akhir.)

### 05 · Daily insight — 17:30 · Dusk — DRAF (kecuali angka)

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0% | Headline: `Everything it noticed.` | SB |
| 2 · 33% | Headline lengkap: `Everything it noticed. One calm view.` | SB |
| 3 · 67% | Kartu app muncul (lihat di bawah) | SB |
| 4 · 100% | Body (opsional, di pinggir): `In the evening the app gathers the day into one view you can read and put down. It describes what happened. It does not tell you what to fix.` | V1~ (dari body "One line a day") |

Kartu app (UI HTML, semua Simulated):
- `LAST NIGHT` · `7h 12m` · progress bar (rested terhadap target tidur pribadi; tanpa label persen) — angka **DISETUJUI (D-066)**
- Baris kecil: `Settled 23:10 · Up 06:22` — angka **DISETUJUI (D-066)**
- Baris insight: `You took more short pauses this afternoon than on most weekdays.` (V1) — DRAF
- `Simulated data`

---

## Act 3 · Object

### 06 · Product details — 21:00 · Paper + Sand — DRAF

| State | Copy | Asal |
| --- | --- | --- |
| 1 · 0–25% | Headline: `Made to be forgotten.` | V1 / SB |
| 2 · 33% | `One quiet band` — `A single band with nothing raised on its surface to catch on a sleeve or a keyboard. There is no front to remember and no wrong way to put it on.` | V1~ (diringkas dari dua paragraf V1; V2 menolak teks panjang) |
| 3 · 67% | `Softened edges` — `Both edges are bevelled where they meet the finger, so the ring sits easily at night and slides on without catching.` | V1~ (diringkas) |
| 4 · 100% | `Then, it just fits.` — `Slip it on in the morning and stop thinking about it.` | SB (judul) + NEW (body) |

Langkah "Sensors on the inside" dari V1 tidak dipakai di sini; sensor dibahas di S08 (sesuai Storyboard).
Alt: `The Stillway ring rolling to a stop on a sand-coloured tile.` · `A hand on a plain cream background, the ring settling at the base of one raised finger.` (NEW)

### 07 · Specs & benefits — 21:00 · Sand → full-bleed

| State | Copy | Asal | Status |
| --- | --- | --- | --- |
| 1 · 0% | Headline: `Through the day.` · Pill: `MADE FOR EVERY HOUR` | SB | DRAF |
| 2 · 25% | Headline terbelah `Through` / `the day.` · 4 kartu: `(I) Night` · `(II) Desk` · `(III) Move` · `(IV) Rinse` | SB | DRAF |
| 3 · 50% | Kartu 1/4 lihat tabel kartu | SB + NEW | lihat tabel |
| 4 · 75% | Kartu 2/4 → 3/4 → 4/4 | SB + NEW | lihat tabel |
| 5 · 100% | `The Everyday` · caption `Ring shown where it's worn.` | SB | DRAF (foto studio Paper/Sand, D-064) |

Isi kartu — kolom **Fakta** dan **Kontrol** berisi angka konsep **DISETUJUI (D-067)**, tanpa `*`. Judul, tag, dan susunan kalimat tetap DRAF.

| Kartu | Judul | Tag | Fakta | Kontrol | Asal |
| --- | --- | --- | --- | --- | --- |
| (I) Night · 1/4 | `Sleeps with you. Charges while you don't.` | `[ BATTERY ]` | `Up to 7 days on a charge. Top up on the dock while you shower.` | Panel mini: `Mon`…`Sun` + sisa baterai per hari, label `Simulated data` | SB (judul) + NEW |
| (II) Desk · 2/4 | `Sized to forget.` | `[ SIZE ]` | `Sizes 6–13. Try them on with the sizing kit before you choose.` | Slider ukuran: `Size 9` | SB + NEW |
| (III) Move · 3/4 | `Light enough to lose track of.` | `[ WEIGHT · THICKNESS ]` | `About 4 g, 2.6 mm thin.` | Bar berat: `4 g` | SB + NEW |
| (IV) Rinse · 4/4 | `Hands in water. Ring stays on.` | `[ WATER RATING ]` | `Water resistant to 100 m. Washing up, rain, a swim.` | Rating: `100 m` | SB + NEW |

Catatan:
- Tag Storyboard berbahasa Indonesia (`[ UKURAN ]`, `[ BERAT · TEBAL ]`, `[ BATERAI ]`, `[ RATING AIR ]`) diterjemahkan karena D-021.
- Panel baterai mingguan tetap berlabel `Simulated data` karena itu tampilan data pemakaian, bukan spesifikasi.
- Kartu Night tidak boleh menyiratkan tidur lebih baik. "Sleeps with you" berarti dipakai saat tidur.

### 08 · Features: sensor light — 21:00 · Night — DRAF (section baru)

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
- D-062: lampu hanya di jendela A; hijau/biru/ungu adalah **lampu mode konsep**, merah hanya menandai ring mati. Copy tidak boleh menyebut biru/ungu mengukur sesuatu (mis. oksigen). Copy di atas hanya mengaitkan warna dengan mode/waktu.
- Catatan Figma panel lampu ("Ring menghitung HRV dan skor pulih", "membaca detak jantung dan langkah") adalah catatan internal, bukan copy publik. Jangan dipindahkan ke website.

### 09 · The app — 21:00 · Paper

Tanpa ring. HP diam di tengah; isi layar ikut scroll. Angka layar app **Simulated data**; set data **DISETUJUI (D-066)**. Skor Readiness **dihapus (D-066)**.

| State | Chip | Kiri atas | Kanan bawah | Footer aktif | Asal | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 · 0% | `● GREEN LIGHT · HEART RATE` | `The green light, read back. Your heart rate through the day, at a glance.` | `Resting 58 bpm. Peak on the stairs, 15:30.` | `Heart rate` | SB | DRAF |
| 2 · 50% | `● BLUE LIGHT · SLEEP` | `The blue light, read back. Your night, in order: when you settled, how deep you went.` | `Deep, light and REM sleep, laid out across the night.` | `Sleep` | SB~ | DRAF |
| 3 · 100% | `● VIOLET LIGHT · RECOVERY` | `The violet light, read back. How the night sat against the rest of your week.` | `HRV across the week, with today in full colour.` | `Recovery` | SB~ | **DISETUJUI (D-066)** untuk penghapusan skor dan isi HRV mingguan; susunan kalimat DRAF |

Footer kanan: `Scroll down` · progress · `33%` / `66%` / `100%`. Label tetap: `Simulated data` di bawah HP.

Isi layar app (UI HTML):
- Heart rate: `Resting` `58 bpm` · grafik `00:00–24:00` · anotasi `Peak 82 bpm · 15:30 stairs`.
- Sleep: `Settled 23:10 · Up 06:22` · `7h 12m` · tahap `Deep` `REM` `Light` (durasi per tahap, tanpa skor).
- Recovery: HRV 7 hari `Mon`–`Sun`, hari ini paling terang · baris `Steady day, calm evening.` (SB). **Tidak ada** angka Readiness, skor, atau kalimat "One number…" (D-066).

Catatan suntingan:
- "measured minute by minute" (SB) diganti karena menyiratkan presisi/akurasi klinis.
- "One number tells you how the night paid off" (SB) dan `Readiness 82 · An easy day ahead.` dihapus (D-066) agar selaras dengan "No score to chase" di S02.
- "Recovery" dan "HRV" boleh tampil sebagai nama fitur app; jangan ditambah janji ("helps you recover").

---

## Act 4 · Choice

### 10 · Finishes & pricing — 22:00 · Sand

Paket mengikuti D-015: $299, tanpa langganan wajib, Silver/Black/Gold harga sama, dock pengisi daya dan sizing kit termasuk. Finish hanya berganti lewat klik swatch, bukan scroll (D-069 poin 2); state 2–3 di bawah adalah contoh pilihan user.

| State | Copy | Asal | Status |
| --- | --- | --- | --- |
| 1 · 0% | Headline: `Turn it yourself.` · hint: `Drag to turn` (mobile: `Swipe to turn`, D-069 poin 4) · tombol `‹` `›` (aria: `Previous angle` / `Next angle`) · Finish default `Silver` | SB + NEW | DRAF |
| 2 · 33% | Swatch dipilih: `Black` | SB | DRAF |
| 3 · 67% | Swatch dipilih: `Gold` · toggle cahaya `Daylight` / `Lamp light` | SB + V1 | DRAF |
| 4 · 100% | Headline: `Find your size and finish.` · lihat panel | SB | DRAF |

Panel:

| Elemen | Copy | Asal | Status |
| --- | --- | --- | --- |
| Finish | `Finish` — `Silver` · `Black` · `Gold` | V1 | DRAF (paket D-015) |
| Size | `Size` — `Not sure? A sizing kit comes first, so you can try before you settle.` · pilihan `6`–`13` | NEW | rentang **DISETUJUI (D-067)** · kalimat DRAF |
| Harga | `$299` · `Every finish, same price. No required subscription.` | V1~ | harga **DISETUJUI (D-015, D-067, tanpa `*`)** · kalimat DRAF |
| Trial | `30-night trial` | SB | **DISETUJUI (D-068)** |
| Isi box | `In the box: the ring, a charging dock, and a sizing kit.` | SB = V1 | DRAF (paket D-015) |
| Tombol utama | `Choose {finish} · $299` (mis. `Choose Silver · $299`) | NEW | **DISETUJUI (D-069)** |
| Respons tombol | `Stillway is a concept project and is not for sale.` — muncul sebagai catatan singkat di dekat tombol setelah diklik (`role="status"`), tanpa cart | V1 | **DISETUJUI (D-069)** |

### 11 · Closing, FAQ & footer — 06:50 tomorrow · Night + Ember glow

| State | Copy | Asal | Status |
| --- | --- | --- | --- |
| 1 · 0% | Kicker caps: `TOMORROW MORNING,` · besar: `see your night.` | SB | DRAF |
| 2 · 33% | Tombol: `Find your size and finish →` (→ S10) · baris mono: `No required subscription · Sizing kit included · 30-night trial` | SB~ | tujuan tombol **DISETUJUI (D-069)** · `30-night trial` **DISETUJUI (D-068)** · label dan susunan baris DRAF |
| 3 · 67% | FAQ (di bawah) · tombol diulang | SB | lihat FAQ |
| 4 · 100% | Pernyataan caps: `SLEEP ON IT. STILLWAY KEEPS THE PATTERN.` · footer | SB | DRAF |

Catatan baris mono: "No subscription" (SB) tetap menjadi "No required subscription" sesuai D-015; "Free sizing kit" menjadi "Sizing kit included".

**FAQ — `Questions, briefly.`** (SB; 4 topik Storyboard + 2 dari V1, format accordion)

| # | Pertanyaan | Jawaban | Asal | Status |
| --- | --- | --- | --- | --- |
| 1 · Sizing | `How do I find my size?` | `A sizing kit comes in the box. Wear a sample size for a day and a night, then choose the size that feels right. Stillway comes in sizes 6 to 13.` | V1~ | rentang ukuran **DISETUJUI (D-067)** · kalimat DRAF |
| 2 · Compatibility | `Does it work with my phone?` | `Yes. The Stillway app works with iPhone and Android.` | NEW | **DISETUJUI (D-067)** |
| 3 · Battery | `How long does the battery last, and how do I turn it off?` | `Up to 7 days on a charge, and it tops up on the dock. To switch it off, hold it on the dock until the light turns red.` | NEW | 7 hari **DISETUJUI (D-067)** · cara mematikan DRAF (lihat catatan) |
| 4 · Returns | `Can I return it?` | `Yes. Every Stillway comes with a 30-night trial. Wear it through your days and nights, and if it isn't right for you, send it back within 30 nights of delivery for a full refund.` | NEW | **DISETUJUI (D-068)** sebagai kebijakan konsep; kalimat final dari Strategy Director |
| 5 · Subscription | `Is there a subscription?` | `No. The $299 price includes the ring and the companion app. There is no required subscription.` | V1 | DRAF (isi sesuai D-015) |
| 6 · Medical | `Is Stillway a medical device?` | `No. Stillway shows patterns in your sleep, activity, and rest. It does not diagnose, treat, or prevent any condition.` | V1 | DRAF (wajib dipertahankan, lihat catatan) |

Catatan FAQ:
- Semua tanda `*` dari draf 1 dihapus (D-067).
- FAQ 3: D-062 menetapkan merah = ring mati, tetapi cara mematikan ring (tahan di dock) adalah usulan Strategy Director dan belum disetujui.
- FAQ 4: jawaban tidak menyebut ongkos kirim, kondisi barang, atau proses pengembalian dana karena belum diputuskan. Jika pengguna ingin menambahkannya, perlu keputusan baru.
- FAQ 6 dipertahankan karena V2 menampilkan heart rate, HRV, dan Recovery. Pertanyaan "Do the finishes cost different amounts?" (V1) dihapus karena sudah dijawab di panel S10. "Is Stillway a real product?" (V1) dipindah ke disclaimer footer.

**Footer** — tanpa form email, newsletter, dan share (**DISETUJUI, D-069 poin 3**)

| Elemen | Copy | Asal | Status |
| --- | --- | --- | --- |
| Signature | `©STILLWAY x SANS BROTHERS` | V1 | DISETUJUI (D-045) |
| Credit | `A concept project by Sans Brothers.` | V1 | DISETUJUI (D-045) |
| Disclaimer | `Stillway is a concept project and is not for sale. Product images are AI-generated. All app data is simulated.` | V1~ (kalimat pertama versi SB; sisanya V1) | wajib ada (D-067) · kalimat pertama DRAF, sisanya DISETUJUI (D-045) |
| Kontak | `Business enquiry` · `E. hello@sansbrothers.com` | V1 | DISETUJUI (D-045) |
| Menu | `Rhythm` · `The ring` · `The app` · `Finishes` · `FAQ` | V1~ | DRAF |
| Back to top | `Back to top` | V1 | DRAF |
| Lockup | ring mark + `Stillway` (hover shine) | SB | DRAF |

---

## Ringkasan asal copy

| Asal | Blok |
| --- | --- |
| V1 tanpa ubah | Hero headline/sub/link, `Simulated data`, Activity & rest judul/body, `Made to be forgotten.`, finish/cahaya, isi box, catatan concept, FAQ subscription & medical, footer |
| V1 disunting | Langkah 06, body 05, FAQ sizing, navbar, disclaimer |
| Storyboard/Figma | 02 kalimat utama, 03 angka, 05 headline, 07 judul kartu, 08 headline, 09 deskripsi state 1, 10 headline, 11 closing, 30-night trial |
| Baru | Jam/daypart tambahan, 07 fakta dan tag EN, 08 body warna, 09 suntingan, 10 hint/size/tombol, FAQ compatibility/battery/returns, alt text |

## Status pertanyaan draf 1

| Pertanyaan | Hasil |
| --- | --- |
| Q-1 Spesifikasi | Dijawab D-067 (angka konsep tanpa `*`) |
| Q-2 Angka app | Dijawab D-066 |
| Q-3 Readiness vs no-score | Dijawab D-066 (Readiness dihapus) |
| Q-4 Status S04 | Dijawab D-066 |
| Q-5 30-night trial dan retur | Dijawab D-068 |
| Q-6 Tujuan tombol utama | Dijawab D-069 |
| Q-7 Footer | Dijawab D-069 |
| Lampu biru/ungu | Dijawab D-062 (lampu mode konsep) |

## Pertanyaan terbuka (baru)

- **[Q-8] Cara mematikan ring (FAQ 3).** Usulan: "hold it on the dock until the light turns red". Setuju, atau FAQ 3 cukup membahas baterai saja?
- **[Q-9] Detail retur (FAQ 4).** Apakah jawaban cukup "full refund within 30 nights of delivery", atau perlu menambahkan siapa yang menanggung ongkos kirim retur? Usulan: cukup seperti sekarang.
- **[Q-10] Tinjauan copy DRAF lainnya.** Blok S01, S02, S05, S06, S07 (judul/tag), S08, dan S11 closing masih draf. Usulan: pengguna meninjau per act setelah Developer memasang S01–S03 (bersamaan dengan rencana deploy D-070).

## Usulan keputusan (untuk dicatat Claude Code di main setelah disetujui)

1. Jawaban FAQ Returns: "Yes. Every Stillway comes with a 30-night trial. Wear it through your days and nights, and if it isn't right for you, send it back within 30 nights of delivery for a full refund." menjadi copy final (melengkapi D-068).
2. Respons tombol S10 tampil sebagai catatan inline (`role="status"`) di dekat tombol, bukan modal (melengkapi D-069).

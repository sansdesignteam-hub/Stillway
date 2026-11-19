# Stillway — Moodboard

Versi: v2 · 19 Nov 2026
Sumber: Figma "Website AI - 1 Ring" → section **Moodboard**
https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Ring?node-id=40004110-50

Dokumen ini berisi **bahasa visual** Stillway: warna, tipografi, logo, gaya foto, dan referensi per section. Alur, gerak, dan state tiap section ada di `Storyboard.md`. Kalau dokumen ini berbeda dengan Figma, yang dipakai Figma.

| Bagian di Figma | Node |
|---|---|
| Moodboard Style | `40004115:50` |
| Moodboard Color | `40004115:66` |
| Moodboard Typography | `40004117:50` |
| Moodboard Layout (per section) | `40004118:50` |
| Moodboard Mobile App | `40004128:58` |
| Moodboard Branding | `40004128:83` |
| Competitor Moodboard (merged) | `40004014:2` |

---

## 1. Arah visual (Style)

**Calm, warm, health-grade tanpa terasa klinis.**
- **Hari:** krem.
- **Malam:** gelap hangat.
- **Objek:** satu ring perak dengan cahaya yang realistis.

| Referensi | Yang diambil | Dipakai di |
|---|---|---|
| Oura ([why-oura](https://ouraring.com/why-oura)) | Kanvas krem, headline ringan, ring dipakai di tangan nyata, hierarki tenang | Hero, Why Stillway |
| Oryzo ([oryzo.ai](https://oryzo.ai/)) | Background hampir hitam yang hangat, satu objek disinari seperti still life, glow hangat di sudut bawah | Section 08 dan section malam |
| Ultrahuman ([ring/buy](https://www.ultrahuman.com/ring/buy/)) | Cahaya golden-hour berasal dari scene; ring tetap logam bersih | Dawn / Ember glow = sumber cahaya di belakang ring, tidak pernah gradient UI datar, tidak pernah di atas ring |
| Syne landing ([Dribbble](https://dribbble.com/shots/27469377)) | Kartu mini frosted di atas foto | Kartu app Section 05, panel beli Section 10. Palet hijau dan wordmark Syne **tidak** dipakai |

---

## 2. Warna

### 2.1 Palet final: 5 warna, tidak ada yang lain

| Token | Hex | Peran | Dipakai di |
|---|---|---|---|
| `--paper` | #F7F5F0 | Background terang | Hero, Why Stillway, Product details, The app |
| `--sand` | #EFE6DB | Background terang kedua | Tile dan alas di Product details, Specs & benefits, Finishes; kartu, panel, chip |
| `--ink` | #231F20 | Teks + tombol utama | Headline, body, tombol CTA di background terang |
| `--night` | #17120F | Background gelap | Sleep summary, Activity & rest, Features, Closing/FAQ/footer |
| `--ochre` | #B76F20 | Satu-satunya aksen | Label, tag [ ], chip aktif, progress, data live, scroll marker, glow |

**Proporsi di seluruh halaman:** Paper ±45% · Night ±30% · Sand ±15% · Ink ±8% · Ochre ≤ 2%.
- Ochre tidak pernah jadi background penuh dan tidak pernah jadi warna tombol utama.

### 2.2 Turunan (bukan warna baru)

| Nama | Rumus | Pakai |
|---|---|---|
| Stone | Ink 65% (≈ #6B645C) | Teks sekunder, caption |
| Line | Ink 12% (≈ #DBD5CC) | Divider, border kartu |
| Dawn glow | Ochre 35% → 0, diblur, di belakang ring di atas Paper | Satu bentuk per section |
| Ember glow | Ochre 40% → 0, diblur, dari atas di atas Night | Closing, Features |
| Dusk | Gradient Ochre → Night | Hanya Daily insight (17:30), jembatan siang → malam |

### 2.3 Warna lampu produk (bukan warna UI)

| Token | Hex | Arti |
|---|---|---|
| `--led-heart-rate` | #34E07A | Hijau · siang · detak jantung |
| `--led-sleep` | #3B8CFF | Biru · malam · tidur |
| `--led-recovery` | #A06BFF | Ungu · pagi · recovery / HRV |
| `--led-off` | #FF3B30 | Merah · ring mati (cukup satu baris copy) |

Warna lampu hanya dipakai di dua tempat:
- cahaya di render ring (Section 08 State 2–3);
- titik warna kecil di legenda Section 08 dan di chip/kartu app Section 09.

Warna ini tidak untuk teks, background, tombol, atau grafik UI.

### 2.4 Background per section

| S01 | S02 | S03 | S04 | S05 | S06 | S07 | S08 | S09 | S10 | S11 |
|---|---|---|---|---|---|---|---|---|---|---|
| Paper + Dawn glow | Paper | Night | Night | Dusk | Paper + alas Sand | Sand → foto full-bleed | Night | Paper | Sand | Night + Ember glow |

### 2.5 Aturan
- **Kontras teks:** teks di atas Paper/Sand = Ink; teks di atas Night = Paper.
- **Ochre:** satu elemen ochre per tampilan (label, tag, atau garis progress).
- **Glow:** ochre opacity rendah, diblur, di belakang ring, tidak pernah di atas ring.
- **Jangan:** biru, kuning, lime, peach, atau warna tambahan di UI.

### 2.6 Token CSS
```css
:root{
  --paper:#F7F5F0; --sand:#EFE6DB; --ink:#231F20; --night:#17120F; --ochre:#B76F20;
  --stone:rgba(35,31,32,.65); --line:rgba(35,31,32,.12);
  /* lampu produk, bukan UI */
  --led-heart-rate:#34E07A; --led-sleep:#3B8CFF; --led-recovery:#A06BFF; --led-off:#FF3B30;
}
```

**Referensi asal warna:**
- [Oura](https://ouraring.com/): Paper, Sand, Ink dari krem, sand, dan ink hangat.
- [Viture](https://www.viture.com/): satu bentuk glow lembut, dibuat dari Ochre.
- [Verra · Dribbble](https://dribbble.com/shots/25802987): Night + satu aksen; aksen lime-nya diganti Ochre.

---

## 3. Tipografi

**Dipilih: Option A — Geist + Geist Mono** (paket npm `geist`).

| Peran | Font |
|---|---|
| Headline, angka besar | Geist Light, tracking −3% |
| Body, kartu data, CTA | Geist Regular / Medium |
| Tag [ ], jam, nilai live | Geist Mono (12–14 px, tracking lebar) |
| Wordmark / logo | Geist Medium, tracking −3% |

**Alasan:** satu keluarga huruf untuk seluruh brand, termasuk logo yang di-laser-etch di ring. Geist Light memberi kesan tenang dan lapang.

- Option B (Newsreader Light + DM Sans) dan Option C (Hanken Grotesk + Inter): tidak dipilih.

| Referensi | Yang diambil |
|---|---|
| [Oura](https://ouraring.com/why-oura) | Bobot ringan dan leading rapat untuk headline, satu baris per layar (serif-nya tidak dipakai) |
| [Oryzo](https://oryzo.ai/) | Satu baris besar saja (Why Stillway), bukan suara dasar |
| [Shift Robotics](https://shiftrobotics.io/) | Chip mono huruf besar untuk tag [ UKURAN ], [ SENSOR ] |
| [Sensiq](https://sensiq.co/) | Kicker kecil + headline besar, skala kartu data |

---

## 4. Brand & logo

- **Lockup:**
  - Ring mark: band tipis dilihat dari depan, dengan titik ochre sebagai jendela sensor.
  - Wordmark "Stillway" dalam Geist Medium, tracking −3%.
- **Lockup yang sama** dipakai di navbar, di footer (selebar layar, dengan hover shine), dan di-laser-etch tone-on-tone kecil di sisi luar ring.
- **Semua render, cutout, foto, dan model 3D** harus memakai ring dengan engraving ini.
- **Referensi:** [Syne branding · Dribbble](https://dribbble.com/shots/27436741).
  - Brand board satu sistem.
  - Mark "O" + wordmark polos.
  - Nama di-engrave di ring.

---

## 5. Mobile app (UI di dalam website)

UI app dipakai di Section 05 (kartu di lubang ring) dan Section 09 (HP di tengah). Semuanya HTML, bukan gambar.

| Pola | Referensi | Untuk Stillway |
|---|---|---|
| Onboarding & home | [Oura app · Dribbble](https://dribbble.com/shots/26827839) | Foto ring + satu angka |
| Screen set | [Smart Ring App · Dribbble](https://dribbble.com/shots/27202999) | Kartu krem, teks ink, ochre untuk satu nilai live |
| Timed insight + satu angka | [Ultrahuman](https://www.ultrahuman.com/ring/) | Nudge "23:10 · Settled", lalu 7h 12m |
| Detail metrik | [Oura app · Dribbble](https://dribbble.com/shots/26970862) | Satu nilai besar, unit kecil, satu kalimat |
| Grafik | sama | Garis ink tipis di atas krem, titik ochre untuk "sekarang", tanpa grid |
| Blok warna | sama | Panel gradient Dawn/Ember, bukan oranye datar |

Di Section 09, titik di tiap kartu memakai warna lampu (§2.3): hijau Heart rate, biru Sleep, ungu Recovery.

---

## 6. Referensi per section (Moodboard Layout)

Tiga referensi per section, urut kiri → kanan sesuai Figma. Sticky note di tiap row juga punya daftar **LINKS** yang bisa diklik.

**01 · Hero:** pagi, 06:50
1. [Oryzo](https://oryzo.ai/): wordmark raksasa samar di belakang, objek di depan (State 1–2).
2. [Oura](https://ouraring.com/): ring di tangan nyata, background krem, headline Geist Light (State 3).
3. [Viture](https://www.viture.com/): satu glow Dawn lembut di background, tidak pernah di atas ring.

**02 · Why Stillway:** kenapa produk ini ada
1. [Oryzo](https://oryzo.ai/) "Isn't just a coaster": statement besar di kiri, ring di tengah, paragraf kecil di kanan (State 2–3).
2. [Oryzo](https://oryzo.ai/) "It's wearable": satu kata raksasa menyala di atas objek (State 1).
3. [Sofi](https://www.sofihealth.com/) "all starts with": kalimat raksasa lewat di belakang produk (State 4).

**03 · Sleep summary:** semalam, 23:10
Ikut storyboard: hanya ring di background gelap + 3 angka yang muncul satu per satu. Tanpa HP, layar app, atau foto.
1. [Ultrahuman](https://www.ultrahuman.com/ring/): ring di background hitam, hanya tepinya yang kena cahaya (State 1).
2. [Sensiq](https://sensiq.co/): label caps kecil di atas satu angka besar; yang diambil hanya gaya hurufnya (State 2–4).
3. [Ultrahuman](https://www.ultrahuman.com/ring/): satu angka besar per langkah scroll, angka sebelumnya meredup. Pakai warna kita, bukan hijau mereka.

**04 · Activity & rest:** 07:40 → 15:30
Mengikuti build dev: background gelap, filmstrip 5 momen.
1. [Oryzo](https://oryzo.ai/) "So portable" (awal): judul kiri atas, satu foto besar dalam bingkai putus-putus, foto lain kecil (State 1).
2. [Oryzo](https://oryzo.ai/) (foto berganti): strip bergeser, foto berikutnya masuk ke bingkai; jam besar + status di kiri bawah, daftar jam di kanan bawah (State 2–4).
3. [Oryzo](https://oryzo.ai/) (akhir strip): tinggal satu foto, bingkai memudar, foto menggelap ke Dusk (State 5).

**05 · Daily insight:** 17:30
1. [Ultrahuman](https://www.ultrahuman.com/ring/): satu kartu outline dengan satu kalimat.
2. [Sensiq](https://sensiq.co/): satu angka di tengah, tidak ada yang lain.
3. [Oryzo](https://oryzo.ai/): gradient ochre ke gelap untuk ring yang membesar sampai memenuhi layar.

**06 · Product details:** made to be forgotten
Satu background terang dari awal sampai akhir: ring menggelinding, berputar, lalu masuk ke tangan tanpa background.
1. [Ultrahuman](https://www.ultrahuman.com/ring/): ring berdiri di tepinya, menghadap depan; pose akhir gelindingan (State 1).
2. [Sofi](https://www.sofihealth.com/): produk dipegang satu tangan cut-out di background polos, headline di atas (State 4).
3. [Sensiq](https://sensiq.co/): ring di jari, tangan cut-out, tanpa background, label kecil di samping (State 4).

**07 · Specs & benefits:** through the day
1. [Obsidian Assembly](https://obsidianassembly.com/): wordmark terbelah, 4 kartu foto (State 1–2).
2. [Obsidian Assembly](https://obsidianassembly.com/): satu kartu fokus, judul (I)–(IV), counter 1/4, garis orbit, panel mini interaktif (State 3–4).
3. [Obsidian Assembly](https://obsidianassembly.com/): kartu terbuka jadi foto full-bleed "The Everyday" (State 5).

**08 · Features:** di dalam ring
1. [Shift](https://shiftrobotics.io/): background gelap, kamera dekat ke satu detail, judul pendek per state.
2. Screenshot dari klien (tanpa link): satu lampu di jendela sensor dengan flare lembut (State 2–3).
3. [Ultrahuman](https://www.ultrahuman.com/ring/): sensor menyala dari dalam ring; warnanya berganti hijau → biru → ungu saat scroll.

**09 · The app:** tiap lampu dibaca ulang
1. [Sofi](https://www.sofihealth.com/): pola utama: HP di tengah di background terang, teks pendek kiri atas dan kanan bawah, "scroll down" + progress di footer.
2. [Oura "Wake up knowing"](https://ouraring.com/how-it-works): skor dulu, lalu detail (tahap tidur).
3. [Dribbble · Valeria Rimkevich](https://dribbble.com/shots/26647744-Sleep-Tracker-App-Concept): satu angka besar per layar; layar yang scroll, HP diam.

**10 · Finishes & pricing:** 22:00
1. [Mirelz](https://www.mirelz.com/try-on): drag ring 360° (mouse/touch), petunjuk kecil "Drag" (State 1).
2. [Shift PDP](https://shiftrobotics.io/products/moonwalkers-dusk): panel di kanan: finish, ukuran, harga, satu tombol.
3. [Ultrahuman PDP](https://www.ultrahuman.com/ring/buy/): swatch finish mengganti material ring sungguhan, bukan hanya warna.

**11 · Closing, FAQ & footer:** besok pagi, 06:50
1. [Oryzo](https://oryzo.ai/) "Choose your own": satu kalimat penutup di atas ring, glow hangat dari atas (State 1–2).
2. [Oryzo](https://oryzo.ai/): FAQ satu kolom sempit di background gelap yang sama, tanpa panel putih (State 3).
3. [Oryzo](https://oryzo.ai/): statement caps + footer di kanvas yang sama, diakhiri logo lockup penuh (State 4).

---

## 7. Competitor moodboard (ringkas)

Frame "Competitor Moodboard — Stillway (merged)" menggabungkan analisa kompetitor lama dan baru. Tabel "Page structure" di sana sudah sesuai dengan 11 section di atas. Pola utama yang diambil:
- **Produk sebagai tokoh** (Aevion / Riotters): objek yang sama hadir di setiap bab.
- **Panggung gelap yang mengisolasi produk, teks mengapit objek** (Oryzo).
- **Satu klaim besar per layar** (Viture).
- **Produk di tangan tanpa background** (Sofi, Sensiq).

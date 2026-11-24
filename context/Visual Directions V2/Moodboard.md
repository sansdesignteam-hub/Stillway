# Stillway — Moodboard

Versi: v2.1 · 23 Nov 2026 (foundation §2–3 diperbarui, D-134; bagian lain tetap v2 · 19 Nov)
Sumber: Figma "Website AI - 1 Ring" → section **Moodboard**
https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Ring?node-id=40004110-50
Foundation (warna, token, tipografi): https://www.figma.com/design/ejtNpUf0FdEYMgAbcENMCH/Website-AI---1-Stillway?node-id=64-5

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

> **Sumber kebenaran token (D-134):** Figma "Website AI - 1 Stillway", halaman **Foundation** (`64:5`): 🌈 Color Palette `10067:9850`, 🎨 Token Color System `10068:11282`. Tabel di bawah adalah salinan teks untuk dev; kalau berbeda, Figma Foundation yang dipakai. Yang diadopsi hanya foundation (palet, token, text style). Layout, gerak, dan latar per section tetap mengikuti production dan Storyboard v2 (D-131).

### 2.1 Main colors: 6 warna (+ Stone & Line turunan, §2.2)

| Token | Hex | Peran | Dipakai di |
|---|---|---|---|
| `--paper` | #F9F5EF (neutral/50) | Background terang | Hero, Why Stillway, Product details, The app |
| `--sand` | #F0E8DD (neutral/100) | Background terang kedua | Tile dan alas di Product details, Specs & benefits, Finishes; kartu, panel, chip |
| `--ink` | #231F20 (neutral/900) | Teks + tombol utama | Headline, body, tombol CTA di background terang |
| `--night` | #1B0B06 (cocoa/950) | Background gelap | Sleep summary, Activity & rest, Features, Closing/FAQ/footer |
| `--cocoa` | #341C12 (cocoa/900) | Background gelap kedua | Panel dan kartu yang sudah ada di section gelap Night/Dusk (pasangan gelap dari Sand, D-135); tidak menambah panel baru |
| `--ochre` | #B76F20 (ochre/600) | Satu-satunya aksen | Label, tag [ ], chip aktif, progress, data live, scroll marker, glow |

**Proporsi di seluruh halaman:** Paper ±45% · Night ±30% · Sand ±15% · Ink ±8% · Ochre ≤ 2% (Cocoa termasuk porsi Night).
- Ochre tidak pernah jadi background penuh dan tidak pernah jadi warna tombol utama.

**Berubah dari v2 (19 Nov):** Paper #F7F5F0 → #F9F5EF, Sand #EFE6DB → #F0E8DD, Night #17120F → #1B0B06, Stone opacity → solid #6B655F, Cocoa baru. Ink, Ochre, Line, dan warna lampu tetap.

### 2.2 Turunan (bukan warna baru)

| Nama | Rumus | Pakai |
|---|---|---|
| Stone | neutral/600 #6B655F (solid) | Teks sekunder, caption |
| Line | Ink 12% (neutral-alpha-12) | Divider, border kartu |
| Dawn glow | Ochre 35% → 0, diblur, di belakang ring di atas Paper | Satu bentuk per section (section terang) |
| Cahaya cocoa (D-139) | `--cocoa-300` → 0, dihitung di canvas dengan dither (tanpa banding), di belakang ring di atas Night | Semua section gelap: S03 (glow pojok + sorotan diagonal, satu-satunya yang memakai sorotan), 03 → 04 (dari bawah), S04 (kiri bawah), S05 (kiri bawah), S08 (redup dari atas), S11 (dari atas). Menggantikan Ember glow ochre |
| Dusk | Cahaya cocoa dari kiri bawah di atas Night (D-139, bukan ochre lagi) | Daily insight (17:30), jembatan siang → malam |

### 2.3 Warna lampu produk (bukan warna UI)

| Token | Hex | Arti |
|---|---|---|
| `--led-heart-rate` (sensor-heart-rate) | #34E07A | Hijau · siang · detak jantung |
| `--led-sleep` (sensor-sleep) | #3B8CFF | Biru · malam · tidur |
| `--led-recovery` (sensor-recovery) | #A06BFF | Ungu · pagi · recovery / HRV |
| `--led-off` (sensor-off) | #FF3B30 | Merah · ring mati (cukup satu baris copy) |

Warna lampu hanya dipakai di dua tempat:
- cahaya di render ring (Section 08 State 2–3);
- titik warna kecil di legenda Section 08 dan di chip/kartu app Section 09.

Warna ini tidak untuk teks, background, tombol, atau grafik UI.

### 2.4 Background per section

| S01 | S02 | S03 | S04 | S05 | S06 | S07 | S08 | S09 | S10 | S11 |
|---|---|---|---|---|---|---|---|---|---|---|
| Paper + Dawn glow | Paper | Night + cahaya cocoa | Night + cahaya cocoa | Dusk (cahaya cocoa) | Paper + alas Sand | Sand → foto full-bleed | Night + cahaya cocoa | Paper | Sand | Night + cahaya cocoa |

Latar tetap seperti production (mis. foto dinding bayangan daun di S02, D-088); hanya hex Paper/Sand/Night yang berganti.

### 2.5 Aturan
- **Kontras teks:** teks di atas Paper/Sand = Ink; teks di atas Night = Paper.
- **Ochre:** satu elemen ochre per tampilan (label, tag, atau garis progress).
- **Glow:** ochre opacity rendah, diblur, di belakang ring, tidak pernah di atas ring.
- **Jangan:** biru, kuning, lime, peach, atau warna tambahan di UI.
- **Token:** warna di web memakai token §2.8 (skala di §2.7); tidak ada hex lepas di luar `tokens.css`.

### 2.6 Token CSS
```css
:root{
  /* 🌈 Primitive Color */
  --neutral-0:#FFFFFF; --neutral-50:#F9F5EF; --neutral-100:#F0E8DD; --neutral-200:#DFD6CA; --neutral-300:#C9BFB5; --neutral-400:#A9A097;
  --neutral-500:#867F78; --neutral-600:#6B655F; --neutral-700:#554E4A; --neutral-800:#3C3733; --neutral-900:#231F20; --neutral-950:#17120F;
  --ochre-50:#FEF6E7; --ochre-100:#FDEACC; --ochre-200:#FBD6A1; --ochre-300:#F3BA6D; --ochre-400:#E89D3D; --ochre-500:#D5851B;
  --ochre-600:#B76F20; --ochre-700:#97571C; --ochre-800:#79451C; --ochre-900:#62371C; --ochre-950:#3A1E0E;
  --cocoa-50:#FDF4EE; --cocoa-100:#F7E6DB; --cocoa-200:#E9CCBB; --cocoa-300:#D4AA94; --cocoa-400:#BA886F; --cocoa-500:#A16A50;
  --cocoa-600:#83513A; --cocoa-700:#653B29; --cocoa-800:#49291B; --cocoa-900:#341C12; --cocoa-950:#1B0B06;
  --neutral-alpha-12:rgb(35 31 32 / .12); --white-alpha-12:rgb(255 255 255 / .12);
  /* main colors (alias) */
  --paper:var(--neutral-50); --sand:var(--neutral-100); --ink:var(--neutral-900); --night:var(--cocoa-950); --cocoa:var(--cocoa-900); --ochre:var(--ochre-600);
  --stone:var(--neutral-600); --line:var(--neutral-alpha-12);
  /* lampu produk, bukan UI */
  --led-heart-rate:#34E07A; --led-sleep:#3B8CFF; --led-recovery:#A06BFF; --led-off:#FF3B30;
}
```

### 2.7 Color palette (🌈 Primitive Color, skala 50–950)

| Skala | 0 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Neutral** | #FFFFFF | #F9F5EF (Paper) | #F0E8DD (Sand) | #DFD6CA | #C9BFB5 | #A9A097 | #867F78 | #6B655F (Stone) | #554E4A | #3C3733 | #231F20 (Ink) | #17120F |
| **Primary · Ochre** | — | #FEF6E7 | #FDEACC | #FBD6A1 | #F3BA6D | #E89D3D | #D5851B | #B76F20 (Ochre) | #97571C | #79451C | #62371C | #3A1E0E |
| **Secondary · Cocoa** | — | #FDF4EE | #F7E6DB | #E9CCBB | #D4AA94 | #BA886F | #A16A50 | #83513A | #653B29 | #49291B | #341C12 (Cocoa) | #1B0B06 (Night) |

- **Accent** (warna lampu sensor, satu tingkat): `Accent/green/green-base` #34E07A · `blue-base` #3B8CFF · `violet-base` #A06BFF · `red-base` #FF3B30.
- **Alpha:** `Alpha/neutral/neutral-alpha-12` (#231F20 12%, Line) · `Alpha/white/white-alpha-12` (#FFFFFF 12%).

#### Keterbacaan (WCAG 2.2, dihitung ulang 23 Nov dari hex di atas)

Teks kecil ≥ 4.5:1 (AA), teks besar (≥ 24px / 19px bold) & elemen UI ≥ 3:1, AAA ≥ 7:1.

| Pasangan | Rasio | Hasil | Aturan |
|---|---|---|---|
| Ink on Paper / Sand | 15.01 / 13.42 | AAA | Semua teks |
| Stone (neutral/600) on Paper / Sand | 5.29 / 4.74 | AA | Teks sekunder ≥ 14px |
| Paper on Night / Cocoa | 17.62 / 14.64 | AAA | Semua teks |
| Paper on Ink (CTA) | 15.01 | AAA | Tombol utama |
| Paper 65% on Night | 7.71 | AAA | Teks sekunder di Night (tetap, D-135) |
| White 50% / 35% on Night | 5.30 / 3.15 | AA / Large | Teks di Night minimal 50%; 35% hanya dekoratif |
| cocoa/300 on Night / Cocoa | 9.09 / 7.55 | AAA | Opsi teks sekunder hangat (`text-cocoa-soft`) |
| Ochre on Night / Cocoa | 4.84 / 4.02 | AA / Large | Di panel Cocoa, label kecil pakai ochre/400 (7.06) |
| Ochre on Paper / Sand | 3.64 / 3.26 | Large only | Label kecil di terang pakai ochre/700 #97571C (5.23 / 4.68) |
| White / Ink on Ochre | 3.96 / 4.12 | Large only | Hindari teks kecil di atas Ochre |
| Line (Ink 12%) on Paper | 1.27 | — | Dekoratif saja; border yang harus terlihat pakai Ink |

### 2.8 🎨 Token Color (Light Mode dipakai di web; Dark Mode dalam kurung)

| Grup | Token → Light Mode (Dark Mode) |
|---|---|
| Button | btn-primary → neutral-900 (neutral-0) · btn-primary-hover → neutral-800 (neutral-100) · btn-neutral → neutral-50 (cocoa-900) · btn-neutral-hover → neutral-100 (cocoa-800) · btn-white → neutral-0 (neutral-900) · btn-disabled → neutral-200 (neutral-700) |
| Background | bg-black → neutral-900 (neutral-0) · bg-cocoa-strong (Night) → cocoa-950 (neutral-50) · bg-cocoa-surface (Cocoa) → cocoa-900 (neutral-100) · bg-ochre-surface → ochre-600 (ochre-400) · bg-neutral-soft (Sand) → neutral-100 (cocoa-900) · bg-neutral-weak (Paper) → neutral-50 (cocoa-950) · bg-line → neutral-alpha-12 (white-alpha-12) · bg-white → neutral-0 (neutral-950) |
| Text | text-strong (Ink) → neutral-900 (neutral-50) · text-surface (Stone) → neutral-600 (neutral-400) · text-neutral-weak (Paper di atas gelap) → neutral-50 (neutral-900) · text-disabled → neutral-300 (neutral-700) · text-white → neutral-0 (neutral-900) · text-ochre-surface → ochre-600 (ochre-400) · text-cocoa-soft → cocoa-300 (cocoa-600) |
| Stroke | stroke-strong → neutral-900 (neutral-0) · stroke-surface (Line) → neutral-alpha-12 (white-alpha-12) · stroke-neutral-weak → neutral-50 (cocoa-950) · stroke-white → neutral-0 (neutral-900) |
| Icon | icon-strong → neutral-900 (neutral-0) · icon-surface → neutral-600 (neutral-400) · icon-disabled → neutral-300 (neutral-700) · icon-white → neutral-0 (neutral-900) |
| Logo | logo-primary → neutral-900 (neutral-50) |
| Sensor | sensor-heart-rate → green-base · sensor-sleep → blue-base · sensor-recovery → violet-base · sensor-off → red-base |

Nama lama → token: Paper = bg-neutral-weak / text-neutral-weak, Sand = bg-neutral-soft, Ink = text-strong / bg-black / btn-primary, Night = bg-cocoa-strong, Cocoa = bg-cocoa-surface, Ochre = bg-/text-ochre-surface, Stone = text-surface, Line = stroke-surface / bg-line.

Web memakai Light Mode. Dark Mode tercatat di Figma, tetapi tema gelap untuk website belum disetujui. Section gelap (Night) tetap memakai aturan kontras §2.5, bukan Dark Mode.

**Referensi asal warna:**
- [Oura](https://ouraring.com/): Paper, Sand, Ink dari krem, sand, dan ink hangat.
- [Viture](https://www.viture.com/): satu bentuk glow lembut, dibuat dari Ochre.
- [Verra · Dribbble](https://dribbble.com/shots/25802987): Night + satu aksen; aksen lime-nya diganti Ochre.
- Avoly (referensi smart ring, cokelat espresso): dasar skala Cocoa, hue digeser ke walnut; hijaunya tidak dipakai.

---

## 3. Tipografi

**Dipilih: Option A — Geist + Geist Mono** (paket npm `geist`). Sumber text style (D-134): Figma Foundation → 🆃 Typography `10068:12435`.

| Peran | Font |
|---|---|
| Headline, angka besar | Geist Medium 500 (Display & Heading); letter spacing −3% dari ukuran, ditulis dalam px |
| Body | Geist Regular 400 (Paragraph) |
| Label, tombol | Geist Medium 500 (Label, Buttons) |
| Tag [ ], jam, nilai live | Geist Mono 11–16 px, letter spacing +8% (dalam px per style); Medium hanya untuk eyebrow |
| Wordmark / logo | Geist Medium |

**Alasan:** satu keluarga huruf untuk seluruh brand, termasuk logo yang di-laser-etch di ring. Satu weight per grup menjaga tampilan konsisten. Tidak ada weight Light/tipis (semangat D-082 tetap).

### 3.1 Text style (Desktop / Mobile)

| Text style | Font | Desktop size / LH / LS (px) | Mobile size / LH / LS (px) | Contoh pemakaian (usulan, belum disetujui) |
|---|---|---|---|---|
| Display/Display 1 | Geist Medium | 275.4 / 204 / −8.26 | 72 / 54 / −2.16 | Wordmark "STILLWAY" hero & footer |
| Display/Display 2 | Geist Medium | 160 / 152 / −4.8 | 72 / 68 / −2.16 | Kata besar ("rhythm", "keeps the pattern.") |
| Display/Display 3 | Geist Medium | 96 / 104 / −2.88 | 96 / 104 / −2.88 | Angka besar di layar app |
| Display/Display 4 | Geist Medium | 72 / 72 / −2.16 | 48 / 48 / −1.44 | Angka metrik (7h 12m) |
| Heading/Heading 1 | Geist Medium | 56 / 56 / −1.68 | 36 / 40 / −1.08 | Judul section & state |
| Heading/Heading 2 | Geist Medium | 32 / 36 / −0.64 | 24 / 28 / −0.48 | Sub-judul, nama produk & harga |
| Heading/Heading 3 | Geist Medium | 24 / 26 / −0.48 | 24 / 26 / −0.48 | Judul kartu di layar app |
| Label/Large | Geist Medium | 20 / 28 / −0.2 | sama | Logo navbar, penekanan |
| Label/Medium | Geist Medium | 16 / 24 / 0 | sama | Pertanyaan FAQ, nama finish |
| Label/Small | Geist Medium | 15 / 22 / 0 | sama | Link menu navbar |
| Label/X-Small | Geist Medium | 12 / 16 / 0 | sama | Label tebal di layar app |
| Paragraph/Large | Geist Regular | 20 / 28 / −0.2 | sama | Paragraf pengantar |
| Paragraph/Medium | Geist Regular | 16 / 24 / 0 | sama | Deskripsi & teks utama |
| Paragraph/Small | Geist Regular | 14 / 20 / 0 | sama | Catatan, teks kartu, footer |
| Paragraph/X-Small | Geist Regular | 12 / 16 / 0 | sama | Teks kecil di layar app |
| Buttons/Medium | Geist Medium | 16 / 24 / 0 | sama | Tombol utama (CTA) |
| Buttons/Small | Geist Medium | 15 / 22 / −0.15 | sama | Tombol navbar |
| Mono/Large | Geist Mono Regular | 16 / 22 / 1.28 | sama | Anotasi besar |
| Mono/Medium | Geist Mono Medium | 13 / 20 / 1.04 | sama | Eyebrow [ … ], tag, chip, jam navbar (kapital) |
| Mono/Small | Geist Mono Regular | 13 / 20 / 1.04 | sama | Daypart, label data (kapital) |
| Mono/X-Small | Geist Mono Regular | 11 / 16 / 0.88 | sama | "SIMULATED DATA", chip kecil (kapital) |

**Variable 🆃 Typography:** `Font Family/Heading` = Geist (Display, Heading), `Font Family/Body` = Geist (Label, Paragraph, Buttons), `Font Family/Mono` = Geist Mono; `Size/<key>`, `Line Height/<key>`, `Letter Spacing/<key>` (px); `Font Weight/Regular · Medium`.

**Aturan:**
- Teks di web memakai text style di atas. Teks yang tidak cocok dengan style mana pun dilaporkan ke pengguna, tidak diberi ukuran baru.
- Kapital hanya untuk label Mono (eyebrow, tag, chip) dan wordmark "STILLWAY"; kalimat sans selalu sentence case.
- Peralihan Desktop → Mobile (D-135): Display dan Heading memakai `clamp()` dari nilai Mobile (390) ke Desktop (1440); Label, Paragraph, Buttons, dan Mono satu nilai di semua lebar layar.

**Catatan Figma:** komponen Header/Title Documentation di halaman Foundation masih terikat variabel template (`Font Family/Heading` = Inter, `Body` = DM Sans, `heading_1` = 36/48). Itu bukan nilai Stillway; acuan tetap tabel di atas.

- Option B (Newsreader Light + DM Sans) dan Option C (Hanken Grotesk + Inter): tidak dipilih.

| Referensi | Yang diambil |
|---|---|
| [Oura](https://ouraring.com/why-oura) | Leading rapat untuk headline, satu baris per layar (serif-nya tidak dipakai) |
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

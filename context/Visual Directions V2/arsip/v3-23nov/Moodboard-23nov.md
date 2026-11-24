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
| [Viture Pro 2](https://www.viture.com/pro2) | Kartu kaca besar (blur, gradien terang ke gelap, radius besar), tag pill, angka ringan, garis pemisah tipis | Kartu insight Section 05 (432 px, radius 40, background blur 60). Warna oranye dan layout produk **tidak** dipakai |

---

## 2. Warna

> **Sumber kebenaran token:** variable Figma (🌈 Primitive Color, 🎨 Token Color, 🆃 Typography) dan dokumentasinya di halaman Foundation. Tabel di dokumen ini adalah salinan teks untuk dev; kalau berbeda, Figma Foundation yang dipakai. Di section Moodboard Figma, blok skala, kontras, turunan, LED, eksplorasi aksen, dan type scale lama sudah dihapus supaya tidak dobel.

### 2.1 Main colors: 6 warna (+ Stone & Line turunan, §2.3)

| Token | Hex | Peran | Dipakai di |
|---|---|---|---|
| `--paper` | #F9F5EF | Background terang | Akhir Hero, Why Stillway, Product details, The app |
| `--sand` | #F0E8DD | Background terang kedua | Tile dan alas di Product details, Specs & benefits, Finishes; kartu, panel, chip |
| `--ink` | #231F20 | Teks + tombol utama | Headline, body, tombol CTA di background terang |
| `--night` | #1B0B06 (cocoa/950) | Background gelap | Sleep summary, Activity & rest, Features, Closing/FAQ/footer |
| `--cocoa` | #341C12 (cocoa/900) | Background gelap kedua | Panel, kartu & glow di section gelap; peralihan ke Dusk (pasangan gelap dari Sand) |
| `--ochre` | #B76F20 | Satu-satunya aksen | Label, tag [ ], chip aktif, progress, data live, scroll marker, glow |

**Proporsi di seluruh halaman:** Paper ±40% · Night ±25% · Sand ±15% · Cocoa ±10% · Ink ±8% · Ochre ≤ 2%.
- Ochre tidak pernah jadi background penuh dan tidak pernah jadi warna tombol utama.

### 2.2 Color palette (skala 50–950)

Main colors di atas tetap. Skala ini mengikuti pola uicolors.app / Tailwind (dibuat di OKLCH). Di Figma skala ini ada di collection **🌈 Primitive Color** (format template: `Neutral/0–950`, Primary `Ochre/50–950`, Secondary `Cocoa/50–950`), dan dipakai lewat token di **🎨 Token Color** (lihat §2.8). Collection lama "Stillway · Color" sudah dihapus (23 Nov).

| Skala | White | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Neutral (warm)** | #FFFFFF | #F9F5EF (Paper) | #F0E8DD (Sand) | #DFD6CA | #C9BFB5 | #A9A097 | #867F78 | #6B655F | #554E4A | #3C3733 | #231F20 (Ink) | #17120F |
| **Ochre** | — | #FEF6E7 | #FDEACC | #FBD6A1 | #F3BA6D | #E89D3D | #D5851B | #B76F20 (Ochre) | #97571C | #79451C | #62371C | #3A1E0E |
| **Cocoa (walnut)** | — | #FDF4EE | #F7E6DB | #E9CCBB | #D4AA94 | #BA886F | #A16A50 | #83513A | #653B29 | #49291B | #341C12 (Cocoa) | #1B0B06 (Night) |

**Cocoa (walnut)** terinspirasi referensi Avoly, tapi hue-nya digeser lebih hangat ke walnut/umber (bukan mauve) supaya tidak sama persis dan lebih senada dengan Neutral & Ochre. Hijaunya tidak dipakai. Pemakaian:
- **Background gelap diambil dari Cocoa:** Night = cocoa/950, Cocoa = cocoa/900.
- Glow di belakang ring di section gelap (Sleep, Activity, Features): cocoa/700 → cocoa/950, bukan ochre.
- cocoa/300 untuk highlight metal hangat dan teks sekunder di atas Night; cocoa/800–900 untuk kartu/panel gelap.
- Ochre tetap satu-satunya aksen (label, data aktif, Ember glow). Dusk sekarang dari Cocoa.
- Activity & rest: glow cocoa/700 → Night dari kiri bawah (menggantikan glow oranye).

**Cocoa disesuaikan (23 Nov):** chroma dinaikkan (OKLCH C ±0.03–0.08, hue 42–60) supaya jelas cokelat walnut dan tidak mirip Neutral lagi; lightness tiap step tetap. Night jadi #1B0B06, Cocoa #341C12.

**Paper & Sand disesuaikan (20 Nov):** Paper #F7F5F0 → #F9F5EF dan Sand #EFE6DB → #F0E8DD, supaya hue & saturasinya satu keluarga dengan step neutral lain (sebelumnya Paper terlalu kekuningan/abu dan Sand terlalu oranye).

#### Keterbacaan (WCAG 2.2)

Teks kecil ≥ 4.5:1 (AA), teks besar (≥ 24px / 19px bold) & elemen UI ≥ 3:1, AAA ≥ 7:1.

| Pasangan | Rasio | Hasil | Aturan |
|---|---|---|---|
| Ink on Paper | 15.01 | AAA | Semua teks |
| Ink on Sand | 13.42 | AAA | Semua teks |
| Stone (neutral/600) on Paper / Sand | 5.29 / 4.74 | AA | Teks sekunder ≥ 14px |
| Paper on Night | 17.62 | AAA | Semua teks |
| Paper on Cocoa | 14.64 | AAA | Teks di panel gelap |
| Paper on Ink (CTA) | 15.01 | AAA | Tombol utama |
| White 62% / 50% / 35% on Night | 7.60 / 5.30 / 3.15 | AAA / AA / Large | Teks di Night minimal 50%; 35% hanya dekoratif |
| cocoa/300 on Night / Cocoa | 9.09 / 7.55 | AAA | Teks sekunder hangat |
| Ochre on Night | 4.84 | AA | Label & data di gelap |
| Ochre on Cocoa | 4.02 | Large only | Di panel Cocoa: label kecil pakai ochre/400 |
| Ochre on Paper / Sand | 3.64 / 3.26 | Large only | ✗ untuk label kecil → pakai ochre/700 (#945920, 5.21:1) |
| White on Ochre | 3.96 | Large only | Hanya teks ≥ 24px; tombol ochre pakai teks Ink |
| Line (Ink 12%) on Paper | 1.27 | — | Dekoratif saja; border yang harus terlihat pakai Ink |

**Aksen (diputuskan 23 Nov):** Ochre tetap jadi aksen (Primary di variable). Eksplorasi aksen pengganti (Amber, Copper, Bronze, Saffron, Champagne, Rose Clay) ditutup dan dihapus dari Moodboard.

### 2.3 Turunan (bukan warna baru)

| Nama | Rumus | Pakai |
|---|---|---|
| Stone | neutral/600 #6B655F (solid, bukan opacity; 23 Nov) | Teks sekunder, caption |
| Line | Ink 12% (≈ #DBD5CC) | Divider, border kartu |
| Dawn glow | Ochre 35% → 0, diblur, di belakang ring di atas Paper | Satu bentuk per section |
| Ember glow | Ochre 40% → 0, diblur, dari atas di atas Night | Closing, Features |
| Dusk (cocoa) | Radial cocoa/600 → cocoa/700 → Night, dari kiri bawah (bukan ochre lagi, 20 Nov) | Hanya Daily insight (17:30), jembatan siang → malam |

### 2.4 Warna lampu produk (bukan warna UI)

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

### 2.5 Background per section

| S01 | S02 | S03 | S04 | S05 | S06 | S07 | S08 | S09 | S10 | S11 |
|---|---|---|---|---|---|---|---|---|---|---|
| Foto pagi → Paper | Paper | Night | Night + cocoa glow | Dusk (cocoa) | Paper + alas Sand | Sand → foto full-bleed | Night | Paper | Sand | Night + Ember glow |

### 2.6 Aturan
- **Kontras teks:** teks di atas Paper/Sand = Ink; teks di atas Night = Paper.
- **Ochre:** satu elemen ochre per tampilan (label, tag, atau garis progress).
- **Glow:** ochre opacity rendah, diblur, di belakang ring, tidak pernah di atas ring.
- **Jangan:** biru, kuning, lime, peach, atau warna tambahan di UI.

### 2.7 Token CSS
```css
:root{
  /* skala */
  --neutral-white:#FFFFFF; --neutral-50:#F9F5EF; --neutral-100:#F0E8DD; --neutral-200:#DFD6CA; --neutral-300:#C9BFB5; --neutral-400:#A9A097;
  --neutral-500:#867F78; --neutral-600:#6B655F; --neutral-700:#554E4A; --neutral-800:#3C3733; --neutral-900:#231F20; --neutral-950:#17120F;
  --ochre-50:#FEF6E7; --ochre-100:#FDEACC; --ochre-200:#FBD6A1; --ochre-300:#F3BA6D; --ochre-400:#E89D3D; --ochre-500:#D5851B;
  --ochre-600:#B76F20; --ochre-700:#97571C; --ochre-800:#79451C; --ochre-900:#62371C; --ochre-950:#3A1E0E;
  --cocoa-50:#FDF4EE; --cocoa-100:#F7E6DB; --cocoa-200:#E9CCBB; --cocoa-300:#D4AA94; --cocoa-400:#BA886F; --cocoa-500:#A16A50;
  --cocoa-600:#83513A; --cocoa-700:#653B29; --cocoa-800:#49291B; --cocoa-900:#341C12; --cocoa-950:#1B0B06;
  /* main colors (alias) */
  --paper:var(--neutral-50); --sand:var(--neutral-100); --ink:var(--neutral-900); --night:var(--cocoa-950); --cocoa:var(--cocoa-900); --ochre:var(--ochre-600);
  --stone:var(--neutral-600); --line:rgba(35,31,32,.12);
  /* lampu produk, bukan UI */
  --led-heart-rate:#34E07A; --led-sleep:#3B8CFF; --led-recovery:#A06BFF; --led-off:#FF3B30;
}
```

### 2.8 Variable Figma (format template, 23 Nov)

Format nama sama dengan template untuk semua project; isinya warna Stillway. Dokumentasi: halaman Foundation → 🌈 Color Palette dan 🎨 Token Color System.

**🌈 Primitive Color** (nilai sama di Light/Dark)
- `Neutral/0` (white) + `Neutral/50–950`: skala warm neutral (§2.2).
- Primary `Ochre/50–950`, Secondary `Cocoa/50–950`.
- Accent (warna lampu sensor, satu tingkat saja): `Accent/green/green-base` #34E07A, `Accent/blue/blue-base` #3B8CFF, `Accent/violet/violet-base` #A06BFF, `Accent/red/red-base` #FF3B30.
- Alpha: `Alpha/neutral/neutral-alpha-12` (Line) dan `Alpha/white/white-alpha-12`. Teks sekunder tidak lagi memakai opacity (lihat text-surface).

**🎨 Token Color** (Light Mode = dipakai di Design; Dark Mode = versi terbalik untuk tema gelap)

| Grup | Token → Light Mode (Dark Mode) |
|---|---|
| Button | btn-primary → neutral-900 (neutral-0) · btn-primary-hover → neutral-800 (neutral-100) · btn-neutral → neutral-50 (cocoa-900) · btn-neutral-hover → neutral-100 (cocoa-800) · btn-white → neutral-0 (neutral-900) · btn-disabled → neutral-200 (neutral-700) |
| Background | bg-black → neutral-900 (neutral-0) · bg-cocoa-strong (Night) → cocoa-950 (neutral-50) · bg-cocoa-surface (Cocoa) → cocoa-900 (neutral-100) · bg-ochre-surface → ochre-600 (ochre-400) · bg-neutral-soft (Sand) → neutral-100 (cocoa-900) · bg-neutral-weak (Paper) → neutral-50 (cocoa-950) · bg-line → neutral-alpha-12 (white-alpha-12) · bg-white → neutral-0 (neutral-950) |
| Text | text-strong (Ink) → neutral-900 (neutral-50) · text-surface (Stone) → neutral-600 (neutral-400) · text-neutral-weak (Paper di atas gelap) → neutral-50 (neutral-900) · text-disabled → neutral-300 (neutral-700) · text-white → neutral-0 (neutral-900) · text-ochre-surface → ochre-600 (ochre-400) · text-cocoa-soft → cocoa-300 (cocoa-600) |
| Stroke | stroke-strong → neutral-900 (neutral-0) · stroke-surface (Line) → neutral-alpha-12 (white-alpha-12) · stroke-neutral-weak → neutral-50 (cocoa-950) · stroke-white → neutral-0 (neutral-900) |
| Icon | icon-strong → neutral-900 (neutral-0) · icon-surface → neutral-600 (neutral-400) · icon-disabled → neutral-300 (neutral-700) · icon-white → neutral-0 (neutral-900) |
| Logo | logo-primary → neutral-900 (neutral-50) |
| Sensor | sensor-heart-rate → green-base · sensor-sleep → blue-base · sensor-recovery → violet-base · sensor-off → red-base |

Nama lama → token: Paper = bg-neutral-weak / text-neutral-weak, Sand = bg-neutral-soft, Ink = text-strong / bg-black / btn-primary, Night = bg-cocoa-strong, Cocoa = bg-cocoa-surface, Ochre = bg-/text-ochre-surface, Stone = text-surface, Line = stroke-surface / bg-line, White = text-white / bg-white / btn-white.

**Aturan:** grup atau tingkat yang tidak ada di project dihapus (tidak ada orange, yellow, pink, overlay, loading skeleton di Stillway). Semua warna di Design memakai token ini; setiap perubahan variable juga diupdate di dokumentasi Foundation.

**Referensi asal warna:**
- [Oura](https://ouraring.com/): Paper, Sand, Ink dari krem, sand, dan ink hangat.
- [Viture](https://www.viture.com/): satu bentuk glow lembut, dibuat dari Ochre.
- [Verra · Dribbble](https://dribbble.com/shots/25802987): Night + satu aksen; aksen lime-nya diganti Ochre.
- Avoly (referensi smart ring, coklat espresso): jadi dasar skala Cocoa, hue digeser ke walnut supaya tidak sama; hijaunya tidak dipakai.

---

## 3. Tipografi

**Dipilih: Option A — Geist + Geist Mono** (paket npm `geist`).

| Peran | Font |
|---|---|
| Headline, angka besar | Geist Medium (Display & Heading), tracking −3% (Display) |
| Body, label, tombol | Geist Regular (Paragraph) / Medium (Label, Buttons) |
| Tag [ ], jam, nilai live | Geist Mono 11–16 px, letter spacing +8% (dalam px per style) |
| Wordmark besar / logo navbar | Geist Medium: wordmark Display 1 (−3%), logo navbar Label/Large (−0.2 px) |

**Alasan:** satu keluarga huruf untuk seluruh brand, termasuk logo yang di-laser-etch di ring. Satu weight per grup (Display dan Heading Medium, Paragraph Regular) menjaga tampilan tetap konsisten.

### 3.1 Skala tipe (dikunci 20 Nov, format template 23 Nov) — text style Figma

Aturan: **semua teks di Design memakai text style**, tanpa ukuran lepas dan tanpa kapital manual. Kapital hanya untuk label Mono (eyebrow, tag, chip) dan wordmark "STILLWAY"; caption, judul, dan kalimat sans selalu sentence case.

Text style di Figma mengikuti format template (grup per fungsi), ukurannya skala Stillway. Style template lama (Inter / DM Sans) sudah dihapus.

| Text style | Font | Size / LH (px) | Letter spacing (px) | Variable | Dipakai untuk |
|---|---|---|---|---|---|
| Display/Display 1 | Geist Medium | 275.4 / 204 | −8.26 | display_1 | Wordmark "STILLWAY" hero & footer |
| Display/Display 2 | Geist Medium | 160 / 152 | −4.8 | display_2 | Teks besar (kata latar S02, "Through the day.", "see your night.") |
| Display/Display 3 | Geist Medium | 96 / 104 | −2.88 | display_3 | Angka besar di layar app |
| Display/Display 4 | Geist Medium | 72 / 72 | −2.16 | display_4 | Angka metrik (7h 12m, jam aktif S04) |
| Heading/Heading 1 | Geist Medium | 56 / 56 | −1.68 | heading_1 | Judul section & state |
| Heading/Heading 2 | Geist Medium | 32 / 36 | −0.64 | heading_2 | Sub-judul, label state S07, nama produk & harga |
| Heading/Heading 3 | Geist Medium | 24 / 26 | −0.48 | heading_3 | Judul kartu di layar app |
| Label/Large | Geist Medium | 20 / 28 | −0.2 | label_lg | Logo navbar, penekanan 20 |
| Label/Medium | Geist Medium | 16 / 24 | 0 | label_md | Pertanyaan FAQ, nama finish |
| Label/Small | Geist Medium | 15 / 22 | 0 | label_sm | Link menu navbar |
| Label/X-Small | Geist Medium | 12 / 16 | 0 | label_xs | Label tebal di layar app |
| Paragraph/Large | Geist Regular | 20 / 28 | −0.2 | para_lg | Paragraf pengantar, caption S07 |
| Paragraph/Medium | Geist Regular | 16 / 24 | 0 | para_md | Deskripsi & teks utama |
| Paragraph/Small | Geist Regular | 14 / 20 | 0 | para_sm | Catatan, teks kartu, footer |
| Paragraph/X-Small | Geist Regular | 12 / 16 | 0 | para_xs | Teks kecil di layar app |
| Buttons/Medium | Geist Medium | 16 / 24 | 0 | btn_md | Tombol utama (CTA) |
| Buttons/Small | Geist Medium | 15 / 22 | −0.15 | btn_sm | Tombol navbar "Find your size" |
| Mono/Large | Geist Mono Regular | 16 / 22 | 1.28 | mono_lg | Anotasi kanvas Figma (meta & label state) |
| Mono/Medium | Geist Mono Medium | 13 / 20 | 1.04 | mono_md | Eyebrow [ … ], tag, chip, jam navbar (kapital) |
| Mono/Small | Geist Mono Regular | 13 / 20 | 1.04 | mono_sm | Daypart navbar, label data, label jam di busur S04 (kapital) |
| Mono/X-Small | Geist Mono Regular | 11 / 16 | 0.88 | mono_xs | "SIMULATED DATA", chip kecil (kapital) |

**Variable 🆃 Typography** (mode Desktop / Mobile), format sama dengan template: `Font Family/Heading` = Geist (Display, Heading), `Font Family/Body` = Geist (Label, Paragraph, Buttons), `Font Family/Mono` = Geist Mono; `Size/<key>`, `Line Height/<key>`, `Letter Spacing/<key>` (key di tabel, semua dalam px); `Font Weight/Regular · Medium`. Nilai mobile yang berbeda: display_1 72 / 54 / −2.16, display_2 72 / 68 / −2.16, display_4 48 / 48 / −1.44, heading_1 36 / 40 / −1.08, heading_2 24 / 28 / −0.48.

**Aturan:**
- Satu weight per grup: Display Medium, Heading Medium, Label Medium, Paragraph Regular, Buttons Medium. Mono punya Regular dan Medium (Medium hanya untuk eyebrow).
- Letter spacing ditulis dalam px (bukan %) supaya langsung dipakai dev. Display memakai −3% dari ukurannya, dihitung ke px per ukuran desktop/mobile.
- Nama ukuran sama dengan template: Medium = 16 px di semua grup, Large = 20, Small = 15 (Label, Buttons) atau 14 (Paragraph), X-Small = 12. Heading diberi nomor 1–3 dari yang terbesar, Display 1–4. Tingkatan hanya yang dipakai di Stillway; tambahkan X-Large / 2X-Large di atas Large bila nanti ada ukuran baru.
- Semua teks di Design memakai text style; style yang tidak terpakai dihapus.
- Setiap perubahan text style atau variable juga diupdate di halaman Foundation → 🆃 Typography (tabel style + tabel Variables).

- Option B (Newsreader Light + DM Sans) dan Option C (Hanken Grotesk + Inter): tidak dipilih.

| Referensi | Yang diambil |
|---|---|
| [Oura](https://ouraring.com/why-oura) | Bobot ringan dan leading rapat untuk headline, satu baris per layar (serif-nya tidak dipakai) |
| [Oryzo](https://oryzo.ai/) | Satu baris besar saja (Why Stillway), bukan suara dasar |
| [Shift Robotics](https://shiftrobotics.io/) | Chip mono huruf besar untuk tag [ UKURAN ], [ SENSOR ] |
| [Sensiq](https://sensiq.co/) | Kicker kecil + headline besar, skala kartu data |

---

## 4. Brand & logo

- **Logo = wordmark saja (teks):** "Stillway" dalam Geist Medium (text style Label/Large 20/28, letter spacing −0.2 px). Tanpa ring mark / ikon.
- **Wordmark yang sama** dipakai di navbar dan di-laser-etch tone-on-tone kecil di sisi luar ring.
- **Wordmark besar (hero & footer):** selalu kapital "STILLWAY", Geist Medium 275, selebar layar (x 40–1400). Footer memakai style yang sama dengan hero, ditambah hover shine (revisi 20 Nov).
- **Semua render, cutout, foto, dan model 3D** harus memakai ring dengan engraving ini.
- **Referensi:** [Syne branding · Dribbble](https://dribbble.com/shots/27436741).
  - Brand board satu sistem.
  - Mark "O" + wordmark polos.
  - Nama di-engrave di ring.

---

**Ikon:** semua ikon diambil dari library Figma halaman **Icon Base** (24 px, stroke), warna lewat token Icon/* (mis. icon-white di atas foto). Jangan menggambar ikon sendiri.

---

## 5. Mobile app (UI di dalam website)

UI app dipakai di Section 05 (kartu kaca di lubang ring, spesifikasi di `Storyboard.md` bagian 05) dan Section 09 (HP di tengah). Semuanya HTML, bukan gambar.

| Pola | Referensi | Untuk Stillway |
|---|---|---|
| Onboarding & home | [Oura app · Dribbble](https://dribbble.com/shots/26827839) | Foto ring + satu angka |
| Screen set | [Smart Ring App · Dribbble](https://dribbble.com/shots/27202999) | Kartu krem, teks ink, ochre untuk satu nilai live |
| Timed insight + satu angka | [Ultrahuman](https://www.ultrahuman.com/ring/) | Nudge "23:10 · Settled", lalu 7h 12m |
| Detail metrik | [Oura app · Dribbble](https://dribbble.com/shots/26970862) | Satu nilai besar, unit kecil, satu kalimat |
| Grafik | sama | Garis ink tipis di atas krem, titik ochre untuk "sekarang", tanpa grid |
| Blok warna | sama | Panel gradient Dawn/Ember, bukan oranye datar |

Di Section 09, titik di tiap kartu memakai warna lampu (§2.4; token Sensor/*): hijau Heart rate, biru Sleep, ungu Recovery.

---

## 6. Referensi per section (Moodboard Layout)

### 6.0 Grid & spacing (dikunci 20 Nov, berlaku di semua frame Design 1440)

| Aturan | Nilai |
|---|---|
| Grid | 12 kolom · margin kiri/kanan 40 · kolom 84 · gutter 32 (kolom n mulai di x = 40 + (n−1)×116) |
| Konten atas | Layout rata atas mulai y 144 (navbar 76 + 68). Layout rata tengah: pusat konten utama di **y 482** = tengah antara bawah navbar (64) dan bawah frame (900), jadi jarak atas = jarak bawah (revisi 20 Nov). Footer/progress tetap menempel di bawah (berakhir y 860) |
| Konten bawah | Baris bawah berakhir di y 860 (margin bawah 40) |
| Container | Semua konten di frame `Content` auto layout, padding 40 kiri/kanan/bawah |
| Spacing | Kelipatan 4/8: 8 · 12 · 16 · 24 · 32 · 48 · 64 |
| Day arc S04 | Busur R 1340 (pusat 720/1758, 12° per foto) · foto aktif 264×352 di puncak · foto lain 176×236 mengikuti busur · jam + status di bawah foto aktif · foto + jam berpusat di y 482 |
| S10 | Tile 560 + panel di tengah vertikal terhadap tile |


Tiga referensi per section, urut kiri → kanan sesuai Figma. Sticky note di tiap row juga punya daftar **LINKS** yang bisa diklik.

**01 · Hero:** pagi, 06:50
1. [Oryzo](https://oryzo.ai/): wordmark raksasa selebar layar, objek di depannya (State 1).
2. [Oura](https://ouraring.com/): hierarki copy yang tenang: satu baris Geist ringan, daftar pendek, bukan kartu fitur.
3. [Viture](https://www.viture.com/): satu cahaya hangat yang berasal dari foto pagi itu sendiri, tidak pernah dilukis di atas ring.

Visual hero mengikuti build: foto pagi (batu + moss), wordmark putih raksasa, ring 3D di atas batu, lalu kamera masuk lewat lubang ring.

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
Layout Day arc (dipilih 23 Nov).
1. [MotionSites](https://motionsites.ai/) "Coastal Cards": kartu foto berjajar di busur, kartu aktif di puncak (State 1).
2. [Osmo](https://www.osmo.supply/resource/radial-cards-slider-gsap) "Radial Cards Slider": busur berputar mengikuti scroll, kartu berikutnya naik ke puncak (State 2–4).
3. [Ultrahuman](https://www.ultrahuman.com/ring/): satu angka besar (jam) per langkah, digit bergulir (State 1–5).

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
2. [Obsidian Assembly](https://obsidianassembly.com/): satu kartu fokus, judul (I)–(IV), counter 1/4, garis orbit, layout simetris di sumbu y 482, tanpa kartu data (State 3–6).
3. [Obsidian Assembly](https://obsidianassembly.com/): kartu terbuka jadi foto full-bleed "The everyday." (State 7).

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
3. [Oryzo](https://oryzo.ai/): statement caps + footer di kanvas yang sama, diakhiri logo wordmark selebar layar (State 4).

---

## 7. Competitor moodboard (ringkas)

Frame "Competitor Moodboard — Stillway (merged)" menggabungkan analisa kompetitor lama dan baru. Tabel "Page structure" di sana sudah sesuai dengan 11 section di atas. Pola utama yang diambil:
- **Produk sebagai tokoh** (Aevion / Riotters): objek yang sama hadir di setiap bab.
- **Panggung gelap yang mengisolasi produk, teks mengapit objek** (Oryzo).
- **Satu klaim besar per layar** (Viture).
- **Produk di tangan tanpa background** (Sofi, Sensiq).

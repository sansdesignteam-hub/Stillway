# Handoff visual V2 — Stillway Home (`web-v2/`)

Dari: Visual Director · Untuk: Developer (juga 3D Designer dan Strategy Director) · 19 November 2026
Status dokumen: **handoff rev 2** (19 Nov 2026), diperbarui sesuai D-061–D-070. Dasar: D-059, D-060, D-061–D-070.

### Keputusan yang sudah disetujui dan berlaku di handoff ini

| ID | Ringkas | Bagian |
|---|---|---|
| D-061 | Logo di ring = **teks "Stillway" saja**, engrave tone-on-tone, vertikal mengikuti band (ref `design/v2/references/ring-logo-engrave-ref.png` di checkout main) | §1.4, §5 |
| D-062 | Lampu hanya di **jendela A** (hijau/biru/ungu); merah hanya menandai ring mati | S08, §5 |
| D-063 | **Satu canvas WebGL `position: fixed`**, satu ring, pose per section dari timeline scroll | §3 |
| D-064 | Aset V2 = **studio Paper/Sand**; moss rock V1 tidak dipakai (termasuk Everyday S07), kecuali 5 foto C-02 di S04 | §4, §5 |
| D-065 | Aset baru diproduksi Visual Director (`gpt-image-bridge`), karakter **C-02**, setelah render acuan ring berlogo | §6 |
| D-066 | Copy V2 = `context/home-copy-v2.md` (branch Strategic-Content). **Readiness 82 dihapus** dari S09. Data simulasi + durasi S04 (walk 25, stretch 15, stairs 20 min) disetujui | S04, S09 |
| D-067 | Spesifikasi tampil **tanpa `*` / label Illustrative**: 7 hari, 100 m, 4 g / 2,6 mm, ukuran 6–13, iPhone & Android, $299. Disclaimer concept project di footer tetap | S07, S10 |
| D-068 | "30-night trial" dan FAQ retur = kebijakan konsep | S11 |
| D-069 | CTA "Find your size" (navbar, S11) → S10; tombol S10 "Choose {finish} · $299" hanya memunculkan catatan concept; finish **hanya klik swatch**; footer **tanpa form/newsletter/share**; mobile tetap pin + scrub, S07 & S09 lebih ringan, ring tetap 3D, S10 swipe | §1.5, S07, S09, S10, S11, Mobile |
| D-070 | Vercel `stillway-v2` setelah S01–S03; file 3D V2 di `design/3d/v2/` | §5 |

Bagian yang mengikuti keputusan di atas ditandai **[D-0xx disetujui]**. Label [U] yang tersisa tetap usulan.

Catatan label "Simulated data": D-067 hanya membebaskan **angka spesifikasi produk** dari tanda `*`/Illustrative. Angka app/tidur (S03, S04, S05, S09) tetap memakai "Simulated data" (home-copy-v2).

## 0. Cara membaca

Sumber, urut prioritas (sesuai `visual-direction-v2.md`):
1. Figma "Website AI - 1 Ring" — Moodboard (`40004110:50`), Storyboard 1 (`40004136:50`), Storyboard 2 (`40004036:51`)
2. `context/Visual Directions V2/Storyboard.md` dan `Moodboard.md` (folder di checkout main; belum masuk git saat dokumen ini ditulis)
3. `visual-direction-v2.md`
4. Dokumen ini (penerjemahan ke spesifikasi build + usulan)

Label status di setiap baris:

| Label | Arti |
|---|---|
| **[F]** | Dari Figma / dokumen V2. Arah yang sudah disetujui (D-059). Ikuti apa adanya. |
| **[U]** | Usulan Visual Director. **Belum disetujui pengguna.** Boleh dipakai sebagai default sementara, tapi taruh di satu tempat (token/konstanta) supaya mudah diganti. |
| **[?]** | Pertanyaan terbuka. Jangan ditebak; pakai placeholder dan tandai di kode. |

Catatan penting tentang Figma: Storyboard 2 berisi **panel storyboard per state** (thumbnail ±420 px dengan catatan), **bukan** frame layout 1440 / 390 yang siap diukur. Jadi semua angka posisi/ukuran di §2 yang tidak bertanda [F] adalah usulan [U] yang diturunkan dari komposisi panel. Figma juga **tidak punya variables/styles** (`get_variable_defs` kosong); token di §1 diambil dari teks Moodboard dan swatch Branding.

Aturan umum yang tetap berlaku:
- Semua teks di website berbahasa Inggris (D-021). **Sumber copy = `context/home-copy-v2.md` [D-066 disetujui]**; copy yang dikutip di dokumen ini hanya penunjuk layout. Jika berbeda, ikuti home-copy-v2.
- Angka app/tidur = contoh → label **"Simulated data"**. Angka spesifikasi produk tampil tanpa `*` [D-067 disetujui]. Jangan menambah klaim kesehatan.
- `web/` (V1) dibekukan. Modul/aset V1 boleh **disalin** ke `web-v2/`, tidak boleh diubah di tempat (D-059).

---

## 1. Token

### 1.1 Warna [F]

Palet UI hanya 5 warna. Tidak ada warna lain di UI.

```css
:root {
  /* UI — 5 warna (Moodboard §2.1, swatch Branding) */
  --paper: #F7F5F0;   /* bg terang ±45% */
  --sand:  #EFE6DB;   /* bg terang kedua, tile, kartu, panel, chip ±15% */
  --ink:   #231F20;   /* teks + tombol utama di bg terang ±8% */
  --night: #17120F;   /* bg gelap ±30% */
  --ochre: #B76F20;   /* satu-satunya aksen, ≤2%, maks. 1 elemen per tampilan */

  /* turunan (bukan warna baru) */
  --stone: rgba(35, 31, 32, .65);   /* ≈ #6B645C, teks sekunder */
  --line:  rgba(35, 31, 32, .12);   /* ≈ #DBD5CC, divider, border kartu */

  /* lampu produk — BUKAN warna UI */
  --led-heart-rate: #34E07A;
  --led-sleep:      #3B8CFF;
  --led-recovery:   #A06BFF;
  --led-off:        #FF3B30;
}
```

| Aturan [F] | Detail |
|---|---|
| Kontras | Teks di Paper/Sand = Ink. Teks di Night = Paper. |
| Ochre | Label, tag `[ ]`, chip aktif, progress, nilai live, scroll marker, glow. **Tidak pernah** background penuh, **tidak pernah** warna tombol utama. |
| LED | Hanya (a) cahaya di **jendela A** ring [D-062 disetujui], (b) titik 6 px di legenda S08 dan chip/kartu S09. `--led-off` hanya untuk titik kecil di baris "Red means it's off." (tidak menyala di 3D). Tidak untuk teks, bg, tombol, grafik UI. Pengecualian [F]: grafik di layar app S09 memakai warna lampu (grafik HR hijau, tahap tidur biru, bar HRV ungu) — terlihat di panel Figma. |
| Dilarang | Biru, kuning, lime, peach, atau warna tambahan di UI. |

Gradient/glow [F] (rumus dari Moodboard §2.2; nilai CSS-nya [U]):

```css
/* [U] terjemahan CSS; bentuk dan opasitas dari Moodboard [F] */
--dawn-glow:  radial-gradient(closest-side, rgb(183 111 32 / .35), transparent); /* di belakang ring, di atas Paper; filter: blur(60–80px) */
--ember-glow: radial-gradient(ellipse at 50% 0%, rgb(183 111 32 / .40), transparent 60%); /* dari atas, di atas Night */
--dusk:       linear-gradient(180deg, var(--ochre) 0%, var(--night) 100%); /* hanya S05 (17:30) */
```

Glow **selalu di belakang ring**, satu bentuk per section, tidak pernah di atas ring [F].

Background per section [F]:

| S01 | S02 | S03 | S04 | S05 | S06 | S07 | S08 | S09 | S10 | S11 |
|---|---|---|---|---|---|---|---|---|---|---|
| Paper + Dawn glow | Paper | Night | Night | Dusk | Paper + alas Sand | Sand → foto full-bleed | Night | Paper | Sand | Night + Ember glow |

Warna kilau logo footer [F]: `#E9DCC8 → #FFFFFF → #F4C98E → #E9DCC8` (hanya untuk efek shine, bukan token UI).

### 1.2 Tipografi

Font [F]: **Geist + Geist Mono** (npm `geist`). V1 sudah memakai Geist Variable; V2 menambah Geist Mono.

| Peran [F] | Font | Catatan |
|---|---|---|
| Headline, angka besar | Geist Light 300, tracking −3% | Leading rapat, satu baris per layar |
| Body, kartu data, CTA | Geist Regular 400 / Medium 500 | |
| Tag `[ ]`, jam, nilai live | Geist Mono 400, 12–14 px, tracking lebar | Uppercase |
| Wordmark/logo | Geist Medium 500, tracking −3% | |

Rasio dari spesimen Figma (Typography → Option A, `40004117:72`) [F]: headline 96 / angka 112 / body 40 lh 1.5 / mono 28 tracking +8% / tag 32 tracking +6%. Spesimen digambar di papan moodboard besar, jadi **ukurannya bukan ukuran layar**, hanya proporsinya.

Skala layar [U] (desktop 1440 → mobile 390):

| Token [U] | Desktop 1440 | Mobile 390 | Font / lh / tracking |
|---|---|---|---|
| `--fs-giant` (wordmark hero, "rhythm", "keeps the pattern.", lockup footer) | 22–26vw (±320–370 px) | 26–30vw | Light (Medium untuk lockup), lh 0.85, −0.04em |
| `--fs-display` (headline section) | `clamp(48px, 6.6vw, 96px)` | 44–48 px | Light, lh 0.98, −0.03em |
| `--fs-number` (angka besar S03/S04/app) | `clamp(64px, 7.8vw, 112px)` | 56–64 px | Light, lh 0.9, −0.03em, `font-variant-numeric: tabular-nums` |
| `--fs-h3` (judul kartu, kalimat kecil) | 28–32 px | 22–24 px | Light/Regular, lh 1.15, −0.02em |
| `--fs-body` | 18 px | 16 px | Regular, lh 1.5, −0.005em |
| `--fs-small` | 14 px | 13 px | Regular, lh 1.45 |
| `--fs-mono` | 13 px | 12 px | Mono, uppercase, +0.08em |

### 1.3 Spacing, radius, layout [U]

Figma tidak mendefinisikan grid, spacing, atau radius sebagai token. Yang terlihat di Figma [F]: kartu app/kartu S07 bersudut membulat; transisi S06→S07 menganimasikan `border-radius 0 → 8px`; tombol CTA S11 berbentuk pill; tag `[ SENSOR · LAMPU ]` berupa chip outline ochre berbentuk pill.

```css
/* [U] */
--margin: clamp(16px, 2.8vw, 40px);   /* 40 di 1440, 16 di 390 */
--gutter: clamp(12px, 1.4vw, 20px);
--grid: 12 kolom desktop, 4 kolom mobile;
--space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
--space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px; --space-9: 96px;
--radius-s: 8px;     /* [F] kartu foto S07 (transisi 0 → 8px) */
--radius-m: 16px;    /* kartu app, panel S10, phone screen */
--radius-pill: 999px;/* tombol, chip, tag */
--header-h: 64px;
--ease-out: cubic-bezier(.16, 1, .3, 1);
--ease-shine: cubic-bezier(.22, .61, .36, 1); /* [F] hover logo */
```

### 1.4 Logo

**Di web (navbar, footer) [F]:** lockup **ring mark** (lingkaran tipis = band dilihat dari depan; tebal stroke [U] ±8% diameter, ukur ulang dari frame Branding) dengan **titik ochre** di posisi jam 12 + wordmark **"Stillway"** Geist Medium −3%. Footer: selebar layar, sedikit terpotong di bawah, dengan hover shine. Belum ada file SVG di Figma; **[U]** Developer membuat `logo.svg` dari Geist Medium (teks di-outline) + `<circle>`, Visual Director memeriksa.

**Di ring [D-061 disetujui]:** **teks "Stillway" saja, tanpa ring mark.** Mengikuti `design/v2/references/ring-logo-engrave-ref.png`:
- teks dibaca **vertikal**, searah lebar band (tegak lurus keliling), di sisi luar ring;
- **terukir/emboss tone-on-tone** di permukaan brushed: warnanya sama dengan logam, terbaca dari bayangan tepi huruf, bukan cat atau warna kontras;
- ukuran kecil, hanya mengisi ±60–70% lebar band;
- font Geist Medium = usulan sampai render 3D Designer ditinjau.
- Dibuat 3D Designer (Blender). Semua render, cutout, foto, dan model V2 memakai ring ini. Lockup web (ring mark + wordmark) **tidak** di-engrave di ring; ini mempersempit Moodboard §4.

### 1.5 Elemen global [F dari panel Storyboard]

- **Navbar** (tampil di semua section): lockup kecil kiri; 3 item navigasi di tengah-kanan; **jam waktu-hari** Geist Mono warna ochre di kanan. Di bg gelap teks Paper.
- **Rail progress scroll**: garis tipis vertikal di tepi kanan dengan titik ochre yang turun sesuai progres section.
- **Jam navbar** berganti per section: `06:50 → 07:10 → 23:10 → 07:40…15:30 → 17:30 → 21:00 → 22:00 → 06:50`. Pergantian jam terjadi di 70–100% tiap sambungan (§3).
- **CTA navbar "Find your size" → anchor ke S10 [D-069 disetujui].** Tombol pill kecil (Ink di bg terang, Paper di bg gelap). Item navigasi lain: ikuti home-copy-v2; usulan [U] `Rhythm` (→S03), `The ring` (→S06).
- Mobile [U]: lockup + jam + hamburger (pola panel menu V1 D-053); CTA "Find your size" ada di dalam panel menu.
- [U] Rail progress disembunyikan di mobile (< 720 px).

---

## 2. Spesifikasi per section

Format: tujuan · copy draf [F] · state [F] · layout 1440 / 390 · catatan. Persentase = progres scroll di dalam section yang di-pin. Semua animasi **scrub** mengikuti scroll, tidak autoplay, kecuali disebut [F].

Panjang pin [U]: 1 state ≈ 100vh scroll. Section 4-state = `+=300%`, 5-state = `+=400%`, 3-state = `+=200%`. Sambungan antar section (§3) memakai ±100vh tersendiri, atau digabung ke awal pin section berikutnya.

**Mobile [D-069 disetujui]:** semua section tetap **di-pin dan di-scrub** di mobile; **ring tetap 3D** (tanpa tilt mouse, seperti D-051); **S07 dan S09 dibuat lebih ringan**; rotasi ring S10 lewat **swipe**. Rincian "lebih ringan" [U]:
- S07: state 2 (4 kartu berjajar) jadi grid 2×2 kecil; garis orbit dan progress lingkaran disembunyikan, counter jadi teks `1/4`; panel mini tetap (UI kecil), pergantian kartu = crossfade, bukan tumpukan 3D.
- S09: deskripsi kanan digabung ke bawah HP; footer hanya progress + persen; isi layar HP tetap bergeser mengikuti scroll.
- Pin memakai `100svh`; panjang pin dikurangi ±25% dibanding desktop.

### S01 · Hero — 06:50 · Paper + Dawn glow

Copy [F]: "Understand your rhythm." / "A smart ring that brings your sleep, activity, and rest into one everyday view." / link "Explore Stillway".

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | Wordmark "Stillway" raksasa di belakang (opacity rendah), Dawn glow di belakang ring | Besar, center, "bernapas" scale 1 → 1.02 loop pelan (satu-satunya animasi autoplay) |
| 2 | 33 | Wordmark fade out + naik | Naik sedikit, rotateX/Y kecil; highlight bergeser |
| 3 | 67 | Headline fade out | Berputar menghadap kamera — **tes kualitas render pertama** |
| 4 | 100 | "rhythm" fade in opacity 0 → 4% | Kembali ke center, ukuran = S02 State 1 |

Layout [U]:
- **1440:** wordmark giant di tengah vertikal, terpotong kiri-kanan, opacity 8–10% Ink. Ring center, lebar ±34vw (State 1). Headline `--fs-display` + sub `--fs-body` rata kiri di kiri bawah (col 1–5), link "Explore Stillway" di bawahnya. Dawn glow ±60vw di belakang ring, sedikit di bawah center.
- **390:** wordmark 30vw, center. Ring lebar ±78vw di sepertiga atas-tengah. Headline + sub di bawah ring, rata kiri, margin 16.
- Akhir state 4: ring = 36% lebar layar (angka dari sambungan 02→03 [F]: scale 0.36 → 0.50).

### S02 · Why Stillway — 07:10 · Paper

Copy [F]: "Your body already keeps a rhythm." → "Most devices turn it into a score." → "Stillway just keeps the pattern." Paragraf kecil (draft): "Heart rate, temperature and sleep already move in a daily pattern." / "Scores, streaks and red alerts make rest feel like homework." / "No score to chase. Just what your days look like, kept quietly."

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | "rhythm" giant di belakang ring (opacity ±10%), label mono "WHY STILLWAY" kiri atas | Center, 3/4 |
| 2 | 33 | Kalimat 1 besar kiri, paragraf kecil kanan (3 kolom, pola Oryzo) | Berputar pelan ke kiri |
| 3 | 67 | Kalimat 2 crossfade menggantikan 1; kalimat 1 jadi baris kecil redup di atasnya; paragraf kanan berganti | Berputar lebih jauh |
| 4 | 100 | "keeps the pattern." selebar layar di belakang ring (pola Sofi); kalimat lengkap kecil kiri atas dengan **underline ochre** | Hampir menghadap kamera, menutupi tengah teks besar |

Layout [U]:
- **1440:** 3 kolom — kalimat `--fs-display` col 1–4, ring col 5–8 (±36vw), paragraf `--fs-body` col 10–12, dijajarkan ke baseline kalimat.
- **390:** ring tetap center (±70vw), kalimat di atas ring, paragraf di bawah ring; "keeps the pattern." dipecah dua baris giant.
- Underline ochre = satu-satunya ochre di tampilan ini (label "WHY STILLWAY" pakai Stone di state 4).

### S03 · Sleep summary — 23:10 · Night

Copy [F]: "Last night, in one view." · `[ SETTLED ] 23:10` · `[ RESTED ] 7h 12m` · `[ BROKEN ] 2×` · "Simulated data". Tanpa HP, app, foto, grafik.

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | Layar gelap, jam 23:10 | Center; hanya tepi kena cahaya dingin dari satu sisi (rim light) |
| 2 | 33 | SETTLED 23:10 fade in di kanan | Pindah ke kiri, berputar sangat pelan |
| 3 | 67 | RESTED 7h 12m muncul di bawahnya; angka 1 meredup | Tetap berputar pelan |
| 4 | 100 | BROKEN 2× muncul, lalu ketiganya fade out | Menghadap kamera |

Layout [U]:
- **1440:** ring col 1–6 (±40vw), angka bertumpuk di col 8–12: label mono di atas, angka `--fs-number`. Angka redup = opacity .35. Judul "Last night, in one view." `--fs-h3` di atas tumpukan. "Simulated data" mono kecil Stone di bawah.
- **390:** ring di atas (±60vw, setengah layar atas), angka di bawahnya, satu per state, rata kiri.
- Ochre hanya di label tag aktif.

### S04 · Activity & rest — 07:40 → 15:30 · Night

Ikuti build V1 (`web/src/components/Daylight.astro`), hanya peralihan masuk/keluar yang berubah [F].
Copy [F]: "ACTIVITY and rest." + "Through the day the ring keeps two quiet tallies: the time you spend moving and the moments you stop. Seen together they show the rhythm of a day."

| State [F] | % | Foto aktif | Status |
|---|---|---|---|
| 1 | 0 | 07:40 jalan | Moving · walk |
| 2 | 25 | 09:00 membaca + kopi | Resting · 40 min focus |
| 3 | 50 | 10:30 peregangan | Moving · stretch |
| 4 | 75 | 12:30 makan siang | Resting · 30 min lunch |
| 5 | 100 | 15:30 tangga | Moving · stairs → foto lain keluar ke kiri, bingkai putus-putus memudar, foto menggelap ke Dusk |

- **Durasi [D-066 disetujui]:** 07:40 walk **25 min** · 09:00 focus 40 min · 10:30 stretch **15 min** · 12:30 lunch 30 min · 15:30 stairs **20 min**. Teks persis ikuti home-copy-v2.
- Layout [F]: judul + paragraf kiri atas; filmstrip tengah (foto aktif besar dalam bingkai putus-putus, 4 foto kecil berjajar); jam besar + titik status + durasi + "Simulated data" kiri bawah; daftar jam kanan bawah (aktif terang).
- **1440 [U]:** foto aktif 4:5, tinggi ±62vh, center; foto kecil ±12vh. Bingkai `1px dashed rgb(247 245 240 / .4)`, offset 12 px.
- **390 [U]:** judul atas, foto aktif ±78vw lebar center, foto kecil jadi strip 5 titik/thumbnail di bawahnya; jam besar + status di bawah; daftar jam disembunyikan (cukup jam besar).
- Alt text V1 masih menyebut "a woman" padahal foto sudah C-02 (laki-laki, D-058). **Perbaiki alt text di V2.**

### S05 · Daily insight — 17:30 · Dusk

Copy [F]: "Everything it noticed. One calm view." Kartu app: `LAST NIGHT` · `7h 12m` · "Rested · settled 23:10" · progress bar · "Simulated data".

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | Dusk, judul kiri bawah | Besar di kanan-tengah (muncul saat foto 15:30 memudar) |
| 2 | 33 | Teks bergeser ke pinggir | Scale up, highlight tepi bergerak |
| 3 | 67 | Kartu app fade in di dalam lubang ring | Memenuhi layar (kamera masuk ke lubang ring, ±1.9× lebar layar) |
| 4 | 100 | Kartu app terbaca penuh | Diam |

- Kartu app = **HTML asli** (bisa dipilih), bukan gambar [F]. Kartu: bg Paper 92%, radius `--radius-m`, label mono ochre, angka `--fs-number` Light, progress bar ochre 2 px, teks kecil Stone.
- **1440 [U]:** kartu ±360 px lebar, center. **390 [U]:** kartu ±80vw.
- [U] Kamera masuk ke lubang ring paling realistis dilakukan di WebGL (lihat §5, 3D-3). Cadangan: scale DOM pada foto ring makro.

### S06 · Product details — 21:00 · Paper + alas Sand

Copy [F]: "Made to be forgotten." → "One quiet band" → "Softened edges" → "Then, it just fits." Tidak ada drag dan tidak ada pembahasan sensor di sini.

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 → 25 | Ring **menggelinding** dari kiri di atas alas, berhenti di tile; judul fade in di kiri | translateX + rotateZ (rotasi = jarak ÷ jari-jari), lewat ±10 px, goyang balik ±4°, diam menghadap kamera, logo di atas |
| 2 | 33 | Sisi samping, teks langkah 1 | rotateY ±90°, pantulan berubah |
| 3 | 67 | Dari tepi, teks langkah 2 | Miring 45°, pantulan memanjang |
| 4 | 100 | Foto tangan cut-out (satu jari terangkat) di kanan, "Then, it just fits." di kiri | Ring 3D turun dari ujung jari ke pangkal jari, lalu crossfade dengan ring di foto |

Detail gelinding [F]: scrub 0–25%, kurva `power2.out` + overshoot; jarak ±55% lebar (desktop), ±40% (mobile, mulai dari tepi kiri, berhenti di tengah); `rotation.z = −(x − xAkhir) / r`; bayangan kontak mengikuti x; HDRI studio diam supaya pantulan ikut berputar. Jalur B [F]: 40–60 frame render Blender di-scrub. Reduced motion: ring langsung diam di posisi akhir (fade 300 ms).

Layout:
- Panel Figma [F]: judul kiri (col 1–5), tile Sand kotak di kanan dengan ring di atasnya; label mono "BEAT 1/2/3" ochre di atas teks langkah.
- **1440 [U]:** tile Sand ±560×560 px, col 7–11, sudut 0 (tile = alas); alas Sand = strip horizontal penuh ±18vh di bawah tile, tempat ring menggelinding.
- **390 [U]:** judul atas, tile full-width di bawahnya (±90vw persegi). State 4: foto tangan di bawah judul, ±100vw lebar, jari mengarah ke atas.
- **Tangan State 4 [D-065 disetujui: foto cut-out C-02; pose = usulan, lihat `REPORT-v2-assets.md` A-1]:** tangan **kiri** C-02, punggung tangan menghadap kamera, jari menunjuk ke atas; **telunjuk** terangkat dan sedikit terpisah, tiga jari lain sedikit menekuk ke bawah, ibu jari rileks di kiri. Ring 3D turun vertikal sepanjang telunjuk dan berhenti di pangkal jari (proksimal), **logo menghadap kamera**, jendela sensor tersembunyi di sisi telapak. Bagian belakang ring ditutup **proxy jari** depth-only milik 3D Designer. Foto dikirim ke 3D Designer sebagai PNG alpha + koordinat sumbu telunjuk.
- [?] Storyboard §6.6: bg terang di jam 21:00 mungkin terasa janggal; cek setelah build.

### S07 · Specs & benefits — 21:00 · Sand → foto full-bleed

Copy [F]: "Through the day." · label pill mono "MADE FOR EVERY HOUR" · (I) Night "Sleeps with you. Charges while you don't." · (II) Desk "Sized to forget." · (III) Move "Light enough to lose track of." · (IV) Rinse "Hands in water. Ring stays on." · Penutup "The Everyday — Ring shown where it's worn." Tag: `[ SIZE ]`, `[ WEIGHT · THICKNESS ]`, `[ BATTERY ]`, `[ WATER RATING ]` (Figma menulis tag ini dalam bahasa Indonesia — **di web wajib Inggris**). Isi kartu dan panel mini: ikuti tabel S07 di home-copy-v2.

| State [F] | % | Isi |
|---|---|---|
| 1 | 0 | "Through the day" besar center + pill "MADE FOR EVERY HOUR" |
| 2 | 25 | "Through" ke kiri, "the day" ke kanan; 4 kartu foto potret masuk dari bawah, berjajar center dengan label mono kecil di bawah tiap kartu |
| 3 | 50 | (I) Night 1/4: kartu scale up ke center; kartu lain ditumpuk di belakang; judul "(I) Night" di atas garis tipis; caps kecil kiri + kanan; garis orbit dekoratif; counter 1/4 + progress lingkaran; panel putih kecil baterai 7 hari (bisa digeser per hari) |
| 4 | 75 | 2/4 Desk (slider ukuran) → 3/4 Move (bar berat 4 g) → 4/4 Rinse (rating air). Layout sama |
| 5 | 100 | Kartu mengecil; foto lingkungan di belakangnya membesar jadi full-bleed; "The Everyday" putih besar + caption "Ring shown where it's worn." |

Layout [U]:
- **1440:** kartu aktif 4:5, tinggi ±60vh, center; caps kiri di col 1–3 atas, paragraf kiri col 1–3 bawah, caps kanan col 10–12, counter + panel mini kanan bawah. Garis orbit = elips SVG `1px var(--line)` mengelilingi kartu.
- **390 [D-069 disetujui: versi lebih ringan]:** lihat rincian Mobile di atas §S01.
- Panel mini = UI asli, bg Paper, radius `--radius-m`, label mono, satu elemen ochre (hari/nilai aktif).
- **Angka spesifikasi [D-067 disetujui], tanpa `*`:** Up to 7 days · 100 m · about 4 g, 2.6 mm · sizes 6–13. Panel baterai per hari tetap berlabel "Simulated data" (home-copy-v2). Panel Figma masih menulis "5 ATM" dan `*` — **diganti** oleh D-067.
- Foto kartu dan foto full-bleed "The Everyday" = **studio Paper/Sand dengan karakter C-02** [D-064, D-065 disetujui]; komposisi di `REPORT-v2-assets.md` A-2 dan A-3. Panel Figma (moss rock) tidak berlaku lagi.

### S08 · Features — 21:00 · Night

Satu fitur: lampu sensor yang warnanya mengikuti scroll. Tanpa chip, hotspot, atau klik wajib [F].

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | "Inside the ring." kiri atas; jendela sensor hijau samar | Center, melayang pelan |
| 2 | 50 | "One light, tuned to the task." kiri tengah; legenda 3 warna (titik 6 px + label, bukan tombol); tag outline ochre `[ SENSOR · LIGHT ]` | Kamera dekat ke jendela sensor, ring besar di kanan, 3/4, diam |
| 3 | 100 | "Blue at night. Violet by morning."; legenda menandai warna aktif (tebal); satu baris kecil "Red means it's off." dengan titik merah | Posisi sama; hanya warna lampu |

Warna lampu vs scroll [F]: 25–50% hijau penuh; 50–75% → biru (penuh di ±75%); 75–100% → ungu. Interpolasi dari progres ScrollTrigger (`gsap.utils.interpolate`). Reduced motion: warna berganti langsung, tanpa denyut glow. Opsional desktop: klik label legenda untuk lompat ke posisi scroll.

**Satu jendela [D-062 disetujui]:** hanya **jendela A** yang menyala (hijau → biru → ungu). Jendela B gelap (tidak menyala). Titik merah **tidak** dirender di 3D; cukup baris copy "Red means it's off." dengan titik 6 px `--led-off`. Ini menggantikan catatan Figma tentang node `led_power`.

Render [F, disesuaikan D-062]: satu material/mesh lampu `led_main` di jendela A; `emissive` + intensitas 2–4; PointLight kecil sewarna di dalam ring agar memantul ke permukaan dalam; Bloom threshold ±0.9 hanya untuk lampu + sprite flare additive. Jalur B: 3 still (hijau/biru/ungu) di-crossfade. Catatan: Figma menyebut `@react-three/postprocessing`; `web-v2/` adalah Astro + three murni, jadi pakai `three/examples/jsm/postprocessing` (UnrealBloomPass) [U].

Klaim [F]: biru/ungu = lampu status mode, **bukan** klaim sensor. Copy tidak boleh menulis "blue measures oxygen". Tag `[ SENSOR · LAMPU ]` di Figma → di web `[ SENSOR · LIGHT ]` [U].

Layout [U]: **1440** teks col 1–4, ring col 6–12 (±60vw, terpotong kanan). **390** teks atas, ring di bawah ±110vw terpotong kanan, legenda satu baris di bawah judul.

### S09 · The app — 21:00 · Paper

Tanpa ring. HP di tengah dan diam; hanya isi layar yang bergeser ke atas [F].

| State [F] | % | Chip (titik LED) | Layar app | Kiri atas | Kanan bawah |
|---|---|---|---|---|---|
| 1 | 0 | ● GREEN LIGHT · HEART RATE | HEART RATE · Today · resting · **58 bpm** · grafik 24 jam hijau · "Peak 82 bpm on the stairs, 15:30" · "Steady day, calm evening." | "The green light, read back. Your heart rate through the day, at a glance." | "Resting 58 bpm. Peak on the stairs, 15:30." |
| 2 | 50 | ● BLUE LIGHT · SLEEP | SLEEP · "Settled 23:10 · up 06:22" · **7h 12m** · tahap tidur biru · Deep 1h 32m / REM 1h 48m / Light 3h 52m | "The blue light, read back. Your night, in order: when you settled, how deep you went." | "Deep, REM and light sleep, measured minute by minute." |
| 3 | 100 | ● VIOLET LIGHT · RECOVERY | RECOVERY · HRV · this week · 7 bar ungu Mon–Sun (hari ini paling terang) · "Steady day, calm evening." — **tanpa Readiness/skor [D-066 disetujui]** | ikuti home-copy-v2 (kalimat "One number…" dihapus) | "HRV across the week, with today in full colour." |

Layar Recovery [D-066]: hapus kartu "Readiness · this morning · 82 · An easy day ahead." yang ada di panel Figma. Nilai HRV (mis. `48 ms`) dan labelnya ikuti home-copy-v2; jangan tambahkan label penilaian seperti "Ready" bila home-copy-v2 tidak memuatnya.

- Kartu aktif di layar diberi **outline ochre** 1 px [F]. Chip dan deskripsi crossfade per state [F].
- Footer section [F]: kiri `Heart rate · Sleep · Recovery` (yang aktif tebal); kanan "scroll down" + garis progress + persen.
- Semua angka app → "Simulated data" kecil di bawah HP (set data D-066).
- Mobile [D-069 disetujui: lebih ringan]: lihat rincian Mobile di atas §S01.

Layout [U]:
- **1440:** HP 300×620 px (bezel Ink 10 px, radius 44, layar Paper radius 34), center. Deskripsi kiri col 1–3 di 25% tinggi; kanan col 10–12 di 70% tinggi. Footer menempel di bawah pin, margin 40.
- **390:** HP 240×496 center; deskripsi kiri di atas HP (2–3 baris), kanan disembunyikan atau digabung ke bawah HP; footer hanya progress + persen.
- Layar = UI asli, scroll via `translateY` pada konten layar (tanpa scroll terpisah di HP).

### S10 · Finishes & pricing — 22:00 · Sand

Satu-satunya section interaktif [F].
Copy [F]: "Turn it yourself." → "Find your size and finish." · Silver / Black / Gold · "$299" (tanpa `*`, D-067) · "No required subscription." · "In the box: the ring, a charging dock, and a sizing kit." · satu tombol utama.

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | Panel pilihan di kanan, default Silver | Drag 360° (mouse/swipe), rotasi saja tanpa zoom, inertia halus, tombol ‹ › snap ke sudut preset, kembali ke pose awal setelah beberapa detik diam; label kursor kecil "Drag" |
| 2 | 33 | Pilih Black | Material ganti (warna + kilap), bukan hanya tint |
| 3 | 67 | Pilih Gold; pencahayaan → **Lamp light** (label mono "LAMP LIGHT"); panel ikut menghangat | Pantulan lebih hangat (HDRI berganti) |
| 4 | 100 | Ukuran, isi box, harga + satu tombol | Diam di finish terpilih |

**Aturan finish [D-069 disetujui]:** finish **hanya berganti lewat klik swatch** (atau tap), **tidak pernah** oleh scroll. State 2–3 di Storyboard adalah contoh interaksi user. Pin hanya menahan section sampai panel lengkap (state 4) terlihat. Finish terpilih ikut terbawa ke S11 (3D Designer, PLAN-v2). [U] Lamp light ikut aktif saat Gold dipilih (sesuai panel Figma); bukan toggle terpisah.

**Tombol utama [D-069 disetujui]:** label `Choose {finish} · $299` (mis. `Choose Silver · $299`), berubah mengikuti swatch. Klik **hanya** memunculkan catatan "Stillway is a concept project and is not for sale." — tanpa cart, tanpa navigasi. [U] Catatan muncul sebagai baris kecil di bawah tombol (fade 200 ms, `aria-live="polite"`), bukan modal. Harga **$299 tanpa `*`** [D-067].

Layout:
- Panel Figma [F]: kiri = tile/foto ring di atas permukaan dengan elips putus-putus (orbit drag) dan tombol ‹ ›; kanan = panel kartu Paper berisi judul, 3 swatch bulat (aktif = ring outline), harga, tombol pill Ink.
- **1440 [U]:** split 7/5. Stage ring col 1–7 (tile Sand lebih gelap 4% atau foto studio, radius `--radius-m`); panel col 8–12, padding 32. Urutan panel: judul `--fs-h3` → swatch (28 px) + nama finish → ukuran (chip 6–13*, link "Not sure? Free sizing kit") → isi box (satu baris + thumbnail) → harga `--fs-number` kecil (48) + "No required subscription." → tombol full-width.
- **390:** stage ring ±100vw persegi di atas, **rotasi lewat swipe [D-069 disetujui]**; [U] section tetap di-pin sampai panel tampil, tombol sticky di bawah layar saat panel terlihat.
- Isi box: thumbnail kecil foto studio (aset A-4, `REPORT-v2-assets.md`) di baris "In the box".

### S11 · Closing, FAQ & footer — 06:50 besok · Night + Ember glow

Satu kanvas gelap tanpa putus sampai footer [F].
Copy [F]: "TOMORROW MORNING," + "see your night." · tombol "Find your size and finish →" · mono "No subscription · Free sizing kit · 30-night trial" · FAQ "Questions, briefly." (Sizing, Compatibility, Battery, Returns) · caps "SLEEP ON IT. STILLWAY KEEPS THE PATTERN." · "Stillway is a concept project and is not for sale."

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | "TOMORROW MORNING," mono kecil + "see your night." giant di depan ring | Center, di belakang teks |
| 2 | 33 | Teks + ring scale down dan naik; tombol pill + satu baris mono | Lebih kecil, tetap center |
| 3 | 67 | FAQ satu kolom sempit (accordion: label kecil redup, jawaban Paper, ikon + / −), tanpa panel putih; tombol diulang | Keluar ke atas bersama glow |
| 4 | 100 | Caps kanan atas + tombol; footer (share, kontak, link, disclaimer); lockup selebar layar, sedikit terpotong | Hanya sebagai ring mark di logo |

Hover shine logo [F]: wordmark `background: linear-gradient(...)` + `background-clip: text`, animasi `background-position −100% → 200%`, sudut ±20°, 900 ms, `cubic-bezier(.22,.61,.36,1)`, sekali per hover. Ring mark (SVG stroke, gradient sama) mulai 80 ms lebih awal. Touch: sekali saat masuk viewport. Reduced motion: brightness +8% saat hover.

Layout [U]:
- **1440:** FAQ kolom 560 px center; tombol pill Paper dengan teks Ink (tombol di bg gelap). Lockup footer: lebar 100vw, tinggi ±22vw, 15% bagian bawah terpotong.
- **390:** "see your night." 2 baris; FAQ full-width margin 16; footer bertumpuk 1 kolom; lockup 100vw.

**Footer [D-069 disetujui]: tanpa form email, tanpa newsletter, tanpa tombol share** (D-022). Field "Get the first morning report", "Share Stillway", dan "Copy URL" di panel Figma State 4 **dihapus**. Yang tersisa [U]: kolom link anchor (Sizing → S10, FAQ, Privacy note bila ada di home-copy-v2), disclaimer "Stillway is a concept project and is not for sale." (wajib), dan lockup selebar layar. Email kontak `hello@stillway.co` tidak ditampilkan kecuali home-copy-v2 memuatnya.

Tombol S11 "Find your size and finish →" → anchor S10 [D-069]. Baris mono di bawahnya ikuti home-copy-v2 (`No required subscription · Sizing kit included · 30-night trial`; 30-night trial = kebijakan konsep D-068).

---

## 3. Sambungan antar section [F]

Setiap sambungan: 0–30% = keluar, 30–70% = tengah, 70–100% = masuk + jam berganti. Frame akhir section = frame awal section berikutnya.

| Sambungan | 0–30% | 30–70% | 70–100% |
|---|---|---|---|
| 01 → 02 | (frame sama) | Gradient pagi + Dawn glow → Paper | 06:50 → 07:10 |
| 02 → 03 | Teks besar + kalimat kecil fade out | Paper → Night; ring tetap center, scale 0.36 → 0.50 lebar layar; HDRI turun, rim light satu sisi naik | 07:10 → 23:10 |
| 03 → 04 | Tiga angka fade out | Ring 3D mengecil dan fade out di kiri; bg tetap Night | Judul + filmstrip masuk dari kanan, 07:40 aktif; 23:10 → 07:40 |
| 04 → 05 | Bingkai, jam besar, status, daftar jam fade out | Foto 15:30 menggelap; Dusk naik dari bawah | Ring fade in kanan-tengah (scale 0.9 → 1); 15:30 → 17:30 |
| 05 → 06 | Kartu app fade out | Zoom out: ring ±1.9× → ±0.35 lebar layar, turun ke alas kiri; Dusk → Paper, alas Sand muncul | Ring berdiri di alas tepi kiri (setengah terpotong) = frame awal S06; 17:30 → 21:00 |
| 06 → 07 | Foto tangan scale down jadi kartu, radius 0 → 8 px, ke center | Paper → Sand; kartu fade out | "Through the day" fade in; kartu yang sama kembali sebagai kartu Night di State 2 |
| 07 → 08 | Overlay Night di atas foto full-bleed 0 → 100%; "The Everyday" fade out | Kartu ring fade out, ring 3D fade in di center, scale 0.19 → 0.40 | "Inside the ring." + lampu hijau samar |
| 08 → 09 | Judul fade out; kamera mundur; lampu ungu meredup lalu hijau sesaat | Ring mengecil dan keluar ke atas; Night → Paper; HP naik dari bawah ke center dengan layar Heart rate | Chip hijau, deskripsi, footer muncul |
| 09 → 10 | Isi layar HP + deskripsi fade out; HP bergeser ke kanan dan melebar jadi panel | Paper → Sand; ring fade in di kiri (scale 0.8 → 1), tile muncul | Isi panel fade in; 21:00 → 22:00 |
| 10 → 11 | Panel fade out ke kanan | Ring (finish terpilih) dari tile kiri ke center, scale 0.32; tile fade out; Sand → Night, Ember glow dari atas | "TOMORROW MORNING, see your night." fade in; 22:00 → 06:50 |

**Implementasi [D-063 disetujui]: satu canvas WebGL `position: fixed`** untuk ring di seluruh halaman, satu renderer, satu model; pose/skala/visibilitas/rig cahaya dikendalikan timeline scroll per section. [U] Canvas disembunyikan (render berhenti) di S04, S07, S09; `pointer-events` hanya aktif di area ring S10. Rincian pose dan rig: `design/3d/PLAN-v2.md` / handoff 3D V2 di `design/3d/v2/` (D-070).

Reduced motion [F]: setiap state langsung tampil dengan fade ±300 ms, tanpa gerak besar, tanpa loop (napas ring di S01 juga mati).

---

## 4. Perbedaan dengan V1 (ringkas)

| Area | V1 (`web/`) | V2 |
|---|---|---|
| Warna | Dawn/Day/Dusk/Night biru-malam #151820, banyak token usulan | 5 warna saja; Night hangat #17120F; ochre satu aksen |
| Font | Geist Variable | Geist + **Geist Mono** |
| Hero | Foto batu + ring 3D mendarat di batu | Kanvas Paper + Dawn glow, wordmark raksasa, ring 3D tanpa latar foto |
| Aset dasar | Set nature "moss rock" (D-032/D-035) | **Studio Paper/Sand [D-064 disetujui]**: tile, cut-out tangan, kartu studio. Moss rock tidak dipakai, kecuali 5 foto C-02 di S04 |
| Section | 10 | 11 (baru: Why Stillway, Specs & benefits, Features, The app) |
| Ring | Foto + 3D di hero dan CTA; 2 jendela LED | Satu ring 3D di 8 section, satu canvas [D-063]; teks "Stillway" terukir [D-061]; lampu hanya jendela A [D-062] |
| Footer | — | Tanpa form/newsletter/share [D-069] |

---

## 5. Aset V2 (Storyboard §4 + label ASET di Figma)

Status: **Reuse** = bisa dipakai ulang dari V1 · **Baru (img)** = image generation Visual Director, **disetujui D-065**, dimulai setelah render acuan ring berlogo dari 3D Designer · **3D** = milik 3D Designer (file di `design/3d/v2/`, D-070) · **UI** = HTML/CSS oleh Developer. Prompt dan komposisi aset baru: `design/v2/REPORT-v2-assets.md`.

| ID | Section | Aset | Status | Sumber / catatan |
|---|---|---|---|---|
| 3D-1 | 01, 02, 03, 05, 06, 08, 10, 11 | Ring silver acuan: tepi chamfer, dalam hitam matte, 2 pad oval, jendela sensor, **teks "Stillway" terukir tone-on-tone, vertikal searah band** | **3D** (sedang dibuat) | [D-061 disetujui] Ref `design/v2/references/ring-logo-engrave-ref.png`. Render acuan berlogo = prasyarat semua aset Baru (img) |
| 3D-2 | 08 (juga 01 hijau samar, 03, 05) | Lampu sensor emissive **hanya jendela A**, warna dikendalikan kode; jendela B gelap; tanpa titik merah 3D | **3D** | [D-062 disetujui] |
| 3D-3 | 05 | Shot makro "kamera masuk ke lubang ring" (±1.9× layar) | **3D** | Uji kualitas mesh/normal map di jarak sangat dekat |
| 3D-4 | 06 | Gelinding di alas + contact shadow; jalur B 40–60 frame render | **3D** | Butuh logo terukir agar putaran terbaca |
| 3D-5 | 10 | Finish **Black** dan **Gold** (material, bukan tint) + HDRI **Daylight** dan **Lamp light** | **3D** | `HANDOFF-hero-ring.md`: Black/Gold belum dibuat; belum ada HDRI asli |
| 3D-6 | semua section ring | Environment/HDRI studio netral hangat (Paper), rim light malam (Night), Dusk | **3D** | V1 memakai foto batu sebagai env map — tidak cocok untuk kanvas studio V2 |
| 3D-7 | 01–11 | Cadangan statis per pose kunci (poster / reduced motion / WebGL gagal), PNG transparan | **3D** (render) | ±10 still: S01 3/4 + depan, S02 3/4, S03 rim, S05 makro, S06 depan/samping/45°, S08 hijau/biru/ungu, S10 ×3 finish, S11 |
| R-1 | 04 | 5 foto momen C-02 (`S3p-0740/0900/1030/1230/1530`) | **Reuse** | `design/assets/v1/home/`. Sesuai D-054–D-058. Ring di foto **belum punya logo** dan bentuknya belum dicek ke 3D-1 — cukup untuk V2 awal karena ring kecil di jari; retouch logo opsional |
| R-2 | 06 (S1–3 cadangan) | Foto ring-master `01-front`, `02-side-profile`, `08-flat-45` | **Reuse sementara** | Dipakai di panel Figma S06 sebagai label ASET. Hanya placeholder/cadangan; Storyboard menolak "foto datar yang digeser" untuk gerak utama |
| R-3 | 10 | `R-black.png`, `R-gold.png`, `P-01-silver-daylight.png` | **Tidak dipakai** [D-064] | Set moss rock + tanpa logo. Diganti 3D-5 |
| R-4 / A-4 | 10 | Isi box studio: ring + charging dock + sizing kit di atas Sand | **Baru (img)** [D-065] | Pengganti `A-11-package-flatlay.png` (batu). Bentuk dock/kit dari `masters/R-kit.png` (masih usulan bentuk) |
| N-1 / A-1 | 06 | Foto tangan kiri C-02 **tanpa ring, tanpa background** (cut-out, alpha), telunjuk terangkat | **Baru (img)** [D-065] | Pose harus pas dengan pose akhir ring 3D (§S06). Diserahkan ke 3D Designer untuk proxy jari |
| N-2 / A-2 | 07 | 4 foto kartu potret 4:5: Night, Desk, Move, Rinse — C-02, ring berlogo di telunjuk kiri, studio Paper/Sand | **Baru (img)** [D-064, D-065] | Kartu Night juga = hasil transisi dari foto tangan S06 |
| N-3 / A-3 | 07 | Foto full-bleed "The Everyday" — **studio Paper/Sand** + C-02 + ring | **Baru (img)** [D-064] | 16:9 desktop + crop 9:16 mobile. Moss rock di panel Figma tidak dipakai |
| U-1 | 05, 09 | Kartu app + layar app (Heart rate, Sleep, Recovery) | **UI** | HTML, bukan gambar [F] |
| U-2 | 09 | Mockup HP (bezel) | **UI** | CSS/SVG polos, tanpa merek perangkat nyata |
| U-3 | 01, 11, navbar | Logo lockup SVG (ring mark + wordmark) | **UI** | Lihat §1.4 |
| U-4 | 01, 05, 11 | Dawn / Dusk / Ember glow | **UI** | CSS gradient + blur |
| U-5 | 07 | Garis orbit, progress lingkaran, panel mini (baterai, slider ukuran, bar berat, rating air) | **UI** | SVG/HTML |
| U-6 | 10 | Tile/alas studio Sand | **UI** [U] | Cukup bidang Sand + contact shadow WebGL; tidak perlu foto |
| — | 08, 09, 11 | Tidak ada foto | — | [F] |

Aturan [F]: setiap gambar yang memperlihatkan ring memakai bentuk ring acuan dan logo yang sama; hanya finish yang boleh berbeda, dan hanya di S10.

---

## 6. Produksi aset baru [D-065 disetujui]

Status: **menunggu render acuan ring berlogo dari 3D Designer.** Belum ada gambar yang dibuat. Prompt, komposisi, pose, dan kriteria tolak tiap aset ada di `design/v2/REPORT-v2-assets.md`.

| Urutan | Aset | Metode | Prasyarat |
|---|---|---|---|
| 0 | Render acuan ring berlogo (3D-1) | 3D Designer, Blender | Sedang dibuat |
| 1 | A-1 tangan cut-out S06 | `gpt-image-bridge`, ref C-02 + render acuan; 3 variasi | Render acuan; pose disepakati dengan 3D Designer |
| 2 | A-2 empat kartu S07 | `gpt-image-bridge`, ref C-02 + render acuan + A-1 (warna kulit) | Langkah 1 |
| 3 | A-3 "The Everyday" studio | Sama | Langkah 1 |
| 4 | A-4 isi box studio | `gpt-image-bridge`, ref render acuan + `R-kit.png` | Render acuan |
| 5 | Retouch logo di R-1 (opsional, belum diminta) | Edit AI area ring saja | Persetujuan terpisah |

Penyerahan: file final ke `design/assets/v2/` (PNG master) + WebP web oleh Developer; A-1 juga dikirim ke 3D Designer untuk proxy jari.

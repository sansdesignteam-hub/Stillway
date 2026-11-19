# Handoff visual V2 — Stillway Home (`web-v2/`)

Dari: Visual Director · Untuk: Developer (juga 3D Designer dan Strategy Director) · 19 November 2026
Status dokumen: **draf handoff**. Dasar: D-059, D-060.

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
- Semua teks di website berbahasa Inggris (D-021). Copy final dari Strategy Director; copy di dokumen ini = draf dari Storyboard.
- Angka produk/app = contoh. Tampilkan label **"Simulated data"** atau tanda `*` seperti di Storyboard. Jangan menambah klaim kesehatan.
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
| LED | Hanya (a) cahaya di render ring S08, (b) titik 6 px di legenda S08 dan chip/kartu S09. Tidak untuk teks, bg, tombol, grafik UI. Pengecualian [F]: grafik di layar app S09 memakai warna lampu (grafik HR hijau, tahap tidur biru, bar HRV ungu) — terlihat di panel Figma. |
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

### 1.4 Logo [F]

- Lockup: **ring mark** (lingkaran tipis = band dilihat dari depan; tebal stroke [U] ±8% diameter, ukur ulang dari frame Branding) dengan **titik ochre** di posisi jam 12 (= jendela sensor) + wordmark **"Stillway"** Geist Medium −3%.
- Satu lockup untuk navbar, footer (selebar layar, sedikit terpotong di bawah, dengan hover shine), dan engraving tone-on-tone di sisi luar ring.
- Belum ada file SVG di Figma (hanya digambar di frame Branding). **[U]** Developer membuat `logo.svg` dari Geist Medium (teks di-outline) + `<circle>`; Visual Director memeriksa sebelum dipakai di footer.

### 1.5 Elemen global [F dari panel Storyboard]

- **Navbar** (tampil di semua section): lockup kecil kiri; 3 item navigasi di tengah-kanan; **jam waktu-hari** Geist Mono warna ochre di kanan. Di bg gelap teks Paper.
- **Rail progress scroll**: garis tipis vertikal di tepi kanan dengan titik ochre yang turun sesuai progres section.
- **Jam navbar** berganti per section: `06:50 → 07:10 → 23:10 → 07:40…15:30 → 17:30 → 21:00 → 22:00 → 06:50`. Pergantian jam terjadi di 70–100% tiap sambungan (§3).
- [U] Isi 3 item navigasi: `Rhythm` (→S03), `The ring` (→S06), `Finishes` (→S10); CTA kecil tidak ada di navbar (satu tombol utama ada di S10/S11). Mobile: lockup + jam + hamburger (pola panel menu V1 D-053).
- [U] Rail progress disembunyikan di mobile (< 720 px).

---

## 2. Spesifikasi per section

Format: tujuan · copy draf [F] · state [F] · layout 1440 / 390 · catatan. Persentase = progres scroll di dalam section yang di-pin. Semua animasi **scrub** mengikuti scroll, tidak autoplay, kecuali disebut [F].

Panjang pin [U]: 1 state ≈ 100vh scroll. Section 4-state = `+=300%`, 5-state = `+=400%`, 3-state = `+=200%`. Sambungan antar section (§3) memakai ±100vh tersendiri, atau digabung ke awal pin section berikutnya.

**Mobile — keputusan terbuka [?] (Storyboard §6.4).** Usulan default [U] di bawah: semua section tetap di-pin dan di-scrub di mobile (ceritanya bergantung pada ring yang sama), kecuali S07 dan S09 yang mendapat versi lebih ringan. Pin di mobile memakai `100svh`.

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

- Durasi selain 09:00 berbeda antara Storyboard (15 min walk, 5 min stretch, 20 min stairs) dan build V1 (25 min walk, 15 min stretch, 20 min stairs and errands). Storyboard §6.5 meminta **ikut build**. [U] Pakai nilai build V1 sampai Strategy Director mengunci copy.
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
- [?] Storyboard §6.6: bg terang di jam 21:00 mungkin terasa janggal; cek setelah build.

### S07 · Specs & benefits — 21:00 · Sand → foto full-bleed

Copy [F]: "Through the day." · label pill mono "MADE FOR EVERY HOUR" · (I) Night "Sleeps with you. Charges while you don't." · (II) Desk "Sized to forget." · (III) Move "Light enough to lose track of." · (IV) Rinse "Hands in water. Ring stays on." · Penutup "The Everyday — Ring shown where it's worn." Tag: `[ SIZE ]`, `[ WEIGHT · THICKNESS ]`, `[ BATTERY ]`, `[ WATER RATING ]` (Figma menulis tag ini dalam bahasa Indonesia — **di web wajib Inggris**).

| State [F] | % | Isi |
|---|---|---|
| 1 | 0 | "Through the day" besar center + pill "MADE FOR EVERY HOUR" |
| 2 | 25 | "Through" ke kiri, "the day" ke kanan; 4 kartu foto potret masuk dari bawah, berjajar center dengan label mono kecil di bawah tiap kartu |
| 3 | 50 | (I) Night 1/4: kartu scale up ke center; kartu lain ditumpuk di belakang; judul "(I) Night" di atas garis tipis; caps kecil kiri + kanan; garis orbit dekoratif; counter 1/4 + progress lingkaran; panel putih kecil baterai 7 hari (bisa digeser per hari) |
| 4 | 75 | 2/4 Desk (slider ukuran) → 3/4 Move (bar berat ~4 g*) → 4/4 Rinse (rating air). Layout sama |
| 5 | 100 | Kartu mengecil; foto lingkungan di belakangnya membesar jadi full-bleed; "The Everyday" putih besar + caption "Ring shown where it's worn." |

Layout [U]:
- **1440:** kartu aktif 4:5, tinggi ±60vh, center; caps kiri di col 1–3 atas, paragraf kiri col 1–3 bawah, caps kanan col 10–12, counter + panel mini kanan bawah. Garis orbit = elips SVG `1px var(--line)` mengelilingi kartu.
- **390:** kartu aktif ±80vw; caps + paragraf di bawah kartu; counter di atas kartu; panel mini di bawah teks. State 2 (4 kartu berjajar) diganti 2×2 grid kecil.
- Panel mini = UI asli, bg Paper, radius `--radius-m`, label mono, satu elemen ochre (hari/nilai aktif).
- Semua angka `*`: "about a week per charge*", "~4 g*", "5 ATM*", ukuran 6–13* (contoh di panel Figma). Lihat Storyboard §6.1.

### S08 · Features — 21:00 · Night

Satu fitur: lampu sensor yang warnanya mengikuti scroll. Tanpa chip, hotspot, atau klik wajib [F].

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | "Inside the ring." kiri atas; jendela sensor hijau samar | Center, melayang pelan |
| 2 | 50 | "One light, tuned to the task." kiri tengah; legenda 3 warna (titik 6 px + label, bukan tombol); tag outline ochre `[ SENSOR · LIGHT ]` | Kamera dekat ke jendela sensor, ring besar di kanan, 3/4, diam |
| 3 | 100 | "Blue at night. Violet by morning."; legenda menandai warna aktif (tebal); satu baris kecil "Red means it's off." dengan titik merah | Posisi sama; hanya warna lampu |

Warna lampu vs scroll [F]: 25–50% hijau penuh; 50–75% → biru (penuh di ±75%); 75–100% → ungu. Interpolasi dari progres ScrollTrigger (`gsap.utils.interpolate`). Reduced motion: warna berganti langsung, tanpa denyut glow. Opsional desktop: klik label legenda untuk lompat ke posisi scroll.

Render [F]: mesh lampu dipisah `led_main` (jendela sensor) dan `led_power` (titik merah); `emissive` + intensitas 2–4; PointLight kecil sewarna di dalam ring agar memantul ke permukaan dalam; Bloom threshold ±0.9 hanya untuk lampu + sprite flare additive. Jalur B: 3 still (hijau/biru/ungu) di-crossfade. Catatan: Figma menyebut `@react-three/postprocessing`; `web-v2/` adalah Astro + three murni, jadi pakai `three/examples/jsm/postprocessing` (UnrealBloomPass) [U].

Klaim [F]: biru/ungu = lampu status mode, **bukan** klaim sensor. Copy tidak boleh menulis "blue measures oxygen". Tag `[ SENSOR · LAMPU ]` di Figma → di web `[ SENSOR · LIGHT ]` [U].

Layout [U]: **1440** teks col 1–4, ring col 6–12 (±60vw, terpotong kanan). **390** teks atas, ring di bawah ±110vw terpotong kanan, legenda satu baris di bawah judul.

### S09 · The app — 21:00 · Paper

Tanpa ring. HP di tengah dan diam; hanya isi layar yang bergeser ke atas [F].

| State [F] | % | Chip (titik LED) | Layar app | Kiri atas | Kanan bawah |
|---|---|---|---|---|---|
| 1 | 0 | ● GREEN LIGHT · HEART RATE | HEART RATE · Today · resting · **58 bpm** · grafik 24 jam hijau · "Peak 82 bpm on the stairs, 15:30" · "Steady day, calm evening." | "The green light, read back. Your heart rate through the day, at a glance." | "Resting 58 bpm. Peak on the stairs, 15:30." |
| 2 | 50 | ● BLUE LIGHT · SLEEP | SLEEP · "Settled 23:10 · up 06:22" · **7h 12m** · tahap tidur biru · Deep 1h 32m / REM 1h 48m / Light 3h 52m | "The blue light, read back. Your night, in order: when you settled, how deep you went." | "Deep, REM and light sleep, measured minute by minute." |
| 3 | 100 | ● VIOLET LIGHT · RECOVERY | RECOVERY · HRV · this week · **48 ms · Ready** · 7 bar ungu (hari ini paling terang) · Readiness · this morning · **82 · An easy day ahead.** | "The violet light, read back. One number tells you how the night paid off." | "HRV across the week, with today in full colour." |

- Kartu aktif di layar diberi **outline ochre** 1 px [F]. Chip dan deskripsi crossfade per state [F].
- Footer section [F]: kiri `Heart rate · Sleep · Recovery` (yang aktif tebal); kanan "scroll down" + garis progress + persen.
- Semua angka contoh → tambahkan "Simulated data" kecil di bawah HP [U] (Storyboard §6.7).
- Kalimat "measured minute by minute" adalah klaim teknis; minta Strategy Director memastikan nadanya ilustratif [U].

Layout [U]:
- **1440:** HP 300×620 px (bezel Ink 10 px, radius 44, layar Paper radius 34), center. Deskripsi kiri col 1–3 di 25% tinggi; kanan col 10–12 di 70% tinggi. Footer menempel di bawah pin, margin 40.
- **390:** HP 240×496 center; deskripsi kiri di atas HP (2–3 baris), kanan disembunyikan atau digabung ke bawah HP; footer hanya progress + persen.
- Layar = UI asli, scroll via `translateY` pada konten layar (tanpa scroll terpisah di HP).

### S10 · Finishes & pricing — 22:00 · Sand

Satu-satunya section interaktif [F].
Copy [F]: "Turn it yourself." → "Find your size and finish." · Silver / Black / Gold · "$299*" · "No required subscription." · "In the box: the ring, a charging dock, and a sizing kit." · satu tombol utama.

| State [F] | % | Isi | Ring |
|---|---|---|---|
| 1 | 0 | Panel pilihan di kanan, default Silver | Drag 360° (mouse/swipe), rotasi saja tanpa zoom, inertia halus, tombol ‹ › snap ke sudut preset, kembali ke pose awal setelah beberapa detik diam; label kursor kecil "Drag" |
| 2 | 33 | Pilih Black | Material ganti (warna + kilap), bukan hanya tint |
| 3 | 67 | Pilih Gold; pencahayaan → **Lamp light** (label mono "LAMP LIGHT"); panel ikut menghangat | Pantulan lebih hangat (HDRI berganti) |
| 4 | 100 | Ukuran, isi box, harga + satu tombol | Diam di finish terpilih |

Catatan state [U]: state 2–3 di Storyboard adalah **contoh** interaksi user, bukan sesuatu yang dipaksa oleh scroll. Usulan: scroll tidak mengganti finish; pin hanya menahan section sampai panel lengkap (state 4) terlihat. Finish berubah hanya saat user klik swatch. Lamp light ikut finish Gold, atau [?] jadi toggle terpisah.

Layout:
- Panel Figma [F]: kiri = tile/foto ring di atas permukaan dengan elips putus-putus (orbit drag) dan tombol ‹ ›; kanan = panel kartu Paper berisi judul, 3 swatch bulat (aktif = ring outline), harga, tombol pill Ink.
- **1440 [U]:** split 7/5. Stage ring col 1–7 (tile Sand lebih gelap 4% atau foto studio, radius `--radius-m`); panel col 8–12, padding 32. Urutan panel: judul `--fs-h3` → swatch (28 px) + nama finish → ukuran (chip 6–13*, link "Not sure? Free sizing kit") → isi box (satu baris + thumbnail) → harga `--fs-number` kecil (48) + "No required subscription." → tombol full-width.
- **390 [U]:** stage ring ±100vw persegi di atas (swipe), panel di bawah tidak di-pin (scroll normal), tombol sticky di bawah layar saat panel terlihat.
- Tombol utama [?]: tujuan klik belum ditentukan (tidak ada cart/checkout — D-022). Usulan: label "Choose Silver · $299*" yang menggulir ke S11 atau membuka catatan "Concept project — not for sale".

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

Ketidaksesuaian yang perlu dicek [?]: panel Figma State 4 menampilkan **field email "Get the first morning report"** dan email kontak `hello@stillway.co*`. Form pengumpulan data **di luar lingkup** (D-022). Usulan [U]: hapus field email, ganti dengan teks statis; email kontak pakai placeholder berlabel ilustratif atau tidak ditampilkan.

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

[U] Implementasi: **satu canvas WebGL tetap (`position: fixed`)** untuk ring di seluruh halaman, dengan pose/skala/visibilitas dikendalikan satu timeline per section. Ini satu-satunya cara agar "frame akhir = frame awal" benar-benar mulus dan agar ring tetap "satu tokoh" (Storyboard §1). Canvas disembunyikan (render berhenti) di S04, S07, S09. Satu konteks WebGL saja (catatan D-052).

Reduced motion [F]: setiap state langsung tampil dengan fade ±300 ms, tanpa gerak besar, tanpa loop (napas ring di S01 juga mati).

---

## 4. Perbedaan dengan V1 (ringkas)

| Area | V1 (`web/`) | V2 |
|---|---|---|
| Warna | Dawn/Day/Dusk/Night biru-malam #151820, banyak token usulan | 5 warna saja; Night hangat #17120F; ochre satu aksen |
| Font | Geist Variable | Geist + **Geist Mono** |
| Hero | Foto batu + ring 3D mendarat di batu | Kanvas Paper + Dawn glow, wordmark raksasa, ring 3D tanpa latar foto |
| Aset dasar | Set nature "moss rock" (D-032/D-035) | Studio bersih: Paper/Sand, tile, cut-out tangan. **Set moss rock tidak dipakai** kecuali di foto lama yang diizinkan |
| Section | 10 | 11 (baru: Why Stillway, Specs & benefits, Features, The app) |
| Ring | Foto + 3D di hero dan CTA | Satu ring 3D di 8 section, dengan logo terukir |

---

## 5. Aset V2 (Storyboard §4 + label ASET di Figma)

Status: **Reuse** = bisa dipakai ulang dari V1 · **Baru (img)** = perlu image generation (Visual Director) · **3D** = milik 3D Designer · **UI** = HTML/CSS oleh Developer. Semua produksi baru **menunggu persetujuan pengguna** (lihat `REPORT-v2-handoff.md`).

| ID | Section | Aset | Status | Sumber / catatan |
|---|---|---|---|---|
| 3D-1 | 01, 02, 03, 05, 06, 08, 10, 11 | Ring silver acuan: tepi chamfer, dalam hitam matte, 2 pad oval, jendela sensor, **logo "Stillway" tone-on-tone di sisi luar** | **3D** (update) | Basis `design/3d/ring/stillway-ring-silver_web.glb`. Perlu: engraving logo [?], node LED terpisah (3D-2), material siap ganti finish. Logo di produk menunggu konfirmasi (Storyboard §6.3) |
| 3D-2 | 08 (juga 01 hijau samar, 03, 05) | Lampu sensor emissive: `led_main` + `led_power`, warna dikendalikan kode | **3D** | Saat ini satu material `LED_*` |
| 3D-3 | 05 | Shot makro "kamera masuk ke lubang ring" (±1.9× layar) | **3D** | Uji kualitas mesh/normal map di jarak sangat dekat |
| 3D-4 | 06 | Gelinding di alas + contact shadow; jalur B 40–60 frame render | **3D** | Butuh logo terukir agar putaran terbaca |
| 3D-5 | 10 | Finish **Black** dan **Gold** (material, bukan tint) + HDRI **Daylight** dan **Lamp light** | **3D** | `HANDOFF-hero-ring.md`: Black/Gold belum dibuat; belum ada HDRI asli |
| 3D-6 | semua section ring | Environment/HDRI studio netral hangat (Paper), rim light malam (Night), Dusk | **3D** | V1 memakai foto batu sebagai env map — tidak cocok untuk kanvas studio V2 |
| 3D-7 | 01–11 | Cadangan statis per pose kunci (poster / reduced motion / WebGL gagal), PNG transparan | **3D** (render) | ±10 still: S01 3/4 + depan, S02 3/4, S03 rim, S05 makro, S06 depan/samping/45°, S08 hijau/biru/ungu, S10 ×3 finish, S11 |
| R-1 | 04 | 5 foto momen C-02 (`S3p-0740/0900/1030/1230/1530`) | **Reuse** | `design/assets/v1/home/`. Sesuai D-054–D-058. Ring di foto **belum punya logo** dan bentuknya belum dicek ke 3D-1 — cukup untuk V2 awal karena ring kecil di jari; retouch logo opsional |
| R-2 | 06 (S1–3 cadangan) | Foto ring-master `01-front`, `02-side-profile`, `08-flat-45` | **Reuse sementara** | Dipakai di panel Figma S06 sebagai label ASET. Hanya placeholder/cadangan; Storyboard menolak "foto datar yang digeser" untuk gerak utama |
| R-3 | 10 | `R-black.png`, `R-gold.png`, `P-01-silver-daylight.png` | **Tidak dipakai** [U] | Set moss rock + tanpa logo. Diganti 3D-5 |
| R-4 | 10 | Isi box: `A-11-package-flatlay.png` (Figma: "A-11-package-flatlay 2") | **Baru (img)** | V1 berlatar batu; V2 butuh versi studio Sand. Bentuk charger/sizing kit masih usulan (`R-kit.png`) |
| N-1 | 06 | Foto tangan **tanpa ring, tanpa background**, satu jari terangkat, cut-out di #F7F5F0, ruang kosong di kiri | **Baru (img)** | Prompt dasar di Storyboard §4. Pose harus pas dengan jalur ring 3D yang turun ke pangkal jari. Tangan C-02 (laki-laki) [?] |
| N-2 | 07 | 4 foto kartu potret: Night, Desk, Move, Rinse — ring di jari dengan logo | **Baru (img)** | Rasio 4:5. Karakter C-02 [?]. Kartu Night juga = hasil transisi dari foto tangan S06 |
| N-3 | 07 | 1 foto lingkungan full-bleed "The Everyday" + ring | **Baru (img)** | 16:9 desktop + crop 9:16 mobile. Panel Figma memakai foto ring di batu berlumut — **bertentangan** dengan studio V2 [?] |
| U-1 | 05, 09 | Kartu app + layar app (Heart rate, Sleep, Recovery) | **UI** | HTML, bukan gambar [F] |
| U-2 | 09 | Mockup HP (bezel) | **UI** | CSS/SVG polos, tanpa merek perangkat nyata |
| U-3 | 01, 11, navbar | Logo lockup SVG (ring mark + wordmark) | **UI** | Lihat §1.4 |
| U-4 | 01, 05, 11 | Dawn / Dusk / Ember glow | **UI** | CSS gradient + blur |
| U-5 | 07 | Garis orbit, progress lingkaran, panel mini (baterai, slider ukuran, bar berat, rating air) | **UI** | SVG/HTML |
| U-6 | 10 | Tile/alas studio Sand | **UI** [U] | Cukup bidang Sand + contact shadow WebGL; tidak perlu foto |
| — | 08, 09, 11 | Tidak ada foto | — | [F] |

Aturan [F]: setiap gambar yang memperlihatkan ring memakai bentuk ring acuan dan logo yang sama; hanya finish yang boleh berbeda, dan hanya di S10.

---

## 6. Rencana produksi aset baru (menunggu persetujuan — belum ada gambar yang dibuat)

| Urutan | Aset | Metode [U] | Prasyarat |
|---|---|---|---|
| 1 | Konfirmasi logo di ring + render acuan 3D-1 dengan engraving | 3D Designer | Jawaban pengguna soal logo (Storyboard §6.3) |
| 2 | N-1 foto tangan cut-out | `gpt-image-bridge`; prompt Storyboard §4 + referensi `C-02-character.png` (warna kulit/tangan) + pose dari panel Figma S06. 3 variasi, cek 5 digit di crop penuh | Pose disepakati dengan 3D Designer (jalur ring) |
| 3 | N-2 empat kartu S07 | `gpt-image-bridge`, referensi C-02 + render 3D-1 (logo). Latar studio hangat Paper/Sand, satu properti per adegan: Night (seprai linen, lampu redup), Desk (meja kayu, keyboard), Move (tali sepatu/handuk), Rinse (wastafel batu, air) | Langkah 1 |
| 4 | N-3 foto "The Everyday" | Sama; satu adegan luar/dalam ruang dengan C-02, ring jelas | Jawaban apakah boleh moss rock |
| 5 | R-4 isi box studio | `gpt-image-bridge` dengan `R-kit.png` sebagai referensi bentuk, latar Sand | Bentuk charger/sizing kit disetujui |
| 6 | Retouch logo di R-1 (opsional) | Edit AI area ring saja | Langkah 1 |

Kriteria tolak (mengikuti anti-slop V1): tangan tidak 5 digit atau pose tidak wajar; ring berbeda dari acuan (jumlah pad, sensor, chamfer); logo terbaca terbalik/berantakan; warna di luar palet (biru/hijau dominan); teks/watermark di gambar; ring melayang tanpa kontak.

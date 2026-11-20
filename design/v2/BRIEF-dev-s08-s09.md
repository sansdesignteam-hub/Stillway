# Brief Developer — Bangun S08–S09 (V2)

Dari: Claude Code (main, Project Manager) · 20 November 2026 · Dasar: D-096
Untuk: Developer (`web-v2/`, branch `Developer`, di atas `1f00c35`; main `53c40d2` sudah berisi commit ini)

## 0. Cara kerja (sama dengan D-090 dan D-093)

1. **Storyboard = alur, bukan visual.** `context/Visual Directions V2/Storyboard.md` §2 (S08, S09) dan §3 (sambungan 07→08, 08→09, 09→10) hanya untuk urutan state, jam navbar, dan apa yang terjadi saat scroll.
2. **Moodboard Layout = visual dan interaksi.** Baca `Moodboard.md` §2.3, §5, §6, lalu buka Figma lewat Figma MCP:
   - File `ejtNpUf0FdEYMgAbcENMCH`, section `40004118:50`.
   - Sticky note S08 `40004118:132`, S09 `40004185:54`.
   - Gambar referensi (kiri → kanan):
     - S08: `40004124:92` · `40004185:55` · `40004124:84`
     - S09: `40004124:96` · `40004185:59` · `40004185:61`
   - Untuk gaya UI layar app, baca juga Moodboard Mobile App `40004128:58`.
   - Salinan PNG: `/Users/zaimmaulana/Orca/projects/Smart Ring/design/v2/references/s08-ref-*.png` dan `s09-ref-*.png`.
   - Buka juga situs aslinya untuk melihat gerak scroll: shiftrobotics.io, ultrahuman.com/ring, sofihealth.com, ouraring.com/how-it-works.
3. **Aturan membaca note:** bila note mengaitkan referensi ke sebuah state, tiru layout dan interaksinya. Bila hanya meminjam satu sifat, ambil sifat itu saja.
4. **Pengganti isi referensi:**
   - Ring di ref S08 (rose/bronze di ref klien, hitam di Ultrahuman) diganti **ring Silver glossy** (D-085). Yang ditiru adalah cahaya lampunya.
   - Hijau neon Shift dan warna-warni Sofi tidak dipakai di UI. Warna lampu hanya `--led-heart-rate` #34E07A, `--led-sleep` #3B8CFF, `--led-recovery` #A06BFF, dan hanya di dua tempat: cahaya di render ring S08 dan titik kecil di legenda S08 serta chip/kartu S09 (Moodboard §2.3).
   - Serif Oura tidak dipakai. Tipografi tetap Geist dan Geist Mono dengan weight D-082.
5. Copy dari `context/home-copy-v2.md` §08 dan §09 (versi ini, bukan versi storyboard). Batas klaim wajib:
   - D-062: lampu hanya di jendela A; hijau/biru/ungu adalah **lampu mode**, merah hanya berarti ring mati. Jangan menulis bahwa biru/ungu mengukur sesuatu.
   - D-066: **tidak ada skor Readiness** atau angka skor apa pun di S09. "measured minute by minute" tidak dipakai.
   - Semua angka layar app berlabel `Simulated data`.
6. Tetap berlaku: D-063, D-082, D-083, D-085, palet 5 warna, reduced motion (fade ±300 ms), mobile pin + scrub (D-069).

## 1. S08 · Features — 21:00 · Night

**Sticky note:** satu fitur, diceritakan hanya lewat scroll. Tanpa chip, tanpa klik. App menyusul di S09.
→ Legenda 3 warna hanya **label**, bukan tombol. Opsi "klik legenda untuk lompat" di storyboard **tidak** dipakai.

**Target dari referensi:**
- **Ref 1 Shift:** latar gelap, kamera dekat ke satu detail, judul pendek per state di kiri atas, blok teks kecil di kiri bawah dengan penanda kecil (mis. counter `2/3`). Pinjam komposisi dan ritme ini.
- **Ref 2 klien, LED flare → States 2–3:** ring besar sudut 3/4, satu lampu di jendela sensor dengan **flare lembut** (garis cahaya tipis memanjang) dan pantulan ke permukaan dalam ring. Hanya lampunya yang bersinar; bagian lain ring tetap normal.
- **Ref 3 Ultrahuman, sensor dari dalam:** cahaya dilihat dari sisi dalam ring, latar hampir hitam, ring hanya terbaca lewat pantulan. Warnanya berganti **hijau → biru → ungu** mengikuti scroll.

**State (alur storyboard):**
| State | Isi | Ring |
| --- | --- | --- |
| 1 · 0% | `Inside the ring.` + sub `One small window, facing your skin.` | Tengah, melayang pelan, jendela sensor hijau samar |
| 2 · 50% | `One light, tuned to the task.` + tag `[ SENSOR · LIGHT ]` + legenda 3 warna + body hijau | Kamera dekat ke jendela sensor (ring besar di kanan, 3/4), diam, lampu **hijau** penuh |
| 3 · 100% | `Blue at night. Violet by morning.` + `Red means it's off.` + body biru/ungu | Posisi sama; lampu berganti **biru** (±75%) lalu **ungu** (100%) |

Rentang warna: hijau penuh 25–50%, ke biru 50–75%, ke ungu 75–100%. Body per warna crossfade mengikuti warna aktif; titik legenda yang aktif terang, lainnya redup. Merah tidak dijadikan state.
**Teknis lampu:** di S05 LED sudah dibuat netral saat mati (ronde 2 D-090). Di S08 nyalakan hanya LED jendela A dengan warna token di atas, emissive + bloom/flare lembut, pantulan ke sisi dalam band.

## 2. S09 · The app — 21:00 · Paper

**Sticky note:** lanjutan S08 dengan urutan yang sama: hijau → Heart rate, biru → Sleep, ungu → Recovery. Satu fitur utama per state; tanpa layar ringkasan umum.

**Target dari referensi:**
- **Ref 1 Sofi → layout utama:** HP di tengah di latar terang (Paper), **diam**. Satu teks pendek di kiri atas, satu di kanan bawah. Footer: label aktif di kiri, `Scroll down` + garis progress + persen di kanan. Tanpa ring.
- **Ref 2 Oura "Wake up knowing" → urutan isi:** angka/ringkasan utama dulu, lalu detail di bawahnya (mis. tahap tidur sebagai bar). Pinjam urutannya saja; **tanpa skor** (D-066).
- **Ref 3 Dribbble → gerak layar:** satu angka besar per layar; yang bergulir adalah isi layar, HP tetap diam. Tidak ada scroll terpisah di dalam HP.

**Gaya layar app:** ikuti Moodboard §5 dan Figma Mobile App `40004128:58`: kartu krem, teks Ink, satu nilai live Ochre, grafik garis Ink tipis tanpa grid, titik Ochre untuk "sekarang". Titik di tiap kartu memakai warna lampu (hijau/biru/ungu). Kartu aktif diberi outline Ochre. Layar dibuat sebagai UI HTML asli, bukan gambar.

**State (alur storyboard, copy dari home-copy-v2):**
| State | Chip | Kiri atas | Kanan bawah | Layar |
| --- | --- | --- | --- | --- |
| 1 · 0% | `● GREEN LIGHT · HEART RATE` | `The green light, read back. Your heart rate through the day, at a glance.` | `Resting 58 bpm. Peak on the stairs, 15:30.` | `Resting` `58 bpm` besar · grafik 00:00–24:00 · `Peak 82 bpm · 15:30 stairs` |
| 2 · 50% | `● BLUE LIGHT · SLEEP` | `The blue light, read back. Your night, in order: when you settled, how deep you went.` | `Deep, light and REM sleep, laid out across the night.` | `7h 12m` besar · `Settled 23:10 · Up 06:22` · tahap Deep/REM/Light (durasi, tanpa skor) |
| 3 · 100% | `● VIOLET LIGHT · RECOVERY` | `The violet light, read back. How the night sat against the rest of your week.` | `HRV across the week, with today in full colour.` | HRV 7 hari Mon–Sun, hari ini paling terang · `Steady day, calm evening.` |

Footer: label aktif (`Heart rate` / `Sleep` / `Recovery`) di kiri; `Scroll down` · progress · `33%` / `66%` / `100%` di kanan. `Simulated data` di bawah HP. Chip dan deskripsi crossfade di tiap state. Angka mingguan HRV dan durasi tahap tidur adalah data simulasi; jangan menambah angka lain di luar copy.

**Sambungan:**
- 07→08: foto full-bleed menggelap, "The Everyday" memudar → ring di kartu berganti menjadi ring utama di posisi yang sama, sedikit membesar → `Inside the ring.` + lampu hijau samar.
- 08→09: judul memudar; lampu ungu meredup lalu menyala hijau sesaat → ring mengecil dan keluar ke atas; Night → Paper; HP naik ke tengah dengan layar Heart rate → chip hijau, deskripsi, footer muncul.
- 09→10: cukup akhiri dengan transisi bersih ke placeholder S10 (Paper → Sand). S10 tidak dibangun.

## 3. Batas lingkup

- Kerjakan S08, S09, dan sambungan 07→08, 08→09, keluar 09→placeholder S10. S10+ tetap ditahan.
- Jangan ubah S01–S07 kecuali sambungan 07→08.
- Jangan sentuh `web/`. Jangan push, merge, atau deploy sebelum ditinjau.
- Bila butuh aset yang belum ada, tanya dulu lewat laporan.

## 4. Laporan untuk review

Simpan screenshot di `web-v2/docs/screens/s08-s09-d096/`, desktop 1440 dan mobile 390:
- S08 state 1, 2 (hijau), 3 (biru ±75% dan ungu 100%).
- S09 state 1, 2, 3.
- Titik tengah sambungan 07→08, 08→09, 09→10.
- Satu screenshot reduced motion untuk S08 dan S09 (1440).

Untuk tiap state yang punya referensi, tulis satu baris: "ref X → yang ditiru → yang sengaja beda dan alasannya". Commit di branch `Developer` dengan pesan yang menyebut D-096. Sertakan pertanyaan terbuka bila ada.

## 5. Revisi S09 · Layar app (D-097)

Pengguna menilai layar app S09 (`2c39bd2`) masih "slop": kartu krem bergaris tipis, label kecil, grafik generik. Revisi hanya **isi layar HP** S09; layout halaman (HP diam di tengah, teks kiri atas/kanan bawah, footer) tetap.

**Acuan wajib — Figma Moodboard Mobile App `40004128:58`** (salinan: `design/v2/references/s09-moodboard-mobile-app.png`). Baca keenam sticky note-nya lewat Figma MCP:
| Pola | Dari referensi | Untuk Stillway |
| --- | --- | --- |
| Metric detail (Oura 52 bpm) | Satu nilai sangat besar, unit kecil, satu kalimat makna di bawahnya | Label, angka, satu baris. Aturan yang sama dengan website |
| Colour block (Oura oranye) | Satu panel warna penuh per metrik | Panel gradient **Ember/Dawn** (Ochre → Night atau Ochre → Paper), bukan oranye datar dan bukan kartu krem bergaris |
| Charts (Oura) | Garis tipis, hanya titik penting yang diberi label, tanpa grid | Garis Ink (atau Paper di atas panel gelap), titik Ochre untuk "now", label hanya di titik kunci (mis. `58 bpm`, `82 bpm · 15:30`). Hapus label sumbu kecil |
| Timed insight (Ultrahuman) | Kartu nudge dengan stempel waktu di atas, lalu satu angka besar dengan satu kalimat | Sleep: nudge `23:10 · Settled` di atas, lalu `7h 12m` |
| Screen set (Smart Ring App) | Kartu data kecil berpadu dengan satu panel kuat per layar | Satu panel kuat + paling banyak satu kartu data kecil per layar |

**Skill anti-slop:** pakai **tasteskill v2** (`design-taste-frontend`, leonxlnx/taste-skill, 802K install; sudah terpasang dan dipakai di V1):
- Baca `/Users/zaimmaulana/.agents/skills/design-taste-frontend/SKILL.md`, lalu `references/app-screens.md`, `references/tells.md`, `references/colour.md`, `references/type.md`.
- Ikuti alur "Redesign … of an existing page or app screen": jalankan `scripts/inspect.mjs <url> --out .taste-skill/before --app`, perbaiki, lalu `--out .taste-skill/after --app`, dan lihat screenshot hasilnya (look-and-fix loop).
- Jangan jalankan `draw.mjs` untuk memilih arah baru: arah visual sudah tetap (Moodboard V2, palet 5 warna, Geist). Ambil aturan anti-slop dan pengecekannya, bukan palet atau font dari library skill.
- Folder `.taste-skill/` jangan di-commit.

**Batas yang tetap berlaku:** UI tetap HTML asli (bukan gambar; `imagegen-frontend-mobile` tidak dipakai). Tanpa skor Readiness (D-066), tanpa klaim biru/ungu mengukur sesuatu (D-062), semua angka berlabel `Simulated data`. Kalimat makna hanya dari copy yang ada (home-copy-v2 §09 dan §03, mis. `Peak on the stairs, 15:30.`, `A picture of the night, not a verdict on it.`, `Steady day, calm evening.`); jangan mengarang kalimat baru. Warna lampu hanya titik kecil di chip/judul layar. Tidak ada ring di S09.

**Laporan:** timpa `s09-state1..3` (1440 + 390) dan tambahkan close-up layar HP tiap state (`s09-phone-1..3.png`, ±2× skala). Sertakan hasil `inspect.mjs` sebelum/sesudah (ringkas: jumlah temuan tells yang hilang).

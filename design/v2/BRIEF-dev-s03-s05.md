# Brief Developer — Rombak S03, bangun S04–S05 (V2)

Dari: Claude Code (main, Project Manager) · 20 November 2026 · Dasar: D-090
Untuk: Developer (`web-v2/`, branch `Developer`)

## 0. Cara kerja (wajib, sebelum menulis kode)

1. **Storyboard = alur, bukan visual.** Baca `context/Visual Directions V2/Storyboard.md` §2 (S03, S04, S05) dan §3 (sambungan 02→03, 03→04, 04→05, 05→06) hanya untuk urutan state, jam navbar, dan apa yang terjadi saat scroll. Jangan meniru tata letak dari storyboard bila referensi berkata lain.
2. **Moodboard Layout = visual dan interaksi.** Baca `context/Visual Directions V2/Moodboard.md` §2, §6, lalu buka Figma lewat Figma MCP:
   - File `ejtNpUf0FdEYMgAbcENMCH`, section Moodboard Layout `40004118:50`.
   - Sticky note S03 `40004118:83`, S04 `40004118:92`, S05 `40004118:101`.
   - Gambar referensi (urut kiri → kanan):
     - S03: `40004124:64` · `40004124:62` · `40004124:66`
     - S04: `40004124:72` · `40004124:68` · `40004124:70`
     - S05: `40004124:74` · `40004124:76` · `40004124:78`
   - Salinan PNG ada di repo main: `design/v2/references/s03-ref-*.png`, `s04-ref-*.png`, `s05-ref-*.png` (path absolut: `/Users/zaimmaulana/Orca/projects/Smart Ring/design/v2/references/`).
   - Buka juga situs aslinya (link di sticky note) untuk melihat gerak scroll-nya: ultrahuman.com/ring, sensiq.co, oryzo.ai.
3. **Aturan membaca sticky note:** bila note mengaitkan referensi dengan sebuah state ("→ State 1", "→ States 2–4"), **tiru layout dan interaksinya** untuk state itu. Bila note hanya meminjam satu sifat ("borrow the type only", "our colours", "gradient"), ambil sifat itu saja.
4. **Pengganti isi note:** kata "black ring" / ring hitam di referensi Ultrahuman diganti **ring Silver glossy** (`silver_polished`, D-085). Ring tidak boleh tampak hitam.
5. Copy dari `context/home-copy-v2.md` (S03–S05). Angka D-066 sudah disetujui; jangan mengarang angka lain.
6. Tetap berlaku: D-063 (satu canvas WebGL fixed), D-082 (weight huruf mengikuti S01, Geist/Geist Mono), D-083 (tanpa rail scroll), D-085 (glossy di semua section), palet 5 warna Moodboard §2, reduced motion (fade ±300 ms), mobile tetap pin + scrub (D-069).

## 1. S03 · Sleep summary — 23:10 · Night (rombak)

**Masalah build sekarang** (`docs/screens/1440-sleep-state3.jpg`): ring terbaca hitam; tiga angka menumpuk sebagai daftar di kolom kanan bersama headline; belum "satu angka per langkah scroll".

**Target dari referensi:**
- **Ref 1 Ultrahuman, rim light → State 1.** Ring Silver glossy besar di latar Night, hampir seluruh badan gelap; yang terlihat hanya **tepi/bevel yang tersapu satu cahaya dingin dari satu sisi**, rotasi pelan. Komposisi seperti ref: ring besar, boleh terpotong tepi layar, ruang kosong luas di sisi teks. Ini soal env/lampu (env Night + satu rim light), bukan mengganti material; silver harus tetap terbaca sebagai silver di bagian yang terkena cahaya.
- **Ref 2 Sensiq, label + angka → States 2–4.** Label caps kecil mono (`[ SETTLED ]`) di atas **satu angka besar**, satuan kecil terangkat (`7ʰ 12ᵐ`). Pinjam struktur hurufnya saja; weight tetap D-082, warna Paper di atas Night.
- **Ref 3 Ultrahuman, satu angka per scroll.** Hanya **satu angka besar aktif** di satu slot; saat scroll, angka berikutnya menggantikannya dan angka sebelumnya **meredup** (mengecil/turun opacity, tidak hilang mendadak). Satu baris kecil di bawah angka. Warna kita (Paper + satu aksen Ochre pada label aktif), bukan hijau mereka.

**State (alur dari storyboard):**
| State | Isi | Ring |
| --- | --- | --- |
| 1 · 0% | Gelap, kicker `Last night`, jam 23:10 | Tengah (lanjutan S02), hanya tepi yang kena cahaya dingin, rotasi pelan |
| 2 · 33% | `Last night, in one view.` + `[ SETTLED ] 23:10` sebagai angka besar | Bergeser ke satu sisi sesuai komposisi ref 1, rotasi sangat pelan |
| 3 · 67% | `[ RESTED ] 7h 12m` menggantikan di slot yang sama; 23:10 meredup | Tetap berputar pelan |
| 4 · 100% | `[ BROKEN ] 2×` + `A picture of the night, not a verdict on it.` + `Simulated data`; lalu semua memudar ke S04 | Menghadap kamera, logo terbaca (pelajaran D-089) |

Usulan sisi: ikuti ref 1 (teks kiri, ring kanan) bila komposisinya lebih kuat; bila tetap ring kiri seperti build sekarang, jelaskan alasannya di laporan. Pilihan ini akan saya cek terhadap ref.

## 2. S04 · Activity & rest — 07:40 → 15:30 · Night (baru)

Branch `Developer-s04-s05-wip` (`1628912`) dibuat dari base lama (`ceeb0b0`, sebelum D-080–D-089). **Jangan di-merge.** Boleh dibaca untuk logika, tetapi bangun di atas HEAD `Developer` sekarang.

**Target dari referensi (ketiganya Oryzo "So portable, it's wearable"):**
- **Ref 1 → State 1:** judul kiri atas (`ACTIVITY` caps + `and rest.`, pola "SO PORTABLE, it's wearable"), paragraf pendek di bawahnya; **satu foto besar portrait di tengah dalam bingkai garis putus-putus**; foto lain kecil berjajar di kanan-kiri; `Scroll to continue` kecil di bawah tengah. Latar Night hangat (lihat warna latar ref, tetap dari token Night).
- **Ref 2 → States 2–4:** saat scroll, **strip bergeser ke kiri** dan foto berikutnya masuk ke bingkai (foto yang keluar mengecil ke kiri). Kiri bawah: **jam besar** + titik status + durasi + `Simulated data`. Kanan bawah: **daftar jam**, jam aktif terang, lainnya redup.
- **Ref 3 → State 5:** foto lain sudah keluar, **garis bingkai memudar**, tinggal satu foto, lalu foto menggelap menuju Dusk (masuk S05).

**Data (D-066):** 07:40 `Moving · 25 min walk` · 09:00 `Resting · 40 min focus` · 10:30 `Moving · 15 min stretch` · 12:30 `Resting · 30 min lunch` · 15:30 `Moving · 20 min stairs`. Jam navbar ikut berganti.
**Foto:** 5 foto C-02 V1 (D-064, tanpa retouch D-073): `design/assets/v1/home/S3-0740-moving-walk.png` … `S3-1530-moving-stairs.png` (varian `S3p-*` untuk potret/mobile). Alt dari home-copy-v2 §04. Ring 3D tidak tampil (hanya di jari pada foto).

## 3. S05 · Daily insight — 17:30 · Dusk (baru)

**Target dari referensi:**
- **Ref 3 Oryzo, gradient ochre → gelap:** latar **Dusk** = gradient Ochre → Night dengan glow hangat dari sudut bawah (seperti ref), bukan oranye datar. Ring Silver glossy dengan env Dusk (`design/3d/v2/env/v2-env-dusk.exr`, branch 3D-Designer) **membesar sampai memenuhi layar**, kamera masuk ke lubang ring. Glow tidak boleh berada di atas ring.
- **Ref 1 Ultrahuman, kartu outline → kartu app:** satu kartu dengan **outline tipis**, latar gelap transparan, satu label mono kecil + jam, satu kalimat. Kartu adalah HTML asli (bisa dipilih), duduk **di dalam lubang ring**.
- **Ref 2 Sensiq, satu angka tenang:** di kartu hanya ada **satu angka di tengah** (`7h 12m`), tidak ada elemen lain yang bersaing.

**State (alur dari storyboard):**
| State | Isi | Ring |
| --- | --- | --- |
| 1 · 0% | Latar Dusk, `Everything it noticed.` | Besar di kanan-tengah, muncul saat foto 15:30 memudar |
| 2 · 33% | `Everything it noticed. One calm view.`, teks bergeser ke pinggir | Membesar, kilau di tepi bergerak |
| 3 · 67% | Kartu app muncul di dalam lubang ring | Memenuhi layar |
| 4 · 100% | Kartu terbaca penuh (+ body opsional di pinggir) | Diam |

**Isi kartu (home-copy-v2 §05):** `LAST NIGHT` · `7h 12m` · progress bar tanpa persen · `Settled 23:10 · Up 06:22` · `You took more short pauses this afternoon than on most weekdays.` · `Simulated data`.
**Keluar ke S06:** kartu memudar, kamera mundur, Dusk → Paper. S06 belum dibangun: cukup akhiri dengan transisi ke placeholder S06 yang rapi, tanpa membangun S06.

## 4. Batas lingkup

- Kerjakan hanya S03 (rombak), S04, S05, plus sambungan 02→03, 03→04, 04→05, dan keluar 05→placeholder. S06+ tetap ditahan (D-076).
- Jangan menyentuh `web/` (D-059). Jangan deploy (D-086); deploy hanya atas permintaan pengguna.
- Aset baru (mis. env Dusk dari branch 3D-Designer) boleh disalin ke `web-v2/public/`. Bila butuh aset yang belum ada, tanya dulu lewat laporan.

## 5. Laporan yang saya butuhkan untuk review

Simpan screenshot di `web-v2/docs/screens/s03-s05-d090/`, desktop 1440 dan mobile 390:
- S03 state 1–4, S04 state 1–5, S05 state 1–4, dan titik tengah tiap sambungan (02→03, 03→04, 04→05).
- Untuk tiap screenshot state yang punya referensi, tulis satu baris: "ref X → yang ditiru → yang sengaja beda dan alasannya".
- Commit di branch `Developer` dengan pesan yang menyebut D-090; jangan merge ke main sebelum ditinjau.
- Daftar pertanyaan terbuka bila ada (mis. sisi ring S03, kekuatan rim light).

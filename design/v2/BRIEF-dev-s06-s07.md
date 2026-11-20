# Brief Developer — Bangun S06–S07 (V2)

Dari: Claude Code (main, Project Manager) · 20 November 2026 · Dasar: D-093
Untuk: Developer (`web-v2/`, branch `Developer`, di atas `49d5453`; main `901e0fc` sudah berisi commit ini)

## 0. Cara kerja (sama dengan D-090)

1. **Storyboard = alur, bukan visual.** `context/Visual Directions V2/Storyboard.md` §2 (S06, S07) dan §3 (sambungan 05→06, 06→07, 07→08) hanya untuk urutan state, jam navbar, dan apa yang terjadi saat scroll.
2. **Moodboard Layout = visual dan interaksi.** Baca `Moodboard.md` §2 dan §6, lalu buka Figma lewat Figma MCP:
   - File `ejtNpUf0FdEYMgAbcENMCH`, section `40004118:50`.
   - Sticky note S06 `40004118:112`, S07 `40004118:121`.
   - Gambar referensi (kiri → kanan):
     - S06: `40004185:57` · `40004202:51` · `40004202:53`
     - S07: `40004124:86` · `40004124:88` · `40004124:90`
   - Salinan PNG: `/Users/zaimmaulana/Orca/projects/Smart Ring/design/v2/references/s06-ref-*.png` dan `s07-ref-*.png`.
   - Buka juga situs aslinya untuk melihat gerak scroll: ultrahuman.com/ring, sofihealth.com, sensiq.co, obsidianassembly.com.
3. **Aturan membaca note:** bila note mengaitkan referensi ke sebuah state, tiru layout dan interaksinya. Bila hanya meminjam satu sifat, ambil sifat itu saja.
4. **Pengganti isi referensi:**
   - Ring hitam Ultrahuman (S06 ref 1) diganti **ring Silver glossy** (D-085), seperti di S03.
   - Huruf serif Obsidian Assembly (S07) **tidak** dipakai. Tipografi tetap Geist dan Geist Mono dengan weight D-082. Yang ditiru dari Obsidian adalah layout, pembagian kata, kartu, counter, garis orbit, dan interaksinya.
5. Copy dari `context/home-copy-v2.md` §06 dan §07. Angka D-067 tampil tanpa `*` dan tanpa label "Illustrative". Panel baterai mingguan tetap berlabel `Simulated data`.
6. Tetap berlaku: D-063 (satu canvas WebGL), D-082, D-083, D-085, D-062 (LED mati di luar S08), palet 5 warna, reduced motion (fade ±300 ms), mobile pin + scrub (D-069).

## 1. S06 · Product details — 21:00 · Paper + alas Sand

**Sticky note:** satu latar terang dari awal sampai akhir. Ring menggelinding masuk, berputar, lalu masuk ke tangan tanpa background. Tidak ada drag di sini (drag ada di S10). Sensor disimpan untuk S08.

**Target dari referensi:**
- **Ref 1 Ultrahuman, ring berdiri di tepinya → State 1.** Ring Silver glossy menggelinding masuk di atas alas Sand, lalu berhenti tegak menghadap kamera seperti pose ref. Di ref, satu fakta kecil tertulis di dalam lubang ring; pakai pola ini untuk headline `Made to be forgotten.` atau langkah teks bila komposisinya kuat. Bila tidak, judul di kiri seperti storyboard, dan jelaskan pilihannya.
- **Ref 2 Sofi, produk di satu tangan cut-out → State 4.** Latar polos terang, headline di atas, tangan cut-out memegang produk di tengah.
- **Ref 3 Sensiq, ring di jari, tangan cut-out → State 4.** Headline di kiri, tangan cut-out di kanan tanpa latar apa pun, satu label/data kecil di samping tangan.
- **Gabungan State 4:** `Then, it just fits.` + body di kiri (Sensiq). Tangan cut-out kiri C-02 (D-072: punggung tangan ke kamera, telunjuk tegak) di kanan, di latar Paper polos. Ring 3D meluncur turun dari ujung telunjuk ke pangkalnya, lalu menyatu dengan ring di foto. Satu label kecil di samping tangan (mis. `[ SILVER · POLISHED ]` atau label yang setara dari copy; jangan mengarang angka baru).

**State (alur storyboard):**
| State | Isi | Ring |
| --- | --- | --- |
| 1 · 0–25% | `Made to be forgotten.` | Menggelinding dari kiri di atas alas Sand (±55% lebar layar desktop, ±40% mobile). Rotasi sesuai jarak tempuh, lewat sedikit, bergoyang balik, lalu diam menghadap kamera dengan logo di atas. Bayangan di alas ikut bergeser |
| 2 · 33% | `One quiet band` + body | Berputar ±90° ke sisi samping, pantulan berubah |
| 3 · 67% | `Softened edges` + body | Miring 45° dari tepi, pantulan memanjang |
| 4 · 100% | `Then, it just fits.` + body, tangan di kanan | Meluncur ke pangkal telunjuk dan menyatu dengan ring di foto |

Semua gerak mengikuti scroll (bisa maju dan mundur). Logo "Stillway" harus terbaca di momen diam (pelajaran D-089).

**Aset:**
- Tangan tanpa ring: `design/assets/v2/A-1-hand-left-alpha.png` (cut-out, alpha). Tangan dengan ring: `A-1b-hand-with-ring.png` untuk frame akhir setelah ring 3D menyatu.
- Pose akhir ring di jari: `design/3d/v2/s06-pose.json` (sudah ada di main).
- Alt: lihat home-copy-v2 §06.

**Sambungan 05→06 (sisa ronde D-090):** pita abu-abu keruh di tengah transisi Dusk → Paper harus hilang sekarang. Storyboard §3: kartu app memudar → kamera mundur dari dalam ring, ring mengecil dan turun ke alas di kiri, Dusk → Paper, alas Sand muncul → ring berdiri di alas (= frame pertama S06), langsung menggelinding. Jam 17:30 → 21:00.

## 2. S07 · Specs & benefits — 21:00 · Sand → foto full-bleed

**Sticky note:** "Through the day" terbelah, empat kartu foto (Night, Desk, Move, Rinse) naik di antara kata-katanya. Lalu satu kartu per state dengan judul (I)–(IV) di atas garis tipis, counter 1/4, garis orbit, dan panel mini putih berisi satu spesifikasi yang bisa disentuh. Di akhir, kartu terbuka menjadi foto full-bleed "The Everyday".

**Target dari referensi:**
- **Ref 1 Obsidian, kata terbelah + 4 kartu → States 1–2.** Latar Sand. `Through` di kiri dan `the day.` di kanan dalam ukuran display besar, empat kartu foto potret berjajar rapat di tengah di antara dua kata itu. Pill kecil `MADE FOR EVERY HOUR` dan garis tipis di bawah seperti ref.
- **Ref 2 Obsidian, satu kartu fokus → States 3–4.** Satu kartu besar di tengah (kartu lain bertumpuk di belakang). Judul `(I) Night` di kiri pada garis tipis, kalimat pendek di kiri atas dan kanan atas, counter `1/4` dengan progress lingkaran di kanan, garis orbit tipis melingkari kartu, dan panel mini putih kecil di kanan bawah berisi satu kontrol spesifikasi.
- **Ref 3 Obsidian, kartu terbuka jadi tempat → State 5.** Kartu mengecil ke tengah sementara foto `A-3-everyday.png` di belakangnya membesar sampai full-bleed. `The Everyday` besar melintang di tengah, caption kecil `Ring shown where it's worn.`

**State (alur storyboard):**
| State | Isi |
| --- | --- |
| 1 · 0% | `Through the day.` besar di tengah + pill `MADE FOR EVERY HOUR` |
| 2 · 25% | Kata terbelah (`Through` ke kiri, `the day.` ke kanan); 4 kartu naik dari bawah ke tengah |
| 3 · 50% | (I) Night · 1/4 fokus. Panel mini: baterai Mon–Sun yang bisa digeser per hari + `Simulated data` |
| 4 · 75% | 2/4 Desk (slider ukuran `Size 9`, rentang 6–13) → 3/4 Move (bar berat `4 g`) → 4/4 Rinse (rating `100 m`) |
| 5 · 100% | Kartu mengecil, foto Everyday full-bleed, `The Everyday` |

**Interaksi:** panel mini satu-satunya yang boleh disentuh di S07 (slider/drag kecil). Scroll tidak boleh terkunci oleh panel. Semua kontrol dapat dioperasikan dengan keyboard dan punya label yang terbaca screen reader.

**Aset:** `design/assets/v2/A-2-card-night.png`, `A-2-card-desk.png`, `A-2-card-move.png`, `A-2-card-rinse.png`, `A-3-everyday.png` (D-077). Ring 3D tidak tampil di S07 (hanya di foto kartu).

**Keluar ke S08:** cukup akhiri dengan transisi bersih ke placeholder S08 (foto full-bleed menggelap ke Night). S08 tidak dibangun.

## 3. Batas lingkup

- Kerjakan S06, S07, sambungan 05→06, 06→07, dan keluar 07→placeholder S08. S08+ tetap ditahan.
- Jangan ubah S01–S05 kecuali sambungan 05→06.
- Jangan sentuh `web/`. Jangan deploy, push, atau merge ke main sebelum ditinjau.
- Aset dari branch lain boleh disalin ke `web-v2/public/`. Bila butuh aset yang belum ada, tanya dulu lewat laporan.

## 4. Laporan untuk review

Simpan screenshot di `web-v2/docs/screens/s06-s07-d093/`, desktop 1440 dan mobile 390:
- S06 state 1 (termasuk frame 8%, 16%, 22% urutan gelinding), 2, 3, 4.
- S07 state 1, 2, 3, 4 (Desk, Move, Rinse), 5.
- Titik tengah sambungan 05→06, 06→07, 07→08.

Untuk tiap state yang punya referensi, tulis satu baris: "ref X → yang ditiru → yang sengaja beda dan alasannya". Commit di branch `Developer` dengan pesan yang menyebut D-093. Sertakan pertanyaan terbuka bila ada.

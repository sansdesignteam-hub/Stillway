> **ARSIP · 23 Nov 2026:** revisi v3 di-rollback (D-131). Dokumen ini hanya catatan, bukan acuan kerja.

# Review PM — Storyboard v3, QA, dan Moodboard (23 Nov 2026)

Dari: Claude Code (main, Project Manager) · 23 November 2026
Untuk: pengguna dan Developer (`web-v2/`, branch `Developer`)
Status: K1–K10 sudah diputuskan pengguna pada 23 Nov (D-103 sampai D-112). Rencana kerja ada di `design/v2/BRIEF-dev-v3-revisi.md`.

## 0. Yang dicek

- **Dokumen.** Disimpan di `context/Visual Directions V2/`, versi lama ada di `arsip/`:
  - `Storyboard.md` (v3)
  - `QA.md` (baru)
  - `Moodboard.md` (isi 23 Nov)
- **Figma** (file `ejtNpUf0FdEYMgAbcENMCH`, lewat Figma MCP, berhasil):
  - Design 1440 (`40004245:50`): semua frame state dan transisi.
  - Storyboard 2 (`40004287:1270`): semua catatan teks.
  - QA board (`40004269:1170`): skor dan ID temuan.
  - Komentar Figma: tidak ada komentar terbuka.
- **Pembanding:**
  - `context/decisions.md` (D-001 sampai D-102).
  - Kode `web-v2/` di main (`81318d9`).
  - Kontras warna dihitung ulang.

Ringkasnya, ketiga dokumen rapi dan saling merujuk. Hitungan QA (45 temuan, 3 P1 / 25 P2 / 11 P3 / 2 Keputusan) cocok. Grid 1440 (40 + 12×84 + 11×32) dan sumbu y 482 juga cocok, begitu pula semua rasio kontras di Moodboard. Masalah utamanya ada dua:
1. Beberapa isi dokumen **bertentangan dengan keputusan yang sudah disetujui** (§1).
2. **Storyboard 2 di Figma** masih menyimpan catatan lama yang bertentangan dengan `Storyboard.md` v3 (§2).

## 1. Bertentangan dengan keputusan yang sudah disetujui (perlu keputusan pengguna)

| # | Dokumen baru | Keputusan yang berlaku | Rekomendasi PM |
|---|---|---|---|
| K1 | **Acuan tampilan untuk dev = frame Design 1440 di Figma** (Storyboard hlm. 1 dan §"Cara membaca", QA §6). | D-090, D-093, D-096, D-098: Storyboard hanya alur. Layout dan interaksi meniru referensi dan sticky note Moodboard Layout (`40004118:50`). | Terima. Design S07 dan S09–S11 sudah disamakan dengan live, jadi Design menjadi target paling jelas. Perlu dicatat sebagai keputusan baru yang menggantikan alur kerja D-090. |
| K2 | **S04 memakai layout Day arc** (busur R 1340; "dipilih 23 Nov", QA A-07). | D-092: S04 memakai proporsi heading dan scroll-slide strip V1. | Perlu konfirmasi: apakah Day arc menggantikan D-092? Ini perubahan S04 terbesar. |
| K3 | **S02:** label "WHY STILLWAY" tampil dan underline ochre ada di State 4 (QA W-01, W-02). Background Paper polos. | D-084 (3): label dan underline **dihapus**. D-088: background foto dinding dengan bayangan daun. | Perlu keputusan. Saran: pertahankan D-084 dan D-088, lalu tutup W-01 dan W-02 sebagai "sesuai keputusan". |
| K4 | **Tanda `*` pada angka** ("$299*" di S10, aturan `*` di Storyboard). | D-067: angka tampil **tanpa** `*`. Disclaimer ada di footer. | Ikuti D-067. Design Figma sudah menulis "$299" tanpa `*`. Hapus `*` di Storyboard dan Storyboard 2. |
| K5 | **Tangan S06:** foto tangan cut-out tanpa ring (aset "Baru" dan prompt foto di §4). Ring 3D jatuh dari tepi meja ke jari. | D-102: **tangan 3D realistis** (Blender, brief `design/3d/v2/BRIEF-3d-s06-hand.md`); tangan naik dan masuk ke ring. | Perlu keputusan. Saran: tetap pakai tangan 3D (D-102), tetapi ambil koreografi Storyboard (meja kayu, ring menggelinding, jatuh, mendarat di pangkal jari). Prompt foto tangan di §4 tidak dipakai. |
| K6 | **Cahaya S03:** Storyboard memakai sorotan hangat cocoa/200 dari atas, dan catatan di Figma menulis "rim light dingin tidak dipakai lagi". QA SL-02 justru meminta rim light dingin dari satu sisi. | D-091: ring Silver tetap terbaca dengan **rim light dingin**. | Tiga sumber saling bertentangan. Perlu satu pilihan: sorotan hangat (Storyboard) atau rim light dingin (D-091 dan QA). |
| K7 | **Dusk S05 dibuat dari Cocoa**, "bukan ochre lagi" (Moodboard §2.3). | D-090: S05 memakai gradient ochre ke gelap dari referensi Oryzo. Kode `--dusk` masih ochre. | Perlu konfirmasi. Ini ikut berubah kalau token warna baru (K9) diterima. |
| K8 | **Legenda S08 boleh diklik di desktop** (opsional). | D-096: legenda hanya label, bukan tombol. | Pertahankan D-096. Fitur ini opsional, jadi aman diabaikan. |
| K9 | **Token warna dan tipe baru:** Paper #F9F5EF, Sand #F0E8DD, Night #1B0B06, skala Cocoa, Stone solid #6B655F, Display/Heading Geist Medium 500. | Kode memakai Paper #F7F5F0, Sand #EFE6DB, Night #17120F, Stone = Ink 65%, heading weight 450 (D-082: "tebal seperti S01"). | Terima. Selisihnya kecil dan Figma Foundation menjadi sumber token. Perlu persetujuan karena mengubah semua section. |
| K10 | **G-01 "material ring berganti"** (gold di S01, hitam di S03, champagne di S05). | D-085: satu `silver_polished` di semua section. Kode sudah begitu: `stage.ts`, `poses.ts`, `gloss = 1`. | Ini bukan pergantian material, tetapi efek env/pencahayaan: pantulan moss membuat ring tampak gold, env Night membuatnya tampak hitam. Saran: ubah G-01 menjadi temuan "ring harus tetap terbaca silver di tiap env". Aset Design (`Ring / S01 · gold macro`, dan lainnya) masih render lama. |

## 2. Figma Storyboard 2 belum sinkron dengan `Storyboard.md` v3

Kalau dev membaca Figma, bagian berikut menyesatkan. Perlu dirapikan Designer, atau ditandai "abaikan, ikuti `.md`".

- **Judul section** masih "draft 20 Nov, untuk revisi QA", dan heading bagian masih "04 / STORYBOARD 8 SECTION". Isinya sudah 11 section dan menjadi acuan alur.
- **S08:**
  - Catatan dev menulis "Off tidak dijadikan state; cukup satu baris… di State 3" dan "ungu penuh di 100%". Padahal v3 punya **State 4 lampu merah**, dan ungu penuh di 90%. Frame Design 08 State 4 sudah ada.
  - Tag tertulis "[ SENSOR · LAMPU ]" (bahasa Indonesia). Design sudah benar, "[ SENSOR · LIGHT ]" (D-021).
- **03→04:** jam di catatan dan di frame Design State B menunjukkan **07:10**. `.md` menulis 23:10 → 05:30 → 07:40.
- **S06:**
  - Jarak gelinding ditulis ±55% layar desktop. `.md` menulis ±40%.
  - Reduced motion ditulis "fade 300 ms". Aturan global maksimal 250 ms.
  - Ada "judul fade in" dan "teks langkah 1 fade in". Aturan global: teks berganti dengan bergerak naik.
  - Ada "Alas: plane Sand" (lama).
  - Ada "saat mendarat cross-fade ke foto/komposit ring di jari". Ini bertentangan dengan "ring tidak pernah muncul atau hilang lewat fade" dan dengan D-102.
- **S07:** radius kartu depan ditulis 12. `.md` menulis 6.
- **S09:**
  - Blok copy masih lama: "measured minute by minute" (sudah diganti di `home-copy-v2.md` karena menyiratkan akurasi klinis) dan "One number tells you how the night paid off.".
  - Teks per state sudah benar.
- **09→10:** "ring sticky di tile". `.md` menulis ring tanpa kotak foto.
- **S11:** blok copy menulis FAQ 4 pertanyaan dan "Footer: share". Yang berlaku: 6 FAQ, dan tanpa share (D-069).
- **S01:** blok copy menulis CTA "Explore Stillway" dan "wordmark… memudar". `.md` menulis "Scroll down" dan "naik keluar layar".
- **S05:** "tiba dari transisi 'lensa menutup'". `.md` menulis ring naik dari bawah (gaya Viture).
- **S02:** paragraf 1 tertulis "Heart rate, temperature and sleep…". Yang dipakai (QA W-03): "Sleep, heart rate and temperature…".
- **Sisa layout lama** masih ada:
  - "Track (auto layout… foto aktif kolom 5–8)" di Storyboard 2.
  - Layer "Filmstrip" di frame Design 03→04 dan 04→05.

## 3. Inkonsistensi di dalam dokumen

**QA.md**
- **Skor heuristic** tertulis 3.0 di dokumen dan 2.7 di board Figma. Rata-rata dari skor H1–H10 yang tercantum (3, 4, 3, 2, 3, 4, 3, 3, 2, 2) adalah **2.9**.
- **G-01** berprioritas P1 di tabel, tetapi juga masuk §4 "Perlu diputuskan". Pilihannya sudah diputuskan di D-085 (lihat K10).
- **SL-01** masih menulis "Storyboard: ring kiri, angka kanan". Storyboard v3 sudah memakai ring kanan sesuai build, jadi tinggal dicatat sebagai keputusan.
- **G-13** menyebut nilai live "Night #160E09, Cocoa #2B201A". Kode sebenarnya Night #17120F, tanpa token Cocoa, dengan Paper #F7F5F0 dan Sand #EFE6DB. Kesimpulannya tetap sama: kode belum memakai token baru.
- **G-04:** daypart untuk 07:10 kosong.
- **HE-04** membatasi section maksimal 3–4 tinggi layar. S07 punya 7 state dan S04 punya 5, jadi Developer perlu menjaga panjang scroll.

**Moodboard.md**
- **Header dan link:** header masih "v2 · 19 Nov", padahal isinya sampai 23 Nov. Link Figma masih bernama "Website AI - 1 Ring" (file key-nya sama).
- **Hex ochre/700:** §2.2 menulis #945920. Di skala tertulis #97571C. Keduanya ±5.2:1 di atas Paper, tetapi hex-nya perlu disamakan.
- **S06 di §2.5:** masih "Paper + alas Sand". Seharusnya meja kayu.
- **S10 di §6.0:** "Tile 560". Storyboard menulis ring tanpa kotak foto.
- **S11 di §6 ref 3:** "statement caps". Aturan baru memakai sentence case.
- **Tinggi navbar:** §6.0 menulis 76. Perhitungan y 482 memakai bawah navbar di 64.

**Storyboard.md**
- **Header** masih "v3 · 20 Nov", padahal sudah ada revisi 23 Nov.
- **06→07:** sambungannya mengecilkan foto tangan dan ring menjadi kartu. Dengan tangan 3D (D-102), cara sambungan ini harus didefinisikan ulang supaya aturan "ring tidak pernah diganti gambar lain" tetap terpenuhi.

**Design (Figma)**
- **Jam navbar di tema terang** ditulis ochre di atas pill putih, kontrasnya 3.96:1. Untuk teks 13 px ini gagal AA. Moodboard sendiri menyarankan ochre/700 untuk label kecil di latar terang.
- **Warna ring di 03→04 State B** tampak gunmetal gelap. Lihat K10.

## 4. Aman dikerjakan setelah lampu hijau (tidak bertabrakan dengan keputusan)

- **G-03 / M-01:** teks crossfade bertumpuk; ganti dengan gerak naik.
- **G-04:** daypart 17:30 menjadi EVENING.
- **G-06, G-07, G-08:** favicon dan og:image, spasi di H2, alt dekoratif.
- **G-10, G-11:** grid dan pusat vertikal di y 482 (S09, S10).
- **A-01, A-02:** foto S04 2×, awal S04 tidak terlalu gelap.
- **I-01, I-02:** kontras paragraf S05 dan teks yang menimpa ring.
- **I-03:** kartu kaca 432 px.
- **C-01:** wordmark footer kapital "STILLWAY". Tidak bertentangan dengan D-083, yang mengatur logo navbar.
- **F-01:** state lampu merah S08. Sejalan dengan D-062 dan D-099.
- **S7-01:** layout S07 23 Nov (tanpa kartu data). Angka D-067 tetap.
- **HE-01 sampai HE-07:** navbar aktif, progres, deep link, 404.
- **Transisi besar** (H-03, W-04, A-05, A-06; ring sticky dan panel naik). Tidak bertabrakan dengan keputusan, tetapi pekerjaannya paling besar.
- **Tergantung keputusan:** A-07 (K2), D-01 sampai D-03 (K5), SL-02 (K6), G-09 dan G-13 (K9), W-01 dan W-02 (K3).

## 5. Untuk Developer

1. Baca `context/Visual Directions V2/Storyboard.md`, `QA.md`, `Moodboard.md`, lalu dokumen ini.
2. Buka Figma Design `40004245:50` lewat Figma MCP. **Jika Figma MCP gagal, berhenti dan lapor ke PM.**
3. **Jangan ubah kode dulu.** §1 belum diputuskan pengguna.
4. Balas ke PM dengan catatan teknis singkat:
   - Apakah arsitektur sekarang (`Stage.astro`, `story.ts`) sudah satu ring sticky, atau perlu dirombak untuk model "panel naik + ring sticky"?
   - Perkiraan bobot kerja per kelompok: transisi, S04 Day arc, S06 meja dan jatuh, S08 lampu merah (apakah GLB punya node `led_power` atau jendela bawah?), token warna dan tipe.
   - Risiko performa atau mobile yang terlihat.

## 6. Balasan Developer (23 Nov, hanya-baca, repo tidak berubah)

Laporan lengkap ada di `design/v2/REPORT-dev-review-v3.md`.

**Inti temuan:**
- **Ring sticky sudah ada:** satu stage fixed dengan satu canvas.
- **Model "panel naik" belum ada:**
  - background masih cross-fade;
  - konten masih memakai opacity;
  - ring masih di-fade lewat `pose.alpha` di 8 modul;
  - jam hanya punya dua titik;
  - tema navbar belum mengikuti tepi panel.

  Akibatnya, `story.ts` perlu ditulis ulang dan bagian masuk/keluar 11 modul ikut disentuh.

**Bobot kerja:**
- **Besar:** transisi dan S06. S06 terblokir sampai GLB tangan dari D-102 ada.
- **Sedang:** Day arc, token warna dan tipe.
- **Kecil sampai sedang:** S08. GLB sudah punya node `led_power` di jendela sensor bawah.

**Pertanyaan baru (D-1 sampai D-11 di laporan Developer):**
- gelinding S06 dan perputaran sumbu ring ±90° saat jatuh;
- jejak gerak (salinan ring transparan) yang bertentangan dengan aturan tanpa fade;
- kilau 600 ms yang berbasis waktu, padahal semua gerak scrub;
- spesifikasi mask dan blur lensa 03→04;
- breakpoint text style;
- lampu merah S08 yang terlalu singkat (±0,3 tinggi layar);
- cara 06→07 dengan tangan 3D (render-to-texture atau foto render);
- batas daypart EVENING.

**Tambahan untuk K10:** pantulan moss di S01 disetujui di D-081. Akibatnya, membuat S01 "terbaca silver" sama dengan mengubah D-081, bukan hanya D-085.

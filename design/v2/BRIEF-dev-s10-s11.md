# Brief Developer — Bangun S10–S11 (V2)

Dari: Claude Code (main, Project Manager) · 20 November 2026 · Dasar: D-098
Untuk: Developer (`web-v2/`, branch `Developer`, di atas `31c7955`; main `b200e96` sudah berisi commit ini)

## 0. Cara kerja (sama dengan D-090, D-093, D-096)

1. **Storyboard = alur, bukan visual.** `context/Visual Directions V2/Storyboard.md` §2 (S10, S11) dan §3 (sambungan 09→10, 10→11).
2. **Moodboard Layout = visual dan interaksi.** Baca `Moodboard.md` §2, §4, §6, lalu buka Figma lewat Figma MCP. **Kalau Figma MCP gagal mengambil konteks, hentikan pekerjaan dan lapor ke Project Manager.**
   - File `ejtNpUf0FdEYMgAbcENMCH`, section `40004118:50`.
   - Sticky note S10 `40004118:141`, S11 `40004118:150`.
   - Gambar referensi (kiri → kanan):
     - S10: `40004124:98` · `40004124:100` · `40004124:102`
     - S11: `40004124:104` · `40004124:106` · `40004124:108`
   - Salinan PNG: `/Users/zaimmaulana/Orca/projects/Smart Ring/design/v2/references/s10-ref-*.png` dan `s11-ref-*.png`.
   - Lihat juga gerak di situs aslinya: mirelz.com/try-on, shiftrobotics.io/products/moonwalkers-dusk, ultrahuman.com/ring/buy, oryzo.ai (bagian akhir halaman).
3. **Aturan membaca note:** state yang dikaitkan ke referensi ditiru layout dan interaksinya; sifat yang hanya dipinjam diambil sifatnya saja.
4. **Pengganti isi referensi:**
   - Tombol lime Shift dan tombol teal Mirelz tidak dipakai: **CTA Ink #1C1B1A** (sticky S10), teks Paper.
   - Serif atau font tebal Oryzo tidak dipakai: Geist, weight D-082.
   - Footer Oryzo punya form newsletter dan share: **tidak dipakai** (D-069 poin 3).
   - Logo footer: sticky S11 sekarang menulis **wordmark teks saja (Geist Medium)**, sama dengan navbar (D-083). Ring mark di Storyboard tidak dipakai.
5. Copy dari `context/home-copy-v2.md` §10 dan §11. Tetap berlaku: D-015/D-067 ($299, tanpa `*`), D-068 (30-night trial), D-069 (finish hanya lewat klik swatch, bukan scroll; CTA navbar/S11 → S10; mobile: swipe untuk memutar), D-074 (respons tombol inline `role="status"`, bukan modal, tanpa cart), D-085 (Silver, Black, Gold **semuanya glossy/polished**), D-079 (Gold = `gold_b`, env Lamp netral), D-083, D-082, palet 5 warna, reduced motion.

## 1. S10 · Finishes & pricing — 22:00 · Sand

**Sticky note:** "turn it, pick it, buy it — all in one place."

**Target dari referensi:**
- **Ref 1 Mirelz, viewer drag 360° → State 1.** Ring besar di kiri/tengah-kiri di atas latar Sand, **diputar sendiri oleh pengguna** (drag mouse / swipe), hanya berputar tanpa zoom. Tombol `‹` `›` untuk lompat sudut (aria `Previous angle` / `Next angle`), petunjuk kecil `Drag to turn` (mobile `Swipe to turn`). Kembali pelan ke pose awal bila dibiarkan beberapa detik. Logo "Stillway" terbaca di pose awal.
- **Ref 2 Shift PDP, panel kanan.** Panel di kanan: nama/judul, harga, `Finish` dengan swatch bulat + label di bawahnya, `Size` dengan pilihan kotak 6–13, satu tombol utama lebar penuh, satu tautan kecil di bawahnya. Rapi, banyak ruang kosong.
- **Ref 3 Ultrahuman PDP, swatch mengganti material.** Klik swatch mengganti **material ring sungguhan** (warna, kilap, pantulan), bukan hanya tint. Gunakan `design/3d/v2/finishes.json` (Silver = `silver_polished`, Black glossy, Gold = `gold_b` glossy, D-085). Toggle cahaya `Daylight` / `Lamp light`: Lamp memakai env Lamp yang lebih hangat dan panel ikut sedikit menghangat.

**State (alur storyboard):**
| State | Isi | Ring |
| --- | --- | --- |
| 1 · 0% | `Turn it yourself.` + hint + `‹` `›`, panel kanan dengan finish default Silver | Bisa diputar 360° |
| 2–3 | Contoh pilihan pengguna (Black, lalu Gold + Lamp light). **Bukan** digerakkan oleh scroll (D-069) | Material berganti saat swatch diklik |
| 4 · 100% | `Find your size and finish.` + panel lengkap: Size 6–13, `$299`, `Every finish, same price. No required subscription.`, `30-night trial`, isi box, tombol `Choose {finish} · $299` | Diam di finish terpilih |

Tombol utama: klik → catatan inline `Stillway is a concept project and is not for sale.` (`role="status"`), tanpa cart (D-069, D-074). Semua kontrol bisa keyboard; drag tidak boleh mengunci scroll halaman (di mobile, swipe horizontal memutar ring, swipe vertikal tetap scroll).

**Sambungan 09→10:** isi layar HP dan deskripsi memudar; HP bergeser ke kanan dan melebar menjadi panel; Paper → Sand; ring muncul di kiri; isi panel muncul; jam 21:00 → 22:00.

## 2. S11 · Closing, FAQ & footer — 06:50 besok · Night + Ember glow

**Sticky note:** satu kanvas gelap tanpa putus dari CTA sampai footer.

**Target dari referensi:**
- **Ref 1 Oryzo "Choose your own" → States 1–2.** Ring di tengah dengan **glow hangat dari atas** (Ember glow, di belakang ring, tidak pernah di atas ring). Satu kalimat penutup melintang di depan ring: kicker caps kecil `TOMORROW MORNING,` + `see your night.` sangat besar. Lalu satu tombol + satu baris kecil.
- **Ref 2 Oryzo paper → State 3.** FAQ `Questions, briefly.` sebagai **satu kolom sempit** di latar gelap yang sama, tanpa panel putih. Accordion, satu jawaban terbuka pada satu waktu. Tombol diulang di bawah FAQ.
- **Ref 3 Oryzo footer → State 4.** Pernyataan caps besar `SLEEP ON IT. STILLWAY KEEPS THE PATTERN.` dan footer di kanvas yang sama: kredit, disclaimer, kontak, menu, back to top. Diakhiri **wordmark "Stillway" selebar layar** (sedikit terpotong di bawah) dengan **hover shine**: satu garis kilap miring ±20° menyapu kiri → kanan, ±0,9 detik, sekali per hover, warna krem #E9DCC8 → putih → amber #F4C98E → krem. Touch: kilau sekali saat terlihat. Reduced motion: logo hanya sedikit lebih terang saat hover.

**State (alur storyboard):**
| State | Isi | Ring |
| --- | --- | --- |
| 1 · 0% | `TOMORROW MORNING,` + `see your night.`, jam navbar 06:50 · Tomorrow | Tengah, di belakang teks, finish yang dipilih di S10 |
| 2 · 33% | Tombol `Find your size and finish →` (→ S10) + baris `No required subscription · Sizing kit included · 30-night trial` | Mengecil, tetap di tengah |
| 3 · 67% | FAQ 6 pertanyaan (home-copy-v2 §11), tombol diulang | Keluar ke atas bersama glow |
| 4 · 100% | Pernyataan caps + footer + wordmark selebar layar | Tidak tampil |

**FAQ 3 (Battery):** tampilkan hanya bagian yang disetujui: `Up to 7 days on a charge, and it tops up on the dock.` Kalimat cara mematikan ring (`hold it on the dock until the light turns red`) **belum disetujui**; jangan ditampilkan dulu.

**Footer** (D-045, D-067, D-069): `©STILLWAY x SANS BROTHERS` · `A concept project by Sans Brothers.` · disclaimer `Stillway is a concept project and is not for sale. Product images are AI-generated. All app data is simulated.` · `Business enquiry` · `E. hello@sansbrothers.com` · menu `Rhythm` `The ring` `The app` `Finishes` `FAQ` · `Back to top`. Tanpa form email, newsletter, atau share.

**Sambungan 10→11:** panel keluar ke kanan; ring dengan finish terpilih pindah ke tengah; Sand → Night + Ember glow; `TOMORROW MORNING, see your night.` muncul; jam 22:00 → 06:50.

## 3. Batas lingkup

- Kerjakan S10, S11, sambungan 09→10 dan 10→11. Setelah ini semua 11 section V2 terbangun.
- Jangan ubah S01–S09 kecuali sambungan 09→10 dan perilaku CTA navbar (harus menuju S10, D-069).
- Jangan sentuh `web/`. Jangan push, merge, atau deploy sebelum ditinjau.
- Aset finish/env dari `design/3d/v2/` boleh disalin ke `web-v2/public/`. Bila GLB untuk Black/Gold glossy belum ada atau tidak cocok, tanya dulu lewat laporan; jangan meminta ke 3D Designer sendiri.

## 4. Laporan untuk review

Simpan screenshot di `web-v2/docs/screens/s10-s11-d098/`, desktop 1440 dan mobile 390:
- S10: state 1 (Silver, pose awal), ring diputar ±90°, Black, Gold + Lamp light, state 4 dengan catatan tombol terbuka.
- S11: state 1, 2, 3 (satu FAQ terbuka), 4 (footer + wordmark), satu frame hover shine di tengah sapuan.
- Titik tengah sambungan 09→10 dan 10→11.
- Reduced motion S10 dan S11 (1440).

Untuk tiap state yang punya referensi, tulis satu baris: "ref X → yang ditiru → yang sengaja beda dan alasannya". Commit di branch `Developer` dengan pesan yang menyebut D-098. Sertakan pertanyaan terbuka bila ada.

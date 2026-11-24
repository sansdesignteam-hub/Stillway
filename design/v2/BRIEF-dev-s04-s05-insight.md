# Brief Developer: sambungan S04 → S05 dan S05 Daily insight (D-142)

Status: disetujui pengguna 23 Nov 2026 (D-142). Kerjakan di branch `Developer` di atas `21c6329`.

## Referensi

| Isi | File di `design/v2/references/` | Node Figma |
|---|---|---|
| Kartu transisi 04 → 05 (acuan gerak sambungan) | `s04-s05-transition-card.png` | tidak dikirim pengguna |
| Baris 05 + 04 → 05 di Figma (ringkasan) | `s05-storyboard-overview.png` | section `40004245:50` |
| S05 State 1–4 | `s05-state1.png` … `s05-state4.png` | `40004260:709`, `:745`, `:781`, `:827` |
| Komponen kartu | `s05-card-last-night.png` | `Card / Last night (Section 05)` `40004260:693` |

Ambil nilai kartu dan state S05 lewat Figma MCP (`get_design_context`). Kalau gagal, berhenti dan laporkan ke Project Manager sebelum menebak.

## 1. Sambungan 04 → 05 (ikuti kartu transisi, bukan baris 04 → 05 di Figma Design)

Kata pengguna: "Transisi dari S04 ke S05 seperti ini" (kartu transisi). Isi kartu:

- Akhir S04: foto 15:30 tinggal sendiri di bingkai aktif, lalu bingkai memudar dan foto menggelap (S04 State 5).
- Awal S05: latar Dusk, ring besar di kanan-tengah, judul section di kiri bawah (S05 State 1).
- 0–30%: bingkai memudar; jam besar, status, dan daftar jam fade out.
- 30–70%: foto 15:30 menggelap dan fade out; latar Dusk naik dari bawah.
- 70–100%: ring 3D fade in di kanan-tengah (scale 0.9 → 1), lalu diam = frame awal S05. Jam navbar 15:30 → 17:30.

Penyesuaian ke build sekarang:
- "Bingkai putus-putus" = bingkai/garis kartu aktif Day arc. Kartu lain dan label jam di busur ikut fade out di 0–30% (tidak turun keluar bawah).
- "Dusk (Ochre → Night)" = cahaya cocoa dari kiri bawah (D-139), bukan ochre.
- Ganti akhir S04 yang sekarang (busur turun keluar bawah, ring naik dari bawah, D-138 State 5) dengan urutan di atas.

## 2. S05 Daily insight (Figma Design, 4 state)

Catatan state dari Figma:
- **State 1:** "Background Dusk, judul di kiri bawah. Ring besar kanan-tengah muncul saat foto terakhir Section 04 memudar." Eyebrow [ 17:30 · DAILY INSIGHT ] + "Everything it noticed."
- **State 2:** "Ring membesar (kamera mendekat). Teks mengecil & bergeser ke pinggir kiri bawah, tidak menimpa ring. 'One calm view.' masuk."
- **State 3:** "Kamera masuk ke lubang ring; kartu kaca (blur) mulai muncul di tengah lubang (±45%)."
- **State 4:** "Kartu kaca (432 px, kolom 5–8) terbaca penuh + satu paragraf kecil di bawahnya. Ring diam."

Paragraf di bawah kartu (State 4): "In the evening the app gathers the day into one view you can read and put down. It describes what happened. It does not tell you what to fix."

## 3. Kartu kaca (ganti kartu Cocoa solid D-135)

Ikuti komponen `40004260:693`:
- Latar tembus pandang dengan backdrop blur, sudut membulat besar, garis tepi tipis terang, bayangan lembut.
- Baris atas: chip "LAST NIGHT" bergaris ochre (Mono) di kiri, "SIMULATED DATA" (Mono, redup) di kanan.
- "7h 12m": angka besar, unit h/m kecil.
- Grafik garis putih tipis dengan area gradasi di bawahnya dan dua titik ochre bercahaya. Tanpa grid.
- "SETTLED 23:10" kiri dan "UP 06:22" kanan (Mono), lalu garis pemisah.
- Kalimat insight: "You took more short pauses this afternoon than on most weekdays."
- Semua teks memakai text style foundation (D-134). Label ochre kecil di atas kaca harus tetap terbaca (cek kontras; pakai ochre-400 bila perlu).
- Mobile: kartu menyesuaikan lebar layar dengan margin, isi sama.

## Batasan

- Latar Dusk tetap cahaya cocoa (D-139). Ring tetap `silver_polished`.
- S04 State 1–4 dan S06 tidak berubah, kecuali sambungan 05 → 06 perlu menyesuaikan posisi akhir S05.
- Reduced motion: fade pendek per state.
- `npm run build` lulus, push ke `origin/Developer` (staging, D-130). Jangan merge ke `main`, jangan deploy production.

## Laporan

Commit, status Preview, dan frame desktop 1440 serta mobile 390 untuk sambungan 04 → 05 (0, 30, 70, 100%) dan S05 State 1–4, berdampingan dengan kartu transisi dan frame Figma.

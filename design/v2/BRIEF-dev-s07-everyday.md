# Brief Developer: latar S02 polos (D-148) dan rombak S07 (D-149)

Status: disetujui pengguna 24 Nov 2026. Kerjakan di branch `Developer` di atas `0645c67`. Dua commit terpisah: D-148 dulu (kecil), lalu D-149.

## A. D-148: latar S02 polos

- Hapus foto dinding bayangan daun + tumbuhan hijau di S02 (`why__bg` / `whyBg`, D-088). Latar S02 = Paper polos.
- Sambungan 02 → 03 (D-136): hanya teks S02 yang naik keluar 1:1; ring sticky, latar terang → gelap, cahaya pojok, ring gelap → tersinari (D-140), LED hijau tetap. Hapus mask/brightness foto yang tidak dipakai lagi.
- Pastikan sambungan 01 → 02 tetap mulus tanpa foto dinding.

## B. D-149: S07 Specs & benefits

### Referensi (`design/v2/references/`)

| Isi | File | Node Figma |
|---|---|---|
| Ringkasan baris 07 | `s07-storyboard-overview.png` | — |
| State 1 "Through the day." | `s07-state1.png` | `40004263:834` |
| State 2 teks terbelah + 4 kartu | (lihat ringkasan; screenshot gagal) | `40004263:870` |
| State 3–6 (I) Night, (II) Desk, (III) Move, (IV) Rinse | `s07-state3.png` … `s07-state6.png` | `40004263:923`, `:979`, `40004330:3439`, `:3441` |
| State 7 "The everyday." | `s07-state7.png` | `40004263:1042` |
| Akhir gaya Obsidian | `s07-ref-obsidian-connection.png`, https://obsidianassembly.com/ | — |
| Layout "The Everyday" | `s07-ref-everyday-layout.png` | — |

### Catatan Figma (teks asli)

- Baris: "21:00 EVENING · Sand → foto full-bleed · 7 state · empat kartu foto + orbit + kartu info."
- State 1: "'Through the day.' besar di tengah (pusat y 482), tanpa elemen lain."
- State 2: "Teks terbelah ('Through' ke kiri, 'the day' ke kanan); 4 kartu foto masuk dari bawah."
- State 3: "(I) Night · 1/4: tumpukan kartu di tengah (pusat y 482). Layout simetris di sumbu y 482: garis penuh x 40–1400 di belakang tumpukan. Kiri (kolom 1–3): judul di atas garis, kalimat utama di bawah garis. Kanan (kolom 10–12, rata kanan): counter di atas garis, spesifikasi + catatan kecil (text-surface) di bawah garis. Jarak teks ke garis 16. Masuk dari State 2: 4 kartu merapat jadi tumpukan, 'Through'/'the day.' keluar ke samping, garis tumbuh dari tengah ke kedua sisi."
- State 4: "(II) Desk · 2/4: layout sama. Scroll → kartu depan naik ke belakang tumpukan, kartu berikutnya maju. Judul muncul per huruf dari balik garis, kalimat & spesifikasi naik per baris (mask), lingkaran counter terisi."
- State 5: "(III) Move · 3/4: layout sama, tanpa catatan kecil di kanan." State 6: (IV) Rinse · 4/4, layout sama.
- State 7 (diganti oleh catatan pengguna di bawah): kartu Rinse + foto lingkungan full-bleed (inset 24/40, radius 14) + "The everyday." + caption.

### Catatan pengguna (wajib, mengalahkan Figma bila berbeda)

1. **Ornamen orbit di belakang foto dihapus** (semua state).
2. **Akhir S07 seperti obsidianassembly.com ("The Connection"):** setelah (IV) Rinse, kartu foto Rinse turun mengikuti scroll, dan foto besar "The everyday" (frame inset, radius) naik dari bawah. Kartu tetap di depan dan "masuk" ke foto besar. Buka situs Obsidian di browser dan samakan rasa scroll-nya (kecepatan, easing, scrub).
3. **Layout "The Everyday"** seperti `s07-ref-everyday-layout.png`:
   - "The" kecil di baris atas, "Everyday" sangat besar di bawahnya.
   - **"The" rata kiri, sejajar dengan huruf pertama "Everyday"** (tidak menjorok).
   - Teks **putih**.
   - Kartu foto di tengah, di depan teks besar (seperti referensi).
   - Caption "Ring shown where it’s worn." di kanan bawah kartu, putih.
   - Pakai text style foundation (Display untuk "Everyday").
4. **Foto besar parallax:** isi foto bergerak lebih lambat dari bingkainya saat discroll, seperti Obsidian.
5. Foto besar = foto lingkungan di Figma State 7 (pria duduk memegang cangkir). Gambar referensi layout (batu, charger, ring) hanya acuan susunan teks.

### Batasan

- Copy (judul, kalimat, spesifikasi, catatan) ikuti Figma; angka bertanda * tetap data simulasi sesuai aturan yang berlaku di build.
- Sambungan 06 → 07 (D-147) tetap; sambungan 07 → 08 menyesuaikan seperlunya.
- Mobile 390: tidak ada frame mobile; usulkan versi yang sama (teks "The / Everyday" tetap rata kiri, putih) dan sertakan screenshot.
- Reduced motion: fade pendek per state.
- `npm run build` lulus, push ke `origin/Developer` (staging, D-130). Jangan merge ke `main`.

## Laporan

Commit A dan B, status Preview, frame S02 (state akhir dan 02 → 03 di 30%), dan frame S07 desktop 1440 + mobile 390: State 1, 2, 3, 6, transisi akhir (kartu turun, foto naik: 3 titik), dan "The everyday" akhir, berdampingan dengan referensi.

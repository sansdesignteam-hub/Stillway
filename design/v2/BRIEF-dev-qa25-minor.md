# Brief Developer — Revisi MINOR QA 25 Nov (V2)

Dari: Claude Code (Project Manager) · 25 November 2026 · Dasar: QA Figma "QA-24 Nov 2026" (file `ejtNpUf0FdEYMgAbcENMCH`, node `40004517:3883`), kartu berlabel **MINOR**.
Untuk: Developer (`web-v2/`, branch `Developer`, worktree `/Users/zaimmaulana/orca/workspaces/Smart Ring/Developer`). Sinkronkan dulu dengan `main` (`182048e`) jika perlu.

## Aturan
- Kerjakan HANYA daftar di bawah. Temuan MAYOR (font Hanken, grid, token warna, aset, 3D, progres global, panjang section) TIDAK disentuh.
- Teks website tetap bahasa Inggris. Jangan ubah keputusan D-134..D-165 selain yang disebut di sini.
- Detail tiap temuan (live vs seharusnya + gambar bukti) ada di kartu QA Figma; boleh dibaca lewat Figma MCP bila perlu, tapi hemat: cukup screenshot kartu yang relevan.
- Commit kecil per kelompok, pesan commit menyebut kode QA. `npm run build` harus lulus. Push ke `origin/Developer` (staging), JANGAN merge ke `main`.

## Daftar pekerjaan
1. **Teks bertumpuk saat ganti state (R-04, G-03, M-01):** teks lama selesai keluar dulu (±40% jarak) baru teks baru masuk, atau geser vertikal 24–40px. Cek S03 (23:10 vs 7h 12m) dan S02 mobile ("score. hm."), lalu semua section yang di-pin di 375px.
2. **Navbar**
   - HR-01: hapus garis pemisah antar menu (`src/styles/nav.css`, `border-left: 1px solid var(--bar-rule)`), andalkan spacing.
   - G-14: konten tidak boleh bertumpuk dengan navbar/logo (beri latar blur/solid otomatis saat ada konten di belakang, atau pudarkan konten sebelum area navbar). Cek 06→07, 09→10 desktop; S02 & S11 judul di mobile.
   - G-15: jam navbar berganti ke 23:10 LAST NIGHT tepat saat latar mulai gelap di 02→03.
   - HE-01: state aktif menu per bab: Rhythm (S02–S05), The ring (S06–S08), The app (S09), Finishes (S10), FAQ (S11). Pakai `aria-current`.
3. **Hero & S02**
   - HR-02: padding bawah hero = padding kiri/kanan.
   - W-01: tampilkan label kecil "Why Stillway" di State 1 (sekarang sr-only), sesuai Design · 02 State 1.
   - W-05: di `src/content/copy.ts` step 3 S02, ganti `big: 'Stillway just keeps the pattern.'` menjadi **`'Stillway notes the days and stays quiet.'`** (judul besar "keeps the pattern." tetap).
4. **S04–S06**
   - A-01: export ulang foto busur S04 minimal 2× (±540×750) AVIF/WebP dari sumber `design/assets/v1/home/S3p-*` (1060×1484) + `srcset`.
   - I-02: S05 State 2, teks "Everything it noticed. One calm view." tidak boleh redup di atas ring: geser ke pinggir / pudar penuh sebelum kamera masuk lubang. Tetap patuhi D-143 (lebar tetap, tanpa reflow).
   - I-04: di `copy.ts` kartu S05, ganti `insight` menjadi **`'You woke briefly twice, both before 03:00.'`** (konsisten dengan label Last night · 7h 12m).
   - D-04: S06 State 4, meja + cincin turun dan pudar sampai hilang dulu, baru tangan naik. Latar State 4 hanya Paper + tangan + cincin.
5. **S10:** F-17: ring "Turn it yourself" diperkecil/digeser turun supaya ada jarak napas ke judul dan tombol panah.
6. **Global:** 
   - G-07: H2 terbaca dengan spasi ("Activity and rest.", "Everything it noticed. One calm view.") untuk screen reader.
   - G-16: gradasi 02→03 tanpa banding: 12 stop (Neutral/50 → Cocoa/100–900 → Neutral/950) dengan kurva smootherstep + grain halus, ujung menyatu (acuan section "Design - 25 Nov" 02→03 di Figma). Cek transisi gelap-terang lain dengan cara yang sama.
7. **Mobile 375×812:** M-03 (S03 ring ±35% layar atas, angka maks ±96px, muat satu layar), M-04 (legenda S08 terlihat penuh), M-05 (HP S09 tetap di tengah lalu pudar, tidak naik ke balik navbar), M-06 (S10 ring di bawah judul, panel di bawahnya, tidak bertumpuk), M-07 (judul S11 maks 335px, tidak keluar layar), M-08 (wordmark hero margin 20px kiri-kanan), M-09 (isi kartu S05 muncul bersamaan dengan kartunya).
8. **UX:** HE-06 update hash URL per section (`history.replaceState`) + deep link saat dibuka; HE-07 halaman 404 bergaya Stillway (Night + wordmark + satu tombol kembali ke awal).

## Laporan ke PM
Per kode QA: selesai / tidak, commit, dan catatan bila ada yang tidak bisa dikerjakan tanpa keputusan desain. Sertakan screenshot desktop 1512×827 & mobile 375 untuk item visual (simpan di `design/v2/qa25/`).

# Brief Developer: S06 Product details, gelinding tegak → jatuh → masuk ke jari (D-144)

Status: disetujui pengguna 24 Nov 2026 (D-144). Kerjakan di branch `Developer` di atas `b594474`.

## Referensi (`design/v2/references/`)

| Isi | File |
|---|---|
| Cara menggelinding (tegak, lubang menghadap kamera, jejak gerak) | `s06-ref-roll-upright-ghosts.png` |
| Alur S06 + tangan & ring di Figma (ringkasan) | `s06-s07-storyboard-overview.png` |
| Figma `06 · Product details` State 1–4 | `s06-state1.png` … `s06-state4.png` (node `40004263:662`, `:710`, `:752`, `:794`) |
| Figma `06 · Tangan & ring` State A–C | `s06-hand-A.png`, `s06-hand-B.png`, `s06-hand-C.png` (node `40004325:3298`, `:3333`, `:3368`) |
| Gerak jatuh (oryzo.ai) | `s06-ref-oryzo-hand-catch.png`, `s06-ref-oryzo-object-fall.png`, situs https://oryzo.ai/ |
| Masalah sekarang: tepi potong tangan terlihat | `s06-issue-hand-crop.png` |

## Catatan state dari Figma

- **State 1:** "Ring menggelinding dari kiri di atas meja kayu pinus terang (berputar sesuai jarak). Tepi kanan meja tepat di tengah layar (x 720). Judul muncul di kiri."
- **State 2:** "Ring makin dekat ke tepi meja … Teks langkah 1." (One quiet band)
- **State 3:** "Ring sampai di tepi meja dan mulai miring jatuh ke kanan; jejak gerak tipis di bawahnya. Teks langkah 2." (Softened edges)
- **Tangan A:** "Ring lepas dari tepi meja dan jatuh di sisi kanan. Tangan (tanpa ring) naik dari tepi bawah, hanya ujung jari terlihat. Teks di atas, samar."
- **Tangan B:** "Ring jatuh sambil berputar ke arah ujung jari; jejak gerak tipis dari tepi meja. Tangan berhenti di posisi akhir."
- **Tangan C / State 4:** "Ring mendarat di pangkal jari (tampak samping, pipih), berhenti. Tag [ SILVER ] muncul di sebelahnya. Teks penuh." (Then, it just fits.)

## Yang diubah

1. **Gelinding tegak, tidak serong.** Ring berdiri tegak di atas meja dengan lubang menghadap kamera (sumbu ring tegak lurus layar), menggelinding dari kiri ke kanan dan berputar sesuai jarak tempuh (rotasi = jarak / jari-jari, tanpa slip). Ini menggantikan pose tiga-perempat (serong) yang sekarang dan pose di frame Figma State 1. "Tampak samping ±90°" di State 2 Figma tidak dipakai; ring tetap menghadap kamera selama menggelinding. Jejak gerak tipis: 2–3 salinan ring transparan di belakang, makin pudar, hanya saat bergerak.
2. **Jatuh seperti oryzo.ai.** Di tepi kanan meja ring miring lalu lepas dan jatuh. Selama jatuh ring berputar (perlahan beralih dari menghadap kamera ke tampak samping), dengan gerak halus terikat scroll; melambat ketika mendekati ujung jari, lalu masuk ke jari dan meluncur ke pangkal jari, berhenti dengan pose akhir di `design/3d/v2/s06-pose.json`. Buka https://oryzo.ai/ di browser untuk menyamakan rasa jatuh dan tangkapnya (kecepatan, easing, scrub).
3. **Tangan naik dari bawah tanpa terlihat terpotong.** Tangan foto A-1 (tanpa ring, D-133) naik dari luar tepi bawah layar. Tepi potong foto tidak boleh terlihat di desktop maupun mobile pada posisi mana pun: pastikan bagian bawah foto selalu di luar viewport, atau lebur bagian bawahnya ke latar Paper dengan gradasi bila foto kurang panjang. Pergantian ring 3D ke ring di foto (A-1b) di akhir harus tidak terlihat.
4. **Meja kayu.** 3D Designer sedang membuat meja kayu pinus terang (GLB + tekstur PBR, `design/3d/v2/s06-table.glb`, brief `design/3d/v2/BRIEF-3d-s06-wood.md`). Sambil menunggu, pakai meja sementara dengan bentuk dan posisi yang sama (tepi kanan di x 720) supaya gerak bisa dibangun sekarang; ganti dengan aset final begitu Project Manager meneruskannya. Ring harus punya bayangan kontak di meja.
5. Teks langkah (Made to be forgotten. / One quiet band / Softened edges / Then, it just fits.) dan tag [ SILVER ] mengikuti Figma dan text style foundation.

## Batasan

- Ring tetap `silver_polished` (D-085). Latar Paper + Sand sesuai build.
- Sambungan 05 → 06 dan 06 → 07 menyesuaikan seperlunya saja.
- Mobile 390: tidak ada frame mobile di Figma; usulkan versi yang sama (meja lebih kecil, tepi meja tetap di tengah) dan sertakan screenshot.
- Reduced motion: fade pendek per state.
- `npm run build` lulus, push ke `origin/Developer` (staging, D-130). Jangan merge ke `main`.

## Laporan

Commit, status Preview, dan frame desktop 1440 + mobile 390: gelinding (3 titik), di tepi meja, jatuh (3 titik), mendarat, State 4, berdampingan dengan frame Figma; satu frame yang membuktikan tepi bawah tangan tidak terlihat.

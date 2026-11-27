# Brief Developer — S7-06b: perpindahan kartu S07 mengikuti Obsidian Objects

Keputusan: D-189 di `context/decisions.md` (worktree PM). Lanjutan S7-06 (`6df60c3`). Hasil S7-06 sudah benar di ukuran (3:4, ±68% tinggi), tetapi menurut pengguna **perpindahan kartunya belum mirip referensi**. Kerjakan setelah G-19 selesai dan ter-push.

Referensi: https://obsidianassembly.com/, section **Objects**. Screenshot pembanding:
- sekarang: `design/v2/references/s07-qa27-current.png` (localhost #specs, state 1/4)
- referensi: `design/v2/references/s07-qa27-ref-obsidian.png` (Objects, 4/4)

## Perbedaan yang terlihat di screenshot

1. **Kedalaman tumpukan.** Di referensi, tumpukan di belakang mundur ke atas dengan kedalaman: minimal dua kartu terlihat di atas kartu depan, dan tiap lapis makin kecil dan naik ±75–80 px per lapis (lapis terjauh hampir menyentuh navbar). Kita hanya punya satu kartu belakang setipis ±43 px, sehingga terasa datar.
2. **Kartu di bawah.** Referensi memperlihatkan satu kartu lebih kecil yang mengintip ±75 px di bawah kartu depan. Kartu ini adalah kartu sebelumnya yang sedang turun keluar. Di versi kita, bagian bawahnya tipis dan statis.
3. **Gerak (inti permintaan).** Pelajari langsung di browser dengan scroll pelan dan rekam frame-nya. Bila WebGL referensi tidak tampil di headless, pakai browser biasa atau Orca browser. Cocokkan dengan pola deck di referensi: saat scroll, kartu depan turun dan mengecil sampai keluar bawah, kartu belakang pertama maju (turun dan membesar) ke posisi depan, dan lapis-lapis di belakangnya ikut maju satu langkah. Seluruhnya terikat ke scroll (scrub) dengan easing halus, tanpa lompatan atau jeda kosong. Tirukan juga timing, skala per lapis, dan perubahan gelap/terang lapis belakang bila ada.
4. Judul, caption, dan counter n/4 berganti bersamaan dengan kartu (sudah ada di S7-06; pertahankan).

## Pertahankan

Ukuran kartu depan (±68% tinggi, 3:4, radius ±10 px) di desktop, intro "Through / the day." D-172, foto D-175, penutup "The everyday." D-185, dan aturan tidak masuk area navbar. Tata letak teks (posisi judul di kiri dan caption di kanan) **tidak** diubah dalam putaran ini. Mobile dan tablet ikut diadaptasi dengan pola tumpukan yang sama.

## Bukti

Rekaman atau urutan frame (awal, tengah, akhir pergantian) versi kita **berdampingan** dengan referensi pada fase yang sama, di desktop 1440×900 / 1653×979, ditambah mobile 375×812. Cek scroll maju/mundur, berhenti di tengah pergantian, dan reduced motion. `npm run build` lulus. Commit `fix(web-v2): QA27 S7-06b …`, push ke `origin/Developer` (D-130).

# Laporan Developer — QA 27 Nov MINOR (D-187) + F-07 (D-188)

Semua sudah di `origin/Developer` (HEAD `2fb3e43` saat push). `npm run build` lulus, juga dari salinan bersih HEAD.
Pengujian memakai emulasi Chrome di Mac, **bukan HP/tablet fisik**. Path bukti relatif terhadap folder ini.

| Kartu | Commit | Bukti |
|---|---|---|
| M-11 viewport stabil | `a0d1ca7` | `m11-hero-resize.jpg`, `m11-pinned-resize.jpg` |
| M-12 titik progres | `f1ca4be` | `m12-mobile.jpg`, `m12-desktop.jpg` |
| M-13 konten di bawah navbar | `78fd58a` | `m13-s03-375x812.jpg`, `m13-s03-375x600.jpg`, `m13-s10-column.jpg` |
| M-14 transisi kata S02 | `b982d60` | `m14-before-frames.jpg`, `m14-after-frames.jpg`, `m14-375x600.jpg` |
| M-15 panel S10 tablet | `726c99b` | `m15-before.jpg`, `m15-after.jpg` |
| HE-09 hover pill | `5ed0597` | `he09-before-frames.jpg`, `he09-after-frames.jpg` |
| S7-06 tumpukan kartu | `6df60c3` | `s706-before-*.jpg`, `s706-after-*.jpg` |
| F-07 favicon | `2fb3e43` | `f07-head-tags.txt`, `f07-tab.jpg` |

`04a600e` hanya merender ulang montase bukti M-11–M-14.

## Per kartu: hasil dan keterbatasan

**M-11.** Ukuran diambil dari `svh`/`lvh`, bukan `innerHeight`; di layar sentuh dikunci (`scripts/viewport.ts`). Resize tinggi 756 → 812 / 700 pada hero, zoom, S06, S10: piksel berubah 0,00–0,08 % (sebelum: 3–99 %); diulang setelah D-186: 0,00 %.
- Belum diuji di Android Chrome fisik; keadaan `svh` < `lvh` hanya disimulasikan.
- Foto hero kini diteruskan sampai `lvh`; foto section lain tidak diperiksa untuk strip bawah saat address bar hilang.
- Di layar sentuh, perubahan tinggi < 160 px tanpa perubahan lebar diabaikan (termasuk split view kecil).

**M-12.** Titik disembunyikan di bawah 768 px; desktop tetap.

**M-13.** Di HP konten hilang di tepi bawah navbar dan penuh 16 px di bawahnya. Kolom S10 juga diperbaiki (mask-nya ikut bergerak sehingga isi menimpa logo).
- Isi yang sedang keluar tampak memudar pada jarak 16 px itu.
- Ring 3D bukan bagian mask CSS, masih bisa lewat di belakang navbar.

**M-14.** Kalimat lama habis (u 2,45) sebelum "keeps the / pattern." masuk (u 2,5); kata tidak keluar layar. Di 375×600 kalimat atas dinaikkan agar tidak menimpa "keeps the". Desktop tidak diubah.

**M-15.** 720–1023 px: panel 42 vw, margin kanan = kiri, judul dua baris, ukuran 4 kolom (< 900 px). 600–719 px: margin 24 px. Tanpa overflow di 600, 768, 820, 959, 1024.
- Di 1024×768 isi panel 10 px lebih tinggi dari `max-height` (sudah ada sebelumnya, tidak terlihat memotong).
- Di 600×960 masih ada layar kosong setelah kolom S10 lewat (perilaku D-171, di luar kartu).

**HE-09.** Satu panah; lingkaran melebar menjadi pill, 0,8 s `cubic-bezier(0.77,0,0.18,1)`; reduced motion tanpa transisi.
- **Perubahan tampilan diam yang perlu dicek:** mengikuti brief, di latar terang pill kini terang dengan lingkaran gelap (navbar Paper dan CTA "Choose …" yang tadinya gelap penuh); CTA Closing menjadi pill gelap. CTA Finishes dan Closing kini memakai komponen pill + panah yang sama.
- Di tengah animasi, huruf pertama label sempat samar saat tepi isian melewatinya.

**S7-06.** Kartu depan 3:4, radius 10, satu kartu belakang simetris. 1440×900: 459×612 (68 %); 1485×812: 414×552 (68 %). Kartu depan keluar ke bawah (HP: ke kiri), tidak masuk navbar; judul/caption bergulir lama → baru bersamaan. D-172 intro, foto D-175, penutup "The everyday." tetap.
- Tablet dan HP **tidak** 68 %: 768×1024 44 % (dibatasi kolom caption), 375×812 42 %, 375×600 45 % (teks di bawah kartu).
- Jika scroll berhenti tepat di tengah pergantian, teks terlihat setengah bergulir.
- Crop foto di kartu sedikit lebih sempit di sisi karena rasio baru.
- Gerak dibandingkan dengan referensi lewat screenshot, bukan rekaman berdampingan; "terasa sama" perlu dinilai mata.

**F-07.** Berkas dari `d23e526`, tag sesuai README aset; ditambah `site.webmanifest` untuk ikon 192/512 (`crossorigin="use-credentials"` karena preview dilindungi). `og-image.jpg` tetap. Tab diverifikasi hanya di Chrome desktop, tema gelap.

## Temuan di luar kartu (tidak diperbaiki)
- S09 di 375×600: foto tangan/HP menutupi sebagian kalimat "Blue light · Sleep".

## Catatan worktree bersama
- Sesi D-186 menulis di worktree yang sama. `heroBg.ts` miliknya sempat terbawa ke commit M-15 lokal dan dikeluarkan sebelum push.
- Commit asing di antara commit saya: `e8e3d16` (D-186).
- Saat laporan ini dibuat, `web-v2/src/scripts/ring/stage.ts` punya perubahan belum di-commit milik sesi lain; tidak saya sentuh.

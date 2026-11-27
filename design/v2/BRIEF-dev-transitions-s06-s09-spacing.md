# Brief Developer — Transisi S06→S07, S09→S10, dan spacing mobile

Keputusan: **D-192** di `context/decisions.md` (worktree PM, main). Kerjakan di `web-v2/` pada worktree Developer, branch `Developer`, **setelah** pekerjaan PageSpeed 90+ (D-191) selesai dan ter-push. Model: Sonnet 5.5.

## 1. S06 → S07 · crossfade (desktop DAN mobile)

Acuan state awal: `design/v2/references/s06-s07-current-desktop.png` (state akhir S06: “Then, it just fit.” + tangan bercincin).

- Saat scroll keluar dari S06: **tangan + cincin keluar ke bawah** (slide down), **heading + body keluar ke atas** (slide up), dan keduanya memudar.
- Setelah itu teks **“Through the day”** (pembuka S07) muncul dengan fade.
- Terikat scroll (scrub), berjalan halus maju maupun mundur.
- Menggantikan sambungan scroll biasa S06 → S07 (D-147). Konten dan gerak S07 setelah teks “Through the day” muncul tidak berubah.
- Ring 3D live di jari (`sections/details.ts`) harus ikut turun bersama foto tangan, menempel tanpa geser relatif (bayangan kontak D-01 ikut).

## 2. S09 → S10 · crossfade (DESKTOP saja)

Acuan: `design/v2/references/s09-s10-current-desktop.png` (state akhir S09 Recovery).

- **Tangan yang memegang ponsel keluar ke bawah** (slide down).
- **Teks kiri** (chip “Violet light · Recovery” + kalimat) **keluar ke kiri**, **teks kanan** (“HRV across the week…”) **keluar ke kanan**, sambil memudar.
- Setelah itu S10 Finishes tampil (fade in dari latarnya).
- Scrub, mulus maju dan mundur.
- **Mobile tidak berubah:** tetap scroll biasa (D-172).
- Perilaku S10 → S11 tetap (D-165 (3)).

## 3. S06 mobile · heading terlalu tinggi

Acuan: `design/v2/references/s06-mobile-header-gap.png` (iPhone, 390 pt). Heading “Then, it just fit.” dan body berada tepat di bawah navbar, sementara tangan mulai jauh di bawah, sehingga ada ruang kosong besar di antaranya.

- Turunkan blok heading + body supaya lebih dekat ke ujung jari (kira-kira di tengah ruang kosong sekarang; usulkan posisi yang seimbang dan tunjukkan screenshot).
- Cek di 375×812, 390×844, dan 430×932. Teks tidak boleh menabrak jari atau cincin.

## 4. Mobile · jarak navbar ke konten

- Di semua section mobile, konten yang menempel di atas (heading section) diberi jarak lebih lega dari navbar, supaya tidak terlihat mepet.
- Pakai satu token spacing yang konsisten (mis. `--nav-clearance-mobile`) dan jangan menentukan nilai per section kecuali memang perlu. Sertakan screenshot sebelum/sesudah per section.
- Desktop tidak berubah.

## Batas

- Gerak hanya memakai `transform` dan `opacity` (tanpa blur, filter, atau perubahan layout per frame).
- **Skor PageSpeed tidak boleh turun.** Ukur ulang Lighthouse 13.6.0 lokal (median 3 run, mobile dan desktop) setelah perubahan, dan bandingkan dengan hasil akhir D-191. Ukur juga frame time di S06→S07 dan S09→S10: tidak ada frame >50 ms.
- Section lain, hero S01, dan timing lain tidak berubah.
- Jangan merge ke `main`, jangan deploy production.

## Bukti

1. Rekaman atau rangkaian screenshot (awal / tengah / akhir) S06→S07 di desktop dan mobile, dan S09→S10 di desktop.
2. Screenshot sebelum/sesudah S06 mobile (3 ukuran) dan jarak navbar per section mobile.
3. Tabel Lighthouse sebelum/sesudah dan tabel frame time.
4. `npm run build` lulus.
5. Commit per poin, push ke `origin/Developer`, dan hash commit terakhir.

# Brief Developer: sambungan S02 → S03 (D-136)

Status: disetujui pengguna 23 Nov 2026 (D-136). Hanya sambungan S02 → S03 yang diubah. State S02 (sampai state akhir) dan animasi scroll S03 setelah kontennya masuk tetap seperti sekarang.

## Referensi

- Video gerak: `design/v2/references/s02-s03-ref-basic-scroll.mp4` (7 dtk, 1440×900). Lembar frame tiap 0,5 dtk: `s02-s03-ref-basic-scroll-frames.png`.
- Cahaya dan lampu sensor: `design/v2/references/s02-s03-ref-avoly-corner-light.png` (Avoly). Yang diambil hanya rasa cahayanya: latar gelap hangat, cahaya lembut yang jatuh dari pojok atas, dan kilau hijau di sensor ring. Layout, warna hijau di UI, dan tipografi Avoly tidak dipakai.

## Urutan (persentase = progres sambungan 02 → 03)

1. **0–40%: scroll biasa.** Semua elemen S02 (teks "keeps the pattern.", kalimat kecil, dan foto dinding bayangan daun) naik keluar layar mengikuti scroll 1:1, seperti halaman biasa. Tidak ada fade, blur, scale, stagger, atau parallax.
2. **Ring sticky.** Ring tetap di tengah layar selama sambungan dan terus berputar pelan (turntable, mengikuti scroll). Ring tidak lompat posisi atau ukuran; di akhir sambungan ring sudah di pose S03 State 1.
3. **Latar terang → gelap, bersamaan dengan langkah 1.** Di belakang konten yang naik, latar berganti dari Paper ke Night secara bertahap. Di video, gradasi cokelat hangat naik dari bawah sampai seluruh layar menjadi Night. Gunakan token (`--paper`, `--cocoa-*`, `--night`), jangan mencampur di tengah sampai menjadi abu-abu kusam. Navbar berganti ke tema gelap dan jam 07:10 → 23:10 seperti sekarang.
4. **Setelah gelap: cahaya halus dari pojok.** Satu cahaya hangat yang lembut masuk dari pojok atas (bukan sorot lurus dari atas), menerangi ring dari samping atas seperti referensi Avoly. Bentuknya glow/beam yang diblur, di belakang atau di sekitar ring, tidak pernah di atas ring. Ring tetap terbaca silver (D-091).
5. **Lampu sensor hijau.** Sesudah cahaya pojok muncul, jendela sensor ring menyala **hijau** (`--led-heart-rate` #34E07A) dengan kilau halus seperti referensi. Pakai sistem warna LED yang sudah ada di ring (`poses.ts`, dipakai S08). Hijau menyala sampai akhir S03, kecuali pengguna meminta lain.
6. **Konten S03 masuk.** Setelah itu, headline dan angka S03 masuk dan animasi scroll S03 berjalan seperti sekarang.

Reduced motion: tetap fade pendek per state seperti aturan sekarang.

## Tambahan: latar S02 harus menyatu

Screenshot pengguna (`design/v2/references/s02-issue-bg-seam.png`): foto dinding S02 berakhir dengan garis horizontal yang tajam, dan di bawahnya latar Paper polos dengan warna sedikit berbeda. Perpotongan ini tidak boleh terlihat, baik di state S02 maupun saat foto naik di sambungan 02 → 03.

- Cari penyebabnya: tint atau warna foto yang masih mengikuti Paper lama #F7F5F0 (Paper sekarang #F9F5EF), foto yang tidak menutup seluruh layar (overscan/posisi), atau tepi foto yang terlihat ketika foto bergerak naik.
- Perbaikan yang diharapkan: warna foto dan latar disamakan, dan tepi foto dilebur ke Paper dengan gradasi atau mask yang lembut, sehingga tidak ada garis. Foto aslinya jangan diedit; perbaikan dilakukan di build.
- Cek di desktop 1440 dan mobile 390, di state akhir S02 dan selama sambungan.

## Kode yang terkait

- `web-v2/src/scripts/sections/why.ts`: `out = 1 - seg(u, END, END + 0.3)` memudarkan teks dan `leave` memudarkan foto latar. Ganti dengan translasi naik sejauh scroll.
- `web-v2/src/scripts/story.ts`: lerp warna latar pada sambungan (`mid`, `bgEl`) dan tema navbar.
- `web-v2/src/scripts/sections/sleep.ts`: `ringIn` (rim dingin 15–45%, env malam 45–75%) dan pose ring. Cahaya pojok dan LED hijau masuk di sini atau di ring stage.

## Alur kerja

- Bangun di atas commit foundation `7e2e68a` (D-134, D-135) di branch `Developer`.
- `npm run build` harus lulus, lalu push ke `origin/Developer` untuk staging (D-130). Jangan merge ke `main` dan jangan deploy production.
- Laporan: commit, status Preview, dan rekaman atau frame sambungan 02 → 03 di desktop 1440 dan mobile 390 yang bisa dibandingkan dengan video referensi.

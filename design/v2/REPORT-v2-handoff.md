# Laporan Visual Director — handoff V2

19 November 2026 · Task `task_4d27496f3bad` · Branch `Visual-Director`

## Ringkasan

- `design/v2/HANDOFF-v2.md` dibuat untuk Developer: token final (5 warna + LED, Geist/Geist Mono, skala tipe), spesifikasi S01–S11 (state, layout 1440/390, catatan render), tabel 10 sambungan, perbedaan dengan V1, daftar aset dengan status, dan rencana produksi.
- Sumber: tiga dokumen V2 di checkout main, Figma Storyboard 2 (teks lengkap 980 node + screenshot S01, S05–S11), Moodboard Typography (spesimen Option A) dan Branding. Storyboard 1 dibaca lewat `Storyboard.md` §5.
- Temuan utama:
  1. Figma berisi **panel storyboard**, bukan frame layout 1440/390, dan **tidak punya variables/styles**. Jadi warna, font, state, dan sambungan bertanda [F]; ukuran posisi, grid, spacing, radius, dan seluruh layout mobile adalah **usulan [U]** saya.
  2. V2 bergantung penuh pada **satu ring 3D di 8 section** (dengan logo terukir, LED berwarna, makro, gelinding, 3 finish). Saya mengusulkan satu canvas WebGL tetap untuk seluruh halaman.
  3. Aset V1 yang bisa dipakai ulang hanya 5 foto C-02 di S04 (dan foto ring-master sebagai placeholder). Set moss rock, R-black/R-gold, dan A-11 tidak cocok dengan kanvas studio V2.
  4. Ada beberapa hal di Figma yang bertentangan dengan keputusan atau arah V2 (lihat pertanyaan 5–7).
- Tidak ada gambar baru yang dibuat. Tidak ada perubahan di `web/`, `decisions.md`, atau `brief.md`.

## Pertanyaan untuk pengguna

1. **Logo di ring** (Storyboard §6.3): apakah "Stillway" tone-on-tone di sisi luar ring disetujui? Semua render 3D dan foto baru menunggu jawaban ini.
2. **Rencana produksi aset** (HANDOFF §6): setuju untuk mulai generate N-1 (tangan cut-out S06), N-2 (4 kartu S07), N-3 ("The Everyday"), dan R-4 (isi box studio) dengan `gpt-image-bridge`, berurutan setelah render acuan ring dengan logo?
3. **Karakter**: apakah tangan dan foto kartu di V2 memakai karakter C-02 (laki-laki, D-058) seperti V1?
4. **Mobile** (Storyboard §6.4): usulan saya, semua section tetap di-pin dan di-scrub di mobile; S07 dan S09 dibuat lebih ringan, dan rail progress disembunyikan. Setuju, atau ada section yang ingin dijadikan tumpukan statis?
5. **Form email di footer S11**: panel Figma menampilkan field "Get the first morning report". Form pengumpulan data di luar lingkup (D-022). Usulan saya: hapus field dan ganti dengan teks statis. Setuju?
6. **Foto "The Everyday" S07**: panel Figma memakai ring di batu berlumut (gaya V1), sedangkan arah V2 adalah studio Paper/Sand. Mana yang dipakai?
7. **Tombol utama S10**: ke mana tombolnya diarahkan karena tidak ada cart (D-022)? Usulan saya: scroll ke S11 atau tampilkan catatan "Concept project — not for sale".
8. **Finish di S10**: State 2–3 Storyboard memperlihatkan Black/Gold sebagai contoh pilihan user. Usulan saya: scroll **tidak** mengganti finish; finish hanya berubah lewat klik swatch, dan Lamp light ikut Gold. Setuju?
9. **Durasi S04**: Storyboard dan build V1 berbeda (walk 15 vs 25 min, stretch 5 vs 15 min). Usulan: pakai nilai build V1 sampai Strategy Director mengunci copy (sesuai Storyboard §6.5).
10. Masih terbuka dari Storyboard §6: spesifikasi resmi (baterai, air, berat, ukuran, harga), fungsi warna lampu (perlu konfirmasi hardware), bg terang S06 di jam 21:00, angka app, dan referensi Horizon dari Fanny.

## Kebutuhan 3D untuk 3D Designer

(Detail di HANDOFF §5 baris 3D-1 sampai 3D-7.)

1. **3D-1 Ring acuan V2**: update GLB silver dengan engraving logo tone-on-tone di sisi luar (setelah pertanyaan 1 dijawab). Bentuk dicek ke ring-master (2 pad oval, jendela sensor, chamfer, dalam hitam matte).
2. **3D-2 LED**: pisahkan mesh menjadi `led_main` (jendela sensor) dan `led_power` (titik merah); warna lewat `emissive` 2–4 yang dikendalikan kode; PointLight kecil di dalam ring. Bloom tanpa React (three postprocessing murni).
3. **3D-3 Makro S05**: kualitas mesh dan material saat kamera masuk ke lubang ring (±1.9× lebar layar).
4. **3D-4 Gelinding S06**: contact shadow di alas Sand; rotasi = jarak ÷ jari-jari; jalur cadangan 40–60 frame render Blender.
5. **3D-5 Finish**: material Black dan Gold (bukan hanya tint) serta dua HDRI, Daylight dan Lamp light.
6. **3D-6 Lighting V2**: HDRI studio hangat netral untuk Paper, rim light dingin satu sisi untuk Night (S03), dan Dusk. Env map foto batu V1 tidak cocok lagi.
7. **3D-7 Cadangan statis**: ±10 PNG transparan untuk pose kunci (poster, reduced motion, WebGL gagal).
8. Arsitektur: usulan satu canvas WebGL `position: fixed` untuk seluruh halaman (satu konteks), dengan pose per section dari timeline scroll. Perlu disepakati bersama Developer.
9. Pose akhir ring di S06 State 4 harus pas dengan foto tangan N-1. Pose tangan dan jalur ring disepakati sebelum foto dibuat.

## Usulan keputusan untuk dicatat Claude Code di main (setelah pengguna setuju)

- U-A: `design/v2/HANDOFF-v2.md` menjadi acuan visual Developer untuk `web-v2/`. Bagian bertanda [U] tetap usulan sampai disetujui.
- U-B: Satu ring 3D (canvas WebGL tetap) di seluruh halaman V2.
- U-C: Aset V2 memakai studio Paper/Sand; set moss rock V1 tidak dipakai di V2 kecuali 5 foto C-02 di S04.
- U-D: Footer S11 tanpa form email (mengikuti D-022).

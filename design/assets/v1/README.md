# Aset gambar Versi 1 — log AI (set “moss rock studio”)

Status: **AI-generated, draf 2, belum di-retouch, belum disetujui.** Set dasar sesuai D-032 dan D-035 (`context/decisions.md`): batu granit, hamparan lumut, pakis blur, dan dinding krem dengan bayangan daun. Tidak ada tangan.

- **Dibuat:** 17 November 2026 oleh Visual Director.
- **Alat:** `scripts/genref.sh`, yaitu Codex CLI `image_generation` dengan akun ChatGPT pengguna; referensi dilampirkan lewat `codex exec -i`. Backend model gambar dipilih oleh Codex.
- **Prompt:** tercatat lengkap per file di `scripts/moss-all.sh`. Script melewati file yang sudah ada, sehingga cukup dijalankan ulang untuk melanjutkan proses.
- **Referensi tetap:** `masters/E-03-moss-rock-set.png` (sampel N2-02 yang dipilih pengguna) dan ring-master `04` atau `08`.
- **Arsip:** draf 1 (interior + tangan) ada di `_archive/interior-draft1/`; sampel nature lain ada di `nature-test/`.

## Masters (`masters/`)

| File | Catatan |
| --- | --- |
| `E-03-moss-rock-set.png` | Set dasar (salinan `nature-test/N2-02`). Ring memantulkan pepohonan; jangan dipakai sebagai aset final. |
| `R-black.png`, `R-gold.png` | Finish Black dan Gold dari ring-master `04`. |
| `R-kit.png` | Charger + sizing kit. Bentuknya masih **usulan**, belum disetujui. |

## Home (`home/`)

| ID | File | Waktu / cahaya | Status / catatan |
| --- | --- | --- | --- |
| A-01 | `A-01-hero-desktop.png` | 06:40, pagi hangat | Ok. Ring di kanan, dinding kosong di kiri untuk headline. |
| A-01 | `A-01-hero-mobile.png` | 06:40 | Ok. Ring di sepertiga bawah. |
| A-02 | `A-02-sleep.png` | ±07:00 | Ok. Ring di atas lumut di kaki batu. Ring tampak besar dibanding batu. |
| A-03 | `A-03-context-1000.png` | 10:00 | Ok. Ring tegak di batu datar kecil. |
| A-05 | `A-05-context-1230.png` | 12:30, bayangan daun belang-belang | Ok. |
| A-06a | `A-06a-set-0900.png` | 09:00 | Ok. Menjadi gambar dasar untuk A-06b. |
| A-06b | `A-06b-set-1500.png` | 15:00 | **Belum dibuat** (batas pemakaian Codex). |
| A-07 | `A-07-insight-phone.png` | 17:30 | Layar polos untuk UI Figma. **Ring sekitar 2× terlalu besar dibanding ponsel**; perlu diperkecil saat retouch atau dibuat ulang. |
| A-08 | `A-08-macro-outer.png` | 18:00 | Ok. Pad oval abu-abu sesuai master. |
| A-09 | `A-09-macro-inner.png` | 18:00 | Ok. Sensor mati. |
| A-10 | `A-10-ring-shadow.png` | 18:30 | Ok. Satu bayangan panjang, ada kilau di dalam bayangan. |
| A-11 | `A-11-package-flatlay.png` | 19:30 | Ok. Ring, charger, dan sizing kit di atas batu datar. |
| A-12 | `A-12-night-desktop.png`, `A-12-night-mobile.png` | 23:00 | **Belum dibuat.** |
| P-01 | `P-01-silver-daylight.png` | Daylight | Ok. Menjadi gambar dasar untuk P-02 sampai P-06. |
| P-02–P-06 | Silver Lamp; Black dan Gold × Daylight/Lamp | — | **Belum dibuat.** |

Catatan umum: permukaan ring masih memantulkan sedikit warna hijau dari lumut, dan itu wajar secara fisik. Perubahan waktu terlihat dari sudut dan warna bayangan daun, tetapi pada beberapa gambar perbedaannya halus; color grading per bab (Dawn, Day, Dusk, Night) sebaiknya dilakukan saat retouch.

## Dari pengguna (`home/user/`)

Diberikan pengguna pada 17 November 2026 untuk hero build Home. Sumber, alat, dan status AI belum dicatat; perlu dikonfirmasi pengguna.

| File | Isi | Catatan |
| --- | --- | --- |
| `H-01-hero-bg.png` | Batu granit di atas lumut, dinding plaster dengan bayangan daun, tanpa cincin (2556×1448). | Latar hero. |
| `H-02-ring-cutout.png` | Cutout cincin Silver bertransparansi, di-crop Developer dari kanvas 2556×1448 menjadi 496×458. | Dipakai di hero (mendarat di batu) dan penutup. Resolusinya kecil, sehingga terlihat lembut di layar retina; versi resolusi lebih tinggi disarankan. |
| `H-03-ring-top-cutout.png` | Cutout cincin tampak atas, transparan (1352×1352). | Latar section “One line a day”. |
| `H-04-night-bg.png` | Batu berlumut di malam hari, tanpa cincin (2508×1412). | Latar CTA penutup. |
| `H-05-ring-night-cutout.png` | Layer cincin transparan di kanvas yang sama dengan H-04; `-crop` adalah potongan Developer (604×614). | CTA penutup. |

## Aset per section build (18 November 2026)

Dibuat untuk menggantikan gambar yang belum sesuai konteks di build https://stillway-one.vercel.app/ (permintaan pengguna, 18 November 2026). Prompt tercatat di `scripts/sections-v2.sh`. Semua gambar memakai set moss-rock dan tanpa tangan (D-032, D-035). Status: **AI-generated, belum di-retouch.**

| Section / slot di build | File | Konsep |
| --- | --- | --- |
| Sleep · “Last night, in one view.” | `home/S2-01-last-night.png` (4:5) | Cahaya pertama: adegan masih biru malam, sinar hangat baru menyentuh bagian atas dinding; ring diam di atas lumut. |
| Sleep · “Patterns, not scores.” | `home/S2-02-patterns.png` (4:5) | Tujuh kerikil dengan ukuran tak berurutan seperti hari dalam seminggu, ring di ujung barisan. Ukuran sengaja tidak urut agar tidak terbaca sebagai skor atau progres (versi pertama ditolak karena urut kecil ke besar). |
| Activity and rest · 07:40 Moving, walk | `home/S3-0740-moving-walk.png` (5:7) | Ring berdiri di atas batu pijakan. |
| Activity and rest · 09:00 Resting, focus | `home/S3-0900-resting-focus.png` (5:7) | Ring berbaring diam di atas batu, cahaya pagi tenang. |
| Activity and rest · 10:30 Moving, stretch | `home/S3-1030-moving-stretch.png` (5:7) | Ring berdiri, pakis menjulur diagonal. |
| Activity and rest · 12:30 Resting, lunch | `home/S3-1230-resting-lunch.png` (5:7) | Ring berbaring di bawah bayangan daun belang-belang tengah hari, dilihat dari atas (versi pertama ditolak karena tidak terbedakan dari 09:00). |
| Activity and rest · 15:30 Moving, stairs and errands | `home/S3-1530-moving-stairs.png` (5:7) | Ring berdiri di anak tangga batu, cahaya sore dari kanan. |
| Made to be forgotten · One quiet band | `home/S4-01-quiet-band.png` (11:8) | Tali linen melintas di atas permukaan luar ring yang polos tanpa tersangkut. |
| Made to be forgotten · Softened edges | `home/S4-02-softened-edges.png` (11:8) | Profil samping yang memperlihatkan bentuk rendah dan dua tepi bevel. Bevel masih halus; bisa dipertegas saat retouch. |
| Made to be forgotten · Sensors on the inside | `home/S4-03-sensors-inside.png` (11:8) | Sisi dalam terlihat; sensor dan pad rata dan tidak menyala, sisi luar polos. |

Sistem visual Activity and rest: **Moving = ring berdiri**, **Resting = ring berbaring**, dan cahaya mengikuti jam di setiap slide.

## Activity and rest dengan karakter — sampel (18 November 2026, D-054)

Prompt tercatat di `scripts/s3-people.sh`. Karakter dikunci lewat `masters/C-01-character.png`: perempuan awal 30-an berkemeja linen oatmeal dengan ring di telunjuk kiri. Karakter ini **ilustratif dan belum disetujui**. Wajah boleh terlihat. Status: **AI-generated, sampel, belum di-retouch.** Set batu `S3-*` sebelumnya tetap disimpan sebagai alternatif.

| Slot | File | Adegan | Catatan |
| --- | --- | --- | --- |
| 07:40 Moving, 25 min walk | `home/S3p-0740-moving-walk.png` | Berjalan di jalur bertepi pohon, cahaya pagi rendah | Wajah dari samping, tangan kiri berayun di depan. Ring terlihat tapi kecil. |
| 09:00 Resting, 40 min focus | `home/S3p-0900-resting-focus.png` | Membaca di meja dekat jendela, tangan diam di atas buku, kopi | Halaman buku kosong. |
| 10:30 Moving, 15 min stretch | `home/S3p-1030-moving-stretch.png` | Kedua lengan meregang lurus ke depan, telapak menghadap ke bawah, mata terpejam | Percobaan ke-4. Tangan kiri lengkap (ibu jari + 4 jari), ring di telunjuk; ibu jari tangan kanan tersembunyi secara wajar. Ditolak sebelumnya: jari bertaut aneh, tangan terangkat dengan 4 digit, tangan di kepala dengan hanya 3 jari terlihat. |
| 12:30 Resting, 30 min lunch | `home/S3p-1230-resting-lunch.png` | Makan salad di meja luar di bawah pohon, tangan kiri rileks di meja | Ring jelas di latar depan. |
| 15:30 Moving, stairs and errands | `home/S3p-1530-moving-stairs.png` | Setengah badan, tangan kiri menggenggam pegangan tangga, tote berisi sayur dan baguette di bahu kanan | Percobaan ke-2. Genggaman benar: ibu jari terlihat dan ring di telunjuk di latar depan. |

## Sleep / “Last night” dengan karakter (18 November 2026, D-056)

Prompt tercatat di `scripts/s2-people.sh`. Karakter C-01 (D-055). Status: **AI-generated, belum di-retouch.** Tangan sudah diperiksa dengan crop resolusi penuh. Versi set batu `S2-*` tetap disimpan sebagai alternatif.

| Slot | File | Adegan | Catatan |
| --- | --- | --- | --- |
| “Last night, in one view.” | `home/S2p-01-last-night.png` (4:5) | Baru bangun di atas sprei linen, tangan kiri terbuka di atas selimut, cahaya fajar hangat dan bayangan daun di dinding | Telunjuk dengan ring, 3 jari lain, dan ujung ibu jari terlihat wajar. |
| “Patterns, not scores.” | `home/S2p-02-patterns.png` (4:5) | Duduk bersila di sofa dekat jendela, memegang cangkir teh dengan dua tangan, memandang keluar; tanpa ponsel dan tanpa angka | Ring di telunjuk kiri; genggaman kedua tangan wajar. |

**Made to be forgotten:** tetap memakai gambar ring yang sudah ada di website (D-056); tidak ada aset baru.

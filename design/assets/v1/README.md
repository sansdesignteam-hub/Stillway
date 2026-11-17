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

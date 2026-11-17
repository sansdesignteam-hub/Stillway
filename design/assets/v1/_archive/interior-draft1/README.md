# Aset gambar Versi 1 — log AI

Status: **AI-generated, draf 1, belum di-retouch, belum disetujui.**

- **Dibuat:** 17 November 2026 oleh Visual Director, mengikuti `design/asset-prompts-v1.md`.
- **Alat:** skill `gpt-image-bridge` (Codex CLI, `image_generation`) dengan akun ChatGPT pengguna. Backend model gambar dipilih oleh Codex.
- **Referensi:** gambar acuan dilampirkan lewat `codex exec -i`. Prompt dan referensi tiap file tercatat di tabel di bawah.

## Masters (`masters/`)

| File | Referensi | Catatan |
| --- | --- | --- |
| `R-black.png` | ring-master `04` | Geometri cocok dengan master. |
| `R-gold.png` | ring-master `04` | Champagne gold; geometri cocok. |
| `R-kit.png` | — | Bentuk charger dan sizing kit adalah **usulan**, belum disetujui. |
| `E-01-environment.png` | — | Interior acuan untuk semua adegan. |
| `E-02-hand.png` | ring-master `04` | Ada daun di latar, sehingga hanya dipakai sebagai acuan tangan. Ring tampak lebih polos daripada master. |

## Home (`home/`)

| ID | File | Referensi | Status / catatan |
| --- | --- | --- | --- |
| A-01 | `A-01-hero-mobile.png` | 04, E-02, E-01 | Ok. Chamfer ring kurang terlihat. |
| A-01 | `A-01-hero-desktop.png` | 04, E-02, E-01 | Ok. Tangan di kanan, ruang headline di kiri. Chamfer ring kurang terlihat. |
| A-02 | `A-02-sleep.png` | 04, E-02, E-01 | Ok. |
| A-03 | `A-03-context-desk.png` | 04, E-02, E-01 | Ok. Halaman buku kosong. |
| A-04 | `A-04-context-doorway.png` | 04, E-02, E-01 | Ok (opsional). Ring tampak seperti cincin polos. |
| A-05 | `A-05-context-pause.png` | 04, E-02, E-01 | Ok (opsional). |
| A-06a | `A-06a-desk-0900.png` | 08, E-01 | Ok. Menjadi gambar dasar untuk A-06b. |
| A-06b | `A-06b-desk-1500.png` | A-06a | Ok. Framing identik dengan A-06a. Cahaya menjadi hangat dan lembut, tetapi arah bayangan dari kanan tidak terlihat; bisa dipertegas saat retouch. |
| A-07 | `A-07-insight-phone.png` | 04, E-02, E-01 | Ok (percobaan ke-3). Pose diganti menjadi ponsel di atas meja yang disentuh jari telunjuk, karena pada pose menggenggam ponsel ring selalu muncul di ibu jari (2 hasil ditolak). Layar polos untuk UI Figma. Ring sedikit terlalu tebal. |
| A-08 | `A-08-macro-outer.png` | 04 | Ok. Contact pad berupa titik emas, berbeda dari master (oval abu-abu); perlu retouch. |
| A-09 | `A-09-macro-inner.png` | 07 | Ok (opsional). Sensor mati, pad sesuai master. |
| A-10 | `A-10-ring-shadow.png` | 08 | Ok. Satu bayangan, kilau di dalam bayangan, ring di kiri. Masih perlu diperiksa dengan kriteria anti-slop. |
| A-11 | `A-11-package-flatlay.png` | 08, R-kit | Ok. Sudut tidak sepenuhnya top-down. |
| A-12 | `A-12-night-desktop.png`, `A-12-night-mobile.png` | 04, R-kit, E-01 | Ok. |
| P-01 | `P-01-silver-daylight.png` | 04 | Ok. Ring cukup besar di frame. Menjadi gambar dasar untuk P-02 sampai P-06. |
| P-02–P-06 | `P-02-silver-lamp`, `P-03-black-daylight`, `P-04-black-lamp`, `P-05-gold-daylight`, `P-06-gold-lamp` | P-01/P-02 + R-black/R-gold | Ok. Framing keenam gambar identik. Versi Lamp light terlalu oranye dan latarnya bergradasi; Silver di bawah lampu tampak hampir emas. Turunkan saturasi saat retouch agar finish tetap terbedakan. |

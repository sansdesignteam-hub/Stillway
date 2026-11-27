# Brief Developer — D-01 sisa realisme ring di jari S06

Keputusan: D-188 di `context/decisions.md` (worktree PM). Kartu Figma D-01 (`40004772:8947`, QA-27 Nov). Kerjakan di `web-v2/` (worktree Developer) **setelah** batch MINOR QA 27 ter-push, sebelum G-19.

Status QA 27 Nov: sudah jauh lebih baik. Jari sudah menutupi sisi belakang ring, celah band sudah hilang (F-16), dan perspektif sudah cocok. Masih ada dua sisa:
1. **Bayangan kontak ring di kulit jari belum ada.** Tambahkan bayangan kontak/AO lembut di kulit tepat di tepi band (atas dan bawah ring pada jari), mengikuti arah cahaya foto tangan A-1. Bayangan ikut bergerak bersama tangan dan ring saat masuk dan naik keluar (D-147). Bayangan tidak boleh tampak saat ring masih jatuh di udara.
2. **Cahaya ring lebih dingin dan datar dibanding tangan.** Selaraskan pencahayaan ring S06 setelah terpasang dengan foto tangan: suhu warna dan arah key light mengikuti kulit, ada pantulan hangat dari kulit di sisi dalam dan bawah band, dan kontras specular tidak datar. Material tetap `silver_polished` (D-085) dan harus tetap terbaca perak. D-141 (ring S08 netral) tidak berubah.

Pertahankan motion D-173/D-174 (jatuh, putaran, ring masuk ke jari, teks muncul setelah terpasang). Bukti: screenshot sebelum/sesudah pada state ring terpasang di desktop 1440×900 dan mobile 375×812 (crop close-up jari), urutan frame masuk–terpasang–keluar, dan `npm run build` lulus. Commit `fix(web-v2): QA27 D-01 …`, push ke `origin/Developer` (D-130).

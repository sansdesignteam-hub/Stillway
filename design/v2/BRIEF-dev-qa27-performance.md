# Brief Developer — QA 27 Nov · G-19 scroll smoothness (MAYOR)

Keputusan: D-187 di `context/decisions.md` (worktree PM). Sumber: kartu G-19 di Figma QA-27 Nov 2026 (`40004784:6592`). Kerjakan di `web-v2/` pada worktree Developer, **setelah** batch MINOR QA 27 (`BRIEF-dev-qa27-minor.md`) selesai dan ter-push. Jangan mengubah tampilan, timing, atau urutan animasi yang sudah disetujui; ini murni performa.

## Temuan QA (diukur 27 Nov, scroll otomatis 16 px/frame, 2–3×)

- Sebagian besar halaman stabil ±8 ms/frame, tetapi:
  - S03 Sleep (ring 3D State 1–3): 50–200 ms, puncak 358 ms desktop; 50–133 ms mobile.
  - Masuk S04 (foto di dalam ring): 100–142 ms pada scroll pertama.
  - S06 saat tangan mulai muncul: 117–141 ms (desktop & mobile, berulang).
  - S09 mobile saat layar HP berganti: 83–150 ms.
  - S10 Finishes: rata-rata 16 ms desktop, 24 ms mobile (±40 fps).
- Muat awal baik (<1 dtk, tanpa CLS berarti), tetapi semua gambar (±1,8 MB desktop / ±2,3 MB mobile, 40–53 file) dimuat sekaligus tanpa lazy-load; memori JS ±126 MB desktop / ±175 MB mobile.

## Target

Scroll stabil 60 fps (≤16 ms/frame, tanpa frame >50 ms) di desktop dan mobile.

## Arah perbaikan (verifikasi dulu penyebab sebenarnya dengan profiler)

1. Preload + `decode()` gambar/tekstur sebelum section masuk (S04 foto ring, S06 tangan, S09 layar HP), jangan decode/upload tekstur saat frame scroll.
2. Jangan inisialisasi ulang scene 3D S03 saat kembali ke section; kompilasi shader/precompile (`renderer.compile`) sebelum terlihat.
3. Kecilkan resolusi tekstur 3D di mobile. **Pixel ratio (DPR) di `stage.ts` dinaikkan D-182 (supersampling 2,5 di HP) dan dipegang PM hero:** pertahankan, kecuali profiler membuktikan DPR penyebab utama frame drop. Bila demikian, laporkan dulu ke PM sebelum mengubahnya, dan sebaiknya turunkan DPR hanya saat scroll aktif atau di section selain S01.
4. Batasi `blur`/`backdrop-filter` dan bayangan besar di S10; animasikan hanya `transform`/`opacity`.
5. Lazy-load gambar section bawah (S07–S11) dan pakai ukuran gambar lebih kecil untuk mobile (srcset).

## Batas hero S01 (dipegang PM hero)

Tampilan hero tidak boleh berubah: DPR `stage.ts` (D-182: supersampling desktop, HP 2,5), bayangan lunak PCSS (D-180c), dan plate/proxy alas (D-181/D-186, commit 6b544cb, 9ec637a). Bila profiler menunjuk salah satu dari ini, **laporkan lewat `ask` sebelum mengubah**; PM akan berkoordinasi dengan PM hero.

## Bukti

Ukur sebelum/sesudah dengan metode yang sama (Chrome performance trace atau rAF frame-time logger, scroll otomatis 16 px/frame, desktop 1440×900 dan mobile 375×812 dengan CPU throttle 4×). Laporkan tabel frame time per section (median, p95, maks), total bytes gambar awal, dan memori JS. Sertakan screenshot pembanding untuk membuktikan tampilan tidak berubah. `npm run build` lulus. Commit terpisah per perbaikan, push ke `origin/Developer` (D-130). Catat sisa yang hanya bisa diuji di HP fisik.

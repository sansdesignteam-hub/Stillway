# Brief Developer — PageSpeed Performance 90+ di staging (MAYOR)

Keputusan: **D-191** di `context/decisions.md` (worktree PM, main). Lanjutan G-19 (D-187, D-190; commit `52ac32f`–`4736793`). Kerjakan di `web-v2/` pada worktree Developer, branch `Developer`. Model: Fable 5.2.

## Tujuan

Skor **Performance Lighthouse/PageSpeed ≥ 90 di mobile DAN desktop** untuk staging (`https://stillway-two-git-developer-sans-brothers.vercel.app/`). Target dibuktikan dengan median 3 run. SEO diabaikan (`noindex` disengaja, D-025, **jangan dicabut**). Accessibility dan Best Practices tidak boleh turun di bawah skor sekarang.

**Tampilan, timing, dan urutan animasi yang sudah disetujui tidak boleh berubah.** Ini pekerjaan performa murni.

## Baseline (audit PM 27 Nov, Lighthouse 13.6.0, staging `062e3e4`, median 3 run)

| | Mobile (Moto G Power, 4× CPU, slow 4G) | Desktop |
|---|---|---|
| Performance | **69** (67/70/69) | **79** (70/79/85) |
| FCP | 1,10 s | 0,34 s |
| LCP | 2,10 s | 0,43 s |
| **TBT** | **2,5–4,3 s** ❌ | **483 ms** ❌ |
| CLS | 0 | 0,01 |
| Speed Index | 2,68 s | 0,87 s |
| Byte awal | 1,6 MB | 1,7 MB |

Bobot skor Lighthouse 13: TBT 30%, LCP 25%, CLS 25%, FCP 10%, SI 10%. **TBT adalah satu-satunya hambatan besar.** Untuk mobile 90+, TBT perlu ±<300 ms dan LCP <2,5 s. Untuk desktop 90+, TBT perlu ±<150 ms.

Diagnostik mobile (run median):
- Main thread 7,5 s, terdiri dari Script Evaluation 5,2 s, Other 1,0 s, Style & Layout 1,0 s.
- Bootup: "Unattributable" 2,2 s (kemungkinan WebGL/shader compile, decode), `index.astro…script.js` 1,7 s, `stage.js` 0,6 s.
- Long task 400–600 ms (unattributable dan dokumen), plus banyak 100–200 ms.
- Byte terbesar: `models/s06-table.glb` 477 KB, `stage.js` 227 KB (±97 KB tak terpakai), 3 env EXR (paper 117, dusk 76, night 70 KB), ring GLB 119 KB, draco wasm 59 KB.
- Render-blocking: `index.*.css` dan `Button.*.css` (hemat ±60–150 ms).
- Catatan: Lighthouse/PageSpeed headless memakai rendering WebGL software, jadi setiap kerja GL (compile, upload tekstur, PMREM) sangat mahal di sana.

## Arah perbaikan (profil dulu, lalu urutkan berdasarkan dampak)

1. **Kerja awal hanya untuk S01.** Saat load, cukup ring hero, alas, env paper, dan render frame pertama. Pindahkan semua kerja untuk section bawah: env night/dusk (`stage.ts:124–125`, sekarang dijadwalkan dengan timer 300/900 ms), meja S06 (`loadTable`), prewarm shader varian S02–S10, dan gambar section bawah. Jalankan kerja itu saat pengguna mulai scroll atau mendekati section terkait, bukan dengan timer tetap. Pastikan tetap selesai sebelum section terlihat, sehingga jaminan G-19 tanpa compile saat scroll tetap terpenuhi.
2. **Pecah long task.** Semua kerja init dan prewarm dibagi ke irisan <50 ms yang yield ke main thread (`scheduler.yield()` / `setTimeout(0)` / `requestIdleCallback` dengan deadline). Pakai `renderer.compileAsync` (KHR_parallel_shader_compile) bila tersedia, bukan `renderer.compile` yang sinkron.
3. **Keluarkan decode berat dari main thread.** Parsing EXR (`EXRLoader`) berjalan di JS main thread. Pertimbangkan worker, atau format env yang lebih murah (HDR/RGBE, KTX2, atau env yang sudah di-prefilter), **dengan syarat pixel-diff membuktikan pantulan ring tidak berubah**. Cek juga Draco sudah memakai worker.
4. **Code-split JS.** Kode three.js dan section yang tidak dipakai S01 dimuat dengan dynamic import. Kurangi ±123 KB JS tak terpakai. Hapus kode mati.
5. **Script halaman (`index.astro…script.js`, 1,7 s).** Profil init GSAP/ScrollTrigger/Lenis dan section. Daftarkan timeline section bawah secara lazy dan hindari layout read massal saat load (forced reflow).
6. **CSS render-blocking.** Inline CSS kritis S01, defer sisanya bila aman tanpa FOUC/CLS.
7. Hanya jika semua di atas belum cukup: tunda inisialisasi WebGL hero sampai frame pertama tergambar dengan still/poster yang **identik** dengan render pertama, tanpa kedipan, tanpa lompatan, dan tanpa hover tilt yang hilang terasa. **Laporkan ke PM lewat `ask` sebelum mengerjakan opsi ini.**

## Batas yang tidak boleh dilanggar tanpa `ask` ke PM

- Hero S01: DPR `stage.ts` (D-182: supersampling desktop, HP 2,5), bayangan lunak PCSS (D-180c), plate/proxy alas (D-181/D-186), hover tilt desktop (D-180 (3)).
- Usulan menurunkan DPR saat scroll ditunda pengguna (D-190 (1)). Jangan dikerjakan tanpa persetujuan.
- Tidak ada perubahan visual, timing, atau urutan animasi.
- Jangan sentuh `noindex`, jangan merge ke `main`, jangan deploy production.

## Cara ukur (wajib sama sebelum dan sesudah)

- Lokal: `npm run build && npm run preview`, lalu `npx -y lighthouse@13.6.0 <url> --quiet --chrome-flags="--headless=new" --output=json` (mobile default) dan `--preset=desktop`. Ambil median 3 run per konfigurasi.
- Ukur juga frame time scroll seperti G-19 (rAF logger, desktop 1440×900 dan mobile 375×812 CPU 4×) supaya smoothness tidak mundur. Tidak boleh ada frame >50 ms baru.
- Pixel diff screenshot di state utama tiap section (S01 load, hover, S02–S11) sebelum dan sesudah, untuk membuktikan tampilan tidak berubah.
- Verifikasi akhir di staging dilakukan PM (staging dilindungi Vercel Authentication; PM yang memegang token bypass).

## Bukti yang dilaporkan

1. Tabel Lighthouse lokal sebelum/sesudah (mobile dan desktop: Performance, FCP, LCP, TBT, CLS, SI, byte awal), median 3 run.
2. Tabel frame time scroll per section (median, p95, maks) sebelum/sesudah.
3. Hasil pixel diff dengan path screenshot.
4. `npm run build` lulus.
5. Commit terpisah per perbaikan, push ke `origin/Developer`, dan catat hash commit terakhir.
6. Sisa masalah atau risiko, termasuk hal yang hanya bisa diuji di HP fisik.

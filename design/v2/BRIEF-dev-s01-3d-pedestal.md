# Brief Developer — hero S01: alas 3D, latar baru, lalu struktur teks (D-179)

Bayangan D-178 di staging masih belum halus menurut pengguna (`design/assets/v2/s01/shadow-issue-staging.png` di repo main). Alas cincin sekarang dibuat 3D oleh 3D Designer, dan latar diganti foto meja tanpa alas. Aset ada di `/Users/zaimmaulana/Orca/projects/Smart Ring/design/assets/v2/s01/`.

## Tahap 1 — latar baru + alas 3D + bayangan (kerjakan sekarang)
1. Ganti latar S01 dengan `hero-warm-desk-v2-1818.webp` (75 KB) dan `hero-warm-desk-v2-960.webp` (26 KB). Keduanya sudah dioptimalkan dari `hero-warm-desk-nopedestal-src.png`. Salin ke `web-v2/public/hero/`, preload first paint seperti sebelumnya, lalu pertahankan zoom/cover D-177.
2. Pasang alas 3D dari 3D Designer (`design/3d/v2/s01-pedestal.glb`, `s01-pedestal-pose.json`, dan `HANDOFF-s01-pedestal.md` di branch 3D-Designer) pada canvas WebGL yang sama. Alas hanya tampil di S01 dan keluar dengan transisi foto→paper yang ada, sehingga S02 tidak berubah. Alas `receiveShadow` dan `castShadow`. Meja memakai shadow catcher transparan.
3. **Hapus** receiver stencil-mask D-178 (dua bidang + mask kontur foto), karena alas di foto sudah tidak ada. Bayangan cincin harus jatuh mulus di permukaan atas, sisi alas, dan meja, ke kiri depan menjauhi lampu kanan. Jangan sampai ada garis potong, bidang persegi, atau banding. Gunakan PCF soft atau VSM dengan resolusi shadow map yang cukup. Contact shadow alas ke meja harus lembut.
4. Fallback reduced motion / no WebGL dan poster first paint harus memakai still baru dari 3D Designer (`design/3d/v2/fallback/fb-s01-pedestal*.webp`), dengan alas dan bayangan yang sama. Perpindahan poster ke 3D tidak boleh melompat.
5. Mobile: alas tetap tampil karena alas tidak lagi ada di foto, jadi harus 3D atau ada di still. Putuskan apakah bayangan cincin aktif di mobile dan sebutkan alasannya.

Jika aset 3D belum di-push, tunggu. Ajukan pertanyaan lewat `ask` bila spesifikasi 3D tidak cukup, dan jangan memodelkan alas sendiri.

Bukti Tahap 1: build `npm run build`, push ke origin/Developer, preview Vercel stillway-two Ready, frame 1440×900 dan 375×812 (awal, saat cincin bergerak, dan exit ke S02), close-up bayangan di atas alas, sisi, dan meja, frame reduced/no-WebGL, serta perbandingan poster vs 3D. Simpan di `design/v2/qa26-hero/` sebagai `REPORT-D179.md`. **Laporkan worker_done setelah Tahap 1.** PM akan meninjau bayangan sebelum Tahap 2.

## Tahap 2 — struktur teks hero (hanya setelah PM mengirim lampu hijau)
Ikuti Figma `ejtNpUf0FdEYMgAbcENMCH`, node `40004725:5602` (“01 · Hero / State 15”, 1440×900), dengan acuan visual `hero-text-layout-ref.png`:
- Wordmark “Stillway” besar berwarna putih di kiri atas, x 40, y ≈126, tinggi huruf ±144 px. Cincin boleh menumpuk huruf “y” seperti acuan.
- Hapus teks hero lama yang tidak ada di frame ini.
- Grup “Bottom” di x 40, y 752, lebar 1360: “SCROLL DOWN” kecil kapital ber-tracking di kiri bawah, dan intro “A smart ring that brings your sleep, activity, and rest into one everyday view.” tiga baris di kanan bawah (lebar ±389 px, rata kiri di dalam blok, blok menempel ke tepi kanan 40 px).
- Ambil font, ukuran, tracking, dan scrim dari `get_design_context` node tersebut. Navbar tidak berubah.
- Buat adaptasi mobile 375 yang setara: wordmark di atas, intro dan scroll hint di bawah tanpa menabrak cincin. Laporkan keputusan layout mobile.

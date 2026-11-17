# Stillway — proposal teknis Developer (Tahap 1)

Status: **SEBAGIAN DISETUJUI (17 November 2026).** Hal yang sudah diputuskan pengguna tercatat di `decisions.md` dan berlaku di atas dokumen ini:

- **D-022:** peran Developer; Home berbentuk kode dengan interaksi I-1 sampai I-5.
- **D-023:** stack Astro.
- **D-024:** mulai setelah handoff Visual Director.
- **D-025:** hosting lokal; Vercel nanti dihubungkan oleh pengguna.

Bagian lain dokumen ini tetap **USULAN**: rincian teknis, anggaran performa, kriteria selesai, dan I-6/I-7. Belum ada kode produksi.

Disusun: 17 November 2026. Dasar: `decisions.md` (D-001–D-021), `brief.md`, `home-copy.md` (DRAF), `figma-handoff.md`, `references.md`.

Label status yang dipakai di dokumen ini:

- **[D-xxx]**: keputusan yang sudah disetujui, dikutip dari `decisions.md`.
- **[USULAN]**: rekomendasi Developer, menunggu persetujuan.
- **[TERBUKA]**: perlu jawaban pengguna atau peran lain.

---

## 1. Tujuan implementasi bagi portofolio

[USULAN] Versi Home Stillway yang bisa dibuka di browser menambah bukti yang tidak bisa diberikan file Figma saja. Pembaca utamanya calon klien e-commerce dan founder brand [D-008]:

1. **UX e-commerce yang bisa dicoba** [D-009]. Pembaca bisa memilih finish, membuka FAQ, dan melihat paket serta harga sendiri, tidak hanya melihat gambarnya.
2. **Brand storytelling dalam ritme scroll yang nyata** [D-009]. Urutan pesan dari `home-copy.md` dialami seperti pengunjung sungguhan, di desktop maupun ponsel.
3. **Kualitas eksekusi yang bisa diperiksa.** Aksesibilitas, responsivitas, dan performa dapat diukur dengan alat. Hasil pengukuran itu dilaporkan sebagai evaluasi internal, bukan validasi pengguna atau hasil bisnis [D-005].

Batas: hanya satu halaman Home [D-018]. Tidak ada Product, Cart, checkout, pembayaran, akun, atau backend.

---

## 2. Stack

### Keputusan [D-023]: Astro, output statis

Pengguna memilih Astro karena copy akan disesuaikan lagi. Rincian penerapan [USULAN]:

- `output: 'static'`. Tidak ada adapter server dan tidak ada UI framework island (React/Vue). Hasil build hanya HTML/CSS ditambah script kecil, dan langsung kompatibel dengan Vercel nanti (D-025).
- **Copy dipisah dari markup.** Semua teks ada di satu file konten, `src/content/home.yaml`, yang dimuat melalui content collection dengan skema Zod. Setiap entri punya `text`, `status` (`draft` / `approved` / `placeholder`), dan `source` (dokumen dan bagian asal). Penyesuaian copy cukup dilakukan di file ini tanpa menyentuh komponen. Build gagal jika ada field wajib yang kosong.
- Gambar diproses dengan `<Picture>` bawaan Astro (sharp), yang menghasilkan AVIF/WebP, `srcset`, serta `width`/`height` otomatis.
- Interaksi memakai `<script>` di dalam komponen, yang di-bundle Astro, sehingga tetap di bawah anggaran JS.
- Versi: rilis stabil Astro yang sudah berumur minimal dua minggu saat scaffolding, dikunci di `package.json`. Saat dicek 17 Nov 2026, rilis terbaru 7.4.12 (13 Nov 2026), jadi belum memenuhi syarat umur. Pemilihan versi dilakukan saat mulai.

### Pembanding yang tidak dipilih (arsip)

#### Vite + HTML/CSS/JS tanpa framework

| Aspek | Alasan |
| --- | --- |
| Ringan | Satu `index.html`, CSS biasa, dan JS kecil untuk satu atau dua interaksi. Dependensi produksi nol; dependensi dev hanya Vite (dan opsional plugin gambar). |
| JS runtime minimal | FAQ memakai `<details>/<summary>` bawaan (tanpa JS). Pilihan finish memakai radio button, JS hanya untuk mengganti gambar. Target JS di bawah 5 KB gzip. |
| Mudah menerima desain | Token Figma dipetakan langsung ke CSS custom properties. Tidak ada lapisan abstraksi framework antara desain dan kode. |
| Build statis | `vite build` menghasilkan HTML/CSS/JS yang di-minify dan diberi hash, sehingga bisa di-host di mana saja. |
| Tetap berfungsi tanpa JS | Semua konten dan CTA tetap terbaca dan berfungsi jika JS gagal dimuat (progressive enhancement). |

Kekurangan: tidak ada komponen atau templating bawaan. Copy ditulis langsung di HTML. Untuk satu halaman hal ini wajar, dan sumber setiap copy dicatat di tabel pelacakan (lihat bagian 3).

#### Alternatif lain

| Opsi | Kapan lebih cocok | Biaya |
| --- | --- | --- |
| **Astro** (output statis, tanpa JS secara default) | Jika copy akan sering berganti dan ingin dipisah ke file konten (Markdown/JSON); jika butuh komponen `<Image>` bawaan untuk `srcset`/AVIF otomatis; jika lingkup kelak bertambah halaman. | Dependensi dan konsep (komponen `.astro`) lebih banyak. Untuk satu halaman lebih berat dari kebutuhan. |
| **HTML/CSS statis tanpa build tool** | Jika ingin benar-benar nol tooling. | Tidak ada minify/hash, optimasi gambar manual, dan tidak ada dev server dengan HMR. |
| Next.js / React SPA | Tidak direkomendasikan untuk fase ini. | Terlalu berat untuk halaman statis dan menambah JS runtime tanpa manfaat bagi lingkup ini. |

Lingkungan saat ini (dicek 17 Nov 2026): Node v24.14.1, npm 11.21.1. Cukup untuk Vite maupun Astro.

---

## 3. Alur menerima desain dan copy

### Dari Visual Director (Figma → kode) [USULAN]

Kondisi saat ini: **belum ada file Figma, token, atau aset** (`figma-handoff.md`, `references.md`). Palet, font, layout, dan motion belum ditentukan (brief bagian 2).

1. **Token.** Visual Director menyiapkan Figma Variables (warna, tipografi, spacing, radius). Developer membaca token tersebut melalui Figma MCP (`get_variable_defs`), lalu memetakannya ke `src/styles/tokens.css` dengan nama semantik (`--color-surface`, `--color-text`, `--space-4`, `--font-display`, dan seterusnya). Nama token sebaiknya disepakati di awal agar pemetaannya stabil.
2. **Layout dan komponen.** Tiap section/frame dibaca lewat `get_design_context` dan screenshot sebagai referensi, lalu disesuaikan ke HTML semantik. Output Figma tidak disalin mentah.
3. **Aset.** Visual Director mengekspor master resolusi tinggi (PNG/TIFF atau SVG untuk ikon/logo). Developer membuat varian AVIF/WebP dan beberapa lebar untuk `srcset`. Setiap aset dicatat di `web/ASSETS.md`: nama file, sumber, status (dibuat sendiri / berlisensi / AI + alat), izin, atribusi, dan pemakaian. Logo, foto, atau screenshot Oura, Sensiq, dan Happy Ring tidak boleh dipakai.
4. **Sebelum Figma siap.** Developer menunggu handoff Visual Director dan tidak membangun wireframe netral lebih dulu [D-024]. Saat handoff, yang diharapkan adalah frame Home (perangkat/breakpoint), Figma Variables, dan aset master. Jika ada bagian yang belum didesain, token sementara berprefiks `--tmp-` hanya dipakai untuk bagian tersebut dan diberi label jelas.
5. **Perbedaan.** Jika desain tidak memenuhi AA (misalnya kontras atau target sentuh), Developer mencatat temuannya dan meneruskannya ke Visual Director, tidak mengubah visual sendiri.

### Dari Strategy Director (copy) [USULAN]

1. Copy diambil hanya dari `home-copy.md` atau dokumen Strategy Director yang lebih baru. Status DRAF tetap dipertahankan sampai disetujui.
2. Pelacakan sumber dan status copy ada langsung di `src/content/home.yaml` (field `status` dan `source`), sehingga tidak perlu tabel terpisah. Strategy Director atau pengguna dapat menyunting file ini tanpa menyentuh komponen.
3. Teks yang belum ada copy-nya (misalnya body section Konteks keseharian, tiga pilar, FAQ) diisi placeholder yang jelas, misalnya `[Copy pending: Strategy Director]`. Developer tidak menulis copy baru, kecuali diminta dan diberi label draf.
4. Detail yang belum diputuskan (spesifikasi, baterai, ketahanan air, rentang ukuran, kompatibilitas, pengiriman, retur, mekanisme sizing kit) ditampilkan sebagai placeholder, misalnya `Battery life: [To be defined]`, atau tidak ditampilkan. Detail ini tidak boleh dikarang.
5. Semua teks yang tampil di web berbahasa Inggris [D-021], termasuk alt text, `aria-label`, meta title/description, dan pesan state.

---

## 4. Struktur folder [USULAN]

Kode web dipisah dari dokumen konteks agar keduanya tidak tercampur:

Disesuaikan untuk Astro [D-023]:

```
/
├─ context/                     # dokumen bersama (tidak diubah oleh build)
└─ web/
   ├─ astro.config.mjs          # output: 'static'
   ├─ package.json              # versi dependensi dikunci
   ├─ ASSETS.md                 # log sumber, status, dan izin aset
   ├─ public/                   # favicon, og-image, robots.txt
   ├─ src/
   │  ├─ content.config.ts      # skema Zod untuk copy
   │  ├─ content/
   │  │  └─ home.yaml           # SEMUA copy Home + status + sumber
   │  ├─ pages/
   │  │  └─ index.astro         # satu-satunya halaman: Home
   │  ├─ layouts/
   │  │  └─ BaseLayout.astro    # <html lang="en">, meta, skip link
   │  ├─ components/            # Header, ConceptBanner, Hero, …, FinishPicker, Faq, Footer
   │  ├─ styles/
   │  │  ├─ tokens.css          # token dari Figma Variables
   │  │  └─ base.css            # reset, tipografi, fokus, reduced-motion
   │  └─ assets/
   │     ├─ images/             # master dari Visual Director (diproses <Picture>)
   │     └─ icons/              # SVG
   └─ tests/                    # pemeriksaan a11y dan overflow 360px
```

Nama komponen section mengikuti struktur section yang disetujui nanti. CSS per section ditulis di dalam komponen (`<style>` Astro yang ter-scope).

---

## 5. Pendekatan responsif [USULAN]

- **Mobile-first.** CSS dasar untuk layar kecil, lalu `min-width` media query. Breakpoint awal: 360 / 768 / 1024 / 1440 px. Breakpoint akhir mengikuti frame Figma (perangkat dan frame masih [TERBUKA], D-018).
- Ukuran teks dan spacing fluid dengan `clamp()`, layout dengan CSS Grid/Flexbox, dan container queries untuk kartu/komponen bila perlu.
- **Tidak ada horizontal scroll di 360 px**, dan reflow tetap baik di 320 px (WCAG 1.4.10).
- Gambar memakai `<picture>` + `srcset`/`sizes` dengan `width`/`height` eksplisit atau `aspect-ratio` untuk mencegah layout shift. Art direction crop berbeda untuk mobile hanya jika Visual Director menyediakannya.

---

## 6. Aksesibilitas: target WCAG 2.2 AA [USULAN]

| Area | Penerapan |
| --- | --- |
| Struktur | Landmark `header` / `nav` / `main` / `footer`, satu `h1`, hierarki heading berurutan, `lang="en"`. |
| Keyboard | Skip link ke `main`; semua kontrol bisa dijangkau dengan Tab; urutan fokus mengikuti urutan visual; tidak ada keyboard trap. |
| Fokus | `:focus-visible` dengan outline kontras tinggi (2.4.7). Fokus tidak tertutup header sticky melalui `scroll-padding-top` (2.4.11, kriteria baru di 2.2). |
| Kontras | Teks 4.5:1, teks besar dan komponen UI 3:1 (1.4.3, 1.4.11), termasuk penanda finish terpilih. |
| Target | Minimal 24×24 px (2.5.8); usulan 44×44 untuk kontrol utama di mobile. |
| Pilihan finish | `fieldset` + `legend` + `input type="radio"`, sehingga panah keyboard berfungsi secara native. Nama finish tertulis sebagai teks, tidak hanya swatch warna (1.4.1). Pergantian gambar diumumkan lewat `aria-live="polite"` yang hemat. |
| FAQ | `<details>/<summary>` native, dengan state terbuka/tertutup yang dibacakan pembaca layar. |
| Media | Alt text bahasa Inggris yang menjelaskan isi gambar; gambar dekoratif `alt=""`. Visual data aplikasi bersimulasi punya teks alternatif dan label "Simulated data". |
| Motion | Semua animasi dibungkus `@media (prefers-reduced-motion: no-preference)`; tidak ada autoplay yang tidak bisa dihentikan. |
| Teks | Tahan text spacing (1.4.12) dan zoom 200%. |

Pemeriksaan otomatis (axe/Lighthouse) hanya menangkap sebagian masalah. Pemeriksaan manual dengan keyboard dan VoiceOver tetap diperlukan. Hasilnya dilaporkan sebagai evaluasi internal.

---

## 7. Performa [USULAN]

Anggaran awal (diukur dengan Lighthouse mobile emulation, bukan data pengguna nyata):

| Metrik | Target |
| --- | --- |
| LCP | < 2.5 s |
| CLS | < 0.1 |
| INP / TBT | TBT < 200 ms |
| JS | < 5 KB gzip |
| CSS | < 30 KB gzip |
| Bobot muat awal | < 1 MB (di luar gambar yang lazy-loaded) |

Cara mencapainya: gambar hero AVIF/WebP dengan `fetchpriority="high"`, gambar lain `loading="lazy"`; font di-host sendiri dalam format woff2 dengan subset, `font-display: swap`, dan maksimal dua keluarga font (font menunggu keputusan Visual Director); tanpa library animasi, tracking, atau embed pihak ketiga.

---

## 8. Hosting

### Keputusan [D-025]: lokal dulu, Vercel nanti oleh pengguna

- Saat ini halaman dijalankan dengan `astro dev` atau `astro build && astro preview` di mesin lokal. Tidak ada publikasi.
- Developer tidak menghubungkan atau men-deploy ke Vercel. Pengguna sendiri yang akan menyambungkannya. Output statis Astro sudah kompatibel tanpa adapter.
- [TERBUKA] Saat akan dipublikasikan, perlu diputuskan apakah dipasang `noindex`, memakai subdomain bawaan Vercel, dan apakah demo ditautkan dari studi kasus.

### Pembanding opsi hosting (arsip)

Semua opsi di bawah adalah hosting statis gratis. **Memublikasikan ke internet adalah tindakan keluar dan butuh persetujuan terpisah.**

| Opsi | Kelebihan | Catatan |
| --- | --- | --- |
| Cloudflare Pages (rekomendasi awal, digantikan D-025) | Preview URL per branch, CDN cepat, gratis. | Butuh repo terhubung atau upload dengan Wrangler. Connector Cloudflare di sesi ini belum diotorisasi. |
| Netlify | Preview deploy mudah, bisa drag-and-drop. | Setara untuk kebutuhan ini. |
| Vercel | Preview per branch. | Lebih condong ke Next.js, tetapi statis tetap didukung. |
| GitHub Pages | Sederhana jika repo ada di GitHub. | Tidak ada preview per branch secara bawaan. |
| Lokal saja | Nol risiko publikasi. | Hanya bisa dicoba lewat `vite preview` atau screenshot/rekaman. |

Usulan pendamping: pasang `<meta name="robots" content="noindex">` dan `robots.txt` selama demo belum final. Pakai subdomain bawaan host, karena ketersediaan domain dan merek "Stillway" belum diperiksa (D-017).

---

## 9. Interaksi untuk Home

**I-1 sampai I-5 disetujui masuk lingkup [D-022]. I-6 dan I-7 masih [USULAN].** Teks, tujuan CTA, dan struktur section tetap [TERBUKA] (decisions.md, hal terbuka no. 4) dan mengikuti Strategy Director serta Visual Director.

| # | Interaksi | Perilaku | Batas |
| --- | --- | --- | --- |
| I-1 | **Pemilih finish Silver / Black / Gold** di section Produk & paket | Radio group mengganti gambar ring dan nama finish. Harga tetap USD 299 untuk ketiganya [D-015]. Default Silver. | Tidak ada add-to-cart. Hanya pratinjau, karena cart di luar lingkup [D-018]. Butuh render ketiga finish dengan geometri sama dari Visual Director. |
| I-2 | **FAQ accordion** | `<details>/<summary>` native; beberapa item boleh terbuka bersamaan. | Isi FAQ dari Strategy Director. Topik yang belum diputuskan diberi placeholder. |
| I-3 | **CTA "Explore Stillway"** (draf, `home-copy.md`) | Anchor ke section Produk & paket di halaman yang sama, dengan smooth scroll hanya jika reduced-motion tidak aktif. | Tujuan CTA belum disetujui. |
| I-4 | **Navigasi anchor + header sticky** | Link ke section; penanda section aktif opsional. | Label navigasi perlu dari Strategy Director. |
| I-5 | **Label "Concept project / design exploration"** | Banner tipis yang selalu terlihat di atas atau di footer, ditambah catatan di section Produk bahwa produk ini fiktif. | Teks persis menunggu Strategy Director; posisi menunggu Visual Director. |
| I-6 | **Cuplikan aplikasi bersimulasi** | Gambar statis atau SVG dengan label "Simulated data" yang terlihat. | Bentuk data aplikasi masih terbuka; tidak ada angka yang terkesan sebagai rekaman kesehatan nyata. |
| I-7 | Motion masuk section (opsional) | Fade/translate ringan dengan IntersectionObserver, nonaktif saat `prefers-reduced-motion`. | Hanya jika Visual Director menetapkan motion. |

Tidak diusulkan: form waitlist atau newsletter (butuh backend dan pengumpulan data), checkout, akun, chat, atau tracking.

---

## 10. Kriteria selesai [USULAN]

Halaman dianggap selesai jika semua butir ini terpenuhi:

1. Hanya ada satu halaman Home dan semua link tetap di dalam halaman. Tidak ada link ke halaman Product/Cart yang tidak ada.
2. Semua teks yang tampil berbahasa Inggris dan berasal dari `src/content/home.yaml`, dengan `status` dan `source` terisi untuk setiap entri.
3. Paket tampil sesuai D-015: USD 299, tiga finish dengan harga sama, charger dan sizing kit termasuk, tanpa langganan wajib.
4. Label concept project terlihat. Data aplikasi diberi label simulated. Tidak ada testimoni, statistik pengguna, klaim klinis, akurasi, sertifikasi, atau hasil bisnis.
5. `ASSETS.md` mencatat sumber, status, dan izin semua aset. Tidak ada aset kompetitor.
6. Tidak ada horizontal scroll di 360 px (diperiksa otomatis); reflow baik di 320 px.
7. axe-core tidak menemukan pelanggaran serius/kritis. Pemeriksaan manual keyboard dan VoiceOver lulus untuk navigasi, pemilih finish, dan FAQ.
8. Lighthouse mobile memenuhi anggaran di bagian 7 (dilaporkan sebagai angka lab).
9. Visual cocok dengan frame Figma yang disetujui Visual Director [D-024].
10. Pengguna menyetujui hasil akhir.

---

## 11. Risiko dan dependensi

### Risiko

| Risiko | Dampak | Mitigasi usulan |
| --- | --- | --- |
| Copy berubah setelah implementasi | Pekerjaan diulang | Copy dipisah di `home.yaml` [D-023]; mulai setelah handoff visual [D-024]. |
| `brief.md` diubah di dua worktree (Developer dan Visual Director) | Konflik merge | Perubahan Developer di `brief.md` dibuat minimal; konflik dilaporkan, tidak diselesaikan sepihak. |
| Placeholder terbaca sebagai fakta produk | Melanggar kejujuran konten | Format placeholder seragam dan mencolok; dicek ulang sebelum publikasi. |
| Demo publik disangka produk atau toko nyata | Reputasi dan atribusi | Label concept selalu terlihat, `noindex`, tanpa form pembayaran atau pengumpulan data. |
| Aset AI atau render tidak konsisten antar finish | Pemilih finish terasa rusak | Minta tiga render dengan kamera dan geometri yang sama; catat di `ASSETS.md`. |
| Kontras palet final tidak memenuhi AA | Gagal target WCAG | Cek kontras token sejak awal dan beri umpan balik ke Visual Director. |
| Nama "Stillway" belum dicek ketersediaannya | Konflik merek/domain | Tidak membeli domain; pakai subdomain host. |
| Lingkup melebar (cart, waitlist) | Melanggar D-018 | Interaksi dibatasi ke daftar bagian 9 yang disetujui. |

### Dependensi

| Dependensi | Dari | Status |
| --- | --- | --- |
| Persetujuan Tahap 2 dan peran Developer | Pengguna | Disetujui [D-022] |
| Struktur section, CTA utama, dan tujuannya | Pengguna + Strategy Director | [TERBUKA] |
| Copy lengkap seluruh section, FAQ, label nav, teks concept, meta | Strategy Director | Hanya hero yang ada (DRAF) |
| Perangkat/frame (desktop/mobile), token, layout | Visual Director | [TERBUKA]; file Figma belum ada |
| Aset: render 3 finish, foto pemakaian, charger/sizing kit, cuplikan app | Visual Director | Belum dibuat |
| Hosting dan publikasi | Pengguna | Lokal [D-025]; Vercel nanti oleh pengguna |

---

## 12. Pertanyaan untuk pengguna

### Gelombang pertama: sudah dijawab 17 November 2026

| # | Pertanyaan | Jawaban | Keputusan |
| --- | --- | --- | --- |
| 1 | Home berbentuk kode dengan I-1 sampai I-5; catat peran Developer? | “Iya, peran developer boleh dicatat di decision.md” | D-022 |
| 2 | Vite atau Astro? | “Stack Astro karena nanti copy bakal ada penyesuaian lagi.” | D-023 |
| 3 | Mulai dengan wireframe netral atau tunggu Figma? | “Waktu mulai nunggu dari Visual Director” | D-024 |
| 4 | Hosting lokal atau preview publik? | “Hosting cukup lokal dulu, nanti akan saya sambungkan dengan Vercel.” | D-025 |

### Gelombang berikutnya: diajukan saat handoff Visual Director tiba

1. Perangkat dan breakpoint acuan (mengikuti frame Figma).
2. Apakah I-6 (cuplikan aplikasi bersimulasi) dan I-7 (motion) dimasukkan.
3. Pengaturan publikasi di Vercel (`noindex`, tautan dari studi kasus).

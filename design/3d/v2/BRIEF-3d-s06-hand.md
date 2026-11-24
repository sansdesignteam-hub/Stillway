> **ARSIP · 23 Nov 2026:** dihentikan (D-133). S06 tetap memakai foto tangan seperti di production. Commit 3D-Designer `9270639` dan `f4f3f16` tidak di-merge.

# Brief 3D Designer — Tangan 3D realistis untuk S06 (V2)

Dasar: D-102 (pengguna, 20 November 2026). Status: **tahap 1 = model + render tinjauan saja.** Belum ada perubahan di `web-v2/` (D-046); integrasi web oleh Developer setelah render disetujui pengguna.

## 1. Tujuan

S06 state 4 (`Then, it just fits.`) sekarang memakai foto cut-out `design/assets/v2/A-1-hand-left-alpha.png` dan ring 3D meluncur turun ke telunjuk. Pengguna ingin **tangannya juga 3D** supaya ikut berinteraksi:

- Ring tetap berakhir di pangkal telunjuk (D-072).
- Yang berubah: **tangan muncul dari bawah layar, naik, dan masuk ke ring** (ring melayang/diam, telunjuk menembus ring dari bawah). Bukan lagi ring yang turun ke tangan diam.
- Acuan suasana: https://oryzo.ai/ section "Powered by AI" (tangan 3D naik dari bawah ke arah objek yang melayang). Salinan screenshot (di checkout main): `/Users/zaimmaulana/Orca/projects/Smart Ring/design/v2/references/s06-ref-4-oryzo-hand-rise.png`; kondisi S06 sekarang: `/Users/zaimmaulana/Orca/projects/Smart Ring/design/v2/references/s06-current-photo-hand.png`. Dari Oryzo yang diambil hanya **ide gerak dan kualitas render tangan**, bukan warna kulit, latar gelap, atau pose jarinya.

## 2. Syarat tangan (wajib)

| Aspek | Syarat |
| --- | --- |
| Kulit | **Cokelat sawo matang / tan medium seperti foto A-1 sekarang**, bukan kulit gelap/hitam seperti tangan Oryzo. Cocokkan warna dengan sampling `A-1-hand-left-alpha.png` (punggung tangan dan buku jari). |
| Identitas | Tangan **kiri** karakter C-02, laki-laki dewasa (D-058, D-065). Rambut halus di punggung tangan/pergelangan seperti foto boleh, tipis. Kuku pendek dan bersih. |
| Pose | Sama dengan A-1 / D-072: **punggung tangan menghadap kamera, telunjuk tegak**, jari lain menekuk santai, ibu jari di samping. Jadikan siluet A-1 sebagai acuan pertama. |
| Realisme | Fotoreal: subsurface scattering kulit, detail kerut buku jari, pori/normal halus, roughness bervariasi (kuku lebih glossy), urat tipis di punggung tangan. Tidak boleh terlihat plastik/lilin atau "uncanny". |
| Skala | Satuan nyata, cocok dengan `stillway-ring-v2.blend`: diameter dalam ring ±19 mm (`s06-pose.json`: outer 23,84 mm). Pangkal telunjuk harus pas di dalam ring tanpa menembus band. |
| Lengan | Lengan bawah cukup panjang sampai keluar bingkai bawah (tangan naik dari bawah layar); ujung potongan tertutup/rapi karena tidak terlihat. |
| Rig | Minimal tanpa rig (tangan hanya bergerak naik). Bila mudah, beri armature ringan agar jari bisa sedikit bergerak; sebutkan di laporan, jangan wajib. |

## 3. Cara produksi (lewat Blender MCP)

Blender MCP sudah dinyalakan pengguna (D-099; `.mcp.json` di worktree 3D-Designer). Pilih jalur yang paling realistis dan jelaskan alasannya di laporan:

1. **Model tangan scan/fotogrametri berlisensi** (mis. pencarian Sketchfab lewat Blender MCP, atau sumber CC0) lalu ubah pose, retopo, dan shading kulit. Jalur yang direkomendasikan bila lisensinya bersih.
2. **Generate 3D** dari foto A-1 (Hyper3D Rodin / Hunyuan3D lewat Blender MCP), lalu perbaiki topologi dan tekstur.
3. Modeling manual di Blender.

**Lisensi wajib dicatat** (sumber, pembuat, lisensi, URL, atribusi), karena hak pakai aset masih terbuka (decisions "Hal yang masih terbuka" no. 6). Jangan pakai model yang lisensinya melarang penggunaan portofolio/komersial atau tidak jelas.

## 4. Batas untuk web (rencana tahap 2, tolong rancang dari sekarang)

- GLB Draco, target **≤ 3 MB** (sebutkan ukuran aktual), ±30–60 ribu segitiga.
- Tekstur ≤ 2K (base color, normal, roughness; ORM bila memungkinkan). Three.js tidak punya SSS sejati: siapkan versi web yang tetap meyakinkan (mis. base color yang sudah memasukkan warna SSS, `sheen`/`thickness` sebagai usulan), dan bandingkan render Cycles vs. preview Eevee/three-like.
- Ring tetap satu (D-063): tangan dan ring berada di canvas WebGL yang sama, ring Silver glossy `silver_polished` (D-085), env S06 = Paper (`design/3d/v2/env/v2-env-paper-polished.exr`, jam 21:00).
- Cadangan *reduced motion*: render diam tangan + ring di jari (pengganti A-1b, D-095) dengan latar transparan.

## 5. Yang diserahkan (tahap 1)

Simpan di `design/3d/v2/hand/` (nama baru, file V1/V2 lain jangan diubah, D-070):

1. `stillway-hand-v2.blend` (tangan + ring dari `stillway-ring-v2.blend`, kamera FOV 30° seperti `s06-pose.json`).
2. Render tinjauan PNG, latar Paper #F7F5F0:
   - `renders/hand-front.png`: pose akhir, sudut kamera seperti screenshot S06 (bandingkan berdampingan dengan A-1).
   - `renders/hand-ring-seat.png`: close-up ring di pangkal telunjuk, logo "Stillway" terbaca horizontal (D-072).
   - `renders/hand-rise-01..04.png`: 4 frame urutan tangan naik dari bawah dan masuk ke ring.
   - `renders/hand-skin-compare.png`: tangan 3D vs. foto A-1 berdampingan untuk cek warna kulit.
3. GLB uji `stillway-hand-v2_web.glb` bila sudah sempat (boleh menyusul di tahap 2).
4. `REPORT-hand.md`: jalur produksi, sumber + lisensi, jumlah segitiga, ukuran file, tekstur, keterbatasan, dan **pertanyaan terbuka untuk pengguna** (mis. rig jari, sudut naik, apakah tangan berhenti dulu sebelum masuk ring).

## 6. Aturan kerja

- Sebelum mulai: `git merge main` ke branch `3D-Designer` (branch tertinggal ±56 commit). Jangan commit perubahan `.blend` V1 di `design/3d/ring/` yang muncul karena Blender menyimpan ulang; kembalikan dengan `git restore` seperti sebelumnya.
- Jangan mengubah `web-v2/` atau `web/` (D-046). Commit di branch `3D-Designer` saja, **tanpa merge/push ke main**.
- Semua label yang mungkin tampil di web berbahasa Inggris. Laporan boleh berbahasa Indonesia.
- Jangan anggap render disetujui sebelum pengguna meninjaunya. Laporkan hasil ke Claude Code (main) untuk diperiksa.

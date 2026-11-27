# Brief 3D Designer — alas cincin hero 3D (D-179)

Pengguna menilai bayangan cincin di hero staging masih belum halus, meski D-178 sudah memakai mask dari foto. Contohnya ada di `design/assets/v2/s01/shadow-issue-staging.png`: bayangan tidak menyambung ke sisi alas. Alas kayu di bawah cincin sekarang dibuat sebagai objek 3D, dan latar hero diganti foto meja **tanpa alas**.

Semua file ada di repo main `/Users/zaimmaulana/Orca/projects/Smart Ring/design/assets/v2/s01/`:
- `pedestal-ref.png`: acuan bentuk dan material alas (3340×1882).
- `hero-warm-desk-nopedestal-src.png`: latar baru tanpa alas. Versi web `hero-warm-desk-v2-1818.webp` dan `-960.webp` dipakai Developer.
- `hero-text-layout-ref.png`: tampilan akhir S01 dengan cincin di atas alas, untuk acuan skala dan posisi.

## Deliverable
1. **Model alas** `design/3d/v2/s01-pedestal.glb` beserta file `.blend` dan skrip build bila ada. Bentuknya slab persegi panjang bersudut membulat, dengan sisi atas dan bawah yang di-fillet lembut seperti acuan. Proporsi diambil dari `pedestal-ref.png`: lebar sekitar 1,6× kedalaman dan tebal sekitar 1/8 lebar. Skala harus konsisten dengan ring V2: diameter luar ring kira-kira 0,55–0,6× lebar alas, seperti `hero-text-layout-ref.png`.
2. **Material** kayu oak/beech terang dengan serat memanjang di permukaan atas dan end grain halus di sisi. Gunakan PBR (baseColor, roughness, normal) dengan roughness tinggi tanpa kilap. Teksturnya ringan: atlas ≤1024 px, WebP/KTX2, atau embed JPG yang terkompresi. Target GLB ≤ 400 KB, Draco boleh. UV harus rapi agar serat kayu tidak meregang di fillet.
3. **Pose dan pencahayaan acuan**: posisi, rotasi, dan skala alas relatif terhadap ring S01 sehingga cincin duduk atau melayang di atasnya seperti acuan. Simpan di `design/3d/v2/s01-pedestal-pose.json`. Cocokkan perspektif dengan foto meja baru: kamera agak tinggi, lampu hangat di kanan atas, dan bayangan alas jatuh ke kiri depan.
4. **Fallback still** untuk reduced motion dan no WebGL: render ring + alas + bayangan di atas latar baru dengan framing S01 yang sama dengan poster D-178. Simpan sebagai WebP di `design/3d/v2/fallback/`, misalnya `fb-s01-pedestal.webp`. Jika poster harus dipisah dari latar, sertakan versi alpha.
5. Render review desktop 1440×900 di atas latar baru, plus close-up bayangan cincin yang jatuh ke permukaan atas dan sisi alas lalu ke meja.
6. `HANDOFF-s01-pedestal.md` untuk Developer: file, skala, pose, material, dan catatan bayangan. Untuk bayangan, alas harus `receiveShadow` dan `castShadow`, sedangkan meja memakai shadow catcher transparan. Perbarui juga `HANDOFF-v2-ring.md`, yang masih menyebut poster lama `fb-s01-polished`.

## Batas
- Jangan mengubah `web-v2/` (D-046). Commit dan push ke branch 3D-Designer, lalu laporkan commit, ukuran file, dan keterbatasannya.
- Ring tetap memakai `stillway-ring-v2-silver-polished_web.glb` dan finish S01 yang sudah ada.

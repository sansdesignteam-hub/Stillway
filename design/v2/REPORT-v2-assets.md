# Laporan Visual Director — rencana prompt aset V2

19 November 2026 · Task `task_535ec1890999` · Branch `Visual-Director`
Dasar: D-061 (logo teks), D-062 (jendela A), D-064 (studio Paper/Sand), D-065 (produksi setelah render acuan, karakter C-02).

## Ringkasan

- `design/v2/HANDOFF-v2.md` sudah diperbarui ke rev 2. Isinya: tabel keputusan D-061–D-070 di bagian atas, dan setiap bagian terkait diberi tanda **[D-0xx disetujui]**. Perubahan yang masuk:
  - logo di ring berupa teks vertikal saja;
  - lampu hanya di jendela A, tanpa titik merah di 3D;
  - satu canvas WebGL;
  - aset studio Paper/Sand, termasuk Everyday S07;
  - footer tanpa form, newsletter, dan share;
  - finish hanya berganti lewat klik swatch, dan tombol `Choose {finish} · $299` hanya memunculkan catatan concept;
  - CTA navbar "Find your size" → S10;
  - aturan mobile beserta rincian "lebih ringan" untuk S07 dan S09;
  - Readiness dihapus dari S09;
  - angka spesifikasi tanpa `*`, dan durasi S04 disetujui.
- **Belum ada gambar yang dibuat.** Semua aset di bawah menunggu render acuan ring berlogo dari 3D Designer.
- Script `design/v2/scripts/v2-assets.sh` sudah disiapkan, tetapi **sengaja dikunci**. Script berhenti jika `RING_REF` (path render acuan) belum diisi, dan tidak pernah dijalankan.

## Aturan umum untuk semua aset

| Hal | Ketentuan |
|---|---|
| Karakter | C-02 (`design/assets/v1/masters/C-02-character.png`): laki-laki awal–pertengahan 30-an, kulit terang-sedang hangat, rambut cokelat gelap pendek, janggut pendek rapi, kemeja linen oatmeal. Ring di **telunjuk kiri** (D-058). |
| Ring | Persis seperti render acuan 3D Designer: silver, tepi chamfer, dalam hitam matte. Teks **"Stillway"** terukir tone-on-tone, **vertikal searah lebar band** (D-061, ref `ring-logo-engrave-ref.png`). Jendela sensor tidak menyala di foto. |
| Logo di foto AI | Logo hanya boleh tampil **terbaca benar**, atau **tidak terlihat** (sisi logo membelakangi kamera). Jika AI mengacak huruf, logo diganti dengan **tempelan dari render acuan** saat retouch, atau ring diputar di prompt. Huruf acak = tolak. |
| Latar | Studio **Paper #F7F5F0 / Sand #EFE6DB** (D-064): dinding plaster krem, lantai/alas Sand, kayu oak terang, linen. Tanpa batu, lumut, atau pakis. |
| Cahaya | Satu sumber lembut dari jendela samping, hangat 4500–5200 K. Night memakai lampu meja 2700 K. Bayangan lembut; tanpa bayangan daun (ciri V1). |
| Grade | Hangat, kontras rendah, grain halus. Tanpa biru/hijau dominan dan tanpa warna di luar palet. |
| Alat | `gpt-image-bridge` lewat `design/assets/v1/scripts/genref.sh` (Codex `image_generation` dengan referensi `-i`). Referensi: render acuan ring + C-02. |
| Kriteria tolak | Tangan bukan 5 digit atau sendi tidak wajar; ring berbeda dari acuan (pad, jendela, chamfer, lebar band); ring di jari/tangan yang salah; logo acak; teks, watermark, angka, atau layar ponsel; ring melayang tanpa kontak; perhiasan atau jam lain; kulit CGI. Setiap tangan diperiksa dengan crop resolusi penuh. |
| Output | Master PNG di `design/assets/v2/` (ID-nama-deskriptif.png). Developer membuat WebP. Prompt final dicatat di script. |

---

## A-1 · Tangan cut-out S06 State 4 ("Then, it just fits.")

**Pose tangan, diselaraskan dengan pose akhir ring 3D:**
- **Tangan kiri** C-02, **punggung tangan menghadap kamera**, pergelangan masuk dari bawah-kanan frame. Lengan bawah sedikit condong ±10–15° ke kiri dari vertikal.
- **Telunjuk lurus mengarah ke atas** dan sedikit terpisah dari jari lain (celah ±1 cm), supaya ring 3D bisa turun dari ujung jari ke pangkal tanpa menabrak jari tengah.
- Jari tengah, manis, dan kelingking sedikit menekuk dan merapat di bawah garis telunjuk. Ibu jari rileks, menyamping ke kiri, tidak menutupi pangkal telunjuk.
- Kamera sejajar dengan pangkal telunjuk, sedikit dari atas (±10°). Sumbu telunjuk jadi garis hampir vertikal, dan bukaan ring di pose akhir terlihat sebagai elips tipis di atas band.
- **Pose akhir ring (untuk 3D Designer):** sumbu ring = sumbu telunjuk. Ring berhenti di ruas proksimal, tepat di atas buku jari. Sisi luar dengan **teks "Stillway" vertikal menghadap kamera** (searah jari, sehingga terbaca dari bawah ke atas seperti referensi). Jendela sensor ada di sisi telapak, tidak terlihat. Jalur turun lurus mengikuti sumbu telunjuk.
- **Tanpa ring di foto**, karena ring berasal dari 3D. Kuku pendek bersih. Tanpa jam dan perhiasan lain.

**Komposisi:** kanvas persegi 1536×1536. Tangan mengisi ±45% lebar di **sisi kanan**; ujung telunjuk di ±18% dari atas, pergelangan terpotong tepi bawah. Sisi kiri kosong untuk judul. Latar polos Paper rata, tanpa bayangan jatuh (memudahkan cut-out).

**Prompt (draf):**
> Real studio photograph, not a render. A relaxed adult man's LEFT hand, the same skin tone and hand as the attached character reference (early-to-mid 30s, warm light-medium skin, short clean nails), cut-out style on a perfectly plain flat warm cream backdrop #F7F5F0 with no shadow on the backdrop. Back of the hand faces the camera; the forearm enters from the lower right and leans slightly left. The INDEX finger points straight up, fully extended and slightly apart from the others; the middle, ring and little fingers are gently curled and close together below it; the thumb rests relaxed to the left without covering the base of the index finger. Camera level with the base of the index finger, slightly from above. NO ring, no jewelry, no watch, no sleeve visible beyond the wrist. Soft even studio light from the left, true-to-life skin texture. The hand occupies the right 45% of a square frame, fingertip near the top fifth, wrist cropped by the bottom edge; generous empty space on the left. Exactly five digits, natural joints. No text, no props, no room.

**Variasi:** 3 sampel (telunjuk tegak; condong 10° kiri; condong 20° kiri). 3D Designer memilih satu yang paling cocok dengan proxy jari.
**Turunan:** A-1b, yaitu tangan yang sama dengan ring ditempel dari render acuan (retouch, bukan generate ulang). Dipakai untuk cadangan reduced motion/WebGL gagal dan sebagai frame awal transisi S06 → S07 (foto tangan mengecil jadi kartu).
**Cut-out:** latar polos dihapus menjadi PNG alpha (tepi rambut tangan dihaluskan). Diserahkan bersama koordinat garis sumbu telunjuk (titik ujung jari dan titik pangkal, dalam piksel) untuk 3D Designer.

---

## A-2 · Empat kartu S07 (4:5, 1232×1536)

Gaya bersama: studio Paper/Sand, C-02, ring berlogo di telunjuk kiri, ring jadi fokus yang tajam. Wajah boleh terlihat sebagian dan tidak menatap kamera. Satu properti per adegan. Kartu tampil kecil (±12vh) di State 2, jadi siluet tiap kartu harus mudah dibedakan.

| Kartu | Copy (home-copy-v2) | Adegan dan komposisi | Properti | Cahaya |
|---|---|---|---|---|
| (I) Night | "Sleeps with you. Charges while you don't." | Malam. Close-up dari atas: tangan kiri rileks di atas selimut linen Sand, punggung tangan ke atas. Bahu dan pipi C-02 samar di atas bantal, mata terpejam. Ring di sepertiga bawah | Selimut + sarung bantal linen | Lampu meja hangat 2700 K dari kanan, sisanya gelap lembut (masih hangat, bukan biru) |
| (II) Desk | "Sized to forget." | Meja oak terang di depan dinding Paper. Tangan kiri berhenti di atas keyboard tipis tanpa merek, jari sedikit melengkung; lengan kemeja linen digulung. Medium close 45° | Keyboard polos (tanpa huruf terbaca) | Jendela kiri, 5000 K |
| (III) Move | "Light enough to lose track of." | Lantai studio Sand. C-02 berlutut mengikat tali sepatu kanvas; tangan kiri memegang tali di depan, punggung tangan ke kamera. Sudut rendah | Sepatu kanvas krem | Jendela kanan, 5200 K, bayangan lembut di lantai |
| (IV) Rinse | "Hands in water. Ring stays on." | Wastafel keramik Sand. Kedua tangan di bawah aliran air; tangan kiri di depan, ring basah dan berkilau, tetesan terlihat. Close-up | Wastafel + keran brushed | Jendela atas-kiri, 5000 K, highlight air |

**Fragmen prompt bersama (draf):**
> Real editorial lifestyle photograph, not a render, full-frame camera, 50–85 mm, natural light only, warm cream-and-sand studio palette (cream plaster #F7F5F0, sand linen #EFE6DB, light oak), soft film-like tonality, fine grain, calm and candid. The man is the SAME man as the attached character reference (face, hair, beard, skin tone, oatmeal linen shirt). He wears the smart ring from the attached ring reference render on the INDEX finger of his LEFT hand: same silver band, chamfered edges, matte black inside, with the small tone-on-tone engraved word "Stillway" running across the band width — the engraving must be either clean and correct or turned away from the camera, never garbled. Exactly five digits on every visible hand. Avoid: stone, moss, ferns, leaf shadows, phone screens, numbers, text, logos other than the ring engraving, other jewelry, watches, glowing sensor lights, CGI skin, HDR, oversaturation.

Kartu Night juga menjadi tujuan transisi S06 → S07 ("kartu yang sama kembali sebagai kartu Night"). Karena itu warna kulit dan tangan harus konsisten dengan A-1.

---

## A-3 · "The Everyday" full-bleed S07 State 5

- **Adegan:** ruang studio Paper/Sand yang tenang (dinding plaster krem, lantai Sand, satu bangku oak rendah, jendela besar di luar frame kiri). C-02 duduk santai menyamping di bangku, memegang cangkir keramik dengan kedua tangan di dada. Tangan kiri menghadap kamera, ring berlogo terlihat jelas. Badan penuh, kecil di frame.
- **Komposisi:** 16:9 (2400×1350). C-02 di **sepertiga kanan**. Pusat frame relatif kosong dan tenang, karena kartu aktif mengecil di tengah dan teks putih besar "The Everyday" menumpang di atasnya. Area tengah harus cukup gelap/netral agar teks putih terbaca; usulan: dinding sedikit lebih gelap di tengah oleh bayangan lembut jendela. Crop mobile 9:16 dari kanvas yang sama, dengan C-02 tetap terlihat di bawah-kanan.
- **Cahaya:** sore 4500 K dari jendela kiri, satu bidang cahaya hangat di lantai.
- **Prompt:** fragmen bersama A-2 + "Wide calm interior, full body, small in frame, right third, large quiet negative space in the centre for overlay text, 16:9."
- Dibuat sebagai master lebar 2400 px, plus 1 variasi dengan C-02 berdiri bersandar di dinding.

---

## A-4 · Isi box studio S10

- **Isi:** ring silver (logo terlihat, dari render acuan) + charging dock (puck bulat rendah, bentuk dari `masters/R-kit.png`) + sizing kit (baki dengan sampel ring ukuran 6–13, D-067). Tanpa kemasan bermerek dan tanpa teks.
- **Komposisi:** flat lay dari atas 90°, atau 3/4 rendah. Alas Sand #EFE6DB polos. Ketiga benda tersusun diagonal kiri-atas → kanan-bawah, dengan bayangan kontak lembut. Rasio 4:3 (1600×1200); thumbnail di panel S10 di-crop 1:1.
- **Cahaya:** softbox kiri 5000 K, bayangan lembut ke kanan.
- **Catatan:** bentuk dock dan sizing kit masih **usulan** V1 (`R-kit.png`). Jika 3D Designer memodelkan dock, render 3D lebih baik daripada AI. Lihat pertanyaan 3.

---

## Urutan kerja setelah render acuan tiba

1. Isi `RING_REF` di script dengan path render dari 3D Designer, lalu cek bahwa render memperlihatkan logo dan sisi luar 3/4.
2. A-1 (3 variasi) → pilih bersama 3D Designer → cut-out + A-1b.
3. A-2 (4 kartu, masing-masing 2 sampel) dan A-3 dikerjakan paralel.
4. A-4.
5. Periksa crop tangan dan logo, retouch logo bila perlu, lalu catat di `design/assets/v2/README.md`.

## Pertanyaan untuk pengguna

1. **Pose tangan S06:** usulan saya tangan kiri, punggung tangan ke kamera, telunjuk tegak, logo di ring terbaca vertikal. Setuju, atau ingin pose lain dari referensi Sofi/Sensiq (mis. tangan menyamping)?
2. **Logo yang diacak AI:** jika gpt-image tidak bisa menulis "Stillway" dengan bersih di ring, boleh logonya ditempel dari render acuan saat retouch? (Usulan: ya. Alternatifnya, logo diputar membelakangi kamera.)
3. **Isi box:** cukup AI berdasarkan `R-kit.png`, atau minta 3D Designer memodelkan dock dan sizing kit agar konsisten dengan ring 3D?
4. **Retouch logo di 5 foto S04 (R-1):** perlu, atau dibiarkan karena ring kecil di jari?

## Kebutuhan ke 3D Designer

- Render acuan berlogo: minimal **3/4 sisi luar (logo terbaca)**, **depan**, dan **tampak samping**, latar netral, 2048 px. Ini acuan untuk `RING_REF`.
- Satu render ring **di sumbu vertikal dengan sisi logo menghadap kamera**, sudut kamera ±10° dari atas. Ini sama dengan pose akhir S06, untuk A-1b dan untuk menyelaraskan foto tangan.
- Setelah A-1 dipilih: proxy jari dan pose akhir disesuaikan dengan foto. Saya mengirim PNG alpha + koordinat sumbu telunjuk.

## Usulan keputusan (dicatat Claude Code di main setelah pengguna setuju)

- U-E: Pose tangan S06 = tangan kiri C-02, punggung tangan ke kamera, telunjuk tegak; ring berhenti di pangkal telunjuk dengan logo vertikal menghadap kamera.
- U-F: Logo di foto AI harus bersih atau tidak terlihat; logo acak diganti dengan tempelan dari render acuan.
- U-G: Adegan kartu S07: Night (selimut, lampu meja), Desk (keyboard), Move (tali sepatu), Rinse (wastafel). Everyday = studio dengan C-02 duduk di sepertiga kanan.

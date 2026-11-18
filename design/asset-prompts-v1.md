# Stillway Versi 1 — daftar aset gambar AI dan prompt

> **Diperbarui 17 November 2026 (D-032, D-035):** set interior dan tangan di dokumen ini **sudah digantikan** oleh set nature “moss rock studio” tanpa tangan (`design/assets/v1/masters/E-03-moss-rock-set.png`). Prompt yang berlaku dicatat per file di `design/assets/v1/README.md`. Bagian di bawah disimpan sebagai riwayat; hasil drafnya ada di `design/assets/v1/_archive/interior-draft1/`.

Status: **USULAN Visual Director, belum disetujui.** Disusun 17 November 2026 dari Arah A “One Day, in Light” (`context/visual-directions.md`) dan wireframe `design/wireframes/v1/`. Daftar dan prompt adalah bahan kerja untuk dibuat pengguna di Google Flow. Metode aset (AI penuh vs ring 3D + AI) masih dibahas terpisah (D-029, worktree). Bentuk charger, sizing kit, tangan, dan interior adalah usulan ilustratif.

Prompt ditulis dalam bahasa Inggris. Gambar tidak memuat teks, logo, atau UI; potongan UI aplikasi dibuat di Figma dan diberi label “Simulated data”.

## Cara pakai di Google Flow

1. Setiap generasi yang memuat ring: lampirkan **ring master** sebagai ingredient/referensi. Pakai sudut yang paling dekat dengan adegan: `04-three-quarter-outer.png` untuk ring di jari/meja, `08-flat-45.png` untuk ring berbaring, `07-macro-sensors.png` untuk makro dalam.
2. Lampirkan juga **environment master** (E-01) dan **hand master** (E-02) setelah keduanya jadi, agar interior dan tangan konsisten di semua bab.
3. Gabungkan: `[STYLE BLOCK]` + prompt aset + `[AVOID BLOCK]`.
4. Untuk pasangan yang harus identik (A-06a/b, P-01 s.d. P-06): buat satu gambar dasar, lalu **edit gambar itu** dan hanya ubah cahaya atau finish. Jangan generate ulang dari nol karena kamera akan bergeser dan crossfade akan terlihat melompat.
5. Rasio: desktop 16:9, mobile 3:4 atau 9:16. Jika crop dari 16:9 memotong subjek, generate ulang versi mobile dengan prompt sama dan rasio berbeda.
6. Hasilkan 4 varian, pilih satu, retouch, lalu isi log di bagian akhir.

### STYLE BLOCK (tempel di setiap prompt)

```
Editorial lifestyle photograph, shot on a full-frame camera with natural light only, true-to-life color, soft film-like tonality, fine natural grain, realistic skin and material texture. Calm, quiet, uncluttered. The smart ring must match the attached reference exactly: a smooth domed band about 7 mm wide, thin bright chamfered edges, black matte inner shell with two small sensor windows and two small contact pads. No text, no logos, no engraving on the ring.
```

### AVOID BLOCK (tempel di akhir setiap prompt)

```
Avoid: visible faces, posed models, glowing sensor lights, lens flare, bokeh particles, glow, vignette, HDR look, plastic CGI shine, over-sharpening, extra rings or jewelry, text, logos, watermarks, marble, dried flowers, leaves, water droplets, decorative props, purple or neon tones, symmetric catalog composition.
```

Catatan sensor: LED hijau/merah pada ring master hanya cocok untuk makro teknis. Pada adegan keseharian, sensor tidak menyala.

---

## Tahap 0 — master referensi (wajib sebelum aset lain)

| ID | Aset | Untuk | Status |
| --- | --- | --- | --- |
| R-Silver | Ring master Silver | Semua adegan | **Sudah ada** (`design/ring-master/`) |
| R-Black | Ring master Black | P-03, P-04 | Belum ada |
| R-Gold | Ring master Gold | P-05, P-06 | Belum ada |
| R-Kit | Charger + sizing kit master | A-11, A-12 | Belum ada |
| E-01 | Environment master (satu interior) | Semua adegan dalam ruang | Belum ada |
| E-02 | Hand master | Semua adegan dengan tangan | Belum ada |

**R-Black** — edit dari `04-three-quarter-outer.png` dan `08-flat-45.png`:
```
Recolor only the outer band of this exact ring to a satin matte black ceramic-like finish with a soft low sheen. Keep the thin chamfered edges as dark brushed metal that catches a narrow highlight. Keep geometry, proportions, inner shell, sensors, background, camera, and lighting exactly the same.
```

**R-Gold** — edit dari file yang sama:
```
Recolor only the outer band of this exact ring to a polished warm champagne gold, soft and slightly muted, not bright yellow. Keep the chamfered edges polished gold. Keep geometry, proportions, inner black shell, sensors, background, camera, and lighting exactly the same.
```

**R-Kit** — usulan bentuk (ilustratif, perlu disetujui):
```
Product reference on a seamless light warm-grey background, soft diffused studio light. Two objects side by side: (1) a small round wireless charging dock for a smart ring, matte warm-white mineral finish, low cylinder about 4 cm wide with a shallow circular recess and a thin USB-C cable; (2) a ring sizing kit: eight plain matte grey plastic sizing rings on a simple matte card tray, each ring the same shape as a smart ring band. No text, no numbers, no logos. Clean three-quarter view.
```

**E-01 Environment master** — dibuat kosong tanpa ring/tangan:
```
Interior reference photograph of one quiet small apartment, early morning. East-facing tall window with thin sheer linen curtain, limewash plaster walls in warm off-white, a solid light oak table, a low oak bench, an unmade bed with oatmeal linen bedding visible in the next room through a doorway, a simple ceramic cup, a stack of two notebooks, a small brass desk lamp. Natural low sunlight across the table. Wide 16:9, eye-level, no people.
```

**E-02 Hand master:**
```
Close-up reference of one adult's left hand resting relaxed on a light oak table, natural short unpolished nails, light-medium skin tone with natural texture, sleeve of an oatmeal linen shirt at the wrist. The ring from the reference is worn on the index finger. Soft window light, neutral background, no face.
```
Pilihan jari (telunjuk kiri) dan warna kulit adalah usulan; ganti sekali di sini lalu pakai konsisten.

---

## Tahap 1 — aset Home Versi 1

Prioritas: **W** = wajib untuk frame Versi 1, **O** = opsional.

| ID | Bab / waktu | Aset | Rasio | Grading token | Prioritas |
| --- | --- | --- | --- | --- | --- |
| A-01 | 06:40 Hero | Tangan + ring di atas linen dekat cangkir, cahaya pagi | 16:9 + 3:4 | Dawn `#F2EDE4` | W |
| A-02 | 07:00 Sleep | Tepi tempat tidur pagi, tangan di atas selimut | 4:3 | Dawn | W |
| A-03 | Konteks | Meja kerja, tangan menulis | 4:3 | Day `#F6F5F1` | W |
| A-04 | Konteks | Ambang pintu/tangga, tangan memegang tote | 4:3 | Day | O |
| A-05 | Konteks | Jeda: tangan memegang gelas air di jendela | 4:3 | Day | O |
| A-06a | 09:00 Signature | Meja, cahaya 09:00 | 16:9 | Day | W |
| A-06b | 15:00 Signature | Meja yang sama, cahaya 15:00 | 16:9 | Day → Dusk | W |
| A-07 | 17:30 Insight | Ponsel di tangan, layar polos untuk UI | 4:3 | Dusk `#E8DBC8` | W |
| A-08 | 18:30 Material | Makro sisi luar ring | 1:1 | Dusk | W |
| A-09 | 18:30 Material | Makro sisi dalam / sensor | 1:1 | Dusk | O |
| A-10 | 18:30 Material | Gambar bayangan ring (Silver, D-030) | 16:9 | Dusk | W |
| P-01–P-06 | 19:30 Produk | 3 finish × Daylight / Lamp light, kamera identik | 4:3 | Day / Dusk | W |
| A-11 | 19:30 Produk | Flatlay paket: ring, charger, sizing kit | 4:3 | Dusk | W |
| A-12 | 23:00 Penutup | Ring di charger di nakas, malam | 16:9 + 3:4 | Night `#151820` | W |

FAQ (21:00) tidak memakai gambar. Total: 6 master + 14 aset wajib + 3 opsional (P-01–P-06 dihitung 6).

### A-01 Hero 06:40
```
Early morning at 06:40. Low warm sunlight rakes through a sheer linen curtain across an oatmeal linen tablecloth on an oak table. The adult's left hand from the reference rests near a simple ceramic cup of coffee, wearing the Silver smart ring on the index finger; the ring catches a soft highlight. Hand and cup sit in the right third; the left half is open, softly shadowed space for a headline. Wide 16:9, slightly high angle, shallow but natural depth of field. Color temperature about 3500K, gentle, quiet.
```
Mobile: ubah ke `Vertical 3:4, hand and cup in the lower half, open shadowed space at the top for a headline.`

### A-02 Sleep — pagi
```
Morning just after waking. The adult's left hand with the Silver ring rests on rumpled oatmeal linen bedding near the edge of the bed. Pale cool dawn light from the window, soft long shadows in the folds. Hand in the lower left third, calm negative space above. 4:3, close framing, no face, no body beyond the wrist.
```

### A-03 Konteks — meja kerja
```
Mid-morning at a light oak desk. The adult's left hand with the Silver ring holds a pencil over an open paper notebook; a closed laptop edge and a ceramic cup sit at the frame edge. Clear neutral daylight from the side window. 4:3, top-down at about 60 degrees, uncluttered.
```

### A-04 Konteks — keluar rumah (opsional)
```
Late morning at the apartment doorway. The adult's left hand with the Silver ring holds the strap of a plain canvas tote bag; a sliver of limewash wall and the door frame are visible, soft daylight from outside. 4:3, waist-level, no face.
```

### A-05 Konteks — jeda (opsional)
```
Midday pause by the window. The adult's left hand with the Silver ring holds a clear glass of water against the bright sheer curtain; gentle backlight rims the fingers and the ring edge. 4:3, close, calm.
```

### A-06a Signature 09:00 (gambar dasar)
```
Fixed camera, locked-off wide shot of the light oak desk by the east window at 09:00. The Silver smart ring lies flat on the desk next to an open notebook and a ceramic cup, no hand. Crisp low morning sunlight enters from the left, casting long shadows of the window frame toward the right. 16:9, eye-level slightly above the table, generous empty table surface for light to travel across.
```

### A-06b Signature 15:00 (edit dari A-06a, jangan generate baru)
```
Keep this exact image: same camera, framing, objects, and ring position. Change only the time of day to 15:00: sunlight now comes from the right through the west side, warmer about 4200K, shadows shorter and falling toward the left, slightly softer contrast. Nothing else changes.
```
Periksa dengan menumpuk A-06a dan A-06b di Figma (opacity 50%). Objek harus menempel; jika bergeser, ulangi edit.

### A-07 Insight 17:30
```
Late afternoon at 17:30. A modern smartphone lies flat on the light oak table, screen up, in portrait orientation. The adult's left hand rests beside it, palm down, index finger extended and lightly touching the lower part of the screen; the Silver ring is worn on that same index finger, the thumb is bare. The screen is a flat, evenly lit plain light-grey screen with no interface, for later compositing. Warm low golden side light, soft long shadows. 4:3, camera about 55 degrees from above, phone center-right, no glare on the screen.
```
UI ditempel di Figma; jangan minta UI ke AI. Pose menggenggam ponsel ditinggalkan karena ring selalu muncul di ibu jari.

### A-08 Makro sisi luar
```
Macro photograph of the Silver smart ring standing upright on the oak table edge, early evening warm side light at about 3800K. Focus on the domed outer surface and the thin chamfered edge highlight; the room behind falls softly out of focus in warm neutral tones. 1:1, 100 mm macro look, ring slightly off-center.
```

### A-09 Makro sisi dalam (opsional)
```
Macro photograph looking into the inside of the Silver smart ring lying on its side on the oak table: black matte inner shell, two small dark sensor windows and two small contact pads, sensors not lit. Warm evening side light grazes the inner surface. 1:1, 100 mm macro look.
```

### A-10 Gambar bayangan ring (brief D-050)
Lampirkan `08-flat-45.png`.
```
Still life: the Silver smart ring lies flat on a honed limestone surface with real micro texture and no veining. One hard sun source from a very low angle of about 10 to 15 degrees, around 4500K, casts a single long elliptical shadow: sharp at the contact point, softening with distance. A small reflected glint from the polished inner edge falls inside the shadow, consistent with the light direction. Camera about 65 degrees from above, 100 mm macro look, enough depth of field for the whole ring. Ring in the left third, the shadow flowing into open space on the right. Surface tone close to warm sand #E8DBC8, soft blacks, no vignette. 16:9.
```
Tolak jika: bentuk ring berubah, ada lebih dari satu bayangan, arah bayangan tidak cocok dengan highlight, ring terlihat melayang tanpa bayangan kontak, kilap plastik, atau komposisi simetris (daftar lengkap ada di `visual-directions.md`).

### P-01 s.d. P-06 Produk: finish × cahaya
Buat **P-01** dulu, lalu edit untuk lima lainnya. Kamera, permukaan, dan posisi ring harus identik karena gambar di-crossfade.

**P-01 Silver · Daylight (gambar dasar):**
```
Product photograph of the Silver smart ring standing upright at a three-quarter angle on a plain warm limewash plaster surface against a matching wall. Soft diffused north window daylight from the left, about 5500K, gentle shadow to the right. Ring centered slightly low, plenty of even space around it. 4:3, 90 mm lens look, eye-level with the ring.
```
**P-02 Silver · Lamp light** (edit P-01):
```
Keep this exact image. Change only the lighting to a single warm table lamp from the right, about 2700K, evening mood: warmer highlights on the ring, deeper soft shadow falling to the left, background a little darker. Same camera, ring, and position.
```
**P-03 Black · Daylight / P-05 Gold · Daylight** (edit P-01, lampirkan R-Black / R-Gold):
```
Keep this exact image. Replace only the ring finish with the [satin matte black | warm champagne gold] finish from the attached reference. Same geometry, camera, light, and position.
```
**P-04 Black · Lamp light / P-06 Gold · Lamp light:** sama, tetapi edit dari P-02.

### A-11 Flatlay paket
Lampirkan ring master Silver dan R-Kit.
```
Top-down flatlay on a warm oak tray at 19:30 under a warm table lamp from the upper right, about 2800K. Arranged with calm, even spacing: the Silver smart ring, the round warm-white charging dock with its cable loosely coiled, and the sizing kit tray with eight grey sizing rings. Soft shadows, matte surfaces. 4:3, objects grouped slightly left of center with breathing room.
```
Isi paket mengikuti D-015 (ring, charger, sizing kit). Jangan tambah kotak atau manual yang belum disetujui.

### A-12 Penutup 23:00
```
Night at 23:00 in the bedroom. The Silver smart ring rests in the round charging dock on an oak bedside table. The room is lit only by faint cool blue-ink moonlight from the window and a very dim warm glow from the dock edge. Deep blue-black tones around #151820, the ring readable with one soft highlight. 16:9, ring and dock in the right third, large calm dark space on the left for the closing line.
```
Mobile: `Vertical 3:4, dock in the lower third, dark space above.`

---

## Pemeriksaan sebelum dipakai

1. Ring sama dengan master: lebar, kubah, tepi chamfer, tanpa ukiran/logo.
2. Satu sumber cahaya dan satu arah bayangan per gambar, sesuai jam bab.
3. Tangan konsisten (jari, kulit, lengan baju) dan tanpa wajah.
4. Interior konsisten dengan E-01.
5. Ruang kosong untuk teks ada di sisi yang benar (hero dan penutup).
6. Pasangan crossfade (A-06a/b, P-01–P-06) menempel saat ditumpuk.
7. Grading mendekati token bab; tanpa vignette atau HDR.

## Log aset AI

Isi setelah memilih varian (sesuai proses di `visual-directions.md`).

| ID | File | Alat / model | Prompt (versi) | Referensi terlampir | Tanggal | Retouch | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | Google Flow | | | | | AI-generated |

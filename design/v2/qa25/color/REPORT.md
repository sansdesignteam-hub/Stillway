# G-13 / G-16 — sinkron warna dengan Variable Figma (D-168)

Screenshot sebelum/sesudah 1512×827: `S01|S03|S04|S05|S08|S11_before|after_1512.jpg`.

## Token
`tokens.css` memakai primitive Neutral dan Cocoa baru, alpha dari brief, dan Token Color dengan nama CSS = nama variable.
Nama pendek lama (`--paper`, `--night`, `--ink`, …) tetap ada sebagai alias ke token tersebut. Ramp ochre dihapus.
`--night` = Neutral/950; gradasi G-16 (12 stop) berakhir tepat di warna itu. `theme-color` dan `favicon.svg` = Neutral/50 baru.

## Elemen yang dulu ochre
| Elemen | Sekarang |
|---|---|
| Focus ring (seluruh halaman, tombol S10, tombol/link S11) | `--focus`: stroke-strong di terang, stroke-white di gelap |
| S05: dua titik "awake" + halo di grafik | Putih |
| S10 Lamp light: warna panel | Paper + Cocoa/300 14% |
| S10 Lamp light: latar redup dan glow samping | Night + Cocoa/400 28%, glow Cocoa/300 32% (suasananya kurang amber) |
| Ring 3D: rim hangat (S03, S05) | Cocoa/300, intensitas 7 → 10 |
| Ring 3D: corner light S03 (peach) | Cocoa/200, intensitas 9 → 14 |

Tidak diubah (bukan token ochre): lampu meja 3D S10 (`deskLamp`), sapuan `--shine-amber` di wordmark footer,
finish Gold, meja kayu S06, foto S01, env EXR, still fallback ring, OG image dan favicon PNG.

Ikut disesuaikan karena `--cocoa` kini Cocoa/600 (lebih terang): bayangan kontak jari S06 dan glow bawah layar
Recovery di HP S09 memakai Cocoa/800 supaya tetap gelap.

## Kontras
Panel/teks di atas Cocoa/600 (hitungan):

| Teks | Rasio |
|---|---|
| White | 8.59 |
| Paper (Neutral/50) | 7.89 |
| Cocoa/100 | 5.28 |
| **text-night-soft (Neutral/400)** | **3.34 — di bawah 4.5** |

Saat ini tidak ada teks yang duduk di panel Cocoa/600 padat; bila nanti ada, jangan pakai text-night-soft di sana.

Diukur dari render (1512 dan 375, piksel latar paling terang di belakang teks): S03, S04, S05, S08, S11 semuanya ≥ 4.5:1
(terendah 4.89, label jam di kartu S05). Label itu sebelumnya 4.05 dengan white 60%, jadi dinaikkan ke white-alpha-70.
text-night-soft di Night: 7.72.

Glow hangat S03 dan S11 dicek dengan kontras diperkuat 3×: tidak terlihat banding (Chrome headless, belum di layar fisik).

# Brief Developer — Sinkron warna dengan Variable Figma (25 Nov)

Dari: PM · 25 November 2026 · Dasar: D-168 (pengguna: "Untuk warna ada perubahan di Figma, jadi tolong kamu sesuaikan update color di Variable Figma"). Termasuk menuntaskan G-13 dan ujung gradasi G-16.
Branch `Developer`, `web-v2/src/styles/tokens.css` + pemakaian token. Push ke `origin/Developer`, jangan merge ke `main`. `npm run build` harus lulus.

## Primitive (🌈 Primitive Color, Figma `ejtNpUf0FdEYMgAbcENMCH`)
- Neutral: 0 #FFFFFF · 50 #F7F5F0 · 100 #EFE6DB · 200 #DFD6CA · 300 #C9BFB5 · 400 #A9A097 · 500 #867F78 · 600 #6B655F · 700 #554E4A · 800 #3C3733 · 900 #231F20 · 950 #0C0906
- Cocoa (ramp baru): 50 #ECE3DF · 100 #DAC7BE · 200 #C8A593 · 300 #B7856C · 400 #A3694D · 500 #86553C · 600 #6B422E · 700 #503021 · 800 #362116 · 900 #20140E · 950 #0E0906
- **Ochre sudah tidak ada di Figma** → hapus ramp `--ochre-*` dan `--ochre`/`--ochre-on-cocoa`. Elemen non-teks yang dulu ochre (progress, titik, glow, focus ring, border) pindah ke token netral/cocoa yang paling dekat perannya (glow → Cocoa 300/400; garis/titik → text-strong atau white di gelap). Laporkan daftar elemen yang berubah.
- Accent sensor tetap: green #34E07A, blue #3B8CFF, violet #A06BFF, red #FF3B30.
- Alpha: neutral(#231F20) 6/8/12/14/15/28/60/70/78%, white 7/10/12/14/20/70/80/85/90/92%, paper(#F7F5F0) 12/45/60/65/80%, cocoa-400 25%, cocoa-300 50%, cocoa-950 25%, neutral-500 35%, neutral-700 28%, green 45%.

## Token (🎨 Token Color, web = Light Mode). Nama CSS = nama variable.
- bg-neutral-weak (Paper) Neutral/50 · bg-neutral-soft (Sand) Neutral/100 · bg-white Neutral/0 · bg-black Neutral/900
- **bg-night-strong (latar Night) = Neutral/950 #0C0906** (ganti `--night: cocoa-950`)
- bg-night-surface Neutral/900 · **bg-cocoa-surface (panel/kartu di gelap) = Cocoa/600 #6B422E**
- bg-line / stroke-surface: neutral-alpha-12 · stroke-strong Neutral/900 · stroke-white Neutral/0
- text-strong Neutral/900 · text-surface Neutral/600 · text-white Neutral/0 · text-disabled Neutral/300 · text-cocoa-surface Cocoa/600
- **text-night-soft (teks sekunder di Night) = Neutral/400 #A9A097 solid** (ganti Paper 65% transparan)
- btn-primary Neutral/900, hover Neutral/800 · btn-neutral Neutral/50, hover Neutral/100 · btn-white Neutral/0 · btn-disabled Neutral/200
- icon-strong/surface/disabled/white = Neutral 900/600/300/0 · logo-primary Neutral/900
- sensor-heart-rate/sleep/recovery/off = accent di atas

## Catatan
- Gradasi G-16 kini berakhir tepat di bg-night-strong (Neutral/950), sesuai acuan Design 25 Nov.
- Cahaya hangat section gelap (D-139, glow cocoa) dan ring hangat S03 (D-137) pakai ramp Cocoa baru; pastikan tetap tanpa banding.
- Cek kontras teks di atas panel Cocoa/600 (target ≥ 4.5:1) dan laporkan bila kurang.
- Bukti: screenshot sebelum/sesudah 1512×827 untuk S01, S03, S04, S05, S08, S11 di `design/v2/qa25/color/`. Laporkan ke PM.

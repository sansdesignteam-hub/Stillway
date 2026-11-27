# D-185: S07 4K photo and S01 lamp highlight

## S07 "The everyday." photo
Master `design/assets/v2/s07/Stillway_Three_Rings_4K.avif` (3840 × 2400, 678 KB); sets by
`scripts/s07-plate.mjs` (AVIF q80, WebP fallback), per-file sizes in `public/s07/everyday-sizes.json`.

| set | width | AVIF KB | WebP KB |
|---|---|---|---|
| full | 960 / 1280 / 1920 / 2560 / 3840 | 48.5 / 74.3 / 124.8 / 176.5 / 305 | 36.7 / 56.9 / 95.8 / 132.1 / 217.7 |
| phone portrait (right half) | 768 / 1280 / 1920 | 49.3 / 91.5 / 157.7 | 39.1 / 71.5 / 114.1 |

2560 AVIF 176.5 KB (target ≤ 250). Fetched: 1440@2x `everyday-3840.avif` (305 KB), 375@3x
`everyday-p-1920.avif` (157.7 KB). Nothing is requested at page load; the fetch starts when S07 is next
(S06). Framing kept (phone `object-position` retuned for the 16:10 photo). `s07-before-after-*.jpg`.

## S01 desk-lamp highlight
Analytic warm specular on the band shader (`stage.ts`, `pose.glint`), direction = `lights.key`, no new
scene light. Starts 0.15 s after `ring-live`, 1.6 s fade-in, out over u 0.05–0.85. Poster unchanged; no
WebGL / reduced motion shows no highlight.

- `ring-before-after-*.jpg`: at rest
- `fade-in-*.jpg`: 0, 0.45, 0.95, 1.5, 2.0, 2.5, 3.3 s after `ring-ready`
- `tilt-1440.jpg`: pointer centre, top left, top right, bottom left, bottom right
- `lift-off-*.jpg`: u 0, 0.3, 0.6, 0.9, 1.5

fps (headed Chrome, `design/v2/scripts/perf.mjs`), rest and tilt, 1440, 1440 4× CPU, 375 size: 60 before
and after (p95 17.5–17.6 ms). No real phone GPU tested. Clearance script not re-run: no geometry or pose
change.

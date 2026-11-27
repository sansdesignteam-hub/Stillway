# D-186b plate drop (3D 45d844c) and D-186c live-ring tunings

## Plate drop
Sets rebuilt with `scripts/hero-plate.mjs`; pose JSON copied (only `mismatch_pixels` differs). AVIF/WebP KB,
desktop: 960 31/37, 1280 53/66, 1920 103/133, **2560 163**/205 (budget 250), **3840 321**/356 (budget 450).
Ring overlay 3840 40/218. All files: `public/hero/plate-s01-sizes.json`.

## Tunings (live ring, S01 at rest only; they fade with the lift-off)
- Shadow (`CATCH` in `stage.ts`): pedestal gain 1.65; desk gain 0.88, mask softened (3 mm) and 30 %
  filled round the pedestal's baked shadow.
- Wood reflection on the band: the reflected ray is traced to the pedestal top or desk; the pixel takes
  that wood's hue at its own brightness.
- Warm tint on the whole ring, luma-neutral (1.05, 0.99, 0.91).
- Landscape phones (≤ 760 px wide, ≤ 500 px tall): wordmark left of the ring, smaller intro.

## Poster vs live (rest, sway and highlight forced off, dev server)
| | poster luma p05/25/50/75/95 | live | IoU | shadow darkening poster / live: pedestal top | desk |
|---|---|---|---|---|---|
| 1440@2x | 25/44/65/143/193 | 23/44/65/143/189 | 0.978 | 0.353 / 0.360 | 0.188 / 0.196 |
| 375@3x | 25/44/66/141/187 | 23/44/65/143/188 | 0.973 | 0.355 / 0.357 | 0.174 / 0.198 |

Before the tunings (D-186, same corrected method, 1440): pedestal top 0.354 / 0.290 (live 18 % light), desk
0.206 / 0.215 (already matched). The D-186 report's single "20 % lighter" figure used a mask that dropped
very dense shadow; the shortfall was on the pedestal only.
"Top" / "desk" are a screen split at 17 % of the ring height above its lowest row, not a mesh mask.

## Checks
fps (headed Chrome, before the plate swap, which does not change the shaders): 60 at 1440, 1440 4× CPU and
375. Clearance 0 to 0.03 mm over the tilt range. M-11 (touch 375, 740 → 812 → 740): ring and canvas unchanged.
No horizontal overflow at nine viewports. Emulation only; no real phone.

## Realism (my visual judgement)
Better: the ring is grounded on the pedestal, the lower band picks up wood, the thin desk arc is diffuse.
Open: the poster stays neutral silver while the live ring is warm, so the colour warms during the 0.9 s
cross-fade; the lower band, with the D-185 gold highlight, reads a little champagne for a silver finish
(one number each to dial back); the reflection is a flat hue without wood grain; a faint arc still shows
on the far desk.

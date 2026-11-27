# D-182c: poster ring f59c740 vs live ring (S01 at rest, DPR 2, sway forced to its neutral phase, no pointer)

Silhouettes by black/white matte (alpha > 0.95), cut at the live ring's lowest row (the poster's dense contact
shadow lies below it). CSS px, left/top/right/bottom; luma p05/25/50/75/95 on each layer's own ring mask.

| | poster bbox | live bbox | IoU | poster luma | live luma |
|---|---|---|---|---|---|
| 1440 | 553 / 285.5 / 902.5 / 718.5 | 552.5 / 285.5 / 902.5 / 718.5 | 0.975 | 28/48/98/151/236 | 23/45/64/142/188 |
| 375 | 98 / 310.5 / 286.5 / 544 | 97 / 310.5 / 285.5 / 544 | 0.960 | 29/48/98/153/225 | 23/45/65/142/188 |

Sway sweep (envRot −0.38 … +0.38): live p50 stays 64–66 at 1440 and 65–67 at 375, so the tone gap is not the sway phase.
Geometry: no width mismatch (≤ 1 px). Files: `onion-*.jpg` (50/50 mix; mask: grey both, red poster only, cyan live only),
`crossfade-strip-*.jpg` (poster → live at 0, 25, 50, 75, 100 %; opacities set by hand).

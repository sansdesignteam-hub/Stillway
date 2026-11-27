# QA27 G-19 — scroll smoothness (D-187)

Measured on the production build (`npm run build`, served statically), Chrome with the GPU (Metal), `requestAnimationFrame` logger, automatic scroll 16 px per frame over the whole page, twice per load (`measure.mjs`; raw frames in `frames-*.json`). Before = `23bd985` (after D-01 and the G-18 GLB), after = `4736793`. The display runs at 60 Hz, so 16.7 ms is the floor here.

## What was wrong (traced, not guessed)

Chrome traces of the first scroll showed the long frames were all inside the frame callback:
- **S01 → S02 (hero u ≈ 2.8), 50–70 ms, every load:** three.js built and compiled new shader variants when the desk lights and the shadow went away.
- **Entering S06 (u ≈ −0.52), 83–118 ms, every load:** the pine table's shaders compiled and its textures uploaded in that frame.
- **03 → 04 lens, S05, S09 (up to 350 / 250 / 167 ms on a first scroll, not every load):** pictures decoded when first shown.
- **S03:** the LED / flare / corner-light changes each brought another shader variant (seen once the first two were fixed).
- All pictures (28 files) were fetched at load: everything is on one fixed stage, so `loading="lazy"` never held anything back, the ring stills for no-WebGL included.
- S10 on phones repainted the navbar mask of the whole column every frame (`--fn-y` changed the mask).
- S03 and S08 read element heights every frame.

## What changed (look, timing and order untouched)

1. `52ac32f` ring stage: a light at intensity 0 is taken out of the scene (it was still computed for every pixel of the ring: 10 directional lights, 2–4 lit in any section). Every shader variant the story can ask for is compiled in idle time after load (29 variants), and the table's textures are uploaded in idle time.
2. `29d8e3c` pictures from S04 down and the ring stills carry their URL in `data-*`; `story.ts` fetches them two sections ahead and decodes them one section ahead. The stills are only fetched without the 3D ring.
3. `e7d9fae` S03 / S08 heights read once per size.
4. `80cec8b` S10 phones: the mask sits on a still layer, the column moves inside it.
5. `4736793` finer sampling for the prewarm.

Not touched: `stage.ts` pixel ratio (D-182), PCSS shadows (D-180c), hero plate / proxy (D-181 / D-186), antialiasing.

## Frame times

**Desktop 1440×900 @2×, no throttle — first pass (cold)**, two runs pooled

| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |
| --- | --- | --- | --- | --- |
| hero | 16.7 / 17.8 / 67 | 2 | 16.7 / 17.6 / 34 | 0 |
| why | 16.7 / 17.7 / 49 | 0 | 16.7 / 17.5 / 18 | 0 |
| sleep | 16.7 / 17.8 / 34 | 0 | 16.7 / 17.6 / 18 | 0 |
| activity | 16.7 / 17.7 / 350 | 1 | 16.7 / 17.4 / 84 | 1 |
| insight | 16.7 / 17.7 / 251 | 3 | 16.7 / 17.4 / 34 | 0 |
| details | 16.7 / 18.0 / 83 | 2 | 16.7 / 17.4 / 18 | 0 |
| specs | 16.7 / 17.8 / 19 | 0 | 16.7 / 17.5 / 18 | 0 |
| features | 16.7 / 17.8 / 19 | 0 | 16.7 / 17.6 / 34 | 0 |
| app | 16.7 / 17.7 / 167 | 1 | 16.7 / 17.6 / 33 | 0 |
| finishes | 16.7 / 17.9 / 19 | 0 | 16.7 / 17.6 / 18 | 0 |
| close | 16.7 / 18.2 / 19 | 0 | 16.7 / 17.5 / 18 | 0 |

**Desktop 1440×900 @2×, no throttle — second pass (warm)**, two runs pooled

| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |
| --- | --- | --- | --- | --- |
| hero | 16.7 / 18.1 / 33 | 0 | 16.7 / 17.6 / 84 | 2 |
| why | 16.7 / 18.2 / 34 | 0 | 16.7 / 17.5 / 33 | 0 |
| sleep | 16.7 / 18.2 / 50 | 1 | 16.7 / 17.5 / 18 | 0 |
| activity | 16.7 / 18.1 / 34 | 0 | 16.7 / 17.5 / 18 | 0 |
| insight | 16.7 / 18.1 / 19 | 0 | 16.7 / 17.6 / 18 | 0 |
| details | 16.7 / 18.0 / 19 | 0 | 16.7 / 17.5 / 33 | 0 |
| specs | 16.7 / 18.1 / 33 | 0 | 16.7 / 17.5 / 18 | 0 |
| features | 16.7 / 18.1 / 34 | 0 | 16.7 / 17.5 / 32 | 0 |
| app | 16.7 / 18.1 / 33 | 0 | 16.7 / 17.5 / 33 | 0 |
| finishes | 16.7 / 17.8 / 134 | 1 | 16.7 / 17.5 / 18 | 0 |
| close | 16.7 / 18.0 / 34 | 0 | 16.7 / 17.6 / 18 | 0 |

desktop: images at load **2.15 MB / 28 files → 0.47 MB / 10 files**; all transfers 3.70 → 2.02 MB; JS heap after load 17.9 → 21.3 MB, after two full scrolls 19.1 → 22.4 MB.

**Mobile 375×812 @3×, CPU throttle 4× — first pass (cold)**, two runs pooled

| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |
| --- | --- | --- | --- | --- |
| hero | 16.7 / 17.9 / 67 | 2 | 16.7 / 17.6 / 33 | 0 |
| why | 16.7 / 18.0 / 19 | 0 | 16.7 / 17.6 / 67 | 2 |
| sleep | 16.7 / 18.1 / 19 | 0 | 16.7 / 17.6 / 67 | 1 |
| activity | 16.7 / 18.1 / 19 | 0 | 16.7 / 17.5 / 18 | 0 |
| insight | 16.7 / 18.0 / 19 | 0 | 16.7 / 17.6 / 33 | 0 |
| details | 16.7 / 18.1 / 118 | 2 | 16.7 / 17.5 / 34 | 0 |
| specs | 16.7 / 18.1 / 19 | 0 | 16.7 / 17.6 / 33 | 0 |
| features | 16.7 / 18.1 / 19 | 0 | 16.7 / 17.5 / 34 | 0 |
| app | 16.7 / 17.8 / 19 | 0 | 16.7 / 17.5 / 34 | 0 |
| finishes | 16.7 / 18.2 / 18 | 0 | 16.7 / 17.6 / 18 | 0 |
| close | 16.7 / 18.2 / 19 | 0 | 16.7 / 17.5 / 18 | 0 |

**Mobile 375×812 @3×, CPU throttle 4× — second pass (warm)**, two runs pooled

| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |
| --- | --- | --- | --- | --- |
| hero | 16.7 / 17.8 / 19 | 0 | 16.7 / 17.5 / 18 | 0 |
| why | 16.7 / 18.2 / 19 | 0 | 16.7 / 17.5 / 18 | 0 |
| sleep | 16.7 / 18.2 / 19 | 0 | 16.7 / 17.5 / 33 | 0 |
| activity | 16.7 / 18.2 / 150 | 4 | 16.7 / 17.5 / 18 | 0 |
| insight | 16.7 / 17.7 / 19 | 0 | 16.7 / 17.5 / 84 | 1 |
| details | 16.7 / 17.9 / 19 | 0 | 16.7 / 17.6 / 83 | 1 |
| specs | 16.7 / 18.1 / 34 | 0 | 16.7 / 17.5 / 33 | 0 |
| features | 16.7 / 18.0 / 19 | 0 | 16.7 / 17.6 / 67 | 1 |
| app | 16.7 / 18.2 / 66 | 3 | 16.7 / 33.3 / 184 | 19 |
| finishes | 16.6 / 18.1 / 33 | 0 | 16.7 / 17.6 / 50 | 0 |
| close | 16.7 / 18.1 / 83 | 1 | 16.7 / 33.5 / 200 | 11 |

mobile: images at load **1.91 MB / 28 files → 0.23 MB / 10 files**; all transfers 3.45 → 1.78 MB; JS heap after load 18 → 21.3 MB, after two full scrolls 19.2 → 22.3 MB.

Reading the tables: the frames that were slow at the same place on every load (hero u ≈ 2.8, details u ≈ −0.52) are gone, and so are the first-scroll picture decodes. Single frames of 50–200 ms still appear, in the before runs too, at a different place each run (two more mobile runs of the after build: one clean second pass, others with strays in other sections). This Mac was shared with other agents during the runs (load average ≈ 4.8), so they are noise of the machine as far as these runs can tell, not a section.

JS heap is ≈ 3 MB higher after load: the shader variants compiled ahead.

## Same look

`pixel-diff-desktop.txt`, `pixel-diff-mobile.txt`: 40 scroll positions on both builds, share of pixels that differ by more than 8/255. Worst 0.06 % (hero u 1.5, where the reflections move with time), everything else ≤ 0.0003 %. Pairs in `same-look/` (`*-before.jpg`, `*-after.jpg`).

## Weak-GPU proxy and the pixel ratio (open, needs the hero PM)

This Mac's GPU never leaves 16.7 ms, so the steady cost QA saw in S03 (50–200 ms) cannot be reproduced on it. As a proxy the page was run on software GL (SwiftShader, 1440×900, 96 px steps), where a frame costs in proportion to the pixels shaded:

| S02–S03, median ms per frame (second pass) | S02 | S03 |
| --- | --- | --- |
| pixel ratio 2 (now, D-182) | 433 | 334 |
| pixel ratio 1.5 | 283 | 233 |
| pixel ratio 1 | 217 | 183 |

Sections without the ring cost ≈ 85–115 ms there, so the ring's canvas is what makes S02–S06 and S08 3–5× dearer, and its cost follows the canvas resolution. Taking the dark lights out gave ≈ 15 % in the same proxy (S02 383 → 333, S05 433 → 367, S08 450 → 383; one pass, noisy). The remaining lever for slow GPUs is the canvas resolution, which D-182 sets and this card may not change. Proposal for the PM: keep D-182 in S01 and whenever the page is still; while scrolling outside S01 render at 1.5 (desktop) / 2 (phones) and return to full resolution ≈ 150 ms after the scroll stops. Not built.

## Only testable on a real phone

- Real GPU frame times on a mid-range Android phone and an iPhone (CPU throttling here does not slow the GPU).
- Memory on iOS Safari with the 2.5× canvas.
- That pictures fetched two sections ahead arrive in time on a slow mobile network (a fast fling or an anchor jump to S07–S09 can show a picture a moment late; it was eager before).
- Safari has no `requestIdleCallback`: the prewarm runs in 8 ms timer slices there, untested on a device.

# D-191 — PageSpeed Performance 90+ (mobile and desktop)

Brief: `design/v2/BRIEF-dev-pagespeed-90.md`. Before = `062e3e4`, after = `25066c8` (seven commits, `8fc9be3` … `25066c8`). Look, timing and order of the story are unchanged; nothing in the hard limits was touched (hero pixel ratio D-182, PCSS shadow D-180c, pedestal plate / proxy D-181 / D-186, hover tilt, pixel ratio while scrolling D-190, no poster in front of a delayed WebGL start).

## Result

Lighthouse 13.6.0, `npm run build` + `astro preview` on localhost, `--chrome-flags="--headless=new"`, mobile = default (Moto G Power, 4× CPU, slow 4G, simulated), desktop = `--preset=desktop`. Three runs each, median; the single runs in brackets. Raw reports: `lighthouse/*.json`.

| | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | --- | --- | --- | --- |
| **Performance** | **69** (69 / 48 / 69) | **97** (97 / 98 / 96) | **79** (77 / 79 / 80) | **100** (100 / 100 / 100) |
| FCP | 1.22 s | 1.20 s | 0.41 s | 0.41 s |
| LCP | 2.58 s | 2.36 s | 1.15 s | 0.41 s |
| TBT | 2236 ms (2443 / 1792 / 2236) | 23 ms (125 / 23 / 21) | 401 ms (563 / 401 / 394) | 21 ms (9 / 47 / 21) |
| CLS | 0.032 | 0.004 | 0.001 | 0.009 |
| Speed Index | 2.01 s | 1.20 s | 0.62 s | 0.48 s |
| Bytes at load | 1.73 MB | 1.73 MB | 1.79 MB | 1.78 MB |
| Lighthouse benchmark index of the Mac during the runs | 2559 / 2469 / 2709 | 2992 / 2772 / 2849 | 2894 / 2831 / 2313 | 2697 / 2243 / 2238 |

**The score follows the speed of the machine that runs Lighthouse.** One series of the after build (at `aa3c5d8`, one small commit earlier) ran while other processes held the Mac (benchmark index 1828 / 2188 / 1524, about 40 % slower): mobile **82** (90 / 78 / 82), TBT 610 ms (348 / 721 / 610); desktop 100 (100 / 100 / 94). Both series are in `lighthouse/runs.json`. See "Left over".

Accessibility and Best Practices (one full run each, mobile): 95 and 100 before, 95 and 100 after. The `noindex` meta is untouched.

## What was wrong (traced)

A trace of the page load (`tools/trace.mjs`, `tools/trace1x.mjs`) put the 2.2 s of blocking time here:

| Where | Main thread, phone (4× CPU) |
| --- | --- |
| EXR environment maps decoded on the main thread (paper, night, dusk) | 513 + 378 + 420 ms, three tasks |
| First layout and paint of all eleven sections, twice (the HTML arrives in two parts) | 280 + 213 ms |
| Page script: every section's init in one task, with two full style recalculations | 212 ms |
| Ring's first frame: all shader programs built and all textures uploaded in one task | 250 ms |
| Six full-screen 2D lights (S03 – S05, S08, S11) painted at load | 60 – 110 ms each |
| WebGL context + three.js evaluated in one task; nine S01 blend environments built in one task | 127 ms, 98 ms |
| Shader prewarm (G-19): a whole scene's programs per idle turn | 54 – 59 ms each |
| S06 table: one 2048 px texture per call | 62 – 72 ms each |
| Building the prewarm's ≈ 3000 poses | 65 – 86 ms |

Lighthouse (and PageSpeed) run headless Chrome without a GPU. There every wait for the GPU happens in real time on the main thread and is then multiplied by four, so two more causes showed only in an unthrottled trace: the canvas was resized after the environments were built and waited ≈ 100 ms for that work, and the first use of a shader program asks the GPU a few hundred questions that wait for its queue.

## What changed

1. `8fc9be3` The light painter computes its pixels in a worker (`glow.worker.ts`, maths in `glowPaint.ts`); the main thread only puts them on the canvas.
2. `83f319f` EXR maps are fetched and decoded in a worker (`ring/exr.worker.ts`); the main thread builds the same texture from the same half-float pixels.
3. `3bf650c` Ring stage (`ring/stage.ts`):
   - setup yields between its steps;
   - the drawing buffer is sized once, before the environments;
   - the first frame is primed: programs one object per turn, textures one per turn, each program's first use in its own turn, and the frame is drawn once the GPU has linked them and emptied its queue;
   - the G-19 prewarm compiles one object per idle turn, and its pose list is built one section per turn;
   - night env, dusk env and the S06 table follow the first frame one after the other in idle time (they used to start on timers during the ring's own loading);
   - the table's three textures go up in strips of 128 rows.
4. `cb1fb49` The first layout is the hero's alone: a section is `display: none` until `story.ts` raises it (shows it to layout and runs its init). The sections around the scroll position are raised before the first frame, the others one per turn right after it.
5. `0c608be` Motion starts after the first paint. That is the order the page always had in practice; with the lighter start-up the script could now run before the first paint, and Chrome then counted the hero photo as a background and took the intro line, which fades in at 1 s, as the LCP element (Lighthouse then reported LCP 6.2 s).

6. `aa3c5d8`, `25066c8` The waits for the GPU before the first frame have a time limit (a covered window draws no frames and the ring never came up there); the S01 photo env uploads in its own turn; prewarm turns are 3 ms.

Tried and dropped: loading the night / dusk env and the table only when the visitor first scrolls or moves the pointer (the brief's direction 1). It gave the same Lighthouse score, but on a real GPU the env prefiltering and the mipmaps then landed in the visitor's first second of interaction as two or three frames of 50 – 84 ms (none in the baseline; measured with `tools/hoverframes.mjs` during the work, the files here are of the final build). Loaded in idle time after the first frame they cost nothing that Lighthouse or a visitor sees.

## Scroll frame times (no regression)

Same method as G-19 (`../d187-g19/measure.mjs`): Chrome with the GPU, `requestAnimationFrame` logger, automatic scroll 16 px per frame over the whole page, two passes per load. Raw frames: `frames-*.json`. The Mac was shared with other agents (load average 4 – 14), so both builds show stray long frames at a different place each run; the table is for comparing the two, not for absolute values.

**Desktop 1440×900 @2×, no throttle — first pass (cold)**, 2 + 2 runs pooled

| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |
| --- | --- | --- | --- | --- |
| hero | 16.7 / 33.4 / 233 | 3 | 16.7 / 17.7 / 50 | 1 |
| why | 16.7 / 17.6 / 67 | 2 | 16.7 / 17.5 / 33 | 0 |
| sleep | 16.7 / 17.5 / 49 | 0 | 16.7 / 17.6 / 151 | 3 |
| activity | 16.7 / 17.6 / 168 | 12 | 16.7 / 17.6 / 266 | 4 |
| insight | 16.7 / 17.6 / 100 | 4 | 16.7 / 17.6 / 267 | 7 |
| details | 16.7 / 17.5 / 34 | 0 | 16.7 / 17.5 / 116 | 1 |
| specs | 16.7 / 17.4 / 50 | 0 | 16.7 / 17.5 / 34 | 0 |
| features | 16.7 / 17.4 / 67 | 3 | 16.7 / 17.5 / 67 | 2 |
| app | 16.7 / 17.4 / 118 | 2 | 16.7 / 17.5 / 50 | 1 |
| finishes | 16.7 / 17.5 / 68 | 2 | 16.7 / 17.6 / 34 | 0 |
| close | 16.7 / 17.3 / 19 | 0 | 16.7 / 17.6 / 67 | 2 |

**Desktop 1440×900 @2×, no throttle — second pass (warm)**, 2 + 2 runs pooled

| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |
| --- | --- | --- | --- | --- |
| hero | 16.7 / 33.3 / 50 | 0 | 16.7 / 33.3 / 50 | 1 |
| why | 16.7 / 17.4 / 67 | 1 | 16.7 / 17.6 / 100 | 3 |
| sleep | 16.7 / 17.5 / 34 | 0 | 16.7 / 17.5 / 50 | 1 |
| activity | 16.7 / 17.5 / 66 | 1 | 16.7 / 17.4 / 49 | 0 |
| insight | 16.7 / 17.4 / 66 | 1 | 16.7 / 17.5 / 50 | 0 |
| details | 16.7 / 17.5 / 33 | 0 | 16.7 / 17.5 / 34 | 0 |
| specs | 16.7 / 17.4 / 33 | 0 | 16.7 / 17.5 / 101 | 2 |
| features | 16.7 / 17.6 / 84 | 4 | 16.7 / 17.6 / 168 | 3 |
| app | 16.7 / 17.5 / 533 | 4 | 16.7 / 17.4 / 67 | 1 |
| finishes | 16.7 / 17.4 / 34 | 0 | 16.7 / 17.5 / 84 | 1 |
| close | 16.7 / 17.6 / 34 | 0 | 16.7 / 17.5 / 34 | 0 |

**Mobile 375×812 @3×, CPU throttle 4× — first pass (cold)**, 2 + 2 runs pooled

| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |
| --- | --- | --- | --- | --- |
| hero | 16.7 / 17.7 / 116 | 4 | 16.7 / 17.6 / 167 | 3 |
| why | 16.7 / 17.6 / 50 | 1 | 16.7 / 17.6 / 67 | 1 |
| sleep | 16.7 / 17.6 / 101 | 1 | 16.7 / 33.2 / 150 | 14 |
| activity | 16.7 / 17.6 / 83 | 2 | 16.7 / 17.7 / 84 | 9 |
| insight | 16.7 / 17.6 / 34 | 0 | 16.7 / 17.6 / 67 | 2 |
| details | 16.7 / 17.6 / 217 | 7 | 16.7 / 17.6 / 117 | 8 |
| specs | 16.7 / 17.6 / 82 | 2 | 16.7 / 17.6 / 51 | 2 |
| features | 16.7 / 33.6 / 600 | 8 | 16.7 / 17.6 / 67 | 3 |
| app | 16.7 / 17.6 / 83 | 3 | 16.7 / 17.6 / 34 | 0 |
| finishes | 16.7 / 17.5 / 34 | 0 | 16.7 / 17.7 / 51 | 1 |
| close | 16.7 / 17.5 / 18 | 0 | 16.7 / 17.5 / 67 | 1 |

**Mobile 375×812 @3×, CPU throttle 4× — second pass (warm)**, 2 + 2 runs pooled

| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |
| --- | --- | --- | --- | --- |
| hero | 16.7 / 17.6 / 116 | 6 | 16.7 / 66.5 / 400 | 26 |
| why | 16.7 / 33.5 / 183 | 9 | 16.7 / 33.8 / 84 | 10 |
| sleep | 16.7 / 17.6 / 150 | 2 | 16.7 / 17.7 / 483 | 12 |
| activity | 16.7 / 17.6 / 134 | 7 | 16.7 / 17.5 / 33 | 0 |
| insight | 16.7 / 17.6 / 33 | 0 | 16.7 / 17.5 / 33 | 0 |
| details | 16.7 / 17.5 / 34 | 0 | 16.7 / 17.6 / 101 | 8 |
| specs | 16.7 / 17.6 / 50 | 1 | 16.7 / 17.6 / 67 | 1 |
| features | 16.7 / 17.7 / 68 | 3 | 16.7 / 17.6 / 67 | 3 |
| app | 16.7 / 17.6 / 118 | 3 | 16.7 / 17.7 / 100 | 5 |
| finishes | 16.7 / 49.2 / 183 | 4 | 16.7 / 17.7 / 149 | 1 |
| close | 16.7 / 17.6 / 51 | 1 | 16.7 / 33.4 / 234 | 10 |

before desktop: images 0.48 MB / 10 files, all transfers 3.00 MB, heap 21.2 → 22.4 MB; images 0.48 MB / 10 files, all transfers 3.00 MB, heap 21.2 → 22.4 MB

before mobile: images 0.23 MB / 10 files, all transfers 2.75 MB, heap 21.3 → 22.4 MB; images 0.23 MB / 10 files, all transfers 2.75 MB, heap 21.3 → 22.4 MB

after desktop: images 0.48 MB / 10 files, all transfers 1.75 MB, heap 20.6 → 21.8 MB; images 0.48 MB / 10 files, all transfers 1.75 MB, heap 20.7 → 21.8 MB

after mobile: images 0.23 MB / 10 files, all transfers 1.50 MB, heap 20.6 → 21.8 MB; images 0.23 MB / 10 files, all transfers 1.50 MB, heap 20.8 → 21.8 MB

Reading the tables: the two builds are alike. Frames over 50 ms come in bursts at a different place in each run, in both builds, more in the runs made while the Mac was busy (run 2 of each). To tell the page's own work from the machine's, the cold pass on the phone profile was traced (`tools/scrolltasks.mjs`): the after build had 15 frames over 50 ms in that run and **no main-thread task over 45 ms** in the whole pass, so those frames were waiting for the GPU or the compositor, not for script. One place is slow in both builds (`tools/repeat.mjs`): hero u ≈ 2.45, where the navbar theme changes and the whole document is restyled; it was there before and is not touched here.

First pointer movement in the hero, 5 s (`tools/hoverframes.mjs`):

| | Before | After |
| --- | --- | --- |
| No throttle: frames over 50 ms / longest | 0 / 34 ms | 0 / 34 ms |
| CPU 4×: frames over 50 ms / longest | 0 / 34 ms | 0 / 34 ms |

## Same look

`pixel-diff.txt`: 127 states (every state and every connection of all eleven sections, S01 at load and with hover tilt; desktop 1440 × 900 and phone 375 × 812 @2×), before against after, share of pixels that differ by more than 8 / 255. `pixel-diff-noise-floor.txt`: the baseline against itself (reflections in S01 move with time).

Worst state: S01 at load on desktop, 0.019 % of the pixels (largest difference 17 / 255; the baseline against itself gives 0.005 % there). 108 of the 127 states have no pixel over the threshold at all, and no state outside S01 is above 0.004 %.

Pairs of the main state of each section in `same-look/` (`*-before.jpg`, `*-after.jpg`).

## Left over, and what only a real device shows

- **Margin on a slow test machine.** What is left of the blocking time is waiting for the GPU: the first use of a shader program asks the GPU questions that wait until it has compiled and linked the program, and three.js does that inside its environment prefilter (PMREM) and the S01 blend, where it cannot be made asynchronous from outside. With a GPU that is nothing; in headless Chrome the "GPU" is software on the same CPU, the wait is real time, and Lighthouse multiplies it by four. On a quiet Mac those waits are 10 – 40 ms; with the machine 40 % slower they grew to 60 – 190 ms and mobile fell to 78 – 90. PageSpeed Insights runs on Google's servers, whose speed is not ours to choose, so the staging and production numbers may sit below the local ones.
- **What would close that gap for good: brief option 7**, starting WebGL only after the page has loaded and settled (or at the first interaction), with the poster in front until then. The poster is already there and already cross-fades to the identical 3D frame, so the picture would not change, but the moment of the cross-fade and of the first hover tilt would, which is why it is the PM's decision. Not built.
- The hover-tilt frame and every scroll state are checked on Chrome with the Mac's GPU. Only a real device shows: frame times and memory on a mid-range Android phone and an iPhone; Safari (no `requestIdleCallback`: the prewarm and the strip uploads run on 60 ms timers there; module workers need Safari 15, older ones fall back to the main thread); the strip upload of the S06 table textures on other GPUs (Chrome and Firefox take it, Safari versions that give three.js no ImageBitmap take the single upload).
- A window that is fully covered by another, or a background tab, draws no frames: the ring comes up there a few seconds later than before (`tools/occluded.mjs`, `tools/bgtab.mjs`), in time for the moment it is seen.
- Not done, because not needed for the score: splitting three.js further (≈ 97 KB of `stage.js` is unused at load), inlining the critical CSS, and the restyle of the whole document when the navbar theme changes (hero u ≈ 2.45, see above).

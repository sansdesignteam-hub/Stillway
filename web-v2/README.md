# Stillway Home — Version 2 build

V2 of the Stillway Home page (D-059): an update of V1 following `context/Visual Directions V2/`
(`visual-direction-v2.md`, `Moodboard.md`, `Storyboard.md`) and the Figma file “Website AI - 1 Ring”.
Concept project for the Sans Brothers portfolio, not a real product. `noindex`.

- **V1** lives in `../web/` (stillway-one.vercel.app) and is **frozen**. Nothing here imports from it;
  modules and assets were copied.
- **Status:** all 11 sections built (S01–S11, D-061…D-099). Visual source: `design/v2/HANDOFF-v2.md` (branch Visual-Director);
  copy source: `context/home-copy-v2.md` (branch Strategic-Content, D-066); ring:
  `design/3d/v2/HANDOFF-v2-ring.md` (branch 3D-Designer).
- Deploy: Vercel project `stillway-v2`, root directory `web-v2`, after the user reviews S01–S03 (D-070).

## Run

```bash
cd web-v2
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in web-v2/dist
npm run preview
```

Stack (same as V1): Astro 7.4.5 (static), GSAP 3.15 (ticker only), Lenis 1.3.27, three 0.187,
Geist + Geist Mono (Fontsource variable 5.3.0).

## How the page works (D-063)

One **fixed stage** holds everything you see; the page underneath is a row of empty **tracks**
(`#hero`, `#why`, … `#close`) that only give scroll length and anchors.

```
stage (position: fixed)
├─ bg layer          section colour, cross-faded in each connection (+ dusk overlay)
├─ scene back  z1    giant words, Dawn glow          ← behind the ring
├─ WebGL canvas z2   the one ring
├─ scene front z3    headlines, numbers, links       ← in front of the ring
└─ rail        z4    progress line with the ochre dot (hidden < 720 px)
```

Real ScrollTrigger pins would put each section in its own stacking context, so the ring could
not sit between a section's back text and its front text. Instead every section is "pinned" by
living on the stage, and `src/scripts/story.ts` drives it from the scroll position:

- Each section has a local position `u` in viewport heights: `[-tin, 0)` incoming connection
  (Storyboard §3: 0–30% out, 30–70% middle, 70–100% in + clock), `0 … states-1` its states,
  then a short hold. Lengths live in `src/content/sections.ts`.
- A section module (`src/scripts/sections/*.ts`) writes its own DOM from `u` (`update`) and returns
  the ring pose for `u` (`ring`). Across a connection the ring is interpolated from the previous
  section's last pose to the next section's first pose (or a custom `ringIn`).
- Clock and daypart label (`Last night` in S03, `Tomorrow` in S11) switch at 70% of a connection;
  navbar ink follows the background; the rail dot follows progress inside the section.
- Mobile (< 720 px, D-069): same model, still pinned and scrubbed, ring stays 3D; layouts differ.
- Reduced motion: no Lenis, `u` snaps to whole states, no transforms, every change is a 300 ms
  opacity fade (`html.reduced [data-a]`), no breathing loop.
- Without JS: `<noscript>` styles stack the scenes as normal sections.

## S01 Hero (D-080)

V1 hero look (moss photo, STILLWAY wordmark, tagline / features / $299, statement, scroll line; copied
from `web/`, which stays untouched) with the V2 ring. Scroll: text slides out → ring zooms in turning
until the sensors and the green light show, while the photo zooms OUT (Oryzo pattern) → ring zooms out
to the S02 start pose while the photo fades to Paper. The ring follows the mouse in state 1 (fine pointer
≥ 720 px). Ring env: V1 hero photo (desaturated) in S01, paper studio from the fade on.

- Background: `public/hero/*.webp` (Visual Director outpaint, 72973fa); settings in `src/content/heroBg.ts`
  (the original photo rect covers the viewport like V1 at scale 1; zoom out to 0.55 desktop / 0.5 mobile).
- Motion and poses: `src/scripts/sections/hero.ts`; scene: `src/components/scenes/Hero.astro`.
- Review shots + transition sequence/video: `docs/screens/s01-d080/`.

## S06 Product details · S07 Specs & benefits (D-093)

- **S06** (`sections/details.ts`, `scenes/Details.astro`): the ring rolls in on a Sand plinth (roll angle =
  distance / radius, overshoot and rock back, s06-pose.json), turns side-on (state 2) and to the edge at 45°
  (state 3); in state 4 the plinth leaves, the cut-out hand A-1 comes in on the right, the 3D ring slides down
  the index finger (depth-only finger proxy in `ring/stage.ts`, `Pose.fing`) and hands over to the ring in
  A-1b (masked to the ring area). Contact shadow is CSS on the plinth. New pose field `pitch` (tip toward the
  viewer). 05 → 06: Dusk → Paper is a light wipe (`.stage__wipe`: paper, sand, ochre edge), no grey band.
- **S07** (`sections/specs.ts`, `scenes/Specs.astro`): Obsidian Assembly layout in Geist — split
  "Through / the day.", four cards rise between the words, then one card in focus per viewport with (I)–(IV)
  on a line, counter + progress circle, orbit lines, and a white panel with the one control (battery by day,
  labelled Simulated data; size 6–13; weight / thickness; water rating). State 5: the card shrinks while
  A-3 opens to full bleed; 07 → 08 darkens it to Night. No 3D ring in S07.
- Review shots: `docs/screens/s06-s07-d093/`.

## S08 Features · S09 The app (D-096)

- **S08** (`sections/features.ts`, `scenes/Features.astro`): Shift composition (title top left, counter chip
  and a small block bottom left) with the client LED reference: window A lit through `Pose.led / ledc /
  flare` (`ring/stage.ts`: LED tokens green → blue → violet, an additive flare sprite and a coloured point
  light that bounces on the inner band). Colour by scroll only; the legend is labels. Reduced motion: the
  polished Night still (no lit window).
- **S09** (`sections/app.ts`, `scenes/App.astro`): Sofi layout — the phone stays in the middle on Paper, its
  HTML screen scrolls one page per state (Heart rate → Sleep → Recovery), texts top left and bottom
  right, footer with label, Scroll down, progress and percent. No score (D-066); numbers simulated.
- 07 → 08: the S07 photo now sits on the back layer so the ring can appear over it. 08 → 09: violet dims, a
  brief green, the ring leaves upward, Night → Paper as the light wipe (plain Sand edge).
- Review shots: `docs/screens/s08-s09-d096/`.

## S10 Finishes & pricing · S11 Closing (D-098, D-099)

- **S10** (`sections/finishes.ts`, `scenes/Finishes.astro`): Mirelz viewer (drag / swipe turns the ring
  360°, ‹ › jump 90°, eases back after ~3 s) + Shift PDP panel. Swatches change the real material
  (`ring/stage.ts` FIN = finishes.json `*_polished`: Silver, Black with clearcoat, Gold option B) through
  `Pose.custom / finA / finB / finT`; Daylight / Lamp light swaps to `v2-env-lamp.exr` (`Pose.lamp`) and
  warms the panel. The choice lives in `scripts/finish.ts` and carries into S11. Button → inline note
  (`role="status"`), no cart. Reduced motion: the polished still of the chosen finish.
- **S11** (`sections/close.ts`, `scenes/Close.astro`): one dark canvas — the closing line across the ring
  under the Ember glow, the button, the FAQ column (one open at a time), the caps statement, footer and
  the full-width wordmark with the hover shine. Past state 2 the canvas moves like a page (measured).
  10 → 11: Night rises from below with an Ember edge (`.stage__wipe[data-tone=rise]`).
- 09 → 10: the phone's screen fades, the phone slides right and widens as the panel comes in.
- Review shots: `docs/screens/s10-s11-d098/`.

## Navbar (D-075)

Logo = the word "Stillway" only, no ring mark (D-083). No scroll rail anywhere (D-083).
V1 style copied from `web/` (wordmark · round home tile · one translucent rounded bar with dividers ·
clock · compact arrow button; phone: burger + sensiq-style panel, D-053) with V2 content: lockup, links
Rhythm / The ring / The app / Finishes / FAQ, Geist Mono clock, "Find your size" (D-069).
Files: `src/components/Header.astro`, `src/components/Button.astro`, `src/styles/nav.css`, menu logic in
`src/scripts/motion.ts`.

## Ring

- Model: `src/scripts/ring/model.ts` is the only place that names the GLB, env maps, material
  patterns and LED mesh names. Now: V2 stage 2 from the 3D Designer (feaa83d): brushed silver GLB
  (147 KB), `public/env/v2-env-{paper,night}.exr`. Black/Gold (finishes.json) wait for S10.
- Stage: `src/scripts/ring/stage.ts` — one renderer, all light from the env (paper for S01–S02, night
  for S03), swapped at `pose.light = 0.5` with an intensity dip. `setLed()` drives `led_main` / `led_power`.
- Poses: `src/scripts/ring/poses.ts` — `Pose {x, y, w, rx, ry, rz, spin, roll, light, alpha}`.
  `ANGLE.threeQuarter` matches the engraving reference: opening left, band right, "Stillway" reading
  bottom → top (D-075).
- Finish: polished silver (finishes.json `silver_polished`) in every section (D-085); envs
  `v2-env-paper-polished.exr` / `v2-env-night-polished.exr`; S01 uses the V1 hero photo env. Photo → paper
  is blended through 9 prebuilt PMREM steps (no pop), exposure 1.15 → 1.0 continuous (D-083).
- Stills: `public/ring-fallback/fb-s0*-polished*.webp` (3D Designer 16cfbaf) show while WebGL loads, if it
  fails, and always for reduced motion (no WebGL then). No brushed stills (D-083/D-085).
- The ring canvas fades in (0.9 s) only after GLB, finish and S01 env are ready.
- Dev only: `window.__ringOverride = { w: 0.9, spin: 0 }` in the console merges into the live pose.

## Structure

```
web-v2/
├─ public/{models,draco,favicon.svg}
├─ docs/screens/                 review screenshots 1440 / 390 per state
└─ src/
   ├─ content/sections.ts        11 sections: id, time, daypart, background, states, lengths
   ├─ content/copy.ts            on-page copy (from home-copy-v2.md, with status)
   ├─ layouts/Base.astro         fonts, html.js / .reduced flags, noscript fallback
   ├─ pages/index.astro          Header + Stage(scenes) + tracks
   ├─ components/Header.astro    lockup, links, clock, "Find your size" (D-069), mobile menu
   ├─ components/Stage.astro     fixed stage layers + rail
   ├─ components/scenes/         Hero, Why, Sleep, Placeholder
   ├─ scripts/motion.ts          Lenis, ring loading, anchors, menu
   ├─ scripts/story.ts           scroll engine (see above)
   ├─ scripts/anim.ts            seg / window4 / put helpers
   ├─ scripts/sections/          hero.ts, why.ts, sleep.ts, placeholder.ts
   ├─ scripts/ring/              model.ts, stage.ts, poses.ts, index.ts
   └─ styles/{tokens.css,global.css}
```

## Typography (D-082) — rule for every section

All V2 text follows the weights and style of S01 (Hero V1). Geist + Geist Mono only. **No Light (300)
or thinner weights anywhere.** Tokens in `src/styles/tokens.css`:

| Role | Token | Weight | Tracking | Used for |
|---|---|---|---|---|
| Display | `--w-display` | 500 | 0 (wordmark) / `--track-display` −0.02em | STILLWAY wordmark, giant words ("rhythm", "keeps the pattern.") |
| Heading | `--w-heading` | 450 | `--track-tight` −0.03em | S01 statement, section headlines, big sentences (`.t-display`), big numbers (23:10, 7h 12m) |
| Body | `--w-body` | 400 | normal | paragraphs, tagline, feature list, data rows |
| Label | `--w-label` | 500 | `--track-label` 0.06em (sans caps) / `--track-mono` 0.08em (mono) | nav, CTA, scroll line (`.t-label`), mono tags and clock (`.t-mono`, `.t-tag`) |

Sizes stay on the existing scale (`--fs-*`); S01 statement is the reference size for headlines
(clamp(22px, 2.3vw, 34px)), larger statements may scale up but keep `--w-heading`.

## Tokens (Moodboard §2, HANDOFF-v2 §1)

Five colours only: `--paper #F7F5F0`, `--sand #EFE6DB`, `--ink #231F20`, `--night #17120F`,
`--ochre #B76F20`; derivatives `--stone`, `--line`, `--dawn-glow`, `--ember-glow`, `--dusk`.
LED colours are product light only. Type scale `--fs-giant/display/number/h3/body/small/mono` and
layout `--margin/--header-h/--radius-*` follow HANDOFF-v2 §1.2–1.3 ([U] values, kept in tokens.css).

## Open items

- Silver looks flat on Paper under the placeholder studio environment; waiting for the V2 HDRI (3D stage 2).
- Logo SVG for the navbar lockup is still a drawn placeholder (HANDOFF-v2 §1.4).
- Navbar link list (5 links + CTA) follows home-copy-v2 (draft); HANDOFF-v2 §1.5 proposed 3 links
  and no CTA — D-069 approved the CTA.

# Stillway Home — Version 2 build

V2 of the Stillway Home page (D-059): an update of V1 following `context/Visual Directions V2/`
(`visual-direction-v2.md`, `Moodboard.md`, `Storyboard.md`) and the Figma file “Website AI - 1 Ring”.
Concept project for the Sans Brothers portfolio, not a real product. `noindex`.

- **V1** lives in `../web/` (stillway-one.vercel.app) and is **frozen**. Nothing here imports from it;
  modules and assets were copied.
- **Status:** S01 Hero, S02 Why Stillway, S03 Sleep summary built (awaiting user review, D-070).
  S04–S11 are dashed placeholders. Visual source: `design/v2/HANDOFF-v2.md` (branch Visual-Director);
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

## Navbar (D-075)

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
- Stills: `public/ring-fallback/*.webp` (3D Designer fallback/) show while WebGL loads, if it fails,
  and always for reduced motion (no WebGL then).
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

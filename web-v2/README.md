# Stillway Home — Version 2 build

V2 of the Stillway Home page (D-059): an update of V1 following `context/Visual Directions V2/`
(`visual-direction-v2.md`, `Moodboard.md`, `Storyboard.md`) and the Figma file “Website AI - 1 Ring”.
Concept project for the Sans Brothers portfolio, not a real product. `noindex`.

- **V1** lives in `../web/` (stillway-one.vercel.app) and is **frozen**. Nothing here imports from it;
  modules and assets were copied.
- **Status: scaffold only.** Tokens, motion foundation, ring stage, navbar + clock and 11 empty
  sections. Section content waits for the Visual Director's `design/v2/HANDOFF-v2.md` and the
  Strategy Director's V2 copy.

## Run

```bash
cd web-v2
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in web-v2/dist
npm run preview
```

Dev check for the ring: `/dev/ring?light=day|night&led=heartRate|sleep|recovery|off`.

Stack (same as V1): Astro 7.4.5 (static), GSAP 3.15 + ScrollTrigger, Lenis 1.3.27, three 0.187,
Geist + Geist Mono (Fontsource variable 5.3.0).

## Structure

```
web-v2/
├─ astro.config.mjs          static output; fs.allow '..' so masters can be read from ../design
├─ public/
│  ├─ models/stillway-ring-silver_web.glb   copied from V1 (= design/3d/ring/…_web.glb)
│  ├─ draco/                 Draco decoder (copied from V1)
│  ├─ env/                   hero-env.jpg (day), env-night.jpg (night) environment maps
│  └─ favicon.svg            ring mark placeholder
└─ src/
   ├─ content/sections.ts    the 11 sections: id, time, background, theme, states; nav + dayparts
   ├─ layouts/Base.astro     fonts, tokens, html.js / .reduced / .motion-ready flags
   ├─ pages/index.astro      Header + 11 <Section>s
   ├─ pages/dev/ring.astro   dev check for the ring stage (not linked from Home)
   ├─ components/
   │  ├─ Header.astro        lockup, links, time-of-day clock, CTA; ink follows the section theme
   │  ├─ Logo.astro          ring mark + “Stillway” (placeholder drawing until the final mark)
   │  └─ Section.astro       empty section shell with a dashed placeholder label
   ├─ scripts/
   │  ├─ motion.ts           Lenis + ScrollTrigger, reduced motion, registerSection() registry
   │  ├─ clock.ts            navbar clock + navbar theme
   │  └─ ring/
   │     ├─ index.ts         loadRing(): lazy import, three.js is its own chunk
   │     ├─ stage.ts         createRingStage(): renderer, env, GLB+Draco, pose, LED, render loop
   │     └─ poses.ts         V1 poses, day/night lighting presets, LED colours
   └─ styles/
      ├─ tokens.css          Moodboard §2–3: 5 colours, derivatives, LED colours, type, layout
      └─ global.css          base, type roles (.t-display/.t-h1/.t-h2/.t-mono/.t-tag), surfaces
```

## Sections and the clock

Ids are the anchors and the `data-section` keys (`src/content/sections.ts`, from Storyboard §1).

| # | id | Name | Clock | Background | Navbar |
|---|---|---|---|---|---|
| 01 | `hero` | Hero | 06:50 | Paper + Dawn glow | light |
| 02 | `why` | Why Stillway | 07:10 | Paper | light |
| 03 | `sleep` | Sleep summary | 23:10 | Night | dark |
| 04 | `activity` | Activity & rest | 07:40 → 15:30 | Night | dark |
| 05 | `insight` | Daily insight | 17:30 | Dusk | dark |
| 06 | `details` | Product details | 21:00 | Paper + Sand base | light |
| 07 | `specs` | Specs & benefits | 21:00 | Sand → full-bleed photo | light |
| 08 | `features` | Features | 21:00 | Night | dark |
| 09 | `app` | The app | 21:00 | Paper | light |
| 10 | `finishes` | Finishes & pricing | 22:00 | Sand | light |
| 11 | `close` | Closing, FAQ & footer | 06:50 | Night + Ember glow | dark |

The clock reads the section at the middle of the viewport. Inside a section it moves from
`data-time` to `data-time-end` (only Activity has one); between sections it jumps, so
23:10 → 07:40 reads as a flashback, not as eight hours of scroll. Steps of 5 minutes.

## Tokens (Moodboard §2)

Five colours only: `--paper #F7F5F0`, `--sand #EFE6DB`, `--ink #231F20`, `--night #17120F`,
`--ochre #B76F20`. Derivatives: `--stone` (ink 65%), `--line` (ink 12%), `--dawn-glow`,
`--ember-glow`, `--dusk`. `.surface--night` / `.surface--dusk` flip `--stone`/`--line` to paper.
LED colours (`--led-*`) are product light: ring render and small legend/chip dots only.
Ochre: one element per view, never a full background, never the primary button.

## Motion

- `initMotion()` starts Lenis on the GSAP ticker and keeps ScrollTrigger in sync.
- Add a section's motion with `registerSection('<id>', ({ el, reduced, lenis }) => { … return cleanup })`
  before `initMotion()`; it runs inside `gsap.matchMedia()` so it is reverted cleanly.
- Reduced motion: `html.reduced`, no Lenis, no pinning, no loops. Mark state content with
  `data-reveal`; it fades in over `--fade-reduced` (300 ms) when it enters the viewport.

## Ring stage

```ts
const { createRingStage, POSES, LED } = await loadRing();
const stage = await createRingStage({ canvas, container, lighting: 'night' });
if (stage) {
  stage.setPose(POSES.front);
  stage.setLed(LED.sleep, 3);
  stage.onFrame((t) => stage.place({ x: 0, y: 0, width: 420 })); // px from the container centre, y up
}
```

Returns `null` without WebGL or if the model fails: keep a poster image as fallback.
Each stage clones the model and its materials, so LED colour/finish are per stage.

## Open items (developer side)

- One WebGL stage per section vs. one fixed canvas shared by the whole page (the storyboard keeps
  the same ring across 01→02→03 and 05→06). Decide after HANDOFF-v2.md.
- Finishes Black/Gold (Section 10) need GLBs or material specs from the 3D Designer.
- Mobile menu, logo final mark, navbar labels and CTA copy are placeholders.
- Vercel: second project, name and deploy timing not decided (D-059).

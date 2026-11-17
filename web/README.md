# Stillway Home — Version 1 build

Home/landing page for the Stillway concept (Version 1, Direction A “One Day, in Light”).
Concept project for the Sans Brothers portfolio — not a real product. Local only (D-025), `noindex`.

## Run

```bash
cd web
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in web/dist
npm run preview
```

Stack: Astro 7.4.5 (static), GSAP 3.15 + ScrollTrigger, Lenis 1.3.27, Geist (Fontsource 5.3.0).
No three.js since the D-037 revision. Page JS ≈ 52 KB gzipped.

## Where things live

| What | Where |
| --- | --- |
| All on-page copy, with `status` per block | `src/content/home.ts` |
| Tokens + all styles | `src/styles/global.css` |
| Sections | `src/components/*.astro` |
| Motion (Lenis, scroll clock, hero landing, strip, plates) | `src/scripts/motion.ts` |
| Image masters (read directly, not copied) | `../design/assets/v1/home`, `../design/assets/v1/home/user`, `../design/assets/v1/masters`, `../design/ring-master` |

## Header and buttons (D-038)

- Header: wordmark, round home button, one full-rounded bar (links with dividers, scroll clock, CTA), translucent with `backdrop-filter: blur`. The bar tint follows the chapter underneath (photo / light / dark).
- Buttons: `src/components/Button.astro` is the only button. Label + round arrow; on hover the circle grows from the arrow to fill the button and a second arrow slides in. Variants `ink` and `paper`, plus `compact` for the header.

## The page as one day

The header clock follows the scroll: 06:40 at the hero, 23:00 at the close.

| Time | Section | Interaction |
| --- | --- | --- |
| 06:40 | Hero (ayocin pattern) | Load: wordmark letters rise, ring fades in and hovers. Scroll (pinned): the ring lands on the stone, the light rises, the wordmark lifts away, the offer and CTA appear |
| 07:00 → 07:20 | Rhythm: Last night + Patterns, not scores (A-02, P-01) | Copy sticky on the left, photographs scroll on the right; the copy crossfades to match the photograph in view. |
| 07:40→15:30 | Activity and rest (oryzo pattern) | Pinned: a strip of five moments slides through a dashed centre frame; the centred moment grows, its time/state/minutes update on the left |
| 17:30 | One line a day (ring-master/03 + glass card) | Ring settles as you scroll; the card rises and the day dial fills to 17:30 |
| 18:30 | Made to be forgotten (A-08, A-03, A-09) | Pinned: each step wipes in its own plate from below |
| 19:00 → 19:30 | Three finishes, one price: A-10 as the field, one order card over it (ayocin pattern) | The photograph drifts; the card rises in; Silver/Black/Gold × Daylight/Lamp light swap the studio masters on the card's stage |
| 21:00 | FAQ | One-open accordion |
| 23:00 | Put the day to rest (ring cutout in moonlight) | Ring drifts and turns with scroll |

Reduced motion: no Lenis, no pinning; the hero shows the landed ring with the offer, the strip becomes a horizontal list.

## Asset log

| File | Used in |
| --- | --- |
| user/H-01-hero-bg, user/H-02-ring-cutout | Hero; the cutout also closes the page (moonlight filter) |
| A-02 sleep | Last night |
| P-01 silver daylight | Context tile; activity strip |
| A-01 hero desktop / mobile, A-06a, A-05 | Activity strip |
| A-08, A-03, A-09 | Made to be forgotten |
| A-10 ring shadow | Evening plate (static image, per D-030) |
| A-11 package flatlay | In the box |
| ring-master/04, masters/R-black, R-gold | Finish picker (same angle; R-kit not used) |

Not used: A-07 (ring about 2× too large next to the phone), `nature-test/*`, `_archive/*`, `E-03`.
The Lamp-light view is a CSS treatment of the studio masters, not a separate photograph.

## Open items

- Copy marked `draft` in `home.ts` needs Strategy Director review; only hero lines come from `home-copy.md`.
- Activity strip states and minutes are simulated and labelled as such.
- Proposed tokens outside the approved palette: Lamp, Umber, Night-deep, Stone, Lamp-glow.
- The ring cutout is 496 px wide; a larger export would look sharper on retina screens.
- Inspector notes accepted for now: reference-driven rules/dashed frame/uppercase labels (D-037),
  cream fields (brand palette), no video, the strip heading stays for the whole strip,
  one phone blank-gap reading in the FAQ/close area that screenshots do not show.

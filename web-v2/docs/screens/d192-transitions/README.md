# D-192 — transitions S06→S07 and S09→S10, phone spacing

Brief: `design/v2/BRIEF-dev-transitions-s06-s09-spacing.md`. Before = `a21657a` (D-191 final).

## What changed

1. **S06 → S07 (desktop and phones).** The connection keeps its length (1.6 screens), so no track or timing outside it moves. 0–62 %: the hand with the ring goes down (50 % of the screen height), the heading and body go up (18 %), both fading (gone at 60 %). 61–91 %: "Through the day." fades in (the 20 px rise it had is gone). The ring canvas (ring, finger proxy, contact shadow) gets the same translate and opacity as the photo (new pose field `drop`, a CSS transform), so it cannot slide on the finger. Reduced motion: a fade only, as before.
2. **S09 → S10 (desktop).** 0–58 %: the phone goes down (50 % of the height), the left text goes left and the right text right (18 % of the width), fading (gone at 55 %). 55–95 %: S10 fades in where it stands. To make it a fade, the panel's slide-in from the right and the ring's 0.85 → 1 scale-in were removed on this connection. Phones keep the plain scroll (D-172). S10 → S11 untouched.
3. **S06 phones.** Heading + body are centred between `--content-top` and 16 px above the fingertip.
4. **Phones, navbar clearance.** One token, `--nav-clearance-mobile` (32 px; 16 px on phones up to 660 px tall, as before), feeds `--content-top`. S09, S08 and S10, which had their own values, now use `--content-top`; the S09 phone moves down with its text. Desktop is not affected (the token exists only under 719 px).

Not changed on purpose: the S01 wordmark (hero limit); S02's top sentences (already 40 px); the S07 card deck, the S05 card and the S11 footer (centred or scrolled content, not a heading under the bar).

Existing before this change and not touched: on 360 × 640 the S09 phone covers the second line of the top text.

## Screens

- `s06-s07-desktop.jpg`, `s06-s07-mobile.jpg`, `s09-s10-desktop.jpg`: start → end
- `s06-mobile-before-after.jpg`: top row before, bottom row after (375×812, 390×844, 430×932, 375×667, 360×640)
- `nav-clearance-375-before-after.jpg`, `nav-clearance-360-before-after.jpg`: pairs per section (375×812, 360×640)

## Lighthouse 13.6.0

`npm run build` + `npm run preview`, `--headless=new`, median of 3, same Mac, same session. Single runs: `lighthouse-runs.json`.

| | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | --- | --- | --- | --- |
| Performance | 97 (97/95/98) | 97 (91/98/97) | 100 (100/100/100) | 100 (100/100/100) |
| Accessibility / Best practices | 95 / 100 | 95 / 100 | 100 / 100 | 100 / 100 |
| FCP | 1.21 s | 1.21 s | 0.29 s | 0.29 s |
| LCP | 2.31 s | 2.38 s | 0.29 s | 0.29 s |
| TBT | 88 ms | 93 ms | 43 ms | 3 ms |
| CLS | 0.004 | 0.004 | 0.014 | 0.014 |
| Speed Index | 1.47 s | 1.44 s | 0.41 s | 0.40 s |

## Frame times

Chrome with the GPU, scroll 8 px per frame through each connection, down and up, two passes pooled (`tools/frames.mjs`). Desktop 1440×900 @2×; phone 375×812 @3× with 4× CPU throttle. Each cell: p95 / max in ms, frames over 50 ms. Raw: `frames-*.json`.

| | Before | After, run 1 | After, run 2 |
| --- | --- | --- | --- |
| Desktop 06→07 down | 17.4 / 50, 0 | 17.4 / 17.6, 0 | 17.5 / 17.8, 0 |
| Desktop 06→07 up | 17.5 / 17.8, 0 | 17.4 / 17.6, 0 | 17.5 / 50.8, 1 |
| Desktop 09→10 down | 17.4 / 17.7, 0 | 17.3 / 17.7, 0 | 17.4 / 32.8, 0 |
| Desktop 09→10 up | 17.3 / 20.3, 0 | 17.3 / 17.7, 0 | 17.4 / 17.7, 0 |
| Phone 06→07 down | 17.5 / 84, 1 | 17.5 / 17.7, 0 | 17.5 / 17.8, 0 |
| Phone 06→07 up | 17.5 / 50.1, 1 | 17.5 / 17.7, 0 | 17.5 / 17.7, 0 |
| Phone 09→10 down (plain scroll) | 17.5 / 232, 1 | 17.5 / 17.7, 0 | 17.5 / 50, 0 |
| Phone 09→10 up (plain scroll) | 17.5 / 17.6, 0 | 17.6 / 17.7, 0 | 17.5 / 32.3, 0 |

The one 50.8 ms frame (run 2) did not come back in run 1; the Mac is shared with other agents (load average 4 – 8).

Checked on Chrome on this Mac only, not on a real iPhone or Android phone.

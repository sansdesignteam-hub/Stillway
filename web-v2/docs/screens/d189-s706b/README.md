# QA27 S7-06b — S07 card change after obsidianassembly.com "Objects" (D-189)

## What the reference does (recorded in Chrome with the GPU, 1440×900)

- `reference-scroll-72px-steps.jpg`: scrolling in 72 px steps. The deck does not follow the scroll: it rests, and about every 1,050 px of scroll the card changes in one timed move (≈ 0.9 s, ease-out).
- `reference-transition-frames.jpg`: that move, from a screencast (≈ 16 ms frames). At rest: the front card, two layers behind it stepping up (each ≈ 12.5 % smaller, top edge ≈ 78 px higher), and the NEXT card's foot ≈ 75 px below the front card. On a change the next card comes over the front card, small and low, and rises and grows into the front place; the old front card shrinks back and up into the first layer, the first layer into the second, the second leaves; a new "next" foot appears below. The deck goes round (two layers behind at 1/4 too, a foot below at 4/4). No darkening of the layers.

So the card that shows below is the next one, not the previous one going out (the brief read it the other way from the still); built as the reference moves.

## Ours

Same deck, same directions and sizes (layers 0.875 / 0.75, next card 0.875), but bound to the scroll as the brief asks (the reference's own move is timed, not scrubbed). `side-by-side-1440.jpg`: reference (top) and ours (bottom) at the same phases: rest, next card over the front, rising, growing, almost in place, rest.

- `ours-1653x979-rest-mid-next.jpg`, `ours-375x812.jpg` (phones: same deck, smaller steps; the old slide-out to the left is gone), `ours-1440-backward.jpg` (scrolling back: the same frames in reverse, it is a pure function of the scroll position), `ours-1440-reduced-motion.jpg` (whole states only).
- Kept: front card 3:4 at 68 % of the height, radius 10, its centre and the text layout, intro, photos, the end; nothing enters the navbar.

## Differences from the reference, and limits

- Steps behind are ≈ 51 px at 1440×900 (≈ 57 px at 1653×979), not ≈ 78 px: the front card keeps its place and nothing may enter the navbar, so two layers share the room above it. In the reference the far layer runs under its navbar.
- The next card is uncovered from its foot upward in the first 22 % of the move, where the reference puts it on top in one frame (a jump would show under a scrubbed scroll).
- The deck now goes round, so at 4/4 the foot below is card (I) again; the other cards fade just before the end (u 4.98–5.1), so (IV) Rinse still stands alone there.
- Right after a direct jump into S07 on the dev server the layers behind can be missing for a moment while their pictures load (pictures are fetched two sections ahead since G-19).
- Not checked on a physical phone.

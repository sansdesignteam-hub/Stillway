# QA27 D-01 — S06 ring on the finger: contact shadow + light matched to the hand photo (D-188)

Dev server, Chrome (Metal), 1440×900 @2× and 375×812 @3×. Frames: u = 5.2, 5.8, 6.2, 6.7, 7.4, 8.0, 8.4 (in the air → over the fingertip → sliding → seated → text → leaving with the hand).

- `compare-1440-before-after.jpg`, `compare-375-before-after.jpg`: close-up of the finger, before | after.
- `closeup-*-before/after.jpg`, `seated-*-before/after.jpg`: seated state (u 7.4).
- `frames-1440-before/after.jpg`, `frames-375-after.jpg`: enter → seated → leave.
- `slide-seat-leave-1440-after.jpg`: over the tip (no shadow), sliding (shadow travels with the band), seated, leaving.

What changed
- Contact shadow: drawn on the finger proxy in WebGL (stage.ts `fingerShade`), computed from the distance to the band's edges in the ring's own space: tight on the fingertip side, longer and softer toward the knuckle, a little denser on the left (key of A-1 is upper right). It moves with ring and hand, and there is none while the band is clear of the skin. The CSS ellipse `.det__seat` (it spilled onto the Paper right of the finger) is removed.
- Ring light: `pose.skin` (0 in the air → 1 seated): warm white balance, skin mirrored in the lower band and on the side facing the next finger, a soft key highlight from the upper right and a little less light away from it. Display-space patch like D-185/D-186; `silver_polished` material values untouched (D-085); every other section has `skin` 0 (S08 neutral, D-141).

Limits
- The shadow only falls on the index finger (the proxy); nothing on the neighbouring finger / web of the hand.
- Reduced motion / no WebGL still use the A-1b photo (unchanged).
- Judged by eye on a desktop display; not checked on a physical phone.

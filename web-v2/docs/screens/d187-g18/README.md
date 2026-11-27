# QA27 G-18 — ring GLB from 3D Designer 480bd74 (D-187)

`public/models/stillway-ring-v2-silver_web.glb` replaced by `design/3d/v2/stillway-ring-v2-silver_web.glb` at 480bd74 (150,944 → 133,228 B; rounded 0.04 mm lip on the engraved letters, smooth normals). No code change; the optional engrave roughness tweak was skipped. web-v2 does not load the separate polished GLB.

Left before, right after; dev server, Chrome (Metal), 1440×900 @2×, crops enlarged (nearest).
- `engrave-s03-state1-before-after.jpg`, `s03-state1-before-after.jpg`: S03 State 1 (23:10).
- `engrave-hero-before-after.jpg`, `hero-before-after.jpg`: S01.

Rest of the page (same shots before/after, share of pixel values changed by more than 24/255): S02 0.06–0.07 %, S03 states 2–3 0.01 %, S06 0.002 %, S08 0.10 %, S10 0.04 % — only the engraved letters.

Limit: at the grazing angle of S03 State 1 the letters are cleaner but a few thin bright slivers remain on the letter walls (the shading aliasing the 3D Designer's handoff notes as open). Not checked on a physical device.

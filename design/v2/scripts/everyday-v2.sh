#!/usr/bin/env bash
# S07 "The Everyday" background, remade (D-152). Brief: design/v2/BRIEF-vd-everyday.md (Project Manager checkout).
# Same moss-rock set as A-11 (N2-02, D-035); the sizing kit is replaced by real Stillway rings in the three
# polished finishes (Silver polished, Black, Gold 18K bright; D-061, D-085, D-100).
# Usage: ROUND=2 ./everyday-v2.sh [a|b|c|all] -> design/assets/v2/everyday/_work/raw2-<v>.png (1536x1024; ROUND=2 is the selected run)
# Then:  everyday-patch-b.py (B only), everyday-finish.py (upscale to 2880x1920 + grain) -> design/assets/v2/A-11b-everyday-<v>.png
set -euo pipefail
G="$(cd "$(dirname "$0")/../../assets/v1/scripts" && pwd)/genref.sh"
cd "$(dirname "$0")/../../.."
WD=design/assets/v2/everyday/_work; mkdir -p "$WD"
# References (copied into _work/refs so the run is reproducible from this branch):
#  SCENE        = design/assets/v1/home/A-11-package-flatlay.png (composition + light, already in this branch)
#  finishes.png = top row of 3D-Designer design/3d/v2/renders/polished-finishes/sheet-blender.png (Silver / Black / Gold polished, paper env)
#  logo.png     = 3D-Designer design/3d/v2/renders/v2-ring-logo-closeup.png (band geometry, inner sensors, engraving)
REF="$WD/refs"; SCENE=design/assets/v1/home/A-11-package-flatlay.png; FIN="$REF/finishes.png"; LOGO="$REF/logo.png"
ONLY="${1:-all}"; R2=""; [[ "${ROUND:-1}" == 2 ]] && R2=2; want(){ [[ "$ONLY" == all || "$ONLY" == "$1" ]]; }
run(){ [[ -f "$2" ]] && { echo "SKIP $2"; return; }; "$G" "$@" || echo "FAIL $2"; }

SET="Real editorial still-life photograph, not a render, not CGI. Same set, same light and same colour grade as the FIRST attached image: a large pale speckled granite boulder with a flat, slightly domed top, framed by dense low green moss and a few soft out-of-focus fern fronds in the near foreground at the bottom left, a warm cream plaster wall at the top right with soft blurred leaf shadows and a few out-of-focus leaves. Warm late-afternoon sunlight from the upper left, soft natural shadows falling to the lower right, gentle golden colour grade, medium exposure (not bright, no blown highlights), fine film grain. Camera about 45 degrees above the rock, full-frame, 50 mm lens, f/5.6, the whole rock top in focus, near foreground plants softly blurred. Horizontal 3:2, wider than the first image: the rock spans almost the full width of the frame."
# Round 2 (ROUND=2): round 1 produced a regular woven / fabric-like pattern on the granite, and an AI edit
# pass (PASS=fix) made it worse (stamp-like lichen). Round 2 regenerates from scratch with a smoother,
# weathered rock surface and shallower depth of field. Outputs _work/raw2-<v>.png.
if [[ "${ROUND:-1}" == 2 ]]; then
SET="Real editorial still-life photograph shot on a full-frame camera, not a render, not CGI, not an illustration. Same set, same light and same colour grade as the FIRST attached image: a large pale weathered granite boulder with a flat, slightly domed top, framed by dense low green moss and a few soft out-of-focus fern fronds in the near foreground at the bottom left, a warm cream plaster wall at the top right with soft blurred leaf shadows and a few out-of-focus leaves. The rock surface is smooth and worn by weather: soft creamy-beige stone with subtle natural mottling, a few faint rust-orange stains and sparse fine dark mineral flecks, gentle uneven tonal variation, smooth to the touch; photographed texture, organic and irregular, never a repeating grid, mesh, knit or fabric pattern, no coarse uniform speckle. Warm late-afternoon sunlight from the upper left, soft natural shadows falling to the lower right, gentle golden colour grade, medium exposure (not bright, no blown highlights), subtle natural film grain. Camera about 40 degrees above the rock, 85 mm lens, f/4: the objects and the rock around them are sharp, the far edge of the rock and the wall fall gently out of focus, near foreground plants strongly blurred. Horizontal 3:2, wider than the first image: the rock spans almost the full width of the frame."
fi
DOCK="A round matte warm-cream charging dock (low cylinder with a shallow cup on top and two tiny gold pogo pins) with a thin white USB-C cable that loops loosely in two soft coils on the rock, exactly like the first image."
RINGS="The rings are real Stillway smart rings, the exact same design as the SECOND and THIRD attached images: a flat wide band about 8 mm wide with softly rounded chamfered edges, a high-gloss POLISHED mirror outer surface, a matte black inside with two small square sensor windows and two tiny dots, and the word Stillway engraved small and tone-on-tone on the outer side, running along the band (vertical text on an upright ring, like the references). Finishes, matching the SECOND image left to right: (1) bright polished silver, mirror-like, reflecting the warm sky and moss; (2) glossy deep black with crisp white highlights; (3) bright polished 18K yellow gold, warm and clean (not bronze, not brown, not rose). All rings are the same size and the same model; they differ only in colour. Realistic metal reflections of the rock, moss and warm light, true small scale relative to the dock (ring outer diameter about 70% of the dock diameter), soft contact shadows on the stone. Each Stillway engraving must be clean and correctly spelled, or turned away from the camera; never garbled letters."
QUIET="Layout for a website background: white headline text 'The Everyday' and a small photo card will be overlaid later in the CENTRE of the frame, so keep the central band of the rock (roughly from 25% to 75% of the width and from 30% to 70% of the height) as calm, empty stone with no objects and no cable crossing it. Place the objects around that calm centre, near the edges of the rock top."
AVOID="No sizing kit, no tray, no row of grey sample rings, no packaging, no box, no phone, no hands, no extra jewellery, no glowing sensor lights, no text other than the small Stillway engravings, no logos, no watermark, no frame, no vignette, no HDR, no oversaturation."

if [[ "${PASS:-}" != fix ]] && want a; then
run "$SET $DOCK $RINGS Arrangement A (natural trio): the dock and its coiled cable sit at the upper LEFT of the rock top, and the GOLD ring rests seated in the dock cup, tilted slightly. The SILVER ring stands upright on its edge at the lower LEFT of the rock, three-quarter view with its Stillway engraving toward the camera. The BLACK ring lies flat on the rock at the lower RIGHT, slightly turned, its glossy top edge catching the sun. Objects are casually placed, not lined up like a catalogue. $QUIET $AVOID" "$WD/raw${R2:-}-a.png" --size 1536x1024 --ref "$SCENE" --ref "$FIN" --ref "$LOGO" &
fi
if [[ "${PASS:-}" != fix ]] && want b; then
run "$SET $DOCK $RINGS Arrangement B (two upright, one lying): the dock sits at the upper LEFT of the rock top with the cable looping up toward the top edge; the dock cup is empty. At the lower RIGHT of the rock the SILVER ring stands upright on its edge and the GOLD ring leans lightly against it, both in three-quarter view, Stillway engravings toward the camera. The BLACK ring lies flat near the lower LEFT edge of the rock, slightly turned. Casual, natural placement, not a catalogue row. $QUIET $AVOID" "$WD/raw${R2:-}-b.png" --size 1536x1024 --ref "$SCENE" --ref "$FIN" --ref "$LOGO" &
fi
if [[ "${PASS:-}" != fix ]] && want c; then
run "$SET $DOCK $RINGS Arrangement C (spread on a diagonal): the dock and cable sit at the upper RIGHT of the rock top, in front of the plaster wall, with the BLACK ring seated in the dock cup. The SILVER ring stands upright on its edge at the left side of the rock, slightly above the middle, three-quarter view with the Stillway engraving toward the camera. The GOLD ring lies flat at the lower right of the rock in soft sunlight, slightly turned. Casual, natural placement, not a catalogue row. $QUIET $AVOID" "$WD/raw${R2:-}-c.png" --size 1536x1024 --ref "$SCENE" --ref "$FIN" --ref "$LOGO" &
fi
wait; echo "EVERYDAY RAW DONE ($ONLY)"

# Pass 2 (rock realism, REJECTED; round-1 raw-* and fix-* now live in _work/rejected-round1/): the raw outputs had a regular woven / fabric-like pattern on the granite.
# AI edit of each raw image, with A-11 as rock-texture reference -> _work/fix-<v>.png
FIX="Keep this exact image: identical composition, identical camera, identical objects with their exact positions, sizes, shapes, colours and reflections (charging dock, white cable, and every ring including its engraved Stillway text), identical warm light and shadows. Only make the granite boulder look like a real photographed stone, like the rock in the SECOND attached image: natural irregular granite grain with random speckles of grey, black, white and rusty orange, small pits and very subtle pale lichen, gentle uneven tonal variation and soft natural shading toward the edges. Remove the regular repeating woven / fabric-like texture completely: no grid, no mesh, no repeating pattern. Keep the moss, ferns, plaster wall and leaf shadows as they are, as one seamless real photograph with fine film grain. Do not add or remove any object, no text, no vignette."
if [[ "${PASS:-}" == fix ]]; then for v in a b c; do want "$v" || continue
  run "$FIX" "$WD/fix-$v.png" --size 1536x1024 --ref "$WD/raw-$v.png" --ref "$SCENE" &
done; wait; echo "EVERYDAY FIX DONE ($ONLY)"; fi

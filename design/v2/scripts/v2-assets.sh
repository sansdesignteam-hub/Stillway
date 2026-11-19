#!/usr/bin/env bash
# V2 asset prompts (D-064, D-065). DO NOT RUN until the 3D Designer delivers the
# logo reference render (D-061). Usage: RING_REF=path/to/render.png ./v2-assets.sh [A-1|A-2|A-3|A-4]
# Prompts and composition notes: design/v2/REPORT-v2-assets.md
set -euo pipefail
: "${RING_REF:?RING_REF is not set. Wait for the logo reference render from the 3D Designer (D-065).}"
[[ -f "$RING_REF" ]] || { echo "RING_REF not found: $RING_REF" >&2; exit 1; }
G="$(cd "$(dirname "$0")/../../assets/v1/scripts" && pwd)/genref.sh"
cd "$(dirname "$0")/../../.."
CHAR=design/assets/v1/masters/C-02-character.png; KIT=design/assets/v1/masters/R-kit.png
OUT=design/assets/v2; mkdir -p "$OUT"
run(){ [[ -f "$2" ]] && { echo "SKIP $2"; return; }; "$G" "$@" || echo "FAIL $2"; }
ONLY="${1:-all}"; want(){ [[ "$ONLY" == all || "$ONLY" == "$1" ]]; }

STYLE="Real editorial lifestyle photograph, not a render, full-frame camera, 50-85 mm lens, natural light only, warm cream-and-sand studio palette (cream plaster #F7F5F0, sand linen #EFE6DB, light oak), soft film-like tonality, fine grain, calm and candid. The man is the SAME man as the attached character reference: same face, hair, beard, skin tone and oatmeal linen shirt; never looking into the camera."
RING="He wears the smart ring from the attached ring reference render on the INDEX finger of his LEFT hand, between the knuckles, realistic small scale: same silver band, chamfered edges, matte black inside, with the small tone-on-tone engraved word Stillway running across the band width. The engraving must be clean and correct or turned away from the camera, never garbled. No glowing sensor light."
ANAT="Every visible hand is anatomically correct with exactly five digits, natural joints, masculine hands with short clean nails."
AVOID="Avoid: stone, moss, ferns, leaf shadows, phone screens, numbers, text, other logos, other jewelry, watches, extra rings, glowing lights, CGI or plastic skin, HDR, oversaturation, blue or green cast, lens flare, vignette."

if want A-1; then for v in 0 10 20; do
run "Real studio photograph, not a render. A relaxed adult man's LEFT hand, the same skin tone and hand as the attached character reference (early-to-mid 30s, warm light-medium skin, short clean nails), on a perfectly plain flat warm cream backdrop #F7F5F0 with no shadow on the backdrop. Back of the hand faces the camera; the forearm enters from the lower right and leans about $v degrees to the left of vertical. The INDEX finger points straight up, fully extended and slightly apart from the others; the middle, ring and little fingers are gently curled and close together below it; the thumb rests relaxed to the left without covering the base of the index finger. Camera level with the base of the index finger, about 10 degrees from above. NO ring, no jewelry, no watch, no sleeve beyond the wrist. Soft even studio light from the left, true-to-life skin texture. The hand occupies the right 45% of a square frame, fingertip near the top fifth, wrist cropped by the bottom edge; generous empty space on the left. $ANAT No text, no props, no room." "$OUT/A-1-hand-cutout-v$v.png" --size 1536x1536 --ref "$CHAR"
done; fi

if want A-2; then
run "$STYLE (I) Night. Close-up from above at night: his LEFT hand rests relaxed on a sand linen duvet, back of the hand up, fingers slightly apart, ring in the lower third and sharp; his shoulder and cheek softly visible on a linen pillow above, eyes closed. Warm bedside lamp light about 2700K from the right, the rest in soft warm shadow. Vertical 4:5. $ANAT $RING $AVOID" "$OUT/A-2-card-night.png" --size 1232x1536 --ref "$RING_REF" --ref "$CHAR" &
run "$STYLE (II) Desk. Light oak desk against a cream plaster wall: his LEFT hand pauses above a slim plain keyboard with no readable letters, fingers gently curved, linen sleeve rolled. Medium close-up at 45 degrees. Window light from the left about 5000K. Vertical 4:5. $ANAT $RING $AVOID" "$OUT/A-2-card-desk.png" --size 1232x1536 --ref "$RING_REF" --ref "$CHAR" &
wait
run "$STYLE (III) Move. On a sand studio floor he kneels to tie the lace of a cream canvas sneaker; his LEFT hand holds the lace in front, back of the hand toward the camera. Low angle. Window light from the right about 5200K, soft floor shadow. Vertical 4:5. $ANAT $RING $AVOID" "$OUT/A-2-card-move.png" --size 1232x1536 --ref "$RING_REF" --ref "$CHAR" &
run "$STYLE (IV) Rinse. Both hands under a gentle stream of water at a sand-coloured ceramic basin with a brushed tap; his LEFT hand in front, the ring wet and glistening, droplets visible. Close-up. Window light from upper left about 5000K. Vertical 4:5. $ANAT $RING $AVOID" "$OUT/A-2-card-rinse.png" --size 1232x1536 --ref "$RING_REF" --ref "$CHAR" &
wait; fi

if want A-3; then
run "$STYLE The Everyday. Wide calm studio interior: cream plaster wall, sand floor, one low light-oak stool, a large window just out of frame left. He sits sideways on the stool holding a ceramic cup with both hands at chest height, the back of his LEFT hand toward the camera so the ring is visible. Full body, small in frame, in the right third; large quiet slightly darker negative space in the centre for white overlay text. Afternoon window light about 4500K, one warm patch of light on the floor. Horizontal 16:9. $ANAT $RING $AVOID" "$OUT/A-3-everyday.png" --size 2400x1350 --ref "$RING_REF" --ref "$CHAR"
fi

if want A-4; then
run "Real studio product photograph, not a render. Flat lay from directly above on a plain sand surface #EFE6DB: the silver smart ring from the attached ring reference render (with its small tone-on-tone engraved Stillway text visible and correct), a low round charging dock and a small tray of sizing sample rings, shaped like the attached kit reference. Arranged on a diagonal from upper left to lower right with generous space, soft contact shadows. Softbox from the left about 5000K. No packaging, no text, no other logos, no glowing lights. Horizontal 4:3." "$OUT/A-4-box-studio.png" --size 1600x1200 --ref "$RING_REF" --ref "$KIT"
fi
echo "V2 ASSETS DONE ($ONLY)"

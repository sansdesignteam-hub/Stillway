#!/usr/bin/env bash
# V2 asset prompts (D-064, D-065). DO NOT RUN until the 3D Designer delivers the
# logo reference render (D-061). D-071..D-073 approved; RING_REF = 3D-Designer design/3d/v2/renders/v2-ring-ref-34.png Usage: RING_REF=path/to/render.png ./v2-assets.sh [A-1|A-2|A-3|A-4]
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
RING="He wears the smart ring from the attached ring reference render on the INDEX finger of his LEFT hand, sitting at the base of the finger above the knuckle, realistic small scale: a wide flat satin-brushed silver band about 8 mm wide with softly rounded chamfered edges and a matte dark grey inside. A small tone-on-tone engraved word Stillway runs AROUND the circumference of the band on the outer side, so on an upright finger it reads HORIZONTALLY across the back of the finger, like the attached reference. The engraving must be clean and correctly spelled or turned away from the camera, never garbled. No glowing sensor light."
ANAT="Every visible hand is anatomically correct with exactly five digits, natural joints, masculine hands with short clean nails."
AVOID="Avoid: stone, moss, ferns, leaf shadows, phone screens, numbers, text, other logos, other jewelry, watches, extra rings, glowing lights, CGI or plastic skin, HDR, oversaturation, blue or green cast, lens flare, vignette."

if want A-1; then for v in 0 10 20; do
run "Real studio photograph, not a render. A relaxed adult man's LEFT hand, the same skin tone and hand as the attached character reference (early-to-mid 30s, warm light-medium skin, short clean nails), on a perfectly plain flat warm cream backdrop #F7F5F0 with no shadow on the backdrop. Back of the hand faces the camera; the forearm enters from the lower right and leans about $v degrees to the left of vertical. The INDEX finger points straight up, fully extended and slightly apart from the others; the middle, ring and little fingers are gently curled and close together below it; the thumb rests relaxed on the RIGHT side of the image (this is a LEFT hand seen from the back, so the thumb is on the viewer's right) without covering the base of the index finger. Camera level with the base of the index finger, about 10 degrees from above. NO ring, no jewelry, no watch, no sleeve beyond the wrist. Soft even studio light from the left, true-to-life skin texture. The hand occupies the right 45% of a square frame, fingertip near the top fifth, wrist cropped by the bottom edge; generous empty space on the left. $ANAT No text, no props, no room." "$OUT/A-1-hand-cutout-v$v.png" --size 1536x1536 --ref "$CHAR"
done; fi

# A-1b: the selected A-1 hand (flipped to a true left hand, see design/assets/v2/README.md) with the ring composited by AI edit.
# Ring pose ref = v2-ring-axis-vertical-10.png (axis vertical, logo facing camera, reads HORIZONTALLY).
if want A-1b; then
: "${HAND_SEL:=design/assets/v2/_variants/A-1-hand-left-v0.png}"; : "${RING_AXIS:?set RING_AXIS to v2-ring-axis-vertical-10.png}"
run "Keep this exact image: the same hand, same pose, same skin, same plain cream backdrop, same framing and light. Only add the smart ring from the second attached reference onto the INDEX finger, seated on the lower part of the finger just above the knuckle where the finger meets the hand. The ring axis follows the upright finger, so the band wraps horizontally around the finger like the second reference: a wide flat satin-brushed silver band about 8 mm wide (roughly one third of the visible finger length below the middle joint), warm pewter-toned silver with strong directional horizontal brushing exactly like the reference, softly rounded chamfered edges, a thin sliver of the matte dark grey inside visible at the top edge. The small tone-on-tone engraved word Stillway on the band faces the camera and reads HORIZONTALLY, clean and correctly spelled, exactly like the reference; if it cannot be clean, leave the band plain. Realistic contact with the skin, a subtle soft shadow on the finger just below the ring, true scale. Do not change anything else. No glowing light, no text elsewhere." design/assets/v2/A-1b-hand-with-ring.png --ref "$HAND_SEL" --ref "$RING_AXIS"
fi

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
run "Real studio product photograph, not a render. Flat lay from directly above on a plain sand surface #EFE6DB: the smart ring from the attached ring reference render, same warm pewter-toned brushed silver with directional brushing and the same darkness as the reference (with its small tone-on-tone engraved Stillway text visible and correct), a low round charging dock and a small tray of sizing sample rings, shaped like the attached kit reference. Arranged on a diagonal from upper left to lower right with generous space, soft contact shadows. Softbox from the left about 5000K. No packaging, no text, no other logos, no glowing lights. Horizontal 4:3." "$OUT/A-4-box-studio.png" --size 1600x1200 --ref "$RING_REF" --ref "$KIT"
fi
echo "V2 ASSETS DONE ($ONLY)"

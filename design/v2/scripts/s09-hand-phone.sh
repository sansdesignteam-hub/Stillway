#!/usr/bin/env bash
# S09 "The app": hand holding a phone (D-160). Brief: design/v2/BRIEF-vd-s09-hand.md (Project Manager checkout).
# Character C-02 (D-058), tan / sawo matang skin like A-1 (S06). Black logo-less phone; the screen is generated
# as flat chroma green and the background as pure white, so s09-hand-phone-finish.py can key both to alpha.
# Usage: ./s09-hand-phone.sh [a|b|c|all] -> design/assets/v2/app/_work/raw-<v>.png (requested 1024x1536)
# Then:  python s09-hand-phone-finish.py -> design/assets/v2/A-5-hand-phone*.png + app/*.webp + app/README.md data
set -euo pipefail
G="$(cd "$(dirname "$0")/../../assets/v1/scripts" && pwd)/genref.sh"
cd "$(dirname "$0")/../../.."
WD=design/assets/v2/app/_work; mkdir -p "$WD/refs"
# References (copied into _work/refs so the run is reproducible from this branch):
#  pose.png = Project Manager design/v2/references/s09-ref-uh-vitals.png (Ultrahuman pose reference, pose only)
#  SKIN     = design/assets/v2/A-1-hand-left.png (S06 hand photo, skin tone + hand character)
POSE="$WD/refs/pose.png"; SKIN=design/assets/v2/A-1-hand-left.png
ONLY="${1:-all}"; want(){ [[ "$ONLY" == all || "$ONLY" == "$1" ]]; }
run(){ [[ -f "$2" ]] && { echo "SKIP $2"; return; }; "$G" "$@" || echo "FAIL $2"; }

BASE="Real studio product photograph, not a render, not CGI, not an illustration. A man's hand holding a modern smartphone upright, screen facing the camera, against a perfectly plain pure white seamless background (#FFFFFF) with no floor, no cast shadow on the background and no vignette. Use the FIRST attached image only as a reference for the pose and framing of hand and phone (ignore its app UI, its tab bar and its dark skin tone). Use the SECOND attached image as the reference for the hand: same adult man, tan medium-brown Southeast Asian skin (sawo matang), natural fine knuckle creases, a few fine hairs on the back of the hand and wrist, short clean natural nails, no ring, no jewellery, no watch, no sleeve. THE PHONE: a modern black smartphone with a thin black bezel of equal width on all sides, rounded corners, 19.5:9 proportions like an iPhone, a small black pill-shaped camera island centred near the top of the screen, satin black frame, absolutely no logo, no brand, no text, no visible buttons. THE SCREEN: the whole display inside the bezel is filled edge to edge with one flat, uniform, pure chroma-key green colour (#00FF00), perfectly even, no gradient, no reflection, no glare, no UI, no icons, no status bar, with cleanly rounded screen corners; only the black camera pill sits on top of the green. No finger, thumb or skin overlaps the green screen area at all: the fingers only touch the outer black frame and the back of the phone. FRAMING: vertical 2:3 portrait. The phone is upright (tilted at most 3 degrees), horizontally centred, its top edge about 6% below the top of the image, phone height about 68% of the image height, the entire phone visible and never cropped. The hand comes up from the bottom edge of the image and the wrist and forearm continue out through the bottom edge (cut by the frame, no sleeve). LIGHT: soft, even, neutral-warm studio light from a large softbox at the upper left, gentle natural shading and soft contact shadows between the fingers and the phone, realistic skin with natural texture, sharp focus on the whole hand and phone, 85 mm lens, f/8."
AVOID="Avoid: any logo or brand mark, any text, rings, watches, bracelets, sleeves, fingers or thumb over the green screen, extra or missing fingers, a background colour other than pure white, a shadow on the background, a grey or gradient background, a reflection or gradient on the green screen, a cropped phone."

if want a; then
run "$BASE Pose A (like the reference): the phone is held from below and behind by the LEFT hand coming in from the lower left; the thumb rests along the LEFT outer frame of the phone around the lower third, pointing upward, touching only the black frame; the index, middle and ring fingertips curl around the RIGHT outer edge of the phone from behind, about halfway up and lower; the palm and the base of the thumb are visible below the phone, the wrist exits through the bottom edge slightly left of centre. $AVOID" "$WD/raw-a.png" --size 1024x1536 --ref "$POSE" --ref "$SKIN" &
fi
if want b; then
run "$BASE Pose B (mirror of the reference): the phone is held from below and behind by the RIGHT hand coming in from the lower right; the thumb rests along the RIGHT outer frame of the phone around the lower third, pointing upward, touching only the black frame; the index, middle and ring fingertips curl around the LEFT outer edge of the phone from behind, about halfway up and lower; the palm and the base of the thumb are visible below the phone, the wrist exits through the bottom edge slightly right of centre. $AVOID" "$WD/raw-b.png" --size 1024x1536 --ref "$POSE" --ref "$SKIN" &
fi
if want c; then
run "$BASE Pose C (relaxed cradle): the phone rests upright in the LEFT hand coming in from the bottom centre; the bottom edge of the phone sits on the curled fingers, the thumb rests along the LEFT outer frame near the bottom corner touching only the black frame, the fingertips of the index and middle finger just visible at the RIGHT outer edge near the bottom; the palm is visible below the phone and the wrist exits straight down through the bottom edge at the centre. $AVOID" "$WD/raw-c.png" --size 1024x1536 --ref "$POSE" --ref "$SKIN" &
fi
wait; echo "S09 HAND RAW DONE ($ONLY)"

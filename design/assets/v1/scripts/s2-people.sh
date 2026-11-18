#!/usr/bin/env bash
# Sleep section ("Last night") with character C-01 (D-056).
G="$(cd "$(dirname "$0")" && pwd)/genref.sh"
cd "$(dirname "$0")/../../../.."
eval "$(sed -n '/^RM=/p;/^R4=/p;/^STYLE=/p;/^RING=/p;/^AVOID=/p' design/assets/v1/scripts/s3-people.sh)"
H=design/assets/v1/home; HAND=design/assets/v1/_archive/interior-draft1/masters/E-02-hand.png
run(){ [[ -f "$2" ]] && { echo "SKIP $2"; return; }; "$G" "$@" || echo "FAIL $2"; }
ANAT="Every visible hand is anatomically correct with exactly five digits, one thumb and four separate fingers, all clearly visible, relaxed and open, natural joints and proportions."
X="Also avoid: interlaced or hidden fingers, fist, extra or missing fingers, phone screens, numbers, scores, charts, clocks with readable digits."
run "$STYLE 'Last night, in one view.' Early morning just after waking, about 06:45. She lies in bed on her back on rumpled oatmeal linen bedding, eyes softly open, calm and rested, hair loose on the pillow. Her LEFT hand rests open and relaxed on the duvet near her chest, back of the hand up, fingers gently apart, the silver ring on the left index finger catching the first warm light. Pale cool dawn light through a sheer linen curtain, with a first band of warm sun and soft leaf shadows on the cream plaster wall above the bed. Shot from slightly above the bed, medium close, the hand and ring sharp in the lower foreground, her face softly in the upper part. Quiet, hushed, gentle. Vertical 4:5. $ANAT $RING $AVOID $X" $H/S2p-01-last-night.png --size 1232x1536 --ref $R4 --ref $CHAR --ref $HAND &
run "$STYLE 'Patterns, not scores.' Mid-morning calm. She sits cross-legged on a low window seat with linen cushions, by a tall window, holding a ceramic cup of tea in both hands at chest height, looking out of the window with a relaxed, unhurried expression; nothing to check, no phone in sight. Her LEFT hand wraps the front of the cup, back of the hand toward the camera, thumb visible on the near side of the handle-less cup and four fingers around it, the silver ring on the left index finger clearly visible. Warm morning sunlight about 4800K with leaf shadows across the cream wall, her shirt and the cushions. Medium shot from the side, slightly in front. Vertical 4:5. $ANAT $RING $AVOID $X" $H/S2p-02-patterns.png --size 1232x1536 --ref $R4 --ref $CHAR --ref $HAND &
wait; echo S2 PEOPLE DONE

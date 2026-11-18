#!/usr/bin/env bash
# SUPERSEDED by people-c02.sh (male character C-02, D-058). Kept as history; outputs live in _archive/character-female-c01/.
# 10:30 stretch — two pose variants after anatomy rejects (interlaced fingers; 4-digit hand).
G="$(cd "$(dirname "$0")" && pwd)/genref.sh"
cd "$(dirname "$0")/../../../.."
eval "$(sed -n '/^RM=/p;/^R4=/p;/^STYLE=/p;/^RING=/p;/^AVOID=/p;/^SZ=/p' design/assets/v1/scripts/s3-people.sh)"
H=design/assets/v1/home; HAND=design/assets/v1/_archive/interior-draft1/masters/E-02-hand.png
ANAT="Each visible hand must be anatomically correct with exactly five digits: one thumb and four separate fingers (index, middle, ring, little), all five clearly visible and countable, natural joints and proportions."
X="Also avoid: interlaced fingers, missing or hidden fingers, extra fingers, fused fingers, foreshortened hand."
"$G" "$STYLE 10:30, Moving, a 15-minute stretch. Indoors by a sunny window, the person stands and stretches both arms straight forward at shoulder height, palms facing down, fingers relaxed and slightly apart, like a gentle morning reach; seen from a three-quarter front angle so the back of her LEFT hand is toward the camera and all five digits are separated and visible, the silver ring clearly on the left index finger. Eyes softly closed, calm face. Bright mid-morning sunlight about 5200K, crisp leaf shadows across the cream wall and the linen shirt. Vertical 5:7, hands in the middle third. $ANAT $RING $AVOID $X" $H/S3p-1030-moving-stretch-a.png $SZ --ref $R4 --ref $CHAR --ref $HAND &
"$G" "$STYLE 10:30, Moving, a 15-minute stretch. Indoors by a sunny window, the person does a slow neck and shoulder stretch: her head tilts gently to the right, and her LEFT hand rests lightly on top of her head with fingers relaxed and slightly apart, the back of the hand facing the camera so the thumb and all four fingers are clearly visible and the silver ring on the left index finger sits in the light; her right arm hangs relaxed. Eyes closed, calm. Bright mid-morning sunlight about 5200K, crisp leaf shadows across the cream wall. Vertical 5:7, medium close shot from the waist up. $ANAT $RING $AVOID $X" $H/S3p-1030-moving-stretch-b.png $SZ --ref $R4 --ref $CHAR --ref $HAND &
wait; echo STRETCH VARIANTS DONE

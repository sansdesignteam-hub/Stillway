#!/usr/bin/env bash
# Stage 2 (D-080): AI detail refinement of each outer tile, same composition.
set -euo pipefail
G="$(cd "$(dirname "$0")/../../assets/v1/scripts" && pwd)/genref.sh"
cd "$(dirname "$0")/../../.."
WD=design/assets/v2/hero/_work/tiles
PROMPT="Keep this exact image: identical composition, identical objects and their exact positions and shapes, identical colours, warm early-morning light and colour grade. Only restore it as a crisp high-resolution real photograph: fine plaster texture on the wall, soft leaf shadows with natural edges, individual moss fronds and tiny stems, fern leaflets, leaf veins, natural photographic grain. Areas that are out of focus in this image (near foreground ferns and moss, distant leaves) must stay softly out of focus with the same blur. Do not add or remove anything: no ring, no stones, no new plants, no text, no vignette, no frame."
for f in "$WD"/tile-*-in.png; do o="${f%-in.png}-out.png"; [[ -f "$o" ]] && continue
  ( "$G" "$PROMPT" "$o" --size 1536x1024 --ref "$f" || echo "FAIL $o" ) &
  while (( $(jobs -r | wc -l) >= 4 )); do sleep 2; done
done; wait; echo REFINE DONE

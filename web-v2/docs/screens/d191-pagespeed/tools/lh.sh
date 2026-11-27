#!/bin/zsh
# lh.sh <label> <url> [runs]
S=${0:A:h}/..
label=$1; url=$2; runs=${3:-3}
for preset in mobile desktop; do
  for i in $(seq 1 $runs); do
    flag=""; [ $preset = desktop ] && flag="--preset=desktop"
    $S/tools/node_modules/.bin/lighthouse "$url" --quiet --chrome-flags="--headless=new" --only-categories=performance --output=json --output-path=$S/lh/$label-$preset-$i.json $flag >/dev/null 2>&1
  done
done
node $S/tools/lhsum.mjs $label

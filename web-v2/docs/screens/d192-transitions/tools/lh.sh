#!/bin/zsh
# lh.sh <label> <url>  — 3 runs mobile + desktop, all categories except SEO
S=${0:A:h}/..
for preset in mobile desktop; do
  for i in 1 2 3; do
    flag=(); [[ $preset = desktop ]] && flag=(--preset=desktop)
    $S/tools/node_modules/.bin/lighthouse "$2" --quiet --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices --output=json --output-path=$S/lh/$1-$preset-$i.json $flag >/dev/null 2>&1
  done
done
node $S/tools/lhsum.mjs $1

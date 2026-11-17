#!/usr/bin/env bash
# genref.sh "<prompt>" <out.png> [--size WxH] [--ref file]...
set -euo pipefail
prompt="$1"; out="$2"; shift 2
size=""; refs=()
while [[ $# -gt 0 ]]; do case "$1" in --size) size="$2"; shift 2;; --ref) refs+=("-i" "$2"); shift 2;; *) echo "bad arg $1" >&2; exit 2;; esac; done
out_dir="$(cd "$(dirname "$out")" && pwd)"; out="$out_dir/$(basename "$out")"
workdir="$(mktemp -d "${TMPDIR:-/tmp}/genref.XXXXXX")"; log="${workdir}.log"
size_line=""; [[ -n "$size" ]] && size_line="
TARGET SIZE / ASPECT: ${size}"
refnote=""; [[ ${#refs[@]} -gt 0 ]] && refnote="
REFERENCE IMAGES: The attached image(s) are references. Pass them to the image_generation tool as input/reference images (image edit / reference mode) so the generated image reproduces the ring geometry, finish, and any other referenced subject faithfully. If the prompt says 'Keep this exact image', perform an edit of the first attached image."
full_prompt="Use your image_generation tool to create an image.

PROMPT: ${prompt}${size_line}${refnote}

Requirements:
- You MUST call the image_generation tool.
- Do NOT write a Python script, shell out to curl, or fabricate a PNG any other way.
- After the tool produces the image, save the PNG as out.png in your current working directory. Use the relative path out.png.
- Reply with only the file name of the saved PNG, nothing else."
if ! codex exec --skip-git-repo-check -s workspace-write -C "$workdir" ${refs[@]+"${refs[@]}"} -- "$full_prompt" </dev/null >"$log" 2>&1; then
  echo "FAILED $out"; tail -n 30 "$log" >&2; exit 1; fi
img="$workdir/out.png"; [[ -f "$img" ]] || img="$(ls -t "$workdir"/*.png 2>/dev/null | head -n1 || true)"
[[ -n "$img" && -f "$img" ]] || { echo "NOPNG $out"; tail -n 30 "$log" >&2; exit 1; }
cp "$img" "$out"; rm -rf "$workdir" "$log"; echo "$out"

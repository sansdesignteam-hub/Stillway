"""S02 option B finish (D-088): map the clean wall to Paper #F7F5F0, upscale, add fine grain, export.
usage: s02-finish.py RAW OUT_PREFIX W H [W2 H2]"""
import sys, numpy as np
from PIL import Image
raw, pre, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
a = np.asarray(Image.open(raw).convert('RGB'), np.float32); h, w, _ = a.shape
clean = a[h * 2 // 5: h * 4 // 5, w // 8: w * 7 // 8].reshape(-1, 3)      # middle/lower band = clean wall
ref = np.median(clean, 0); paper = np.array([247, 245, 240], np.float32)
g = paper / ref; b = np.clip(a * g, 0, 255)
up = np.asarray(Image.fromarray(b.round().astype(np.uint8)).resize((W, H), Image.LANCZOS), np.float32)
rng = np.random.default_rng(88); up = np.clip(up + rng.normal(0, 1.1, up.shape[:2])[..., None], 0, 255).astype(np.uint8)
im = Image.fromarray(up)
im.save(f'{pre}-{W}x{H}.png', optimize=True); im.save(f'{pre}-{W}x{H}.webp', quality=84, method=6)
if len(sys.argv) > 6:
    W2, H2 = int(sys.argv[5]), int(sys.argv[6]); im.resize((W2, H2), Image.LANCZOS).save(f'{pre}-{W2}x{H2}.webp', quality=84, method=6)
c = up[H * 2 // 5: H * 4 // 5, W // 8: W * 7 // 8].reshape(-1, 3)
L = up.mean(-1)
print(raw, 'gain', g.round(3), '-> clean median', np.median(c, 0), 'lum p1', np.percentile(L, 1).round(), 'min wall-band', L[H*2//5:, :].min().round())

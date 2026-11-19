"""Register an outpainted low-res canvas to the original photo, upscale it to the master canvas,
and paste the original back pixel-for-pixel with a feathered seam (D-080).
usage: hero-composite.py SRC OUT_LOWRES MASTER_W MASTER_H OUT_PNG [feather_px]"""
import sys, json, numpy as np
from PIL import Image, ImageFilter
src_p, low_p, MW, MH, out_p = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
feather = int(sys.argv[6]) if len(sys.argv) > 6 else 140
src = Image.open(src_p).convert('RGB'); SW, SH = src.size
low = Image.open(low_p).convert('RGB'); LW, LH = low.size
k = LW / MW                                   # nominal low-res px per master px
exp_x, exp_y = (MW - SW) / 2 * k, (MH - SH) / 2 * k
g = lambda im: np.asarray(im.convert('L'), dtype=np.float32)
lowg = g(low)
best = None
for s in np.linspace(0.94, 1.06, 25):        # search scale and offset of the source inside the low-res canvas
    w, h = round(SW * k * s), round(SH * k * s)
    t = g(src.resize((w, h), Image.BILINEAR))
    t = (t - t.mean()) / (t.std() + 1e-6)
    cx, cy = exp_x + (SW * k - w) / 2, exp_y + (SH * k - h) / 2
    for dy in range(-24, 25, 2):
        for dx in range(-24, 25, 2):
            x, y = int(round(cx + dx)), int(round(cy + dy))
            if x < 0 or y < 0 or x + w > LW or y + h > LH: continue
            p = lowg[y:y + h, x:x + w]; p = (p - p.mean()) / (p.std() + 1e-6)
            sc = float((p * t).mean())
            if best is None or sc > best[0]: best = (sc, s, x, y, w, h)
sc, s, x, y, w, h = best
# refine at 1 px
for dy in range(-2, 3):
    for dx in range(-2, 3):
        t = g(src.resize((w, h), Image.BILINEAR)); t = (t - t.mean()) / (t.std() + 1e-6)
        X, Y = x + dx, y + dy
        p = lowg[Y:Y + h, X:X + w]; p = (p - p.mean()) / (p.std() + 1e-6)
        v = float((p * t).mean())
        if v > sc: sc, bx, by = v, X, Y
x, y = (bx, by) if 'bx' in dir() else (x, y)
# scale low-res so the matched source area becomes exactly SW x SH, then place so it lands at the master offset
f = SW / w
PAD = 8  # replicate edges so rounding never leaves an uncovered strip
low = Image.fromarray(np.pad(np.asarray(low), ((PAD, PAD), (PAD, PAD), (0, 0)), mode='edge')); x, y = x + PAD, y + PAD; LW, LH = low.size
OX, OY = (MW - SW) // 2, (MH - SH) // 2
up = low.resize((round(LW * f), round(LH * f)), Image.LANCZOS)
canvas = Image.new('RGB', (MW, MH))
canvas.paste(up, (OX - round(x * f), OY - round(y * f)))
# feathered paste of the original: fully original inside, blended over the outer `feather` px
m = np.ones((SH, SW), np.float32)
r = np.minimum.reduce([np.arange(SW)[None, :].repeat(SH, 0), np.arange(SW)[::-1][None, :].repeat(SH, 0),
                       np.arange(SH)[:, None].repeat(SW, 1), np.arange(SH)[::-1][:, None].repeat(SW, 1)])
m = np.clip(r / feather, 0, 1); m = m * m * (3 - 2 * m)
canvas.paste(src, (OX, OY), Image.fromarray((m * 255).astype(np.uint8)))
canvas.save(out_p)
cov = dict(ok=bool(OX - round(x * f) <= 0 and OY - round(y * f) <= 0 and OX - round(x * f) + up.size[0] >= MW and OY - round(y * f) + up.size[1] >= MH))
print(json.dumps(dict(score=round(sc, 3), scale=round(float(s), 4), low_match=[x, y, w, h], upscale=round(f, 4),
                      master=[MW, MH], original_offset=[OX, OY], original_size=[SW, SH],
                      pixel_identical_core=[OX + feather, OY + feather, SW - 2 * feather, SH - 2 * feather], **cov)))

"""og:image 1200x630 from the real S01 three.js render of the reference ring (D-071/D-073) + Geist Medium wordmark."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, font, out = sys.argv[1], sys.argv[2], sys.argv[3]
scrim = float(sys.argv[4]) if len(sys.argv) > 4 else 0.42
W, H = 1200, 630
im = Image.open(src).convert('RGB')            # 1440x900
X0, Y0 = int(sys.argv[5]) if len(sys.argv) > 5 else 120, int(sys.argv[6]) if len(sys.argv) > 6 else 150
im = im.crop((X0, Y0, X0 + W, Y0 + H))   # 1:1 crop, no resampling of the render
a = np.asarray(im, dtype=np.float32)
# scrim: Night #1B0B06 from top, eases out by y~0.62, like the hero's dim layer
y = np.linspace(0, 1, H)[:, None, None]
k = scrim * np.clip(1 - y / 0.62, 0, 1) ** 1.4 + 0.10   # +10% overall dim, like the live hero
night = np.array([0x1B, 0x0B, 0x06], np.float32)
a = a * (1 - k) + night * k
im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
# wordmark: Display 1 rules: caps, Geist Medium, tracking -3%, spans margin 40..W-40 (scaled)
text = "STILLWAY"; margin = 40
def measure(sz):
    f = ImageFont.truetype(font, sz); tr = -0.03 * sz
    ws = [f.getlength(c) for c in text]
    return f, tr, ws, sum(ws) + tr * (len(text) - 1)
sz = 200
for _ in range(30):
    f, tr, ws, tw = measure(sz)
    sz *= (W - 2 * margin) / tw
f, tr, ws, tw = measure(sz)
# ink bbox correction so the visible glyph edges land exactly on the margins
l0 = f.getbbox(text[0])[0]; r1 = ws[-1] - f.getbbox(text[-1])[2]
sz2 = sz * (W - 2 * margin) / (tw - l0 - r1)
f, tr, ws, tw = measure(sz2); l0 = f.getbbox(text[0])[0]
d = ImageDraw.Draw(im)
x = margin - l0; capt = f.getbbox("S")[1]
ytop = 40 - capt
paper = (0xF9, 0xF5, 0xEF)
for c, w in zip(text, ws):
    d.text((x, ytop), c, font=f, fill=paper); x += w + tr
print("font px", round(sz2, 1), "cap box", f.getbbox("STILLWAY", anchor=None))
im.save(out, quality=88, optimize=True, progressive=True, subsampling=0)

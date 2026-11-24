"""S09 Recovery screen background (D-163): AI raw -> phone-screen master + web files + review preview.
Usage: python s09-recovery-bg-finish.py   (run from the repo root; needs Pillow + numpy)
  design/assets/v2/app/_work/recovery/raw-<v>.png
  -> design/assets/v2/A-6-recovery-bg-<v>.png              1290x2796 master (9:19.5)
  -> design/assets/v2/app/A-6-recovery-bg-<v>-1290.webp     1290x2796   (number in the name = WIDTH)
  -> design/assets/v2/app/A-6-recovery-bg-<v>-860.webp      860x1864
  -> design/assets/v2/app/_preview/A-6-recovery-bg-preview.png  both variations with a MOCK dial (not for the web)
Crop: centred 9:19.5 window; CROP[v] = (centre x, centre y) as fractions of the raw, to keep the hand/ring framed.
No colour or exposure change; Lanczos upscale, light unsharp mask and fine luminance grain only.
"""
import math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = "design/assets/v2"
WD = f"{ROOT}/app/_work/recovery"
W, H = 1290, 2796
CROP = {"a": (0.5, 0.5), "b": (0.5, 0.5)}
FONT = os.path.expanduser("~/Library/Fonts/Geist-{}.otf")


def crop_to_ratio(im, cx, cy):
    r = W / H
    iw, ih = im.size
    if iw / ih > r:  # too wide: crop width
        cw, ch = round(ih * r), ih
    else:  # too tall: crop height
        cw, ch = iw, round(iw / r)
    x0 = min(max(round(cx * iw - cw / 2), 0), iw - cw)
    y0 = min(max(round(cy * ih - ch / 2), 0), ih - ch)
    return im.crop((x0, y0, x0 + cw, y0 + ch))


def finish(v):
    raw = Image.open(f"{WD}/raw-{v}.png").convert("RGB")
    im = crop_to_ratio(raw, *CROP[v]).resize((W, H), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=40, threshold=3))
    a = np.asarray(im).astype(np.float32)
    rng = np.random.default_rng(163)
    g = rng.normal(0, 2.2, a.shape[:2]).astype(np.float32)[..., None]
    im = Image.fromarray(np.clip(a + g, 0, 255).astype(np.uint8))
    im.save(f"{ROOT}/A-6-recovery-bg-{v}.png", optimize=True)
    im.save(f"{ROOT}/app/A-6-recovery-bg-{v}-1290.webp", quality=84, method=6)
    im.resize((860, 1864), Image.LANCZOS).save(f"{ROOT}/app/A-6-recovery-bg-{v}-860.webp", quality=84, method=6)
    print(v, raw.size, "->", im.size)
    return im


def mock_dial(im):
    """Illustrative only: white gauge + big number on the calm upper area (HRV today 64 ms = copy.ts bars[6] x 80)."""
    s = 2  # supersample
    base = im.convert("RGBA")
    ov = Image.new("RGBA", (W * s, H * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    f = lambda w, px: ImageFont.truetype(FONT.format(w), px * s)
    white = (255, 255, 255, 255)
    soft = (255, 255, 255, 120)
    # status/title
    d.text((96 * s, 230 * s), "Recovery", font=f("Medium", 64), fill=white)
    d.text((96 * s, 316 * s), "Today · simulated", font=f("Regular", 36), fill=soft)
    # gauge: 240-degree arc with ticks
    cx, cy, R = W / 2 * s, 1010 * s, 400 * s
    start, sweep, val = 150, 240, 0.64
    for i in range(61):
        t = i / 60
        ang = math.radians(start + sweep * t)
        long = i % 10 == 0
        r1, r2 = R - (44 if long else 26) * s, R - 8 * s
        col = white if t <= val else soft
        d.line([(cx + r1 * math.cos(ang), cy + r1 * math.sin(ang)), (cx + r2 * math.cos(ang), cy + r2 * math.sin(ang))],
               fill=col, width=(5 if long else 3) * s)
    box = [cx - (R + 34 * s), cy - (R + 34 * s), cx + (R + 34 * s), cy + (R + 34 * s)]
    d.arc(box, start, start + sweep, fill=soft, width=3 * s)
    d.arc(box, start, start + sweep * val, fill=white, width=7 * s)
    ang = math.radians(start + sweep * val)
    px, py = cx + (R + 34 * s) * math.cos(ang), cy + (R + 34 * s) * math.sin(ang)
    d.ellipse([px - 18 * s, py - 18 * s, px + 18 * s, py + 18 * s], fill=white)
    for lab, t in (("0", 0), ("50", 0.5), ("100", 1)):
        a2 = math.radians(start + sweep * t)
        rr = R - 100 * s
        d.text((cx + rr * math.cos(a2), cy + rr * math.sin(a2)), lab, font=f("Regular", 34), fill=soft, anchor="mm")
    d.text((cx, cy - 10 * s), "64", font=f("Light", 300), fill=white, anchor="mm")
    d.text((cx, cy + 170 * s), "HRV · ms  ·  Recovered", font=f("Regular", 40), fill=white, anchor="mm")
    d.text((cx, 1390 * s), "Steady day, calm evening.", font=f("Regular", 44), fill=white, anchor="mm")
    ov = ov.resize((W, H), Image.LANCZOS)
    return Image.alpha_composite(base, ov).convert("RGB")


def phone(im, scale=0.36):
    w, h = round(W * scale), round(H * scale)
    sc = im.resize((w, h), Image.LANCZOS)
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], radius=round(150 * scale), fill=255)
    bez = 14
    out = Image.new("RGBA", (w + 2 * bez, h + 2 * bez), (0, 0, 0, 0))
    ImageDraw.Draw(out).rounded_rectangle([0, 0, w + 2 * bez - 1, h + 2 * bez - 1], radius=round(150 * scale) + bez, fill=(20, 19, 18, 255))
    out.paste(sc, (bez, bez), m)
    return out


if __name__ == "__main__":
    ims = {v: finish(v) for v in "ab"}
    os.makedirs(f"{ROOT}/app/_preview", exist_ok=True)
    tiles = []
    for v in "ab":
        tiles += [phone(ims[v]), phone(mock_dial(ims[v]))]
    tw, th = tiles[0].size
    gap = 48
    sheet = Image.new("RGB", (4 * tw + 5 * gap, th + 2 * gap + 70), (237, 233, 226))
    d = ImageDraw.Draw(sheet)
    lab = ImageFont.truetype(FONT.format("Medium"), 30)
    names = ["A, photo", "A, mock dial", "B, photo", "B, mock dial"]
    for i, t in enumerate(tiles):
        x = gap + i * (tw + gap)
        sheet.paste(t, (x, gap), t)
        d.text((x, gap + th + 18), names[i], font=lab, fill=(28, 27, 26))
    sheet.save(f"{ROOT}/app/_preview/A-6-recovery-bg-preview.png", optimize=True)
    print("preview", sheet.size)

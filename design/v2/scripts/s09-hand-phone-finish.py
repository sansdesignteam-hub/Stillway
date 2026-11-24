"""S09 'The app' hand + phone (D-160): AI raw -> alpha master, front layer, web files, previews, screen data.
Usage: python s09-hand-phone-finish.py <variant> <raw.png> <out-stem>   (run from the repo root; Pillow + numpy + scipy)
  e.g. python design/v2/scripts/s09-hand-phone-finish.py a design/assets/v2/app/_work/raw-a.png A-5-hand-phone
Steps
 1. Deskew: fit the left/right edges of the green screen, rotate so the phone is exactly upright.
 2. Lanczos upscale to 2400 px height (+ light unsharp mask).
 3. Screen: fit a rounded rectangle to the chroma-green area (x, y, w, h, corner radius). Pixels inside it become
    transparent, except the black camera pill which stays opaque. Green spill near the screen is removed.
 4. Background: pure white keyed to alpha with edge decontamination (as cutout.py); holes inside the subject filled.
 5. Front layer: skin pixels inside the phone's outer silhouette (thumb / fingers in front of the frame).
Outputs: design/assets/v2/<stem>.png, <stem>-front.png, app/<stem>-{1600,2400}.webp (+ -front),
         app/_preview/<stem>-preview.png, and prints a JSON block with the screen data for app/README.md."""
import sys, json, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

var, raw, stem = sys.argv[1:4]
OUT, APP = 'design/assets/v2', 'design/assets/v2/app'
import os; os.makedirs(f'{APP}/_preview', exist_ok=True)
H_OUT = 2400
PAPER, INK = (247, 245, 240), (35, 31, 32)

def greenness(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return np.clip((g - np.maximum(r, b) - 40) / 60, 0, 1)

def screen_mask(a):
    k = greenness(a) > .5
    lab, n = ndi.label(k)
    big = np.argmax(np.bincount(lab.ravel())[1:]) + 1
    return ndi.binary_fill_holes(lab == big)

def edge_x(m, side):
    ys = np.nonzero(m.any(1))[0]
    y0, y1 = ys.min(), ys.max(); h = y1 - y0
    rows = np.arange(int(y0 + .15 * h), int(y1 - .15 * h))
    xs = [(np.nonzero(m[y])[0].min() if side == 'l' else np.nonzero(m[y])[0].max()) for y in rows]
    return rows, np.array(xs, float)

# 1. deskew
im = Image.open(raw).convert('RGB')
a = np.asarray(im, np.float32)
m = screen_mask(a)
angs = []
for s in 'lr':
    yy, xx = edge_x(m, s)
    angs.append(np.degrees(np.arctan(np.polyfit(yy, xx, 1)[0])))
ang = float(np.mean(angs))
if abs(ang) > .05:
    im = im.rotate(-ang, Image.BICUBIC, expand=False, fillcolor=(255, 255, 255))

# 2. upscale
sc = H_OUT / im.height
W_OUT = round(im.width * sc)
im = im.resize((W_OUT, H_OUT), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.6, percent=40, threshold=3))
a = np.asarray(im, np.float32)
H, W = H_OUT, W_OUT

# 3. screen rounded rectangle
m = screen_mask(a)
ys, xs = np.nonzero(m)
x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
# robust edges: median over the straight middle part of each side
def med_edge(axis_rows, side):
    if side in 'lr':
        yy, xx = edge_x(m, side); return float(np.median(xx)) + (1 if side == 'r' else 0)
    mt = m.T
    yy, xx = edge_x(mt, 'l' if side == 't' else 'r'); return float(np.median(xx)) + (1 if side == 'b' else 0)
L, R, T, B = med_edge(None, 'l'), med_edge(None, 'r'), med_edge(None, 't'), med_edge(None, 'b')
# corner radius from the diagonal inset: d = r * (sqrt2 - 1) * sqrt2 / sqrt2 ... measured along the 45deg diagonal
def diag_inset(cx, cy, dx, dy):
    for t in range(0, 400):
        x, y = int(round(cx + dx * t)), int(round(cy + dy * t))
        if m[y, x]: return t * np.sqrt(2)
    return 0
d = np.mean([diag_inset(L, T, 1, 1), diag_inset(R - 1, T, -1, 1), diag_inset(L, B - 1, 1, -1), diag_inset(R - 1, B - 1, -1, -1)])
rad = d / (np.sqrt(2) - 1)

def rrect(box, r, ss=4):
    l, t, rr, bb = box
    big = Image.new('L', (W * ss, H * ss), 0)
    ImageDraw.Draw(big).rounded_rectangle([l * ss, t * ss, rr * ss - 1, bb * ss - 1], radius=r * ss, fill=255)
    return np.asarray(big.resize((W, H), Image.BOX), np.float32) / 255

scr = rrect((L, T, R, B), rad)
key = greenness(a)
key_soft = np.asarray(Image.fromarray((key * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.7)), np.float32) / 255
inner = ndi.binary_erosion(scr > .99, iterations=3)
hole = np.where(inner, key_soft, scr)  # clean geometric edge; inside, the key keeps the camera pill opaque
# camera pill = non-green component inside the screen
pill = inner & (key < .5)
plab, pn = ndi.label(pill)
pill_box = None
if pn:
    sizes = np.bincount(plab.ravel())[1:]; pid = np.argmax(sizes) + 1
    py, px = np.nonzero(plab == pid)
    pill_box = [int(px.min()), int(py.min()), int(px.max() - px.min() + 1), int(py.max() - py.min() + 1)]
    other = int(sizes.sum() - sizes.max())
else:
    other = 0
# despill: within 10 px of the screen, green may not exceed max(r, b)
near = ndi.binary_dilation(scr > 0, iterations=10)
g_cap = np.maximum(a[..., 0], a[..., 2])
a[..., 1] = np.where(near & (a[..., 1] > g_cap), g_cap, a[..., 1])

# 4. background key (pure white)
corners = np.concatenate([a[:40, :40].reshape(-1, 3), a[:40, -40:].reshape(-1, 3)])
bg = np.median(corners, 0)
dist = np.sqrt(((a - bg) ** 2).sum(-1))
al = np.clip((dist - 10) / 26, 0, 1)
al = np.asarray(Image.fromarray((al * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(3)), np.float32) / 255
solid = ndi.binary_fill_holes((al > .5) | (scr > .5))
solid = ndi.binary_opening(solid, iterations=2)
lab, n = ndi.label(solid)
keep = lab == (np.argmax(np.bincount(lab.ravel())[1:]) + 1)
# edge unmixing: each edge pixel c = alpha*f + (1-alpha)*bg, with f = colour of the nearest interior pixel
core = ndi.binary_erosion(keep & ((dist > 30) | (scr > .5)), iterations=5)  # white gaps between arm hairs never count as core
band = ndi.binary_dilation(keep, iterations=3) & ~core
_, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
f = a[iy, ix]
v = bg - f
al_u = np.clip(((bg - a) * v).sum(-1) / np.maximum((v * v).sum(-1), 1), 0, 1)
al = np.where(core, 1, np.where(band, al_u, 0))
al = np.where(band & (al < .04), 0, al)
aa = np.clip(al, 1e-3, 1)[..., None]
fg = np.clip((a - (1 - aa) * bg) / aa, 0, 255)
fg = np.where((al < .35)[..., None], f, fg)
fg = np.where(core[..., None], a, fg)
alpha = al * (1 - hole)
rgba = np.dstack([fg, alpha * 255]).round().astype(np.uint8)
rgba[rgba[..., 3] == 0, :3] = 0
master = Image.fromarray(rgba)

# 5. front layer: skin inside the phone's outer silhouette
dark = (a.max(-1) < 70) & keep
def run_out(y, x, dx, dy):
    t = 0
    while 0 <= y < H and 0 <= x < W and (scr[y, x] > .5 or dark[y, x]):
        y += dy; x += dx; t += 1
    return t
cx, cy = int((L + R) / 2), int((T + B) / 2)
bz_t = run_out(int(T) + 2, cx, 0, -1) - 2
rows = range(int(T + rad + 10), int(T + .3 * (B - T)))
bz_l = int(np.median([run_out(y, int(L) + 2, -1, 0) - 2 for y in rows]))
bz_r = int(np.median([run_out(y, int(R) - 3, 1, 0) - 3 for y in rows]))
bz = int(round(np.median([bz_t, bz_l, bz_r])))
outer_box = (L - bz, T - bz, R + bz, B + bz)
outer = rrect(outer_box, rad + bz)
r_, g_, b_ = a[..., 0], a[..., 1], a[..., 2]
skin = (r_ - b_ > 18) & (r_ > 70) & (r_ >= g_) & keep
skin = ndi.binary_opening(skin, iterations=2)
skin = ndi.binary_fill_holes(skin)
slab, sn = ndi.label(skin & (outer > .5))
front_m = np.zeros_like(skin)
for i in range(1, sn + 1):
    c = slab == i
    if c.sum() > 400: front_m |= c
front_m = ndi.binary_dilation(front_m, iterations=2) & keep
fsoft = np.asarray(Image.fromarray((front_m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255
fa = fsoft * outer * alpha
frgba = np.dstack([fg, fa * 255]).round().astype(np.uint8); frgba[frgba[..., 3] == 0, :3] = 0
front = Image.fromarray(frgba)
fy, fx = np.nonzero(fa > .5)
front_box = [int(fx.min()), int(fy.min()), int(fx.max() - fx.min() + 1), int(fy.max() - fy.min() + 1)] if len(fx) else None

# save
has_front = front_box is not None and int((fa > .5).sum()) > 500
layers = ((master, ''), (front, '-front')) if has_front else ((master, ''),)
for img, suf in layers:
    img.save(f'{OUT}/{stem}{suf}.png', optimize=True)
for h in (2400, 1600):
    s = h / H
    for img, suf in layers:
        (img if s == 1 else img.resize((round(W * s), h), Image.LANCZOS)).save(f'{APP}/{stem}{suf}-{h}.webp', quality=88, method=6)

# previews: dark screen on Paper and on Ink, plus a layer check
def comp(bgc, screen_col=(17, 17, 17), front_tint=None):
    base = Image.new('RGBA', (W, H), bgc + (255,))
    sc_img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sc_img).rounded_rectangle([L, T, R, B], radius=rad, fill=screen_col + (255,))
    base.alpha_composite(sc_img); base.alpha_composite(master)
    if front_tint:
        ov = Image.new('RGBA', (W, H), front_tint + (0,)); ov.putalpha(Image.fromarray((fa * 150).astype(np.uint8)))
        base.alpha_composite(ov)
    return base.convert('RGB')
p = Image.new('RGB', (W * 3, H), (255, 255, 255))
p.paste(comp(PAPER), (0, 0)); p.paste(comp(INK, (5, 5, 5)), (W, 0)); p.paste(comp(PAPER, (17, 17, 17), (255, 0, 120)), (W * 2, 0))
p.resize((W * 3 // 2, H // 2), Image.LANCZOS).save(f'{APP}/_preview/{stem}-preview.png', optimize=True)

data = dict(variant=var, file=f'{stem}.png', size=[W, H], deskew_deg=round(-ang, 2),
            screen=dict(x=round(L, 1), y=round(T, 1), w=round(R - L, 1), h=round(B - T, 1), radius=round(float(rad), 1)),
            camera_pill=pill_box, other_non_green_px_in_screen=other,
            phone_outer=dict(x=round(outer_box[0], 1), y=round(outer_box[1], 1), w=round(outer_box[2] - outer_box[0], 1),
                             h=round(outer_box[3] - outer_box[1], 1), radius=round(float(rad + bz), 1), bezel=bz),
            front_layer_bbox=front_box, front_px=int((fa > .5).sum()))
print(json.dumps(data))

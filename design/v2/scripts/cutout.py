import sys, json, numpy as np
from PIL import Image, ImageFilter
src, out_full, out_alpha = sys.argv[1:4]
im = Image.open(src).convert('RGB').transpose(Image.FLIP_LEFT_RIGHT)
im.save(out_full)
a = np.asarray(im).astype(np.float32)
h, w, _ = a.shape
corners = np.concatenate([a[:40,:40].reshape(-1,3), a[:40,-40:].reshape(-1,3), a[:40, w//2-20:w//2+20].reshape(-1,3)])
bg = np.median(corners, axis=0)
d = np.sqrt(((a - bg)**2).sum(-1))
t0, t1 = 26.0, 60.0
al = np.clip((d - t0)/(t1 - t0), 0, 1)
m = Image.fromarray((al*255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
al = np.asarray(m).astype(np.float32)/255
# fill holes: rows/cols inside hull — simple: for each row, fill between first and last solid pixel only if gap small
solid = al > .5
ys, xs = np.nonzero(solid)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 24
x0, y0 = max(0, x0-pad), max(0, y0-pad); x1, y1 = min(w-1, x1+pad), h-1
aa = np.clip(al, 1e-3, 1)[...,None]
fg = np.clip((a - (1-aa)*bg)/aa, 0, 255)
fg = np.where(al[...,None] > .98, a, fg)
rgba = np.dstack([fg, al*255]).astype(np.uint8)
crop = rgba[y0:y1+1, x0:x1+1]
Image.fromarray(crop).save(out_alpha)
# index finger axis in crop coords
s = crop[...,3] > 128
H, W = s.shape
rows = []
tip = None
for y in range(H):
    xs_ = np.nonzero(s[y])[0]
    if len(xs_) == 0: continue
    # first run
    run_start = xs_[0]; run_end = run_start
    for x in xs_[1:]:
        if x == run_end + 1: run_end = x
        else: break
    if tip is None: tip = y
    rows.append((y, run_start, run_end, len(xs_)))
widths = [r[2]-r[1]+1 for r in rows]
ref = np.median(widths[20:120])
base = None
for (y, a_, b_, n), wd in zip(rows, widths):
    if y > tip + 60 and (n > 1.6*ref):  # another finger/knuckle joins the row
        base = y; break
fr = [(y, (a_+b_)/2) for (y,a_,b_,n) in rows if tip+5 <= y < base]
Y = np.array([r[0] for r in fr]); X = np.array([r[1] for r in fr])
k, c = np.polyfit(Y, X, 1)
ang = float(np.degrees(np.arctan(k)))
res = dict(file=out_alpha, size=[W, H], crop_offset_in_flipped_full=[int(x0), int(y0)],
           fingertip=[round(float(k*tip+c),1), int(tip)], finger_base_knuckle_row=[round(float(k*base+c),1), int(base)],
           finger_width_px=round(float(ref),1), axis_tilt_deg_from_vertical=round(ang,2),
           note="x grows right, y grows down; tilt>0 = fingertip leans left")
print(json.dumps(res, indent=1))

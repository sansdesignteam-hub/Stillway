"""Stage 2 (D-080): split/merge overlapping 3:2 tiles of the master for AI detail refinement.
split: hero-tiles.py split MASTER.png WORKDIR      -> WORKDIR/tile-<c><r>-in.png (1536x1024) + tiles.json
merge: hero-tiles.py merge MASTER.png WORKDIR SRC OUT.png  (uses tile-<c><r>-out.png where present, re-pastes SRC)"""
import sys, json, os, numpy as np
from PIL import Image, ImageFilter
mode, master_p, wd = sys.argv[1:4]
TW, TH = 2100, 1400
M = Image.open(master_p).convert('RGB'); MW, MH = M.size
xs = [0, (MW - TW) // 2, MW - TW]; ys = [0, (MH - TH) // 2, MH - TH]
def feather_mask(w, h, f):
    r = np.minimum.reduce([np.arange(w)[None, :].repeat(h, 0), np.arange(w)[::-1][None, :].repeat(h, 0),
                           np.arange(h)[:, None].repeat(w, 1), np.arange(h)[::-1][:, None].repeat(w, 1)]).astype(np.float32)
    m = np.clip(r / f, 0, 1); return m * m * (3 - 2 * m)
if mode == 'split':
    os.makedirs(wd, exist_ok=True); tiles = []
    for r, y in enumerate(ys):
        for c, x in enumerate(xs):
            if r == 1 and c == 1: continue            # centre tile lies inside the original photo
            M.crop((x, y, x + TW, y + TH)).resize((1536, 1024), Image.LANCZOS).save(f'{wd}/tile-{c}{r}-in.png')
            tiles.append(dict(id=f'{c}{r}', x=x, y=y))
    json.dump(dict(TW=TW, TH=TH, tiles=tiles), open(f'{wd}/tiles.json', 'w')); print(len(tiles), 'tiles')
else:
    src = Image.open(sys.argv[4]).convert('RGB'); out_p = sys.argv[5]
    meta = json.load(open(f'{wd}/tiles.json'))
    acc = np.asarray(M, np.float32).copy(); wsum = np.ones((MH, MW), np.float32) * 1e-3
    acc *= wsum[..., None]
    fm = feather_mask(TW, TH, 260)
    used = []
    for t in meta['tiles']:
        p = f"{wd}/tile-{t['id']}-out.png"
        if not os.path.exists(p): continue
        im = np.asarray(Image.open(p).convert('RGB').resize((TW, TH), Image.LANCZOS), np.float32)
        # tone match: keep refined high-frequency detail, take low-frequency tone/colour from the stage-1 master
        x0, y0 = t['x'], t['y']
        base = M.crop((x0, y0, x0 + TW, y0 + TH))
        lp = lambda a: np.asarray(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(48)), np.float32)
        im = np.clip(im - lp(im) + lp(np.asarray(base, np.float32)), 0, 255)
        # keep borders that touch the canvas edge fully weighted
        m = fm.copy(); x, y = t['x'], t['y']
        if x == 0: m[:, :260] = np.maximum(m[:, :260], fm[:, 260:261])
        if x + TW == MW: m[:, -260:] = np.maximum(m[:, -260:], fm[:, -261:-260])
        if y == 0: m[:260, :] = np.maximum(m[:260, :], fm[260:261, :])
        if y + TH == MH: m[-260:, :] = np.maximum(m[-260:, :], fm[-261:-260, :])
        acc[y:y + TH, x:x + TW] += im * m[..., None]; wsum[y:y + TH, x:x + TW] += m; used.append(t['id'])
    out = Image.fromarray(np.clip(acc / wsum[..., None], 0, 255).astype(np.uint8))
    SW, SH = src.size; OX, OY = (MW - SW) // 2, (MH - SH) // 2
    out.paste(src, (OX, OY), Image.fromarray((feather_mask(SW, SH, 140) * 255).astype(np.uint8)))
    out.save(out_p); print('merged', used)

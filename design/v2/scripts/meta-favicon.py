"""Favicon from the Geist Medium "S" (logo = text, D-083). Ink #231F20 on Paper #F9F5EF.
SVG uses the real glyph outline (no font dependency); PNGs rasterise the same outline at 16x, then downsample."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image, ImageDraw
font_p, outdir = sys.argv[1], sys.argv[2]
INK, PAPER = "#231F20", "#F9F5EF"
f = TTFont(font_p); gs = f.getGlyphSet(); g = gs[f.getBestCmap()[ord("S")]]
bp = BoundsPen(gs); g.draw(bp); xmin, ymin, xmax, ymax = bp.bounds

def transform(size, glyph_h):
    s = glyph_h / (ymax - ymin)
    w = (xmax - xmin) * s
    dx = (size - w) / 2 - xmin * s
    dy = (size + glyph_h) / 2 + ymin * s      # y flip: y' = dy - y*s
    return (s, 0, 0, -s, dx, dy)

# --- SVG, 32x32 viewBox: rounded Paper tile, S cap height 22 (reads at 16 px)
t = transform(32, 22)
sp = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
g.draw(TransformPen(sp, t))
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">'
       f'<rect width="32" height="32" rx="7" fill="{PAPER}"/>'
       f'<path fill="{INK}" d="{sp.getCommands()}"/></svg>\n')
open(f"{outdir}/favicon.svg", "w").write(svg)

# --- raster: flatten glyph to polygons at high res
def raster(size, glyph_h, radius, ss=16):
    S = size * ss
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if radius: d.rounded_rectangle((0, 0, S - 1, S - 1), radius * ss, fill=PAPER)
    else: d.rectangle((0, 0, S, S), fill=PAPER)
    a, b, c, dd, e, ff = transform(size, glyph_h)
    rp = RecordingPen(); g.draw(rp)
    contours, cur, pos = [], [], None
    def P(x, y): return ((a * x + e) * ss, (dd * y + ff) * ss)
    def bez(pts, n=24):
        # pts: control points incl. start; quadratic (3) or cubic (4)
        out = []
        for i in range(1, n + 1):
            u = i / n; q = list(pts)
            while len(q) > 1: q = [((1-u)*q[k][0]+u*q[k+1][0], (1-u)*q[k][1]+u*q[k+1][1]) for k in range(len(q)-1)]
            out.append(q[0])
        return out
    for op, args in rp.value:
        if op == "moveTo": cur = [args[0]]; pos = args[0]
        elif op == "lineTo": cur.append(args[0]); pos = args[0]
        elif op == "qCurveTo":   # TrueType implied on-curve points
            offs, end = list(args[:-1]), args[-1]
            for i, o in enumerate(offs):
                nxt = end if i == len(offs) - 1 else ((o[0]+offs[i+1][0])/2, (o[1]+offs[i+1][1])/2)
                cur += bez([pos, o, nxt]); pos = nxt
        elif op == "curveTo": cur += bez([pos, *args]); pos = args[-1]
        elif op in ("closePath", "endPath"): contours.append(cur); cur = []
    # even-odd fill via XOR of contour masks (S has no counters, but stay generic)
    mask = Image.new("1", (S, S), 0)
    for ctr in contours:
        m = Image.new("1", (S, S), 0); ImageDraw.Draw(m).polygon([P(*p) for p in ctr], fill=1)
        mask = Image.frombytes("1", (S, S), bytes(x ^ y for x, y in zip(mask.tobytes(), m.tobytes())))
    im.paste(Image.new("RGBA", (S, S), INK), (0, 0), mask)
    return im.resize((size, size), Image.LANCZOS)

raster(32, 22, 7).save(f"{outdir}/favicon-32.png", optimize=True)
raster(180, 104, 0).convert("RGB").save(f"{outdir}/apple-touch-icon.png", optimize=True)  # iOS masks corners itself; opaque
print("bounds", xmin, ymin, xmax, ymax)

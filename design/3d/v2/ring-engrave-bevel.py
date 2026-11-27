"""QA G-18: rounded lip on the engraved "Stillway" (D-071 outline, depth and position kept).

The hard 0.10 mm boolean wall showed as sub-pixel white dashes on the web. This rebuilds only the
engraved patch of Ring_Shell: glyph outline unchanged at the floor, a rounded lip of radius LIP at
the surface edge, analytic custom normals (surface -> wall, continuous). Run once:

  blender -b stillway-ring-v2.blend -P ring-engrave-bevel.py -- --save
"""
import bpy, bmesh, math, sys
from mathutils import Vector
from mathutils.geometry import delaunay_2d_cdt

LIP = 0.040      # mm, lip radius (= width on the surface and depth where the wall starts)
DEPTH = 0.100    # mm, D-071
STEPS = 3        # segments of the quarter round
CORNER = 35.0    # degrees: sharper turns of the outline are real glyph corners
MERGE = 0.008    # mm, boolean slivers on the outline
SEG = 0.045      # mm, longest outline segment on curves (straight runs: 5x)

obj = bpy.data.objects['Ring_Shell']
old = obj.data
if old.get('g18_lip'):
    raise SystemExit('Ring_Shell already has the G-18 lip')

bm = bmesh.new(); bm.from_mesh(old); bm.verts.ensure_lookup_table(); bm.faces.ensure_lookup_table()
R0 = max(math.hypot(v.co.x, v.co.y) for v in bm.verts)
radius = lambda co: math.hypot(co.x, co.y)
# unwrapped surface coordinates in mm: s along the band, z across it
unwrap = lambda co: Vector((math.atan2(co.y, co.x) * R0 * 1000, co.z * 1000))

# crown profile r(z), from the untouched shell far from the logo
prof = {}
for v in bm.verts:
    if radius(v.co) > 0.0115 and abs(v.co.y) > 0.0062 and v.co.x > 0 and abs(v.co.z) < 0.0034:
        z = round(v.co.z * 1000, 3); prof[z] = max(prof.get(z, 0), radius(v.co) * 1000)
prof = sorted(prof.items())
def R(z):
    # Catmull-Rom through the profile rows (mm)
    i = max(1, min(len(prof) - 3, next((k for k, p in enumerate(prof) if p[0] > z), len(prof)) - 1))
    (z0, r0), (z1, r1), (z2, r2), (z3, r3) = prof[i - 1:i + 3]
    h = z2 - z1; t = (z - z1) / h
    m1 = (r2 - r0) / (z2 - z0) * h; m2 = (r3 - r1) / (z3 - z1) * h
    t2, t3 = t * t, t * t * t
    return (2*t3 - 3*t2 + 1)*r1 + (t3 - 2*t2 + t)*m1 + (-2*t3 + 3*t2)*r2 + (t3 - t2)*m2
dR = lambda z: (R(z + 0.02) - R(z - 0.02)) / 0.04

def to3d(p, depth):
    th = p.x / (R0 * 1000); r = R(p.y) - depth
    return Vector((r * math.cos(th), r * math.sin(th), p.y)) / 1000
def frame(p):
    th = p.x / (R0 * 1000)
    n = Vector((math.cos(th), math.sin(th), -dR(p.y))).normalized()
    return n, Vector((-math.sin(th), math.cos(th), 0))
def tangent3(p, d2):  # 2D surface direction -> 3D unit vector
    _, es = frame(p); th = p.x / (R0 * 1000)
    ez = Vector((math.cos(th) * dR(p.y), math.sin(th) * dR(p.y), 1)).normalized()
    return (es * d2.x + ez * d2.y).normalized()

# ---- glyph outlines = the boolean rim loops
# (the liner-side face of material 1 at r 10.42 is a boolean leftover, not part of the logo)
rim = [e for e in bm.edges if {f.material_index for f in e.link_faces} == {0, 1} and radius(e.verts[0].co) > 0.0115]
adj = {}
for e in rim:
    a, b = e.verts
    adj.setdefault(a, []).append(b); adj.setdefault(b, []).append(a)
loops, seen = [], set()
for v0 in adj:
    if v0 in seen: continue
    loop, prev, v = [], None, v0
    while v not in seen:
        seen.add(v); loop.append(unwrap(v.co))
        nxt = adj[v][0] if adj[v][0] != prev else adj[v][1]
        prev, v = v, nxt
    loops.append(loop)

def turn(a, b, c):
    u, w = b - a, c - b
    return math.degrees(u.angle(w)) if u.length > 1e-9 and w.length > 1e-9 else 0

def clean(lp):
    # drop slivers (shortest first) and collinear points, then refine the curves
    lp = list(lp)
    while len(lp) > 3:
        n = len(lp)
        i = min(range(n), key=lambda i: (lp[(i+1) % n] - lp[i]).length)
        if (lp[(i+1) % n] - lp[i]).length >= MERGE: break
        j = (i + 1) % n
        ti = turn(lp[i-1], lp[i], lp[j]); tj = turn(lp[i], lp[j], lp[(j+1) % n])
        del lp[j if ti >= tj else i]
    out = []
    n = len(lp)
    corner = [turn(lp[i-1], lp[i], lp[(i+1) % n]) > CORNER for i in range(n)]
    for i in range(n):
        p0, p1, p2, p3 = lp[i-1], lp[i], lp[(i+1) % n], lp[(i+2) % n]
        out.append(p1)
        L = (p2 - p1).length
        bend = max(turn(p0, p1, p2), turn(p1, p2, p3))
        k = int(math.ceil(L / (SEG if 2 < bend <= CORNER and L < 0.2 else SEG * 5)))
        if k < 2: continue
        # curve through neighbours only where the outline is smooth and the segments are similar
        smooth = lambda c, q: not c and (q.length < 3 * L)
        m1 = (p2 - p0) * 0.5 if smooth(corner[i], p1 - p0) else p2 - p1
        m2 = (p3 - p1) * 0.5 if smooth(corner[(i+1) % n], p3 - p2) else p2 - p1
        if L > 0.2: m1 = m2 = p2 - p1
        for s in range(1, k):
            t = s / k; t2, t3 = t*t, t*t*t
            out.append(p1*(2*t3 - 3*t2 + 1) + m1*(t3 - 2*t2 + t) + p2*(-2*t3 + 3*t2) + m2*(t3 - t2))
    return out
loops = [clean(l) for l in loops]

def inside(p, lp):
    c = False
    for i in range(len(lp)):
        a, b = lp[i-1], lp[i]
        if (a.y > p.y) != (b.y > p.y) and p.x < a.x + (p.y - a.y) / (b.y - a.y) * (b.x - a.x):
            c = not c
    return c
in_groove = lambda p, ls: sum(inside(p, l) for l in ls) % 2 == 1

# orient every loop so the groove is on its left
for k, lp in enumerate(loops):
    depth = sum(inside(lp[0], o) for j, o in enumerate(loops) if j != k)
    area = sum(lp[i-1].cross(lp[i]) for i in range(len(lp))) / 2
    if (area > 0) != (depth % 2 == 0): lp.reverse()

left = lambda d: Vector((-d.y, d.x)).normalized()   # into the groove

def offset(lp, dist):
    """loop moved `dist` out of the groove (mitred), point for point"""
    n = len(lp); out = []
    for i in range(n):
        a = left(lp[i] - lp[i-1]); b = left(lp[(i+1) % n] - lp[i])
        m = (a + b).normalized() if (a + b).length > 1e-6 else a
        out.append(lp[i] - m * (dist / max(0.5, m.dot(a))))
    # where the offset folds back (tight inner curves) weld the run into one point
    group = list(range(n))
    for _ in range(20):
        changed = False
        for i in range(n):
            j = (i + 1) % n
            if group[i] != group[j] and (out[j] - out[i]).dot(lp[j] - lp[i]) <= 0:
                gi, gj = group[i], group[j]
                members = [k for k in range(n) if group[k] in (gi, gj)]
                c = sum((out[k] for k in members), Vector((0, 0))) / len(members)
                for k in members: group[k] = gi; out[k] = c
                changed = True
        if not changed: break
    # small loops left at inner corners: weld everything between two crossing segments
    cross = lambda a, b, c: (b - a).cross(c - a)
    for _ in range(50):
        hit = None
        for i in range(n):
            p, q = out[i], out[(i+1) % n]
            for k in range(2, min(24, n - 2)):
                j = (i + k) % n; a, b = out[j], out[(j+1) % n]
                if cross(p, q, a) * cross(p, q, b) < -1e-14 and cross(a, b, p) * cross(a, b, q) < -1e-14:
                    t = cross(a, b, p) / (cross(a, b, p) - cross(a, b, q))
                    hit = (i, k, p.lerp(q, t)); break
            if hit: break
        if not hit: break
        i, k, c = hit
        for m in range(1, k + 1): out[(i + m) % n] = c
    return out

phis = [math.pi / 2 * i / STEPS for i in range(STEPS + 1)]
rings = [[offset(l, LIP * (1 - math.sin(f))) for l in loops] for f in phis]
depths = [LIP * (1 - math.cos(f)) for f in phis]

# ---- the patch to replace: engraving faces and every outer face under/around the logo
def outer_patch(f):
    c = f.calc_center_median()
    if radius(c) < 0.0115 or c.x < 0: return False
    if f.material_index == 1: return True
    p = [unwrap(v.co) for v in f.verts]
    return any(v in adj for v in f.verts) or (abs(unwrap(c).y) < 1.5 and abs(unwrap(c).x) < 5.6)
drop = {f for f in bm.faces if outer_patch(f)}
border = [e for e in bm.edges if sum(f in drop for f in e.link_faces) == 1]
bverts = list({v for e in border for v in e.verts})

# ---- new geometry
old_cn = [Vector(c.vector) for c in old.corner_normals]
uv_old = old.uv_layers.active.data if old.uv_layers.active else None
verts = [v.co.copy() for v in bm.verts]
faces, mats, normals, uvs = [], [], [], []
for poly in old.polygons:
    if bm.faces[poly.index] in drop: continue
    faces.append(list(poly.vertices)); mats.append(poly.material_index)
    normals += [old_cn[i] for i in poly.loop_indices]
    uvs += [Vector(uv_old[i].uv) for i in poly.loop_indices]

# UV: u linear in the angle, v linear in z (brushed normal map), fitted on the old patch
def fit(xs, ys):
    n = len(xs); mx, my = sum(xs)/n, sum(ys)/n
    a = sum((x-mx)*(y-my) for x, y in zip(xs, ys)) / sum((x-mx)**2 for x in xs)
    return a, my - a*mx
S, Z, U, V = [], [], [], []
for poly in old.polygons:
    if bm.faces[poly.index] in drop and poly.material_index == 0:
        c = [unwrap(old.vertices[i].co) for i in poly.vertices]
        if max(abs(p.x) for p in c) < 6:
            for p, li in zip(c, poly.loop_indices):
                S.append(p.x); Z.append(p.y); U.append(uv_old[li].uv[0]); V.append(uv_old[li].uv[1])
base = U[0]; per = None
# unwrap integer jumps of the tiling before fitting
ref_a = 36 / (2 * math.pi * R0 * 1000)
off = sorted(u - ref_a * s for u, s in zip(U, S))[len(U)//2]
U = [u - round(u - ref_a*s - off) for u, s in zip(U, S)]
ua, ub = fit(S, U); va, vb = fit(Z, V)
uvf = lambda p: Vector((ua*p.x + ub, va*p.y + vb))
print('uv fit', ua, ref_a, ub, va, vb, 'max err', max(abs(ua*s+ub-u) for s, u in zip(S, U)), max(abs(va*z+vb-v) for z, v in zip(Z, V)))

def add(co):
    verts.append(co); return len(verts) - 1
def face(idx, pts2, nrm, mat):
    # drop welded corners; wind the face to agree with its normals
    k = [i for i in range(len(idx)) if idx[i] != idx[i-1]]
    if len({idx[i] for i in k}) < 3: return
    idx = [idx[i] for i in k]; pts2 = [pts2[i] for i in k]; nrm = [nrm[i] for i in k]
    c = [verts[i] for i in idx]
    fn = Vector((0, 0, 0))
    for i in range(len(c)): fn += c[i-1].cross(c[i])
    if fn.dot(sum(nrm, Vector((0, 0, 0)))) < 0:
        idx.reverse(); pts2.reverse(); nrm.reverse()
    faces.append(idx); mats.append(mat); normals.extend(nrm); uvs.extend(uvf(p) for p in pts2)

# vertex ids per ring/loop (welded points share one id)
cache = {}
def vid(p, depth):
    key = (round(p.x, 6), round(p.y, 6), round(depth, 6))
    if key not in cache: cache[key] = add(to3d(p, depth))
    return cache[key]
ids = [[[vid(p, depths[r]) for p in rings[r][k]] for k in range(len(loops))] for r in range(STEPS + 1)]
floor_ids = [[vid(p, DEPTH) for p in loops[k]] for k in range(len(loops))]

for k, lp in enumerate(loops):
    n = len(lp)
    sharp = [turn(lp[i-1], lp[i], lp[(i+1) % n]) > CORNER for i in range(n)]
    seg_n = [left(lp[(i+1) % n] - lp[i]) for i in range(n)]
    def side(i, s):  # in-surface direction into the groove at point i, for segment s
        if sharp[i]: return seg_n[s]
        return (seg_n[i-1] + seg_n[i]).normalized()
    def nrm(p, d2, phi):
        return (frame(p)[0] * math.cos(phi) + tangent3(p, d2) * math.sin(phi)).normalized()
    for s in range(n):
        t = (s + 1) % n
        for r in range(STEPS + 1):
            if r < STEPS:
                a, b, pa, pb, phi_a, phi_b = ids[r][k], ids[r+1][k], rings[r][k], rings[r+1][k], phis[r], phis[r+1]
            else:   # the straight wall down to the floor
                a, b, pa, pb, phi_a, phi_b = ids[r][k], floor_ids[k], rings[r][k], lp, math.pi/2, math.pi/2
            face([a[s], a[t], b[t], b[s]], [pa[s], pa[t], pb[t], pb[s]],
                 [nrm(pa[s], side(s, s), phi_a), nrm(pa[t], side(t, s), phi_a),
                  nrm(pb[t], side(t, s), phi_b), nrm(pb[s], side(s, s), phi_b)], 1)

def triangulate(constraint_loops, extra_edges_pts, grid_box, keep, depth, point_ids, mat):
    pts, edges, vmap = [], [], []
    index = {}
    def point(p, i):
        if i not in index:
            index[i] = len(pts); pts.append(p); vmap.append(i)
        return index[i]
    for lp, lid in zip(constraint_loops, point_ids):
        loc = [point(p, i) for p, i in zip(lp, lid)]
        edges += [(loc[i-1], loc[i]) for i in range(len(loc)) if loc[i-1] != loc[i]]
    for (p, i), (q, j) in extra_edges_pts:
        edges.append((point(p, i), point(q, j)))
    segs = [(pts[a], pts[b]) for a, b in edges]
    def near(p, d):
        for a, b in segs:
            if min(a.x, b.x) - d > p.x or max(a.x, b.x) + d < p.x or min(a.y, b.y) - d > p.y or max(a.y, b.y) + d < p.y: continue
            ab = b - a; t = max(0, min(1, (p - a).dot(ab) / max(ab.length_squared, 1e-12)))
            if (p - a - ab*t).length < d: return True
        return False
    x0, x1, y0, y1 = grid_box
    nx, ny = int((x1-x0)/0.16), int((y1-y0)/0.16)
    for i in range(nx + 1):
        for j in range(ny + 1):
            p = Vector((x0 + (x1-x0)*i/nx, y0 + (y1-y0)*j/ny))
            if keep(p) and not near(p, 0.06):
                pts.append(p); vmap.append(None)
    out_v, _, out_f, orig_v, _, _ = delaunay_2d_cdt(pts, edges, [], 0, 1e-6)
    new_ids = []
    for p, o in zip(out_v, orig_v):
        gid = next((vmap[i] for i in o if vmap[i] is not None), None)
        new_ids.append(add(to3d(p, depth)) if gid is None else gid)
    for tri in out_f:
        c = (out_v[tri[0]] + out_v[tri[1]] + out_v[tri[2]]) / 3
        if keep(c):
            face([new_ids[i] for i in tri], [Vector(out_v[i]) for i in tri],
                 [frame(Vector(out_v[i]))[0] for i in tri], mat)

# outer surface between the patch border and the top of the lip
bedges = [((unwrap(a.co), a.index), (unwrap(b.co), b.index)) for a, b in (e.verts for e in border)]
def in_patch(p):
    c = False
    for (a, _), (b, _) in bedges:
        if (a.y > p.y) != (b.y > p.y) and p.x < a.x + (p.y - a.y) / (b.y - a.y) * (b.x - a.x):
            c = not c
    return c
top = rings[0]
box = lambda pts: (min(p.x for p in pts), max(p.x for p in pts), min(p.y for p in pts), max(p.y for p in pts))
triangulate(top, bedges, box([unwrap(v.co) for v in bverts]),
            lambda p: in_patch(p) and not in_groove(p, top), 0.0, ids[0], 0)
# floor, outline = D-071
triangulate(loops, [], box([p for l in loops for p in l]), lambda p: in_groove(p, loops), DEPTH, floor_ids, 1)

# ---- compact and write
used = sorted({i for f in faces for i in f}); remap = {o: n for n, o in enumerate(used)}
me = bpy.data.meshes.new(old.name + '_g18')
me.from_pydata([verts[i] for i in used], [], [[remap[i] for i in f] for f in faces])
for m in old.materials: me.materials.append(m)
me.polygons.foreach_set('material_index', mats)
me.polygons.foreach_set('use_smooth', [True] * len(me.polygons))
layer = me.uv_layers.new(name=old.uv_layers.active.name)
layer.data.foreach_set('uv', [c for u in uvs for c in u])
assert len(me.loops) == len(normals), (len(me.loops), len(normals))
me.normals_split_custom_set([tuple(n) for n in normals])
me['g18_lip'] = LIP
check = bmesh.new(); check.from_mesh(me)
print('G18 loops', len(loops), 'verts', len(me.vertices), 'faces', len(me.polygons),
      'open edges', sum(len(e.link_faces) == 1 for e in check.edges),
      'edges >2 faces', sum(len(e.link_faces) > 2 for e in check.edges))
check.free(); bm.free()
name = old.name
old.name = name + '_pre_g18'; old.use_fake_user = True
obj.data = me; me.name = name

if '--save' in sys.argv:
    bpy.ops.wm.save_mainfile()

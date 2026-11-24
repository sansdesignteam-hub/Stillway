"""
Stillway V2 S06 — light pine table (D-144). Run inside Blender 5.x through Blender MCP:

    g = {}; exec(open(WT + "/design/3d/v2/s06-table-build.py").read(), g)
    g["textures"]()      # bake the procedural pine into the 2K atlas (numpy) -> tex/s06-table-*.webp
    g["table"]()         # low-poly bevelled block + atlas UVs + PBR material
    g["export"]()        # design/3d/v2/s06-table.glb (WebP textures)
    g["review"]()        # two 1440 x 900 review renders with the silver_polished ring
    # (the review scene imports the exported GLB, so the renders show the web asset itself)

Units: table-local millimetres, stored in metres (Blender), so it matches the ring GLB
(outer diameter 23.84 mm). Origin = point where the ring leaves the table: top surface (z = 0),
right edge (x = 0), at the ring contact depth (y = 0). Table spans x -200..0, y -33.2 (front,
toward the camera) .. +116.8 (back), z -30..0. Grain runs along X (the rolling direction).

The wood is a 3D growth-ring field around a pith line along X, sampled at the 3D position of
every texel, so the top shows flat-sawn grain (straight lines with soft cathedrals at the back),
the front shows edge grain and the right end shows end grain arcs.
"""
import bpy, bmesh, math, os
import numpy as np
from mathutils import Vector, Quaternion, Matrix

WT = "/Users/zaimmaulana/Orca/workspaces/Smart Ring/04.-3D-Designer"
V2 = WT + "/design/3d/v2"
TEX = V2 + "/tex"
RENDERS = V2 + "/renders"
RING_GLB = V2 + "/stillway-ring-v2-silver-polished_web.glb"
ENV = V2 + "/env/v2-env-paper-polished.exr"

# ------------------------------------------------------------------ dimensions (mm, table local)
W_X = (-200.0, 0.0)          # left .. right edge (right edge = drop edge)
D_Y = (-33.2, 116.8)         # front .. back
H_Z = (-30.0, 0.0)           # bottom .. top
BEVEL = 0.8                  # mm, 3 segments

# ------------------------------------------------------------------ atlas (2048 px, rows from bottom)
N = 2048
# name: (row0, row1 assigned), inner px rect (c0, c1, r0, r1), u-axis (axis, a, b), v-axis (axis, a, b)
ISLANDS = {
    "end":   dict(rows=(0, 250),    rect=(4, 2044, 4, 244),    u=("y",) + D_Y, v=("z",) + H_Z, plane=("x", 0.0)),
    "front": dict(rows=(250, 502),  rect=(4, 2044, 256, 496),  u=("x",) + W_X, v=("z",) + H_Z, plane=("y", D_Y[0])),
    "top":   dict(rows=(502, 2048), rect=(4, 2044, 508, 2044), u=("x",) + W_X, v=("y",) + D_Y, plane=("z", 0.0)),
}
AX = {"x": 0, "y": 1, "z": 2}


# ------------------------------------------------------------------ noise
def _hash(ix, iy, iz):
    h = np.sin(ix * 127.1 + iy * 311.7 + iz * 74.7) * 43758.5453
    return h - np.floor(h)


def vnoise(p):
    """value noise in [0, 1], p (..., 3), quintic fade"""
    i = np.floor(p)
    f = p - i
    u = f * f * f * (f * (f * 6 - 15) + 10)
    ix, iy, iz = i[..., 0], i[..., 1], i[..., 2]
    ux, uy, uz = u[..., 0], u[..., 1], u[..., 2]
    def c(a, b, d):
        return _hash(ix + a, iy + b, iz + d)
    x00 = c(0, 0, 0) * (1 - ux) + c(1, 0, 0) * ux
    x10 = c(0, 1, 0) * (1 - ux) + c(1, 1, 0) * ux
    x01 = c(0, 0, 1) * (1 - ux) + c(1, 0, 1) * ux
    x11 = c(0, 1, 1) * (1 - ux) + c(1, 1, 1) * ux
    y0 = x00 * (1 - uy) + x10 * uy
    y1 = x01 * (1 - uy) + x11 * uy
    return y0 * (1 - uz) + y1 * uz


def fbm(p, octaves=4, gain=0.5):
    s, a, tot = 0.0, 1.0, 0.0
    for o in range(octaves):
        s = s + a * vnoise(p * (2.0 ** o) + o * 17.13)
        tot += a
        a *= gain
    return s / tot


def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ------------------------------------------------------------------ wood field
PITH_Y, PITH_Z, RING_MM = 34.0, -70.0, 1.55
# knot: branch leaving the pith at x = KNOT_X, rising toward the top, leaning along +X so the
# knot reads as a small oval stretched along the grain; it surfaces at about x -55, y +47 mm
# (behind the rolling path, left of the stop)
KNOT_X = -142.0
KNOT_D = np.array([1.25, 0.18, 1.0])


def pith(x):
    one = np.zeros_like(x)
    yc = PITH_Y + 4.0 * np.sin(x / 160.0 + 1.0) + 3.0 * (vnoise(np.stack([x / 90.0, one + 3.1, one], -1)) - 0.5)
    zc = PITH_Z + 2.5 * np.sin(x / 210.0 + 0.4) + 2.0 * (vnoise(np.stack([x / 110.0, one + 7.7, one], -1)) - 0.5)
    return yc, zc


def wood(P, dphase_px=None):
    """P (..., 3) mm. Returns latewood, knot and ring fields."""
    x, y, z = P[..., 0], P[..., 1], P[..., 2]
    one = np.zeros_like(x)
    yc, zc = pith(x)
    dy, dz = y - yc, z - zc
    r = np.sqrt(dy * dy + dz * dz)
    # growth irregularity: slow along the fibre (long gentle waves), a touch finer across
    r = r + 1.1 * (fbm(P * np.array([1 / 70.0, 1 / 16.0, 1 / 16.0]), 3) - 0.5)
    r = r + 0.7 * (fbm(P * np.array([1 / 45.0, 1 / 5.0, 1 / 5.0]) + 9.0, 2) - 0.5)   # lines converge / part
    r = r + 0.22 * (vnoise(P * np.array([1 / 28.0, 1 / 3.5, 1 / 3.5]) + 5.3) - 0.5)

    # knot
    kx = np.array([KNOT_X])
    kyc, kzc = pith(kx)
    o = np.array([KNOT_X, kyc[0], kzc[0]])
    d = KNOT_D / np.linalg.norm(KNOT_D)
    rel = P - o
    s = rel @ d
    perp = rel - s[..., None] * d
    rho = np.sqrt((perp * perp).sum(-1))
    rho = rho * (1 + 0.18 * (fbm(P * 0.6 + 13.0, 2) - 0.5))   # irregular knot outline
    rk = np.clip(0.5 + 0.02 * s, 0.4, None)
    on = sstep(0.0, 8.0, s)
    # rings swell around the branch; the swell dies away along the grain
    r = r - 1.3 * np.exp(-(rho / (rk * 2.3)) ** 2) * on

    # ring widths vary year to year (monotonic: noise slope stays under 1 / RING_MM)
    phase = r / RING_MM + 1.5 * (vnoise(np.stack([r / 4.2, one + 1.7, one + 0.3], -1)) - 0.5) \
        + 0.5 * (vnoise(np.stack([r / 1.9, one + 4.1, one + 2.2], -1)) - 0.5)
    n = np.floor(phase)
    t = phase - n
    aa = 0.0 if dphase_px is None else np.clip(dphase_px, 0, 0.3)
    # earlywood -> latewood gradual, latewood -> next earlywood abrupt
    lw = sstep(0.60 - aa, 0.90 + aa, t) * (1 - sstep(0.965 - aa, 1.0 + aa, t))
    strength = 0.45 + 0.55 * _hash(n, n * 0.37 + 2.0, 1.3)
    lw = lw * strength
    # knot: dark rim (bark line), warm core with its own fine rings
    kmask = (1 - sstep(rk - 0.15, rk + 0.25, rho)) * on
    krim = np.exp(-((rho - rk * 0.95) / (0.18 + 0.08 * rk)) ** 2) * on
    kring = 0.5 + 0.5 * np.sin(rho / 0.30 * 2 * math.pi + 1.2 * vnoise(P * 0.8))
    halo = np.exp(-(rho / (rk * 1.9)) ** 2) * on
    return dict(lw=lw, kmask=kmask, krim=krim, kring=kring, halo=halo, rho=rho, rk=rk, phase=phase)


def srgb_to_lin(c):
    c = np.asarray(c, dtype=np.float64)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


EARLY = np.array([0.93, 0.85, 0.735])   # display sRGB, pale cream pine
LATE = np.array([0.775, 0.58, 0.385])   # warm amber latewood
KNOT = np.array([0.73, 0.54, 0.35])


def island_points(isl):
    """3D points (mm) of every texel in the island rows, plus mm per px along u and v."""
    r0, r1 = isl["rows"]
    c0, c1, ir0, ir1 = isl["rect"]
    ua, ub = isl["u"][1:], isl["v"][1:]
    cols = np.arange(N) + 0.5
    rows = np.arange(r0, r1) + 0.5
    U = ua[0] + (cols - c0) / (c1 - c0) * (ua[1] - ua[0])
    Vv = ub[0] + (rows - ir0) / (ir1 - ir0) * (ub[1] - ub[0])
    UU, VV = np.meshgrid(U, Vv)
    P = np.zeros(UU.shape + (3,))
    P[..., AX[isl["u"][0]]] = UU
    P[..., AX[isl["v"][0]]] = VV
    P[..., AX[isl["plane"][0]]] = isl["plane"][1]
    su = (ua[1] - ua[0]) / (c1 - c0)
    sv = (ub[1] - ub[0]) / (ir1 - ir0)
    return P, su, sv


def shade(name, isl):
    P, su, sv = island_points(isl)
    w0 = wood(P)
    gy, gx = np.gradient(w0["phase"])
    dph = np.sqrt(gx * gx + gy * gy)
    w = wood(P, dph)
    lw, km = w["lw"], w["kmask"]
    end = name == "end"

    fib_f = vnoise(P * np.array([1 / 3.0, 1 / 0.075, 1 / 0.075]) + 11.0)      # fine fibres along X
    fib_m = vnoise(P * np.array([1 / 18.0, 1 / 0.45, 1 / 0.45]) + 23.0)       # medium streaks
    big = fbm(P * (1 / 60.0) + 31.0, 3)                                         # board-scale tone
    # resin canals / pores: short dark dashes along the fibre, mostly in the latewood
    dash = vnoise(P * np.array([1 / 1.6, 1 / 0.05, 1 / 0.05]) + 57.0)
    dash = sstep(0.80, 0.93, dash) * (0.35 + 0.65 * lw)
    late_mix = 0.9 * lw[..., None]
    col = EARLY[None, None, :] * (1 - late_mix) + LATE[None, None, :] * late_mix
    col = col * (1 + 0.05 * (fib_f - 0.5)[..., None] + 0.05 * (fib_m - 0.5)[..., None])
    col = col * (1 - 0.10 * dash[..., None] * np.array([0.8, 1.0, 1.25]))
    tone = (big - 0.5)
    col = col * (1 + 0.07 * tone[..., None]) + np.array([0.010, 0.0, -0.018]) * tone[..., None]
    col = col * (1 - 0.09 * w["halo"][..., None] * np.array([0.5, 0.85, 1.35]))
    kin = np.clip(w["rho"] / w["rk"], 0, 1)
    kc = KNOT[None, None, :] * (0.93 + 0.07 * w["kring"][..., None]) * (1.10 - 0.16 * kin[..., None] ** 2)[..., :] \
        * (1 + 0.06 * (fib_m - 0.5)[..., None])
    col = col * (1 - km[..., None]) + kc * km[..., None]
    col = col * (1 - 0.30 * w["krim"][..., None] * np.array([0.85, 1.0, 1.15]))
    if name == "front":   # edge grain: a touch warmer and darker than the top
        col = col * np.array([0.975, 0.96, 0.94])
    if end:
        pores = vnoise(P * (1 / 0.07) + 3.0)
        col = col * (0.90 - 0.05 * lw[..., None] + 0.03 * (pores - 0.5)[..., None]) * np.array([1.0, 0.985, 0.96])
    col = np.clip(col, 0, 1)

    rough = 0.56 - 0.12 * lw + 0.06 * (fbm(P * (1 / 9.0) + 41.0, 3) - 0.5) + 0.03 * (fib_m - 0.5) - 0.08 * km
    if end:
        rough = rough + 0.14
    rough = np.clip(rough, 0.3, 0.85)

    h = 0.035 * lw + 0.009 * (fib_f - 0.5) + 0.007 * (fib_m - 0.5) - 0.006 * dash - 0.010 * km  # mm
    if end:
        h = 0.5 * h + 0.016 * (vnoise(P * (1 / 0.09) + 7.0) - 0.5)
    gv, gu = np.gradient(h)
    nx, ny = -gu / su, -gv / sv
    nz = np.ones_like(nx)
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    nrm = np.stack([nx / ln, ny / ln, nz / ln], -1) * 0.5 + 0.5
    return col, rough, nrm


def save_img(arr, path, fmt, colorspace):
    h, w = arr.shape[:2]
    if arr.ndim == 2:
        arr = np.repeat(arr[..., None], 3, -1)
    rgba = np.concatenate([arr, np.ones((h, w, 1))], -1).astype(np.float32)
    name = "_tex_out"
    if name in bpy.data.images:
        bpy.data.images.remove(bpy.data.images[name])
    im = bpy.data.images.new(name, w, h, alpha=False, float_buffer=False)
    im.colorspace_settings.name = "Non-Color"   # store values as given (col is already display sRGB)
    im.pixels.foreach_set(rgba.ravel())
    im.filepath_raw = path
    im.file_format = fmt
    im.save(filepath=path, quality=86 if fmt == "WEBP" else 90)
    bpy.data.images.remove(im)


def preview(path, x=(-110.0, 0.0), y=(-33.2, 60.0), px_per_mm=8.0):
    """quick look at a patch of the top (display values)"""
    nx, ny = int((x[1] - x[0]) * px_per_mm), int((y[1] - y[0]) * px_per_mm)
    isl = dict(ISLANDS["top"])
    isl["rows"] = (0, ny); isl["rect"] = (0, nx, 0, ny); isl["u"] = ("x",) + x; isl["v"] = ("y",) + y
    global N
    n0 = N; N = nx
    try:
        col, rough, nrm = shade("top", isl)
    finally:
        N = n0
    save_img(col, path, "PNG", "sRGB")
    return path


def textures():
    os.makedirs(TEX, exist_ok=True)
    col = np.zeros((N, N, 3)); rough = np.zeros((N, N)); nrm = np.zeros((N, N, 3))
    for name, isl in ISLANDS.items():
        r0, r1 = isl["rows"]
        c, r, n = shade(name, isl)
        col[r0:r1], rough[r0:r1], nrm[r0:r1] = c, r, n
    # glTF metallicRoughness: G = roughness, B = metallic (0)
    mr = np.stack([np.ones_like(rough), rough, np.zeros_like(rough)], -1)
    for fmt, ext in (("WEBP", "webp"),):   # PNG masters are not kept: the script regenerates them
        save_img(col, f"{TEX}/s06-table-basecolor.{ext}", fmt, "sRGB")
        save_img(mr, f"{TEX}/s06-table-roughness.{ext}", fmt, "Non-Color")
        save_img(nrm, f"{TEX}/s06-table-normal.{ext}", fmt, "Non-Color")
    return {k: os.path.getsize(f"{TEX}/{k}") for k in sorted(os.listdir(TEX)) if k.startswith("s06-table")}


# ------------------------------------------------------------------ mesh
def uv_for(co_mm, nrm):
    """atlas uv of a point by its face normal (dominant axis)."""
    ax = max(range(3), key=lambda i: abs(nrm[i]))
    sgn = 1 if nrm[ax] > 0 else -1
    def m(isl, uval, vval):
        c0, c1, r0, r1 = isl["rect"]
        ua, ub = isl["u"][1:], isl["v"][1:]
        u = c0 + (uval - ua[0]) / (ua[1] - ua[0]) * (c1 - c0)
        v = r0 + (vval - ub[0]) / (ub[1] - ub[0]) * (r1 - r0)
        return (u / N, v / N)
    x, y, z = co_mm
    I = ISLANDS
    if ax == 2:   # top (+z) / bottom (-z, v flipped so it is not mirrored)
        return m(I["top"], x, y if sgn > 0 else (D_Y[0] + D_Y[1] - y))
    if ax == 1:   # front (-y) / back (+y, u flipped)
        return m(I["front"], x if sgn < 0 else (W_X[0] + W_X[1] - x), z)
    return m(I["end"], y if sgn > 0 else (D_Y[0] + D_Y[1] - y), z)   # right end (+x) / left (-x)


def material():
    m = bpy.data.materials.get("S06_Table_Pine") or bpy.data.materials.new("S06_Table_Pine")
    m.use_nodes = True
    m.use_backface_culling = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial"); out.location = (600, 0)
    p = nt.nodes.new("ShaderNodeBsdfPrincipled"); p.location = (300, 0)
    def img(fn, cs, loc):
        im = bpy.data.images.load(f"{TEX}/{fn}", check_existing=True)
        im.reload()
        im.colorspace_settings.name = cs
        t = nt.nodes.new("ShaderNodeTexImage"); t.image = im; t.location = loc
        return t
    tc = img("s06-table-basecolor.webp", "sRGB", (-400, 300))
    tr = img("s06-table-roughness.webp", "Non-Color", (-400, 0))
    tn = img("s06-table-normal.webp", "Non-Color", (-400, -300))
    sep = nt.nodes.new("ShaderNodeSeparateColor"); sep.location = (-100, 0)
    nm = nt.nodes.new("ShaderNodeNormalMap"); nm.location = (-100, -300)
    nm.inputs["Strength"].default_value = 1.0
    nt.links.new(tc.outputs["Color"], p.inputs["Base Color"])
    nt.links.new(tr.outputs["Color"], sep.inputs["Color"])
    nt.links.new(sep.outputs["Green"], p.inputs["Roughness"])
    nt.links.new(sep.outputs["Blue"], p.inputs["Metallic"])
    nt.links.new(tn.outputs["Color"], nm.inputs["Color"])
    nt.links.new(nm.outputs["Normal"], p.inputs["Normal"])
    p.inputs["Specular IOR Level"].default_value = 0.5
    nt.links.new(p.outputs[0], out.inputs[0])
    return m


def table():
    me = bpy.data.meshes.get("S06_Table") or bpy.data.meshes.new("S06_Table")
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    lo = Vector((W_X[0], D_Y[0], H_Z[0])); hi = Vector((W_X[1], D_Y[1], H_Z[1]))
    for v in bm.verts:
        v.co = Vector(lo[i] if v.co[i] < 0 else hi[i] for i in range(3))
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=BEVEL, segments=3, profile=0.5, affect="EDGES", clamp_overlap=True)
    bm.normal_update()
    uvl = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for l in f.loops:
            l[uvl].uv = uv_for(tuple(l.vert.co), tuple(f.normal))
    for v in bm.verts:
        v.co = v.co * 0.001   # mm -> m
    bm.to_mesh(me); bm.free()
    for poly in me.polygons:
        poly.use_smooth = True
    ob = bpy.data.objects.get("S06_Table") or bpy.data.objects.new("S06_Table", me)
    if ob.name not in bpy.context.scene.collection.objects:
        bpy.context.scene.collection.objects.link(ob)
    # flat faces stay flat, bevel segments smooth
    ob.data.set_sharp_from_angle(angle=math.radians(30))
    ob.data.materials.clear(); ob.data.materials.append(material())
    return {"verts": len(me.vertices), "faces": len(me.polygons), "tris": sum(len(p.vertices) - 2 for p in me.polygons)}


def export():
    sc = bpy.data.scenes["Scene"]          # the asset scene (the review scene holds an imported copy)
    bpy.context.window.scene = sc
    ob = bpy.data.objects["S06_Table"]
    for o in sc.objects:
        o.select_set(o == ob)
    bpy.context.view_layer.objects.active = ob
    path = V2 + "/s06-table.glb"
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLB", use_selection=True, use_active_scene=True,
                              export_image_format="WEBP", export_image_quality=86,
                              export_tangents=False, export_yup=True, export_apply=True,
                              export_materials="EXPORT", export_texcoords=True, export_normals=True)
    return {"glb": path, "bytes": os.path.getsize(path)}


# ------------------------------------------------------------------ review renders (three.js space)
# 1440 x 900, camera at z = H / 2 / tan(15 deg) = 1679.4 px, vertical FOV 30 deg, 1 px = K BU.
# Composition (D-144, Figma 06 State 1): ring D = 320 px standing on the table at the contact depth
# z = 0; contact line y = -290 px (screen y 740); table right edge x = 0 (screen x 720).
K = 0.001
VW, VH = 1440, 900
CAM_Z = VH / 2 / math.tan(math.radians(15))
RING_D = 320.0
CONTACT_Y = -290.0
PAPER = "#F9F5EF"
SCN = "S06_Table_Review"
KEY_POS = (-600.0, 900.0, 700.0)
KEY_COLOR = "#FFE6C7"
KEY_STRENGTH = 3.2
KEY_ANGLE = 4.0
HEMI_SKY = "#FFF1DC"
HEMI_GROUND = "#D9CCB8"
HEMI_STRENGTH = 0.45


def _q(axis, deg):
    return Quaternion(Vector(axis), math.radians(deg))


def _empty(name, parent=None):
    sc = bpy.data.scenes[SCN]
    o = bpy.data.objects.get(name) or bpy.data.objects.new(name, None)
    if o.name not in sc.collection.objects:
        sc.collection.objects.link(o)
    o.parent = parent
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.rotation_mode = "QUATERNION"
    return o


def _import(path, holder):
    """import a GLB and hang its roots under holder (keeps the glTF local transforms)"""
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    # importer converts Y-up -> Z-up with its own root rotation; undo it (we already sit in three space)
    for o in roots:
        mw = o.matrix_world.copy()
        o.parent = holder
        o.matrix_parent_inverse = Matrix.Identity(4)
        o.matrix_basis = Matrix.Rotation(-math.pi / 2, 4, "X") @ mw
    return new


def _ring_materials():
    # finishes.json silver_polished as in fallback-v3 (envMapIntensity 1.5 -> +0.5 gloss lobe)
    band = bpy.data.materials["Ring_Silver"]
    nt = band.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Base Color"].default_value = (0.92, 0.92, 0.93, 1)
    p.inputs["Metallic"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.06
    gl = nt.nodes.new("ShaderNodeBsdfGlossy")
    gl.inputs["Color"].default_value = (0.46, 0.46, 0.465, 1)
    gl.inputs["Roughness"].default_value = 0.06
    add = nt.nodes.new("ShaderNodeAddShader")
    nt.links.new(p.outputs[0], add.inputs[0]); nt.links.new(gl.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], out.inputs["Surface"])
    eng = bpy.data.materials["Ring_Silver_Engrave"]
    p = next(n for n in eng.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    p.inputs["Base Color"].default_value = (0.28, 0.28, 0.29, 1)
    p.inputs["Metallic"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.38
    for mn in ("LED_Main", "LED_Power"):
        m = bpy.data.materials.get(mn)
        if m:
            pp = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
            pp.inputs["Emission Strength"].default_value = 0.0


def review_scene(env_strength=1.0, key=1.0, hemi=1.0):
    sc = bpy.data.scenes.get(SCN) or bpy.data.scenes.new(SCN)
    bpy.context.window.scene = sc
    root = _empty("THREE_ROOT"); root.rotation_quaternion = _q((1, 0, 0), 90)
    if "RING_HOLD" not in bpy.data.objects:
        ring_hold = _empty("RING_HOLD", root)
        for m in list(bpy.data.materials):
            if m.users == 0:
                bpy.data.materials.remove(m)
        _import(RING_GLB, ring_hold)
        table_hold = _empty("TABLE_HOLD", root)
        _import(V2 + "/s06-table.glb", table_hold)
    ring_hold = bpy.data.objects["RING_HOLD"]; table_hold = bpy.data.objects["TABLE_HOLD"]
    _ring_materials()
    # ring: centre its bounds, scale to RING_D
    bpy.context.view_layer.update()
    ring_meshes = [o for o in ring_hold.children_recursive if o.type == "MESH"]
    ring_hold.location = (0, 0, 0); ring_hold.rotation_quaternion = Quaternion(); ring_hold.scale = (1, 1, 1)
    model = ring_hold.children[0]
    bpy.context.view_layer.update()
    inv = ring_hold.matrix_world.inverted()
    pts = [inv @ (o.matrix_world @ Vector(c)) for o in ring_meshes for c in o.bound_box]
    mn = Vector([min(p[i] for p in pts) for i in range(3)]); mx = Vector([max(p[i] for p in pts) for i in range(3)])
    sc["ringSize"] = mx.x - mn.x
    sc["ringCentre"] = (mn + mx) / 2
    # table: GLB metres -> px with the ring scale, origin on the contact line at the edge
    s = RING_D / 0.02384 * K
    table_hold.location = (0, CONTACT_Y * K, 0)
    table_hold.rotation_quaternion = Quaternion()
    table_hold.scale = (s, s, s)

    cam = bpy.data.objects.get("S06_Cam") or bpy.data.objects.new("S06_Cam", bpy.data.cameras.new("S06_Cam"))
    if cam.name not in sc.collection.objects:
        sc.collection.objects.link(cam)
    cam.parent = root; cam.matrix_parent_inverse = Matrix.Identity(4)
    cam.rotation_mode = "QUATERNION"; cam.rotation_quaternion = Quaternion()
    cam.location = (0, 0, CAM_Z * K)
    cam.data.sensor_fit = "VERTICAL"
    cam.data.angle_y = math.radians(30)
    cam.data.clip_start = 0.01; cam.data.clip_end = 100
    sc.camera = cam

    w = bpy.data.worlds.get("S06_Review_World") or bpy.data.worlds.new("S06_Review_World")
    sc.world = w; w.use_nodes = True
    nt = w.node_tree; nt.nodes.clear()
    t = nt.nodes.new("ShaderNodeTexEnvironment"); t.image = bpy.data.images.load(ENV, check_existing=True)
    b = nt.nodes.new("ShaderNodeBackground"); b.inputs["Strength"].default_value = env_strength
    o = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(t.outputs[0], b.inputs[0])
    # three.js HemisphereLight equivalent: warm sky / sand ground, seen by diffuse rays only, so the
    # wood gets the soft top light it lacks in the polished env while the ring reflections stay as on the web
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    mr = nt.nodes.new("ShaderNodeMapRange"); mr.inputs["From Min"].default_value = -1.0
    nt.links.new(sep.outputs["Z"], mr.inputs["Value"])
    mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = "RGBA"
    mx.inputs["A"].default_value = tuple(srgb_to_lin(_hex(HEMI_GROUND))) + (1,)
    mx.inputs["B"].default_value = tuple(srgb_to_lin(_hex(HEMI_SKY))) + (1,)
    nt.links.new(mr.outputs[0], mx.inputs["Factor"])
    hb = nt.nodes.new("ShaderNodeBackground"); hb.inputs["Strength"].default_value = HEMI_STRENGTH * hemi
    nt.links.new(mx.outputs["Result"], hb.inputs[0])
    lp = nt.nodes.new("ShaderNodeLightPath")
    add = nt.nodes.new("ShaderNodeAddShader")
    nt.links.new(b.outputs[0], add.inputs[0])
    hm = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Diffuse Ray"], hm.inputs[0])
    nt.links.new(hb.outputs[0], hm.inputs[2])
    nt.links.new(hm.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], o.inputs[0])

    # key = three.js DirectionalLight: warm, from the upper left and in front, soft shadow so the
    # ring leaves a contact shadow on the wood (position in px, target = origin)
    kl = bpy.data.objects.get("S06_Key")
    if kl and kl.data.type != "SUN":
        bpy.data.objects.remove(kl); kl = None
    if not kl:
        kl = bpy.data.objects.new("S06_Key", bpy.data.lights.new("S06_Key_Sun", "SUN"))
        sc.collection.objects.link(kl)
    kl.parent = root; kl.matrix_parent_inverse = Matrix.Identity(4)
    kpos = Vector(KEY_POS)
    kl.location = kpos * K
    kl.rotation_mode = "QUATERNION"
    kl.rotation_quaternion = (-kpos).normalized().to_track_quat("-Z", "Y")
    kl.data.energy = KEY_STRENGTH * key
    kl.data.angle = math.radians(KEY_ANGLE)
    kl.data.color = tuple(srgb_to_lin(_hex(KEY_COLOR)))
    kl.hide_render = key <= 0

    sc.render.engine = "CYCLES"
    sc.cycles.device = "GPU"
    sc.cycles.samples = 256
    sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.render.resolution_x, sc.render.resolution_y = VW, VH
    sc.render.resolution_percentage = 100
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "None"
    sc.view_settings.exposure = 0.0
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.image_settings.color_depth = "8"
    return sc


def ring_pose(x_px, spin_deg=0.0):
    """frontLogoTop (s06-pose.json: world z 90) + rolling spin about the ring axis, standing on the table"""
    sc = bpy.data.scenes[SCN]
    h = bpy.data.objects["RING_HOLD"]
    sz = sc["ringSize"]; c = Vector(sc["ringCentre"])
    s = RING_D * K / sz
    q = _q((0, 0, 1), 90 + spin_deg)
    h.rotation_quaternion = q
    h.scale = (s, s, s)
    centre = Vector((x_px * K, (CONTACT_Y + RING_D / 2) * K, 0))
    h.location = centre - q @ (c * s)
    bpy.context.view_layer.update()


def _hex(hx):
    hx = hx.lstrip("#")
    return np.array([int(hx[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def over_paper(src, dst):
    im = bpy.data.images.load(src, check_existing=False)
    im.colorspace_settings.name = "Non-Color"
    w_, h_ = im.size
    a = np.empty(w_ * h_ * 4, dtype=np.float32); im.pixels.foreach_get(a)
    bpy.data.images.remove(im)
    a = a.reshape(h_, w_, 4).astype(np.float64)
    out = a[..., :3] * a[..., 3:4] + _hex(PAPER)[None, None, :] * (1 - a[..., 3:4])
    save_img(np.clip(out, 0, 1), dst, "PNG", "sRGB")
    return dst


def review(samples=256, names=("s06-table-review", "s06-table-review-edge"), poses=((-250.0, -30.0), (-12.0, 0.0)),
           env_strength=1.0, key=1.0, hemi=1.0, out_dir=None):
    sc = review_scene(env_strength, key, hemi)
    sc.cycles.samples = samples
    out_dir = out_dir or RENDERS
    tmp = out_dir + "/_tmp"
    os.makedirs(tmp, exist_ok=True)
    res = []
    for name, (x, spin) in zip(names, poses):
        ring_pose(x, spin)
        raw = f"{tmp}/{name}-rgba.png"
        sc.render.filepath = raw
        bpy.ops.render.render(write_still=True, scene=sc.name)
        res.append(over_paper(raw, f"{out_dir}/{name}.png"))
    return res

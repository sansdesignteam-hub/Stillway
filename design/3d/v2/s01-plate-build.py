"""
Stillway V2 S01 — photoreal pedestal PLATE (D-181). Headless Blender 5.x:

    Blender -b -P design/3d/v2/s01-plate-build.py -- render      # Cycles passes -> renders/s01-plate/passes/
    Blender -b -P design/3d/v2/s01-plate-build.py -- comp        # passes -> plates, stills, overlays, evidence, pose JSON
    Blender -b -P design/3d/v2/s01-plate-build.py -- all
    PLATE_SCALE=0.35 PLATE_SPP=48 ... -- all                     # quick look (not for delivery)

The pedestal is no longer shaded in real time: it is rendered once in Cycles INTO the desk photo.
Camera = the D-179/D-180 photo camera, unchanged (see REGISTRATION below); geometry = the same
41 x 25.6 x 6.8 mm slab as s01-pedestal.glb (finer bevel segments only), so the invisible web proxy
(s01-pedestal.glb) sits on the plate's pedestal.

Passes (same camera, same lights, render border around the subject):
    D0  desk alone                                  linear EXR
    D1  desk, pedestal casting but camera-hidden    linear EXR   -> D1/D0 = contact shadow + AO + bounce on the desk
    D2  desk, pedestal + ring casting, both hidden  linear EXR   -> D2/D1 = ring shadow on the desk
    P1  pedestal RGBA (desk hidden from camera)     display PNG  -> the pedestal layer
    P2  pedestal RGBA with the ring's shadow        display PNG  -> P2/P1 = ring shadow on the pedestal
    RG  ring RGBA (bright neutral silver, D-179)    display PNG
    MK  s01-pedestal.glb silhouette (the web proxy) PNG alpha
    C1  pedestal, short-range AO as emission, no ring   linear EXR
    C2  the same with the ring in place                 linear EXR   -> C2/C1 = contact occlusion under the touching band (D-181c)

D-186: the background is the new native photo Hero_BG_Stillway_New_3840x2400.avif (16:10). It is a NEW image of
the same scene, not a re-crop of the 3632 plate (SIFT finds no common features), so it cannot be registered to
the old one. Calibration, from the photo itself:
  * desk tilt from two pairs of orthogonal desk-plane edges (weak perspective, sin^2 d = tan a1 * tan a2):
    laptop rows +8.1 deg / laptop side -32.3 deg -> 17.5 deg at v ~ 0.65; books 15.3 / 17.4 deg -> 17.0 deg at
    v ~ 0.55. The camera below looks down 17.5 deg at v 0.65 and 15.9 deg at v 0.55: within ~1 deg.
  * the pose (elev 19, azim -6, dist 232 mm) is therefore kept, and lens / shift are re-derived so that the
    WEB REST FRAME (cover x 1.14 about heroBg.anchor, 16:10 viewport) shows the pedestal and ring exactly where
    the D-181b plate did (the Figma fit): lens 70 -> 76.689 mm, shift_y 0.135 -> 0.147901 of the width.
  * lamp: base on the desk at Blender (69, 73) mm, shade opening ~34 mm up (rays of this camera); in the old
    plate it was at (74, 76). KEY and SPILL are moved by that displacement (see LAMP_SHIFT).
"""
import bpy, bmesh, math, os, sys, json, importlib.util
import numpy as np
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("ped", HERE + "/s01-pedestal-build.py")
ped = importlib.util.module_from_spec(spec); spec.loader.exec_module(ped)

V2 = ped.V2
OUT = V2 + "/plate"
REN = V2 + "/renders/s01-plate"
PASS = REN + "/passes"
ASSETS = next(p for p in (ped.WT + "/design/assets/v2/s01", "/Users/zaimmaulana/Orca/projects/Smart Ring/design/assets/v2/s01")
              if os.path.exists(p + "/Hero_BG_Stillway_New_3840x2400.avif"))
PHOTO_SRC = ASSETS + "/Hero_BG_Stillway_New_3840x2400.avif"
PHOTO = PASS + "/photo-3840.png"                    # Blender does not read AVIF: decoded once with sips (sRGB, lossless PNG)
if not os.path.exists(PHOTO):
    import subprocess
    os.makedirs(PASS, exist_ok=True)
    subprocess.run(["sips", "-s", "format", "png", PHOTO_SRC, "--out", PHOTO], check=True, stdout=subprocess.DEVNULL)
FIGMA = ASSETS + "/hero-text-layout-ref.png"

SCALE = float(os.environ.get("PLATE_SCALE", "1"))
FW, FH = 3840, 2400
OLD_FW, OLD_FH = 3632, 2072                         # the D-181 plate frame the camera of s01-pedestal-build.py belongs to
RW, RH = round(FW * SCALE), round(FH * SCALE)
SPP = int(os.environ.get("PLATE_SPP", "512"))
PIX_ASPECT_X = 1.0
BORDER = tuple(float(v) for v in os.environ.get("PLATE_BORDER", "0.16,0.84,0.0,0.80").split(","))                    # xmin, xmax, ymin (bottom), ymax as frame fractions
MM = ped.MM
W, D, H = ped.W, ped.D, ped.H
OAK_TILE_MM = float(os.environ.get("OAK_TILE", "150"))
DESK_RGB = tuple(int(v) for v in os.environ.get("DESK_RGB", "179,104,48").split(","))   # D-186: 0.9 x the new photo's mean around the pedestal (198, 116, 53); was (168, 112, 64)
P_LOOK = os.environ.get("P_LOOK", "AgX - Medium High Contrast")
P_EXPOSURE = float(os.environ.get("P_EXPOSURE", "0.0"))
KEY_POWER = float(os.environ.get("KEY_POWER", "1.0"))   # plate passes
KEY_POWER_RING = 1.1                                    # D-179 poster value
ENV_STRENGTH = float(os.environ.get("ENV_STRENGTH", "0.10"))   # plate passes; the ring pass keeps the D-179 poster value
ENV_STRENGTH_RING = 0.28
# phones (Developer, D-181): ring + pedestal as a 2D transform of the frame about O
MOB_K, MOB_DY, MOB_O = 0.62, -0.14, (0.5, 0.86)
# The 2D similarity p' = O + k (p - O) + (0, dy H) of a pinhole image is itself a pinhole image: lens x k and a
# new shift. The phone passes ("m" suffix) are rendered natively with that camera (sharp, and the ring shadow
# that runs off the bottom of the desktop frame is complete), not resampled from the desktop passes.
WEB_ZOOM, WEB_ANCHOR = 1.14, (0.503, 0.8)     # heroBg.desktop.zoomFrom / heroBg.anchor: the web REST frame


def webframe_map(Ww, Hh, fw, fh):
    """plate px -> screen px of the web rest frame: object-fit cover, then CSS zoom 1.14 about the anchor"""
    c = max(fw / Ww, fh / Hh); x0, y0 = (fw - Ww * c) / 2, (fh - Hh * c) / 2
    ax, ay = x0 + WEB_ANCHOR[0] * Ww * c, y0 + WEB_ANCHOR[1] * Hh * c
    k = c * WEB_ZOOM
    return k, ax + WEB_ZOOM * (x0 - ax), ay + WEB_ZOOM * (y0 - ay)      # X = k px + ox, Y = k py + oy


def _recalibrate():
    """D-186 camera for the 3840 x 2400 photo: same pose as D-179/D-181, lens and shift chosen so the web rest
    frame at 2880 x 1800 is the same pinhole image as with the 3632 x 2072 plate (a 2D similarity of a pinhole
    image is the same camera with another lens and shift)."""
    C = ped.CAM
    ko, oxo, oyo = webframe_map(OLD_FW, OLD_FH, 2880, 1800); kn, oxn, oyn = webframe_map(FW, FH, 2880, 1800)
    f_old = C["lens"] / 36.0 * OLD_FW
    pp_old = ((0.5 - C["shift"][0]) * OLD_FW, (0.5 + C["shift"][1] * OLD_FW / OLD_FH) * OLD_FH)
    f_new = f_old * ko / kn
    pp_new = ((ko * pp_old[0] + oxo - oxn) / kn, (ko * pp_old[1] + oyo - oyn) / kn)
    return dict(C, lens=f_new / FW * 36.0, shift=(0.5 - pp_new[0] / FW, (pp_new[1] / FH - 0.5) * FH / FW))


CAM = _recalibrate()
_A = FW / FH
MOB_LENS = CAM["lens"] * MOB_K
MOB_SHIFT = ((0.5 - MOB_O[0]) * (1 - MOB_K) + MOB_K * CAM["shift"][0],
             ((MOB_O[1] - 0.5) * (1 - MOB_K) + MOB_DY) / _A + MOB_K * CAM["shift"][1])
BORDER_M = (0.26, 0.74, 0.03, 0.70)
# D-186: the lamp of the new photo stands at Blender (69, 73) mm on the desk; in the 3632 plate it stood at (74, 76).
# Both lights follow it by that displacement (their direction at the pedestal changes by < 2 deg).
LAMP_SHIFT = tuple(float(v) for v in os.environ.get("LAMP_SHIFT", "-5,-3").split(","))
KEY = dict(ped.KEY, pos=tuple(float(v) for v in os.environ["KEY_POS"].split(",")) if os.environ.get("KEY_POS") else
           (ped.KEY["pos"][0] + LAMP_SHIFT[0], ped.KEY["pos"][1] + LAMP_SHIFT[1], ped.KEY["pos"][2]))
SPILL = dict(pos=tuple(float(v) for v in os.environ["SPILL_POS"].split(",")) if os.environ.get("SPILL_POS") else
             (125 + LAMP_SHIFT[0], 50 + LAMP_SHIFT[1], 58.0), size=float(os.environ.get("SPILL_SIZE", "60")),
             power=float(os.environ.get("SPILL_POWER", "0.45")),
             color=tuple(float(v) for v in os.environ.get("SPILL_COLOR", "1.0,0.52,0.22").split(",")))
KEY["color"] = tuple(float(v) for v in os.environ.get("KEY_COLOR", "1.0,0.60,0.30").split(","))   # D-186: warmer, the new desk is more orange (was 1, 0.70, 0.44 / spill 1, 0.62, 0.34)


# ---------------------------------------------------------------- scene
def make_mesh_hi():
    """same slab as s01-pedestal-build.make_mesh, finer bevels (silhouette differs < 0.2 px at 1818)"""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * W, v.co.y * D, (v.co.z + 0.5) * H)) * MM
    vert_edges = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1e-6]
    bmesh.ops.bevel(bm, geom=vert_edges, offset=ped.R_CORNER * MM, segments=32, profile=0.5, affect='EDGES')
    for top, r, seg in ((True, ped.R_FILLET, 10), (False, ped.R_FILLET_BOT, 5)):
        rim = [e for e in bm.edges
               if abs(e.verts[0].co.z - e.verts[1].co.z) < 1e-7 and len(e.link_faces) == 2
               and any((f.normal.z > 0.99) if top else (f.normal.z < -0.99) for f in e.link_faces)]
        bmesh.ops.bevel(bm, geom=rim, offset=r * MM, segments=seg, profile=0.5, affect='EDGES')
    bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 4])
    me = bpy.data.meshes.new("S01_Pedestal_Plate")
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new("S01_Pedestal_Plate", me)
    bpy.context.scene.collection.objects.link(ob)
    wn = ob.modifiers.new("WN", 'WEIGHTED_NORMAL'); wn.mode = 'FACE_AREA'; wn.weight = 100; wn.keep_sharp = False
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    bpy.ops.object.modifier_apply(modifier="WN")
    return ob


def oak_material():
    """Poly Haven Oak Veneer 01 (CC0) 2K diffuse + roughness + normal, projected in object space on the
    three axes and blended by the surface normal: no UV seams at the plan corners or over the lip.
    Grain runs along X on top/bottom and front/back, along Y on the short ends."""
    m = bpy.data.materials.new("S01_Pedestal_Oak_plate")
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    def math_(op, a=None, bv=None, c=None):
        n = N.new("ShaderNodeMath"); n.operation = op
        for i, v in enumerate((a, bv, c)):
            if v is None: continue
            if isinstance(v, (int, float)): n.inputs[i].default_value = v
            else: L.new(v, n.inputs[i])
        return n.outputs[0]
    def vmath(op, a=None, bv=None, scale=None):
        n = N.new("ShaderNodeVectorMath"); n.operation = op
        for i, v in enumerate((a, bv)):
            if v is None: continue
            if isinstance(v, tuple): n.inputs[i].default_value = v
            else: L.new(v, n.inputs[i])
        if scale is not None:
            if isinstance(scale, (int, float)): n.inputs["Scale"].default_value = scale
            else: L.new(scale, n.inputs["Scale"])
        return n.outputs[0]
    def comb(x=0.0, y=0.0, z=0.0):
        n = N.new("ShaderNodeCombineXYZ")
        for i, v in enumerate((x, y, z)):
            if isinstance(v, (int, float)): n.inputs[i].default_value = v
            else: L.new(v, n.inputs[i])
        return n.outputs[0]
    def sep(v):
        n = N.new("ShaderNodeSeparateXYZ"); L.new(v, n.inputs[0]); return n.outputs
    tc = N.new("ShaderNodeTexCoord")
    px, py, pz = sep(tc.outputs["Object"])
    geo = N.new("ShaderNodeNewGeometry")
    nx, ny, nz = sep(geo.outputs["Normal"])
    k = 1.0 / (OAK_TILE_MM * MM)
    def uv(u, uk, uo, v, vk, vo):
        return comb(math_('MULTIPLY_ADD', u, uk, uo), math_('MULTIPLY_ADD', v, vk, vo))
    uvs = (uv(py, k, 0.31, px, k, 0.12),           # top / bottom
           uv(pz, k, 0.62, px, k, 0.12),           # front / back
           uv(pz, k, 0.85, py, k * 0.6, 0.50))     # short ends
    # blend weights |n|^6, normalised
    ws = [math_('POWER', math_('ABSOLUTE', c), 6.0) for c in (nz, ny, nx)]
    tot = math_('ADD', math_('ADD', ws[0], ws[1]), ws[2])
    ws = [math_('DIVIDE', w, tot) for w in ws]
    def tex(key, cs, uvv):
        t = N.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(ped.OAK.format(key), check_existing=True)
        t.image.colorspace_settings.name = cs; t.extension = 'REPEAT'; t.interpolation = 'Cubic'
        L.new(uvv, t.inputs[0]); return t.outputs[0]
    def blend(key, cs):
        acc = None
        for w, u in zip(ws, uvs):
            v = vmath('SCALE', tex(key, cs, u), scale=w)
            acc = v if acc is None else vmath('ADD', acc, v)
        return acc
    col = blend("diff", "sRGB")
    # calmer figure (the scan's stripes read as veneer at this size): pull 30 % toward the mean oak tone
    calm = N.new("ShaderNodeMix"); calm.data_type = 'RGBA'; calm.inputs["Factor"].default_value = float(os.environ.get("OAK_CALM", "0.08"))
    L.new(col, calm.inputs["A"]); calm.inputs["B"].default_value = (0.52, 0.33, 0.17, 1)
    col = calm.outputs["Result"]
    # open pores: short dark dashes along the grain (X on top/front/back, Y on the ends), also pressed into the normal
    def dashes(scale_vec, seed):
        n = N.new("ShaderNodeTexNoise"); n.noise_dimensions = '4D'; n.inputs["W"].default_value = seed
        n.inputs["Scale"].default_value = 1.0; n.inputs["Detail"].default_value = 1.0; n.inputs["Roughness"].default_value = 0.4
        L.new(vmath('MULTIPLY', tc.outputs["Object"], scale_vec), n.inputs["Vector"])
        mr = N.new("ShaderNodeMapRange"); mr.interpolation_type = 'SMOOTHSTEP'
        mr.inputs["From Min"].default_value = 0.64; mr.inputs["From Max"].default_value = 0.70
        L.new(n.outputs["Fac"], mr.inputs[0]); return mr.outputs[0]
    PS = float(os.environ.get("PORE_SCALE", "0.8"))
    dx = math_('MAXIMUM', dashes((520 * PS, 6500 * PS, 6500 * PS), 1.0), math_('MULTIPLY', dashes((300 * PS, 4200 * PS, 4200 * PS), 7.0), 0.7))
    # D-186b: the short ends showed an even field of round pores. Two dash sets of different length, thinned by a
    # low-frequency mask and weaker than on the long faces, so they come in irregular clusters
    def lowmask(scale, seed, lo, hi):
        n = N.new("ShaderNodeTexNoise"); n.noise_dimensions = '4D'; n.inputs["W"].default_value = seed
        n.inputs["Scale"].default_value = scale; n.inputs["Detail"].default_value = 2.0; n.inputs["Roughness"].default_value = 0.55
        L.new(tc.outputs["Object"], n.inputs["Vector"])
        mr = N.new("ShaderNodeMapRange"); mr.interpolation_type = 'SMOOTHSTEP'
        mr.inputs["From Min"].default_value = lo; mr.inputs["From Max"].default_value = hi
        L.new(n.outputs["Fac"], mr.inputs[0]); return mr.outputs[0]
    END_PORE = float(os.environ.get("END_PORE", "0.55"))
    dy = math_('MAXIMUM', dashes((6500 * PS, 520 * PS, 6500 * PS), 3.0), math_('MULTIPLY', dashes((3900 * PS, 260 * PS, 5200 * PS), 9.0), 0.6))
    dy = math_('MULTIPLY', dy, math_('MULTIPLY', lowmask(float(os.environ.get("PORE_MASK_SCALE", "420")), 11.0, 0.44, 0.62), END_PORE))
    dx = math_('MULTIPLY', dx, math_('ADD', 0.45, math_('MULTIPLY', lowmask(260.0, 23.0, 0.38, 0.60), 0.55)))
    pore = math_('ADD', math_('MULTIPLY', math_('ADD', ws[0], ws[1]), dx), math_('MULTIPLY', ws[2], dy))
    # on the rounded plan corners the two side projections cross and the dashes shrink to round dots: fade them out there
    crn = N.new("ShaderNodeClamp"); crn.inputs["Max"].default_value = 0.9
    L.new(math_('MULTIPLY', math_('MULTIPLY', ws[1], ws[2]), 6.0), crn.inputs["Value"])
    pore = math_('MULTIPLY', pore, math_('SUBTRACT', 1.0, crn.outputs[0]))
    pmix = N.new("ShaderNodeMix"); pmix.data_type = 'RGBA'; pmix.blend_type = 'MULTIPLY'
    L.new(math_('MULTIPLY', pore, float(os.environ.get("PORE_DARK", "0.8"))), pmix.inputs["Factor"])
    L.new(col, pmix.inputs["A"]); pmix.inputs["B"].default_value = (0.42, 0.30, 0.20, 1)
    col = pmix.outputs["Result"]
    hsv = N.new("ShaderNodeHueSaturation")
    hsv.inputs["Hue"].default_value = float(os.environ.get("OAK_HUE", "0.495"))
    hsv.inputs["Saturation"].default_value = float(os.environ.get("OAK_SAT", "0.8"))
    hsv.inputs["Value"].default_value = float(os.environ.get("OAK_VAL", "1.12"))
    L.new(col, hsv.inputs["Color"])
    # lip: nz*(1-nz)*4 is 0 on the flat top and the sides, 1 mid-roundover -> a touch lighter and smoother (handled edge)
    lip = math_('MULTIPLY', math_('MULTIPLY', math_('MAXIMUM', nz, 0.0), math_('SUBTRACT', 1.0, nz)), 4.0)
    lighten = N.new("ShaderNodeMix"); lighten.data_type = 'RGBA'; lighten.blend_type = 'MIX'
    L.new(math_('MULTIPLY', lip, 0.22), lighten.inputs["Factor"])
    L.new(hsv.outputs[0], lighten.inputs["A"]); lighten.inputs["B"].default_value = (0.86, 0.66, 0.44, 1)
    L.new(lighten.outputs["Result"], b.inputs["Base Color"])
    rsep = sep(blend("rough", "Non-Color"))
    rr = N.new("ShaderNodeMapRange"); rr.inputs["To Min"].default_value = 0.62; rr.inputs["To Max"].default_value = 0.88
    L.new(rsep[0], rr.inputs[0])
    L.new(math_('SUBTRACT', rr.outputs[0], math_('MULTIPLY', lip, 0.16)), b.inputs["Roughness"])
    # normal maps: per projection the tangent frame is a fixed axis permutation; add the tangential
    # offsets to the true (smooth) normal so the fillets keep their shape
    perms = (lambda mx, my: comb(my, mx, 0.0), lambda mx, my: comb(my, 0.0, mx), lambda mx, my: comb(0.0, my, mx))
    acc = None
    for w, u, pm in zip(ws, uvs, perms):
        d = vmath('SCALE', vmath('SUBTRACT', tex("nor_gl", "Non-Color", u), (0.5, 0.5, 0.5)), scale=2.0)
        s = sep(d)
        v = vmath('SCALE', pm(s[0], s[1]), scale=w)
        acc = v if acc is None else vmath('ADD', acc, v)
    nrm = vmath('NORMALIZE', vmath('ADD', geo.outputs["Normal"], vmath('SCALE', acc, scale=float(os.environ.get("OAK_NORMAL", "1.6")))))
    bump = N.new("ShaderNodeBump"); bump.invert = True
    bump.inputs["Strength"].default_value = 0.6; bump.inputs["Distance"].default_value = 0.00006
    L.new(pore, bump.inputs["Height"]); L.new(nrm, bump.inputs["Normal"])
    nrm = bump.outputs[0]
    L.new(nrm, b.inputs["Normal"])
    b.inputs["Specular IOR Level"].default_value = 0.38
    b.inputs["Coat Weight"].default_value = float(os.environ.get("OAK_COAT", "0.04"))          # thin oil / wax finish: the sheen on the lip
    b.inputs["Coat Roughness"].default_value = 0.38
    L.new(nrm, b.inputs["Coat Normal"])
    return m


def scene_setup():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'METAL'; prefs.get_devices()
        for d in prefs.devices: d.use = True
        sc.cycles.device = 'GPU'
    except Exception as e:
        print("PLATE gpu unavailable, CPU:", e); sc.cycles.device = 'CPU'
    sc.cycles.samples = SPP
    sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.004
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 12; sc.cycles.diffuse_bounces = 6; sc.cycles.glossy_bounces = 6
    sc.cycles.sample_clamp_indirect = 8.0
    sc.render.film_transparent = True
    sc.cycles.pixel_filter_type = 'BLACKMAN_HARRIS'; sc.cycles.filter_width = 1.5
    sc.render.resolution_x, sc.render.resolution_y = RW, RH
    sc.render.resolution_percentage = 100
    sc.render.pixel_aspect_x = PIX_ASPECT_X; sc.render.pixel_aspect_y = 1.0
    sc.render.use_border = True; sc.render.use_crop_to_border = False
    sc.render.border_min_x, sc.render.border_max_x, sc.render.border_min_y, sc.render.border_max_y = BORDER
    # pedestal (plate quality) + the web proxy GLB (for the silhouette check only)
    pd = make_mesh_hi(); pd.data.materials.append(oak_material())
    proxy, proxy_objs = ped.import_glb(ped.OUT_GLB, "S01_Proxy_Root")
    ring, ring_objs = ped.import_glb(ped.RING_GLB, "S01_Ring_Root")
    ring.matrix_world = ped.ring_pose() @ Matrix.Scale(ped.RING_S01_SCALE, 4)
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    zmin = 1e9
    for o in ring_objs:
        if o.type != 'MESH': continue
        ev = o.evaluated_get(dg); mw = ev.matrix_world
        zmin = min(zmin, min((mw @ v.co).z for v in ev.data.vertices))
    PP = Vector((ped.PED_POS[0] * MM, ped.PED_POS[1] * MM, 0.0))
    pd.location = PP; proxy.location = PP
    low = min(((o.evaluated_get(dg).matrix_world @ v.co) for o in ring_objs if o.type == 'MESH' for v in o.evaluated_get(dg).data.vertices), key=lambda c: c.z)
    lowrel = (low.x + ped.RING_LOC[0] * MM, low.y + ped.RING_LOC[1] * MM)
    print("PLATE ring contact rel. to top centre (mm)", round(lowrel[0] / MM, 2), round(lowrel[1] / MM, 2), "flat top half-extents", W / 2 - ped.R_FILLET, D / 2 - ped.R_FILLET)
    assert abs(lowrel[0]) < (W / 2 - ped.R_FILLET) * MM and abs(lowrel[1]) < (D / 2 - ped.R_FILLET) * MM, "ring contact is off the flat top"
    ring.location = (PP.x + ped.RING_LOC[0] * MM, PP.y + ped.RING_LOC[1] * MM, H * MM - zmin)
    bpy.ops.mesh.primitive_plane_add(size=1.2, location=(0, 0, 0))
    desk = bpy.context.active_object; desk.name = "Desk"
    dm = bpy.data.materials.new("Desk"); dm.use_nodes = True
    db = dm.node_tree.nodes["Principled BSDF"]
    db.inputs["Base Color"].default_value = (*ped.srgb(DESK_RGB), 1); db.inputs["Roughness"].default_value = 0.55
    desk.data.materials.append(dm)
    # world: warm paper env; glossy rays may be switched to the brighter neutral env (ring pass, D-179)
    w = bpy.data.worlds.new("W"); sc.world = w; w.use_nodes = True
    nt = w.node_tree
    env = nt.nodes.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(ped.ENV)
    warm = nt.nodes["Background"]; warm.inputs["Strength"].default_value = ENV_STRENGTH
    tint = nt.nodes.new("ShaderNodeMix"); tint.data_type = 'RGBA'; tint.blend_type = 'MULTIPLY'
    tint.inputs["Factor"].default_value = 1.0; tint.inputs["B"].default_value = (1.0, 0.72, 0.48, 1)
    nt.links.new(env.outputs[0], tint.inputs["A"]); nt.links.new(tint.outputs["Result"], warm.inputs[0])
    cool = nt.nodes.new("ShaderNodeBackground"); cool.inputs["Strength"].default_value = float(os.environ.get("RING_ENV", "1.5"))   # D-181d: Figma chrome (D-181b had 1.55 for a whiter ring)
    cg = nt.nodes.new("ShaderNodeMix"); cg.data_type = 'RGBA'; cg.blend_type = 'MULTIPLY'
    cg.inputs["Factor"].default_value = 1.0; cg.inputs["B"].default_value = (0.97, 0.99, 1.03, 1)
    nt.links.new(env.outputs[0], cg.inputs["A"]); nt.links.new(cg.outputs["Result"], cool.inputs[0])
    lp = nt.nodes.new("ShaderNodeLightPath"); mx = nt.nodes.new("ShaderNodeMixShader")
    sw = nt.nodes.new("ShaderNodeMath"); sw.operation = 'MULTIPLY'; sw.name = "SilverSwitch"; sw.inputs[1].default_value = 0.0
    nt.links.new(lp.outputs["Is Glossy Ray"], sw.inputs[0]); nt.links.new(sw.outputs[0], mx.inputs[0])
    nt.links.new(warm.outputs[0], mx.inputs[1]); nt.links.new(cool.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], [n for n in nt.nodes if n.type == 'OUTPUT_WORLD'][0].inputs[0])
    K = KEY
    ld = bpy.data.lights.new("Key_Lamp", 'AREA'); ld.shape = 'DISK'
    ld.size = K["size"] * MM; ld.energy = KEY_POWER; ld.color = K["color"]
    key = bpy.data.objects.new("Key_Lamp", ld); sc.collection.objects.link(key)
    key.location = Vector(K["pos"]) * MM
    key.rotation_euler = (Vector((0, 0, 4 * MM)) - key.location).to_track_quat('-Z', 'Y').to_euler()
    # lamp spill (plate only, D-181 review): the table lamp's low warm light from the right. Close and low, so the
    # top face is brighter on its right half, the right lip catches a highlight, the left and front faces stay in
    # shade and the pedestal throws a long soft shadow to the left-front. Light-linked to pedestal + desk only:
    # the ring neither receives it nor casts a shadow from it, so the ring look and the live ring shadow
    # (key light of the pose JSON) are unchanged.
    sd = bpy.data.lights.new("Lamp_Spill", 'AREA'); sd.shape = 'DISK'
    sd.size = SPILL["size"] * MM; sd.energy = SPILL["power"]; sd.color = SPILL["color"]
    spill = bpy.data.objects.new("Lamp_Spill", sd); sc.collection.objects.link(spill)
    spill.location = Vector(SPILL["pos"]) * MM
    spill.rotation_euler = (Vector((0, 0, 4 * MM)) - spill.location).to_track_quat('-Z', 'Y').to_euler()
    col = bpy.data.collections.new("SpillSet"); sc.collection.children.link(col)
    col.objects.link(pd); col.objects.link(desk)
    spill.light_linking.receiver_collection = col
    bcol = bpy.data.collections.new("SpillBlockers"); sc.collection.children.link(bcol)
    bcol.objects.link(pd); bcol.objects.link(desk)
    spill.light_linking.blocker_collection = bcol
    cd = bpy.data.cameras.new("Cam_S01"); cam = bpy.data.objects.new("Cam_S01", cd); sc.collection.objects.link(cam)
    sc.camera = cam
    ped.place_camera(cam, **CAM)
    bpy.context.view_layer.update()
    return dict(ped=[pd], proxy=[o for o in proxy_objs if o.type == 'MESH'], ring=[o for o in ring_objs if o.type == 'MESH'],
                ring_root=ring, desk=[desk], key=key, cam=cam, switch=sw, warm=warm, spill_blockers=bcol)


RING_DESK_RGB = tuple(int(v) for v in os.environ.get("RING_DESK", "78,56,40").split(","))
RING_LOOK = os.environ.get("RING_LOOK", "AgX - High Contrast")   # D-181d: Figma-like chrome contrast (was None)
CONTACT_DIST = float(os.environ.get("CONTACT_DIST", "12.0"))     # mm: reach of the contact occlusion around the touch point


def contact_material():
    m = bpy.data.materials.new("Contact_AO"); m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    N.clear()
    ao = N.new("ShaderNodeAmbientOcclusion"); ao.samples = 32; ao.inputs["Distance"].default_value = CONTACT_DIST * MM
    em = N.new("ShaderNodeEmission"); out = N.new("ShaderNodeOutputMaterial")
    L.new(ao.outputs["AO"], em.inputs["Strength"]); L.new(em.outputs[0], out.inputs["Surface"])
    return m


def show(objs, mode):
    """mode: 'on' | 'cast' (in the scene, hidden from the camera) | 'off'"""
    for o in objs:
        o.hide_render = mode == 'off'
        o.visible_camera = mode == 'on'


REFL_ROUGH = float(os.environ.get("REFL_ROUGH", "0.26"))   # D-186b: gloss of the desk varnish for the pedestal's reflection
REFL_K = float(os.environ.get("REFL_K", "0.25"))           # ... and how much of that mirror image the desk returns


def render_pass(name, S, pd, ring, desk, proxy='off', exr=False, silver=False, samples=None, denoise=True, contact=False, reflect=False):
    sc = bpy.context.scene
    if "refl_mat" not in S:
        S["desk_mat"] = S["desk"][0].data.materials[0]
        m = bpy.data.materials.new("Desk_Reflection"); m.use_nodes = True; m.node_tree.nodes.clear()
        gl = m.node_tree.nodes.new("ShaderNodeBsdfGlossy"); gl.inputs["Roughness"].default_value = REFL_ROUGH
        out = m.node_tree.nodes.new("ShaderNodeOutputMaterial"); m.node_tree.links.new(gl.outputs[0], out.inputs["Surface"])
        S["refl_mat"] = m
        # a rough mirror 0.02 mm above the desk that only the camera sees: the pedestal stays lit as in the plate
        # (lights, env and the bounce off the diffuse desk underneath), and the mirror shows nothing but its image
        bpy.ops.mesh.primitive_plane_add(size=1.2, location=(0, 0, 0.00002))
        mp = bpy.context.active_object; mp.name = "Desk_Mirror"; mp.data.materials.append(m)
        mp.visible_diffuse = mp.visible_glossy = mp.visible_transmission = mp.visible_shadow = False
        S["mirror"] = mp
        S["cool"] = next(n for n in sc.world.node_tree.nodes if n.type == 'BACKGROUND' and n != S["warm"])
        S["cool_strength"] = S["cool"].inputs["Strength"].default_value
    S["mirror"].hide_render = not reflect
    for o in (S["key"], bpy.data.objects["Lamp_Spill"]): o.visible_glossy = not reflect
    S["cool"].inputs["Strength"].default_value = 0.0 if reflect else S["cool_strength"]      # glossy rays see a black world
    if "contact_mat" not in S: S["contact_mat"] = contact_material()
    bpy.context.view_layer.material_override = S["contact_mat"] if contact else None
    show(S["ped"], pd); show(S["ring"], ring); show(S["desk"], desk); show(S["proxy"], proxy)
    S["switch"].inputs[1].default_value = 1.0 if (silver or reflect) else 0.0
    # ring pass only (D-181d): the ring also blocks the lamp spill, so the wood right under it is in shade and the
    # ring's underside reflects dark, like Figma. The plate and shadow passes keep the ring out of the spill.
    # ... and the desk it mirrors is the dim, desaturated foreground of the photo, not the flat lit desk tone
    dcol = RING_DESK_RGB if silver else DESK_RGB
    S["desk_mat"].node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (*ped.srgb(dcol), 1)
    for o in S["ped"]: o.visible_glossy = not silver      # the underside mirrors the dim desk, not the lit oak top
    for o in S["ring"]:
        if silver and o.name not in S["spill_blockers"].objects: S["spill_blockers"].objects.link(o)
        if not silver and o.name in S["spill_blockers"].objects: S["spill_blockers"].objects.unlink(o)
    S["warm"].inputs["Strength"].default_value = ENV_STRENGTH_RING if silver else ENV_STRENGTH
    S["key"].data.color = (1.0, 0.86, 0.72) if silver else KEY["color"]
    S["key"].data.energy = KEY_POWER_RING if silver else KEY_POWER
    sc.cycles.samples = samples or SPP
    sc.cycles.use_denoising = denoise
    s = sc.render.image_settings
    if exr:
        s.file_format = 'OPEN_EXR'; s.color_mode = 'RGBA'; s.color_depth = '32'; s.exr_codec = 'ZIP'
    else:
        s.file_format = 'PNG'; s.color_mode = 'RGBA'; s.color_depth = '16'; s.compression = 15
        sc.view_settings.view_transform = 'AgX'
        sc.view_settings.look = RING_LOOK if silver else P_LOOK
        sc.view_settings.exposure = float(os.environ.get("RING_EXPOSURE", "0.0")) if silver else P_EXPOSURE
    sc.render.filepath = f"{PASS}/{name}.{'exr' if exr else 'png'}"
    bpy.ops.render.render(write_still=True)
    print("PLATE pass", name, "done")


def render():
    os.makedirs(PASS, exist_ok=True)
    S = scene_setup()
    only = os.environ.get("PLATE_ONLY", "").split(",") if os.environ.get("PLATE_ONLY") else None
    half = max(32, SPP // 2)      # flat desk: converges fast
    jobs = [("D0", dict(pd='off', ring='off', desk='on', exr=True, samples=half)),
            ("D1", dict(pd='cast', ring='off', desk='on', exr=True, samples=half)),
            ("D2", dict(pd='cast', ring='cast', desk='on', exr=True, samples=half)),
            ("P1", dict(pd='on', ring='off', desk='cast')),
            ("P2", dict(pd='on', ring='cast', desk='cast')),
            ("RG", dict(pd='cast', ring='on', desk='cast', silver=True)),
            ("MK", dict(pd='off', ring='off', desk='off', proxy='on', samples=32, denoise=False)),
            ("C1", dict(pd='on', ring='off', desk='cast', exr=True, samples=192, contact=True)),
            ("C2", dict(pd='on', ring='cast', desk='cast', exr=True, samples=192, contact=True)),
            ("R1", dict(pd='cast', ring='off', desk='cast', exr=True, samples=half, reflect=True))]
    sc = bpy.context.scene
    for sfx, border, lens, shift in (("", BORDER, CAM["lens"], CAM["shift"]), ("m", BORDER_M, MOB_LENS, MOB_SHIFT)):
        S["cam"].data.lens = lens; S["cam"].data.shift_x, S["cam"].data.shift_y = shift
        sc.render.border_min_x, sc.render.border_max_x, sc.render.border_min_y, sc.render.border_max_y = border
        for name, kw in jobs:
            if only and name + sfx not in only: continue
            render_pass(name + sfx, S, **kw)
    S["cam"].data.lens = CAM["lens"]; S["cam"].data.shift_x, S["cam"].data.shift_y = CAM["shift"]
    sc.render.border_min_x, sc.render.border_max_x, sc.render.border_min_y, sc.render.border_max_y = BORDER
    bpy.context.view_layer.material_override = None
    if "mirror" in S: S["mirror"].hide_render = True
    for grp in ("ped", "ring", "desk"): show(S[grp], 'on')
    show(S["proxy"], 'off')
    bpy.ops.wm.save_as_mainfile(filepath=V2 + "/s01-plate.blend", compress=True)
    write_camera_json(S)


def write_camera_json(S):
    """camera + check points in plate fractions, straight from Blender (used by comp() for the pose JSON)"""
    from bpy_extras.object_utils import world_to_camera_view
    sc = bpy.context.scene; cam = S["cam"]
    def frac(p):
        c = world_to_camera_view(sc, cam, Vector(p))
        return [round(c.x, 6), round(1 - c.y, 6)]
    hw, hd = W / 2 * MM, D / 2 * MM
    ox_, oy_ = ped.PED_POS[0] * MM, ped.PED_POS[1] * MM
    pts = {"origin_bottom_centre": (0, 0, 0), "top_centre": (0, 0, H * MM),
           "top_left_mid": (-hw, 0, H * MM), "top_right_mid": (hw, 0, H * MM),
           "top_front_mid": (0, -hd, H * MM), "top_back_mid": (0, hd, H * MM),
           "bottom_front_mid": (0, -hd, 0), "bottom_left_mid": (-hw, 0, 0), "bottom_right_mid": (hw, 0, 0)}
    pts = {k: (v[0] + ox_, v[1] + oy_, v[2]) for k, v in pts.items()}
    out = {"points_blender_m": {k: list(v) for k, v in pts.items()},
           "points_three_m": {k: [v[0], v[2], -v[1]] for k, v in pts.items()},
           "points_plate_fraction_uv": {k: frac(v) for k, v in pts.items()},
           "ring_matrix_world": [list(r) for r in S["ring_root"].matrix_world]}
    with open(PASS + "/camera-check.json", "w") as f: json.dump(out, f, indent=1)


# ---------------------------------------------------------------- image helpers (all arrays top-down, float32)
def load(path, linear=False):
    img = bpy.data.images.load(path, check_existing=False)
    if not linear: img.colorspace_settings.name = 'Non-Color'
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32); img.pixels.foreach_get(a)
    bpy.data.images.remove(img)
    return a.reshape(h, w, 4)[::-1].copy()


def save(arr, path, quality=92):
    """arr: display-encoded RGB or RGBA (straight alpha), top-down"""
    h, w, c = arr.shape
    if c == 3: arr = np.concatenate([arr, np.ones((h, w, 1), np.float32)], -1)
    img = bpy.data.images.new("tmp_out", w, h, alpha=True)
    img.colorspace_settings.name = 'Non-Color'; img.alpha_mode = 'STRAIGHT'
    img.pixels.foreach_set(np.clip(arr[::-1], 0, 1).astype(np.float32).ravel())
    sc = bpy.context.scene; s = sc.render.image_settings
    ext = path.rsplit(".", 1)[1].lower()
    s.file_format = {'png': 'PNG', 'webp': 'WEBP', 'jpg': 'JPEG'}[ext]
    s.color_mode = 'RGBA' if (c == 4 and ext != 'jpg') else 'RGB'
    s.color_depth = '8'; s.quality = quality; s.compression = 90
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = 0
    img.save_render(path, scene=sc)
    bpy.data.images.remove(img)
    print("PLATE wrote", os.path.relpath(path, V2), f"{os.path.getsize(path) / 1024:.0f} KB")


def eotf(c): return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def oetf(c): c = np.clip(c, 0, None); return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)


def bilinear(arr, xs, ys):
    """sample arr at float pixel-centre coords (xs: [w], ys: [h]); outside -> edge value"""
    Hh, Ww = arr.shape[:2]
    x0 = np.clip(np.floor(xs).astype(int), 0, Ww - 2); y0 = np.clip(np.floor(ys).astype(int), 0, Hh - 2)
    fx = np.clip(xs - x0, 0, 1)[None, :, None]; fy = np.clip(ys - y0, 0, 1)[:, None, None]
    a = arr[y0][:, x0] * (1 - fx) + arr[y0][:, x0 + 1] * fx
    b = arr[y0 + 1][:, x0] * (1 - fx) + arr[y0 + 1][:, x0 + 1] * fx
    return a * (1 - fy) + b * fy


def gauss(arr, sigma):
    r = max(1, int(math.ceil(sigma * 3)))
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2); k /= k.sum()
    out = np.zeros_like(arr)
    pad = np.pad(arr, ((r, r), (0, 0), (0, 0)), mode='edge')
    for i, kv in enumerate(k): out += kv * pad[i:i + arr.shape[0]]
    pad = np.pad(out, ((0, 0), (r, r), (0, 0)), mode='edge'); out = np.zeros_like(arr)
    for i, kv in enumerate(k): out += kv * pad[:, i:i + arr.shape[1]]
    return out


def resize(arr, w, h):
    Hh, Ww = arr.shape[:2]
    f = max(Ww / w, Hh / h)
    if f > 1.05: arr = gauss(arr, 0.5 * math.sqrt(f * f - 1))
    return bilinear(arr, (np.arange(w) + 0.5) * Ww / w - 0.5, (np.arange(h) + 0.5) * Hh / h - 0.5)


def over(fg, bg):
    """straight-alpha fg over opaque bg, display space (what the browser does)"""
    a = fg[..., 3:4]
    return fg[..., :3] * a + bg[..., :3] * (1 - a)


def cover(arr, w, h):
    Hh, Ww = arr.shape[:2]
    s = max(w / Ww, h / Hh)
    rw, rh = round(Ww * s), round(Hh * s)
    r = resize(arr, rw, rh)
    x0, y0 = (rw - w) // 2, (rh - h) // 2
    return r[y0:y0 + h, x0:x0 + w]


def webframe(arr, fw, fh):
    Hh, Ww = arr.shape[:2]
    k, ox, oy = webframe_map(Ww, Hh, fw, fh)
    if k < 0.95: arr = gauss(arr, 0.5 * math.sqrt(1 / k ** 2 - 1))
    return bilinear(arr, (np.arange(fw) + 0.5 - ox) / k - 0.5, (np.arange(fh) + 0.5 - oy) / k - 0.5)


def fit():
    """quick fit against Figma: bboxes of the pedestal (P1 alpha) and ring (RG alpha) in the 2880 x 1800 web rest frame"""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    P1, RG = load(f"{PASS}/P1.png"), load(f"{PASS}/RG.png")
    Hh, Ww = P1.shape[:2]
    k, ox, oy = webframe_map(Ww, Hh, 2880, 1800)
    for name, a in (("pedestal", P1[..., 3]), ("ring", RG[..., 3])):
        ys, xs = np.where(a > 0.5)
        bb = [xs.min() * k + ox, ys.min() * k + oy, (xs.max() + 1) * k + ox, (ys.max() + 1) * k + oy]
        print("FIT", name, [round(float(v)) for v in bb], "w", round(float(bb[2] - bb[0])), "h", round(float(bb[3] - bb[1])))
    print("FIT figma pedestal [886, 1266, 1982, 1640] w 1096 h 374 ; ring [1088, 598, 1805, 1408] w 717 h 810")
    photo = resize(load(PHOTO)[..., :3], Ww, Hh)
    c = over(RG, over(P1, photo)[..., :3] if False else np.concatenate([over(P1, photo)], -1))
    fig = resize(load(FIGMA)[..., :3], 1440, 900)
    ours = webframe(c, 1440, 900)
    save(0.5 * ours + 0.5 * fig, f"{REN}/fit-onion.png")
    save(hstack(ours, fig), f"{REN}/fit-side.png")


def ringstat():
    """quick look at the ring pass alone against Figma (any pass resolution)"""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    RG = load(f"{PASS}/RG.png"); Hh, Ww = RG.shape[:2]
    plate = resize(load(f"{OUT}/still-s01-3840.png")[..., :3], Ww, Hh)
    fig = resize(load(FIGMA)[..., :3], 1440, 900)
    ours = webframe(over(RG, plate), 1440, 900)
    m = webframe(RG[..., 3:4], 1440, 900)[..., 0] > 0.98
    L_ = lambda im: (im[..., :3] * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1)[m] * 255
    for n, v in (("poster", L_(ours)), ("figma", L_(fig))):
        print("RINGSTAT", n, [round(float(np.percentile(v, q))) for q in (5, 25, 50, 75, 95)], "mean", round(float(v.mean())))
    save(hstack(ours[250:760, 500:960], fig[250:760, 500:960]), f"{REN}/ringstat.png")


def erode(m):
    p = np.pad(m, 1, mode='constant')
    return p[1:-1, 1:-1] & p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]


def edge_of(mask):
    return mask & ~erode(mask)


def hstack(*imgs, gap=12):
    h = max(i.shape[0] for i in imgs)
    out = []
    for n, i in enumerate(imgs):
        if i.shape[0] < h: i = np.concatenate([i, np.full((h - i.shape[0], i.shape[1], 3), 0.07, np.float32)], 0)
        out.append(i[..., :3])
        if n < len(imgs) - 1: out.append(np.full((h, gap, 3), 0.07, np.float32))
    return np.concatenate(out, 1)


# ---------------------------------------------------------------- composite
# D-186b. Defocus of the photo, measured on the desk grain (edge width of the grain lines per band, calibrated by blurring
# the sharpest band, v 0.69-0.76): extra Gaussian sigma 1.5 px at v 0.80 and 2.4 px at v 0.88-0.90 (3840 frame). The
# pedestal's back stands at the desk depth of v 0.80 and its front at v 0.895, so its layers are blurred by a sigma that
# runs from DOF[0] at its top row to DOF[1] at its bottom row. The ring is not blurred (it is the live ring's poster).
DOF = tuple(float(v) for v in os.environ.get("DOF", "1.5,2.4").split(","))
DOF_V = (0.718, 0.900)
PED_DESAT = float(os.environ.get("PED_DESAT", "0.25"))   # chroma taken out of the pedestal's darks (front face): photo oak in shade has G/R ~0.5, B/R ~0.2


def defocus(arr, sig):
    """row-variable Gaussian: blend of 4 blur levels, sig = per-row sigma in px"""
    lo, hi = float(sig.min()), float(sig.max())
    if hi < 0.05: return arr
    lv = np.linspace(lo, hi, 4) if hi - lo > 1e-3 else np.array([hi])
    st = [gauss(arr, max(float(v), 0.05)) for v in lv]
    if len(st) == 1: return st[0]
    t = (sig - lo) / (hi - lo) * (len(lv) - 1); i0 = np.clip(np.floor(t).astype(int), 0, len(lv) - 2); f = (t - i0)[:, None, None]
    out = np.empty_like(arr)
    for k in range(len(lv) - 1):
        m = i0 == k
        if m.any(): out[m] = st[k][m] * (1 - f[m]) + st[k + 1][m] * f[m]
    return out


def ped_grade(img):
    rgb = img[..., :3]; y = (rgb * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1, keepdims=True)
    t = np.clip((y - 0.25) / 0.30, 0, 1); w = 1 - t * t * (3 - 2 * t)
    return np.concatenate([y + (rgb - y) * (1 - PED_DESAT * w), img[..., 3:4]], -1)


CONTACT_GAMMA = float(os.environ.get("CONTACT_GAMMA", "2.8"))   # strength of the contact occlusion (display space)
CONTACT_FLOOR = float(os.environ.get("CONTACT_FLOOR", "0.10"))  # darkest it gets right at the touch line
def comp():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    os.makedirs(OUT, exist_ok=True)
    photo = load(PHOTO)[..., :3]
    if SCALE != 1: photo = resize(photo, RW, RH)
    Hh, Ww = photo.shape[:2]
    lin = eotf(photo)
    yy = (np.arange(Hh) + 0.5) / Hh; xx = (np.arange(Ww) + 0.5) / Ww
    def ramp(t): t = np.clip(t, 0, 1); return t * t * (3 - 2 * t)
    lum = lambda x: (x * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1, keepdims=True)
    SHC = np.array([42, 22, 8], np.float32) / 255
    def build(sfx, border):
        D0, D1, D2 = (load(f"{PASS}/{n}{sfx}.exr", linear=True)[..., :3] for n in ("D0", "D1", "D2"))
        P1, P2, RG, MK = (load(f"{PASS}/{n}{sfx}.png") for n in ("P1", "P2", "RG", "MK"))
        vd = yy if not sfx else MOB_O[1] + (yy - MOB_O[1] - MOB_DY) / MOB_K          # the row's v in the desktop frame
        sig = np.interp(vd, DOF_V, DOF).astype(np.float32) * (Ww / FW) * (MOB_K if sfx else 1.0)
        def dof(img):
            pm = defocus(np.concatenate([img[..., :3] * img[..., 3:4], img[..., 3:4]], -1), sig)
            return np.concatenate([pm[..., :3] / np.maximum(pm[..., 3:4], 1e-4), pm[..., 3:4]], -1)
        P1, P2 = dof(ped_grade(P1)), dof(ped_grade(P2))
        # feather the desk ratios to exactly 1 at the render border (no seam); a border on the frame edge is not feathered
        fe = 0.035
        fx = ramp((xx - border[0]) / fe) * ramp((border[1] - xx) / fe)
        fy = ramp((yy - (1 - border[3])) / fe) * (ramp(((1 - border[2]) - yy) / fe) if border[2] > 0 else 1.0)
        feather = (fy[:, None] * fx[None, :])[..., None]
        ok = D0 > 1e-5
        r1 = np.where(ok, D1 / np.maximum(D0, 1e-5), 1.0); r1 = 1 + (np.clip(r1, 0, 1.35) - 1) * feather
        r2 = np.where(ok, D2 / np.maximum(D0, 1e-5), 1.0); r2 = 1 + (np.clip(r2, 0, 1.35) - 1) * feather
        r1, r2 = defocus(r1, sig), defocus(r2, sig)
        # faint mirror image of the pedestal in the varnished desk (rough-mirror pass under a black world), added in linear light
        refl = REFL_K * defocus(np.clip(load(f"{PASS}/R1{sfx}.exr", linear=True)[..., :3], 0, 4) * feather, sig)
        desk1 = oetf(lin * r1 + refl)                # photo + pedestal contact shadow / AO / bounce + reflection
        desk2 = oetf(lin * r2 + refl)                # ... + ring shadow
        a = P1[..., 3:4]
        plate = P1[..., :3] * a + desk1 * (1 - a)
        # contact occlusion of the ring on the pedestal (short-range AO with / without the ring), D-181c
        C1, C2 = (load(f"{PASS}/{n}{sfx}.exr", linear=True)[..., :1] for n in ("C1", "C2"))
        contact = np.where(C1 > 1e-3, np.clip(C2 / np.maximum(C1, 1e-3), 0, 1), 1.0) ** CONTACT_GAMMA
        contact = defocus(CONTACT_FLOOR + (1 - CONTACT_FLOOR) * contact, sig)
        still_exact = P2[..., :3] * contact * a + desk2 * (1 - a)
        # ring shadow as a straight-alpha layer in display space. Colour = the web desk catcher's warm dark
        # (#2A1608), so shadows stay warm instead of going grey: plate (1 - a) + c a has the luminance of the exact render
        lp_ = lum(plate); num = np.clip(lp_ - lum(still_exact), 0, None)
        sh = num / np.maximum(np.maximum(lp_ - lum(SHC[None, None]), 0.2 * lp_), 1e-3)
        sh = np.clip(np.where((sh < 0.004) | (num < 0.0015), 0, sh), 0, 1)     # no stray alpha on the photo's near-black pixels
        ra = RG[..., 3:4]
        oa = ra + (1 - ra) * sh
        overlay = np.concatenate([np.where(oa > 1e-5, (RG[..., :3] * ra + SHC * (1 - ra) * sh) / np.maximum(oa, 1e-5), 0), oa], -1)
        still = over(overlay, plate)                 # flattened poster == plate + overlay, exactly
        mult = np.clip(desk1 / np.maximum(photo, 1e-4), 0, 1)
        return dict(plate=plate, still=still, overlay=overlay, mult=mult, ped=np.concatenate([P1[..., :3], a], -1), a=a, MK=MK)
    Dk, Mb = build("", BORDER), build("m", BORDER_M)
    plate, still, overlay, a, MK = Dk["plate"], Dk["still"], Dk["overlay"], Dk["a"], Dk["MK"]
    plate_m, still_m, overlay_m = Mb["plate"], Mb["still"], Mb["overlay"]
    mult, ped_layer = Dk["mult"], Dk["ped"]
    tag = "" if SCALE == 1 else f"-preview{RW}"
    save(plate, f"{OUT}/plate-s01-3840{tag}.png")
    save(plate_m, f"{OUT}/plate-s01-mobile-3840{tag}.png")
    save(still, f"{OUT}/still-s01-3840{tag}.png")
    save(still_m, f"{OUT}/still-s01-mobile-3840{tag}.png")
    save(overlay, f"{OUT}/ring-overlay-s01-3840{tag}.png"); save(overlay, f"{OUT}/ring-overlay-s01-3840{tag}.webp", 90)
    save(overlay_m, f"{OUT}/ring-overlay-s01-mobile-3840{tag}.png"); save(overlay_m, f"{OUT}/ring-overlay-s01-mobile-3840{tag}.webp", 90)
    save(ped_layer, f"{OUT}/layer-pedestal-rgba-3840{tag}.png")
    save(mult, f"{OUT}/layer-desk-multiply-3840{tag}.png")
    save(Mb["ped"], f"{OUT}/layer-pedestal-rgba-mobile-3840{tag}.png")
    save(Mb["mult"], f"{OUT}/layer-desk-multiply-mobile-3840{tag}.png")
    # ---- evidence
    report = {}
    # proxy overlay: GLB silhouette (cyan) over the plate; tolerance = thickness of the mismatch band
    mp, mk = a[..., 0] > 0.5, MK[..., 3] > 0.5
    x = mp ^ mk; n = 0; cur = x
    while cur.any(): cur = erode(cur); n += 1
    ys_, xs_ = np.where(mk); yp, xp = np.where(mp)
    bb = lambda xs2, ys2: [int(xs2.min()), int(ys2.min()), int(xs2.max()), int(ys2.max())]
    k1818 = 1920 / Ww
    xm = (Mb["a"][..., 0] > 0.5) ^ (Mb["MK"][..., 3] > 0.5); nm = 0; cur = xm
    while cur.any(): cur = erode(cur); nm += 1
    report["proxy_overlay_mobile_band_max_px_at_1920"] = round(nm * k1818, 2)
    report["proxy_overlay"] = {"frame": [Ww, Hh], "plate_pedestal_bbox_px": bb(xp, yp), "proxy_glb_bbox_px": bb(xs_, ys_),
                               "mismatch_pixels": int(x.sum()), "mismatch_band_max_px_at_frame": n,
                               "mismatch_band_max_px_at_1920": round(n * k1818, 2),
                               "bbox_delta_px_at_1920": [round((p - q) * k1818, 2) for p, q in zip(bb(xp, yp), bb(xs_, ys_))]}
    ov = plate.copy()
    e = edge_of(mk); e2 = e.copy()
    if SCALE == 1:                               # 2 px line at full res so it survives downscaling
        pe = np.pad(e, 1); e2 = pe[1:-1, 1:-1] | pe[:-2, 1:-1] | pe[1:-1, :-2]
    ov[e2] = (0.0, 1.0, 1.0); ov[x & ~e2] = (1.0, 0.0, 1.0)
    x0, y0, x1, y1 = bb(xs_, ys_); mgn = round(60 * SCALE) + 8
    crop = ov[max(0, y0 - mgn):y1 + mgn, max(0, x0 - mgn):x1 + mgn]
    save(ov, f"{REN}/s01-plate-proxy-overlay{tag}.webp", 92)
    save(crop, f"{REN}/s01-plate-proxy-overlay-closeup{tag}.png")
    # independent check of the JSON camera numbers with three.js-style maths (no Blender camera involved)
    chk = json.load(open(PASS + "/camera-check.json"))
    cj = pose_camera()
    pos, tgt = np.array(cj["position"]), np.array(cj["lookAt"])
    z = pos - tgt; z /= np.linalg.norm(z); xax = np.cross([0, 1, 0], z); xax /= np.linalg.norm(xax); yax = np.cross(z, xax)
    fpx = cj["plate"]["focal_fraction_of_width"]; ppu, ppv = cj["plate"]["principal_point_fraction"]
    worst = 0
    for kname, p3 in chk["points_three_m"].items():
        d = np.array(p3) - pos; xc, yc, zc = d @ xax, d @ yax, d @ z
        u = ppu + fpx * xc / -zc
        v = ppv - fpx * (FW / FH) * yc / -zc
        bu, bv = chk["points_plate_fraction_uv"][kname]
        worst = max(worst, abs(u - bu) * 1920, abs(v - bv) * 1200)
    report["json_camera_vs_blender_max_px_at_1920"] = round(worst, 3)
    # side by side with Figma 40004725:5602 (web framing: the plate covers 1440 x 900, like the photo does)
    fig = load(FIGMA)[..., :3]
    fw, fh = (2880, 1800) if SCALE == 1 else (1440, 900)
    if fig.shape[1] != fw: fig = resize(fig, fw, fh)
    # the web REST frame: cover x CSS zoom 1.14 about heroBg.anchor (that is what the user sees next to Figma)
    ours_s, ours_p = webframe(still, fw, fh), webframe(plate, fw, fh)
    save(0.5 * ours_s + 0.5 * fig, f"{REN}/s01-plate-still-onion-figma{tag}.webp", 92)
    kk, ox, oy = webframe_map(Ww, Hh, 2880, 1800)
    def wbb(al):
        ys2, xs2 = np.where(al > 0.5)
        return [round(float(v)) for v in (xs2.min() * kk + ox, ys2.min() * kk + oy, (xs2.max() + 1) * kk + ox, (ys2.max() + 1) * kk + oy)]
    report["web_rest_frame_2880x1800"] = {"pedestal_bbox_px": wbb(a[..., 0]), "figma_pedestal_bbox_px": [886, 1266, 1982, 1640],
                                          "ring_bbox_px": wbb(load(f"{PASS}/RG.png")[..., 3]), "figma_ring_bbox_px": [1088, 598, 1805, 1408],
                                          "note": "Figma boxes read off hero-text-layout-ref.png by eye (+-6 px)"}
    save(hstack(ours_s, fig), f"{REN}/s01-plate-still-vs-figma{tag}.webp", 92)
    save(hstack(ours_p, fig), f"{REN}/s01-plate-vs-figma{tag}.webp", 92)
    cx0, cx1, cy0, cy1 = (round(v * fw / 2880) for v in (760, 2110, 1150, 1700))
    save(hstack(ours_p[cy0:cy1, cx0:cx1], fig[cy0:cy1, cx0:cx1]), f"{REN}/s01-plate-vs-figma-closeup{tag}.png")
    save(hstack(ours_s[cy0:cy1, cx0:cx1], fig[cy0:cy1, cx0:cx1]), f"{REN}/s01-plate-still-vs-figma-closeup{tag}.png")
    cq = tuple(round(v * fw / 2880) for v in (1100, 1900, 1180, 1560))
    save(hstack(ours_s[cq[2]:cq[3], cq[0]:cq[1]], fig[cq[2]:cq[3], cq[0]:cq[1]]), f"{REN}/s01-plate-contact-closeup-vs-figma{tag}.png")
    # ring tone distribution, poster vs Figma, over the pixels both rings cover (the rings coincide in this frame)
    rmask = webframe(load(f"{PASS}/RG.png")[..., 3:4], fw, fh)[..., 0] > 0.98
    L_ = lambda im: (im[..., :3] * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1)[rmask] * 255
    pct = lambda v: {k: round(float(np.percentile(v, q)), 1) for k, q in (("p05", 5), ("p25", 25), ("p50", 50), ("p75", 75), ("p95", 95))} | {"mean": round(float(v.mean()), 1)}
    report["ring_luma_8bit_web_rest_frame"] = {"poster": pct(L_(ours_s)), "figma": pct(L_(fig))}
    rq = tuple(round(v * fw / 2880) for v in (1000, 1900, 520, 1500))
    save(hstack(ours_s[rq[2]:rq[3], rq[0]:rq[1]], fig[rq[2]:rq[3], rq[0]:rq[1]]), f"{REN}/s01-plate-ring-closeup-vs-figma{tag}.png")
    save(cover(still_m, 750, 1624) if SCALE == 1 else cover(still_m, 375, 812), f"{REN}/s01-plate-mobile-still-375{tag}.png")
    save(resize(plate_m, 1920, 1200) if SCALE == 1 else plate_m, f"{REN}/s01-plate-mobile-1920{tag}.png")
    # D-186 realism check: the still at plate resolution, pedestal + ring with the desk around them, and a 100 % detail
    rc = lambda u0, v0, u1, v1: still[round(v0 * Hh):round(v1 * Hh), round(u0 * Ww):round(u1 * Ww)]
    save(rc(0.14, 0.30, 0.86, 1.0), f"{REN}/s01-plate-realism-closeup{tag}.webp", 93)
    save(rc(0.30, 0.68, 0.70, 0.96), f"{REN}/s01-plate-realism-detail-100pct{tag}.png")
    pc = lambda u0, v0, u1, v1: plate[round(v0 * Hh):round(v1 * Hh), round(u0 * Ww):round(u1 * Ww)]
    save(pc(0.14, 0.55, 0.86, 1.0), f"{REN}/s01-plate-realism-plate-only{tag}.webp", 93)
    with open(f"{REN}/s01-plate-report{tag}.json", "w") as f: json.dump(report, f, indent=1)
    print("PLATE report", json.dumps(report))
    if SCALE == 1: write_pose(report, chk)


def pose_camera():
    """the D-186 camera for the 3840 x 2400 plate (fractions of the frame)"""
    C = CAM
    t = Vector(C["target"]) * MM
    e, az = math.radians(C["elev"]), math.radians(C["azim"]); d = C["dist"] * MM
    loc = t + Vector((math.sin(az) * math.cos(e) * d, -math.cos(az) * math.cos(e) * d, math.sin(e) * d))
    v2t = lambda v: [round(v.x, 6), round(v.z, 6), round(-v.y, 6)]
    f = C["lens"] / 36.0; ppu, ppv = 0.5 - C["shift"][0], 0.5 + C["shift"][1] * FW / FH
    dep = lambda v: round(C["elev"] + math.degrees(math.atan((v - ppv) * FH / (f * FW))), 1)
    return {"type": "PerspectiveCamera", "position": v2t(loc), "lookAt": v2t(t),
            "fov_vertical_deg_at_%dx%d" % (FW, FH): round(math.degrees(2 * math.atan(36.0 / 2 * (FH / FW) / C["lens"])), 3),
            "lens_mm_36mm_sensor": round(C["lens"], 4),
            "filmOffset_or_viewOffset": {"shift_x_fraction_of_width": round(C["shift"][0], 6), "shift_y_fraction_of_width": round(C["shift"][1], 6),
                                         "note": "D-186: position and lookAt are unchanged from D-179/D-181. Only the intrinsics changed with the new 16:10 photo: heroBg.cam = {frameW %d, frameH %d, focalPx %.2f (= lens/36 x frameW), shiftY %.6f}; shift_x (%.6f of the width) is negligible, 0.14 px at 3840." % (FW, FH, f * FW, C["shift"][1], C["shift"][0])},
            "plate": {"file": "plate/plate-s01-3840.png", "size_px": [FW, FH],
                      "focal_fraction_of_width": round(f, 6),
                      "principal_point_fraction": [round(ppu, 6), round(ppv, 6)],
                      "pixel_aspect_x": 1.0,
                      "note": "D-186, new native photo (3840 x 2400, square pixels). u = pp_u + f*x_c/-z_c, v = pp_v - f*(3840/2400)*y_c/-z_c with f = focal_fraction_of_width. Lens and shift were derived from the D-181 camera (70 mm, shiftY 0.135 on the 3632 x 2072 plate) so that the web rest frame (object-fit cover x zoomFrom 1.14 about heroBg.anchor (0.503, 0.8), 16:10 viewport) is the same pinhole image as before: pedestal and ring keep their Figma size and position on screen. heroBg.anchor, zoomFrom and subjectOrigin can stay; v1Ratio becomes 3840/2400."},
            "calibration": {
                "method": "the new photo is a new image of the scene (no feature matches with the 3632 plate), so it was calibrated on its own geometry: desk-plane tilt from two pairs of orthogonal edges lying on the desk (weak perspective: sin^2(depression) = tan(a1) * tan(a2)).",
                "measured_depression_deg": {"laptop_edges_at_v_0.65": 17.5, "book_edges_at_v_0.55": 17.0},
                "camera_depression_deg": {"at_v_0.55": dep(0.55), "at_v_0.65": dep(0.65), "at_pedestal_v_0.80": dep(0.80)},
                "horizon_v_fraction": round(ppv - f * (FW / FH) * math.tan(e), 4),
                "desk_grain_slope_in_image_deg": 2.0,
                "lamp_blender_mm": {"base_on_desk": [69, 73, 0], "shade_opening_centre": [67, 73.5, 34], "in_old_3632_plate_base": [74, 76, 0],
                                    "note": "rays of this camera through the lamp base and shade rim. The scene is at pedestal scale (the ring is deliberately larger than the photo's objects), so these are the lamp's coordinates in the pedestal's space, not real millimetres."},
                "limits": "edges read with a line-segment detector on an AI-made photo: +-2 deg. The keyboard rows do not converge measurably, the book edges converge toward a horizon near v = -0.2; the camera's horizon is at the value above. Good at the pedestal, not a full reconstruction of the photo's lens."},
            "frame": "photo/plate frame, shown object-fit: cover, centred (16:10; a 16:9 viewport crops top and bottom)"}


def write_pose(report, chk):
    P = json.load(open(ped.POSE))
    P["id"] = "D-186 S01 plate on the new 3840 x 2400 photo + invisible pedestal proxy (supersedes the D-181 3632 x 2072 plate)"
    P["camera"] = pose_camera()
    P["camera"]["check_points"] = {"note": "D-186 values. world points (three.js Y-up, metres, pedestal space) and where they fall in the plate (u right, v down, fractions of the frame). Use them to assert the web camera.",
                                   "three_m": chk["points_three_m"], "plate_fraction_uv": chk["points_plate_fraction_uv"]}
    pd = P["pedestal"]
    pd["size_mm"] = {"width_x": W, "depth_z": D, "height_y": H, "corner_radius": ped.R_CORNER,
                     "top_roundover": ped.R_FILLET, "bottom_roundover": ped.R_FILLET_BOT,
                     "note": "D-181b: fitted to the Figma pedestal silhouette in the web rest frame (cover x 1.14 about heroBg.anchor); was 41 x 25.6 x 6.8, corner R 5.3. Lip and bottom-centre pivot unchanged."}
    m = Matrix(chk["ring_matrix_world"]); rl, rq = m.translation, m.to_quaternion()
    P["ring"]["position"] = [round(rl.x, 6), round(rl.z, 6), round(-rl.y, 6)]
    P["ring"]["quaternion"] = [round(rq.x, 6), round(rq.z, 6), round(-rq.y, 6), round(rq.w, 6)]
    P["ring"]["seat_note"] = "D-181b: s01_scale 1.35 -> %s and re-seated so the ring's screen box matches Figma in the web rest frame (see renders/s01-plate/s01-plate-report.json). Same lean/quaternion as D-179. Lowest vertex rests exactly on top_y, on the flat part of the top (no intersection). position already assumes s01_scale." % ped.RING_S01_SCALE
    P["lights"]["plate_only_lamp_spill"] = {
        "note": "Cycles only, baked into the plate; do NOT add it on the web. Low warm lamp light from the right (Blender mm %s, disk D%d mm) light-linked to pedestal + desk: brighter right half of the top, highlight on the right lip, left/front faces in shade, long soft pedestal shadow to the left-front. The ring neither receives it nor casts a shadow from it, so the live ring shadow still comes from lights.key alone." % (list(SPILL["pos"]), SPILL["size"])}
    pd["position"] = [round(ped.PED_POS[0] * MM, 6), 0, round(-ped.PED_POS[1] * MM, 6)]
    pd["position_note"] = "D-181b: the block sits 2.7 mm further from the camera than the old origin so its silhouette lands on Figma's; the GLB pivot is still the bottom centre."
    pd["top_y"] = round(H * MM, 6)
    P["ring"]["s01_scale"] = ped.RING_S01_SCALE
    pd["role"] = "PROXY (D-181): invisible. material.colorWrite = false, depthWrite = true (occludes the ring), plus a multiply shadow catcher (PCSS) on the same mesh for the ring's shadow. Do NOT shade it: the pedestal the user sees is in the plate."
    pd["castShadow"] = False
    pd["receiveShadow"] = True
    pd["castShadow_note"] = "the pedestal's own shadow on the desk is baked into the plate; if the proxy also cast it, the desk catcher would darken it twice. Ring: castShadow true."
    pd["proxy_fit"] = {"overlay": "renders/s01-plate/s01-plate-proxy-overlay.webp (close-up: s01-plate-proxy-overlay-closeup.png)", **report["proxy_overlay"],
                       "json_camera_vs_blender_max_px_at_1920": report["json_camera_vs_blender_max_px_at_1920"]}
    P["plate"] = {
        "desktop": {"plate": "plate/plate-s01-3840.png", "still": "plate/still-s01-3840.png",
                    "ring_overlay_rgba": "plate/ring-overlay-s01-3840.webp"},
        "mobile": {"plate": "plate/plate-s01-mobile-3840.png", "still": "plate/still-s01-mobile-3840.png",
                   "ring_overlay_rgba": "plate/ring-overlay-s01-mobile-3840.webp",
                   "transform": {"scale": MOB_K, "dy_fraction_of_height": MOB_DY, "origin_fraction": list(MOB_O),
                                 "formula": "p' = O + 0.62 (p - O) + (0, -0.14 H), O = (0.5 W, 0.86 H), over the untouched photo",
                                 "how": "rendered natively: a 2D similarity of a pinhole image is the same camera with lens x 0.62 and a new shift, so the phone passes are separate Cycles renders (pedestal RGBA, desk shadow/bounce ratio, ring RGBA), not resampled. Geometrically identical to the CSS scale + translate of the desktop layers; the ring shadow that leaves the bottom of the desktop frame is complete here.",
                                 "blender_camera": {"lens_mm": round(MOB_LENS, 4), "shift_x": round(MOB_SHIFT[0], 6), "shift_y": round(MOB_SHIFT[1], 6)},
                                 "proxy_band_max_px_at_1920": report["proxy_overlay_mobile_band_max_px_at_1920"]},
                   "layers": {"pedestal_rgba": "plate/layer-pedestal-rgba-mobile-3840.png", "desk_multiply": "plate/layer-desk-multiply-mobile-3840.png"}},
        "layers": {"pedestal_rgba": "plate/layer-pedestal-rgba-3840.png", "desk_multiply": "plate/layer-desk-multiply-3840.png",
                   "note": "desktop frame. plate = pedestal_rgba over (photo x desk_multiply). The multiply PNG is clamped at 1 (the few % of warm bounce next to the lit side exist only in the plates, which are composited in linear light)."},
        "source_photo": "design/assets/v2/s01/Hero_BG_Stillway_New_3840x2400.avif (3840 x 2400, native; decoded to sRGB PNG with sips)",
        "identity": "still == plate with ring-overlay composited source-over in sRGB (pixel-exact up to 8-bit rounding), so poster = plate + overlay.",
        "ring_shadow_in_overlay": "colour #2A1608 (the web catcher colour), straight alpha chosen so plate*(1-a) + c*a has the luminance of the exact Cycles render with the ring shadow, on the desk AND on the pedestal top/lip/front."}
    P["desk"]["note"] = "transparent shadow catcher over the plate; receives the RING shadow only (the pedestal's own contact shadow, AO and bounce are in the plate)."
    kp, sp, tg = Vector(KEY["pos"]) * MM, Vector(SPILL["pos"]) * MM, Vector((0, 0, 4 * MM))
    t3 = lambda v: [round(v.x, 6), round(v.z, 6), round(-v.y, 6)]
    dk, ds = (kp - tg).length, (sp - tg).length
    K_ = P["lights"]["key"]; kd = (tg - kp).normalized(); kel = math.degrees(math.asin(-kd.z)); kcone = math.degrees(2 * math.atan(KEY["size"] / 2 * MM / dk))
    K_["position"] = t3(kp); K_["target"] = t3(tg)
    K_["direction_unit"] = [round(c, 4) for c in t3(kd)]
    K_["elevation_deg"] = round(kel, 1)
    K_["convention"] = "three.js Y-up metres in pedestal space (= Blender (x, y, z) -> (x, z, -y)). D-186: the key follows the lamp of the new photo (lamp base 5 mm left and 3 mm nearer than in the 3632 plate): Blender key at (%.3f, %.3f, %.3f) m aimed at (0, 0, 0.004), was (0.190, 0.120, 0.250). Light travels (%.3f, %.3f, %+.3f): left, down, toward the camera (+Z), so the ring shadow on the top runs LEFT-FRONT and is ~%.1f x the casting height long (elevation %.1f deg). The direction moved %.1f deg from D-180's (-0.5702, -0.7383, 0.3602)." % (
        kp.x, kp.y, kp.z, kd.x, kd.z, -kd.y, 1 / math.tan(math.radians(kel)), kel,
        math.degrees(Vector((kd.x, kd.z, -kd.y)).angle(Vector((-0.5702, -0.7383, 0.3602)))))
    K_["shadow"]["note"] = "Cycles area light D%d mm at %.0f mm = %.1f deg penumbra cone: contact-hard at the ring's touch point, ~3-4 mm soft at the shadow tip. With VSM (uniform blur) keep the blur small (~0.5 mm = 6 texels at 2048 over +-0.045 m) so the shadow stays clearly defined, as the user asked; do not raise radius to fake the tip softness." % (KEY["size"], dk / MM, kcone)
    K_["plate_color_linear_rgb"] = list(KEY["color"])
    K_["plate_color_note"] = "D-186, plate only: the Cycles key and spill are warmer than D-181 (key 1, 0.70, 0.44 -> 1, 0.60, 0.30) because the new desk is more orange; `color` above is the web's live value and is not changed here."
    K_["plate_note"] = "the plate was lit with this same key (Cycles area disk D%d mm at Blender (%.3f, %.3f, %.3f) m), so the live ring shadow continues the baked pedestal shadow: same direction, same %.1f deg penumbra cone." % (KEY["size"], kp.x, kp.y, kp.z, kcone)
    hexs = lambda c: "#%02X%02X%02X" % tuple(round(x * 255) for x in c)
    rel = (SPILL["power"] / KEY_POWER) * (dk / ds) ** 2
    P["lights"]["spill"] = {
        "type": "plate-only lamp spill (Cycles area DISK). Baked into the plate; on the web model it analytically, do not light the ring with it. D-186: moved with the lamp of the new photo, Blender (125, 50, 58) -> (%s) mm." % ", ".join("%g" % v for v in SPILL["pos"]),
        "position": t3(sp), "target": t3(tg),
        "direction_unit": [round(c, 4) for c in t3((tg - sp).normalized())],
        "elevation_deg": round(math.degrees(math.asin((sp - tg).normalized().z)), 1),
        "azimuth_note": "light travels left (-X), down (-Y) and toward the camera (+Z): the pedestal's spill shadow falls LEFT-FRONT, %.1f x the casting height long" % (1 / math.tan(math.asin((sp - tg).normalized().z))),
        "distance_to_target_m": round(ds, 5),
        "disk_diameter_m": SPILL["size"] * MM,
        "penumbra_cone_deg": round(math.degrees(2 * math.atan(SPILL["size"] / 2 * MM / ds)), 1),
        "color_linear_rgb": list(SPILL["color"]),
        "color_hex_same_convention_as_key": hexs(SPILL["color"]),
        "color_note": "Blender linear RGB. The hex writes those linear values as bytes, exactly as lights.key.color (#FFB370) does for the key's Blender linear (1, 0.70, 0.44); if you need true linear in three.js use color.setRGB(r, g, b, THREE.LinearSRGBColorSpace) with color_linear_rgb.",
        "blender_power_W": SPILL["power"], "key_blender_power_W_in_plate": KEY_POWER,
        "intensity_relative_to_key": {
            "facing_the_light_at_target": round(rel, 3),
            "on_horizontal_top_at_target": round(rel * ((sp - tg).normalized().z / (kp - tg).normalized().z), 3),
            "as_three_intensity_if_key_is_%s" % P["lights"]["key"]["intensity"]: round(rel * P["lights"]["key"]["intensity"], 3),
            "falloff": "inverse square from `position` (a near lamp, %.0f mm away): irradiance at point p = facing value x (distance_to_target / |p - position|)^2 x cos(incidence). That falloff is what makes the right half of the top brighter than the left." % (ds / MM)},
        "linking": "illuminates pedestal + desk only; only the pedestal blocks it. The ring neither receives it nor casts a shadow from it.",
        "convention": "three.js Y-up metres in desk space (the space of lights.key; pedestal.position is given in it too) = Blender (x, y, z) -> (x, z, -y). Blender lamp at (%s) mm aimed at (0, 0, 4) mm." % ", ".join(str(v) for v in SPILL["pos"])}
    P["lights"].pop("plate_only_lamp_spill", None)
    P["plate"]["contact_occlusion"] = "D-181c: the still and both ring overlays carry a dark, tight contact occlusion under the touching band (Cycles AO pass, reach %s mm, with / without the ring; gamma %s, floor %s). It is part of the overlay's shadow alpha, not of the plate." % (CONTACT_DIST, CONTACT_GAMMA, CONTACT_FLOOR)
    P["proven"] = "Cycles: plate, stills, overlays and the proxy overlay in renders/s01-plate/ use exactly these values; the camera numbers above were re-projected with three.js-style maths and agree with Blender to %s px at 1920." % report["json_camera_vs_blender_max_px_at_1920"]
    P["proposed"] = "three.js material flags for the proxy and the catcher opacity are a starting point, untested in web-v2 (the 3D Designer does not touch it). Match the live ring shadow density to plate/still-s01-3840.png."
    with open(ped.POSE, "w") as f: json.dump(P, f, indent=2)
    print("PLATE pose json updated")


if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["all"]
    if argv[0] in ("render", "all"): render()
    if argv[0] in ("comp", "all"): comp()
    if argv[0] == "fit": fit()
    if argv[0] == "ringstat": ringstat()

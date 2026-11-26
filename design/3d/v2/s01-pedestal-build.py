"""
Stillway V2 S01 — hero ring pedestal (D-179). Headless Blender 5.x:

    Blender -b -P design/3d/v2/s01-pedestal-build.py -- all        # build + bake + export + renders
    Blender -b -P design/3d/v2/s01-pedestal-build.py -- build      # model + bake + GLB + .blend only
    Blender -b -P design/3d/v2/s01-pedestal-build.py -- renders    # renders only (needs build first)

Units: millimetres, stored in metres, same as the ring GLB (outer Ø 23.84 mm).
Pedestal: W 41.0 (X) x D 25.6 (Y) x H 5.2 (Z) mm, plan corner radius 7.0 mm, top/bottom fillet 1.8 mm.
Origin = centre of the bottom face (sits on the desk at z = 0). Grain runs along X.
The wood is a 3D procedural (growth rings around a pith line along X) baked into a 1024 atlas,
so the top shows long flat-sawn grain and the ends show soft end-grain arcs; the 3D field makes
the grain continuous over the fillets whatever the UV layout.
"""
import bpy, bmesh, math, os, sys, json
import numpy as np
from mathutils import Vector, Euler, Matrix

WT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
V2 = WT + "/design/3d/v2"
TEX = V2 + "/tex"
REN = V2 + "/renders/s01-pedestal"
FB = V2 + "/fallback"
RING_GLB = V2 + "/stillway-ring-v2-silver-polished_web.glb"
ENV = V2 + "/env/v2-env-paper.exr"
BG = next(p for p in (WT + "/design/assets/v2/s01/hero-warm-desk-nopedestal-src.png",
           "/Users/zaimmaulana/Orca/projects/Smart Ring/design/assets/v2/s01/hero-warm-desk-nopedestal-src.png") if os.path.exists(p))  # 1818 x 1037
OUT_GLB = V2 + "/s01-pedestal.glb"
OUT_BLEND = V2 + "/s01-pedestal.blend"
POSE = V2 + "/s01-pedestal-pose.json"

MM = 0.001
W, D, H = 41.0, 25.6, 6.8
R_CORNER, R_FILLET, R_FILLET_BOT = 5.3, 1.1, 0.35
OAK = V2 + "/tex/src-oak-veneer-01/oak_veneer_01_{}_2k.jpg"   # Poly Haven 'Oak Veneer 01', CC0
OAK_TILE_MM = 260.0   # one texture tile = 260 mm (scaled down from the 1.83 m scan for a finer figure)
ATLAS = 1024

# ring pose relative to pedestal origin (mm / degrees, Blender Z-up)
RING_LOC = (3.0, 1.0)
RING_S01_SCALE = float(os.environ.get("RING_SCALE", "1.35"))   # S01-only enlargement (Figma proportion)          # x, y on the top
RING_ROT = (0.0, 8.0, 236.0)   # XYZ euler deg: ring axis horizontal, lean 8 deg, logo side to camera-left
# camera (desktop hero, matches the warm-desk photo: slightly high, long lens)
CAM = dict(lens=70.0, elev=19.0, azim=-6.0, dist=232.0, target=(0.0, 0.0, 9.0), shift=(0.0, 0.135))
# warm key from the lamp: back-right, high -> shadows fall front-left
KEY = dict(pos=(190.0, 120.0, 250.0), size=55.0, power=1.1, color=(1.0, 0.70, 0.44))


def srgb(c):
    return tuple(((x / 255) / 12.92) if x / 255 <= 0.04045 else (((x / 255) + 0.055) / 1.055) ** 2.4 for x in c)


# ---------------------------------------------------------------- geometry
def make_mesh():
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * W, v.co.y * D, (v.co.z + 0.5) * H)) * MM
    vert_edges = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1e-6]
    bmesh.ops.bevel(bm, geom=vert_edges, offset=R_CORNER * MM, segments=10, profile=0.5, affect='EDGES')
    for top, r, seg in ((True, R_FILLET, 4), (False, R_FILLET_BOT, 3)):
        rim = [e for e in bm.edges
               if abs(e.verts[0].co.z - e.verts[1].co.z) < 1e-7 and len(e.link_faces) == 2
               and any((f.normal.z > 0.99) if top else (f.normal.z < -0.99) for f in e.link_faces)]
        bmesh.ops.bevel(bm, geom=rim, offset=r * MM, segments=seg, profile=0.5, affect='EDGES')
    bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 4])
    me = bpy.data.meshes.new("S01_Pedestal")
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new("S01_Pedestal", me)
    bpy.context.scene.collection.objects.link(ob)
    # flat top/bottom keep their normal; fillets smooth
    wn = ob.modifiers.new("WN", 'WEIGHTED_NORMAL')
    wn.mode = 'FACE_AREA'
    wn.weight = 100
    wn.keep_sharp = False
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.object.modifier_apply(modifier="WN")
    # UV: smart project, uniform texel density, margin for baking
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(50), island_margin=0.012, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    # second UV 'proj' only for sampling the photo oak during the bake (removed before export).
    # texture grain runs along image V -> V follows X on top/bottom and front/back; ends get Y-Z.
    me = ob.data
    proj = me.uv_layers.new(name="proj")
    me.uv_layers.active = me.uv_layers[0]
    k = 1.0 / (OAK_TILE_MM * MM)
    for poly in me.polygons:
        n = poly.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        for li in poly.loop_indices:
            c = me.vertices[me.loops[li].vertex_index].co
            if ax == 2:   u, v = c.y * k + 0.31, c.x * k + 0.12
            elif ax == 1: u, v = c.z * k * 1.0 + 0.62 + (0.0 if n.y > 0 else 0.07), c.x * k + 0.12
            else:         u, v = c.z * k + 0.85, c.y * k * 0.35 + 0.5
            proj.data[li].uv = (u, v)
    return ob


# ---------------------------------------------------------------- procedural oak (source for bake)
def wood_material():
    """photographic CC0 oak (Poly Haven Oak Veneer 01) sampled through UV 'proj', baked to the atlas"""
    m = bpy.data.materials.new("S01_Pedestal_Oak_src")
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    uv = N.new("ShaderNodeUVMap"); uv.uv_map = "proj"
    def tex(key, cs):
        t = N.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(OAK.format(key)); t.image.colorspace_settings.name = cs
        t.extension = 'REPEAT'; L.new(uv.outputs[0], t.inputs[0]); return t
    td, tr, tn = tex("diff", "sRGB"), tex("rough", "Non-Color"), tex("nor_gl", "Non-Color")
    hsv = N.new("ShaderNodeHueSaturation")       # toward the reference: a little lighter, less saturated honey
    hsv.inputs["Hue"].default_value = 0.49; hsv.inputs["Saturation"].default_value = 0.88; hsv.inputs["Value"].default_value = 1.18
    L.new(td.outputs[0], hsv.inputs["Color"]); L.new(hsv.outputs[0], b.inputs["Base Color"])
    rr = N.new("ShaderNodeMapRange"); rr.inputs["To Min"].default_value = 0.68; rr.inputs["To Max"].default_value = 0.88
    L.new(tr.outputs[0], rr.inputs[0]); L.new(rr.outputs[0], b.inputs["Roughness"])
    nm = N.new("ShaderNodeNormalMap"); nm.uv_map = "proj"; nm.inputs["Strength"].default_value = 1.0
    L.new(tn.outputs[0], nm.inputs["Color"]); L.new(nm.outputs[0], b.inputs["Normal"])
    b.inputs["Specular IOR Level"].default_value = 0.35
    return m


def wood_material_procedural_old():
    m = bpy.data.materials.new("S01_Pedestal_Oak_src")
    m.use_nodes = True
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    N.clear()
    out = N.new("ShaderNodeOutputMaterial")
    bsdf = N.new("ShaderNodeBsdfPrincipled")
    L.new(bsdf.outputs[0], out.inputs[0])
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")            # object space metres -> mm, pith below/behind the board
    mp.inputs["Scale"].default_value = (1000, 1000, 1000)
    mp.inputs["Location"].default_value = (0, 260, 420)
    L.new(tc.outputs["Object"], mp.inputs[0])
    # low-freq warp so rings wander a little
    warp = N.new("ShaderNodeTexNoise")
    warp.inputs["Scale"].default_value = 0.05
    warp.inputs["Detail"].default_value = 2.0
    wsq = N.new("ShaderNodeVectorMath"); wsq.operation = 'MULTIPLY'
    L.new(mp.outputs[0], wsq.inputs[0]); wsq.inputs[1].default_value = (0.25, 1.0, 1.0)
    L.new(wsq.outputs[0], warp.inputs[0])
    wv = N.new("ShaderNodeVectorMath"); wv.operation = 'SUBTRACT'
    L.new(warp.outputs["Color"], wv.inputs[0]); wv.inputs[1].default_value = (0.5, 0.5, 0.5)
    ws = N.new("ShaderNodeVectorMath"); ws.operation = 'SCALE'
    L.new(wv.outputs[0], ws.inputs[0]); ws.inputs["Scale"].default_value = 14.0
    # warp only across the grain (y, z)
    mask = N.new("ShaderNodeVectorMath"); mask.operation = 'MULTIPLY'
    L.new(ws.outputs[0], mask.inputs[0]); mask.inputs[1].default_value = (0.0, 1.0, 1.0)
    pw = N.new("ShaderNodeVectorMath"); pw.operation = 'ADD'
    L.new(mp.outputs[0], pw.inputs[0]); L.new(mask.outputs[0], pw.inputs[1])
    rings = N.new("ShaderNodeTexWave")
    rings.wave_type = 'RINGS'; rings.rings_direction = 'X'; rings.wave_profile = 'SAW'
    rings.inputs["Scale"].default_value = 0.18
    rings.inputs["Distortion"].default_value = 1.0
    rings.inputs["Detail"].default_value = 1.5
    rings.inputs["Detail Scale"].default_value = 0.25
    rsq = N.new("ShaderNodeVectorMath"); rsq.operation = 'MULTIPLY'
    L.new(pw.outputs[0], rsq.inputs[0]); rsq.inputs[1].default_value = (0.2, 1.0, 1.0)
    L.new(rsq.outputs[0], rings.inputs[0])
    # fine fibres: noise stretched along X
    fs = N.new("ShaderNodeVectorMath"); fs.operation = 'MULTIPLY'
    L.new(mp.outputs[0], fs.inputs[0]); fs.inputs[1].default_value = (0.05, 14.0, 14.0)
    fib = N.new("ShaderNodeTexNoise")
    fib.inputs["Scale"].default_value = 1.0; fib.inputs["Detail"].default_value = 6.0
    L.new(fs.outputs[0], fib.inputs[0])
    # broad tone variation
    tone = N.new("ShaderNodeTexNoise"); tone.inputs["Scale"].default_value = 0.09
    L.new(mp.outputs[0], tone.inputs[0])
    # latewood bands: sharpen the saw ramp
    cr = N.new("ShaderNodeValToRGB")
    e = cr.color_ramp.elements
    e[0].position = 0.0;  e[0].color = (*srgb((208, 152, 96)), 1)
    e[1].position = 0.70; e[1].color = (*srgb((200, 143, 88)), 1)
    e3 = e.new(0.88); e3.color = (*srgb((182, 124, 72)), 1)
    e4 = e.new(0.97); e4.color = (*srgb((196, 138, 84)), 1)
    L.new(rings.outputs["Fac"], cr.inputs[0])
    mixf = N.new("ShaderNodeMix"); mixf.data_type = 'RGBA'; mixf.blend_type = 'MULTIPLY'
    mixf.inputs["Factor"].default_value = 0.55
    L.new(cr.outputs[0], mixf.inputs["A"]); L.new(fib.outputs["Color"], mixf.inputs["B"])
    mixt = N.new("ShaderNodeMix"); mixt.data_type = 'RGBA'; mixt.blend_type = 'OVERLAY'
    mixt.inputs["Factor"].default_value = 0.3
    L.new(mixf.outputs["Result"], mixt.inputs["A"]); L.new(tone.outputs["Color"], mixt.inputs["B"])
    L.new(mixt.outputs["Result"], bsdf.inputs["Base Color"])
    # roughness: high, latewood a touch smoother
    rr = N.new("ShaderNodeMapRange")
    rr.inputs["To Min"].default_value = 0.84; rr.inputs["To Max"].default_value = 0.72
    L.new(rings.outputs["Fac"], rr.inputs[0])
    L.new(rr.outputs[0], bsdf.inputs["Roughness"])
    bsdf.inputs["Specular IOR Level"].default_value = 0.35
    # normal: pores + latewood ridges
    hb = N.new("ShaderNodeMath"); hb.operation = 'MULTIPLY_ADD'
    L.new(fib.outputs["Fac"], hb.inputs[0]); hb.inputs[1].default_value = 0.6
    L.new(rings.outputs["Fac"], hb.inputs[2])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.35
    bump.inputs["Distance"].default_value = 0.00004
    L.new(hb.outputs[0], bump.inputs["Height"])
    L.new(bump.outputs[0], bsdf.inputs["Normal"])
    return m


def bake(ob):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.samples = 16
    sc.cycles.device = 'CPU'
    src = wood_material()
    ob.data.materials.clear(); ob.data.materials.append(src)
    nt = src.node_tree
    imgs = {}
    for key, typ, cs in (("basecolor", 'DIFFUSE', 'sRGB'), ("roughness", 'ROUGHNESS', 'Non-Color'), ("normal", 'NORMAL', 'Non-Color')):
        img = bpy.data.images.new("s01-pedestal-" + key, ATLAS, ATLAS, alpha=False, float_buffer=False)
        img.colorspace_settings.name = cs
        node = nt.nodes.new("ShaderNodeTexImage"); node.image = img
        for n in nt.nodes: n.select = False
        node.select = True; nt.nodes.active = node
        bpy.context.view_layer.objects.active = ob; ob.select_set(True)
        kw = dict(type=typ, margin=12, use_clear=True)
        if typ == 'DIFFUSE':
            kw["pass_filter"] = {'COLOR'}
        bpy.ops.object.bake(**kw)
        img.filepath_raw = f"{TEX}/s01-pedestal-{key}.png"
        img.file_format = 'PNG'
        img.save()
        imgs[key] = img
        nt.nodes.remove(node)
    # export material from the baked maps
    m = bpy.data.materials.new("S01_Pedestal_Oak")
    m.use_nodes = True
    N, Lk = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    tb = N.new("ShaderNodeTexImage"); tb.image = imgs["basecolor"]
    tr = N.new("ShaderNodeTexImage"); tr.image = imgs["roughness"]
    tn = N.new("ShaderNodeTexImage"); tn.image = imgs["normal"]
    nm = N.new("ShaderNodeNormalMap")
    Lk.new(tb.outputs[0], b.inputs["Base Color"])
    Lk.new(tr.outputs[0], b.inputs["Roughness"])
    Lk.new(tn.outputs[0], nm.inputs["Color"]); Lk.new(nm.outputs[0], b.inputs["Normal"])
    b.inputs["Metallic"].default_value = 0.0
    b.inputs["Specular IOR Level"].default_value = 0.35
    ob.data.materials.clear(); ob.data.materials.append(m)
    ob.data.uv_layers.remove(ob.data.uv_layers["proj"])
    src.use_fake_user = True
    return m


def export(ob):
    for o in bpy.context.scene.objects: o.select_set(False)
    ob.select_set(True)
    bpy.ops.export_scene.gltf(filepath=OUT_GLB, use_selection=True, export_format='GLB',
                              export_image_format='WEBP', export_image_quality=80,
                              export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
                              export_yup=True, export_apply=True)


def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.length_unit = 'MILLIMETERS'
    ob = make_mesh()
    bake(ob)
    export(ob)
    bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND, compress=True)
    return ob


# ---------------------------------------------------------------- review scene (imports the exported GLBs)
def import_glb(path, name):
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.context.scene.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    root = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(root)
    for r in roots: r.parent = root
    return root, new


RING_AXIS = tuple(float(x) for x in os.environ.get("RING_AXIS", "-0.72,0.5,-0.48").split(","))   # opening direction (Blender Z-up)
RING_LOGO = tuple(float(x) for x in os.environ.get("RING_LOGO", "-0.7,-0.55,-0.45").split(","))    # centre -> logo, lower-left front


def ring_pose():
    """ring local Y = axis (opening), local +X = logo side; built from two world directions"""
    a = Vector(RING_AXIS).normalized()
    d = Vector(RING_LOGO); d = (d - a * d.dot(a)).normalized()
    z = d.cross(a)
    return Matrix((d, a, z)).transposed().to_4x4()


def scene_setup():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = 128
    sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'None'
    ped, _ = import_glb(OUT_GLB, "S01_Pedestal_Root")
    ring, ring_objs = import_glb(RING_GLB, "S01_Ring_Root")
    # place ring: rotate, then drop until its lowest vertex touches the pedestal top
    rot = ring_pose()
    ring.matrix_world = rot @ Matrix.Scale(RING_S01_SCALE, 4)
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    zmin = 1e9
    for o in ring_objs:
        if o.type != 'MESH': continue
        ev = o.evaluated_get(dg)
        mw = ev.matrix_world
        for v in ev.data.vertices:
            zmin = min(zmin, (mw @ v.co).z)
    ring.location = (RING_LOC[0] * MM, RING_LOC[1] * MM, H * MM - zmin)
    bpy.context.view_layer.update()
    # desk = transparent shadow catcher
    bpy.ops.mesh.primitive_plane_add(size=1.2, location=(0, 0, 0))
    desk = bpy.context.active_object; desk.name = "Desk_ShadowCatcher"
    desk.is_shadow_catcher = True
    dm = bpy.data.materials.new("Desk"); dm.use_nodes = True
    dm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (*srgb((150, 100, 62)), 1)
    dm.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.6
    desk.data.materials.append(dm)
    # world: paper env, warm, low
    w = bpy.data.worlds.new("W"); sc.world = w; w.use_nodes = True
    nt = w.node_tree
    env = nt.nodes.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(ENV)
    bg = nt.nodes["Background"]; bg.inputs["Strength"].default_value = 0.28
    tint = nt.nodes.new("ShaderNodeMix"); tint.data_type = 'RGBA'; tint.blend_type = 'MULTIPLY'
    tint.inputs["Factor"].default_value = 1.0; tint.inputs["B"].default_value = (1.0, 0.72, 0.48, 1)
    nt.links.new(env.outputs[0], tint.inputs["A"]); nt.links.new(tint.outputs["Result"], bg.inputs[0])
    # key light (lamp, back right)
    ld = bpy.data.lights.new("Key_Lamp", 'AREA'); ld.shape = 'DISK'
    ld.size = KEY["size"] * MM; ld.energy = KEY["power"]; ld.color = KEY["color"]
    key = bpy.data.objects.new("Key_Lamp", ld); sc.collection.objects.link(key)
    key.location = Vector(KEY["pos"]) * MM
    key.rotation_euler = (Vector((0, 0, 4 * MM)) - key.location).to_track_quat('-Z', 'Y').to_euler()
    # soft warm bounce from the front-left (desk/room), no shadow detail
    fd = bpy.data.lights.new("Fill", 'AREA'); fd.size = 0.3; fd.energy = 0.0; fd.color = (1.0, 0.8, 0.62)
    fill = bpy.data.objects.new("Fill", fd); sc.collection.objects.link(fill)
    fill.location = Vector((-250, -220, 120)) * MM
    fill.rotation_euler = (-fill.location).to_track_quat('-Z', 'Y').to_euler()
    # camera
    cd = bpy.data.cameras.new("Cam_S01"); cam = bpy.data.objects.new("Cam_S01", cd); sc.collection.objects.link(cam)
    sc.camera = cam
    return dict(ped=ped, ring=ring, key=key, cam=cam, desk=desk)


def place_camera(cam, lens, elev, azim, dist, target, shift):
    cam.data.lens = lens; cam.data.sensor_width = 36.0; cam.data.sensor_fit = 'HORIZONTAL'
    cam.data.clip_start = 0.005; cam.data.clip_end = 10
    t = Vector(target) * MM
    e, a = math.radians(elev), math.radians(azim)
    d = dist * MM
    cam.location = t + Vector((math.sin(a) * math.cos(e) * d, -math.cos(a) * math.cos(e) * d, math.sin(e) * d))
    cam.rotation_euler = (t - cam.location).to_track_quat('-Z', 'Y').to_euler()
    cam.data.shift_x, cam.data.shift_y = shift


def render_rgba(path, w, h):
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)


def load_px(path):
    img = bpy.data.images.load(path, check_existing=False)
    img.colorspace_settings.name = 'Non-Color'   # keep raw display-encoded values
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32); img.pixels.foreach_get(a)
    bpy.data.images.remove(img)
    return a.reshape(h, w, 4)


def save_px(arr, path, fmt='PNG', quality=88):
    h, w, _ = arr.shape
    img = bpy.data.images.new("tmp_out", w, h, alpha=True)
    img.colorspace_settings.name = 'Non-Color'
    img.pixels.foreach_set(np.clip(arr, 0, 1).astype(np.float32).ravel())
    img.filepath_raw = path; img.file_format = fmt
    if fmt == 'WEBP':
        bpy.context.scene.render.image_settings.quality = quality
        sc = bpy.context.scene
        s = sc.render.image_settings
        s.file_format = 'WEBP'; s.quality = quality; s.color_mode = 'RGBA' if arr[..., 3].min() < 1 else 'RGB'
        img.save_render(path, scene=sc)
    else:
        img.save()
    bpy.data.images.remove(img)


def resize(arr, w, h):
    """area-ish resample with numpy (bilinear on a pre-blurred image is enough for review/fallback)"""
    H0, W0, _ = arr.shape
    ys = (np.arange(h) + 0.5) * H0 / h - 0.5; xs = (np.arange(w) + 0.5) * W0 / w - 0.5
    y0 = np.clip(np.floor(ys).astype(int), 0, H0 - 1); y1 = np.clip(y0 + 1, 0, H0 - 1)
    x0 = np.clip(np.floor(xs).astype(int), 0, W0 - 1); x1 = np.clip(x0 + 1, 0, W0 - 1)
    fy = np.clip(ys - y0, 0, 1)[:, None, None]; fx = np.clip(xs - x0, 0, 1)[None, :, None]
    a = arr[y0][:, x0] * (1 - fx) + arr[y0][:, x1] * fx
    b = arr[y1][:, x0] * (1 - fx) + arr[y1][:, x1] * fx
    return a * (1 - fy) + b * fy


def over(fg, bg):
    a = fg[..., 3:4]
    out = fg[..., :3] * 1.0 + bg[..., :3] * (1 - a)    # Cycles output is premultiplied-equivalent after save? (straight PNG)
    return out


def comp(fg_path, bg_arr):
    fg = load_px(fg_path)
    a = fg[..., 3:4]
    rgb = fg[..., :3] * a + bg_arr[..., :3] * (1 - a)   # PNG is straight alpha
    return np.concatenate([rgb, np.ones_like(a)], axis=-1)


def cover_crop(arr, w, h):
    H0, W0, _ = arr.shape
    s = max(w / W0, h / H0)
    rw, rh = round(W0 * s), round(H0 * s)
    r = resize(arr, rw, rh)
    x0, y0 = (rw - w) // 2, (rh - h) // 2
    return r[y0:y0 + h, x0:x0 + w]


def renders():
    os.makedirs(REN, exist_ok=True)
    S = scene_setup()
    bg = load_px(BG)                       # 1037 x 1818
    BH, BW = bg.shape[:2]
    # 1) hero frame at the photo's own resolution (so the 3D sits in the photo's pixel grid), then cover-crop
    place_camera(S["cam"], **CAM)
    hero_rgba = REN + "/s01-pedestal-hero-rgba.png"
    render_rgba(hero_rgba, BW, BH)
    full = comp(hero_rgba, bg)
    save_px(full, REN + "/s01-pedestal-hero-1818.png")
    desk = cover_crop(full, 1440, 900)
    save_px(desk, REN + "/s01-pedestal-review-1440x900.png")
    # fallback stills (same frame as the web hero: background-size cover, centred)
    save_px(cover_crop(full, 1440, 900), FB + "/fb-s01-pedestal.webp", 'WEBP', 84)
    save_px(cover_crop(full, 960, 600), FB + "/fb-s01-pedestal-960.webp", 'WEBP', 82)
    alpha = load_px(hero_rgba)
    save_px(alpha, FB + "/fb-s01-pedestal-alpha.png")
    save_px(alpha, FB + "/fb-s01-pedestal-alpha.webp", 'WEBP', 86)
    # 2) shadow close-up: lower, closer, from front-left so top, side and desk shadow read together
    place_camera(S["cam"], lens=85.0, elev=30.0, azim=-32.0, dist=200.0, target=(-8.0, -10.0, 9.0), shift=(0.0, 0.0))
    cu = REN + "/s01-pedestal-shadow-closeup-rgba.png"
    render_rgba(cu, 1440, 900)
    # plain warm desk tone behind the close-up (photo would be out of perspective at this angle)
    desk_tone = np.zeros((900, 1440, 4), np.float32)
    g = np.linspace(0, 1, 900)[:, None]
    desk_tone[..., 0] = 0.50 + 0.12 * g; desk_tone[..., 1] = 0.33 + 0.08 * g; desk_tone[..., 2] = 0.20 + 0.05 * g
    desk_tone[..., 3] = 1
    desk_tone = desk_tone[::-1]
    save_px(comp(cu, desk_tone), REN + "/s01-pedestal-shadow-closeup.png")
    # 3) pedestal only (material check), photo-matched camera
    S["ring"].hide_render = True
    for c in S["ring"].children_recursive: c.hide_render = True
    place_camera(S["cam"], lens=70.0, elev=17.0, azim=-14.0, dist=150.0, target=(0, 0, 3.4), shift=(0, 0))
    po = REN + "/s01-pedestal-material-rgba.png"
    render_rgba(po, 1440, 900)
    save_px(comp(po, desk_tone), REN + "/s01-pedestal-material.png")
    bpy.ops.wm.save_as_mainfile(filepath=V2 + "/s01-pedestal-review.blend", compress=True)
    write_pose(S)


def write_pose(S):
    ring = S["ring"]
    rq = ring.matrix_world.to_quaternion()
    loc = ring.matrix_world.translation
    # Blender Z-up -> glTF/three Y-up: (x, y, z) -> (x, z, -y); quaternion likewise
    def v2t(v): return [round(v.x, 6), round(v.z, 6), round(-v.y, 6)]
    def q2t(q): return [round(q.x, 6), round(q.z, 6), round(-q.y, 6), round(q.w, 6)]   # [x, y, z, w]
    cam = bpy.data.objects["Cam_S01"]
    place_camera(cam, **CAM); bpy.context.view_layer.update()
    key = S["key"]
    data = {
        "id": "D-179 S01 pedestal pose",
        "units": "metres, three.js Y-up (glTF). Pedestal origin = centre of its bottom face, on the desk plane y = 0.",
        "pedestal": {"glb": "s01-pedestal.glb", "position": [0, 0, 0], "quaternion": [0, 0, 0, 1], "scale": 1,
                      "size_mm": {"width_x": W, "depth_z": D, "height_y": H, "corner_radius": R_CORNER, "top_roundover": R_FILLET, "bottom_roundover": R_FILLET_BOT},
                      "top_y": round(H * MM, 6), "castShadow": True, "receiveShadow": True},
        "ring": {"glb": "stillway-ring-v2-silver-polished_web.glb", "position": v2t(loc), "quaternion": q2t(rq), "scale": 1, "s01_scale": RING_S01_SCALE,
                 "note": "position/quaternion already assume s01_scale. ring leans back-right resting on its lower edge (lowest vertex at top_y), opening toward camera-right, logo lower-left front (Figma 40004725:5602). Blender axis %s, logo dir %s" % (RING_AXIS, RING_LOGO),
                 "castShadow": True, "receiveShadow": False},
        "camera": {"type": "PerspectiveCamera", "position": v2t(cam.location),
                   "lookAt": v2t(Vector(CAM["target"]) * MM),
                   "fov_vertical_deg_at_1818x1037": round(math.degrees(2 * math.atan(36.0 / 2 * (1037 / 1818) / CAM["lens"])), 3),
                   "lens_mm_36mm_sensor": CAM["lens"],
                   "filmOffset_or_viewOffset": {"shift_y_fraction_of_width": CAM["shift"][1],
                                                "note": "Blender shift_y 0.135 of frame width moves the subject down. In three.js use camera.setViewOffset(fullW, fullH, 0, -0.135*fullW, fullW, fullH) or render to the photo aspect and match by eye."},
                   "frame": "photo 1818x1037, shown background-size: cover, centred (desktop 1440x900 crops the sides)"},
        "lights": {
            "key": {"type": "DirectionalLight (or SpotLight) warm, from the lamp: back-right, high", "position": v2t(key.location),
                    "target": [0, 0.004, 0], "color": "#FFB370", "intensity": 2.6, "castShadow": True,
                    "threejs_note": "DirectionalLight, renderer AgX exposure 1.0, physically correct units (r155+). Elevation ~50 deg so the ring shadow lands on the pedestal top.",
                    "shadow": {"mapSize": 2048, "bias": -0.0002, "normalBias": 0.0004, "radius_PCFSoft": 6,
                               "camera_bounds_m": 0.06, "note": "Blender area light Ø55 mm at ~340 mm -> soft penumbra; in three.js use PCFSoftShadowMap or VSM"}},
            "fill": {"type": "HemisphereLight", "skyColor": "#FFD9B0", "groundColor": "#3A2414", "intensity": 0.25, "note": "no front fill: left and front faces of the pedestal must stay in shade"},
            "pedestal_envMapIntensity": 0.35,
            "environment": "env/v2-env-paper.exr tinted warm (#FFB87A multiply), intensity ~0.28 for ring reflections"},
        "desk": {"type": "ShadowMaterial plane at y = 0", "opacity": 0.5, "color": "#2A1608", "size_m": 1.2,
                 "note": "transparent shadow catcher over the CSS photo; receives pedestal + ring shadows"},
        "proven": "Blender Cycles renders in renders/s01-pedestal/ use exactly these values",
        "proposed": "three.js light/shadow numbers are a starting point; tune by eye against s01-pedestal-review-1440x900.png",
    }
    with open(POSE, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["all"]
    mode = argv[0]
    if mode in ("build", "all"):
        build()
    if mode in ("renders", "all"):
        renders()
    if mode == "quick":
        S = scene_setup(); bpy.context.scene.cycles.samples = 24
        place_camera(S["cam"], **CAM)
        render_rgba(os.environ.get("QOUT", "/tmp/q.png"), 909, 518)

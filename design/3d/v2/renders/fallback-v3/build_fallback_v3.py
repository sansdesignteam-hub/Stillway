"""
Stillway V2 — fallback v3 (reduced motion / no WebGL) for S08 and S06.
Run inside Blender (5.x) through Blender MCP:

    exec(open(WT + "/design/3d/v2/renders/fallback-v3/build_fallback_v3.py").read(), g := {})
    g["build_all"]()            # or g["s08"]("green"), g["s06"]()

The scene is built in "three.js space": an empty THREE_ROOT carries the glTF Y-up -> Blender Z-up
rotation (Rx +90), and every child (pivot, spinner, ring, camera, lights) uses three.js coordinates
exactly like web-v2/src/scripts/ring/stage.ts. 1 CSS px (S08) or 1 photo px (S06) = 0.001 BU.

Ring = web GLB stillway-ring-v2-silver_web.glb with finishes.json silver_polished (D-085):
normal map and anisotropy off, band 0.92/0.92/0.93 rough 0.06 (envMapIntensity 1.5 emulated by an
added gloss lobe), engrave 0.28 rough 0.38.
"""
import bpy, math, os
import numpy as np
from mathutils import Vector, Quaternion, Matrix

WT = "/Users/zaimmaulana/Orca/workspaces/Smart Ring/04.-3D-Designer"
OUT = WT + "/design/3d/v2/renders/fallback-v3"
GLB = WT + "/design/3d/v2/stillway-ring-v2-silver_web.glb"
ENV = WT + "/design/3d/v2/env"
HAND = WT + "/design/assets/v2/A-1-hand-left-alpha.png"
TMP = OUT + "/_tmp"
K = 0.001  # BU per px
SCENE = "FB_V3"

LED = {"green": "#34E07A", "blue": "#3B8CFF", "violet": "#A06BFF", "red": "#FF3B30"}

# ---------------------------------------------------------------- web poses (desktop 1440 x 900)
VW, VH = 1440, 900
FOV = 30.0
# sections/features.ts close(ctx) desktop: state 2-4 (u 1..2+), uncap 1 so ring width = w * W
S08_CLOSE = dict(x=0.25, y=-0.04, w=0.64, rx=-0.36, ry=-0.5, rz=0.12, spin=-0.36, pitch=0.0, roll=0.0)
S08_FRAME_CSS = 1160.0  # the 1024 px square covers 1160 CSS px around the ring centre
# s06-pose.json onFinger: world steps x-90, y-90, x+10, z+2.9 (= web fingerPose with the view
# correction at zero, because this camera looks straight at the seat)
S06_IMG = (579, 1198)
S06_SEAT = (343, 360)
S06_RING_PX = 122.0
S06_PROFILE = [[0, 337], [15, 334], [28, 320], [35, 300], [38, 280], [40, 260], [42, 220], [44.6, 160],
               [48, 120], [47, 60], [46, 0], [48, -110], [0, -110]]


def srgb_to_lin(c):
    c = np.asarray(c, dtype=np.float64)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(c):
    c = np.clip(np.asarray(c, dtype=np.float64), 0, None)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def hex_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def q_axis(axis, ang):
    return Quaternion(Vector(axis), ang)


def three_quat(rx, ry, rz, pitch=0.0, roll=0.0):
    """pivot.rotation.set(rx, ry, rz, 'YXZ'); premultiply pitch about X, then roll about Z."""
    q = q_axis((0, 1, 0), ry) @ q_axis((1, 0, 0), rx) @ q_axis((0, 0, 1), rz)
    if pitch:
        q = q_axis((1, 0, 0), pitch) @ q
    if roll:
        q = q_axis((0, 0, 1), roll) @ q
    return q


# ---------------------------------------------------------------- scene
def empty(name, parent=None):
    o = bpy.data.objects.get(name) or bpy.data.objects.new(name, None)
    sc = bpy.data.scenes[SCENE]
    if o.name not in sc.collection.objects:
        sc.collection.objects.link(o)
    o.parent = parent
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.rotation_mode = "QUATERNION"
    return o


def get_scene():
    sc = bpy.data.scenes.get(SCENE) or bpy.data.scenes.new(SCENE)
    bpy.context.window.scene = sc
    return sc


def setup_scene():
    sc = get_scene()
    root = empty("THREE_ROOT")
    root.rotation_quaternion = q_axis((1, 0, 0), math.pi / 2)
    pivot = empty("PIVOT", root)
    spinner = empty("SPINNER", pivot)
    model = empty("RING_MODEL", spinner)

    if not any(o.name.startswith("Ring_Shell") for o in sc.objects):
        # orphans of an earlier import would push the new materials to ".001" names
        for m in list(bpy.data.materials):
            if m.users == 0 and m.name.split(".")[0] in ("Ring_Silver", "Ring_Silver_Engrave", "LED_Main", "LED_Power"):
                bpy.data.materials.remove(m)
        bpy.ops.import_scene.gltf(filepath=GLB)
    for mn in ("Ring_Silver", "Ring_Silver_Engrave", "LED_Main", "LED_Power"):
        assert bpy.data.materials.get(mn), mn
    # re-parent the imported meshes (their local transforms are three.js model coordinates)
    for o in list(sc.objects):
        if o.type == "EMPTY" and o.name.startswith("Stillway_Ring_Root"):
            for c in list(o.children):
                mb = c.matrix_basis.copy()
                c.parent = model
                c.matrix_parent_inverse = Matrix.Identity(4)
                c.matrix_basis = mb
            bpy.data.objects.remove(o)
    shell = next(o for o in sc.objects if o.name.startswith("Ring_Shell"))
    meshes = [o for o in sc.objects if o.type == "MESH" and (o.parent == model or (o.parent and o.parent.parent == model))]
    # three: box = Box3.setFromObject(ring); ring.position -= centre; ringSize = box.x
    model.location = (0, 0, 0)
    model.rotation_quaternion = Quaternion()
    model.scale = (1, 1, 1)
    for o in (root, pivot, spinner):
        o.location = (0, 0, 0); o.rotation_quaternion = Quaternion(); o.scale = (1, 1, 1)
    bpy.context.view_layer.update()
    inv = model.matrix_world.inverted()
    pts = [inv @ (o.matrix_world @ Vector(c)) for o in meshes for c in o.bound_box]
    mn = Vector([min(p[i] for p in pts) for i in range(3)])
    mx = Vector([max(p[i] for p in pts) for i in range(3)])
    centre = (mn + mx) / 2
    model.location = -centre
    sc["ringSize"] = mx.x - mn.x

    # LED anchors (stage.ts): flare = led centre + 0.04 ringSize toward the axis, bounce = + 0.08
    bpy.context.view_layer.update()
    inv = model.matrix_world.inverted()
    for led in ("led_main", "led_power"):
        o = sc.objects[led]
        c = sum((inv @ (o.matrix_world @ Vector(v)) for v in o.bound_box), Vector()) / 8
        inward = Vector((-c.x, -c.y, 0)).normalized() * sc["ringSize"] * 0.04
        f = empty("FLARE_" + led, model); f.location = c + inward
        b = empty("BOUNCE_" + led, model); b.location = c + inward * 2

    materials()
    render_settings(sc)
    return sc


def materials():
    band = bpy.data.materials["Ring_Silver"]
    nt = band.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Base Color"].default_value = (0.92, 0.92, 0.93, 1)
    p.inputs["Metallic"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.06
    g = nt.nodes.new("ShaderNodeBsdfGlossy")  # envMapIntensity 1.5 -> +0.5 reflection lobe
    g.inputs["Color"].default_value = (0.46, 0.46, 0.465, 1)
    g.inputs["Roughness"].default_value = 0.06
    add = nt.nodes.new("ShaderNodeAddShader")
    nt.links.new(p.outputs[0], add.inputs[0]); nt.links.new(g.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], out.inputs["Surface"])

    eng = bpy.data.materials["Ring_Silver_Engrave"]
    p = next(n for n in eng.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    p.inputs["Base Color"].default_value = (0.28, 0.28, 0.29, 1)
    p.inputs["Metallic"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.38


def render_settings(sc, res=(1024, 1024), samples=384):
    sc.render.engine = "CYCLES"
    sc.cycles.device = "GPU"
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.render.film_transparent = True
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.resolution_percentage = 100
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "None"
    sc.view_settings.exposure = 0.0
    sc.view_settings.gamma = 1.0
    sc.display_settings.display_device = "sRGB"
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.image_settings.color_depth = "16"


def world(env_file, strength, rot_z_deg=0.0, saturation=1.0):
    sc = bpy.data.scenes[SCENE]
    w = bpy.data.worlds.get("FB_V3_World") or bpy.data.worlds.new("FB_V3_World")
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    t = nt.nodes.new("ShaderNodeTexEnvironment")
    t.image = bpy.data.images.load(ENV + "/" + env_file, check_existing=True)
    if rot_z_deg:
        tc = nt.nodes.new("ShaderNodeTexCoord")
        mp = nt.nodes.new("ShaderNodeMapping")
        mp.inputs["Rotation"].default_value = (0, 0, math.radians(rot_z_deg))
        nt.links.new(tc.outputs["Generated"], mp.inputs["Vector"])
        nt.links.new(mp.outputs[0], t.inputs["Vector"])
    b = nt.nodes.new("ShaderNodeBackground")
    b.inputs["Strength"].default_value = strength
    o = nt.nodes.new("ShaderNodeOutputWorld")
    src = t.outputs[0]
    if saturation != 1.0:  # neutralise a warm env so silver stays silver (D-112)
        hs = nt.nodes.new("ShaderNodeHueSaturation")
        hs.inputs["Saturation"].default_value = saturation
        nt.links.new(src, hs.inputs["Color"])
        src = hs.outputs[0]
    nt.links.new(src, b.inputs[0]); nt.links.new(b.outputs[0], o.inputs[0])


def sun(name, pos_px, color_hex, strength):
    """three DirectionalLight at pos (target at the origin)."""
    sc = bpy.data.scenes[SCENE]
    o = bpy.data.objects.get(name)
    if not o:
        o = bpy.data.objects.new(name, bpy.data.lights.new(name, "SUN"))
        sc.collection.objects.link(o)
    o.parent = bpy.data.objects["THREE_ROOT"]
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.rotation_mode = "QUATERNION"
    d = -Vector(pos_px).normalized()
    o.rotation_quaternion = d.to_track_quat("-Z", "Y")
    o.location = Vector(pos_px) * K
    o.data.energy = strength
    o.data.angle = math.radians(2)
    o.data.color = tuple(srgb_to_lin(hex_rgb(color_hex)))
    o.hide_render = strength <= 0
    return o


def point(name, parent, color, power, radius):
    sc = bpy.data.scenes[SCENE]
    o = bpy.data.objects.get(name)
    if not o:
        o = bpy.data.objects.new(name, bpy.data.lights.new(name, "POINT"))
        sc.collection.objects.link(o)
    o.parent = parent
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.location = (0, 0, 0)
    o.data.color = tuple(color)
    o.data.energy = power
    o.data.shadow_soft_size = radius
    o.hide_render = power <= 0
    return o


def camera(name, cam_z_px, frame_px, shift_px, res, fit="AUTO"):
    sc = bpy.data.scenes[SCENE]
    o = bpy.data.objects.get(name)
    if not o:
        o = bpy.data.objects.new(name, bpy.data.cameras.new(name))
        sc.collection.objects.link(o)
    o.parent = bpy.data.objects["THREE_ROOT"]
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = Quaternion()
    o.location = (0, 0, cam_z_px * K)
    c = o.data
    c.sensor_fit = fit
    c.angle = 2 * math.atan(frame_px / 2 / cam_z_px)  # frame_px = larger frame side at z = 0
    c.shift_x = shift_px[0] / frame_px
    c.shift_y = shift_px[1] / frame_px
    c.clip_start = 0.01
    c.clip_end = 100
    sc.camera = o
    sc.render.resolution_x, sc.render.resolution_y = res
    return o


def set_pose(x_px, y_px, w_px, q, spin):
    sc = bpy.data.scenes[SCENE]
    pv = bpy.data.objects["PIVOT"]
    pv.location = (x_px * K, y_px * K, 0)
    pv.rotation_quaternion = q
    pv.scale = (w_px * K / sc["ringSize"],) * 3
    bpy.data.objects["SPINNER"].rotation_quaternion = q_axis((0, 0, 1), spin)
    bpy.context.view_layer.update()


def set_led(main_hex=None, power_hex=None, strength=6.0):
    """stage.ts setLed: lit = authored base colour + emissive; unlit = #1c1c1e, no emission."""
    base = {"LED_Main": (0.05, 0.08, 0.05, 1), "LED_Power": (0.09, 0.04, 0.03, 1)}
    off = tuple(srgb_to_lin(hex_rgb("#1c1c1e"))) + (1,)
    for mat, hx in (("LED_Main", main_hex), ("LED_Power", power_hex)):
        p = next(n for n in bpy.data.materials[mat].node_tree.nodes if n.type == "BSDF_PRINCIPLED")
        if hx:
            p.inputs["Base Color"].default_value = base[mat]
            p.inputs["Emission Color"].default_value = tuple(srgb_to_lin(hex_rgb(hx))) + (1,)
            p.inputs["Emission Strength"].default_value = strength
        else:
            p.inputs["Base Color"].default_value = off
            p.inputs["Emission Strength"].default_value = 0.0


def render_to(path):
    sc = bpy.data.scenes[SCENE]
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True, scene=sc.name)
    return path


# ---------------------------------------------------------------- image io (straight alpha, display values)
def load_rgba(path):
    im = bpy.data.images.load(path, check_existing=False)
    im.colorspace_settings.name = "Non-Color"  # raw stored values, no conversion
    w, h = im.size
    a = np.empty(w * h * 4, dtype=np.float32)
    im.pixels.foreach_get(a)
    bpy.data.images.remove(im)
    return a.reshape(h, w, 4).astype(np.float64)  # rows bottom -> top


def save_rgba(arr, path, fmt="PNG", quality=90):
    h, w, _ = arr.shape
    name = "_fb_out"
    if name in bpy.data.images:
        bpy.data.images.remove(bpy.data.images[name])
    im = bpy.data.images.new(name, w, h, alpha=True, float_buffer=False)
    im.colorspace_settings.name = "Non-Color"
    im.alpha_mode = "STRAIGHT"
    im.pixels.foreach_set(np.clip(arr, 0, 1).astype(np.float32).ravel())
    im.filepath_raw = path
    im.file_format = fmt
    im.save(filepath=path, quality=quality)
    bpy.data.images.remove(im)


# ---------------------------------------------------------------- S08 flare sprite (stage.ts flareTex)
def sprite_alpha(u, v):
    """u, v in sprite space, -0.5..0.5, v up. Radial glow + one thin streak (canvas 256 px)."""
    r = np.sqrt(u * u + v * v) / 0.5
    stops_x = [0.0, 0.08, 0.3, 1.0]
    stops_a = [1.0, 0.85, 0.22, 0.0]
    glow = np.interp(r, stops_x, stops_a, right=0.0)
    # streak: canvas rows 126..130 of 256 (4 px), alpha 0 -> 0.9 -> 0 across; soft edge = 1 texel
    texel = 1 / 256
    band = np.clip((2 * texel + 0.5 * texel - np.abs(v)) / texel, 0, 1)
    streak = 0.9 * np.clip(1 - np.abs(u) / 0.5, 0, 1) * band
    inside = (np.abs(u) <= 0.5) & (np.abs(v) <= 0.5)
    a = streak + glow * (1 - streak)
    return np.where(inside, a, 0.0)


def project(world_pt):
    """world point -> pixel (x right, y up from bottom-left) of the active camera, and view depth."""
    from bpy_extras.object_utils import world_to_camera_view
    sc = bpy.data.scenes[SCENE]
    co = world_to_camera_view(sc, sc.camera, world_pt)
    return co.x * sc.render.resolution_x, co.y * sc.render.resolution_y, co.z


def add_flare(rgba, anchor, hx, opacity=1.0, size_scale=1.0, rotation=-0.42):
    """additive sprite like three (toneMapped false, AdditiveBlending) on display values; on transparent
    pixels the added light becomes colour + alpha so it reads the same over the Night background."""
    sc = bpy.data.scenes[SCENE]
    ring_size = sc["ringSize"]
    a_obj = bpy.data.objects[anchor]
    wp = a_obj.matrix_world.translation
    px, py, depth = project(wp)
    # sprite world size = 0.6 * ringSize * pivot scale, perspective by depth
    world_size = 0.6 * ring_size * bpy.data.objects["PIVOT"].scale[0] * size_scale
    cam = sc.camera
    frame_world = 2 * depth * math.tan(cam.data.angle / 2)
    size_px = world_size / frame_world * max(sc.render.resolution_x, sc.render.resolution_y)
    h, w, _ = rgba.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    dx = (xx + 0.5 - px) / size_px
    dy = (yy + 0.5 - py) / size_px
    c, s = math.cos(-rotation), math.sin(-rotation)  # inverse rotation into sprite space
    u = c * dx - s * dy
    v = s * dx + c * dy
    A = sprite_alpha(u, v) * opacity
    G = A[..., None] * hex_rgb(hx)[None, None, :]
    rgb, a = rgba[..., :3], rgba[..., 3:4]
    P = rgb * a + G
    gmax = np.clip(G.max(axis=2, keepdims=True), 0, 1)
    out_a = a + (1 - a) * gmax
    out_rgb = np.where(out_a > 1e-6, np.clip(P / np.maximum(out_a, 1e-6), 0, 1), 0)
    return np.concatenate([out_rgb, out_a], axis=2), dict(px=px, py=py, size_px=size_px)


# ---------------------------------------------------------------- S08
# S08 light. v1 (3f5de60) = web stage.ts night: env night polished x1.77 + rim suns -> ring read gunmetal.
# v2 (D-127): brighter so the band reads silver; see README "S08 v2 pencahayaan".
S08_LIGHT_V1 = dict(env="v2-env-night-polished.exr", env_strength=1.77, env_rot=0.0, env_sat=1.0,
                    rim=7.7, rim_fill=1.76, key=0.0, key_pos=(-600, 700, 900), key_size=600,
                    key2=0.0, key2_pos=(900, -500, 1100), key2_size=1000)
# v2 = v1 + two soft white disk keys aimed at the screen centre (positions in CSS px, three space)
S08_LIGHT_V2 = dict(S08_LIGHT_V1, key=120.0, key_pos=(-300, 900, 1200), key_size=1000,
                    key2=40.0, key2_pos=(900, -500, 1100), key2_size=1000)
S08_LIGHT = dict(S08_LIGHT_V2)


def s08_key(power, pos_px, size_px, name="S08_KEY"):
    """soft area key (D-127): gives the outer band a broad silver gradient."""
    sc = bpy.data.scenes[SCENE]
    o = bpy.data.objects.get(name)
    if not o:
        o = bpy.data.objects.new(name, bpy.data.lights.new(name, "AREA"))
        sc.collection.objects.link(o)
    o.parent = bpy.data.objects["THREE_ROOT"]
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.rotation_mode = "QUATERNION"
    o.location = Vector(pos_px) * K
    o.rotation_quaternion = (-Vector(pos_px)).normalized().to_track_quat("-Z", "Y")
    o.data.shape = "DISK"
    o.data.size = size_px * K
    o.data.energy = power
    o.data.color = (1.0, 1.0, 1.0)
    o.hide_render = power <= 0
    return o


def s08_setup(light=None):
    L = dict(S08_LIGHT, **(light or {}))
    sc = bpy.data.scenes[SCENE]
    P = S08_CLOSE
    x_px, y_px, w_px = P["x"] * VW, P["y"] * VH, P["w"] * VW
    cam_z = VH / 2 / math.tan(math.radians(FOV / 2))
    camera("CAM_S08", cam_z, S08_FRAME_CSS, (x_px, y_px), (1024, 1024))
    set_pose(x_px, y_px, w_px, three_quat(P["rx"], P["ry"], P["rz"], P["pitch"], P["roll"]), P["spin"])
    # light 1, rim 0.55 (features.ts NIGHT): env night polished x (1 + 1.4 rim), rim + rim fill suns
    world(L["env"], L["env_strength"], L["env_rot"], L["env_sat"])
    sun("SUN_rim", (900, 420, -650), "#dfe8ff", L["rim"])
    sun("SUN_rimFill", (-700, 260, 900), "#dfe8ff", L["rim_fill"])
    s08_key(L["key"], L["key_pos"], L["key_size"])
    s08_key(L["key2"], L["key2_pos"], L["key2_size"], "S08_KEY2")
    for n in ("SUN_lamp", "S06_KEY"):
        if n in bpy.data.objects:
            bpy.data.objects[n].hide_render = True
    proxy = bpy.data.objects.get("FINGER_PROXY")
    if proxy:
        proxy.hide_render = True
    for o in sc.objects:
        if o.type == "MESH" and o.parent and o.name != "FINGER_PROXY":
            o.hide_render = False
    return dict(x_px=x_px, y_px=y_px, w_px=w_px, cam_z=cam_z)


S08_TUNE = dict(led_strength=1.6, bounce_power=1.2, bounce_radius=0.004, flare_opacity=1.0)
S08_RED = dict(flare_size=0.85)  # "one small red light": same sprite, a little smaller


def s08(color, tune=None):
    t = dict(S08_TUNE, **(S08_RED if color == "red" else {}), **(tune or {}))
    sc = bpy.data.scenes[SCENE]
    info = s08_setup(t.get("light"))
    hx = LED[color]
    lin = tuple(srgb_to_lin(hex_rgb(hx)))
    red = color == "red"
    led = "led_power" if red else "led_main"
    set_led(None if red else hx, hx if red else None, t["led_strength"])
    point("PT_bounce", bpy.data.objects["BOUNCE_" + led], lin, t["bounce_power"], t["bounce_radius"])
    os.makedirs(TMP, exist_ok=True)
    raw = render_to(f"{TMP}/s08-{color}-raw.png")
    rgba = load_rgba(raw)
    rgba, fl = add_flare(rgba, "FLARE_" + led, hx, t["flare_opacity"], t.get("flare_size", 1.0))
    name = f"fb-s08-{color}-polished"
    save_rgba(rgba, f"{OUT}/{name}.png", "PNG")
    save_rgba(rgba, f"{OUT}/{name}.webp", "WEBP", quality=88)
    return dict(info, flare=fl, file=name)


# ---------------------------------------------------------------- S06
def finger_proxy():
    sc = bpy.data.scenes[SCENE]
    o = bpy.data.objects.get("FINGER_PROXY")
    if not o:
        me = bpy.data.meshes.new("FINGER_PROXY")
        segs = 64
        prof = [(r * 1.02, y) for r, y in S06_PROFILE]
        verts, faces = [], []
        for r, y in prof:
            for i in range(segs):
                a = 2 * math.pi * i / segs
                verts.append((r * math.cos(a) * K, y * K, r * math.sin(a) * K))
        for j in range(len(prof) - 1):
            for i in range(segs):
                a0 = j * segs + i; a1 = j * segs + (i + 1) % segs
                faces.append((a0, a1, a1 + segs, a0 + segs))
        me.from_pydata(verts, [], faces)
        me.update()
        for p in me.polygons:
            p.use_smooth = True
        o = bpy.data.objects.new("FINGER_PROXY", me)
        sc.collection.objects.link(o)
        m = bpy.data.materials.get("Skin_Proxy") or bpy.data.materials.new("Skin_Proxy")
        m.use_nodes = True
        bs = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
        bs.inputs["Base Color"].default_value = (0.42, 0.21, 0.12, 1)
        bs.inputs["Roughness"].default_value = 0.55
        bs.inputs["Subsurface Weight"].default_value = 0.0
        me.materials.append(m)
    o.parent = bpy.data.objects["THREE_ROOT"]
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = q_axis((0, 0, 1), math.radians(2.9))
    o.location = (0, 0, 0)
    return o


S06_TUNE = dict(env_strength=1.0, env_rot=160.0, shadow_gain=1.5, samples=512, key_power=22.0,
                key_pos=(-500, 900, 1500), key_size=500)


def key_light(power, pos_px, size_px):
    """soft area key from the front upper left, like the light on the hand photo; it gives the ring
    its contact shadow on the finger (shadow-catcher pass)."""
    sc = bpy.data.scenes[SCENE]
    o = bpy.data.objects.get("S06_KEY")
    if not o:
        o = bpy.data.objects.new("S06_KEY", bpy.data.lights.new("S06_KEY", "AREA"))
        sc.collection.objects.link(o)
    o.parent = bpy.data.objects["THREE_ROOT"]
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.rotation_mode = "QUATERNION"
    o.location = Vector(pos_px) * K
    o.rotation_quaternion = (-Vector(pos_px)).normalized().to_track_quat("-Z", "Y")
    o.data.shape = "DISK"
    o.data.size = size_px * K
    o.data.energy = power
    o.data.color = (1.0, 0.96, 0.9)
    o.hide_render = power <= 0
    return o


def s06_pose():
    sc = bpy.data.scenes[SCENE]
    iw, ih = S06_IMG
    cam_z = (ih / 2) / math.tan(math.radians(FOV / 2))  # web camZ in photo px (hand height = viewport)
    # frame centre relative to the seat (seat = origin, y up)
    shift = (iw / 2 - S06_SEAT[0], -(ih / 2 - S06_SEAT[1]))
    camera("CAM_S06", cam_z, ih, shift, (iw, ih), fit="VERTICAL")
    q = q_axis((0, 0, 1), math.radians(2.9)) @ q_axis((1, 0, 0), math.radians(10)) @ \
        q_axis((0, 1, 0), -math.pi / 2) @ q_axis((1, 0, 0), -math.pi / 2)
    set_pose(0, 0, S06_RING_PX, q, 0.0)
    return dict(cam_z=cam_z, shift=shift)


def s06(tune=None):
    t = dict(S06_TUNE, **(tune or {}))
    sc = bpy.data.scenes[SCENE]
    info = s06_pose()
    world("v2-env-paper-polished.exr", t["env_strength"], t["env_rot"])
    key_light(t["key_power"], t["key_pos"], t["key_size"])
    for n in ("SUN_rim", "SUN_rimFill", "S08_KEY", "S08_KEY2"):
        if n in bpy.data.objects:
            bpy.data.objects[n].hide_render = True
    if "PT_bounce" in bpy.data.objects:
        bpy.data.objects["PT_bounce"].hide_render = True
    set_led(None, None)
    proxy = finger_proxy()
    proxy.hide_render = False
    sc.cycles.samples = t["samples"]
    os.makedirs(TMP, exist_ok=True)
    ring_meshes = [o for o in sc.objects if o.type == "MESH" and o.name != "FINGER_PROXY"]

    # pass 1: ring, finger as holdout (hides the back of the band, keeps its reflection/shadow on the ring)
    proxy.is_holdout = True
    proxy.is_shadow_catcher = False
    for o in ring_meshes:
        o.visible_camera = True
    render_to(f"{TMP}/s06-ring.png")
    # pass 2: contact shadow, finger as shadow catcher, ring hidden from the camera only
    proxy.is_holdout = False
    proxy.is_shadow_catcher = True
    for o in ring_meshes:
        o.visible_camera = False
    render_to(f"{TMP}/s06-shadow.png")
    for o in ring_meshes:
        o.visible_camera = True
    proxy.is_shadow_catcher = False

    ring = load_rgba(f"{TMP}/s06-ring.png")
    shadow = load_rgba(f"{TMP}/s06-shadow.png")[..., 3:4]
    photo = load_rgba(HAND)
    pa = photo[..., 3:4]
    plin = srgb_to_lin(photo[..., :3]) * (1 - np.clip(shadow * t["shadow_gain"], 0, 0.95))
    prgb = lin_to_srgb(plin)
    ra = ring[..., 3:4]
    out_a = ra + pa * (1 - ra)
    out_rgb = np.where(out_a > 1e-6, (ring[..., :3] * ra + prgb * pa * (1 - ra)) / np.maximum(out_a, 1e-6), 0)
    out = np.concatenate([out_rgb, out_a], axis=2)
    save_rgba(out, f"{OUT}/fb-s06-finger-polished.png", "PNG")
    save_rgba(out, f"{OUT}/fb-s06-finger-polished.webp", "WEBP", quality=90)
    return info


def build_all():
    setup_scene()
    res = {c: s08(c) for c in ("green", "blue", "violet", "red")}
    res["s06"] = s06()
    return res


def preview_on(path_in, path_out, bg_hex="#1B0B06"):
    """review helper: straight-alpha image over a flat colour (display space)."""
    a = load_rgba(path_in)
    bg = hex_rgb(bg_hex)[None, None, :]
    out = a[..., :3] * a[..., 3:4] + bg * (1 - a[..., 3:4])
    save_rgba(np.concatenate([out, np.ones_like(a[..., 3:4])], axis=2), path_out, "PNG")

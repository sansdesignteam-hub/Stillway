"""
D-182b: S01 poster RING pass matched to the live web ring (Developer a7eea87, D-182). Only RG/RGm change.
    Blender -b -P design/3d/v2/s01-ring-live-pass.py          # then: s01-plate-build.py -- comp
Cycles render of the ring alone, lit like the web at rest: env = hero-env-warm.jpg (rotated 0.6 pi, seam
cross-faded) with 25 % paper env, in CAMERA space (the web camera never turns); web rig (sun, hemisphere,
fill, desk key); web band material; AgX, exposure 1.15. Then a monotonic luma curve maps the ring's
p05/25/50/75/95 (1440@2x web rest frame) to the live values and per-channel gains set the live mean colour.
"""
import bpy, os, math, importlib.util
import numpy as np
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("pb", HERE + "/s01-plate-build.py")
pb = importlib.util.module_from_spec(spec); spec.loader.exec_module(pb)
ped, PASS = pb.ped, pb.PASS
WEB_PHOTO = HERE + "/env/hero-env-warm.jpg"
if not os.path.exists(WEB_PHOTO):
    WEB_PHOTO = os.path.join(HERE, "../../../../Developer/web-v2/public/env/hero-env-warm.jpg")
TARGET = (33, 50, 100, 155, 245)          # live ring luma p05..p95 (D-182)
TARGET_RGB = np.array([120, 108, 99], np.float32)   # live mean colour (D-182, middle of the sway range)


def pixels(img):
    w, h = img.size
    a = np.empty(w * h * 4, np.float32); img.pixels.foreach_get(a)
    return a.reshape(h, w, 4)[..., :3]            # bottom-up


def sample(a, u, v):
    h, w = a.shape[:2]
    x = (u % 1.0) * w - 0.5; y = np.clip(v, 0, 1) * h - 0.5
    x0 = np.floor(x).astype(int); y0 = np.floor(y).astype(int)
    fx = (x - x0)[..., None]; fy = (y - y0)[..., None]
    g = lambda i, j: a[np.clip(j, 0, h - 1), i % w]
    return (g(x0, y0) * (1 - fx) + g(x0 + 1, y0) * fx) * (1 - fy) + (g(x0, y0 + 1) * (1 - fx) + g(x0 + 1, y0 + 1) * fx) * fy


def web_env(R):
    """equirect in Blender world space holding the web's blended env (linear)"""
    photo = pixels(bpy.data.images.load(WEB_PHOTO))               # sRGB values (byte image)
    paper = pixels(bpy.data.images.load(ped.ENV))                 # linear EXR
    W, H = 2048, 1024
    u = (np.arange(W) + 0.5) / W; v = (np.arange(H) + 0.5) / H
    phi = (u - 0.5) * 2 * math.pi; th = (v - 0.5) * math.pi
    phi, th = np.meshgrid(phi, th)
    # Blender equirect: u = 0.5 - atan2(y, x) / 2 pi
    d = np.stack([np.cos(th) * np.cos(-phi), np.cos(th) * np.sin(-phi), np.sin(th)], -1)
    c = d @ np.array(R, np.float64)                               # camera space: x right, y up, z back (= three world)
    rot = math.pi * 0.6; cs, sn = math.cos(rot), math.sin(rot)
    r = np.stack([cs * c[..., 0] + sn * c[..., 2], c[..., 1], -sn * c[..., 0] + cs * c[..., 2]], -1)
    equi = lambda q: (np.arctan2(q[..., 2], q[..., 0]) / (2 * math.pi) + 0.5, np.arcsin(np.clip(q[..., 1], -1, 1)) / math.pi + 0.5)
    pu, pv = equi(r)
    t = np.clip(np.minimum(pu, 1 - pu) / 0.12, 0, 1); seam = (0.5 * (1 - t * t * (3 - 2 * t)))[..., None]
    a = pb.eotf(sample(photo, pu, pv)) * (1 - seam) + pb.eotf(sample(photo, 1 - pu, pv)) * seam
    b = sample(paper, *equi(c))
    out = a * 0.75 + b * 0.25
    # hemisphere light (0.55, plus the desk's 0.25): uniform-sky equivalent radiance = irradiance / pi
    k = (c[..., 1:2] * 0.5 + 0.5)
    lin = lambda hexc: pb.eotf(np.array([(hexc >> s & 255) / 255 for s in (16, 8, 0)]))
    out += (lin(0x8a6040) * (1 - k) + lin(0x5a4a3e) * k) * 0.55 / math.pi
    img = bpy.data.images.new("web_env", W, H, alpha=True, float_buffer=True)
    rgba = np.ones((H, W, 4), np.float32); rgba[..., :3] = out
    img.pixels.foreach_set(rgba.ravel()); img.pack()
    return img


DARK_TINT = np.array([1.17, 0.98, 0.85], np.float32)


def lin_hex(h): return tuple(float(pb.eotf(np.float32((h >> s & 255) / 255))) for s in (16, 8, 0))


def setup_web_look(S):
    sc = bpy.context.scene
    R = S["cam"].matrix_world.to_3x3().normalized()
    nt = sc.world.node_tree
    env = nt.nodes.new("ShaderNodeTexEnvironment"); env.image = web_env([list(r) for r in R])
    bg = nt.nodes.new("ShaderNodeBackground"); bg.inputs["Strength"].default_value = float(os.environ.get("WEB_ENV", "1.0"))
    nt.links.new(env.outputs[0], bg.inputs[0])
    nt.links.new(bg.outputs[0], [n for n in nt.nodes if n.type == 'OUTPUT_WORLD'][0].inputs[0])
    def sun(name, to_light, color, strength):
        l = bpy.data.lights.new(name, 'SUN'); l.energy = strength; l.color = color; l.angle = math.radians(4)
        o = bpy.data.objects.new(name, l); sc.collection.objects.link(o)
        o.rotation_euler = Vector(to_light).normalized().to_track_quat('Z', 'Y').to_euler()
    sun("web_sun", R @ Vector((720, 640, 420)), lin_hex(0xffdcb2), 2.6)
    sun("web_fill", R @ Vector((-700, 120, 600)), lin_hex(0xffe7cf), 0.35)
    sun("web_desk_key", (0.5702, 0.3602, 0.7383), lin_hex(0xffb370), 1.0)
    S["key"].hide_render = True
    bpy.data.lights["Lamp_Spill"].energy = 0.0
    # web band material (stage.ts): neutral, roughness 0.06, no anisotropy / normal map
    for o in S["ring"]:
        for slot in o.material_slots:
            m = slot.material
            b = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if not b or b.inputs["Metallic"].default_value < 0.5 or "ngrav" in m.name.lower() or "liner" in m.name.lower() or "contact" in m.name.lower():
                continue
            for key, val in (("Base Color", (0.92, 0.92, 0.93, 1)), ("Roughness", 0.06), ("Anisotropic", 0.0)):
                for ln in list(b.inputs[key].links): m.node_tree.links.remove(ln)
                b.inputs[key].default_value = val
            for ln in list(b.inputs["Normal"].links): m.node_tree.links.remove(ln)
            print("PLATE web band material", m.name)


def render():
    S = pb.scene_setup()
    setup_web_look(S)
    sc = bpy.context.scene
    pb.show(S["ped"], 'off'); pb.show(S["desk"], 'off'); pb.show(S["proxy"], 'off'); pb.show(S["ring"], 'on')
    s = sc.render.image_settings
    s.file_format = 'PNG'; s.color_mode = 'RGBA'; s.color_depth = '16'; s.compression = 15
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'None'
    sc.view_settings.exposure = math.log2(1.15)
    sc.cycles.samples = pb.SPP
    for sfx, border, lens, shift in (("", pb.BORDER, ped.CAM["lens"], ped.CAM["shift"]), ("m", pb.BORDER_M, pb.MOB_LENS, pb.MOB_SHIFT)):
        S["cam"].data.lens = lens; S["cam"].data.shift_x, S["cam"].data.shift_y = shift
        sc.render.border_min_x, sc.render.border_max_x, sc.render.border_min_y, sc.render.border_max_y = border
        sc.render.filepath = f"{PASS}/RG{sfx}_lin.png"
        bpy.ops.render.render(write_still=True)


LUMA = np.array([0.2126, 0.7152, 0.0722], np.float32)


def stats(rgba):
    fr = pb.webframe(rgba, 2880, 1800)
    m = fr[..., 3] > 0.98
    rgb = fr[..., :3][m]
    return [float(np.percentile(rgb @ LUMA * 255, q)) for q in (5, 25, 50, 75, 95)], rgb.mean(0) * 255


def apply(rgba, xs, ys, gain):
    rgb = rgba[..., :3]
    L = rgb @ LUMA * 255
    new = np.interp(L, xs, ys).astype(np.float32)
    # add the luma difference (keeps the render's chroma, no blow-up in the blacks), then tint
    out = np.clip(rgb + ((new - L) / 255)[..., None], 0, 1) * gain
    # the live liner and dark reflections are warm brown, not grey: tint the darks, luma unchanged
    y = (out @ LUMA)[..., None]
    w = np.clip((120 / 255 - y) / (70 / 255), 0, 1)
    warm = DARK_TINT / (DARK_TINT @ LUMA)
    out = out * (1 + (warm - 1) * w)
    return np.concatenate([np.clip(out, 0, 1), rgba[..., 3:4]], -1)


def grade():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    raw = pb.load(f"{PASS}/RG_lin.png")
    p, mean = stats(raw)
    print("PLATE raw ring", [round(v) for v in p], mean.round())
    xs = [0] + p + [255]; ys = [0] + list(TARGET) + [255]
    gain = np.ones(3, np.float32)
    for _ in range(6):          # curve and tint interact (clipping, interpolation): iterate
        out = apply(raw, xs, ys, gain)
        q, mean = stats(out)
        ratio = TARGET_RGB / mean
        gain = gain * (ratio / (ratio @ LUMA))     # hue only; the curve owns the level
        q, mean = stats(apply(raw, xs, ys, gain))
        ys = [0] + [float(y + (t - v)) for y, v, t in zip(ys[1:-1], q, TARGET)] + [255]
        ys = list(np.maximum.accumulate(ys))
    for sfx in ("", "m"):
        out = apply(pb.load(f"{PASS}/RG{sfx}_lin.png"), xs, ys, gain)
        pb.save(out, f"{PASS}/RG{sfx}.png")
        q, mean = stats(out)
        print("PLATE ring", sfx or "desktop", [round(v) for v in q], mean.round())
    print("PLATE curve", [round(float(v)) for v in xs], [round(float(v)) for v in ys], gain)


if __name__ == "__main__":
    if not os.environ.get("GRADE_ONLY"): render()
    grade()

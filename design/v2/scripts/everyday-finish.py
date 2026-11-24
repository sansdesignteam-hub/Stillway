"""S07 'The Everyday' (D-152): upscale the selected AI raws to the web master size.
Usage: python everyday-finish.py  (run from the repo root; needs Pillow + numpy)
_work/raw2-<v>.png (1536x1024) -> design/assets/v2/A-11b-everyday-<v>.png (2880x1920 PNG)
                                 + design/assets/v2/everyday/A-11b-everyday-<v>-2880.webp / -1920.webp
Steps: Lanczos 1.875x, light unsharp mask (edges of rings/dock only, threshold keeps the stone soft),
fine luminance grain so the upscale does not look plastic. No colour or exposure change: the
Developer lowers exposure in CSS (D-153)."""
import numpy as np
from PIL import Image, ImageFilter
WD = 'design/assets/v2/everyday/_work'
OUT, WEB = 'design/assets/v2', 'design/assets/v2/everyday'
rng = np.random.default_rng(152)
for v in 'abc':
    im = Image.open(f'{WD}/raw2-{v}.png').convert('RGB')
    up = im.resize((2880, 1920), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.6, percent=45, threshold=3))
    a = np.asarray(up, np.float32)
    g = rng.normal(0, 1.6, a.shape[:2]).astype(np.float32)
    g = np.asarray(Image.fromarray(np.clip(g * 40 + 128, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), np.float32)
    a = np.clip(a + ((g - 128) / 40 * 2.2)[..., None], 0, 255).astype(np.uint8)
    out = Image.fromarray(a)
    out.save(f'{OUT}/A-11b-everyday-{v}.png', optimize=True)
    out.save(f'{WEB}/A-11b-everyday-{v}-2880.webp', quality=84, method=6)
    out.resize((1920, 1280), Image.LANCZOS).save(f'{WEB}/A-11b-everyday-{v}-1920.webp', quality=84, method=6)
    print(v, out.size)

"""D-152 variation B: the gold ring's engraving came out misspelled ('Stilway'). Two AI edits that tried to
re-engrave it kept the typo, so (per D-073: logo clean or invisible) the gold band was made plain by an AI edit of
the full frame (_work/b-gold-plain-out.png, same framing) and only the engraving area is pasted back into raw2-b.
Usage (repo root, Pillow): python everyday-patch-b.py  -> overwrites _work/raw2-b.png, keeps _work/raw2-b-orig.png"""
import os
from PIL import Image, ImageDraw, ImageFilter
WD = 'design/assets/v2/everyday/_work'
src = f'{WD}/raw2-b-orig.png'
if not os.path.exists(src): os.rename(f'{WD}/raw2-b.png', src)
a = Image.open(src).convert('RGB')
b = Image.open(f'{WD}/b-gold-plain-out.png').convert('RGB').resize(a.size, Image.LANCZOS)
m = Image.new('L', a.size, 0)
ImageDraw.Draw(m).rectangle((1280, 582, 1362, 698), fill=255)   # engraving on the gold band only; silver ring edge is at x<=1270
m = m.filter(ImageFilter.GaussianBlur(5))
Image.composite(b, a, m).save(f'{WD}/raw2-b.png')
print('patched')

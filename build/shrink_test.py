import io, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(r"C:\Users\affla\OneDrive\Documents\Saas\Claude projects\COCOPALM")
USER = ROOT / "Coco-Palms-Export-Profile.pptx"
OUT = ROOT / "build" / "shrink"
OUT.mkdir(exist_ok=True)

with zipfile.ZipFile(USER) as z:
    blob = z.read("ppt/media/image4.png")

im = Image.open(io.BytesIO(blob))
print("original: %s  %s  mode=%s  %.2f MB" % (im.size, im.format, im.mode, len(blob) / 1024 / 1024))
has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
print("has transparency:", has_alpha)

# The picture occupies about 5.76 in wide on the slide. At 200 ppi that is ~1150 px;
# 1600 px gives comfortable headroom for print without carrying 4000 px.
for target in (2000, 1600, 1200):
    r = im.copy()
    r.thumbnail((target, target), Image.LANCZOS)
    buf = io.BytesIO()
    if has_alpha:
        r.save(buf, "PNG", optimize=True)
        ext = "png"
    else:
        r.convert("RGB").save(buf, "JPEG", quality=88, optimize=True)
        ext = "jpg"
    p = OUT / ("product-%d.%s" % (target, ext))
    p.write_bytes(buf.getvalue())
    print("  %4d px -> %7.2f MB  (%s)   saves %.2f MB"
          % (target, len(buf.getvalue()) / 1024 / 1024, ext,
             (len(blob) - len(buf.getvalue())) / 1024 / 1024))

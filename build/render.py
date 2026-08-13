import os, sys
import pypdfium2 as pdfium

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(HERE, "Coco-Palms-Export-Profile.pdf")
OUT = os.path.join(HERE, "render")
os.makedirs(OUT, exist_ok=True)

pages = sys.argv[1:]  # optional 1-based page numbers
doc = pdfium.PdfDocument(PDF)
print("pages in pdf:", len(doc))

want = [int(p) for p in pages] if pages else list(range(1, len(doc) + 1))
for n in want:
    page = doc[n - 1]
    img = page.render(scale=150 / 72).to_pil()
    p = os.path.join(OUT, "slide-%02d.jpg" % n)
    img.convert("RGB").save(p, "JPEG", quality=88)
    print(p, img.size)

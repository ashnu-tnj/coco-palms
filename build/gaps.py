import os
from pptx import Presentation
from pptx.util import Emu

HERE = os.path.dirname(os.path.abspath(__file__))
p = Presentation(os.path.join(HERE, "Coco-Palms-Export-Profile.pptx"))

TITLES = {}
for i, s in enumerate(p.slides, 1):
    # slide title = the largest-font bold Cambria text near the top
    best = None
    for sh in s.shapes:
        if not sh.has_text_frame:
            continue
        y = Emu(sh.top).inches
        if y > 2.0:
            continue
        for para in sh.text_frame.paragraphs:
            for r in para.runs:
                sz = r.font.size.pt if r.font.size else 0
                if sz >= 30 and r.text.strip():
                    if best is None or sz > best[0]:
                        best = (sz, r.text.strip())
    TITLES[i] = best[1] if best else "(no title)"

total = 0
for i, s in enumerate(p.slides, 1):
    # collect label text sitting immediately left of / above each TO CONFIRM
    items = []
    boxes = []
    for sh in s.shapes:
        if sh.has_text_frame and sh.text_frame.text.strip():
            boxes.append((Emu(sh.left).inches, Emu(sh.top).inches,
                           Emu(sh.width).inches, sh.text_frame.text.strip()))
    for x, y, w, t in boxes:
        if "TO CONFIRM" not in t:
            continue
        n = t.count("TO CONFIRM")
        total += n
        # nearest label: same row to the left, else directly above
        label = None
        cands = [(abs(by - y), bx, bt) for bx, by, bw, bt in boxes
                 if "TO CONFIRM" not in bt and abs(by - y) < 0.16 and bx < x]
        if cands:
            label = sorted(cands)[-1][2]
        else:
            above = [(y - by, bt) for bx, by, bw, bt in boxes
                     if "TO CONFIRM" not in bt and 0 < y - by < 0.30 and abs(bx - x) < 0.5]
            if above:
                label = sorted(above)[0][1]
        items.append((label or t[:60], n))
    if items:
        print("\nSLIDE %d - %s" % (i, TITLES[i]))
        for lab, n in items:
            suffix = "  x%d" % n if n > 1 else ""
            print("    - %s%s" % (lab.replace("\n", " / ")[:78], suffix))

print("\n\nTOTAL 'TO CONFIRM' slots:", total)

# Coco Palms — brand site & export profile

Marketing site and company-profile deck for **Coco Palms by Skylanes and Allied
Products** — 100% organic, sulfur-free coconut oil in edible and bulk grades,
manufactured in Chengalpattu district, Tamil Nadu.

---

## Landing page

Static, dependency-free: plain HTML, CSS and one vanilla JS file. No build step,
no framework, no bundler.

```
site/
├── index.html    # single page
├── styles.css    # design system + all sections
├── main.js       # scroll behaviour, reveals, sticky process, form
└── img/          # web-optimised photography (~1.4 MB total)
```

### Run it locally

```bash
python -m http.server 4321 --directory site
```

Then open <http://localhost:4321>. Opening `site/index.html` straight from the
filesystem also works, but a server is closer to production.

### Deploying

Any static host will serve `site/` as-is — Netlify, Vercel, Cloudflare Pages,
GitHub Pages, or plain nginx. Publish directory is `site`, build command is none.

### Notes for whoever picks this up

- **The enquiry form has no backend.** Submitting composes a `mailto:` to
  `info@blackboxtraders.in`. Swap it for a real endpoint (Formspree, a Worker,
  your CRM) in `site/main.js` before launch.
- Fonts load from Google Fonts (Spectral + IBM Plex Sans). Self-host them if you
  need the page to work offline or want to drop the third-party request.
- Images are served as WebP (2.7 MB total). Matching `.jpg`/`.png` originals sit
  alongside them in `site/img/` if you need a fallback or a print-resolution copy.
- Motion is gated behind `prefers-reduced-motion`; every section is readable
  and usable with JavaScript disabled.

### Design system

| Token group | Values |
| --- | --- |
| Surfaces | `--paper` `#FCFAF5`, `--cream` `#F4EFE3`, `--forest` `#123521`, `--forest-deep` `#071710` |
| Accent | `--gold` `#A9740F`, `--gold-bright` `#E8BC5C` — the oil drop, used sparingly |
| Type | Spectral 600 (display) · IBM Plex Sans (UI, body, tables) |
| Rhythm | 8px base scale, `--s1` … `--s8` |

The droplet glyph — a clipped polygon — repeats as the eyebrow marker, list
bullet, and marquee separator.

**Why these two faces.** Spectral holds a constant stroke contrast at every
size, so the 112px hero and the 64px section heads read as one voice, and its
thins stay thick enough to survive white-on-photography — the failure mode that
made the previous display face fall apart over the plant imagery. IBM Plex Sans
was drawn for an industrial manufacturer and its digits are 600/1000 units
**tabular by default**, so the release-specification and Incoterms tables align
without a `tabular-nums` toggle that a later edit could silently drop. Body
prose opts back into proportional figures via `.lead`.

---

## How the photography was made

Every image is re-extracted from the company profile film
(`COCO PALMS1 (1).MP4`, 1920×960, 24 fps) rather than lifted from the deck. The
scripts are not checked in — they were one-shot tooling — but the method matters
if you ever re-cut these:

1. **Locate.** Decode the whole film to 160×80 greyscale once and match each
   required shot by normalised cross-correlation, which is grade-invariant.
2. **Pick the sharp frame.** The deck's stills had been grabbed on exact
   one-second boundaries — whatever frame landed there, motion blur included.
   Scanning ±1 s at full resolution and taking the highest variance-of-Laplacian
   gives a genuinely sharp frame instead. Gains ran from 1.05× to 7.6×.
3. **Denoise.** Re-extract the winner through ffmpeg's `atadenoise`, a
   motion-aware temporal filter that strips H.264 mosquito noise without
   smearing moving subjects.
4. **Grade.** Percentile black/white point (this is what removes the haze that
   reads as "not crisp"), a gentle S-curve, saturation tapered off in the
   highlights, and a small warm bias in the midtones.
5. **Sharpen in two passes.** A wide-radius unsharp for local contrast, then a
   fine-radius pass *after* resizing to delivery size.

Six shots could not be fixed by the ±1 s search and were hand-picked from wider
scans — the hero, the PLC panel, the kernel heap, the crew photo, the sorting
line and the logo plate.

### Known limits of the source footage

- **There is no high-pressure-wash shot in the film.** The process copy lists it
  as step 04, but nothing on camera shows it. The hygiene section now uses a
  hand-sorting frame captioned for what it actually is. If washing matters
  commercially, it needs to be shot.
- The macro shots (oil pour, PLC screen) are shallow-focus by construction and
  will never be sharp.

### The pack shot

`site/img/bottle.webp` is the one image **not** taken from the film — it is a
supplied studio shot, and it replaced a soft frame of a bottle sitting on the
founder's desk whose base was occluded by a nameplate.

It arrived on a grey studio backdrop, which had to become the card's `--cream`.
Cutting the bottle out was not an option: the glass is clear, so the backdrop
shows straight through it and every key leaks inside — a sobel-barrier flood
fill kept only the label. Instead the backdrop is *modelled* and replaced:

1. Fit a smooth polynomial to the backdrop over a border band, rejecting
   outliers so the bottle's contact shadow cannot drag the fit.
2. Divide that model out and multiply flat `--cream` back in, with a filmic
   rolloff so cap speculars compress instead of clipping. Everything that is not
   backdrop survives as a ratio — including the backdrop seen *through* the
   glass, which re-tones with it, exactly as if it had been shot on a cream sweep.
3. Flatten the residual vignette, then extend the now-flat backdrop sideways to
   reach the card's 16:10 rather than cropping a tall subject to a wide frame.

The delivered backdrop matches the section tint to within 1/255, so the image
edge is invisible against the card.

The deck has **not** been given this shot. `assets/deck-images/bottle.jpg` is
still the old film frame, and slide 3's photo box is a 2.74:1 strip rather than
the site's 16:10, so it needs its own framing plus a `node deck.js` rebuild.

---

## Export profile deck

`Coco-Palms-Export-Profile.pptx` (and its PDF export) is generated by the Node +
Python pipeline in `build/`.

```bash
cd build
npm install
node deck.js        # compose the .pptx
python render.py    # render slides to images
python qa.py        # layout / overflow checks
```

Render intermediates under `build/render/`, `build/img/` and friends are
gitignored — they are rebuilt from source.

---

## Contact

Skylanes and Allied Products
177 Marakanam Road, Maduranthagam, Nethapakkam, Chengalpattu, Tamil Nadu 603301, India
<info@blackboxtraders.in> · +91 95661 62825 · <https://www.blackboxtraders.in>

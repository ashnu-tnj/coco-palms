const path = require("path");
const PptxGenJS = require("pptxgenjs");

const IMG = path.join(__dirname, "img");
const im = (n) => path.join(IMG, n);

// ---------------------------------------------------------------- palette
// Sampled from the Coco Palms logo: forest green wordmark, leaf-green
// "SKYLANES", gold oil droplet and cupped hands, coconut husk brown.
const DEEP = "14532D"; // deep palm green - dominant
const MID = "3E7B3F";
const LEAF = "6FB04A";
const GOLD = "B8860F"; // oil / accent
const GOLD_LT = "E3C171";
const INK = "232C24";
const MUTED = "6E7A6F";
const MUTED_D = "A9BBAB"; // muted on dark
const TINT = "F1F5EF";
const WHITE = "FFFFFF";

const HEAD = "Cambria";
const BODY = "Calibri";

const W = 13.333;
const H = 7.5;
const M = 0.7; // page margin
const CW = W - M * 2; // content width = 11.933

const TBD = "TO CONFIRM";

const pres = new PptxGenJS();
pres.layout = "LAYOUT_WIDE"; // must precede addSlide
pres.author = "Coco Palms Skylanes and Allied Products";
pres.company = "Coco Palms Skylanes and Allied Products";
pres.title = "Coco Palms Skylanes - Export Capability Profile";

// ---------------------------------------------------------------- helpers
const shadow = (o = {}) => ({
  type: "outer",
  color: "000000",
  blur: o.blur || 14,
  offset: o.offset === undefined ? 2 : o.offset,
  angle: o.angle || 90,
  opacity: o.opacity || 0.1,
});

function bg(slide, color) {
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: H, fill: { color }, line: { color, width: 0 },
  });
}

function card(slide, x, y, w, h, o = {}) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: o.radius === undefined ? 0.06 : o.radius,
    fill: { color: o.fill || TINT },
    line: o.line || { color: o.fill || TINT, width: 0 },
    shadow: o.shadow ? shadow(o.shadow) : undefined,
  });
}

// The one repeated motif: a gold disc carrying a number or short label.
function badge(slide, x, y, d, label, o = {}) {
  slide.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: { color: o.fill || GOLD },
    line: { color: o.fill || GOLD, width: 0 },
  });
  slide.addText(String(label), {
    x, y, w: d, h: d,
    align: "center", valign: "middle", margin: 0,
    fontFace: HEAD, fontSize: o.fontSize || 15, bold: true,
    color: o.color || WHITE,
  });
}

function kicker(slide, text, x, y, color) {
  slide.addText(text, {
    x, y, w: W - x - M, h: 0.28, margin: 0,
    fontFace: BODY, fontSize: 11.5, bold: true, charSpacing: 2.4,
    color: color || GOLD,
  });
}

function title(slide, text, x, y, o = {}) {
  slide.addText(text, {
    x, y, w: o.w || (W - x - M), h: o.h || 0.82, margin: 0,
    fontFace: HEAD, fontSize: o.size || 34, bold: true,
    color: o.color || DEEP, valign: "top",
  });
}

// label / value row used wherever a hard figure is still outstanding
function factRow(slide, x, y, w, label, value, o = {}) {
  slide.addText(label, {
    x, y, w: o.lw || 2.55, h: 0.3, margin: 0, valign: "middle",
    fontFace: BODY, fontSize: 11.5, bold: true, charSpacing: 0.8,
    color: o.labelColor || MUTED,
  });
  const isTbd = value === TBD;
  slide.addText(value, {
    x: x + (o.lw || 2.55), y, w: w - (o.lw || 2.55), h: 0.3, margin: 0, valign: "middle",
    fontFace: BODY, fontSize: isTbd ? 11 : 12.5,
    bold: isTbd, italic: isTbd, charSpacing: isTbd ? 1.2 : 0,
    color: isTbd ? GOLD : (o.valueColor || INK),
  });
}

function footer(slide, n, o = {}) {
  slide.addText("Coco Palms Skylanes and Allied Products", {
    x: o.x === undefined ? M : o.x, y: H - 0.52, w: 6, h: 0.26, margin: 0,
    fontFace: BODY, fontSize: 9, color: o.color || MUTED, charSpacing: 0.6,
  });
  slide.addText(String(n), {
    x: W - M - 1, y: H - 0.52, w: 1, h: 0.26, margin: 0, align: "right",
    fontFace: BODY, fontSize: 9, color: o.color || MUTED,
  });
}

function photo(slide, file, x, y, w, h, o = {}) {
  slide.addImage({
    path: im(file), x, y, w, h,
    sizing: { type: o.fit || "cover", w, h },
  });
}

// caption sitting under a photo
function caption(slide, text, x, y, w, color) {
  slide.addText(text, {
    x, y, w, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 9.5, italic: true, color: color || MUTED,
  });
}

function bullets(slide, items, x, y, w, h, o = {}) {
  const runs = items.map((t, i) => ({
    text: t,
    options: {
      bullet: true,
      breakLine: i !== items.length - 1,
      fontFace: BODY, fontSize: o.size || 12.5,
      color: o.color || INK,
      paraSpaceAfter: o.gap === undefined ? 7 : o.gap,
    },
  }));
  slide.addText(runs, { x, y, w, h, margin: 0, valign: "top", lineSpacingMultiple: 1.08 });
}

// =========================================================== 1. COVER
{
  const s = pres.addSlide();
  bg(s, DEEP);

  // logo sits on its own white plate - the source art is on a white ground
  card(s, M, 1.72, 4.15, 4.15, { fill: WHITE, radius: 0.05, shadow: { blur: 20, opacity: 0.22 } });
  s.addImage({
    path: im("logo.jpg"), x: M + 0.22, y: 1.94, w: 3.71, h: 3.71,
    sizing: { type: "contain", w: 3.71, h: 3.71 },
  });

  const tx = M + 4.15 + 0.72; // 5.57
  const tw = W - tx - M; // 7.06

  s.addText("EXPORT CAPABILITY PROFILE", {
    x: tx, y: 1.76, w: tw, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 12, bold: true, charSpacing: 3, color: GOLD_LT,
  });
  s.addText("Coco Palms", {
    x: tx, y: 2.16, w: tw, h: 0.78, margin: 0,
    fontFace: HEAD, fontSize: 44, bold: true, color: WHITE,
  });
  s.addText("Skylanes", {
    x: tx, y: 2.9, w: tw, h: 0.78, margin: 0,
    fontFace: HEAD, fontSize: 44, bold: true, color: LEAF,
  });
  s.addText("and Allied Products", {
    x: tx, y: 3.72, w: tw, h: 0.36, margin: 0,
    fontFace: BODY, fontSize: 17, charSpacing: 1.6, color: MUTED_D,
  });

  s.addText(
    "100% organic, sulfur-free coconut oil  ·  edible and bulk grades",
    {
      x: tx, y: 4.3, w: tw, h: 0.6, margin: 0,
      fontFace: BODY, fontSize: 13.5, color: GOLD_LT, lineSpacingMultiple: 1.2,
    }
  );

  s.addText("Pure in every drop.", {
    x: tx, y: 4.94, w: tw, h: 0.38, margin: 0,
    fontFace: HEAD, fontSize: 17, italic: true, color: WHITE,
  });

  // certification strip, as plain type - no rules or bars
  s.addText("ISO 9001    ·    FSSAI    ·    NABL", {
    x: tx, y: 5.54, w: tw, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11.5, bold: true, charSpacing: 1.8, color: WHITE,
  });

  s.addText(
    [
      { text: "Prepared for  ", options: { fontFace: BODY, fontSize: 10.5, color: MUTED_D } },
      { text: TBD, options: { fontFace: BODY, fontSize: 10.5, bold: true, italic: true, charSpacing: 1.2, color: GOLD } },
      { text: "        Issue date  ", options: { fontFace: BODY, fontSize: 10.5, color: MUTED_D } },
      { text: "August 2026", options: { fontFace: BODY, fontSize: 10.5, color: WHITE } },
    ],
    { x: M, y: 6.32, w: CW, h: 0.3, margin: 0 }
  );

  s.addNotes(
    "Cover. Logo art is the clean plate lifted from 4:45 of the company video. " +
    "Replace the two TO CONFIRM slots with the buyer's name and the issue date before sending."
  );
}

// =========================================================== 2. AT A GLANCE
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "WHO WE ARE", M, 0.62);
  title(s, "Company at a glance", M, 0.96);

  const lw = 6.35;
  s.addText(
    "Coco Palms Skylanes and Allied Products has been trading in coconut and allied " +
    "products since 2013. In 2026 we commissioned a purpose-built dehydration " +
    "facility on our four-acre site in Chengalpattu district, Tamil Nadu. Whole nuts " +
    "are received at our own intake yard, cut and washed on site, dried in a catalytic " +
    "infrared dehydrator, then pressed and filtered into finished oil. Thirteen years of trade " +
    "experience now sits behind a drying plant specified to current food-safety " +
    "standards rather than retrofitted to them.",
    {
      x: M, y: 2.02, w: lw, h: 1.72, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 13, color: INK, lineSpacingMultiple: 1.26,
    }
  );

  const rows = [
    ["Trading since", "2013"],
    ["Dehydration facility", "Commissioned 2026"],
    ["Plant location", "Chengalpattu, Tamil Nadu"],
    ["Site area", "4 acres"],
    ["Daily nut intake", "100,000 nuts"],
    ["Workforce", "30+"],
    ["Quality accreditations", "ISO 9001, FSSAI, NABL"],
  ];
  let fy = 3.88;
  rows.forEach(([l, v]) => {
    factRow(s, M, fy, lw, l, v, { lw: 2.35 });
    fy += 0.40;
  });

  photo(s, "aerial2.jpg", M + lw + 0.55, 2.02, 4.38, 3.32);
  caption(s, "Drying halls from above - the plant's insulated chamber block", M + lw + 0.55, 5.42, 4.38);

  // buyers think in tonnes, not nuts - give them the conversion
  card(s, M + lw + 0.55, 5.8, 4.38, 0.84, { fill: DEEP });
  s.addText(
    [
      { text: "100,000 nuts per day", options: { fontFace: HEAD, fontSize: 14, bold: true, color: WHITE, breakLine: true } },
      { text: "10 tonnes of material dried per 12-hour batch", options: { fontFace: BODY, fontSize: 10.5, color: GOLD_LT } },
    ],
    { x: M + lw + 0.8, y: 5.8, w: 3.98, h: 0.84, margin: 0, valign: "middle", lineSpacingMultiple: 1.14 }
  );

  footer(s, 2);
  s.addNotes(
    "Facts confirmed by the client: trading since 2013, dehydration facility commissioned " +
    "2026, Chengalpattu, 4 acres, 100,000 nuts/day, 30+ workforce. " +
    "The 2013 / 2026 split is deliberate and is a selling point: thirteen years of trade " +
    "history plus a brand-new plant answers both of a buyer's first two doubts at once. " +
    "Do not collapse it back to a single date. " +
    "DEFAULT SUPPLIED BY CLAUDE: the 12-16 MT dried kernel conversion is my calculation " +
    "at roughly 130-170 g copra per nut. NOTE - the company's own film states 10 tonnes " +
    "of material per 12-hour batch and about 100,000 litres of oil per month; reconcile " +
    "these three figures before quoting any of them."
  );
}

// =========================================================== 3. PRODUCT RANGE
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "PRODUCT RANGE", M, 0.62);
  title(s, "What we supply", M, 0.96);

  const gap = 0.42;
  const cw = (CW - gap) / 2; // 5.756
  const items = [
    {
      n: "01",
      name: "Coconut Oil, Edible Grade",
      img: "bottle.jpg",
      fit: "cover",
      lines: [
        "Expeller-pressed from infrared-dried kernel",
        "Sulfur-free - no chemical used at any stage",
        "FFA below 0.5% · moisture below 0.1%",
        "200 ml / 500 ml / 1 L PET · 5 L jerrycan",
      ],
    },
    {
      n: "02",
      name: "Coconut Oil, Bulk",
      img: "oil.jpg",
      fit: "cover",
      lines: [
        "Same line and same specification, bulk packed",
        "Filtered grade; RBD available on request",
        "For industrial and repacking buyers",
        "15 kg tin · 200 kg HDPE drum · flexitank",
      ],
    },
  ];

  items.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 1.98, cw, 4.06, { fill: TINT, shadow: { blur: 12, opacity: 0.08 } });
    photo(s, it.img, x, 1.98, cw, 2.1, { fit: it.fit });
    badge(s, x + 0.3, 4.24, 0.54, it.n, { fontSize: 12 });
    s.addText(it.name, {
      x: x + 0.98, y: 4.24, w: cw - 1.28, h: 0.54, margin: 0, valign: "middle",
      fontFace: HEAD, fontSize: 17, bold: true, color: DEEP,
    });
    bullets(s, it.lines, x + 0.3, 4.98, cw - 0.6, 1.0, { size: 11.5, gap: 5 });
  });

  card(s, M, 6.22, CW, 0.62, { fill: DEEP });
  s.addText(
    [
      { text: "Allied products   ", options: { fontFace: BODY, fontSize: 12, bold: true, charSpacing: 1.2, color: WHITE } },
      { text: "copra cake / de-oiled cake, a direct by-product of oil extraction.  Further lines:  ", options: { fontFace: BODY, fontSize: 12, color: MUTED_D } },
      { text: TBD, options: { fontFace: BODY, fontSize: 12, bold: true, italic: true, charSpacing: 1.2, color: GOLD_LT } },
    ],
    { x: M + 0.3, y: 6.22, w: CW - 0.6, h: 0.62, margin: 0, valign: "middle" }
  );

  footer(s, 3);
  s.addNotes(
    "Coconut oil is the ONLY finished product. The client has confirmed they do not sell " +
    "desiccated coconut - the earlier third card has been removed, and the pulverised " +
    "kernel seen in the film is feedstock for the expeller, not a product. Both cards are " +
    "the same oil off the same line, differing only in pack format. " +
    "The sulfur-free claim comes from the company's own film narration and is a genuine " +
    "differentiator: sulfur is routine in copra drying and importers screen for it. " +
    "DEFAULTS SUPPLIED BY CLAUDE: the FFA and moisture figures and the pack sizes are " +
    "standard industry values, not your measured specs. Sign them off before sending."
  );
}

// =========================================================== 4. PROCESS OVERVIEW
{
  const s = pres.addSlide();
  bg(s, DEEP);
  kicker(s, "HOW IT IS MADE", M, 0.62, GOLD_LT);
  title(s, "From whole nut to filtered oil", M, 0.96, { color: WHITE });

  const steps = [
    ["1", "Intake", "Nuts received and unloaded in our raw material yard"],
    ["2", "Automated cutting", "Conveyor cutting system halves every nut evenly"],
    ["3", "Trays and trolleys", "Halves arranged on drying trays and loaded"],
    ["4", "High-pressure wash", "Water spray removes dust and impurities"],
    ["5", "Infrared dehydration", "10 tonnes per 12 hours, moisture below 10%"],
    ["6", "Tray inspection", "Every tray checked by trained staff and supervisors"],
    ["7", "Scooping and pulverising", "Kernel lifted from shell, then reduced for pressing"],
    ["8", "Expelling and filtration", "Mechanical press, then advanced filtration"],
  ];

  const gap = 0.3;
  const cw = (CW - gap * 3) / 4; // 2.758
  const ch = 1.96;
  steps.forEach((st, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = M + col * (cw + gap);
    const y = 2.06 + row * (ch + 0.32);
    card(s, x, y, cw, ch, { fill: "1B6034", radius: 0.05 });
    badge(s, x + 0.26, y + 0.24, 0.5, st[0], { fontSize: 13 });
    s.addText(st[1], {
      x: x + 0.26, y: y + 0.86, w: cw - 0.52, h: 0.56, margin: 0, valign: "top",
      fontFace: HEAD, fontSize: 13, bold: true, color: WHITE,
    });
    s.addText(st[2], {
      x: x + 0.26, y: y + 1.42, w: cw - 0.52, h: 0.56, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 10.5, color: MUTED_D, lineSpacingMultiple: 1.14,
    });
  });

  s.addText(
    "No sulfur or any other chemical is used at any stage. The dehydration method itself " +
    "is what makes chemical-free processing possible.",
    {
      x: M, y: 6.44, w: CW, h: 0.34, margin: 0,
      fontFace: BODY, fontSize: 11, italic: true, color: GOLD_LT,
    }
  );

  footer(s, 4, { color: MUTED_D });
  s.addNotes(
    "Dark slide, used as the section break into the process detail that follows. " +
    "This sequence is taken from the company's own film narration and CORRECTS the earlier " +
    "version of this slide in three places: washing happens BEFORE dehydration (not after " +
    "paring); the post-drying step is scooping the kernel from the shell (not paring); and " +
    "no dehusking is narrated - nuts go straight into an automated cutting system that " +
    "halves them."
  );
}

// =========================================================== 5. SOURCING & INTAKE
{
  const s = pres.addSlide();
  bg(s, WHITE);

  // half-bleed image on the left
  photo(s, "intake.jpg", 0, 0, 6.06, H);

  const tx = 6.06 + 0.62;
  const tw = W - tx - M;

  kicker(s, "STEP 01", tx, 1.12);
  title(s, "Sourcing and intake", tx, 1.46, { w: tw, size: 30 });

  s.addText(
    "Nuts arrive at the plant by tipper and are offloaded directly onto our spacious " +
    "raw material yard by our own uniformed crew. From there they are fed into an " +
    "automated conveyor cutting system that halves every nut evenly, so the nut is " +
    "opened within the same site it was received on.",
    {
      x: tx, y: 2.44, w: tw, h: 1.5, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 13, color: INK, lineSpacingMultiple: 1.28,
    }
  );

  const facts = [
    ["Sourcing region", "Delta region, Tamil Nadu"],
    ["Procurement", "Direct from growers and regional mandis"],
    ["Intake per day", "100,000 nuts"],
    ["Nut variety", TBD],
  ];
  let fy = 4.12;
  facts.forEach(([l, v]) => { factRow(s, tx, fy, tw, l, v, { lw: 2.2 }); fy += 0.46; });

  // footer must clear the half-bleed photo on the left
  footer(s, 5, { x: tx });
  s.addNotes(
    "Confirmed by the client: delta region of Tamil Nadu, 100,000 nuts per day. " +
    "DEFAULT SUPPLIED BY CLAUDE: 'direct from growers and regional mandis' is the " +
    "conventional procurement description - correct it if you buy through agents or " +
    "on contract. Nut variety is still open; East Coast Tall is the usual delta variety " +
    "but I did not want to assert it."
  );
}

// =========================================================== 6. CONTROLLED DRYING
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "STEP 05  ·  OUR TECHNICAL DIFFERENTIATOR", M, 0.62);
  title(s, "Catalytic infrared dehydration", M, 0.96);

  photo(s, "hall.jpg", M, 1.98, 5.72, 2.38);
  caption(s, "The dehydration chamber block inside the main hall", M, 4.42, 5.72);

  photo(s, "hmi.jpg", M, 4.86, 5.72, 1.5);
  caption(s, "PLC touchscreen holding chamber temperature in any climate", M, 6.42, 5.72);

  const tx = M + 5.72 + 0.6;
  const tw = W - tx - M;

  s.addText(
    "Drying decides the quality of the finished oil, so it is the step we have engineered " +
    "hardest. Instead of sun drying we use a European catalytic infrared dehydrator - one " +
    "of the fastest and most efficient methods of coconut dehydration available.",
    {
      x: tx, y: 2.0, w: tw, h: 1.36, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 12.5, color: INK, lineSpacingMultiple: 1.26,
    }
  );

  card(s, tx, 3.46, tw, 2.24, { fill: TINT });
  s.addText("How the chamber works", {
    x: tx + 0.28, y: 3.64, w: tw - 0.56, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 1.4, color: DEEP,
  });
  bullets(
    s,
    [
      "Infrared-radiating metal infusors generate controlled heat waves",
      "Platinum metal-plated walls, ceiling and doors reflect heat from every direction",
      "A compressor draws atmospheric air through a dehumidification system",
      "Roughly 3,300 sq ft of drying area",
    ],
    tx + 0.28, 4.0, tw - 0.56, 1.62,
    { size: 11, gap: 4 }
  );

  // the comparison a buyer actually cares about
  card(s, tx, 5.86, tw, 0.82, { fill: DEEP });
  s.addText(
    [
      { text: "10 tonnes in 12 hours, to below 10% moisture", options: { fontFace: HEAD, fontSize: 13, bold: true, color: WHITE, breakLine: true } },
      { text: "Sun drying needs five days to reach only 20%", options: { fontFace: BODY, fontSize: 10.5, color: GOLD_LT } },
    ],
    { x: tx + 0.28, y: 5.86, w: tw - 0.56, h: 0.82, margin: 0, valign: "middle", lineSpacingMultiple: 1.14 }
  );

  footer(s, 6);
  s.addNotes(
    "This is the strongest slide in the deck and every figure on it comes from the " +
    "company's own film narration - European catalytic IR dehydrator, platinum-plated " +
    "chamber surfaces, IR-radiating infusors, compressor plus dehumidification, 10 tonnes " +
    "per 12 hours to below 10% moisture, five days by sun to reach only 20%, ~3,300 sq ft. " +
    "The earlier version of this slide called it merely 'controlled hot-air drying', which " +
    "badly undersold it. " +
    "TWO CLAIMS TO CONFIRM BEFORE SENDING: the film also states the plant is 'among India's " +
    "largest' coconut dehydration facilities and that output is ~100,000 litres per month. " +
    "I have left both off the slide - a superlative and a volume figure are exactly what a " +
    "buyer will test, so use them only if you can substantiate them."
  );
}

// =========================================================== 7. PARING & HYGIENE
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "STEPS 04 AND 06", M, 0.62);
  title(s, "Washing and inspection", M, 0.96);

  const gap = 0.42;
  const cw = (CW - gap) / 2; // 5.756

  photo(s, "wash.jpg", M, 1.98, cw, 2.5);
  caption(s, "High-pressure water spray wash, before dehydration", M, 4.56, cw);

  photo(s, "qc.jpg", M + cw + gap, 1.98, cw, 2.5);
  caption(s, "Every tray inspected by trained staff and supervisors", M + cw + gap, 4.56, cw);

  card(s, M, 5.04, cw, 1.72, { fill: TINT });
  s.addText("Personnel hygiene", {
    x: M + 0.28, y: 5.2, w: cw - 0.56, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 1.4, color: DEEP,
  });
  bullets(
    s,
    ["Hairnets, face masks and gloves on the line", "Company-issued uniforms throughout", "Food-contact surfaces in stainless steel"],
    M + 0.28, 5.56, cw - 0.56, 1.1, { size: 11.5, gap: 4 }
  );

  card(s, M + cw + gap, 5.04, cw, 1.72, { fill: TINT });
  s.addText("Plant and surfaces", {
    x: M + cw + gap + 0.28, y: 5.2, w: cw - 0.56, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 1.4, color: DEEP,
  });
  bullets(
    s,
    [
      "Enclosed drying rooms, not open-air yards",
      "Stainless trays and troughs at every wet stage",
      "Sealed washable floors and strip-curtain barriers",
    ],
    M + cw + gap + 0.28, 5.56, cw - 0.56, 1.1, { size: 11.5, gap: 4 }
  );

  footer(s, 7);
  s.addNotes(
    "Everything on this slide is directly observable in the footage. " +
    "The client has confirmed they hold NO HACCP and NO GMP/GHP certification, so the " +
    "earlier scheme-status form has been removed entirely rather than left implying " +
    "certification. Both cards now describe practice and plant only - no scheme is " +
    "claimed anywhere. If HACCP is obtained later this is the slide to update."
  );
}

// =========================================================== 8. TWO STREAMS
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "STEPS 07 AND 08", M, 0.62);
  title(s, "From dried kernel to filtered oil", M, 0.96);

  const gap = 0.42;
  const cw = (CW - gap) / 2;

  // Scooping and pulverising
  card(s, M, 1.98, cw, 4.62, { fill: TINT, shadow: { blur: 12, opacity: 0.08 } });
  photo(s, "shred.jpg", M, 1.98, cw, 2.02);
  badge(s, M + 0.3, 4.16, 0.54, "07", { fontSize: 12 });
  s.addText("Scooping and pulverising", {
    x: M + 0.98, y: 4.16, w: cw - 1.28, h: 0.54, margin: 0, valign: "middle",
    fontFace: HEAD, fontSize: 17, bold: true, color: DEEP,
  });
  s.addText(
    "Once dehydration is complete the kernel lifts cleanly away from the shell and is " +
    "scooped out, then pulverised into smaller pieces ready for pressing.",
    {
      x: M + 0.3, y: 4.86, w: cw - 0.6, h: 1.0, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 12, color: INK, lineSpacingMultiple: 1.24,
    }
  );
  factRow(s, M + 0.3, 5.92, cw - 0.6, "Moisture at scooping", "below 10%", { lw: 2.1 });
  factRow(s, M + 0.3, 6.28, cw - 0.6, "Batch size", "10 tonnes per 12 h", { lw: 2.1 });

  // Expelling and filtration
  const ox = M + cw + gap;
  card(s, ox, 1.98, cw, 4.62, { fill: TINT, shadow: { blur: 12, opacity: 0.08 } });
  photo(s, "oil.jpg", ox, 1.98, cw, 2.02);
  badge(s, ox + 0.3, 4.16, 0.54, "08", { fontSize: 12 });
  s.addText("Expelling and filtration", {
    x: ox + 0.98, y: 4.16, w: cw - 1.28, h: 0.54, margin: 0, valign: "middle",
    fontFace: HEAD, fontSize: 17, bold: true, color: DEEP,
  });
  s.addText(
    "The pulverised kernel is fed into an expeller and pressed mechanically. The " +
    "extracted oil then passes through advanced filtration to finished grade.",
    {
      x: ox + 0.3, y: 4.86, w: cw - 0.6, h: 1.0, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 12, color: INK, lineSpacingMultiple: 1.24,
    }
  );
  factRow(s, ox + 0.3, 5.92, cw - 0.6, "FFA at despatch", "below 0.5%", { lw: 2.1 });
  factRow(s, ox + 0.3, 6.28, cw - 0.6, "Chemical use", "None - sulfur-free", { lw: 2.1 });

  footer(s, 8);
  s.addNotes(
    "Rewritten from the film narration. The earlier version of this slide presented " +
    "desiccated coconut as a second finished stream - the client has confirmed they do not " +
    "sell it, and the narration is explicit that the pulverised kernel is prepared 'for oil " +
    "extraction'. So this is now one linear finishing line, not two streams. " +
    "DEFAULT SUPPLIED BY CLAUDE: the FFA below 0.5% figure is a standard trade value."
  );
}

// =========================================================== 9. QUALITY
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "QUALITY ASSURANCE", M, 0.62);
  title(s, "Tested, not assumed", M, 0.96);

  const lw = 5.5;
  s.addText(
    "Quality is managed under an ISO 9001 system, the plant is FSSAI licensed, and " +
    "testing is backed by NABL accreditation - the Indian national standard for " +
    "laboratory competence. Every manufacturing batch is tested by our quality assurance " +
    "team in our own in-house laboratory before it reaches a customer.",
    {
      x: M, y: 2.0, w: lw, h: 1.72, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 13, color: INK, lineSpacingMultiple: 1.26,
    }
  );

  const marks = [
    ["ISO 9001", "Quality management system"],
    ["FSSAI", "Indian food safety licence"],
    ["NABL", "Accredited laboratory testing"],
  ];
  let my = 3.66;
  marks.forEach(([n, d], i) => {
    card(s, M, my, lw, 0.82, { fill: TINT });
    badge(s, M + 0.24, my + 0.17, 0.48, String(i + 1), { fontSize: 12 });
    s.addText(n, {
      x: M + 0.9, y: my + 0.1, w: lw - 1.15, h: 0.34, margin: 0, valign: "middle",
      fontFace: HEAD, fontSize: 14, bold: true, color: DEEP,
    });
    s.addText(d, {
      x: M + 0.9, y: my + 0.42, w: lw - 1.15, h: 0.3, margin: 0, valign: "middle",
      fontFace: BODY, fontSize: 10.5, color: MUTED,
    });
    my += 0.94;
  });

  const tx = M + lw + 0.62;
  const tw = W - tx - M;
  s.addText("Release specification per batch", {
    x: tx, y: 2.0, w: tw, h: 0.32, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 1.4, color: DEEP,
  });

  const rows = [
    [{ text: "Parameter", options: { bold: true } }, { text: "Method", options: { bold: true } }, { text: "Limit", options: { bold: true } }],
    ["Moisture", "IS 548", "0.10% max"],
    ["Free fatty acid", "AOCS Ca 5a-40", "0.5% max"],
    ["Peroxide value", "AOCS Cd 8-53", "10 meq/kg max"],
    ["Total plate count", "ISO 4833", "10,000 cfu/g"],
    ["Yeast and mould", "ISO 21527", "100 cfu/g max"],
    ["Foreign matter", "Visual", "Absent"],
  ];
  s.addTable(rows, {
    x: tx, y: 2.42, w: tw,
    colW: [tw * 0.37, tw * 0.32, tw * 0.31],
    rowH: 0.42,
    border: { type: "solid", pt: 0.75, color: "DDE5DB" },
    fill: { color: WHITE },
    fontFace: BODY, fontSize: 11, color: INK, valign: "middle",
    margin: [0, 0.12, 0, 0.12],
  });

  s.addText(
    "Limits shown are for edible-grade coconut oil, tested per batch in our in-house " +
    "laboratory before release.",
    {
      x: tx, y: 5.68, w: tw, h: 0.8, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 11, italic: true, color: MUTED, lineSpacingMultiple: 1.2,
    }
  );

  footer(s, 9);
  s.addNotes(
    "ISO 9001, FSSAI and NABL are confirmed from the video's closing card. " +
    "DEFAULTS SUPPLIED BY CLAUDE: every method and limit in this table is a standard " +
    "industry value for edible coconut oil (IS 548, AOCS, ISO methods are real and " +
    "correctly cited). They are NOT your measured results. Replace them with the figures " +
    "off your own NABL COA before this table goes to a buyer - an importer will hold you " +
    "to whatever is printed here."
  );
}

// =========================================================== 10. CERTIFICATIONS
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "ACCREDITATIONS", M, 0.62);
  title(s, "Certifications on file", M, 0.96);

  // the source card is white-ground artwork - give it a white plate, contained
  card(s, M, 2.0, 6.0, 2.5, { fill: WHITE, radius: 0.05, shadow: { blur: 14, opacity: 0.12 } });
  s.addImage({
    path: im("certs.jpg"), x: M + 0.15, y: 2.15, w: 5.7, h: 2.2,
    sizing: { type: "contain", w: 5.7, h: 2.2 },
  });
  caption(s, "Certification marks as presented in the company profile film", M, 4.62, 6.0);

  const tx = M + 6.0 + 0.62;
  const tw = W - tx - M;

  const certs = [
    ["ISO 9001", "Quality management system"],
    ["FSSAI", "Food licence, Government of India"],
    ["NABL", "Laboratory accreditation"],
    ["BRIT QUALIS", "Two certificates held"],
    ["National Test House", "Government test certificate"],
  ];
  let cy = 1.98;
  certs.forEach(([n, d]) => {
    s.addText(n, {
      x: tx, y: cy, w: tw, h: 0.28, margin: 0,
      fontFace: HEAD, fontSize: 13.5, bold: true, color: DEEP,
    });
    s.addText(d, {
      x: tx, y: cy + 0.27, w: tw, h: 0.26, margin: 0,
      fontFace: BODY, fontSize: 10.5, color: MUTED,
    });
    cy += 0.62;
  });

  card(s, M, 5.34, CW, 1.24, { fill: TINT });
  s.addText("Still needed for an export pack", {
    x: M + 0.3, y: 5.48, w: CW - 0.6, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, charSpacing: 1.4, color: DEEP,
  });
  s.addText(
    "Certificate numbers and validity dates for each mark above  ·  organic / Fairtrade " +
    "status if held  ·  importing-country registrations (US FDA, EU, GCC) as applicable.",
    {
      x: M + 0.3, y: 5.84, w: CW - 0.6, h: 0.6, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 11.5, color: INK, lineSpacingMultiple: 1.2,
    }
  );

  footer(s, 10);
  s.addNotes(
    "ISO 9001, FSSAI and NABL are from the closing card. BRIT QUALIS and National Test " +
    "House are read off the framed certificates behind the founder - wall text was only " +
    "partly legible, so verify both names before printing."
  );
}

// =========================================================== 11. EXPORT TERMS
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "COMMERCIAL", M, 0.62);
  title(s, "Packaging, logistics and terms", M, 0.96);

  s.addText(
    "Standard terms below. All are negotiable against confirmed volume and destination.",
    {
      x: M, y: 1.84, w: 8.2, h: 0.46, margin: 0,
      fontFace: BODY, fontSize: 12, italic: true, color: MUTED, lineSpacingMultiple: 1.2,
    }
  );

  const tw = 8.2;
  const rows = [
    [{ text: "Item", options: { bold: true } }, { text: "Detail", options: { bold: true } }],
    ["Retail pack sizes", "200 ml · 500 ml · 1 L PET · 5 L jerrycan"],
    ["Bulk pack format", "15 kg tin · 200 kg HDPE drum · flexitank"],
    ["Minimum order quantity", "One 20ft FCL"],
    ["Units per 20ft / 40ft container", "16-18 MT / 24-26 MT"],
    ["Port of loading", "Chennai / Ennore, Tamil Nadu"],
    ["Lead time from order", "15-21 days from confirmed order"],
    ["Incoterms offered", "FOB · CFR · CIF"],
    ["Payment terms", "30% advance, balance vs B/L; or L/C at sight"],
    ["Private label / OEM", "Available"],
    ["Shelf life", "18 months in original sealed pack"],
  ];
  s.addTable(rows, {
    x: M, y: 2.42, w: tw,
    colW: [tw * 0.44, tw * 0.56],
    rowH: 0.40,
    border: { type: "solid", pt: 0.75, color: "DDE5DB" },
    fill: { color: WHITE },
    fontFace: BODY, fontSize: 11, color: INK, valign: "middle",
    margin: [0, 0.12, 0, 0.12],
  });

  const rx = M + tw + 0.6;
  const rw = W - rx - M;
  photo(s, "machine2.jpg", rx, 2.42, rw, 2.1);
  caption(s, "Handling between drying and finishing", rx, 4.6, rw);

  card(s, rx, 5.04, rw, 1.54, { fill: DEEP });
  s.addText("Flexible on structure", {
    x: rx + 0.26, y: 5.2, w: rw - 0.52, h: 0.3, margin: 0,
    fontFace: BODY, fontSize: 10.5, bold: true, charSpacing: 1.3, color: GOLD_LT,
  });
  s.addText(
    "Tell us your volume, pack format and destination port and we will quote FOB or " +
    "CIF against it.",
    {
      x: rx + 0.26, y: 5.54, w: rw - 0.52, h: 0.9, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 10.5, color: WHITE, lineSpacingMultiple: 1.2,
    }
  );

  footer(s, 11);
  s.addNotes(
    "DEFAULTS SUPPLIED BY CLAUDE - every row on this page. These are conventional Indian " +
    "coconut-export terms, not terms you have agreed to. The commercially sensitive ones " +
    "are MOQ (one 20ft FCL), payment terms (30% advance / L/C at sight) and container " +
    "fill (16-18 MT per 20ft). A buyer may treat these as an offer, so review each line " +
    "with whoever owns pricing before sending. Port of loading assumes Chennai/Ennore as " +
    "nearest to Chengalpattu."
  );
}

// =========================================================== 12. LEADERSHIP
{
  const s = pres.addSlide();
  bg(s, WHITE);
  kicker(s, "LEADERSHIP", M, 0.62);
  title(s, "The people behind the plant", M, 0.96);

  photo(s, "founder.jpg", M, 1.98, 5.9, 3.14);
  caption(s, "Speaking to camera at the plant office", M, 5.2, 5.9);

  photo(s, "team.jpg", M, 5.64, 5.9, 1.16);
  caption(s, "Review meeting with the plant team", M, 6.86, 5.9);

  const tx = M + 5.9 + 0.62;
  const tw = W - tx - M;

  card(s, tx, 1.98, tw, 2.36, { fill: TINT });
  s.addText("“" + TBD + "”", {
    x: tx + 0.3, y: 2.2, w: tw - 0.6, h: 0.9, margin: 0, valign: "top",
    fontFace: HEAD, fontSize: 19, italic: true, color: DEEP, lineSpacingMultiple: 1.2,
  });
  s.addText(
    "A two-line statement on standards, and on why the plant was built the way it was.",
    {
      x: tx + 0.3, y: 3.32, w: tw - 0.6, h: 0.76, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 10.5, italic: true, color: MUTED, lineSpacingMultiple: 1.18,
    }
  );

  let fy = 4.66;
  [["Name", TBD], ["Title", TBD], ["Years in coconut processing", TBD]].forEach(([l, v]) => {
    factRow(s, tx, fy, tw, l, v, { lw: 2.6 });
    fy += 0.5;
  });

  footer(s, 12, { x: tx });
  s.addNotes(
    "The founder speaks to camera from 3:36 to 4:36 in the video. If you transcribe " +
    "that segment, his own words are the best possible fill for the quote slot here."
  );
}

// =========================================================== 13. NEXT STEPS
{
  const s = pres.addSlide();
  bg(s, DEEP);

  kicker(s, "NEXT STEPS", M, 1.24, GOLD_LT);
  s.addText("Let's talk specification", {
    x: M, y: 1.6, w: 7.4, h: 0.86, margin: 0,
    fontFace: HEAD, fontSize: 34, bold: true, color: WHITE,
  });

  s.addText(
    "Send us your incoming specification and target volume, and we will come back " +
    "with a costed offer, a sample plan and a certificate pack.",
    {
      x: M, y: 2.56, w: 7.0, h: 0.96, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 13.5, color: MUTED_D, lineSpacingMultiple: 1.28,
    }
  );

  const steps = [
    ["1", "Share your specification", "Grade, pack format and annual volume"],
    ["2", "Sample and approval", "We ship samples against your spec"],
    ["3", "Trial order", "First container on agreed Incoterms"],
  ];
  let sy = 3.78;
  steps.forEach(([n, t, d]) => {
    badge(s, M, sy, 0.5, n, { fontSize: 13 });
    s.addText(t, {
      x: M + 0.72, y: sy - 0.02, w: 6.2, h: 0.32, margin: 0, valign: "middle",
      fontFace: HEAD, fontSize: 14.5, bold: true, color: WHITE,
    });
    s.addText(d, {
      x: M + 0.72, y: sy + 0.28, w: 6.2, h: 0.28, margin: 0, valign: "middle",
      fontFace: BODY, fontSize: 11, color: MUTED_D,
    });
    sy += 0.86;
  });

  // contact block on a white plate, logo above
  const cx = 8.5;
  const cwd = W - cx - M; // 4.133
  card(s, cx, 0.92, cwd, 5.72, { fill: WHITE, radius: 0.05, shadow: { blur: 20, opacity: 0.22 } });
  s.addImage({
    path: im("logo.jpg"), x: cx + 0.62, y: 1.16, w: 2.9, h: 2.02,
    sizing: { type: "contain", w: 2.9, h: 2.02 },
  });

  // label above value, one pair per row - needs real vertical air or it reads as a run-on list
  let ky = 3.42;
  const contact = [
    ["Contact", "Mr. Barani", false],
    ["Designation", "Operations Head", false],
    ["Telephone", "+91 95661 62825", false],
    ["Email", "info@blackboxtraders.in", false],
    ["Website", "www.blackboxtraders.in", false],
    ["Plant address", "177 Marakanam Road, Maduranthagam,\nNethapakkam, Chengalpattu,\nTamil Nadu 603301", false],
  ];
  contact.forEach(([l, v, isTbd]) => {
    s.addText(l, {
      x: cx + 0.34, y: ky, w: cwd - 0.68, h: 0.2, margin: 0,
      fontFace: BODY, fontSize: 8.5, bold: true, charSpacing: 1.1, color: MUTED,
    });
    const lines = String(v).split("\n").length;
    s.addText(v, {
      x: cx + 0.34, y: ky + 0.2, w: cwd - 0.68, h: 0.24 * lines, margin: 0, valign: "top",
      fontFace: BODY, fontSize: isTbd ? 11 : 10.5,
      bold: true, italic: !!isTbd, charSpacing: isTbd ? 1 : 0,
      color: isTbd ? GOLD : INK, lineSpacingMultiple: 1.05,
    });
    ky += 0.42 + 0.2 * (lines - 1);
  });

  footer(s, 13, { color: MUTED_D });
  s.addNotes(
    "Confirmed by the client: Mr. Barani, Operations Head, +91 95661 62825, and the " +
    "Nethapakkam plant address. Email and website are the only two contact fields still " +
    "outstanding - a buyer will want an email address, so this is worth closing before " +
    "the first send."
  );
}

const out = path.join(__dirname, "Coco-Palms-Export-Profile.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("written:", out));

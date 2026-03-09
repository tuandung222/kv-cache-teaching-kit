"use strict";

const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");
const { safeOuterShadow } = require("./pptxgenjs_helpers/util");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "OpenAI";
pptx.subject = "KV Cache research seminar";
pptx.title = "KV Cache for Research Scientists";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "PT Sans",
  bodyFontFace: "PT Sans",
  lang: "en-US",
};

const OUT_DIR = path.join(__dirname, "output");
const OUT_FILE = path.join(OUT_DIR, "kv-cache-research-seminar.pptx");
const SW = 13.333;
const SH = 7.5;

const C = {
  bg: "F6F1E8",
  surface: "FFFDF9",
  ink: "14212B",
  muted: "5C6975",
  accent: "CC6B3D",
  teal: "2D7C88",
  gold: "B78A2C",
  sand: "E9D7BE",
  paleTeal: "DCECEF",
  paleAccent: "F4E2D9",
  paleGold: "F3E8C5",
  line: "D7C8B3",
  white: "FFFFFF",
};

function addFullBleed(slide) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SW,
    h: SH,
    line: { color: C.bg, transparency: 100 },
    fill: { color: C.bg },
  });
}

function addTopBand(slide, kicker, page) {
  slide.addText(kicker, {
    x: 0.6,
    y: 0.35,
    w: 3.3,
    h: 0.3,
    fontFace: "PT Sans Narrow",
    fontSize: 11,
    bold: true,
    color: C.accent,
    charSpace: 0.4,
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 4.0,
    y: 0.51,
    w: 8.2,
    h: 0,
    line: { color: C.line, width: 1.2 },
  });
  slide.addText(String(page).padStart(2, "0"), {
    x: 12.35,
    y: 0.29,
    w: 0.45,
    h: 0.3,
    fontFace: "PT Sans Narrow",
    fontSize: 11,
    bold: true,
    align: "right",
    color: C.muted,
  });
}

function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.7,
    y: 0.92,
    w: 7.6,
    h: 0.62,
    fontFace: "PT Sans",
    fontSize: 26,
    bold: true,
    color: C.ink,
    valign: "mid",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.75,
      y: 1.62,
      w: 7.1,
      h: 0.34,
      fontFace: "PT Sans",
      fontSize: 14,
      color: C.muted,
      breakLine: false,
      valign: "mid",
    });
  }
}

function addCard(slide, opts) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    rectRadius: 0.08,
    line: { color: opts.lineColor || C.line, width: 1.1 },
    fill: { color: opts.fill || C.surface },
    shadow: safeOuterShadow("A1855E", 0.12, 45, 1.5, 1),
  });
  if (opts.eyebrow) {
    slide.addText(opts.eyebrow, {
      x: opts.x + 0.18,
      y: opts.y + 0.16,
      w: opts.w - 0.36,
      h: 0.22,
      fontFace: "PT Sans Narrow",
      fontSize: 9.5,
      bold: true,
      color: opts.eyebrowColor || C.accent,
    });
  }
  if (opts.title) {
    slide.addText(opts.title, {
      x: opts.x + 0.18,
      y: opts.y + 0.4,
      w: opts.w - 0.36,
      h: 0.42,
      fontFace: "PT Sans",
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
  }
  if (opts.body) {
    slide.addText(opts.body, {
      x: opts.x + 0.18,
      y: opts.y + (opts.title ? 0.88 : 0.3),
      w: opts.w - 0.36,
      h: opts.h - (opts.title ? 1.05 : 0.45),
      fontFace: "PT Sans",
      fontSize: opts.bodySize || 11.5,
      color: C.muted,
      valign: "top",
      breakLine: false,
      margin: 0,
    });
  }
}

function addBulletList(slide, items, x, y, w, h, color = C.ink, fontSize = 16) {
  const runs = [];
  items.forEach((item, index) => {
    runs.push({
      text: item,
      options: { bullet: { indent: 12 }, breakLine: index !== items.length - 1 },
    });
  });
  slide.addText(runs, {
    x,
    y,
    w,
    h,
    fontFace: "PT Sans",
    fontSize,
    color,
    breakLine: false,
    valign: "top",
    paraSpaceAfterPt: 8,
    margin: 0,
  });
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.7,
    y: 7.02,
    w: 12.0,
    h: 0.22,
    fontFace: "PT Sans Narrow",
    fontSize: 9.5,
    color: C.muted,
    italic: true,
  });
}

function finalizeSlide(slide) {
  warnIfSlideHasOverlaps(slide, pptx, { muteContainment: true });
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function buildSlides() {
  let slide;

  slide = pptx.addSlide();
  addFullBleed(slide);
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.95,
    y: 0,
    w: 4.383,
    h: SH,
    line: { color: C.bg, transparency: 100 },
    fill: { color: C.paleTeal },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 9.35,
    y: 0.55,
    w: 3.2,
    h: 6.35,
    line: { color: C.teal, transparency: 100 },
    fill: { color: C.teal, transparency: 8 },
  });
  slide.addText("KV Cache", {
    x: 0.72,
    y: 1.0,
    w: 5.8,
    h: 0.68,
    fontFace: "PT Sans",
    fontSize: 30,
    bold: true,
    color: C.ink,
  });
  slide.addText("For Research Scientists", {
    x: 0.72,
    y: 1.76,
    w: 6.8,
    h: 0.34,
    fontFace: "PT Sans Narrow",
    fontSize: 20,
    color: C.accent,
    bold: true,
  });
  slide.addText(
    "A 60-minute seminar on the compute-memory trade-off behind autoregressive inference, long-context serving, and architecture choices such as GQA.",
    {
      x: 0.78,
      y: 2.55,
      w: 6.6,
      h: 1.15,
      fontFace: "PT Sans",
      fontSize: 15,
      color: C.muted,
      valign: "mid",
      margin: 0,
    }
  );
  addCard(slide, {
    x: 0.78,
    y: 4.25,
    w: 2.3,
    h: 1.48,
    fill: C.surface,
    eyebrow: "Question 1",
    title: "Why cache?",
    body: "Name the exact recomputation term removed during decode.",
    bodySize: 11,
  });
  addCard(slide, {
    x: 3.28,
    y: 4.25,
    w: 2.3,
    h: 1.48,
    fill: C.surface,
    eyebrow: "Question 2",
    title: "What grows?",
    body: "Explain why memory and bandwidth pressure rise as context grows.",
    bodySize: 11,
  });
  addCard(slide, {
    x: 5.78,
    y: 4.25,
    w: 2.3,
    h: 1.48,
    fill: C.surface,
    eyebrow: "Question 3",
    title: "Why GQA?",
    body: "Connect head sharing directly to the serviceable KV footprint.",
    bodySize: 11,
  });
  slide.addText("Frame the lecture around workload shape, not slogans.", {
    x: 9.7,
    y: 1.0,
    w: 2.5,
    h: 0.5,
    fontFace: "PT Sans",
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
  });
  slide.addText("Prefill", {
    x: 9.75,
    y: 2.05,
    w: 2.25,
    h: 0.3,
    fontFace: "PT Sans Narrow",
    fontSize: 15,
    bold: true,
    color: C.paleGold,
    align: "center",
  });
  slide.addText("parallel prompt processing", {
    x: 9.55,
    y: 2.35,
    w: 2.65,
    h: 0.3,
    fontFace: "PT Sans",
    fontSize: 11,
    color: C.white,
    align: "center",
  });
  slide.addText("Decode", {
    x: 9.75,
    y: 3.55,
    w: 2.25,
    h: 0.3,
    fontFace: "PT Sans Narrow",
    fontSize: 15,
    bold: true,
    color: C.paleGold,
    align: "center",
  });
  slide.addText("one token, growing memory reads", {
    x: 9.45,
    y: 3.85,
    w: 2.85,
    h: 0.34,
    fontFace: "PT Sans",
    fontSize: 11,
    color: C.white,
    align: "center",
  });
  slide.addText("Serving", {
    x: 9.75,
    y: 5.05,
    w: 2.25,
    h: 0.3,
    fontFace: "PT Sans Narrow",
    fontSize: 15,
    bold: true,
    color: C.paleGold,
    align: "center",
  });
  slide.addText("bandwidth, fragmentation, batching", {
    x: 9.35,
    y: 5.35,
    w: 3.05,
    h: 0.34,
    fontFace: "PT Sans",
    fontSize: 11,
    color: C.white,
    align: "center",
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "LEARNING OBJECTIVES", 2);
  addTitle(slide, "What the audience should be able to do", "");
  addBulletList(
    slide,
    [
      "State precisely what is cached at each layer and why Q is not reused across decode steps.",
      "Separate prefill from decode in terms of workload shape, metric, and bottleneck.",
      "Estimate KV footprint for a concrete model and explain why H_kv matters.",
      "Relate MHA, GQA, and MQA to serviceable context length and batch capacity.",
      "Evaluate when long-context inference becomes a memory-management problem."
    ],
    0.82,
    1.9,
    6.25,
    3.8,
    C.ink,
    15
  );
  addCard(slide, {
    x: 7.68,
    y: 1.55,
    w: 4.8,
    h: 4.95,
    fill: C.surface,
    eyebrow: "60-minute path",
    title: "Agenda",
    body:
      "0-5 min   Framing\n5-12 min  Why KV Cache exists\n12-20 min Prefill vs decode\n20-30 min Footprint and scaling law\n30-40 min Serving bottlenecks\n40-50 min MHA, GQA, MQA and optimizations\n50-57 min Misconceptions and open questions\n57-60 min Discussion",
    bodySize: 13,
  });
  addFooter(slide, "Aim for research-level clarity: intuition, formula, systems consequence.");
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "WORKLOAD SHAPE", 3);
  addTitle(slide, "Prefill and decode are different workloads", "Treating them as the same is the first conceptual mistake.");
  addCard(slide, {
    x: 0.8,
    y: 2.05,
    w: 5.75,
    h: 3.9,
    fill: C.paleGold,
    lineColor: C.gold,
    eyebrow: "Prefill",
    title: "Parallel prompt processing",
    body:
      "Input: a prompt of length T.\nCompute all prompt positions under a causal mask.\nPopulate the KV Cache for every layer.\nDominant concerns: matrix compute, prompt latency, TTFT.",
    bodySize: 14,
  });
  addCard(slide, {
    x: 6.75,
    y: 2.05,
    w: 5.75,
    h: 3.9,
    fill: C.paleTeal,
    lineColor: C.teal,
    eyebrow: "Decode",
    title: "One new token, many old reads",
    body:
      "Input: one token per step.\nAppend new K and V for the current position.\nAttend against all cached past positions.\nDominant concerns: memory bandwidth, cache layout, ITL, batching.",
    bodySize: 14,
  });
  slide.addText("If FLOPs/token drop in decode, why can latency still stay poor?", {
    x: 1.2,
    y: 6.3,
    w: 11.0,
    h: 0.45,
    fontFace: "PT Sans",
    fontSize: 17,
    bold: true,
    align: "center",
    color: C.accent,
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "WHY CACHE EXISTS", 4);
  addTitle(slide, "What exactly becomes reusable?", "");
  addCard(slide, {
    x: 0.82,
    y: 1.75,
    w: 5.82,
    h: 4.3,
    fill: C.surface,
    eyebrow: "Without cache",
    title: "Decode step t repeats old work",
    body:
      "For each layer, step t reprojects prior hidden states into K and V again.\nThe same old tokens are revisited every step.\nThis is redundant projection work, not new information.",
    bodySize: 14,
  });
  addCard(slide, {
    x: 6.72,
    y: 1.75,
    w: 5.82,
    h: 4.3,
    fill: C.surface,
    eyebrow: "With cache",
    title: "Reuse old K and V, compute only the new row",
    body:
      "Store K_l and V_l for past tokens once.\nAt the next step, compute Q_t, K_t, V_t.\nAppend the new K_t and V_t.\nRead the cache to attend over history.",
    bodySize: 14,
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 6.15,
    y: 2.5,
    w: 0.25,
    h: 0,
    line: { color: C.accent, width: 2 },
  });
  slide.addText("Past K/V stay valid because the prefix is fixed.", {
    x: 3.3,
    y: 6.32,
    w: 6.7,
    h: 0.24,
    fontFace: "PT Sans",
    fontSize: 16,
    bold: true,
    align: "center",
    color: C.teal,
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "TENSOR VIEW", 5);
  addTitle(slide, "KV Cache is a layer-wise memory structure", "");
  addCard(slide, {
    x: 0.82,
    y: 1.8,
    w: 6.0,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Formalization",
    title: "Per layer l",
    body:
      "Cached tensors:\nK_l in R^{T x H_kv x d}\nV_l in R^{T x H_kv x d}\n\nAt decode step T+1:\ncompute Q_{T+1}, K_{T+1}, V_{T+1}\nappend K_{T+1}, V_{T+1}\nattend with Q_{T+1} over cached K_l, V_l",
    bodySize: 14,
  });
  addCard(slide, {
    x: 7.0,
    y: 1.8,
    w: 5.55,
    h: 4.9,
    fill: C.paleAccent,
    lineColor: C.accent,
    eyebrow: "Implication",
    title: "Queries are step-local",
    body:
      "Q changes because the current token representation changes.\nK and V for past positions remain reusable under standard autoregressive inference.\nThe cache grows with sequence length and active request count.",
    bodySize: 14,
  });
  addFooter(slide, "The right mental model is append-only state plus repeated reads, not generic memoization.");
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "COST MODEL", 6);
  addTitle(slide, "KV Cache lowers recomputation, not all sequence dependence", "");
  addCard(slide, {
    x: 0.85,
    y: 1.8,
    w: 4.0,
    h: 4.35,
    fill: C.surface,
    eyebrow: "No cache",
    title: "Repeated projections grow",
    body:
      "Each decode step revisits old tokens and recomputes their K/V projections.\nWork grows badly across the generated sequence.",
    bodySize: 14,
  });
  addCard(slide, {
    x: 4.95,
    y: 1.8,
    w: 4.0,
    h: 4.35,
    fill: C.surface,
    eyebrow: "With cache",
    title: "Projection work becomes local",
    body:
      "Only the new token contributes fresh K/V projections.\nBut the new query still reads a growing cached history.",
    bodySize: 14,
  });
  addCard(slide, {
    x: 9.05,
    y: 1.8,
    w: 3.45,
    h: 4.35,
    fill: C.paleTeal,
    lineColor: C.teal,
    eyebrow: "Takeaway",
    title: "Do not say O(1)",
    body:
      "KV Cache removes a specific recomputation term.\nDecode still depends on active context through cache reads and attention against history.",
    bodySize: 14,
  });
  slide.addText("The bottleneck often moves from FLOPs to bytes moved.", {
    x: 2.15,
    y: 6.35,
    w: 9.0,
    h: 0.26,
    fontFace: "PT Sans",
    fontSize: 17,
    bold: true,
    align: "center",
    color: C.accent,
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "MEMORY FOOTPRINT", 7);
  addTitle(slide, "A first-order memory estimate", "");
  addCard(slide, {
    x: 0.82,
    y: 1.82,
    w: 6.1,
    h: 4.8,
    fill: C.surface,
    eyebrow: "Approximate formula",
    title: "memory ~= B x L x T x H_kv x d x 2 x bytes",
    body:
      "B = active sequences\nL = layers\nT = cached length\nH_kv = KV heads\nd = head dimension\n2 = keys plus values\nbytes = element size",
    bodySize: 15,
  });
  addCard(slide, {
    x: 7.1,
    y: 1.82,
    w: 5.45,
    h: 4.8,
    fill: C.paleGold,
    lineColor: C.gold,
    eyebrow: "Worked example",
    title: "32 layers, T = 32k, H_kv = 8, d = 128, FP16",
    body:
      "1 x 32 x 32768 x 8 x 128 x 2 x 2 bytes\n= 4,294,967,296 bytes\n≈ 4 GiB for one sequence\nIf H_kv = 32 instead, footprint rises to ≈ 16 GiB.",
    bodySize: 14,
  });
  addFooter(slide, "This is why GQA is a serving decision, not only an architecture detail.");
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "METRICS", 8);
  addTitle(slide, "What you measure depends on the phase", "");
  addCard(slide, {
    x: 0.85,
    y: 1.85,
    w: 3.0,
    h: 2.0,
    fill: C.paleAccent,
    lineColor: C.accent,
    eyebrow: "Prefill",
    title: "TTFT",
    body: "Time to first token. Sensitive to prompt length, prefill batching, and prompt-side compute.",
    bodySize: 13,
  });
  addCard(slide, {
    x: 4.05,
    y: 1.85,
    w: 3.0,
    h: 2.0,
    fill: C.paleTeal,
    lineColor: C.teal,
    eyebrow: "Decode",
    title: "ITL",
    body: "Inter-token latency. Sensitive to cache reads, scheduler efficiency, and memory traffic.",
    bodySize: 13,
  });
  addCard(slide, {
    x: 7.25,
    y: 1.85,
    w: 2.45,
    h: 2.0,
    fill: C.surface,
    eyebrow: "Throughput",
    title: "tokens/s",
    body: "Useful only with workload context and batching assumptions.",
    bodySize: 13,
  });
  addCard(slide, {
    x: 9.95,
    y: 1.85,
    w: 2.55,
    h: 2.0,
    fill: C.surface,
    eyebrow: "Memory",
    title: "KV bytes",
    body: "Peak footprint, fragmentation, and bandwidth pressure matter.",
    bodySize: 13,
  });
  addCard(slide, {
    x: 0.85,
    y: 4.15,
    w: 11.65,
    h: 2.2,
    fill: C.surface,
    eyebrow: "Reporting discipline",
    title: "Never report a serving speedup without the workload regime",
    body:
      "At minimum specify prompt length distribution, output length distribution, batch policy, active context, architecture variant, dtype or quantization, and hardware. Otherwise tokens/sec numbers are not comparable.",
    bodySize: 14,
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "ARCHITECTURE AND SERVING", 9);
  addTitle(slide, "MHA, GQA, and MQA change the cache budget", "");
  addCard(slide, {
    x: 0.8,
    y: 1.9,
    w: 3.85,
    h: 4.8,
    fill: C.surface,
    eyebrow: "MHA",
    title: "Full KV heads",
    body:
      "Each attention head has its own K and V.\nHighest KV footprint.\nOperationally expensive at long context.",
    bodySize: 14,
  });
  addCard(slide, {
    x: 4.75,
    y: 1.9,
    w: 3.85,
    h: 4.8,
    fill: C.paleGold,
    lineColor: C.gold,
    eyebrow: "GQA",
    title: "Grouped KV heads",
    body:
      "Multiple query heads share each KV head group.\nOften the best trade-off for modern LLM serving.\nSubstantially cuts H_kv.",
    bodySize: 14,
  });
  addCard(slide, {
    x: 8.7,
    y: 1.9,
    w: 3.85,
    h: 4.8,
    fill: C.paleTeal,
    lineColor: C.teal,
    eyebrow: "MQA",
    title: "Single shared KV head",
    body:
      "Minimal KV footprint.\nStrong serving advantage.\nQuality trade-offs depend on the model and training recipe.",
    bodySize: 14,
  });
  addFooter(slide, "If VRAM is fixed and target context rises, inspect H_kv early.");
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "SYSTEMS VIEW", 10);
  addTitle(slide, "Where serving systems struggle", "");
  addCard(slide, {
    x: 0.8,
    y: 1.85,
    w: 2.8,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Bandwidth",
    title: "Growing reads",
    body: "Decode can become limited by moving K/V through memory, not by raw compute availability.",
    bodySize: 13.5,
  });
  addCard(slide, {
    x: 3.8,
    y: 1.85,
    w: 2.8,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Fragmentation",
    title: "Allocation churn",
    body: "Naive contiguous growth wastes space or forces expensive movement as many requests evolve.",
    bodySize: 13.5,
  });
  addCard(slide, {
    x: 6.8,
    y: 1.85,
    w: 2.8,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Continuous batching",
    title: "Uneven sequences",
    body: "Requests at different stages interact, so scheduler choices shape cache locality and utilization.",
    bodySize: 13.5,
  });
  addCard(slide, {
    x: 9.8,
    y: 1.85,
    w: 2.8,
    h: 4.9,
    fill: C.paleTeal,
    lineColor: C.teal,
    eyebrow: "Cross-request reuse",
    title: "Prefix caching",
    body: "Shared prompts allow reuse of prefill work across requests when routing and cache policy align.",
    bodySize: 13.5,
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "OPTIMIZATION LANDSCAPE", 11);
  addTitle(slide, "What recent inference systems try to optimize", "");
  addCard(slide, {
    x: 0.82,
    y: 1.82,
    w: 2.3,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Paged KV",
    title: "Lower fragmentation",
    body: "Manage cache in fixed-size blocks instead of assuming ideal contiguous growth.",
    bodySize: 12.8,
  });
  addCard(slide, {
    x: 3.33,
    y: 1.82,
    w: 2.3,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Sliding window",
    title: "Bound active history",
    body: "Restrict which positions remain attendable, reducing effective cache cost.",
    bodySize: 12.8,
  });
  addCard(slide, {
    x: 5.84,
    y: 1.82,
    w: 2.3,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Quantization",
    title: "Smaller K/V",
    body: "Trade precision for lower memory footprint and reduced bandwidth demand.",
    bodySize: 12.8,
  });
  addCard(slide, {
    x: 8.35,
    y: 1.82,
    w: 2.3,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Compression or eviction",
    title: "Selective retention",
    body: "Keep only what is most useful, at the cost of quality risk and policy complexity.",
    bodySize: 12.8,
  });
  addCard(slide, {
    x: 10.86,
    y: 1.82,
    w: 1.65,
    h: 4.9,
    fill: C.paleAccent,
    lineColor: C.accent,
    eyebrow: "Speculative decode",
    title: "Related, not a replacement",
    body: "Changes decode strategy, but cache behavior and verification still matter.",
    bodySize: 12.3,
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "RESEARCH FRAMING", 12);
  addTitle(slide, "Questions worth asking in a research seminar", "");
  addBulletList(
    slide,
    [
      "At what context length and batch regime does the dominant bottleneck move from compute to memory traffic?",
      "How much KV precision can you remove before quality degradation dominates the savings?",
      "Which scheduler decisions materially affect cache locality and fragmentation?",
      "How should we benchmark long-context serving so tokens/sec is not misleading?",
      "Can architecture and serving be co-designed instead of optimized in separate stages?"
    ],
    0.95,
    1.95,
    7.4,
    4.8,
    C.ink,
    15
  );
  addCard(slide, {
    x: 8.75,
    y: 2.05,
    w: 3.45,
    h: 3.9,
    fill: C.paleGold,
    lineColor: C.gold,
    eyebrow: "Benchmark discipline",
    title: "Always pin the regime",
    body:
      "Prompt lengths\nOutput lengths\nBatch policy\nArchitecture variant\nKV dtype\nHardware\nPrefix reuse assumptions",
    bodySize: 14,
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "MISCONCEPTIONS", 13);
  addTitle(slide, "Five misconceptions to correct explicitly", "");
  addCard(slide, {
    x: 0.82,
    y: 1.85,
    w: 5.95,
    h: 4.9,
    fill: C.surface,
    eyebrow: "Myths",
    title: "What advanced audiences still get wrong",
    body:
      "1. KV Cache makes decode constant-time.\n2. KV Cache is mostly a compute optimization.\n3. Prefill and decode are nearly the same workload.\n4. GQA and MQA are only model-design choices.\n5. Long context is mainly a modeling problem.",
    bodySize: 14,
  });
  addCard(slide, {
    x: 6.95,
    y: 1.85,
    w: 5.55,
    h: 4.9,
    fill: C.paleTeal,
    lineColor: C.teal,
    eyebrow: "Corrections",
    title: "What to replace them with",
    body:
      "Decode still scales through cache reads.\nMemory capacity and bandwidth often dominate.\nPrefill and decode need different metrics.\nH_kv changes serviceable footprint.\nServing and cache design are part of long-context feasibility.",
    bodySize: 14,
  });
  finalizeSlide(slide);

  slide = pptx.addSlide();
  addFullBleed(slide);
  addTopBand(slide, "CLOSING", 14);
  addTitle(slide, "If they can answer these, they understand KV Cache", "");
  addCard(slide, {
    x: 0.85,
    y: 1.95,
    w: 12.0,
    h: 3.45,
    fill: C.surface,
    eyebrow: "Exit checklist",
    title: "The audience should be able to articulate",
    body:
      "The exact recomputation term eliminated by caching.\nWhy decode can become bandwidth-bound.\nHow cache memory scales with L, T, H_kv, d, dtype, and batch.\nWhy GQA changes serviceable context length.\nWhich optimization they would test first for a given serving regime.",
    bodySize: 15,
  });
  slide.addText("KV Cache turns autoregressive inference from a recomputation problem into a memory-management problem.", {
    x: 1.0,
    y: 5.95,
    w: 11.3,
    h: 0.45,
    fontFace: "PT Sans",
    fontSize: 20,
    bold: true,
    color: C.accent,
    align: "center",
  });
  slide.addText("Discussion: what changes first when you scale from 4k to 128k context?", {
    x: 1.2,
    y: 6.45,
    w: 10.9,
    h: 0.28,
    fontFace: "PT Sans Narrow",
    fontSize: 14,
    color: C.muted,
    align: "center",
  });
  finalizeSlide(slide);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  buildSlides();
  await pptx.writeFile({ fileName: OUT_FILE });
  console.log(`Wrote ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

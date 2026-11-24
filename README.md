# KV Cache Teaching Kit

Teaching repo for a 60-minute research-level lecture on KV Cache in autoregressive Transformers.

## What is included

- `slides/build_deck.js`: editable PowerPoint source built with PptxGenJS
- `slides/output/kv-cache-research-seminar.pptx`: generated slide deck
- `notes/lecture_notes.md`: lecture notes for a 60-minute seminar
- `assistant/socratic_assistant_prompt.md`: system prompt for a Socratic teaching assistant
- `assistant/quickstart.md`: ways to use the assistant during prep or live teaching
- `subprojects/`: a from-scratch implementation roadmap across multiple model families

## Audience

The material targets AI researchers, research scientists, and PhD students who already understand Transformer attention and autoregressive decoding.

## Build

From the repo root:

```bash
npm install
npm run build
npm run preview
```

`npm run preview` starts a local web server and opens a dashboard at `http://127.0.0.1:8000/docs/index.html`.

Optional validation:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r slides/requirements-render.txt
npm run render
npm run montage
npm run overflow
npm run font-check
```

The validation scripts come from the bundled `slides` skill and expect:

- Python packages from `slides/requirements-render.txt`
- LibreOffice for PPTX to PDF conversion
- Poppler tools such as `pdfinfo`

## Repo structure

```text
kv-cache-teaching-kit/
├── .gitignore
├── assistant/
├── notes/
├── subprojects/
├── slides/
│   ├── build_deck.js
│   ├── requirements-render.txt
│   ├── pptxgenjs_helpers/
│   ├── render_slides.py
│   ├── create_montage.py
│   ├── slides_test.py
│   └── detect_font.py
└── package.json
```

## Content scope

The deck and notes cover:

- KV Cache fundamentals
- Prefill vs decode
- Compute and memory trade-offs
- MHA vs GQA vs MQA
- Serving bottlenecks and batching behavior
- Paged KV Cache, prefix caching, sliding windows, quantization
- Measurement strategy and open research questions

## Suggested use

- Use the slide deck for a research seminar or internal deep-dive.
- Use the lecture notes as speaker notes or a written handout.
- Use the Socratic assistant to rehearse explanations, challenge assumptions, or diagnose learner misconceptions.
- Use [`subprojects/README.md`](/Users/admin/TuanDung/repos/kv-cache-teaching-kit/subprojects/README.md) as the execution plan for building KV Cache implementations from scratch.

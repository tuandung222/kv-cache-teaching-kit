# KV Cache Teaching Kit

Teaching repo for a 60-minute research-level lecture on KV Cache in autoregressive Transformers.

## What is included

- `slides/build_deck.js`: editable PowerPoint source built with PptxGenJS
- `slides/output/kv-cache-research-seminar.pptx`: generated slide deck
- `notes/lecture_notes.md`: lecture notes for a 60-minute seminar
- `assistant/socratic_assistant_prompt.md`: system prompt for a Socratic teaching assistant
- `assistant/quickstart.md`: ways to use the assistant during prep or live teaching

## Audience

The material targets AI researchers, research scientists, and PhD students who already understand Transformer attention and autoregressive decoding.

## Build

From the repo root:

```bash
npm install
npm run build
```

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

## Interactive Web Lecture

This repo also includes an interactive, highly-detailed web lecture about KV Cache tailored for Research Scientists and Engineers.

### How to read it

1. You can open `index.html` directly in your browser.
2. It is also **automatically deployed to GitHub Pages** via GitHub Actions.
   - Make sure GitHub Actions are enabled in your repository.
   - Under your repository settings -> "Pages" -> "Build and deployment", ensure the Source is set to **"GitHub Actions"**.
   - Any push to the `main` branch will automatically trigger the deployment.

## Suggested use

- Use the slide deck for a research seminar or internal deep-dive.
- Use the lecture notes as speaker notes or a written handout.
- Use the Socratic assistant to rehearse explanations, challenge assumptions, or diagnose learner misconceptions.
- Share the **interactive web lecture** (`index.html`) with students for an engaging deep dive into KV Cache metrics, bottlenecks, and optimizations.

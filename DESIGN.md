# Romanjo Art QA — Public demo and skill design

## Purpose

`romanjo-art-qa` is the public, non-commercial surface for Romanjo Art QA. It
contains:

- a browser demo that shows the analysis/preview experience;
- a local upload mode for users' own images;
- an Agent Skill that generates a review JSON and opens the same preview for a
  user-provided image.

The paid workbench, MCP tools, internal rubrics, provider adapters, model
weights, training pipeline, and private aesthetic knowledge stay out of this
repository.

## Two entry points

### 1. `start.bat`

`start.bat` serves the repository root with Python's local HTTP server and opens
`http://127.0.0.1:8000/`.

The default page is the trimmed `index.html` demo. It keeps the live analysis
preview and a single `romanjo.art` button, and hides the marketing sections.

### 2. Agent Skill

[SKILL.md](SKILL.md) is the Codex skill. For a user-provided image, the skill:

1. analyzes the image with the host's native vision;
2. writes the result to `generated-review.json` at the repository root;
3. places or copies the image into `assets/`;
4. serves the repository root;
5. opens
   `/?image=assets/review-input.<ext>&review=generated-review.json`.

The page switches to upload/preview mode and renders the generated review.

## Upload mode

When the user clicks **Upload image**, or when the skill opens the page with
`image` and `review` query parameters:

- the fixed case tabs are hidden;
- the selected image is shown in the analysis viewport;
- the analysis panel is filled from the current review JSON;
- the histogram is drawn locally;
- a **Copy prompt** button exports the `generation_guidance` fields;
- the comparison slider remains visible.

For a single uploaded image, there is no directed "after" image yet, so the
slider currently shows the same image on both sides. A future version can add a
second upload or a directed preview.

## Deterministic browser fallback

The browser-side upload uses [assets/analysis.js](assets/analysis.js). It
measures local pixels only:

- 16-bin luminance and RGB histograms;
- contrast, saturation, and edge-based saliency peaks;
- heuristic depth regions;
- composition layout and balance;
- color palette and temperature;
- motion/rhythm and generation guidance.

This is an estimate, not metric depth, eye tracking, or model inference. It does
not upload the image or call a private service.

## Layout notes

In upload mode, the workbench grows to fit the analysis panel content. The
right-hand panel is not clipped, so the export and navigation controls remain
reachable.

## Files

```text
index.html                 Public demo entry point
site.js                    Demo data and DOM generation
romanjo-analysis.js        Demo analysis channels and guards
demo-trim.css / .js        Hide marketing sections and add the paid button
upload-mode.css / .js      Upload, query-parameter preview, prompt export
assets/analysis.js         Deterministic browser-side analysis
assets/components/         Reusable review renderer
SKILL.md                   Agent Skill workflow
agents/openai.yaml         Agent skill metadata
```


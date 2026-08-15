import { ReadonlyReviewStage, renderHistogram } from "./components/review-kit.js";
import { analyzeImage } from "./analysis.js";

const stageRoot = document.querySelector("#review-stage");
const summary = document.querySelector("#summary");
const meta = document.querySelector("#meta");
const histogram = document.querySelector("#histogram");
const guidance = document.querySelector("#guidance");
const statusLine = document.querySelector("#analysis-status");
let currentReview = null;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the selected image."));
    image.src = url;
  });
}

function renderMeta(review) {
  const confidence = Math.round(review.summary.confidence * 100);
  const luminance = review.color.histogram.luminance || [];
  meta.innerHTML = [
    ["Native size", `${review.image.width} × ${review.image.height}`],
    ["Coordinate space", "normalized [0, 1] → native pixels"],
    ["Confidence", `${confidence}%`],
    ["Histogram", `${luminance.length} bins · ${review.color.measurement}`]
  ].map(([label, value]) => `<div><strong>${label}</strong><br>${value}</div>`).join("");
}

function renderGuidance(reviewGuidance) {
  const preserve = (reviewGuidance.preserve || []).map((item) => `<li><span>Keep</span> ${item.target} — ${item.expected_effect}</li>`).join("");
  const change = (reviewGuidance.change || []).map((item) => `<li><span>Change</span> ${item.target} — ${item.expected_effect}</li>`).join("");
  const constraints = (reviewGuidance.negative_constraints || []).map((item) => `<li><span>Guardrail</span> ${item}</li>`).join("");
  guidance.innerHTML = `${preserve}${change}${constraints}`;
}

function renderReview(review, imageUrl = null) {
  currentReview = review;
  const stage = new ReadonlyReviewStage(stageRoot, review);
  summary.textContent = review.summary.one_line;
  renderMeta(review);
  renderGuidance(review.generation_guidance);
  drawHistogram();
  if (imageUrl) stage.setImageSource(imageUrl);
  return stage;
}

function drawHistogram() {
  if (!currentReview) return;
  renderHistogram(histogram, currentReview.color.histogram);
}

new ResizeObserver(drawHistogram).observe(histogram);

const initialResponse = await fetch("./example-review.json");
if (!initialResponse.ok) throw new Error(`Could not load example-review.json (${initialResponse.status})`);
const initialReview = await initialResponse.json();
let stage = renderReview(initialReview);

document.querySelector("#image-picker").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const url = URL.createObjectURL(file);
  statusLine.textContent = "Analyzing local pixels…";

  try {
    const image = await loadImage(url);
    const review = analyzeImage(image, file.name);
    stage = renderReview(review, url);
    await new Promise((resolve) => {
      stage.image.addEventListener("load", resolve, { once: true });
      stage.image.addEventListener("error", resolve, { once: true });
      stage.setImageSource(url);
    });
    statusLine.textContent = "Local analysis complete. Nothing left this browser.";
  } catch (error) {
    statusLine.textContent = "Could not analyze this image. Try another file.";
    console.warn(error);
  } finally {
    URL.revokeObjectURL(url);
  }
});

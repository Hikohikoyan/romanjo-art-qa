import { ReadonlyReviewStage, renderHistogram } from "./components/review-kit.js";

const response = await fetch("./example-review.json");
if (!response.ok) throw new Error(`Could not load example-review.json (${response.status})`);
const review = await response.json();
const stage = new ReadonlyReviewStage(document.querySelector("#review-stage"), review);
// Keep the bundled example on the deterministic canvas fallback. A visitor's
// selected image replaces it locally without an upload.

document.querySelector("#summary").textContent = review.summary.one_line;
document.querySelector("#meta").innerHTML = [
  ["Native size", `${review.image.width} × ${review.image.height}`],
  ["Coordinate space", "normalized [0, 1] → native pixels"],
  ["Confidence", `${Math.round(review.summary.confidence * 100)}%`],
  ["Histogram", `${review.color.histogram.luminance.length} bins · ${review.color.measurement}`]
].map(([label, value]) => `<div><strong>${label}</strong><br>${value}</div>`).join("");

const histogram = document.querySelector("#histogram");
const drawHistogram = () => renderHistogram(histogram, review.color.histogram);
drawHistogram();
new ResizeObserver(drawHistogram).observe(histogram);

document.querySelector("#image-picker").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const url = URL.createObjectURL(file);
  stage.image.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
  stage.setImageSource(url);
});

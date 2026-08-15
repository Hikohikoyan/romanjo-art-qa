import { analyzeImage } from "./assets/analysis.js";

const locale = document.documentElement.dataset.locale || "en";
const uploadLabel = locale === "zh" ? "上传图片" : locale === "ja" ? "画像を選択" : "Upload image";
const generatedLabel = locale === "zh" ? "已生成预览" : locale === "ja" ? "生成済みプレビュー" : "Generated preview";
let currentReview = null;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the selected image."));
    image.src = url;
  });
}

function drawSkillHistogram(canvas, histogram) {
  const channels = [
    ["luminance", "#f2f1ec"],
    ["red", "#ff6b5e"],
    ["green", "#8cdf86"],
    ["blue", "#72aaff"]
  ];
  const width = canvas.width || 430;
  const height = canvas.height || 108;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);

  const pad = 12;
  channels.forEach(([key, color]) => {
    const bins = histogram[key] || [];
    const peak = Math.max(0.001, ...bins);
    context.strokeStyle = color;
    context.lineWidth = key === "luminance" ? 2 : 1;
    context.globalAlpha = key === "luminance" ? 1 : 0.72;
    context.beginPath();
    bins.forEach((value, index) => {
      const x = pad + (index / Math.max(1, bins.length - 1)) * (width - pad * 2);
      const y = height - pad - (value / peak) * (height - pad * 2);
      index ? context.lineTo(x, y) : context.moveTo(x, y);
    });
    context.stroke();
  });
  context.globalAlpha = 1;
}

function renderUpload(review, imageUrl, sourceLabel) {
  currentReview = review;
  document.body.classList.add("upload-mode");
  const afterImage = document.querySelector("#afterImg");
  const clipImage = document.querySelector("#clipImg");
  if (afterImage) {
    afterImage.src = imageUrl;
    afterImage.style.display = "block";
  }
  if (clipImage) clipImage.src = imageUrl;

  const set = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  set("#grade", "QA");
  set("#verdict", review.summary.one_line);
  set("#detect", (review.narrative.visible_content || []).join(", "));
  set("#material", (review.color.palette || []).map((item) => item.hex).join(" · "));
  set("#master", `${review.composition.layout} · ${review.composition.balance}`);
  set("#story", review.narrative.story_reading);
  set("#feel", (review.narrative.mood_keywords || []).join(" · "));
  set("#depthNote", `${(review.depth.cues || []).join(", ")} · deterministic`);

  const note = document.querySelector(".model-note");
  if (note) note.textContent = sourceLabel;

  const histogram = document.querySelector("#histogram");
  if (histogram) drawSkillHistogram(histogram, review.color.histogram);
  ensureExportButton();
}

function buildPrompt(review) {
  const guidance = review.generation_guidance || {};
  const preserve = (guidance.preserve || []).map((item) => `Preserve: ${item.target} (${item.expected_effect})`).join("\n");
  const change = (guidance.change || []).map((item) => `${item.action}: ${item.target} (${item.expected_effect})`).join("\n");
  const constraints = (guidance.negative_constraints || []).map((item) => `Do not: ${item}`).join("\n");
  return [preserve, change, constraints].filter(Boolean).join("\n");
}

function ensureExportButton() {
  const panel = document.querySelector(".analysis-panel");
  if (!panel || panel.querySelector(".export-button")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "export-button";
  button.textContent = locale === "zh" ? "导出提示词" : locale === "ja" ? "プロンプトをコピー" : "Copy prompt";
  button.addEventListener("click", async () => {
    if (!currentReview) return;
    const prompt = buildPrompt(currentReview);
    try {
      await navigator.clipboard.writeText(prompt);
      button.textContent = locale === "zh" ? "已复制" : locale === "ja" ? "コピー済み" : "Copied";
    } catch (_) {
      button.textContent = locale === "zh" ? "复制失败" : locale === "ja" ? "コピー失敗" : "Copy failed";
    }
    setTimeout(() => {
      button.textContent = locale === "zh" ? "导出提示词" : locale === "ja" ? "プロンプトをコピー" : "Copy prompt";
    }, 1400);
  });
  panel.appendChild(button);
}

function addUploadButton() {
  const header = document.querySelector("header");
  if (!header || header.querySelector(".upload-button")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "upload-button";
  button.textContent = uploadLabel;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.hidden = true;

  input.addEventListener("change", async () => {
    const [file] = input.files;
    if (!file) return;
    const url = URL.createObjectURL(file);
    try {
      const image = await loadImage(url);
      const review = analyzeImage(image, file.name);
      renderUpload(review, url, generatedLabel);
    } catch (error) {
      console.warn(error);
    }
  });

  button.addEventListener("click", () => input.click());
  const paid = header.querySelector(".paid-button");
  header.insertBefore(input, paid || null);
  header.insertBefore(button, paid || null);
}

async function bootFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const reviewParam = params.get("review");
  const imageParam = params.get("image");
  if (!reviewParam || !imageParam) return false;

  const response = await fetch(reviewParam);
  if (!response.ok) return false;
  const review = await response.json();
  const imageUrl = new URL(imageParam, window.location.href).href;
  renderUpload(review, imageUrl, generatedLabel);
  return true;
}

function boot() {
  addUploadButton();
  bootFromQuery().catch((error) => console.warn(error));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

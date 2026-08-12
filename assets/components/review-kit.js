const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function nativePoint(point, image) {
  return { x: point.x * image.width, y: point.y * image.height };
}

function label(svg, text, x, y) {
  const node = svgElement("text", { x, y, class: "rr-label" });
  node.textContent = text;
  svg.append(node);
}

function drawFallback(canvas, review) {
  canvas.width = review.image.width;
  canvas.height = review.image.height;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#263d52");
  gradient.addColorStop(1, "#101923");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#d94432";
  context.beginPath();
  context.roundRect(canvas.width * 0.24, canvas.height * 0.2, canvas.width * 0.26, canvas.height * 0.55, canvas.width * 0.04);
  context.fill();
  context.strokeStyle = "rgba(220,230,235,.5)";
  context.lineWidth = Math.max(2, canvas.width / 300);
  context.beginPath();
  context.moveTo(canvas.width * 0.2, canvas.height * 0.72);
  context.lineTo(canvas.width * 0.82, canvas.height * 0.18);
  context.stroke();
}

export class ReadonlyReviewStage {
  constructor(root, review) {
    this.root = root;
    this.review = review;
    this.root.classList.add("rr-stage");
    this.root.style.aspectRatio = `${review.image.width} / ${review.image.height}`;
    this.canvas = document.createElement("canvas");
    this.image = document.createElement("img");
    this.image.alt = review.image.alt || "Review source";
    this.image.hidden = true;
    this.overlay = svgElement("svg", {
      viewBox: `0 0 ${review.image.width} ${review.image.height}`,
      preserveAspectRatio: "none",
      "aria-label": "Read-only review overlays in source-image coordinates",
      role: "img"
    });
    this.root.replaceChildren(this.canvas, this.image, this.overlay);
    drawFallback(this.canvas, review);
    this.renderOverlay();
  }

  setImageSource(url) {
    this.image.onload = () => {
      this.image.hidden = false;
      this.canvas.hidden = true;
    };
    this.image.onerror = () => {
      this.image.hidden = true;
      this.canvas.hidden = false;
    };
    this.image.src = url;
  }

  renderOverlay() {
    const { review, overlay } = this;
    overlay.replaceChildren();
    (review.depth?.regions || []).slice(0, 4).forEach((region) => {
      const points = region.polygon.map((point) => {
        const native = nativePoint(point, review.image);
        return `${native.x},${native.y}`;
      }).join(" ");
      overlay.append(svgElement("polygon", { points, class: "rr-region", "data-band": region.band }));
      const first = nativePoint(region.polygon[0], review.image);
      label(overlay, region.label, first.x + 10, first.y + 28);
    });
    (review.composition?.structural_lines || []).slice(0, 3).forEach((line) => {
      const start = nativePoint(line.start, review.image);
      const end = nativePoint(line.end, review.image);
      overlay.append(svgElement("line", { x1: start.x, y1: start.y, x2: end.x, y2: end.y, class: "rr-line" }));
    });
    (review.saliency || []).slice(0, 3).forEach((point) => {
      const center = nativePoint(point.center, review.image);
      const radius = point.radius * Math.min(review.image.width, review.image.height);
      overlay.append(svgElement("circle", { cx: center.x, cy: center.y, r: radius, class: "rr-point" }));
      label(overlay, String(point.rank), center.x + radius * 0.7, center.y - radius * 0.7);
    });
  }
}

export function renderHistogram(canvas, histogram) {
  const channels = [
    ["luminance", "#f4f2e8"],
    ["red", "#f06b61"],
    ["green", "#8cdf86"],
    ["blue", "#72aaff"]
  ];
  const scale = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.round(canvas.clientWidth));
  const height = Math.max(150, Math.round(canvas.clientHeight));
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  context.scale(scale, scale);
  context.clearRect(0, 0, width, height);
  const pad = 18;
  context.strokeStyle = "rgba(255,255,255,.1)";
  for (let row = 0; row <= 4; row += 1) {
    const y = pad + ((height - pad * 2) * row) / 4;
    context.beginPath(); context.moveTo(pad, y); context.lineTo(width - pad, y); context.stroke();
  }
  channels.forEach(([key, color]) => {
    const bins = histogram[key] || [];
    const max = Math.max(...bins, 0.001);
    context.strokeStyle = color;
    context.lineWidth = key === "luminance" ? 2.2 : 1.25;
    context.globalAlpha = key === "luminance" ? 1 : 0.72;
    context.beginPath();
    bins.forEach((value, index) => {
      const x = pad + (index / Math.max(1, bins.length - 1)) * (width - pad * 2);
      const y = height - pad - (value / max) * (height - pad * 2);
      index ? context.lineTo(x, y) : context.moveTo(x, y);
    });
    context.stroke();
  });
  context.globalAlpha = 1;
}


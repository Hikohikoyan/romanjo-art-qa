(function (global) {
  "use strict";

  function clamp(value, min = 0, max = 1) { return Math.max(min, Math.min(max, value)); }
  function lerp(a, b, t) { return a + (b - a) * clamp(t); }
  function mixArray(a, b, t) {
    const length = Math.min(a.length, b.length);
    return Array.from({ length }, (_, index) => lerp(a[index] || 0, b[index] || 0, t));
  }
  function imageRect(frame, sourceWidth, sourceHeight) {
    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    const scale = Math.min(frameWidth / sourceWidth, frameHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    return { left: (frameWidth - width) / 2, top: (frameHeight - height) / 2, width, height, scale };
  }
  function applyImageRect(element, rect) {
    Object.assign(element.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, right: "auto", bottom: "auto" });
  }
  function pixelBoxToCss(box, source, rect) {
    const [x, y, width, height] = box;
    return { left: rect.left + x / source.width * rect.width, top: rect.top + y / source.height * rect.height, width: width / source.width * rect.width, height: height / source.height * rect.height };
  }
  function interpolateText(before, after, t) {
    if (t <= .04) return before;
    if (t >= .96) return after;
    const splitBefore = before.split(/(\s+|(?=[，。；：,.]))/);
    const splitAfter = after.split(/(\s+|(?=[，。；：,.]))/);
    const count = Math.max(splitBefore.length, splitAfter.length);
    const pivot = Math.round(clamp(t) * count);
    return Array.from({ length: count }, (_, index) => index < pivot ? (splitAfter[index] || "") : (splitBefore[index] || "")).join("");
  }
  function gradeForScore(score) {
    if (score >= 92) return "A";
    if (score >= 86) return "A−";
    if (score >= 80) return "B+";
    if (score >= 72) return "B";
    if (score >= 64) return "B−";
    return "C";
  }
  function drawHistogram(canvas, before, after, t, options = {}) {
    const context = canvas.getContext("2d");
    const ratio = Math.max(1, Math.min(3, global.devicePixelRatio || 1));
    const width = Math.max(320, Math.round(canvas.clientWidth || 430));
    const height = Math.max(104, Math.round(canvas.clientHeight || 108));
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const bins = mixArray(before.bins, after.bins, t);
    const peak = Math.max(1, ...bins);
    const left = 34, right = width - 10, top = 17, bottom = height - 29;
    context.clearRect(0, 0, width, height);
    const fontSize = options.fontSize || 9;
    context.font = `${fontSize}px ${options.fontFamily || '"Helvetica Neue", Arial, sans-serif'}`;
    context.fillStyle = "#615e58";
    context.strokeStyle = "rgba(93,89,82,.25)";
    context.lineWidth = 1;
    context.textAlign = "right";
    context.fillText("100%", left - 6, top + 3);
    context.fillText("0", left - 6, bottom + 3);
    context.textAlign = "left";
    context.save();
    context.translate(9, (top + bottom) / 2);
    context.rotate(-Math.PI / 2);
    context.textAlign = "center";
    context.fillText(options.yLabel || "REL. FREQ.", 0, 0);
    context.restore();
    for (let index = 0; index <= 2; index += 1) {
      const y = lerp(bottom, top, index / 2);
      context.beginPath(); context.moveTo(left, y); context.lineTo(right, y); context.stroke();
    }
    for (let index = 0; index <= 4; index += 1) {
      const x = lerp(left, right, index / 4);
      context.beginPath(); context.moveTo(x, top); context.lineTo(x, bottom); context.stroke();
      context.textAlign = index === 0 ? "left" : index === 4 ? "right" : "center";
      context.fillText(String(index === 4 ? 255 : index * 64), x, bottom + 13);
    }
    context.strokeStyle = "#5f5b54"; context.lineWidth = 1.25;
    context.beginPath(); context.moveTo(left, top); context.lineTo(left, bottom); context.lineTo(right, bottom); context.stroke();
    context.beginPath(); context.moveTo(left, bottom);
    bins.forEach((value, index) => context.lineTo(lerp(left, right, index / Math.max(1, bins.length - 1)), bottom - Math.sqrt(value / peak) * (bottom - top)));
    context.lineTo(right, bottom); context.closePath();
    const fill = context.createLinearGradient(0, top, 0, bottom); fill.addColorStop(0, options.fill || "rgba(255,74,35,.48)"); fill.addColorStop(1, "rgba(215,255,63,.02)");
    context.fillStyle = fill; context.fill(); context.strokeStyle = options.stroke || "#111"; context.lineWidth = 1.5; context.stroke();
    const valueScale = Math.max(before.p90, after.p90) <= 1 ? 255 : 1;
    const marks = [[lerp(before.p10, after.p10, t) * valueScale, "P10"], [lerp(before.p50, after.p50, t) * valueScale, "P50"], [lerp(before.p90, after.p90, t) * valueScale, "P90"]];
    marks.forEach(([value, label]) => { const x = lerp(left, right, value / 255); context.strokeStyle = label === "P50" ? (options.marker || "#ff4a23") : "#777"; context.beginPath(); context.moveTo(x, top); context.lineTo(x, bottom); context.stroke(); context.fillStyle = context.strokeStyle; context.textAlign = "center"; context.fillText(label, x, 9); });
    const mean = Math.round(lerp(before.mean, after.mean, t) * valueScale);
    context.fillStyle = "#555"; context.textAlign = "left"; context.fillText(`${options.meanLabel || "MEAN"} ${mean}  Δ ${Math.round(marks[2][0] - marks[0][0])}`, left, height - 4);
    context.textAlign = "right"; context.fillText(options.xLabel || "VALUE 0–255", right, height - 4);
  }
  function chooseAtSlider(beforeValue, afterValue, t) { return t < .5 ? beforeValue : afterValue; }

  global.RomanjoKit = Object.freeze({ clamp, lerp, mixArray, imageRect, applyImageRect, pixelBoxToCss, interpolateText, gradeForScore, drawHistogram, chooseAtSlider });
}(window));

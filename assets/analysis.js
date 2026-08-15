const MAX_DIM = 256;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function hex(red, green, blue) {
  const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function loadImageSource(image, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height).data;
}

function buildHistograms(data) {
  const histograms = {
    luminance: new Array(16).fill(0),
    red: new Array(16).fill(0),
    green: new Array(16).fill(0),
    blue: new Array(16).fill(0)
  };
  const length = data.length / 4;
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;

  for (let index = 0; index < length; index += 1) {
    const offset = index * 4;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const luminance = Math.round(0.2126 * red + 0.7152 * green + 0.0722 * blue);
    histograms.red[Math.min(15, red >> 4)] += 1;
    histograms.green[Math.min(15, green >> 4)] += 1;
    histograms.blue[Math.min(15, blue >> 4)] += 1;
    histograms.luminance[Math.min(15, luminance >> 4)] += 1;
    redSum += red;
    greenSum += green;
    blueSum += blue;
  }

  Object.values(histograms).forEach((bins) => {
    const total = bins.reduce((sum, value) => sum + value, 0) || 1;
    for (let index = 0; index < bins.length; index += 1) bins[index] /= total;
  });

  return {
    histograms,
    mean: {
      red: redSum / length / 255,
      green: greenSum / length / 255,
      blue: blueSum / length / 255
    }
  };
}

function buildLuminanceAndSaturation(data, width, height) {
  const length = width * height;
  const luminance = new Float32Array(length);
  const saturation = new Float32Array(length);
  let luminanceSum = 0;

  for (let index = 0; index < length; index += 1) {
    const offset = index * 4;
    const red = data[offset] / 255;
    const green = data[offset + 1] / 255;
    const blue = data[offset + 2] / 255;
    const value = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    luminance[index] = value;
    saturation[index] = maximum === 0 ? 0 : (maximum - minimum) / maximum;
    luminanceSum += value;
  }

  const meanLuminance = luminanceSum / length;
  let variance = 0;
  for (let index = 0; index < length; index += 1) {
    const delta = luminance[index] - meanLuminance;
    variance += delta * delta;
  }

  return {
    luminance,
    saturation,
    meanLuminance,
    stdLuminance: Math.sqrt(variance / length)
  };
}

function buildEdges(luminance, width, height) {
  const length = width * height;
  const edges = new Float32Array(length);
  let sum = 0;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      const horizontal = luminance[index + 1] - luminance[index - 1];
      const vertical = luminance[index + width] - luminance[index - width];
      const magnitude = Math.hypot(horizontal, vertical);
      edges[index] = magnitude;
      sum += magnitude;
    }
  }

  return {
    edges,
    mean: sum / Math.max(1, length)
  };
}

function pickSaliencyPoints(saliency, width, height, count = 3) {
  const points = [];
  const suppressed = new Uint8Array(width * height);
  const radius = Math.max(4, Math.round(Math.min(width, height) / 8));

  for (let attempt = 0; attempt < count; attempt += 1) {
    let bestIndex = -1;
    let bestScore = -Infinity;
    for (let index = 0; index < saliency.length; index += 1) {
      if (!suppressed[index] && saliency[index] > bestScore) {
        bestScore = saliency[index];
        bestIndex = index;
      }
    }
    if (bestIndex < 0 || bestScore <= 0) break;

    const centerX = bestIndex % width;
    const centerY = Math.floor(bestIndex / width);
    points.push({ x: centerX, y: centerY, score: bestScore });

    for (let y = centerY - radius; y <= centerY + radius; y += 1) {
      for (let x = centerX - radius; x <= centerX + radius; x += 1) {
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        suppressed[y * width + x] = 1;
      }
    }
  }

  if (!points.length) {
    points.push({ x: Math.floor(width / 2), y: Math.floor(height / 2), score: 0.5 });
  }

  const maximum = Math.max(...points.map((point) => point.score), 0.0001);
  return points.map((point) => ({
    ...point,
    normalizedScore: clamp01(point.score / maximum)
  }));
}

function pointFromPixel(pixel, width, height) {
  return { x: clamp01((pixel.x + 0.5) / width), y: clamp01((pixel.y + 0.5) / height) };
}

function buildPalette(data) {
  const buckets = new Map();
  const length = data.length / 4;
  const step = Math.max(1, Math.floor(length / 16000));

  for (let index = 0; index < length; index += step) {
    const offset = index * 4;
    const red = data[offset] >> 5;
    const green = data[offset + 1] >> 5;
    const blue = data[offset + 2] >> 5;
    const key = (red << 6) | (green << 3) | blue;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  const ranked = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const total = ranked.reduce((sum, [, count]) => sum + count, 0) || 1;
  const roles = ["dominant", "support", "accent"];

  return ranked.map(([key, count], index) => {
    const blue = key & 7;
    const green = (key >> 3) & 7;
    const red = (key >> 6) & 7;
    return {
      hex: hex((red << 5) + 16, (green << 5) + 16, (blue << 5) + 16),
      weight: count / total,
      role: roles[index] || "accent"
    };
  });
}

function classifyLayout(mainPoint) {
  const distance = Math.hypot(mainPoint.x - 0.5, mainPoint.y - 0.5);
  if (distance < 0.16) return "central";
  const onThirds = Math.abs(mainPoint.x - 1 / 3) < 0.12 || Math.abs(mainPoint.x - 2 / 3) < 0.12 || Math.abs(mainPoint.y - 1 / 3) < 0.12 || Math.abs(mainPoint.y - 2 / 3) < 0.12;
  if (onThirds) return "rule-of-thirds";
  if (Math.abs(mainPoint.x - mainPoint.y) > 0.28) return "diagonal";
  return "asymmetrical";
}

function classifyBalance(luminance, width, height) {
  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const value = luminance[y * width + x];
      if (x < halfWidth) left += value; else right += value;
      if (y < halfHeight) top += value; else bottom += value;
    }
  }

  const horizontalDiff = (left - right) / Math.max(1, left + right);
  const verticalDiff = (top - bottom) / Math.max(1, top + bottom);
  if (Math.abs(horizontalDiff) > 0.06) return horizontalDiff > 0 ? "left-heavy" : "right-heavy";
  if (Math.abs(verticalDiff) > 0.06) return verticalDiff > 0 ? "top-heavy" : "bottom-heavy";
  return "stable";
}

function classifyContrast(stdLuminance) {
  if (stdLuminance < 0.11) return "low";
  if (stdLuminance < 0.24) return "medium";
  return "high";
}

function classifyTemperature(mean) {
  const difference = mean.red - mean.blue;
  if (Math.abs(difference) < 0.035) return "neutral";
  return difference > 0 ? "warm" : "cool";
}

function classifyRhythm(energy) {
  if (energy < 0.18) return "still";
  if (energy < 0.42) return "flowing";
  if (energy < 0.68) return "pulsed";
  return "chaotic";
}

export function analyzeImage(image, source = "local image") {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, MAX_DIM / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(8, Math.round(sourceWidth * scale));
  const height = Math.max(8, Math.round(sourceHeight * scale));
  const data = loadImageSource(image, width, height);
  const { histograms, mean } = buildHistograms(data);
  const { luminance, saturation, meanLuminance, stdLuminance } = buildLuminanceAndSaturation(data, width, height);
  const { edges, mean: meanEdge } = buildEdges(luminance, width, height);

  const saliency = new Float32Array(width * height);
  for (let index = 0; index < saliency.length; index += 1) {
    saliency[index] = 0.45 * Math.abs(luminance[index] - meanLuminance) + 0.3 * saturation[index] + 0.25 * Math.min(1, edges[index] / 0.5);
  }

  const rawPoints = pickSaliencyPoints(saliency, width, height, 3);
  const points = rawPoints.map((pixel, index) => {
    const position = pointFromPixel(pixel, width, height);
    const drivers = ["contrast"];
    if (saturation[pixel.y * width + pixel.x] > 0.3) drivers.push("saturation");
    if (edges[pixel.y * width + pixel.x] > 0.35) drivers.push("detail");
    if (luminance[pixel.y * width + pixel.x] > 0.75 || luminance[pixel.y * width + pixel.x] < 0.18) drivers.push("luminance");
    return {
      id: `s${index + 1}`,
      rank: index + 1,
      center: position,
      radius: Math.max(0.06, Math.min(0.3, Math.max(5, Math.min(width, height) / 12) / Math.min(width, height))),
      weight: clamp01(0.55 + pixel.normalizedScore * 0.4),
      drivers,
      evidence: `Measured contrast, saturation and edge strength peak near this region.`,
      confidence: clamp01(0.58 + pixel.normalizedScore * 0.22)
    };
  });

  const primary = points[0];
  const contrast = classifyContrast(stdLuminance);
  const temperature = classifyTemperature(mean);
  const layout = classifyLayout(primary.center);
  const balance = classifyBalance(luminance, width, height);
  const energy = clamp01(meanEdge * 1.8);
  const rhythm = classifyRhythm(energy);

  const farRegion = {
    id: "d1",
    label: "estimated background",
    band: "far",
    depth_order: 2,
    polygon: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }],
    edge_softness: 0.6,
    confidence: 0.52
  };

  const radius = 0.16;
  const left = clamp01(primary.center.x - radius);
  const right = clamp01(primary.center.x + radius);
  const top = clamp01(primary.center.y - radius);
  const bottom = clamp01(primary.center.y + radius);
  const nearRegion = {
    id: "d2",
    label: "estimated foreground",
    band: "near",
    depth_order: 1,
    polygon: [{ x: left, y: top }, { x: right, y: top }, { x: right, y: bottom }, { x: left, y: bottom }],
    edge_softness: 0.35,
    confidence: 0.5
  };

  const structuralLines = [];
  if (points.length >= 2) {
    structuralLines.push({ start: points[0].center, end: points[1].center, role: "diagonal", confidence: 0.52 });
  } else {
    structuralLines.push({ start: { x: primary.center.x, y: 0 }, end: { x: primary.center.x, y: 1 }, role: "axis", confidence: 0.46 });
  }

  const palette = buildPalette(data);
  const guidanceChange = contrast === "low"
    ? [{ priority: "medium", action: "increase", target: "global contrast", expected_effect: "Separate the measured foreground from the background" }]
    : [{ priority: "medium", action: "reduce", target: "edge clutter", expected_effect: "Keep the primary attention area from competing with fine detail" }];

  return {
    schema_version: "1.0",
    image: {
      source,
      width: sourceWidth,
      height: sourceHeight,
      alt: "Local image selected by the visitor"
    },
    summary: {
      one_line: `${layout} composition, ${contrast} contrast, ${temperature} color; primary attention sits near ${Math.round(primary.center.x * 100)}%, ${Math.round(primary.center.y * 100)}%.`,
      strengths: [
        `Measured attention is concentrated near ${Math.round(primary.center.x * 100)}%, ${Math.round(primary.center.y * 100)}%.`,
        `Color reads as ${temperature} with a dominant ${palette[0]?.hex || "#000000"} tone.`,
        energy > 0.2 ? "Edge structure provides a readable directional flow." : "Low edge energy gives the image a still, quiet read."
      ].filter(Boolean),
      risks: [
        "Depth and saliency are deterministic estimates, not metric measurements.",
        "Object identity is not inferred from these pixels."
      ],
      confidence: 0.62
    },
    saliency: points,
    gaze_path: {
      point_ids: points.map((point) => point.id),
      curve: points.length >= 3 ? "angular" : "smooth",
      duration_ms: Math.min(30000, Math.max(500, Math.round(1200 + points.length * 900))),
      interpretation: "Attention follows the measured contrast and edge peaks."
    },
    depth: {
      method: "semantic-object-regions",
      regions: [farRegion, nearRegion],
      cues: ["vertical-position", "texture-gradient", "focus"],
      confidence: 0.5
    },
    composition: {
      layout,
      balance,
      anchors: points.map((point, index) => ({ label: `saliency ${index + 1}`, position: point.center })),
      structural_lines: structuralLines,
      golden_spiral: {
        pole: primary.center,
        rotation: "clockwise",
        scale: 0.9,
        anchor_label: "primary saliency",
        confidence: 0.42
      },
      interpretation: `A ${layout} read with ${balance} luminance balance and ${points.length} measurable attention peak${points.length === 1 ? "" : "s"}.`
    },
    color: {
      measurement: "pixel-measured",
      palette,
      histogram: histograms,
      contrast,
      temperature,
      interpretation: `Pixel-measured color reads as ${temperature} with ${contrast} luminance contrast.`
    },
    motion: {
      energy,
      directions: [{
        from: points[0].center,
        to: points.length >= 2 ? points[1].center : { x: 0.8, y: 0.2 },
        strength: clamp01(0.5 + energy * 0.5)
      }],
      rhythm,
      evidence: `Edge energy measures ${energy.toFixed(2)} across the local image.`
    },
    narrative: {
      visible_content: ["local image"],
      story_reading: `Deterministic pixel reading: ${layout} composition, ${contrast} contrast, ${temperature} color.`,
      mood_keywords: [temperature === "warm" ? "warm" : "cool", energy > 0.35 ? "dynamic" : "quiet"],
      ambiguities: ["Object identity is not inferred from these pixels."]
    },
    generation_guidance: {
      preserve: [{ priority: "high", action: "preserve", target: "primary attention region", expected_effect: "Keep the main focal area stable" }],
      change: guidanceChange,
      negative_constraints: [
        "Do not treat this deterministic estimate as model inference or a rights verdict.",
        "Do not infer authorship, intent, or legal status from these pixels."
      ]
    }
  };
}


(function () {
  "use strict";

  const kit = window.RomanjoKit;
  const locale = document.documentElement.dataset.locale || "en";
  const zh = locale === "zh";
  const ja = locale === "ja";
  const copy = (cn, jp, en) => zh ? cn : ja ? jp : en;
  const frame = document.getElementById("imageFrame");
  const viewport = document.getElementById("viewport");
  const beforeImage = document.getElementById("clipImg");
  const afterImage = document.getElementById("afterImg");
  const range = document.getElementById("range");
  const depthCanvas = document.getElementById("channelCanvas");
  const histogramCanvas = document.getElementById("histogram");
  const gaze = document.getElementById("gaze");
  const composition = frame.querySelector(".composition");
  const objects = document.getElementById("objects");
  if (!kit || !frame || !range) return;

  const beforeVerdicts = {
    interior: copy("右侧深柜与重复木色让视觉重量过早沉降，单椅的色彩锚点不够突出。", "右側の暗い収納と木色の反復が視覚重量を早く沈め、椅子の色彩アンカーを弱めています。", "The dark cabinet and repeated wood tones end the visual weight too early; the chair cannot hold the color anchor."),
    photo: copy("人物与冷色背景处于相近明度，面部、轮廓与潮湿材质之间缺少真实光线关系。", "人物と寒色の背景が同じ明度域にあり、顔、輪郭、湿った素材の光の関係が不足しています。", "Subject and cool background share one value range; face, rim and wet materials lack a credible light relationship."),
    poster: copy("标题、日期、地点和活动标签同时前冲，阅读顺序与形状节奏彼此竞争。", "題名、日時、場所、活動タグが同時に前へ出て、読順と形のリズムが競合しています。", "Title, date, venue and activity labels advance together, so reading order and shape rhythm compete."),
    game: copy("彩色描边与发光把全部功能推向前景，角色、库存和货币层级没有空间差。", "色枠と発光が全機能を前景へ押し出し、人物、所持品、通貨の空間階層を失わせています。", "Colored outlines push every function forward; character, inventory and currency lack spatial hierarchy.")
  };
  const japaneseDirectedVerdicts = {
    interior: "右側の収納の重さを抑え、錆色の椅子を唯一の色彩アンカーにする。",
    photo: "光管は残し、逆光、輪郭光、キャッチライト、湿度の連続で人物の質感を整える。",
    poster: "八項目を保ち、題名、日時と場所、活動タグを三段階の読解順序へ組み直す。",
    game: "情報量は保ち、発光枠を暗い鍛造金属、燻しガラス、低彩度のレアリティ記号へ置き換える。"
  };
  const scorePenalty = { interior: [12, 11, 9, 8], photo: [14, 12, 10, 9], poster: [16, 13, 8, 11], game: [13, 10, 9, 8] };
  const directedScores = { interior: [92, 94, 91, 96], photo: [91, 93, 92, 96], poster: [90, 94, 93, 97], game: [91, 93, 94, 96] };
  let manifest = null;
  let caseData = null;
  let caseId = "interior";
  let afterScores = [76, 88, 84, 91];
  let afterVerdict = document.getElementById("verdict").textContent;
  let gazeProgress = 0, gazeRunning = false, gazeStarted = 0, gazeFrame = 0;

  gaze.innerHTML = ["before", "after"].map(side => `<div class="gaze-side ${side}" data-gaze-side="${side}"><canvas class="gaze-blur-canvas" width="384" height="256"></canvas><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path class="gaze-path" pathLength="1"></path><g class="gaze-points"></g></svg><span class="gaze-side-label">${side === "before" ? copy("调整前", "調整前", "BEFORE") : copy("调整后", "調整後", "DIRECTED")}</span></div>`).join("");
  composition.innerHTML = `<svg class="golden-grid" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="golden-lines"/><path class="golden-spiral"/></svg><span>φ 1.618</span><div class="phi-labels"><b>0.382</b><b>0.618</b></div><i class="composition-anchor"></i>`;
  const player = document.createElement("div"); player.className = "gaze-player";
  player.innerHTML = `<button type="button" class="gaze-play">${copy("播放", "再生", "Play")}</button><span class="gaze-time">00:00</span><input class="gaze-scrub" type="range" min="0" max="1000" value="0" aria-label="${copy("视觉运动时间轴", "視線移動タイムライン", "Visual motion timeline")}"><span>00:08</span><div class="gaze-stages"><i>${copy("第一眼", "初見", "First sight")}</i><i>${copy("扩散", "展開", "Expansion")}</i><i>${copy("全景", "全景", "Full frame")}</i></div>`;
  frame.appendChild(player);

  const materialLens = document.getElementById("lens");
  materialLens.innerHTML = `<canvas id="lensCanvas" width="440" height="440"></canvas><span id="lensLabel">ALBEDO</span><small class="lens-source"></small>`;
  let lensMode = "albedo";
  let lensPointer = null;
  const artifactImages = new Map();
  document.getElementById("albedoLens").onclick = () => { lensMode = "albedo"; materialLens.classList.add("visible"); updateLens(lensPointer); };
  document.getElementById("normalLens").onclick = () => { lensMode = "normal"; materialLens.classList.add("visible"); updateLens(lensPointer); };

  function selectedCase() { return document.getElementById("caseId").textContent.split("/")[0].trim().toLowerCase(); }
  function sourceSideAt(pointerX) {
    const frameRect = frame.getBoundingClientRect();
    const image = caseData && kit.imageRect(frame, caseData.before.source.width, caseData.before.source.height);
    const x = pointerX - frameRect.left;
    return x <= image.left + image.width * Number(range.value) / 100 ? "before" : "after";
  }
  function artifactImage(path) {
    if (!artifactImages.has(path)) {
      const image = new Image();
      image.src = `/${path}`;
      artifactImages.set(path, image);
    }
    return artifactImages.get(path);
  }
  function updateLens(pointer) {
    if (!caseData) return;
    const pointerX = pointer && pointer.clientX;
    const side = pointerX == null ? (Number(range.value) >= 50 ? "before" : "after") : sourceSideAt(pointerX);
    const source = caseData[side];
    const artifact = source.artifacts && source.artifacts[lensMode];
    if (!artifact) return;
    const path = artifact.path || artifact;
    const image = artifactImage(path);
    const draw = () => {
      const canvas = document.getElementById("lensCanvas");
      const context = canvas.getContext("2d");
      const frameRect = frame.getBoundingClientRect();
      const imageRect = kit.imageRect(frame, source.source.width, source.source.height);
      const localX = pointer ? pointer.clientX - frameRect.left : imageRect.left + imageRect.width / 2;
      const localY = pointer ? pointer.clientY - frameRect.top : imageRect.top + imageRect.height / 2;
      const nx = kit.clamp((localX - imageRect.left) / imageRect.width);
      const ny = kit.clamp((localY - imageRect.top) / imageRect.height);
      const crop = Math.max(36, Math.min(image.naturalWidth, image.naturalHeight) * .22);
      const sx = Math.max(0, Math.min(image.naturalWidth - crop, nx * image.naturalWidth - crop / 2));
      const sy = Math.max(0, Math.min(image.naturalHeight - crop, ny * image.naturalHeight - crop / 2));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, sx, sy, crop, crop, 0, 0, canvas.width, canvas.height);
      canvas.dataset.sample = `${side}:${lensMode}:${Math.round(nx * 1000)}:${Math.round(ny * 1000)}`;
    };
    if (image.complete && image.naturalWidth) draw(); else image.addEventListener("load", draw, { once: true });
    document.getElementById("lensLabel").textContent = lensMode === "albedo" ? "ALBEDO / RETINEX" : "NORMAL / GRADIENT";
    materialLens.querySelector(".lens-source").textContent = side === "before" ? copy("调整前", "調整前", "BEFORE") : copy("调整后", "調整後", "DIRECTED");
  }
  frame.addEventListener("pointermove", event => {
    if (!materialLens.classList.contains("visible")) return;
    const rect = frame.getBoundingClientRect();
    lensPointer = { clientX: event.clientX, clientY: event.clientY };
    materialLens.style.left = `${event.clientX - rect.left}px`; materialLens.style.top = `${event.clientY - rect.top}px`;
    updateLens(lensPointer);
  });

  function layout() {
    if (!caseData) return;
    const source = caseData.before.source;
    const rect = kit.imageRect(frame, source.width, source.height);
    [beforeImage, afterImage, depthCanvas, gaze, composition, objects].forEach(element => kit.applyImageRect(element, rect));
    renderRegions(rect); renderComposition(rect); renderGaze(gazeProgress);
  }
  function renderRegions(rect) {
    if (!caseData) return;
    const side = Number(range.value) >= 50 ? "before" : "after";
    const source = caseData[side].source;
    const faceRegions = ((caseData[side].face_analysis || {}).faces || []).map(face => ({ id: face.id, label: "face_candidate", bbox: face.bbox, kind: "face", confidence: .72 }));
    const regions = [...faceRegions, ...(caseData[side].regions || [])];
    objects.innerHTML = regions.slice(0, 12).map(region => {
      const box = kit.pixelBoxToCss(region.bbox, source, { left: 0, top: 0, width: rect.width, height: rect.height });
      return `<i class="detected-region ${region.kind || "shape"}" style="left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px"><b>${region.label}</b><small>${Math.round((region.confidence || 0) * 100)}</small></i>`;
    }).join("");
  }
  function spiralPath(orientation) {
    const base = "M100 61.8C100 27.7 72.3 0 38.2 0C17.1 0 0 17.1 0 38.2C0 51.2 10.6 61.8 23.6 61.8C31.7 61.8 38.2 55.3 38.2 47.2C38.2 42.2 34.2 38.2 29.2 38.2C26.1 38.2 23.6 40.7 23.6 43.8";
    const transforms = { top_left: "", top_right: "translate(100 0) scale(-1 1)", bottom_left: "translate(0 100) scale(1 -1)", bottom_right: "translate(100 100) scale(-1 -1)" };
    return { d: base, transform: transforms[orientation] || "" };
  }
  function renderComposition() {
    if (!caseData) return;
    const data = Number(range.value) >= 50 ? caseData.before.composition : caseData.after.composition;
    const width = caseData.before.source.width, height = caseData.before.source.height;
    const xA = data && data.anchor ? data.anchor.x / width * 100 : 38.2;
    const yA = data && data.anchor ? data.anchor.y / height * 100 : 38.2;
    composition.querySelector(".golden-lines").setAttribute("d", "M38.2 0V100M61.8 0V100M0 38.2H100M0 61.8H100");
    const spiral = spiralPath(data && data.orientation);
    composition.querySelector(".golden-spiral").setAttribute("d", spiral.d); composition.querySelector(".golden-spiral").setAttribute("transform", spiral.transform);
    const anchor = composition.querySelector(".composition-anchor"); anchor.style.left = `${xA}%`; anchor.style.top = `${yA}%`; anchor.title = `${Math.round((data && data.confidence || 0) * 100)}%`;
  }
  function drawDepth() {
    if (!caseData) return;
    const side = Number(range.value) >= 50 ? "before" : "after";
    const source = caseData[side];
    const artifact = source.artifacts && source.artifacts.depth;
    if (artifact) {
      const image = new Image(); image.onload = () => { depthCanvas.width = source.source.width; depthCanvas.height = source.source.height; depthCanvas.getContext("2d").drawImage(image, 0, 0); }; image.src = `/${artifact.path || artifact}`;
      return;
    }
    const sourceImage = side === "before" ? beforeImage : afterImage;
    const width = 384, height = Math.round(width * source.source.height / source.source.width);
    depthCanvas.width = width; depthCanvas.height = height;
    const context = depthCanvas.getContext("2d", { willReadFrequently: true }); context.drawImage(sourceImage, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height), data = pixels.data, gray = new Float32Array(width * height);
    for (let p = 0; p < gray.length; p += 1) { const i = p * 4; gray[p] = .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2]; }
    for (let y = 1; y < height - 1; y += 1) for (let x = 1; x < width - 1; x += 1) { const p = y * width + x, edge = Math.abs(gray[p + 1] - gray[p - 1]) + Math.abs(gray[p + width] - gray[p - width]), value = Math.round(255 * kit.clamp(.55 * Math.pow(y / height, 1.25) + .3 * edge / 128 + .15 * (1 - gray[p] / 255))), i = p * 4; data[i] = value; data[i + 1] = value; data[i + 2] = value; data[i + 3] = 255; }
    context.putImageData(pixels, 0, 0);
  }
  function renderSlider() {
    if (!caseData) return;
    const t = 1 - Number(range.value) / 100;
    const penalties = scorePenalty[caseId] || [10, 10, 10, 10];
    afterScores.forEach((score, index) => {
      const value = Math.round(kit.lerp(score - penalties[index], score, t));
      document.getElementById(`score${index}`).textContent = value; document.getElementById(`bar${index}`).style.width = `${value}%`;
    });
    const average = afterScores.reduce((sum, score, index) => sum + kit.lerp(score - penalties[index], score, t), 0) / afterScores.length;
    document.getElementById("grade").textContent = kit.gradeForScore(average);
    const verdict = document.getElementById("verdict");
    verdict.textContent = kit.interpolateText(beforeVerdicts[caseId] || afterVerdict, afterVerdict, t);
    verdict.style.setProperty("--dissolve", String(Math.abs(.5 - t) * 2));
    kit.drawHistogram(histogramCanvas, caseData.before.histogram, caseData.after.histogram, t, {
      meanLabel: copy("均值", "平均", "MEAN"),
      xLabel: copy("明度 0–255", "明度 0–255", "VALUE 0–255"),
      yLabel: copy("相对频数", "相対度数", "REL. FREQ."),
      fontSize: zh ? 18 : ja ? 13 : 9,
      fontFamily: zh || ja ? '"PingFang SC", "Yu Gothic UI", "Microsoft YaHei UI", sans-serif' : undefined,
      fill: "rgba(215,255,63,.44)", stroke: "#171717", marker: "#ff5b38"
    });
    gaze.style.setProperty("--split", `${range.value}%`);
    renderRegions(kit.imageRect(frame, caseData.before.source.width, caseData.before.source.height)); renderComposition(); updateLens(lensPointer); drawDepth();
  }

  function gazePath(points, source) {
    if (!points.length) return ""; const normalized = points.map(point => ({ x: point.x / source.width * 100, y: point.y / source.height * 100 }));
    let path = `M${normalized[0].x} ${normalized[0].y}`;
    for (let i = 0; i < normalized.length - 1; i += 1) { const p0 = normalized[Math.max(0, i - 1)], p1 = normalized[i], p2 = normalized[i + 1], p3 = normalized[Math.min(normalized.length - 1, i + 2)]; path += ` C${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`; }
    return path;
  }
  function paintGazeBlur(canvas, sourceImage, source, points, progress) {
    const width = 384;
    const height = Math.max(1, Math.round(width * source.source.height / source.source.width));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
    if (progress >= .96 || !sourceImage.complete) return;
    context.save();
    context.filter = "blur(9px) saturate(.72)";
    context.drawImage(sourceImage, -9, -9, width + 18, height + 18);
    context.restore();
    const scaled = progress * points.length;
    const activeIndex = Math.min(points.length - 1, Math.floor(scaled));
    const step = scaled - Math.floor(scaled);
    const displayWidth = canvas.getBoundingClientRect().width || width;
    const minimum = 10 * width / displayWidth;
    const maximum = Math.hypot(width, height) * .46;
    const radius = minimum + (maximum - minimum) * Math.pow(Math.min(.94, (activeIndex + step) / Math.max(1, points.length)), 1.28);
    context.save();
    context.globalCompositeOperation = "destination-out";
    points.slice(0, activeIndex + 1).forEach((point, index) => {
      const x = point.x / source.source.width * width;
      const y = point.y / source.source.height * height;
      const pointRadius = Math.max(minimum, radius * (index === activeIndex ? 1 : .72));
      const gradient = context.createRadialGradient(x, y, Math.min(minimum, pointRadius * .42), x, y, pointRadius);
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(.42, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.beginPath(); context.arc(x, y, pointRadius, 0, Math.PI * 2); context.fill();
    });
    context.restore();
  }
  function renderGaze(value) {
    if (!caseData) return;
    gazeProgress = kit.clamp(value);
    gaze.style.setProperty("--path-progress", String(Math.min(1, gazeProgress * 1.18)));
    gaze.style.setProperty("--split", `${range.value}%`);
    [["before", beforeImage], ["after", afterImage]].forEach(([sideName, sourceImage]) => {
      const side = caseData[sideName];
      const points = side.saliency || [];
      const layer = gaze.querySelector(`[data-gaze-side="${sideName}"]`);
      if (!points.length || !layer) return;
      const activeIndex = Math.min(points.length - 1, Math.floor(gazeProgress * points.length));
      layer.querySelector(".gaze-path").setAttribute("d", gazePath(points, side.source));
      layer.querySelector(".gaze-points").innerHTML = points.map((point, index) => `<circle cx="${point.x / side.source.width * 100}" cy="${point.y / side.source.height * 100}" r="${index ? .68 : 1.08}" class="${index <= activeIndex ? "seen" : ""}"/>`).join("");
      paintGazeBlur(layer.querySelector("canvas"), sourceImage, side, points, gazeProgress);
    });
    gaze.dataset.clear = gazeProgress >= .96 ? "true" : "false";
    player.querySelector(".gaze-scrub").value = Math.round(gazeProgress * 1000);
    player.querySelector(".gaze-time").textContent = `00:${String(Math.round(gazeProgress * 8)).padStart(2, "0")}`;
  }
  function gazeTick(now) { if (!gazeRunning) return; renderGaze((now - gazeStarted) / 8000); if (gazeProgress >= 1) { gazeRunning = false; player.querySelector("button").textContent = copy("重播", "もう一度", "Replay"); return; } gazeFrame = requestAnimationFrame(gazeTick); }
  function playGaze() { if (gazeProgress >= 1) gazeProgress = 0; gazeRunning = true; gazeStarted = performance.now() - gazeProgress * 8000; player.querySelector("button").textContent = copy("暂停", "一時停止", "Pause"); gazeFrame = requestAnimationFrame(gazeTick); }
  function pauseGaze() { gazeRunning = false; cancelAnimationFrame(gazeFrame); player.querySelector("button").textContent = copy("播放", "再生", "Play"); }
  player.querySelector("button").onclick = () => gazeRunning ? pauseGaze() : playGaze(); player.querySelector("input").oninput = event => { pauseGaze(); renderGaze(Number(event.target.value) / 1000); };

  async function bindCase() {
    caseId = selectedCase(); caseData = manifest && manifest.cases[caseId === "game" ? "game_ui" : caseId]; if (!caseData) return;
    afterScores = directedScores[caseId] || [0, 1, 2, 3].map(index => Number(document.getElementById(`score${index}`).textContent)); afterVerdict = ja ? japaneseDirectedVerdicts[caseId] : document.getElementById("verdict").textContent;
    layout(); renderSlider(); renderGaze(0);
  }
  range.addEventListener("input", () => { if (!document.body.classList.contains("upload-mode")) renderSlider(); });
  window.addEventListener("resize", () => { if (!document.body.classList.contains("upload-mode")) layout(); });
  document.querySelectorAll("[data-case]").forEach(button => button.addEventListener("click", () => { if (!document.body.classList.contains("upload-mode")) setTimeout(bindCase, 760); }));
  document.querySelector('[data-layer="3"]').addEventListener("click", () => setTimeout(() => viewport.classList.contains("show-gaze") ? playGaze() : pauseGaze(), 0));
  fetch("/analysis-data/manifest.json").then(response => response.json()).then(data => { manifest = data; if (!document.body.classList.contains("upload-mode")) bindCase(); }).catch(error => console.warn("Romanjo analysis manifest unavailable", error));
  const header = document.querySelector("header");
  document.querySelector(".model-note").textContent = copy("浏览器端以可复算的像素测量呈现深度、材质与注视线索；每项结论标明方法、范围与置信度。", "ブラウザ上の再計算可能な画素測定で、奥行き、素材、視線の手掛かりを示します。各判断には方法、範囲、確度を添えます。", "Reproducible browser-side pixel measurements surface depth, material and attention cues; every judgment states its method, scope and confidence.");
  const logo = header.querySelector(".logo");
  logo.innerHTML = `<img src="/assets/romanjo-logo.png" alt="Romanjo">`;
  header.querySelector("a:last-child").outerHTML = `<nav class="locale-nav" aria-label="Language"><a href="/">EN</a><a href="/zh/">中</a><a href="/ja/">日</a></nav>`;
  header.insertAdjacentHTML("afterend", `<nav class="side-nav" aria-label="${copy("页内导航", "ページ内ナビゲーション", "Page sections")}"><a href="#top">01 <span>${copy("首页", "トップ", "TOP")}</span></a><a href="#demo">02 <span>${copy("演示", "レビュー", "REVIEW")}</span></a><a href="#voices">03 <span>${copy("留言", "対話", "VOICES")}</span></a><a href="#pricing">04 <span>${copy("方案", "プラン", "ACCESS")}</span></a></nav>`);
  const manifesto = document.createElement("section"); manifesto.className = "manifesto";
  manifesto.innerHTML = zh ? `<div class="manifesto-kicker">ROMANJO / ART, RIGHTS, MEASURE</div><div class="manifesto-title"><h2>尊重作品，也尊重作品背后的人。</h2><p>Romanjo 记录来源、修改和判断。系统可以找相似、标出结构、提出风险，但不能替人裁定抄袭，也不能把一种画风据为己有。</p></div><div class="manifesto-grid"><article><b>01 / 人类版权</b><h3>作者先于算法</h3><p>艺术家可以登记作品、补充创作过程、提交反证。来源记录和申诉会留在同一条证据链里。</p></article><article><b>02 / 量化艺术</b><h3>数字负责说明，不负责盖章</h3><p>框、距离、色彩和相似度帮助你复核。审美判断仍要结合任务、语境和创作者意图。</p></article><article><b>03 / OPC</b><h3>一个负责人，一组可审计的 Agent</h3><p>小团队也能完成分析、评审和交付。人决定方向，Agent 处理重复工作，每次修改都能追溯和撤回。</p></article></div><div class="manifesto-close"><p>我们邀请艺术家、评论家、研究者和品牌一起建立审美 Benchmark。你可以投稿作品、指出误判、认领来源，也可以冠名一个公开评测专题。</p><a href="https://github.com/Hikohikoyan/romanjo-art-qa/issues">进入艺术鉴赏与 Benchmark 共建 ↗</a></div>` : `<div class="manifesto-kicker">ROMANJO / ART, RIGHTS, MEASURE</div><div class="manifesto-title"><h2>Respect the work and the person behind it.</h2><p>Romanjo records provenance, edits and judgment. It can surface similarity and risk evidence. A person still decides authorship, infringement and artistic intent.</p></div><div class="manifesto-grid"><article><b>01 / HUMAN RIGHTS</b><h3>The artist comes first</h3><p>Artists can register work, attach process records and challenge a result. Claims and counter-evidence share one trace.</p></article><article><b>02 / QUANTIFIED ART</b><h3>Numbers explain. People judge.</h3><p>Boxes, distances, color and similarity support review. Context, purpose and the maker's intent remain part of the decision.</p></article><article><b>03 / OPC</b><h3>One accountable owner, auditable agents</h3><p>A small studio can analyze, review and deliver. A person sets direction while agents handle repeatable work with rollback.</p></article></div><div class="manifesto-close"><p>Artists, critics, researchers and brands can build the public aesthetic benchmark with us through submissions, corrections and sponsored evaluation tracks.</p><a href="https://github.com/Hikohikoyan/romanjo-art-qa/issues">Join the art review benchmark ↗</a></div>`;
  if (zh) manifesto.innerHTML = `<div class="manifesto-kicker">ROMANJO / ART, RIGHTS, MEASURE</div><div class="manifesto-title"><h2>尊重作品，也尊重作品背后的人。</h2><p>Romanjo 把来源、修改与判断放在同一条证据链上。相似、结构与风险可以被测量，作者身份、挪用关系与艺术意图必须回到作品语境中复核。</p></div><div class="manifesto-grid"><article><b>01 / 人类版权</b><h3>作者先于算法</h3><p>艺术家可以登记作品、补充创作过程、提交反证。主张、异议与修订共享一份可追溯记录。</p></article><article><b>02 / 量化艺术</b><h3>数字让判断更具体</h3><p>框线、距离、色彩与相似度构成复核证据。评论必须说明任务、形式选择、观看经验和作者意图。</p></article><article><b>03 / OPC</b><h3>一个负责人，一组可审计的 Agent</h3><p>人确定方向和取舍，Agent 承担测量、整理与版本工作。每次修改都有出处，也有撤回路径。</p></article></div><div class="manifesto-close"><p>我们邀请艺术家、评论家、研究者与品牌共同建立审美 Benchmark。投稿作品、指出误判、认领来源，或发起一项有明确议题的公开评测。</p><a href="https://github.com/Hikohikoyan/romanjo-art-qa/issues">进入艺术鉴赏与 Benchmark 共建 ↗</a></div>`;
  if (ja) manifesto.innerHTML = `<div class="manifesto-kicker">ROMANJO / ART, RIGHTS, MEASURE</div><div class="manifesto-title"><h2>作品と、その背後にいる人を尊重する。</h2><p>Romanjo は出典、修正、判断を一つの証拠系に記録します。類似性や構造は測定できますが、作者性、引用関係、芸術的意図は作品の文脈で検証します。</p></div><div class="manifesto-grid"><article><b>01 / ARTIST RIGHTS</b><h3>作者が先にある</h3><p>制作過程の追加、異議、反証を同じ履歴に残します。判断は訂正でき、その経緯も失いません。</p></article><article><b>02 / QUANTIFIED ART</b><h3>数値で批評を具体化する</h3><p>構図、距離、色、類似性を検証材料にします。目的、形式、鑑賞経験、作者の意図まで含めて論じます。</p></article><article><b>03 / OPC</b><h3>一人の責任者と監査可能な Agent</h3><p>人が方向と採否を決め、Agent が測定、整理、版管理を担います。変更には根拠と撤回経路があります。</p></article></div><div class="manifesto-close"><p>作家、批評家、研究者、ブランドと公開 Benchmark を育てます。作品投稿、誤判定の指摘、出典の申告、明確な論点を持つ評価企画を歓迎します。</p><a href="https://github.com/Hikohikoyan/romanjo-art-qa/issues">公開レビューに参加する ↗</a></div>`;
  document.querySelector("main").appendChild(manifesto);
  const voices = document.createElement("section"); voices.className = "voices"; voices.id = "voices";
  voices.innerHTML = `<div class="voices-copy"><span>ROMANJO / OPEN CRIT</span><h2>${copy("下一步，哪一处判断最值得继续推进？", "次に深めるべき判断は、どこにありますか。", "Which judgment should we sharpen next?")}</h2><p>${copy("写下一条具体意见。内容只保存在此浏览器；愿意公开讨论时，可以把它带到开源社区。", "具体的な意見を一つ残してください。内容はこのブラウザだけに保存され、公開する場合はオープンコミュニティへ持ち込めます。", "Leave one specific observation. It stays in this browser unless you choose to take it into the open community.")}</p></div><form class="voices-form" id="anonymousFeedback"><label for="feedbackText">${copy("匿名留言", "匿名コメント", "Anonymous note")}</label><textarea id="feedbackText" required maxlength="800" placeholder="${copy("例如：人物案例的第一注视点仍然太靠近画面中心。", "例：人物作例の最初の注視点が、まだ中央に寄りすぎています。", "For example: the first fixation in the portrait still sits too close to center.")}"></textarea><div><select id="feedbackTopic" aria-label="${copy("讨论方向", "議題", "Topic")}"><option>${copy("视觉运动", "視線移動", "Visual motion")}</option><option>${copy("材质与光线", "素材と光", "Material and light")}</option><option>${copy("构图与节奏", "構図とリズム", "Composition and rhythm")}</option><option>${copy("评论与评分", "批評と採点", "Critique and score")}</option></select><button type="submit">${copy("留下意见", "意見を残す", "Leave the note")}</button></div></form><aside class="invite-card" hidden><span>ROMANJO ART QA</span><h3>${copy("把这一条意见变成公开议题。", "この意見を公開の論点にする。", "Turn this note into a public question.")}</h3><p>${copy("在 Issue 里补上作品、判断依据和你期待的改法，让艺术家、评价者与设计实践者一起回应。", "Issue に作品、判断根拠、望む修正を添え、作家、批評家、デザイン実務者と検討できます。", "Add the work, your evidence and the change you expect. Artists, critics and design practitioners can respond.")}</p><a href="https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose">${copy("带着意见进入开源社区 ↗", "オープンコミュニティへ ↗", "Take it to the open community ↗")}</a></aside>`;
  voices.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    const text = voices.querySelector("textarea").value.trim();
    if (!text) return;
    let notes = [];
    try { notes = JSON.parse(localStorage.getItem("romanjo-anonymous-feedback") || "[]"); } catch (_) { notes = []; }
    notes.push({ text, topic: voices.querySelector("select").value, locale, created_at: new Date().toISOString() });
    localStorage.setItem("romanjo-anonymous-feedback", JSON.stringify(notes.slice(-20)));
    voices.querySelector(".invite-card").hidden = false;
    voices.querySelector("button").textContent = copy("已保存在此浏览器", "このブラウザに保存しました", "Saved in this browser");
  });
  document.querySelector("main").appendChild(voices);
  const pricing = document.createElement("section"); pricing.className = "pricing"; pricing.id = "pricing";
  const tiers = zh ? [
    ["FREE", "¥0", "永久免费", "看懂一张图", ["结构化 Romanjo Art QA", "只读组件与 HTML 样例", "有限构图、显著性与直方图", "社区艺术鉴赏 Benchmark"], "使用开源 Skill", "free"],
    ["PLUS", "¥49", "一次性", "把评价变成可编辑决策", ["完整 Review 控制点", "添加、编辑与评论", "版本对比与决策回溯", "生成器约束导出"], "获取创作者工作台", "plus"],
    ["PRO", "¥299", "/ 月", "建立你的审美工作流", ["专业生成适配与批量评审", "私有评价规则和项目知识", "反馈数据集与候选风格包", "受控 LoRA 实验与评测"], "申请专业版", "pro"],
    ["EXPERT", "¥998", "/ 月起", "拥有一位可追溯的主美 Agent", ["私有 LoRA 与审美知识库", "创意总监 / 主美 Agent", "团队 Human Gate 与回滚", "企业交付与艺术家权益支持"], "预约专家合作", "expert"]
  ] : [
    ["FREE", "¥0", "forever", "Understand one image", ["Structured Romanjo Art QA", "Read-only component and HTML sample", "Limited composition and saliency", "Community art benchmark"], "Use the open skill", "free"],
    ["PLUS", "¥49", "one-time", "Turn critique into editable decisions", ["Full review control points", "Add, edit and comment", "Version comparison and trace", "Generator constraint export"], "Get the creator workbench", "plus"],
    ["PRO", "¥299", "/ month", "Build your aesthetic workflow", ["Professional adapters and batch review", "Private rules and project knowledge", "Feedback datasets and style candidates", "Governed LoRA experiments"], "Apply for Pro", "pro"],
    ["EXPERT", "¥998", "/ month from", "A traceable lead-artist agent", ["Private LoRA and aesthetic knowledge", "Creative-director agent", "Team Human Gates and rollback", "Enterprise delivery and artist rights"], "Book an expert partnership", "expert"]
  ];
  if (ja) tiers.splice(0, tiers.length,
    ["FREE", "¥0", "ずっと無料", "一枚を読み解く", ["構造化 Romanjo Art QA", "読取専用コンポーネント", "限定的な構図・顕著性・ヒストグラム", "公開アート Benchmark"], "オープン Skill を使う", "free"],
    ["PLUS", "¥49", "買い切り", "批評を編集可能な判断へ", ["Review コントロールポイント", "追加・編集・コメント", "版比較と判断履歴", "生成制約の書き出し"], "ワークベンチを入手", "plus"],
    ["PRO", "¥299", "/ 月", "自分の審美ワークフロー", ["生成連携と一括レビュー", "非公開ルールと案件知識", "フィードバックデータセット", "管理された LoRA 評価"], "PRO を申し込む", "pro"],
    ["EXPERT", "¥998", "/ 月から", "追跡可能なリードアーティスト Agent", ["非公開 LoRA と審美知識", "クリエイティブディレクター Agent", "Human Gate とロールバック", "企業納品と作家権利支援"], "相談を予約する", "expert"]
  );
  pricing.innerHTML = `<div class="pricing-head"><span>ROMANJO / ACCESS LEVELS</span><h2>${zh ? "从看懂，到拥有自己的主美。" : "From seeing clearly to owning your lead artist."}</h2><p>${zh ? "每一档对应一层清楚的决策责任。模型、数据和训练候选都保留来源、批准人和回滚路径。" : "Each level carries a clear decision scope. Models, data and candidates retain provenance, approval and rollback."}</p></div><div class="pricing-grid">${tiers.map((tier,index)=>`<article class="price-tier ${tier[6]}"><div class="tier-index">0${index+1}</div><h3>${tier[0]}</h3><p class="tier-lead">${tier[3]}</p><div class="tier-price"><b>${tier[1]}</b><span>${tier[2]}</span></div><ul>${tier[4].map(item=>`<li>${item}</li>`).join("")}</ul><a href="mailto:hello@romanjo.art?subject=Romanjo%20${tier[0]}">${tier[5]}<span>↗</span></a></article>`).join("")}</div><p class="pricing-note">${zh ? "训练完成不等于上线。PRO 与 EXPERT 候选必须通过评测与人工批准。" : "Training is not release. PRO and EXPERT candidates require evaluation and human approval."}</p>`;
  if (zh) pricing.querySelector(".pricing-note").textContent = "PRO 与 EXPERT 的训练候选经过独立评测与主美批准后，才会进入发布清单。";
  if (ja) {
    pricing.querySelector(".pricing-head h2").textContent = "見ることから、自分のリードアーティストを持つことへ。";
    pricing.querySelector(".pricing-head p").textContent = "各プランは判断の範囲を明確にします。モデル、データ、学習候補には出典、承認者、ロールバックを残します。";
    pricing.querySelector(".pricing-note").textContent = "PRO と EXPERT の学習候補は、評価とリードアーティストの承認を経てリリース一覧に入ります。";
  }
  document.querySelector("main").appendChild(pricing);
}());

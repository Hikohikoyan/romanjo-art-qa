(function () {
  "use strict";
  const q = selector => document.querySelector(selector);
  const qa = selector => [...document.querySelectorAll(selector)];
  const cases = {
    INTERIOR: ["空間は物の集合ではなく、視覚的な重さの関係である。", "右側の収納の重さを抑え、錆色の椅子を唯一の色彩アンカーにする。", "静けさ · 温もり · 滞在感 · 節度"],
    PHOTO: ["技術性は場面に残し、人物には現実の光を戻す。", "光管は残し、逆光、輪郭光、キャッチライト、湿度の連続で人物の質感を整える。", "冷静 · 孤独 · 雨の直後 · 技術空間の身体"],
    POSTER: ["情報は削るのではなく、順序を与える。", "八項目を保ち、題名、日時と場所、活動タグを三段階の読解順序へ組み直す。", "夜 · 集団の熱 · 一時的な集合 · 都市の粗さ"],
    GAME: ["AAA の質感は金枠の数ではなく、世界の一貫性から生まれる。", "情報量は保ち、発光枠を暗い鍛造金属、燻しガラス、低彩度のレアリティ記号へ置き換える。", "危険 · 古代 · 戦闘後の整理 · 次の旅の前"]
  };
  function translateCase() {
    const id = q("#caseId").textContent.split("/")[0].trim();
    const item = cases[id];
    if (!item) return;
    q("#caseTitle").textContent = item[0]; q("#verdict").textContent = item[1]; q("#story").textContent = item[2];
  }
  q(".hero h1").innerHTML = "さらに生成するのではない。<br>存在する価値を決める。";
  q(".hero-foot p").textContent = "Romanjo は認識、奥行き、素材、構図、美術史の視点から AIGC 出力を読み、判断を方向づけられた画像へ変えます。";
  q(".hero-foot a").textContent = "ライブレビューを見る ↓";
  q(".demo-head>p").textContent = "作例を選び、分析チャンネルを開くか、比較スライダーを動かしてください。";
  q(".visual-tools>span").textContent = "分析チャンネル";
  ["物体", "奥行き", "素材ルーペ", "視線移動", "構図"].forEach((text, index) => { qa("[data-layer]")[index].textContent = text; });
  ["インテリア", "AIGC 写真", "ソーシャルポスター", "ゲーム UI"].forEach((text, index) => { qa(".case-tabs span")[index].textContent = text; });
  q(".tag.before").textContent = "調整前"; q(".tag.after").textContent = "調整後"; q(".grade small").textContent = "判断";
  ["構図", "空間 / 情報の奥行き", "素材の質", "目的との一致"].forEach((text, index) => { qa(".metrics span")[index].textContent = text; });
  q(".story>span").textContent = "物語と雰囲気";
  q(".model-note").textContent = "奥行き、素材、視線移動はブラウザ上の決定論的な画像解析と操作デモです。測定方法と根拠を明示します。";
  q(".channel-readout>div>span").textContent = "明度分布 · 256 bins";
  q("#albedoLens").textContent = "アルベドルーペ"; q("#normalLens").textContent = "法線ルーペ";
  qa("[data-case]").forEach(button => button.addEventListener("click", () => setTimeout(translateCase, 820)));
  translateCase();
}());

<div align="center">

# Romanjo Art QA

**Do not generate more.**<br>
**Decide what deserves to exist.**

Romanjo reads AIGC output through recognition, depth, material, composition and art-historical lenses, then turns judgment into a directed image.

[![License: MIT](https://img.shields.io/badge/License-MIT-111111.svg)](LICENSE)
[![Agent Skill](https://img.shields.io/badge/Agent-Skill-d7ff3f.svg)](SKILL.md)
[![Offline demo](https://img.shields.io/badge/Demo-Offline-f2f1ec.svg)](assets/demo.html)
[![Issues](https://img.shields.io/github/issues/Hikohikoyan/romanjo-art-qa.svg)](https://github.com/Hikohikoyan/romanjo-art-qa/issues)

[English](#english) · [中文](#中文) · [日本語](#日本語)

</div>

---

## English

Romanjo Art QA is an open Agent Skill and a reduced, read-only review kit. Give it an image and receive structured observations about visual hierarchy, likely attention, composition, color, depth, material, atmosphere and revision direction.

It helps you inspect a result before you spend another generation on it.

### What it returns

| Review channel | Output |
| --- | --- |
| Recognition | Visible subjects, regions, relationships and hierarchy |
| Attention | Likely first fixation, secondary points and gaze order |
| Composition | Structural lines, balance, rhythm and evidence-backed golden-ratio hypotheses |
| Color | Palette roles, value distribution, contrast and histogram data |
| Depth & material | Semantic depth layers and visible surface cues |
| Direction | A concise judgment with testable revision guidance |

The result follows a portable JSON schema. Evidence and interpretation stay separate, so another person can inspect the basis of a comment.

### Quick start

Ask your agent to install this repository as a skill:

```text
Install and use the Romanjo Review skill from
https://github.com/Hikohikoyan/romanjo-art-qa
```

Or clone it into your agent's skill directory:

```bash
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-review
```

Then attach an image and ask:

```text
Review this image with Romanjo. Return concise findings and valid review JSON.
```

### Open the free demo

```bash
python -m http.server 8000 --directory assets
```

Open `http://127.0.0.1:8000/demo.html`.

The demo stays in your browser and renders a supplied review artifact. It does not call a provider, edit control points or train on artwork.

### Public scope

This repository includes:

- the `romanjo-review` Agent Skill;
- a documented review schema and field guide;
- a reduced read-only HTML kit;
- a sample review and public provenance protocol;
- Issue forms for art submissions, benchmark cases, artist-rights corrections and false positives.

The private workbench, commercial MCP, internal evaluation rules, provider integrations, training systems and proprietary aesthetic knowledge are not published here.

### Art, attribution and AI remix risk

Romanjo can organize Content Credentials, creator declarations, source records and visual-similarity leads. A reviewer can use that evidence to investigate attribution or possible uncredited remixing.

Similarity does not prove copying. A detector score does not identify an artist or settle copyright. Every contested result needs human review, counter-evidence and a correction path. Read the [public evidence protocol](references/provenance-and-similarity.md).

### Community benchmark

[GitHub Issues](https://github.com/Hikohikoyan/romanjo-art-qa/issues) are the public review room. You can:

- submit rights-cleared artwork for critique;
- propose a difficult benchmark case and its expected evidence;
- report a false positive or attribution problem;
- join the artist, critic, curator or researcher network;
- propose a named benchmark track, exhibition or sponsorship.

Sponsors can fund a track. They cannot buy its labels, thresholds or outcome.

### Access

| Plan | Best for | Scope |
| --- | --- | --- |
| **FREE** | Artists, learners and public reviewers | Open Skill, schema, read-only kit and community benchmark |
| **PLUS · ¥49 once** | Individual creators | Editable review controls, comments, comparisons and export |
| **PRO · ¥299/month** | Professionals and small teams | Reusable direction, project history, collaboration and production adapters |
| **EXPERT · from ¥998/month** | Studios and enterprises | Private aesthetic knowledge, tailored agents, governance and delivery support |

Commercial access is available by invitation. Open a [partnership Issue](https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose) without posting confidential material.

### Repository map

```text
SKILL.md                         Agent workflow
references/review-schema.json   Portable output contract
references/field-guide.md       Public field semantics
references/provenance-and-similarity.md
                                 Rights-aware evidence protocol
assets/demo.html                Offline read-only example
assets/components/              Reusable public renderer
.github/ISSUE_TEMPLATE/         Submission and governance forms
```

### Security

Review any Agent Skill before installation. This Skill does not need credentials for its public workflow. Do not submit private client work, personal data, unpublished datasets, secrets or artwork you cannot share. Report vulnerabilities through [SECURITY.md](SECURITY.md), not a public Issue.

### Contributing

Artists, critics, curators, designers, researchers and engineers are welcome. Start with the matching Issue form and read [CONTRIBUTING.md](CONTRIBUTING.md). Artwork keeps its stated rights; opening an Issue does not grant model-training permission.

---

## 中文

<details open>
<summary><strong>阅读中文说明</strong></summary>

### 少生成。先决定什么值得存在。

Romanjo Art QA 是一个开放的 Agent Skill，也是一套经过裁剪的只读评审组件。你给它一张图片，它会从识别、视觉注意、构图、色彩、深度、材质和艺术史参照几个角度整理可复核的观察，再给出明确的修改方向。

它解决的是生成之后的问题：这张图哪里成立，哪里拖累了表达，下一次修改该动什么。

#### 能得到什么

| 评审通道 | 输出 |
| --- | --- |
| 识别 | 主体、区域、空间关系与视觉层级 |
| 注意 | 第一眼落点、次级焦点与可能的浏览顺序 |
| 构图 | 结构线、平衡、节奏，以及有画面依据的黄金比例假设 |
| 色彩 | 配色角色、明度分布、对比与直方图数据 |
| 深度与材质 | 语义深度层和画面中可见的表面线索 |
| 修改方向 | 一条简洁判断和可以验收的修改建议 |

结果遵循公开 JSON Schema。观察证据和解释分开记录，评论不靠一句模糊的“高级感”。

#### 快速使用

把下面这句话发给支持 Skill 的 Agent：

```text
请从 https://github.com/Hikohikoyan/romanjo-art-qa
安装 Romanjo Review Skill，并用它评审我提供的图片。
```

也可以手动克隆：

```bash
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-review
```

运行免费示例：

```bash
python -m http.server 8000 --directory assets
```

打开 `http://127.0.0.1:8000/demo.html`。示例只在浏览器里渲染既有评审数据，不调用生成服务，不编辑商业控制点，也不拿作品训练。

#### 开放范围

仓库公开 Skill、评审数据格式、字段说明、只读前端示例和来源证据协议。商业工作台、MCP、内部评分规则、供应商接入、训练闭环和私有审美知识不在本仓库公开。

#### 艺术家权益与 AI 融图风险

Romanjo 可以整理内容凭证、作者声明、来源记录和视觉相似候选，帮助评价者调查署名问题或未披露的融图风险。

相似不等于抄袭。检测分数不能确认作者，也不能代替版权判断。争议结果必须允许人工复核、补充反证和更正。具体规则见[公开证据协议](references/provenance-and-similarity.md)。

#### 一起建设审美 Benchmark

[Issues](https://github.com/Hikohikoyan/romanjo-art-qa/issues) 是公开评审室。欢迎提交已获授权的作品、提出难例、纠正误判，也欢迎艺术家、评价家、策展人和研究者共同维护评测专题。

我们接受专题冠名、展览和研究合作。赞助方不能购买标签、阈值或评测结论。

#### 四档方案

| 方案 | 适合谁 | 范围 |
| --- | --- | --- |
| **FREE** | 艺术家、学习者、公开评价者 | 开放 Skill、Schema、只读 Kit、社区 Benchmark |
| **PLUS · ¥49 买断** | 独立创作者 | 可编辑控制点、评论、版本对比和导出 |
| **PRO · ¥299/月** | 专业创作者与小团队 | 项目历史、可复用主美方向、协作和生产适配 |
| **EXPERT · ¥998/月起** | 工作室与企业 | 私有审美知识、定制 Agent、治理和交付支持 |

付费试用、共建或冠名合作请通过[合作 Issue](https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose)联系。不要在公开 Issue 中填写客户资料或其他机密信息。

#### 参与贡献

请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，再选择对应的 Issue 表单。作品版权仍归原权利人；提交 Issue 不代表授权模型训练。

</details>

---

## 日本語

<details open>
<summary><strong>日本語の説明を読む</strong></summary>

### 生成を増やさない。存在する価値のあるものを決める。

Romanjo Art QA は、オープンな Agent Skill と機能を限定した読み取り専用レビュー Kit です。画像を入力すると、認識、視線誘導、構図、色彩、奥行き、素材感、美術史的な参照軸から観察結果を整理し、次の修正方針を構造化します。

目的は画像を量産することではありません。出力のどこが機能し、何が表現を弱め、次に何を直すべきかを確認するための道具です。

#### 得られる内容

| レビュー項目 | 出力 |
| --- | --- |
| 認識 | 被写体、領域、位置関係、視覚的な階層 |
| 注視 | 最初の注視点、補助的な注視点、想定される視線順序 |
| 構図 | 構造線、均衡、リズム、根拠を伴う黄金比の仮説 |
| 色彩 | 配色の役割、明度分布、コントラスト、ヒストグラム |
| 奥行き・素材 | 意味に基づく奥行き層と画面上の表面情報 |
| 修正方針 | 簡潔な判断と検証可能な修正案 |

結果は公開 JSON Schema に従います。観察事実と解釈を分けて記録するため、レビューの根拠を別の人が確認できます。

#### クイックスタート

Skill に対応した Agent へ次のように依頼してください。

```text
https://github.com/Hikohikoyan/romanjo-art-qa から
Romanjo Review Skill を導入し、この画像をレビューしてください。
```

手動で取得する場合：

```bash
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-review
```

無料デモを起動する場合：

```bash
python -m http.server 8000 --directory assets
```

`http://127.0.0.1:8000/demo.html` を開いてください。デモは既存のレビュー結果をブラウザ内で表示します。生成サービスの呼び出し、商用コントロールの編集、作品を使った学習は行いません。

#### 公開範囲

このリポジトリには Skill、レビュー形式、フィールドガイド、読み取り専用 UI の例、来歴と類似性に関する公開手順が含まれます。商用ワークベンチ、MCP、非公開の評価基準、プロバイダー連携、学習機構、独自の美的知識は含まれません。

#### 作家の権利と AI 合成リスク

Romanjo は Content Credentials、作家による申告、出典情報、視覚的類似候補を整理できます。評価者はその資料を使い、帰属や無断合成の可能性を調査できます。

類似性は盗用の証明ではありません。検出スコアだけで作家や著作権侵害を断定することもできません。異議のある結果には、人による再確認、反証、訂正手続きを用意します。詳しくは[公開エビデンス手順](references/provenance-and-similarity.md)をご覧ください。

#### 美的評価 Benchmark への参加

[Issues](https://github.com/Hikohikoyan/romanjo-art-qa/issues) を公開レビュー室として運用します。権利を確認した作品の投稿、難しい評価例の提案、誤判定の報告を受け付けています。作家、評論家、キュレーター、研究者による評価トラックの共同運営も歓迎します。

冠名トラック、展覧会、研究協力の相談も受け付けます。スポンサーが評価ラベル、しきい値、結論を購入することはできません。

#### プラン

| プラン | 対象 | 内容 |
| --- | --- | --- |
| **FREE** | 作家、学習者、公開レビュアー | オープン Skill、Schema、読み取り専用 Kit、コミュニティ Benchmark |
| **PLUS · ¥49 買い切り** | 個人クリエイター | 編集可能なコントロール、コメント、比較履歴、書き出し |
| **PRO · ¥299/月** | プロと小規模チーム | 再利用できる方向性、案件履歴、共同レビュー、制作連携 |
| **EXPERT · ¥998/月〜** | スタジオと企業 | 非公開の美的知識、専用 Agent、ガバナンス、納品支援 |

有料版、共同研究、冠名企画については[連携用 Issue](https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose)からお問い合わせください。公開 Issue に機密情報を投稿しないでください。

#### コントリビューション

[CONTRIBUTING.md](CONTRIBUTING.md) を確認し、内容に合う Issue フォームを選んでください。投稿作品の権利は各権利者に残ります。Issue への投稿によってモデル学習を許諾したことにはなりません。

</details>

---

## License

Code and documentation are available under the [MIT License](LICENSE). Artwork, trademarks, personal data and third-party submissions keep their original rights and licenses.

<div align="center">

**Do not generate more. Decide what deserves to exist.**

</div>

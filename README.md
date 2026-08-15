<div align="center">

# Romanjo Art QA

**A render can look finished and still not hold up in review. We want to make that critique visible.**

Romanjo Art QA is a small, open part of [Romanjo Art](https://romanjo.art). We built it for artists, designers, and the people who have to decide which image stays. It returns structured feedback: where attention lands, where composition or color breaks, and what to change next. It does not generate another image, and it does not give a single beauty score. We try not to talk over the people who know the work best.

[![License: MIT](https://img.shields.io/badge/License-MIT-111111.svg)](LICENSE)
[![AI design feedback](https://img.shields.io/badge/AI-design-feedback-d7ff3f.svg)](SKILL.md)
[![Offline demo](https://img.shields.io/badge/Demo-Offline-f2f1ec.svg)](assets/demo.html)
[![Issues](https://img.shields.io/github/issues/Hikohikoyan/romanjo-art-qa.svg)](https://github.com/Hikohikoyan/romanjo-art-qa/issues)

[English](#english) · [中文](#中文) · [日本語](#日本語)

</div>

---

## English

### Why we built this

We are not here to tell artists how to see. We are here to run a careful design review: put the evidence on the table and read the work, not just the render.

**The "looks right, feels wrong" problem.** A scheme can look convincing at first glance and still not hold up the moment you ask how it works. Romanjo is a careful reviewer that goes one image at a time and asks that question.

**The sameness problem.** The pixels are immaculate and the pace is fast, but the feeling is not there. Romanjo separates what the image is actually doing—attention, composition, color, and depth—from what only looks polished.

**The consistency problem.** A jury that changes its mind every day is hard to act on. Romanjo returns the same fields each time and separates what it saw from what it interpreted, so the reasoning can be checked and challenged.

### What we try to record

**Where a work came from.** We do not pretend to know an image's history. We record what remains: signed Content Credentials or C2PA data, the creator's own words, source links, and visual-similarity leads. A lead is not a verdict. Missing metadata means "unknown," not "guilty." The people involved make the final call.

**Who made it.** We only offer artist or work candidates when a lawful, declared reference index exists, and only as open leads—never as a definitive name. Style is not identity. Corrections and counter-evidence stay in the same record, because getting an artist wrong costs trust and money.

**How a team decides.** On the commercial side, we are building a reviewer that remembers past decisions, shows why a similar piece was rejected before, and can disagree with reasons you can inspect. Every change is visible and reversible.

### What is public here

- `SKILL.md`, an agent workflow that returns valid review JSON.
- `references/review-schema.json`, the portable output contract.
- `references/field-guide.md`, plain definitions for each field.
- `references/provenance-and-similarity.md`, the evidence protocol for attribution questions.
- `assets/`, a read-only offline demo and a reusable renderer.
- `start.bat`, a one-click Windows launcher for the offline demo.
- `ROADMAP.md`, the public research and contribution tracks.
- Issue forms for artwork submissions, benchmark cases, attribution corrections and false positives.

The commercial workbench, MCP tools, internal rubrics, provider adapters, training pipeline and private aesthetic knowledge are not published here.

### Quick start

The demo is a set of static files. There is no build step, but Python 3 is required to serve it locally.

One-click launch:

- Windows: double-click `start.bat`.
- macOS / Linux: run `python3 -m http.server 8000 --directory assets`, then open `http://127.0.0.1:8000/demo.html`.

For a local checkout:

```bash
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-art-qa
cd romanjo-art-qa
python3 -m http.server 8000 --directory assets
```

To use the review as an Agent Skill, install it from the repository and attach an image. The result follows the public JSON schema.

### Where the evidence ends

We organize evidence; we do not decide rights. Similarity is a lead. A detector score does not identify an artist or settle copyright. Contested results need a person, a correction path, and room for counter-evidence. Read [provenance-and-similarity.md](references/provenance-and-similarity.md) for the full protocol.

### Build the standard with us

We do not want to run this jury alone. The public review JSON and issue forms are meant to be grown with artists and critics, not handed down.

- Artists: bring rights-cleared work, and let's pin it up and read it together—concept, composition, color, scale, and where it breaks.
- Designers and critics: bring the schemes that look right at first pin-up but don't hold up under questioning; let's agree on the evidence they need to stand.
- Researchers: bring false positives and wrong attributions, and let's keep a public correction record.
- Sponsors: support a named track. Let's keep labels, thresholds, and results independent.

Funding and judgment stay separate.

### The commercial part

This repository is deliberately small. The review-to-edit workbench, team Taste QA, and private adapters live in the commercial product at [romanjo.art](https://romanjo.art). If you want a reviewer that learns how your studio decides, let's talk through a [partnership issue](https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose). Please do not post confidential work publicly.

### Repository map

```text
SKILL.md                           Agent workflow
references/review-schema.json      Portable output contract
references/field-guide.md          Public field definitions
references/provenance-and-similarity.md
                                   Evidence protocol for attribution questions
ROADMAP.md                         Public research and contribution tracks
start.bat                          One-click Windows demo launcher
assets/demo.html                   Offline read-only example
assets/components/                 Reusable public renderer
.github/ISSUE_TEMPLATE/            Submission and governance forms
```

### Security

Review any skill before you install it. This skill does not need credentials for the public workflow. Do not submit private client work, personal data, unpublished datasets, secrets, or artwork you cannot share. Report vulnerabilities through [SECURITY.md](SECURITY.md).

### Contributing

Artists, critics, curators, designers, researchers and engineers are welcome. Start with the matching issue form and read [CONTRIBUTING.md](CONTRIBUTING.md). Artwork keeps its stated rights; opening an issue does not grant model-training permission.

---

## 中文

### 我们为什么做这个

我们不是来教艺术家们怎么看的。我们只想把每一次看图，做成一场小评图：把证据摆到桌上，读作品本身，而不是只看效果图。

**“看起来对，用起来不对”。** 一个方案可以第一眼看成立，一旦追问它怎么用、怎么落地，就站不住脚。Romanjo 是个很谨慎的评审器，一次只看一张，专门问这个。

**看什么都一样。** 像素很干净，速度也很快，但体块、材质、空间关系都像套模板，感觉没跟上。Romanjo 把这张图真正在做的事——焦点、构图、颜色、深度——和“只是精致”的部分分开。

**反馈不稳定。** 一场今天说不对、明天又觉得还行的评图，很难执行。Romanjo 每次都返回相同字段，并把“看到什么”和“怎么解释”分开，方便你核对和反驳。

### 我们想记录什么

**作品的来路。** 我们不敢装作知道一张图的历史。我们只记录还剩下的线索：签名过的 Content Credentials 或 C2PA、创作者自己的话、来源链接、视觉相似候选。线索不是判决；相似不等于抄袭；没有元数据只是“未知”，不是“有问题”。最终判断由作品相关的人来做。

**是谁做的。** 只有存在合法、公开的参考索引时，我们才给出艺术家或作品的候选，而且只作为开放线索，绝不是确定的名字。风格不是身份。更正和反证都留在同一条记录里，因为认错艺术家会损失信任和金钱。

**团队怎么判断。** 商业侧，我们在做一个记得过去决策、能指出上次相似作品为什么被否、并给出可复核理由的评审器。每一步都可查看、可撤销。

### 这里公开了什么

- `SKILL.md`，返回有效评审 JSON 的 Agent 工作流。
- `references/review-schema.json`，可移植的输出契约。
- `references/field-guide.md`，每个字段的公开定义。
- `references/provenance-and-similarity.md`，署名问题的证据协议。
- `assets/`，只读离线示例和可复用渲染组件。
- `start.bat`，Windows 一键启动离线示例。
- `ROADMAP.md`，公开研究与贡献路线。
- 作品投稿、基准案例、署名更正和误判报告的问题表单。

商业工作台、MCP 工具、内部规则、供应商适配、训练流程和私有审美知识不在这里公开。

### 快速使用

演示是一组静态文件，不需要构建，但本地运行时需要 Python 3。

一键启动：

- Windows：双击 `start.bat`。
- macOS / Linux：运行 `python3 -m http.server 8000 --directory assets`，然后打开 `http://127.0.0.1:8000/demo.html`。

本地克隆后：

```bash
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-art-qa
cd romanjo-art-qa
python3 -m http.server 8000 --directory assets
```

作为 Agent Skill 使用时，请让支持 Skill 的 Agent 安装本仓库，然后附上一张图片并要求评审，结果遵循公开 JSON Schema。

### 证据的边界

我们整理证据，但不裁定权利。相似只是线索，检测分数不能识别作者，也不能解决版权问题。有争议的结果需要人、更正路径和反证空间。完整规则见 [公开证据协议](references/provenance-and-similarity.md)。

### 一起定标准

这件事我们不想自己定，也不该自己定。公开的 Review JSON 和 Issue 表单，是要和艺术家们、评论家们一起养出来的评图标准。

- 艺术家们：带来已获授权的作品，我们一起像评图一样，把它从概念、构图、色彩、尺度到落地拆一遍。
- 设计师和评论家：带来那些“第一眼成立，越问越站不住”的方案，我们一起把评图时的疑问写清楚：它需要哪些证据才站得住。
- 研究者：带来误判和错误署名，我们一起留一份公开更正记录。
- 赞助方：支持一个命名专题；标签、阈值和结果，我们一起保持独立。

资金和判断保持分离。

### 商业部分

公开仓库故意保持很小。从评图到改图的工作台、团队 Taste QA 和私有适配，都在 [romanjo.art](https://romanjo.art)。如果你想要一个记得你们工作室怎么决策的评审器，我们一起聊聊。请不要公开提交机密材料。

### 参与贡献

请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，再选择对应的问题表单。作品版权仍归原权利人；提交 Issue 不代表授权模型训练。

---

## 日本語

### なぜ作ったか

私たちはアーティストに「どう見るか」を教えたいのではありません。一度のレビューを小さな講評会にしたいのです。証拠を机の上に並べ、パースではなく作品そのものを読みます。

**「見た目は正しいのに、使うと違う」。** 案は一見成立していても、どう使うか、どう実現するかを問われた途端、成立しなくなってしまうことがあります。Romanjo は一度に1枚だけを、慎重にレビューし、そこを問います。

**どれも同じに見える。** ピクセルは完璧で、速さもありますが、ヴォリューム、マテリアル、空間の関係がどれもテンプレートのようで、感触が追いついていません。Romanjo は、その画像が実際に何をしているかを「ただ整っているだけ」から分けます。

**フィードバックが安定しない。** 今日は違和感があっても、明日は「まあいいか」になる講評は実行しにくいものです。Romanjo は毎回同じ項目を返し、見たことと解釈を分けるので、確認したり反論したりできます。

### 記録したいもの

**作品の来歴。** 私たちは画像の歴史を知っているふりをしません。残っている手がかりだけを記録します。Content Credentials や C2PA、作り手自身の言葉、出典、視覚的な類似候補です。手がかりは判決ではありません。類似はコピーの証明ではなく、メタデータがないことは「不明」であって「怪しい」ではありません。最終判断は、その作品に関わる人たちが行います。

**誰が作ったか。** 法的に整備された公開インデックスがある場合に限り、作家や作品の候補を、開かれた手がかりとしてのみ返します。決定的な名前ではありません。スタイルはアイデンティティではありません。訂正と反証は同じ記録に残します。作家を取り違えることは、信頼とお金を失うことだからです。

**チームがどう判断するか。** 商用側では、過去の判断を覚え、似た作品が以前なぜ却下されたかを示し、確認できる理由つきで反論できるレビュアーを作っています。すべての変更を確認でき、巻き戻せます。

### ここで公開しているもの

- `SKILL.md`：有効なレビュー JSON を返す Agent ワークフロー。
- `references/review-schema.json`：持ち運び可能な出力契約。
- `references/field-guide.md`：各フィールドの公開定義。
- `references/provenance-and-similarity.md`：帰属に関する証拠手順。
- `assets/`：読み取り専用のオフライン例と再利用可能なレンダラー。
- `start.bat`：Windows 用のワンクリックデモランチャー。
- `ROADMAP.md`：公開研究と貢献のロードマップ。
- 作品投稿、ベンチマーク事例、帰属訂正、誤検出報告の Issue フォーム。

商用ワークベンチ、MCP ツール、内部ルール、プロバイダー連携、学習パイプライン、非公開の美的知識はここには含みません。

### クイックスタート

デモは静的なファイルのみで、ビルドは不要です。ローカルで実行するには Python 3 が必要です。

ワンクリックで起動：

- Windows：`start.bat` をダブルクリック。
- macOS / Linux：`python3 -m http.server 8000 --directory assets` を実行し、`http://127.0.0.1:8000/demo.html` を開きます。

ローカルにクローンした場合は：

```bash
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-art-qa
cd romanjo-art-qa
python3 -m http.server 8000 --directory assets
```

Agent Skill として使う場合は、Skill に対応した Agent にこのリポジトリを導入してもらい、画像を添付してレビューを依頼します。結果は公開 JSON Schema に従います。

### 証拠の限界

私たちは証拠を整理しますが、権利を裁定しません。類似は手がかりであり、検出スコアで作者を特定したり著作権を解決したりはしません。争いのある結果には、人による確認、訂正手順、反証の余地が必要です。詳しくは[公開エビデンス手順](references/provenance-and-similarity.md)をご覧ください。

### 一緒に基準をつくる

この基準は私たちだけで決めたくありません。公開された Review JSON と Issue フォームは、アーティストや評論家と一緒に育てていく講評会のようなものです。

- アーティスト：権利を確認した作品を持ち寄って、一緒に講評会のように、コンセプト、構図、色彩、スケール、実現まで読み解きましょう。
- デザイナー・評論家：「一見成立しているのに、問い直すと成立しない」案を持ち寄って、講評で問うべき証拠を一緒に決めましょう。
- 研究者：誤検出や誤帰属を持ち寄って、公開の訂正記録を一緒に残しましょう。
- スポンサー：命名トラックを支援できます。ラベル、しきい値、結果は一緒に独立させておきます。

資金と判断は分離されます。

### 商用パート

このリポジトリは意図的に小さくしています。講評から編集までのワークベンチ、チーム向け Taste QA、非公開アダプターは [romanjo.art](https://romanjo.art) にあります。あなたのスタジオの判断を覚えるレビュアーが欲しい場合は、[連携用 Issue](https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose) から一緒に相談させてください。公開 Issue には機密情報を投稿しないでください。

### コントリビューション

[CONTRIBUTING.md](CONTRIBUTING.md) を確認し、内容に合う Issue フォームを選んでください。投稿作品の権利は各権利者に残ります。Issue への投稿はモデル学習の許可を意味しません。

---

## License

Code and documentation are available under the [MIT License](LICENSE). Artwork, trademarks, personal data and third-party submissions keep their original rights and licenses.

<div align="center">

**See the work. Decide what stays. That is the part we help with.**

</div>

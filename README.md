<div align="center">

# Romanjo Art QA

**Romanjo: AI design feedback for images, UI, art and generated work.**

**Don't generate more.**<br>
**Decide what deserves to exist.**

Most tools are built to make more; Romanjo is built for the moment before you do: the moment you look at a piece and decide whether it earns its place.

[![License: MIT](https://img.shields.io/badge/License-MIT-111111.svg)](LICENSE)
[![AI design feedback](https://img.shields.io/badge/AI-design-feedback-d7ff3f.svg)](SKILL.md)
[![Offline demo](https://img.shields.io/badge/Demo-Offline-f2f1ec.svg)](assets/demo.html)
[![Issues](https://img.shields.io/github/issues/Hikohikoyan/romanjo-art-qa.svg)](https://github.com/Hikohikoyan/romanjo-art-qa/issues)

[English](#english) · [中文](#中文) · [日本語](#日本語)

</div>

---

## English

Romanjo Art QA is the open part of [Romanjo Art](https://romanjo.art). Give it an image, and it writes down what it can actually see: where the eye is likely to land, how the composition and color are holding, what feels off, what could change next.

It does not generate pictures, and it will not hand back a single beauty score. It separates what was observed from what was interpreted, so you can follow the reasoning, argue with it, or keep the part that matters to you.

### What we care about

**Provenance, without playing judge.** A lot of images now arrive with no clear past. Somebody made them, often across many hands and many versions, and that history can be lost in a screenshot or a retrained model. Romanjo helps you record what survives: signed Content Credentials or C2PA data, a creator's own statement, source links, and visual-similarity leads. Those leads can open a conversation about credit or uncredited remixing. They cannot issue a verdict. Similarity is not proof of copying, and a score is not an author. Missing metadata means "we don't know," not "guilty." The final call stays with people, and the record keeps a door open for correction.

**The artist behind the image, treated as a person.** We want the human who made the work to be found and credited, not reduced to a style. When a lawful, declared reference index exists, Romanjo can offer a few artist or work candidates as open leads, never as a definitive name. Style is not identity. Registration, corrections, counter-evidence and appeals all belong to the same record, because getting an artist wrong is a real cost, not a rounding error.

**Taste as something you can build.** The commercial side of Romanjo Art is working toward a reviewer that remembers how you and your team decide, can point to the last time a similar piece was rejected, and can disagree with you for reasons you can inspect. That is Taste QA: a standard that gets sharper with use, while every change stays visible and reversible. This repository is the honest, public part of that ambition. The contracts and evidence discipline live here; the private machinery does not.

### What you get

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
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-review
cd romanjo-review
python3 -m http.server 8000 --directory assets
```

To use the review as an Agent Skill, install it from the repository and attach an image. The result follows the public JSON schema.

### Where the evidence ends

One honest boundary, before you use it: Romanjo organizes evidence, it does not decide rights. Similarity is a lead. A detector score does not identify an artist or settle copyright. Contested results need a person, a correction path and room for counter-evidence. Read [provenance-and-similarity.md](references/provenance-and-similarity.md) for the full protocol.

### Co-building

This part is better with people in it. The public review room is [GitHub Issues](https://github.com/Hikohikoyan/romanjo-art-qa/issues). You can:

- submit rights-cleared artwork for critique;
- propose a hard benchmark case and the evidence it should require;
- report a false positive or a wrong attribution;
- join the artist, critic, curator, or researcher network;
- propose a named benchmark track, exhibition, or sponsorship.

A sponsor can fund a track. It cannot buy its labels, thresholds, or results. Funding and judgment stay separate.

### Connection to Romanjo Art

This repository is deliberately small. The commercial product, including the review-to-edit workbench, team Taste QA and private adapters, lives at [romanjo.art](https://romanjo.art). Commercial access is by invitation; open a [partnership issue](https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose) without posting confidential material.

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

Romanjo Art QA 是 [Romanjo Art](https://romanjo.art) 的公开部分。给它一张图，它会把它真实看到的东西写下来：视线可能先落在哪里，构图和颜色撑不撑得住，哪里不对劲，下一步可以改什么。

它不生成图片，也不给一个笼统的“美感分”。它把“看到了什么”和“为什么这样判断”分开，所以你能顺着它的思路往下想，也可以反驳它，或者只留下对你有用的那一部分。

### 我们在乎什么

**来源，但不做法官。** 现在很多图片都没有清晰的过去。它可能是某个人做的，也可能经过很多双手、很多个版本，而这些历史常常在一次截图或一次模型重绘里就丢了。Romanjo 帮你把还剩下的线索记下来：有没有签名过的 Content Credentials 或 C2PA 信息、创作者自己怎么说、来源链接、视觉上像谁。这些线索可以打开一场关于署名或未经说明的融图的对话，但它们不能替你下判决。相似不等于抄袭，分数不等于作者，没有元数据只说明“我们不知道”，不等于“它有问题”。最终的决定留给人，也给人留更正的机会。

**作品背后的人，而不是一种风格。** 我们想让做这张图的人被找到、被署名，而不是被压成一种“风格”。只有在一个合法、公开的参考索引存在时，Romanjo 才会给出几位艺术家或作品的候选，作为开放的线索，而不是一个确定的名字。风格不是身份。登记、更正、反证、申诉都写在同一条记录里，因为把一位艺术家认错，不是小事。

**品味是可以养成的，不是玄学。** Romanjo Art 的商业侧想做的，是一个记得你和团队怎么下判断、能翻出上一次类似作品为什么被否、并能有理有据地反对你的评审者。这就是 Taste QA：越用越准，而且每一步都能被查看、被撤销。这个仓库是那份野心公开、诚实的一部分。契约和证据纪律在这里，私人机器不在这里。

### 你能得到什么

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
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-review
cd romanjo-review
python3 -m http.server 8000 --directory assets
```

作为 Agent Skill 使用时，请让支持 Skill 的 Agent 安装本仓库，然后附上一张图片并要求评审，结果遵循公开 JSON Schema。

### 证据的边界

用之前先说清楚一条边界：Romanjo 整理证据，但不裁定权利。相似只是线索，检测分数不能识别作者，也不能解决版权问题。有争议的结果需要人、更正路径和反证空间。完整规则见 [公开证据协议](references/provenance-and-similarity.md)。

### 一起共建

这件事有更多人参与才成立。公开评审室是 [GitHub Issues](https://github.com/Hikohikoyan/romanjo-art-qa/issues)。你可以提交已获授权的作品、提出难例和它应具备的证据、报告误判或错误署名，也可以加入艺术家、评论家、策展人和研究者网络，或提议命名基准专题、展览和赞助。

赞助方可以资助专题，但不能购买标签、阈值或结论。资金和判断保持分离。

### 与 Romanjo Art 的关系

这个仓库故意保持很小。商业产品，包括评审到编辑的工作台、团队 Taste QA 和私有适配，都在 [romanjo.art](https://romanjo.art)。商业访问采用邀请制；请通过[合作 Issue](https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose)联系，不要在公开 Issue 里填写机密信息。

### 参与贡献

请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，再选择对应的问题表单。作品版权仍归原权利人；提交 Issue 不代表授权模型训练。

---

## 日本語

Romanjo Art QA は [Romanjo Art](https://romanjo.art) の公開部分です。画像を1枚渡すと、実際に見えることを書き出します。視線がどこへ向かいそうか、構図や色彩が持っているか、どこが引っかかるか、次に何を変えられるか。

画像は生成しませんし、単一の「美しさスコア」も返しません。何を見たかと、なぜそう判断したかを分けるので、理由をたどることも、反論することも、自分に必要な部分だけを残すこともできます。

### 私たちが大切にしていること

**来歴を追う。ただし裁くのは人。** 今の画像の多くには、はっきりした過去がありません。誰かが作り、いくつもの手とバージョンを経て、スクリーンショットや再学習の中で歴史が失われていく。Romanjo は、残っている手がかりを記録します。署名された Content Credentials や C2PA があるか、作り手自身の言葉、出典、視覚的な類似候補。それらはクレジットや無断リミックスの話を始める材料にはなりますが、判決は出しません。類似はコピーの証明ではなく、スコアは作者ではなく、メタデータがないことは「わからない」であって「怪しい」ではありません。最後の判断は人に残し、記録を正す道も残します。

**作品の背後にいる人間を、スタイルにしない。** その作品を作った人が見つかり、クレジットされることを目指しています。法的に整備された公開インデックスがある場合に限り、作家や作品の候補を、開かれた手がかりとして返します。決定的な名前ではありません。スタイルはアイデンティティではありません。登録、訂正、反証、異議申し立ても同じ記録に含めます。作家を取り違えることは、小さな間違いではないからです。

**テイストは育てるもの。** Romanjo Art の商用側が目指しているのは、あなたとチームの判断を覚え、似た作品が以前なぜ却下されたかを示し、理由つきで反論できるレビュアーです。それが Taste QA です。使うほど鋭くなり、すべての変更を確認し、巻き戻せます。このリポジトリは、その野心の公開された正直な部分です。契約と証拠の規律をここに置き、非公開の仕組みは外に置きます。

### 得られるもの

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
git clone https://github.com/Hikohikoyan/romanjo-art-qa.git romanjo-review
cd romanjo-review
python3 -m http.server 8000 --directory assets
```

Agent Skill として使う場合は、Skill に対応した Agent にこのリポジトリを導入してもらい、画像を添付してレビューを依頼します。結果は公開 JSON Schema に従います。

### 証拠の限界

使う前に、ひとつだけ正直な境界を。Romanjo は証拠を整理しますが、権利を裁定しません。類似は手がかりであり、検出スコアで作者を特定したり著作権を解決したりはしません。争いのある結果には、人による確認、訂正手順、反証の余地が必要です。詳しくは[公開エビデンス手順](references/provenance-and-similarity.md)をご覧ください。

### 共同でつくる

この部分は、人が集まって初めて良くなります。公開レビュー室は [GitHub Issues](https://github.com/Hikohikoyan/romanjo-art-qa/issues) です。権利を確認した作品の投稿、難しい事例と求める証拠の提案、誤検出や誤帰属の報告、作家・評論家・キュレーター・研究者ネットワークへの参加、命名ベンチマークトラックや展示・スポンサーの提案を受け付けています。

スポンサーはトラックに資金を出せますが、ラベル、しきい値、結果を買うことはできません。資金と判断は分離されます。

### Romanjo Art との関係

このリポジトリは意図的に小さくしています。レビューから編集までのワークベンチ、チーム向け Taste QA、非公開アダプターを含む商用プロダクトは [romanjo.art](https://romanjo.art) にあります。商用利用は招待制です。[連携用 Issue](https://github.com/Hikohikoyan/romanjo-art-qa/issues/new/choose) から問い合わせ、公開 Issue には機密情報を投稿しないでください。

### コントリビューション

[CONTRIBUTING.md](CONTRIBUTING.md) を確認し、内容に合う Issue フォームを選んでください。投稿作品の権利は各権利者に残ります。Issue への投稿はモデル学習の許可を意味しません。

---

## License

Code and documentation are available under the [MIT License](LICENSE). Artwork, trademarks, personal data and third-party submissions keep their original rights and licenses.

<div align="center">

**Don't generate more. Decide what deserves to exist.**

</div>

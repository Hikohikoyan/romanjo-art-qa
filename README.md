# Romanjo Art QA

An open, artist-centered visual-review format and a deliberately limited read-only UI kit. Give an image to the `romanjo-review` skill to describe visible evidence, likely attention, composition, color, depth, narrative, and testable revision guidance.

Romanjo Art QA is also an invitation: artists, critics, curators, researchers, and toolmakers can help build a transparent benchmark for aesthetic analysis without turning taste into a single opaque score.

> This repository is the public community edition. It does not contain the commercial workbench, private evaluation rubrics, model integrations, training systems, MCP service, credentials, or proprietary aesthetic knowledge.

## Try the free kit

Install this repository as a Codex skill or open the read-only sample locally:

```bash
python -m http.server 8000 --directory assets
```

Then visit `http://localhost:8000/demo.html`. The example is intentionally constrained: it displays a supplied review artifact and does not edit controls, invoke providers, or train on artwork.

## Plans and collaboration

| Plan | For | Invitation |
|---|---|---|
| **FREE** | Learners, artists, community reviewers | Public skill, schema, read-only review components, community benchmark participation |
| **PLUS · ¥49** | Individual creators | Editable review controls, comments, comparison history, and export workflows in the private product |
| **PRO** | Professional artists and small teams | Advanced review projects, reusable direction, collaboration, and production integrations; pricing by invitation |
| **EXPERT · from ¥998/month** | Studios and enterprises | Private aesthetic knowledge, tailored agents, delivery-oriented workflows, governance, and support |

Commercial capabilities are invitations, not artifacts in this repository. To discuss paid access, partnership, studio pilots, or sponsorship, open a feature/partnership Issue and avoid posting confidential information.

We welcome artists who want fair attribution or benchmark representation; critics and curators who want to author review cases; provenance and preference researchers; and institutions interested in named benchmark tracks, grants, exhibitions, or community sponsorship. Naming sponsorship never buys benchmark outcomes. Sponsored tracks must disclose their sponsor and keep evaluation governance independent.

## Human authorship and artist rights

Romanjo supports human creators through evidence preservation, attribution records, consent-aware submissions, correction pathways, and human review. The project may help organize signed provenance and Content Credentials, voluntary artist registration, disclosed source and license records, and visual-similarity leads.

It cannot determine copyright ownership, prove that an image was copied, or identify an artist solely from visual similarity. “AI washing,” compositing, or uncredited remixing must be treated as a risk hypothesis—not a verdict. See [the public evidence protocol](references/provenance-and-similarity.md) and use the artist-rights or false-positive Issue forms for contested cases.

## Issues are the public review room

Use GitHub Issues to submit rights-cleared artwork, propose difficult benchmark cases, request attribution corrections, document false positives, or propose features, partnerships, and named tracks. Do not upload confidential, private, doxxing, infringing, or non-consensual material. Prefer a stable lawful link and a low-resolution review copy when appropriate.

## Repository map

- `SKILL.md` — concise agent workflow
- `references/review-schema.json` — portable public review contract
- `references/field-guide.md` — public field semantics
- `references/provenance-and-similarity.md` — rights-aware evidence protocol
- `assets/` — reduced read-only HTML/component example

Code and documentation in this public repository are MIT licensed. Artwork, trademarks, personal data, and third-party submissions are **not** relicensed merely by appearing in an Issue or link. See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 中文简介

Romanjo Art QA 是一个面向艺术家、评价家、策展人和研究者的开放审美评价格式与阉割版只读前端 Kit。我们邀请大家共同建设可解释、可质疑、尊重创作者权益的审美量化分析仪与公开 benchmark。

公开仓库仅提供 FREE 能力。PLUS（¥49）提供私有产品中的可编辑控制点、评论和版本对比；PRO 面向专业创作者与团队；EXPERT 从 ¥998/月起，面向工作室和企业提供私有审美知识、定制 Agent、治理与交付支持。商业 MCP、私有规则、模型接入和训练闭环不在此仓库公开。

艺术家来源与“AI 洗图/融图”判断只建立证据线索：内容凭证、作者登记、来源许可和相似性候选必须分开记录，并由人类复核。相似不等于抄袭，分数不等于法律结论。欢迎通过 Issues 投稿艺术鉴赏案例、共建 benchmark、纠正误判、维护艺术家权益，或发起冠名合作与付费共建邀请。

# 内容发布手册（中文主文档）

本文档面向日常发文与作品更新，按“能直接操作”的方式编写。

## 1. 先选对集合目录

- 博客：`src/content/posts/`
- 学术：`src/content/research/`
- 创作：`src/content/creatives/`

文件类型：`.md` 或 `.mdx`。

命名建议：使用小写 kebab-case，例如：

- `my-first-post.md`
- `nlp-survey-2026.mdx`
- `gits-scene-study.md`

## 2. 通用 Frontmatter（全部集合）

```yaml
---
title: "标题"
pubDate: 2026-02-13
description: "一句话摘要"
author: "Zhong Pengchen"
tags: ["Tag1", "Tag2"]
heroImage: "/images/example-cover.jpg"
draft: false
lang: "zh"
featured: false
---
```

说明：

- 必填：`title`、`pubDate`、`description`
- `author` 默认值是 `Zhong Pengchen`
- `draft` 默认 `false`
- `lang` 可选 `zh/en/ja`（当前不会严格过滤内容）
- `heroImage` 可填本地 `public` 资源路径或外链

## 3. 集合专属字段

### 3.1 学术（`research`）

```yaml
---
type: "paper" # paper | dataset
doi: "10.1234/example.doi"
venue: "Conference Name"
datasetUrl: "https://example.com/dataset"
pdfUrl: "https://example.com/paper.pdf"
---
```

### 3.2 创作（`creatives`）

```yaml
---
techStack: ["TypeScript", "Canvas"]
previewImage: "/images/creative-preview.jpg"
demoUrl: "https://example.com/live-demo"
category: "social-observation" # social-observation | anime | other
---
```

`category` 会决定 Gallery 页面的专题分组位置。

## 4. 正文写作支持
支持标准 Markdown + 扩展能力：

- 代码高亮（Shiki）
- 数学公式（`remark-math` + `rehype-katex`）
- 表格、图片、引用、列表

数学示例：

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_0^1 x^2 dx = 1/3
$$
```

## 5. 本地预览与发布前检查

开发预览：

```bash
npm run dev
```

常看页面：

- `http://localhost:4321/zh/blog`
- `http://localhost:4321/zh/research`
- `http://localhost:4321/zh/gallery`
- `http://localhost:4321/zh/about`

发布前：

```bash
npm run build
npm run preview
```

## 6. 内容会出现在哪里

- 博客文章：
  - 列表 `/{lang}/blog`
  - 详情 `/{lang}/blog/{slug}`
- 学术内容：
  - 列表 `/{lang}/research`
  - 详情 `/{lang}/research/{slug}`
- 创作内容：
  - 列表 `/{lang}/gallery`（按 category 分组）
  - 详情 `/{lang}/gallery/{slug}`

另外：

- `/{lang}/about` 会聚合三个集合各最新 3 条
- `/{lang}/` 首页当前只做封面表达，不展示 latest 列表

## 7. 重要行为说明

### 7.1 语言行为
界面文案会随路由语言切换，但内容本身当前不按 frontmatter `lang` 严格筛选。
同一条内容通常可在 `zh/en/ja` 三个前缀下访问。

### 7.2 草稿行为
列表页会过滤 `draft: true`，但详情静态路径当前仍可能生成。
因此 `draft` 不是强私密机制，不应当作为敏感内容隔离手段。

## 8. 发布检查清单

1. 目录是否正确
2. Frontmatter 是否通过 schema
3. creatives 的 `category` 是否填写正确
4. `draft` 是否为 `false`
5. 图片和外链是否可访问
6. 白天/夜晚模式可读性是否正常
7. `npm run build` 是否通过

## 9. 最小模板

### 9.1 博客模板

```markdown
---
title: "Post Title"
pubDate: 2026-02-13
description: "Post summary"
author: "Zhong Pengchen"
tags: ["Blog"]
lang: "en"
draft: false
---

## Intro

Write your post here.
```

### 9.2 学术模板

```markdown
---
title: "Research Title"
pubDate: 2026-02-13
description: "Research summary"
author: "Zhong Pengchen"
type: "paper"
venue: "Sample Venue"
doi: "10.1234/example"
pdfUrl: "https://example.com/paper.pdf"
lang: "en"
draft: false
---

## Abstract

Write abstract and details.
```

### 9.3 创作模板

```markdown
---
title: "Project Title"
pubDate: 2026-02-13
description: "Project summary"
author: "Zhong Pengchen"
techStack: ["Astro", "React"]
previewImage: "/images/project-preview.jpg"
demoUrl: "https://example.com/demo"
category: "anime"
lang: "en"
draft: false
---

## Overview

Describe the project.
```

## 10. 关联文档

- `BLOG_SYSTEM_SUMMARY.md`
- `DESIGN_STYLE_GUIDE.md`
- `src/content/config.ts`

当 schema 或路由行为变化时，请在同一次提交同步更新本文档。

---

## Appendix A (English)

### A.1 Quick workflow
1. Put the file in the right collection folder.
2. Fill required frontmatter fields.
3. For creatives, set `category` (`social-observation` / `anime` / `other`).
4. Run `npm run dev`, then `npm run build`.

### A.2 Current behavior notes
- UI language follows route locale.
- Content is not strictly filtered by frontmatter `lang`.
- Drafts are hidden from list pages, but detail routes may still be generated.

### A.3 Where content appears
- Blog/Research/Gallery list and detail routes under `/{lang}/...`
- About page shows latest 3 items from each collection
- Home page is currently hero-only

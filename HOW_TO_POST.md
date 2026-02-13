# How to Publish Content

This project supports three content types:

- Blog posts (`posts`)
- Research entries (`research`)
- Creative works (`creatives`)

All content is written as Markdown/MDX and stored in `src/content/...`.

## 1. Choose the Right Collection

- Blog article: `src/content/posts/`
- Research paper or dataset: `src/content/research/`
- Gallery/project item: `src/content/creatives/`

Accepted file types: `.md` or `.mdx`.

## 2. Create a New File

Use lowercase kebab-case file names:

- `my-first-post.md`
- `nlp-survey-2026.mdx`
- `particle-lab.md`

Avoid spaces and uppercase characters in slugs.

## 3. Add Frontmatter

Frontmatter is required and must be valid against `src/content/config.ts`.

### 3.1 Base fields (all collections)

```yaml
---
title: "Your Title"
pubDate: 2026-02-12
description: "One-line summary"
author: "Zhong Pengchen"
tags: ["Tag1", "Tag2"]
heroImage: "https://example.com/image.jpg"
draft: false
lang: "zh"
featured: false
---
```

Field notes:

- `title`, `pubDate`, `description` are required.
- `draft` defaults to `false`; set to `true` to hide from listing pages.
- `lang` supports `zh`, `en`, `ja`.

### 3.2 Research-only fields

```yaml
---
type: "paper" # or "dataset"
doi: "10.1234/example.doi"
venue: "Conference Name"
datasetUrl: "https://example.com/dataset"
pdfUrl: "https://example.com/paper.pdf"
---
```

### 3.3 Creative-only fields

```yaml
---
techStack: ["TypeScript", "Canvas"]
previewImage: "https://example.com/preview.jpg"
demoUrl: "https://example.com/live-demo"
category: "social-observation" # "social-observation" | "anime" | "other"
---
```

## 4. Write the Body Content

You can use standard Markdown, plus:

- fenced code blocks (Shiki highlighting)
- inline and block math (`remark-math` + `rehype-katex`)
- images, tables, blockquotes, lists

Math examples:

```markdown
Inline: $E = mc^2$

Block:
$$
\int_0^1 x^2 dx = 1/3
$$
```

## 5. Preview Locally

From project root:

```bash
npm run dev
```

Then open:

- `http://localhost:4321/zh/blog`
- `http://localhost:4321/zh/research`
- `http://localhost:4321/zh/gallery`

Use locale switches (`zh`, `en`, `ja`) to check localized UI labels.

## 6. URL Rules

For file `src/content/posts/my-post.md`, generated detail URLs are:

- `/zh/blog/my-post`
- `/en/blog/my-post`
- `/ja/blog/my-post`

Same pattern applies to `research` and `gallery`.

Important current behavior:

- route locale affects UI language
- content is not filtered by frontmatter `lang` yet
- one item is currently reachable from all locale routes

## 7. Draft and Publish Workflow

### Keep as draft

```yaml
---
draft: true
---
```

Draft entries are excluded from list pages and homepage sections.

### Publish

Set draft off:

```yaml
---
draft: false
---
```

Then run:

```bash
npm run build
npm run preview
```

## 8. Content Quality Checklist

Before publishing:

1. Required fields are present and correctly typed.
2. `pubDate` is valid and intended.
3. Slug/file name is clean and stable.
4. Hero or preview image URLs load correctly.
5. Links and external resources work.
6. Page renders correctly in both light and dark themes.
7. Mobile layout remains readable.

## 9. Minimal Templates

### Blog template

```markdown
---
title: "Post Title"
pubDate: 2026-02-12
description: "Post summary"
author: "Zhong Pengchen"
tags: ["Blog"]
lang: "en"
draft: false
---

## Intro

Write your post here.
```

### Research template

```markdown
---
title: "Research Title"
pubDate: 2026-02-12
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

### Creative template

```markdown
---
title: "Project Title"
pubDate: 2026-02-12
description: "Project summary"
author: "Zhong Pengchen"
techStack: ["Astro", "React"]
previewImage: "https://example.com/preview.jpg"
demoUrl: "https://example.com/demo"
category: "anime"
lang: "en"
draft: false
---

## Overview

Describe the project.
```

## 10. Related Docs

- `BLOG_SYSTEM_SUMMARY.md`
- `DESIGN_STYLE_GUIDE.md`
- `src/content/config.ts`

If schema fields change in `src/content/config.ts`, update this guide immediately.

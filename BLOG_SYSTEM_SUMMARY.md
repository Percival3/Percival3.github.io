# 博客与内容系统总览（中文主文档）

## 1. 文档目的
本文档用于描述当前仓库内已实现的内容系统。
重点是“现在真实在运行的行为”，不是历史设计稿。

## 2. 内容集合与目录
当前有三个 Astro Content Collection：

- `posts`：博客文章
- `research`：论文与数据集
- `creatives`：创作/作品

对应目录：

- `src/content/posts/`
- `src/content/research/`
- `src/content/creatives/`

支持文件类型：`.md`、`.mdx`。

## 3. 路由结构（多语言）
支持语言：`zh`、`en`、`ja`。

- 根路径 `/`：由 `src/pages/index.astro` 重定向到 `/zh/`
- 首页：`/{lang}/`
- 博客列表：`/{lang}/blog`
- 博客详情：`/{lang}/blog/{slug}`
- 学术列表：`/{lang}/research`
- 学术详情：`/{lang}/research/{slug}`
- 作品列表：`/{lang}/gallery`
- 作品详情：`/{lang}/gallery/{slug}`
- 关于页面：`/{lang}/about`

## 4. Schema（`src/content/config.ts`）

### 4.1 通用字段（全部集合）

- `title: string`（必填）
- `pubDate: date`（必填，`z.coerce.date()`）
- `description: string`（必填）
- `author: string`（默认 `Zhong Pengchen`）
- `tags: string[]`（可选）
- `heroImage: string`（可选）
- `draft: boolean`（默认 `false`）
- `lang: 'zh' | 'en' | 'ja'`（默认 `zh`）
- `featured: boolean`（默认 `false`）

### 4.2 `research` 扩展字段

- `type: 'paper' | 'dataset'`（默认 `paper`）
- `doi: string`（可选）
- `venue: string`（可选）
- `datasetUrl: string`（可选）
- `pdfUrl: string`（可选）

### 4.3 `creatives` 扩展字段

- `techStack: string[]`（可选）
- `previewImage: string`（可选）
- `demoUrl: string`（可选）
- `category: 'social-observation' | 'anime' | 'other'`（默认 `other`）

## 5. 内容渲染流程

### 5.1 列表页
列表页通用流程：

1. `getCollection(...)`
2. 过滤草稿：`!item.data.draft`
3. 按 `pubDate` 倒序
4. 输出卡片/列表

### 5.2 详情页
详情页使用 `[...slug].astro`：

1. 从全集合构建静态路径
2. 为 `zh/en/ja` 三种语言各生成一份
3. 使用 `render(item)` 渲染内容

注意：当前详情页构建未统一过滤 `draft`，所以草稿可能“列表不可见，但详情可访问（若知道 slug）”。

## 6. 页面职责（当前实现）

### 6.1 首页 `src/pages/[lang]/index.astro`

- 英雄区极简展示：头像 + 名言轮播 + 图标按钮 + 向下引导
- 不再展示 latest posts/research/creatives

### 6.2 关于页 `src/pages/[lang]/about/index.astro`

- 个人信息主卡片
- 三个集合的最新 3 条内容聚合
- 联系方式（邮箱 + CV）
- 友情链接（方块卡片网格）

### 6.3 作品页 `src/pages/[lang]/gallery/index.astro`

- 按 `category` 分专题展示：
  - `social-observation`
  - `anime`
  - `other`

## 7. 阅读统计与元信息
`src/utils/reading-time.ts` 负责：

- 中英混合字数统计
- 预估阅读时间

使用位置：

- 博客列表
- 博客详情
- 学术详情

元信息组件：`src/components/PostMeta.astro`。

## 8. 多语言行为说明

- UI 文案会随路由语言切换（`zh/en/ja`）。
- 内容条目当前不按 frontmatter 的 `lang` 做强约束过滤。
- 同一内容通常可在三个语言前缀下访问。

如果后续要做“语言严格隔离”，需要在各页面查询处增加 `item.data.lang === lang`。

## 9. 构建与部署要点
`astro.config.mjs` 当前配置：

- `site: https://Percival3.github.io`
- 开发环境 `base: '/'`
- 生产环境 `base: '/my-astro-blog'`

GitHub Pages 部署时请特别关注 `base` 对链接生成的影响。

## 10. 当前已知缺口

- 暂无分页
- 暂无全文搜索
- `featured` 字段已定义，但未形成统一主流程
- 内容语言严格隔离未启用

---

## Appendix A (English)

### A.1 Scope
The project currently uses three Astro collections: `posts`, `research`, and `creatives`, all routed under `/{lang}/...` (`zh`, `en`, `ja`).

### A.2 Key behavior
- Root `/` redirects to `/zh/`
- Home page is now hero-only (no latest-content blocks)
- About page aggregates latest 3 entries from all collections
- Gallery is grouped by creative category (`social-observation`, `anime`, `other`)

### A.3 Important caveats
- List pages filter out drafts
- Detail static paths are generated from all entries; drafts may still be reachable if slug is known
- Content is not strictly filtered by frontmatter `lang`

### A.4 Deployment
`site` is `https://Percival3.github.io`, with dev `base: '/'` and production `base: '/my-astro-blog'`.

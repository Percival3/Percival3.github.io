# Blog and Content System Summary

## Purpose
This document describes the current content system implemented in this repository.
It replaces older notes that referenced outdated routes and file names.

## Current Scope
The site has three first-class content collections:

- `posts` for blog articles
- `research` for papers and datasets
- `creatives` for gallery/project entries

All three collections are rendered through localized routes under `src/pages/[lang]/`.

## Stack Used by the Content System

- Astro v5 content collections (`astro:content`)
- Markdown and MDX content files (`.md`, `.mdx`)
- Zod schema validation in `src/content/config.ts`
- Markdown plugins from `astro.config.mjs`:
  - `remark-math`
  - `rehype-katex`
  - Shiki syntax highlighting (`github-dark`, line wrap enabled)

## Route Model

Localized routes are generated for all supported locales: `zh`, `en`, `ja`.

### Home

- `/{lang}/`

### Blog (`posts` collection)

- Listing: `/{lang}/blog`
- Detail: `/{lang}/blog/{slug}`

### Research (`research` collection)

- Listing: `/{lang}/research`
- Detail: `/{lang}/research/{slug}`

### Gallery (`creatives` collection)

- Listing: `/{lang}/gallery`
- Detail: `/{lang}/gallery/{slug}`

`src/pages/index.astro` redirects root traffic to `/zh/`.

## Collection Schemas

Defined in `src/content/config.ts`.

### Shared base fields (all collections)

- `title: string` (required)
- `pubDate: date` (required, coerced)
- `description: string` (required)
- `author: string` (default: `Zhong Pengchen`)
- `tags: string[]` (optional)
- `heroImage: string` (optional)
- `draft: boolean` (default: `false`)
- `lang: 'zh' | 'en' | 'ja'` (default: `zh`)
- `featured: boolean` (default: `false`)

### `research` extra fields

- `type: 'paper' | 'dataset'` (default: `paper`)
- `doi: string` (optional)
- `venue: string` (optional)
- `datasetUrl: string` (optional)
- `pdfUrl: string` (optional)

### `creatives` extra fields

- `techStack: string[]` (optional)
- `previewImage: string` (optional)
- `demoUrl: string` (optional)
- `category: 'social-observation' | 'anime' | 'other'` (default: `other`)

## Content Loading

Each collection uses `glob` loaders and supports both `.md` and `.mdx`:

- `src/content/posts/**/*.{md,mdx}`
- `src/content/research/**/*.{md,mdx}`
- `src/content/creatives/**/*.{md,mdx}`

## Rendering Pattern

### Listing pages

Listing pages call `getCollection(...)`, then:

1. filter out drafts (`!item.data.draft`)
2. sort by `pubDate` descending
3. render cards/lists with metadata and optional images

### Detail pages

Detail pages use catch-all routes (`[...slug].astro`) and:

1. generate static paths from every content item
2. duplicate paths across `zh`, `en`, `ja`
3. render markdown/MDX with `render(item)`

## Reading Stats and Meta

`src/utils/reading-time.ts` computes:

- mixed Chinese/English word count
- estimated reading time

Used in:

- `src/pages/[lang]/blog/index.astro`
- `src/pages/[lang]/blog/[...slug].astro`
- `src/pages/[lang]/research/[...slug].astro`

`src/components/PostMeta.astro` displays:

- author
- publication date
- reading time
- word count

## Homepage Aggregation

`src/pages/[lang]/index.astro` shows the latest three published entries from each collection:

- latest blog posts
- latest research
- latest creative works

## i18n Behavior Notes

- UI strings are localized by route locale (`zh`, `en`, `ja`).
- Content itself is not currently filtered by `data.lang` on list/detail pages.
- Result: the same content items are reachable from all locale paths.

If strict locale-content mapping is required, add `item.data.lang === lang` filters in collection queries.

## Build and Deployment Notes

From `astro.config.mjs`:

- `site: https://Percival3.github.io`
- `base: '/'` in dev
- `base: '/my-astro-blog'` in production

This base behavior affects generated URLs when deploying to GitHub Pages.

## Operational Checklist

1. Add content file to the correct collection folder.
2. Fill valid frontmatter for that collection.
3. Run `npm run dev` and verify list/detail pages.
4. Run `npm run build` before deployment.

## Known Gaps

- No pagination for large collections.
- No full-text search.
- `featured` exists in schema but is not used as a dedicated filter/section.
- Locale-specific content filtering is not enforced.

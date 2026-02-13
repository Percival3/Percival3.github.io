# Zhong Pengchen Personal Site

A multilingual personal website built with Astro v5, React 19, and Tailwind CSS v4.

## Overview

This repository contains a static site with:

- Three content collections: `posts`, `research`, `creatives`
- Localized routes: `zh`, `en`, `ja`
- Day/Night visual themes with adaptive text color tokens
- Markdown/MDX content pipeline (Shiki + KaTeX)

## Tech Stack

- Astro v5
- React 19
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `lucide-react`
- `remark-math` + `rehype-katex`

## Project Structure

```text
.
|-- public/
|-- src/
|   |-- components/
|   |   |-- Background.astro
|   |   |-- BackgroundEffect.tsx
|   |   |-- Navigation.astro
|   |   |-- LanguageSelector.tsx
|   |   |-- ThemeToggle.tsx
|   |   |-- MobileMenu.tsx
|   |   |-- QuoteCarousel.tsx
|   |   |-- PostMeta.astro
|   |   `-- Footer.astro
|   |-- content/
|   |   |-- config.ts
|   |   |-- posts/
|   |   |-- research/
|   |   `-- creatives/
|   |-- layouts/
|   |   `-- Layout.astro
|   |-- pages/
|   |   |-- index.astro
|   |   `-- [lang]/
|   |       |-- index.astro
|   |       |-- about/index.astro
|   |       |-- blog/index.astro
|   |       |-- blog/[...slug].astro
|   |       |-- research/index.astro
|   |       |-- research/[...slug].astro
|   |       |-- gallery/index.astro
|   |       `-- gallery/[...slug].astro
|   |-- styles/global.css
|   `-- utils/reading-time.ts
|-- astro.config.mjs
|-- netlify.toml
`-- package.json
```

## Local Development

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:4321`

## Build and Preview

```bash
npm run build
npm run preview
```

Build output: `dist/`

## Content Authoring

Content directories:

- Blog: `src/content/posts/`
- Research: `src/content/research/`
- Gallery: `src/content/creatives/`

For full publishing rules and frontmatter fields:

- `HOW_TO_POST.md`
- `BLOG_SYSTEM_SUMMARY.md`
- `DESIGN_STYLE_GUIDE.md`

## Routing

Root path redirects to Chinese home:

- `/` -> `/zh/`

Localized sections:

- `/{lang}/`
- `/{lang}/blog`
- `/{lang}/research`
- `/{lang}/gallery`
- `/{lang}/about`

## Deployment (Netlify)

This repo is configured for Netlify static hosting.

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

These are defined in `netlify.toml`.

### Deploy Steps

1. Push this repository to GitHub.
2. In Netlify: **Add new site** -> **Import an existing project** -> select this repo.
3. Confirm build settings (Netlify usually reads `netlify.toml` automatically).
4. Deploy.
5. Optional: bind a custom domain in Netlify Domain Management.

## Notes

- If you only use Netlify, disable GitHub Pages workflow in `.github/workflows/astro.yml` to avoid duplicate deployments.
- Do not store source assets in `dist/`; use `public/` for static files.

## License

Copyright (c) Zhong Pengchen. All rights reserved.
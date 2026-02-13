# Zhong Pengchen's Personal Website

A modern, high-performance personal website built with Astro v5 and Tailwind CSS v4.

## 馃懁 About

**Name:** Zhong Pengchen (閽熸湅杈?
**Status:** Student
**Affiliation:** Peking University

## 鉁?Features

- 馃帹 Modern gradient design with glassmorphism effects
- 馃寭 Dark/Light theme support with smooth transitions
- 馃實 Multi-language support (涓枃/English/鏃ユ湰瑾?
- 馃摑 Full-featured blog system with Markdown support
- 馃М Math formula rendering (KaTeX)
- 馃捇 Code syntax highlighting (Shiki)
- 馃摫 Fully responsive design
- 鈿?Lightning-fast performance (Astro Islands Architecture)
- 馃幁 Animated background effects (Sakura/Rain particles)

## 馃殌 Project Structure

```text
/
鈹溾攢鈹€ public/               # Static assets
鈹溾攢鈹€ src/
鈹?  鈹溾攢鈹€ components/       # Reusable UI components
鈹?  鈹?  鈹溾攢鈹€ Background.astro
鈹?  鈹?  鈹溾攢鈹€ BackgroundEffect.tsx
鈹?  鈹?  鈹溾攢鈹€ Navigation.astro
鈹?  鈹?  鈹溾攢鈹€ ThemeToggle.tsx
鈹?  鈹?  鈹溾攢鈹€ LanguageSelector.tsx
鈹?  鈹?  鈹溾攢鈹€ MobileMenu.tsx
鈹?  鈹?  鈹溾攢鈹€ QuoteCarousel.tsx
鈹?  鈹?  鈹溾攢鈹€ PostMeta.astro
鈹?  鈹?  鈹斺攢鈹€ Footer.astro
鈹?  鈹溾攢鈹€ layouts/          # Page layouts
鈹?  鈹?  鈹斺攢鈹€ Layout.astro
鈹?  鈹溾攢鈹€ pages/            # Routes and pages
鈹?  鈹?  鈹溾攢鈹€ index.astro
鈹?  鈹?  鈹斺攢鈹€ [lang]/
鈹?  鈹?      鈹溾攢鈹€ index.astro
鈹?  鈹?      鈹斺攢鈹€ posts/
鈹?  鈹?          鈹溾攢鈹€ index.astro
鈹?  鈹?          鈹斺攢鈹€ [...slug].astro
鈹?  鈹溾攢鈹€ content/          # Blog posts (Markdown)
鈹?  鈹?  鈹溾攢鈹€ config.ts
鈹?  鈹?  鈹斺攢鈹€ posts/
鈹?  鈹溾攢鈹€ utils/            # Utility functions
鈹?  鈹?  鈹斺攢鈹€ reading-time.ts
鈹?  鈹斺攢鈹€ styles/           # Global styles
鈹?      鈹斺攢鈹€ global.css
鈹溾攢鈹€ astro.config.mjs      # Astro configuration
鈹溾攢鈹€ package.json
鈹斺攢鈹€ tailwind.config.mjs   # Tailwind CSS configuration
```

## 馃 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                             |
| `npm run dev`             | Start local dev server at `localhost:4321`       |
| `npm run build`           | Build production site to `./dist/`               |
| `npm run preview`         | Preview your build locally before deploying      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 馃摑 Creating Blog Posts

1. Create a new `.md` file in `src/content/posts/`
2. Add frontmatter:

```yaml
---
title: "Your Post Title"
pubDate: 2024-03-22
description: "Brief description"
author: "Zhong Pengchen"
tags: ["Tag1", "Tag2"]
heroImage: "https://example.com/image.jpg" # Optional
lang: "zh" # or "en", "ja"
draft: false
---
```

3. Write your content in Markdown
4. The post will automatically appear on your blog

See [HOW_TO_POST.md](./HOW_TO_POST.md) for detailed instructions.

## 馃洜锔?Tech Stack

- **Framework:** Astro v5.16.2
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS v4.1.17
- **Icons:** Lucide React v0.555.0
- **Typography:** @tailwindcss/typography
- **Math Rendering:** KaTeX (rehype-katex, remark-math)
- **Code Highlighting:** Shiki

## 馃帹 Design Features

- **Background System:** Multi-layered with dual day/night images
- **Particle Effects:** Theme-aware canvas animations (Sakura/Rain)
- **Color Palette:** Blue-purple gradient accent throughout
- **Typography:** Responsive fluid type with Tailwind Prose
- **Animations:** Smooth transitions (300-1000ms durations)

## 馃寪 Multi-language URLs

- Chinese: `/zh/`
- English: `/en/`
- Japanese: `/ja/`

## 馃摎 Documentation

- [HOW_TO_POST.md](./HOW_TO_POST.md) - Blog posting guide
- [BLOG_SYSTEM_SUMMARY.md](./BLOG_SYSTEM_SUMMARY.md) - Technical overview
- [DESIGN_STYLE_GUIDE.md](./DESIGN_STYLE_GUIDE.md) - Design system documentation

## Deployment (Netlify)

This project is now configured for Netlify static hosting.

1. Push your repository to GitHub.
2. In Netlify, import the GitHub repo.
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`
4. Ensure `astro.config.mjs` uses `base: '/'`.
5. (Optional) Set a custom domain in Netlify Domain Management.

Notes:

- `netlify.toml` is included to lock build and publish settings.
- If you no longer use GitHub Pages, disable `.github/workflows/astro.yml` to avoid duplicate deployments.

## License

漏 2024 Zhong Pengchen. All rights reserved.

---

Built with 鉂わ笍 using Astro v5 & Tailwind v4


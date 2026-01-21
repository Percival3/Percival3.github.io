# Zhong Pengchen's Personal Website

A modern, high-performance personal website built with Astro v5 and Tailwind CSS v4.

## 👤 About

**Name:** Zhong Pengchen (钟朋辰)
**Status:** Student
**Affiliation:** Peking University

## ✨ Features

- 🎨 Modern gradient design with glassmorphism effects
- 🌓 Dark/Light theme support with smooth transitions
- 🌍 Multi-language support (中文/English/日本語)
- 📝 Full-featured blog system with Markdown support
- 🧮 Math formula rendering (KaTeX)
- 💻 Code syntax highlighting (Shiki)
- 📱 Fully responsive design
- ⚡ Lightning-fast performance (Astro Islands Architecture)
- 🎭 Animated background effects (Sakura/Rain particles)

## 🚀 Project Structure

```text
/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Background.astro
│   │   ├── BackgroundEffect.tsx
│   │   ├── Navigation.astro
│   │   ├── ThemeToggle.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── QuoteCarousel.tsx
│   │   ├── PostMeta.astro
│   │   └── Footer.astro
│   ├── layouts/          # Page layouts
│   │   └── Layout.astro
│   ├── pages/            # Routes and pages
│   │   ├── index.astro
│   │   └── [lang]/
│   │       ├── index.astro
│   │       └── posts/
│   │           ├── index.astro
│   │           └── [...slug].astro
│   ├── content/          # Blog posts (Markdown)
│   │   ├── config.ts
│   │   └── posts/
│   ├── utils/            # Utility functions
│   │   └── reading-time.ts
│   └── styles/           # Global styles
│       └── global.css
├── astro.config.mjs      # Astro configuration
├── package.json
└── tailwind.config.mjs   # Tailwind CSS configuration
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                             |
| `npm run dev`             | Start local dev server at `localhost:4321`       |
| `npm run build`           | Build production site to `./dist/`               |
| `npm run preview`         | Preview your build locally before deploying      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📝 Creating Blog Posts

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

## 🛠️ Tech Stack

- **Framework:** Astro v5.16.2
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS v4.1.17
- **Icons:** Lucide React v0.555.0
- **Typography:** @tailwindcss/typography
- **Math Rendering:** KaTeX (rehype-katex, remark-math)
- **Code Highlighting:** Shiki

## 🎨 Design Features

- **Background System:** Multi-layered with dual day/night images
- **Particle Effects:** Theme-aware canvas animations (Sakura/Rain)
- **Color Palette:** Blue-purple gradient accent throughout
- **Typography:** Responsive fluid type with Tailwind Prose
- **Animations:** Smooth transitions (300-1000ms durations)

## 🌐 Multi-language URLs

- Chinese: `/zh/`
- English: `/en/`
- Japanese: `/ja/`

## 📚 Documentation

- [HOW_TO_POST.md](./HOW_TO_POST.md) - Blog posting guide
- [BLOG_SYSTEM_SUMMARY.md](./BLOG_SYSTEM_SUMMARY.md) - Technical overview
- [DESIGN_STYLE_GUIDE.md](./DESIGN_STYLE_GUIDE.md) - Design system documentation

## 🚀 Deployment

The site is configured for GitHub Pages deployment. Before building for production:

1. Update `site` and `base` in `astro.config.mjs` if needed
2. Run `npm run build`
3. Deploy the `dist/` folder

The configuration automatically adjusts base path for dev/prod environments.

## 📄 License

© 2024 Zhong Pengchen. All rights reserved.

---

Built with ❤️ using Astro v5 & Tailwind v4

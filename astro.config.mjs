// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 自动检测开发环境
// 开发环境使用 '/', 生产环境使用 '/my-astro-blog'
const isDev = import.meta.env.DEV;

export default defineConfig({
  // 1. 替换为你的 GitHub Page 完整网址
  site: 'https://Percival3.github.io',

  // 2. 自动适配开发/生产环境
  // 开发环境: base = '/' (方便本地访问)
  // 生产环境: base = '/my-astro-blog' (部署到 GitHub Pages)
  base: isDev ? '/' : '/my-astro-blog',

  // 3. 多语言配置
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'ja'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false
    }
  },

  // 4. Markdown 配置
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  // 集成 React
  integrations: [react()],

  // Vite 配置中加入 Tailwind v4
  vite: {
    plugins: [tailwindcss()],
  },
});

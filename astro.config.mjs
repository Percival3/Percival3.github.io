// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    // 1. 替换为你的 GitHub Page 完整网址
  // 格式: https://<你的用户名>.github.io
  site: 'https://Percival3.github.io',

  // 2. 替换为你的仓库名 (Repository name)
  // 格式: '/<仓库名>'，例如 '/my-astro-blog'
  // 如果你绑定了自定义域名（如 www.example.com），这一行需要删掉或设为 '/'
  base: '/my-astro-blog',
  // 3. 多语言配置
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'ja'],
    routing: {
      prefixDefaultLocale: true, // URL 将始终包含语言前缀，如 /zh/
      redirectToDefaultLocale: false
    }
  },
  
  // 集成 React
  integrations: [react()],
  
  // Vite 配置中加入 Tailwind v4
  vite: {
    plugins: [tailwindcss()],
  },
});



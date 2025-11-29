// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
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
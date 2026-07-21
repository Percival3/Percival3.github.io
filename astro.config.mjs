// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://percival3.github.io',
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Co-located blog PDFs should stay as files, not base64 data URLs
      assetsInlineLimit: (filePath) => (String(filePath).endsWith('.pdf') ? 0 : 4096),
    },
  },
  integrations: [react(), mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});

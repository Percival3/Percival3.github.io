import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 定义 'posts' 集合
const posts = defineCollection({
  // 使用 glob loader 加载文件系统中的 markdown
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    // 如果你的 markdown 没有 frontmatter (--- ---)，这里可以留空或者定义可选字段
    // 比如 demo.md 可能没有 title 字段，这里我们先设为 loose() 宽松模式
  }).passthrough(),
});

export const collections = { posts };
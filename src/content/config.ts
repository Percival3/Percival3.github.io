import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 定义 'posts' 集合的完整 schema
const posts = defineCollection({
  // 使用 glob loader 加载文件系统中的 markdown
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    // 必填字段
    title: z.string(),
    pubDate: z.coerce.date(), // 发布日期,自动转换为 Date 对象
    description: z.string(),

    // 可选字段
    author: z.string().default('Zhong Pengchen'), // 默认作者
    tags: z.array(z.string()).optional(), // 标签数组
    heroImage: z.string().optional(), // 文章头图
    draft: z.boolean().default(false), // 是否为草稿
    lang: z.enum(['zh', 'en', 'ja']).default('zh'), // 文章语言
  }),
});

export const collections = { posts };

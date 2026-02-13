import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 共享的基础字段
const baseSchema = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  description: z.string(),
  author: z.string().default('Zhong Pengchen'),
  tags: z.array(z.string()).optional(),
  heroImage: z.string().optional(),
  draft: z.boolean().default(false),
  lang: z.enum(['zh', 'en', 'ja']).default('zh'),
  featured: z.boolean().default(false),
});

// 博客文章集合
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: baseSchema,
});

// 学术研究集合 (论文 + 数据集)
const research = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/research" }),
  schema: baseSchema.extend({
    type: z.enum(['paper', 'dataset']).default('paper'),
    doi: z.string().optional(),
    venue: z.string().optional(),
    datasetUrl: z.string().optional(),
    pdfUrl: z.string().optional(),
  }),
});

// 创意作品集合
const creatives = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/creatives" }),
  schema: baseSchema.extend({
    techStack: z.array(z.string()).optional(),
    previewImage: z.string().optional(),
    demoUrl: z.string().optional(),
    category: z.enum(['social-observation', 'anime', 'other']).default('other'),
  }),
});

export const collections = { posts, research, creatives };

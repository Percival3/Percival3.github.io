import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string().optional().default('Z.PC'),
    description: z.string().optional().default(''),
    category: z.enum(['reading', 'essays']),
    cover: z.string().optional(),
  }),
});

const researchCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    venue: z.string(),
    abstract: z.string(),
    pdfUrl: z.string().optional(),
    codeUrl: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'research': researchCollection,
};

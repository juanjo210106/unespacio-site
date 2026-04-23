import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date().optional(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};

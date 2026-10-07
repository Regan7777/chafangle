import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['zhuabao', 'mofan', 'meishou', 'tongbao', 'jiaocheng']),
    verdict: z.enum(['five-star', 'warning', 'confiscated', 'ghost']).optional(),
    verdictNote: z.string().optional(),
    isPinned: z.boolean().default(false),
    author: z.string().default('宿管大爷'),
    officialUrl: z.string().optional(),
    promoCode: z.string().optional(),
    pricePlan: z.string().optional(),
    testLocation: z.string().optional(),
    testIsp: z.string().optional(),
    testPeakHours: z.string().optional(),
    metrics: z.array(
      z.object({
        name: z.string(),
        result: z.string(),
        status: z.enum(['good', 'warn', 'bad']).optional()
      })
    ).optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};

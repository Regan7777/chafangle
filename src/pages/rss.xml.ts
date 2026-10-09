import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'VPN查房｜每周网络服务巡检与避坑指南',
    description: '面向 VPN、机场代理与网络服务用户的公开测试与体验观察博客。以周为单位巡查，不让断流蒙混过关。',
    site: context.site || 'https://chafangle.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>zh-cn</language>`,
  });
}

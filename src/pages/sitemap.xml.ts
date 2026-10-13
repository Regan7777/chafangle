import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const siteUrl = (context.site || 'https://chafangle.com').toString().replace(/\/$/, '');
  const posts = await getCollection('posts');

  const staticPages = [
    '',
    '/nav',
    '/about',
    '/handbook',
    '/posts',
    '/category/zhuabao',
    '/category/mofan',
    '/category/meishou',
    '/category/tongbao',
    '/category/jiaocheng',
  ];

  const staticUrlXml = staticPages
    .map(
      (path) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('\n');

  const postUrlXml = posts
    .map((post) => {
      const pubDate = post.data.pubDate ? new Date(post.data.pubDate).toISOString() : new Date().toISOString();
      return `  <url>
    <loc>${siteUrl}/posts/${post.slug}/</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrlXml}
${postUrlXml}
</urlset>`;

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

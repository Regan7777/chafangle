import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.resolve(ROOT_DIR, 'src/content/posts');
// CI or restricted environments can place generated artifacts outside the source tree.
// When unset, the project keeps its normal dist/ and dist-temp/ locations.
const OUTPUT_ROOT = process.env.SSG_OUTPUT_DIR ? path.resolve(process.env.SSG_OUTPUT_DIR) : ROOT_DIR;
const DIST_DIR = path.resolve(OUTPUT_ROOT, 'dist');
const TEMP_DIR = path.resolve(OUTPUT_ROOT, 'dist-temp');
const SITE_URL = 'https://chafangle.com';

const CATEGORY_MAP = {
  zhuabao: { name: '机场评测', desc: '收录VPN查房站内全量机场评测专栏文章。基于长期实测与晚高峰网络监控数据，系统剖析各服务商的BGP入口、IEPL专线架构、流媒体与AI工具解锁能力、资费套餐及客户端兼容性，提供无过滤的客观体验记录与测速报告，帮助用户避开虚标带宽与断流陷阱。' },
  mofan: { name: '机场推荐', desc: '按预算梯队、流量配额、低延迟游戏、弱网抗抖动与跨境商务等多样化需求，系统整理站内经过验证的优质机场推荐清单。提供详尽的资费解析、节点覆盖范围与适用场景选型建议，帮助新手与专业用户在购买前明确自身需求方向，科学规避跑路风险。' },
  jiaocheng: { name: '配置教程', desc: '汇集Windows、macOS、iOS与Android各平台主流代理客户端的完整配置指南。详细讲解Clash Verge Rev、Shadowrocket小火箭、sing-box等工具的官方下载、订阅导入、TUN虚拟网卡模式、分流规则配置及常见连接报错排查流程，助你快速搞定网络配置。' },
};

// 1. Load All Posts from Markdown
function loadPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContent);

    const formatDate = value => {
      if (value instanceof Date) return value.toISOString().split('T')[0];
      if (typeof value === 'string') return value.split('T')[0];
      return '';
    };
    const pubDateStr = formatDate(data.pubDate);
    const updatedDateStr = formatDate(data.updatedDate);

    const htmlContent = marked.parse(content, { gfm: true, breaks: true });
    const categoryName = data.categoryName || CATEGORY_MAP[data.category]?.name || '技术文章';

    return {
      ...data,
      categoryName,
      pubDate: pubDateStr,
      updatedDate: updatedDateStr || undefined,
      slug,
      content,
      htmlContent,
      keywords: data.keywords || [],
    };
  });

  return posts.sort((a, b) => {
    const timeA = new Date(a.updatedDate || a.pubDate).getTime();
    const timeB = new Date(b.updatedDate || b.pubDate).getTime();
    return timeB - timeA;
  });
}

async function runSSG() {
  console.log('🚀 [SSG] Starting React 19 + Vite 8 Static Site Generation...');
  const startTime = Date.now();

  const posts = loadPosts();
  console.log(`📦 [SSG] Loaded ${posts.length} markdown articles.`);

  // 1. Build Client Bundle
  console.log('🔨 [SSG] Building client bundle with Vite...');
  await build({
    configFile: path.resolve(ROOT_DIR, 'vite.config.ts'),
    configLoader: 'runner',
    build: {
      outDir: path.resolve(TEMP_DIR, 'client'),
      emptyOutDir: true,
    },
  });

  // 2. Build Server SSR Bundle
  console.log('🔨 [SSG] Building SSR server bundle with Vite...');
  await build({
    configFile: path.resolve(ROOT_DIR, 'vite.config.ts'),
    configLoader: 'runner',
    ssr: { noExternal: true },
    build: {
      ssr: path.resolve(ROOT_DIR, 'src/entry-server.tsx'),
      outDir: path.resolve(TEMP_DIR, 'server'),
      emptyOutDir: true,
    },
  });

  // 3. Load Server Render Function
  const serverEntryPath = path.resolve(TEMP_DIR, 'server/entry-server.js');
  const { render } = await import(`file://${serverEntryPath.replace(/\\/g, '/')}`);

  // 4. Read client template
  const clientTemplatePath = path.resolve(TEMP_DIR, 'client/index.html');
  const templateHtml = fs.readFileSync(clientTemplatePath, 'utf8');

  // Prepare final dist folder
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // Copy assets from client
  const clientAssetsDir = path.resolve(TEMP_DIR, 'client/assets');
  if (fs.existsSync(clientAssetsDir)) {
    fs.cpSync(clientAssetsDir, path.resolve(DIST_DIR, 'assets'), { recursive: true });
  }

  // Copy public directory
  const publicDir = path.resolve(ROOT_DIR, 'public');
  if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, DIST_DIR, { recursive: true });
  }

  // 5. Define All Routes
  const routes = [
    {
      path: '/',
      title: '2026机场推荐｜网络服务测试与选购指南 - VPN查房',
      description: 'VPN查房是一家专注网络代理与翻墙工具客观测评的独立技术博客。我们针对各类常用节点、BGP中转与IPLC/IEPL专线机场进行真实环境下的连通性、延迟、晚高峰抗抖动与流媒体解锁深度测试，提供科学客观的2026机场推荐选型指南、客户端配置教程与防断流避坑方案，帮助网络用户与跨境工作者做出理性决策。',
      keywords: '2026机场推荐, VPN推荐, 机场代理, 机场导航, 性价比VPN, 节点稳定性测试, 断流避坑指南',
      data: { posts },
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'VPN查房',
        url: SITE_URL,
        description: 'VPN查房是一家专注网络代理与翻墙工具客观测评的独立技术博客。我们针对各类常用节点、BGP中转与IPLC/IEPL专线机场进行真实环境下的连通性、延迟、晚高峰抗抖动与流媒体解锁深度测试，提供科学客观的2026机场推荐选型指南、客户端配置教程与防断流避坑方案，帮助网络用户与跨境工作者做出理性决策。',
        inLanguage: 'zh-CN',
      },
    },
    {
      path: '/posts',
      title: '全部文章 - VPN查房',
      description: 'VPN查房全部文章归档列表，收录包含BGP中转、IPLC与IEPL专线在内的全量机场评测、高性价比VPN推荐选型指南以及涵盖Clash Verge Rev、Shadowrocket小火箭、sing-box等多端主流代理客户端的保姆级配置教程，支持按发布时间与更新动态持续查阅真实网络测试记录。',
      keywords: '机场评测总库, 机场推荐归档, 节点测速报告',
      data: { posts },
    },
    {
      path: '/categories',
      title: '全部分类 - VPN查房',
      description: 'VPN查房内容分类导航页，系统整理机场评测、机场推荐与配置教程三大技术专题。用户可快速直达多线路网络服务深度测试、高可用翻墙服务选购分析，以及适用于Windows、Mac、iOS和Android平台的客户端分流规则与疑难排错指南，便于按场景与实际需求针对性阅读。',
      keywords: '机场推荐, 机场评测, 配置教程',
      data: {},
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '全部分类',
        url: `${SITE_URL}/categories`,
        inLanguage: 'zh-CN',
      },
    },
    {
      path: '/nav',
      title: '机场导航与服务速览 - VPN查房',
      description: 'VPN查房机场导航精选汇总页面，集中罗列经过站内实际测试验证的主流机场服务商。全面整理各服务商的线路架构类型、月付年付资费方案、多设备并发限制、流媒体解锁支持度及专属折扣优惠码，提供客观透明的横向参数对比，方便网络用户按预算与应用场景快速筛选适合的节点网络。',
      keywords: '机场导航, 机场直达, 机场优惠码, 2026机场评测',
      data: {},
    },
    {
      path: '/tools',
      title: '实用工具：测速、DNS 诊断、规则资源与客户端 - VPN查房',
      description: 'VPN查房实用工具箱为网络用户提供一站式权威检测与配置辅助资源。页面聚合Speedtest测速、Cloudflare DNS诊断与防泄漏测试、开源订阅转换（Subconverter/Sub-Store）安全指引，并收录主流代理客户端官方下载渠道，配套提供站内分流规则与排错教程。',
      keywords: '网络测速, DNS诊断, 订阅转换, Mihomo规则, sing-box规则, 客户端下载',
      data: {},
    },
    {
      path: '/about',
      title: '关于本站与评测准则 - VPN查房',
      description: '了解VPN查房独立技术博客的创立背景、评测原则与技术准则。本站坚持100%纯净出版物风格与中立客观测试立场，专注于各类网络代理协议、专线中转架构的连通性、稳定性与晚高峰抗封锁表现，明确拒绝虚假推广与商业利益捆绑，并提供官方读者交流渠道与合规免责声明。',
      keywords: '关于VPN查房, 联系 V Telegram, 独立评测原则',
      data: {},
    },
  ];

  // Category routes
  for (const [catKey, catInfo] of Object.entries(CATEGORY_MAP)) {
    const catPosts = catKey === 'zhuabao'
      ? posts.filter(p => p.category === 'zhuabao' || p.category === 'mofan')
      : posts.filter(p => p.category === catKey);
    routes.push({
      path: `/category/${catKey}`,
      title: `${catInfo.name} - VPN查房`,
      description: catInfo.desc,
      keywords: `${catInfo.name}, 机场评测, 节点测速, 2026推荐`,
      data: {
        category: catKey,
        categoryName: catInfo.name,
        categoryDesc: catInfo.desc,
        posts: catPosts,
      },
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: catInfo.name,
        url: `${SITE_URL}/category/${catKey}`,
        description: catInfo.desc,
      },
    });
  }

  // Article routes (all 35 posts)
  for (const post of posts) {
    const relatedPosts = posts.filter(p => p.category === post.category && p.slug !== post.slug);
    routes.push({
      path: `/posts/${post.slug}`,
      title: `${post.title} - VPN查房`,
      description: post.description,
      keywords: (post.keywords || []).join(', '),
      data: { post, relatedPosts },
      schema: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: post.title,
        description: post.description,
        author: {
          '@type': 'Person',
          name: 'V',
        },
        publisher: {
          '@type': 'Organization',
          name: 'VPN查房',
          url: SITE_URL,
        },
        datePublished: post.pubDate,
        dateModified: post.updatedDate || post.pubDate,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/posts/${post.slug}`,
        },
        inLanguage: 'zh-CN',
      },
    });
  }

  console.log(`📄 [SSG] Pre-rendering ${routes.length} physical static pages...`);

  // 6. Pre-render each route
  for (const route of routes) {
    const { appHtml } = render(route.path, route.data);
    const canonicalUrl = `${SITE_URL}${route.path === '/' ? '' : route.path}`;

    let schemaTag = '';
    if (route.schema) {
      schemaTag = `<script type="application/ld+json">${JSON.stringify(route.schema)}</script>`;
    }

    // Inject state for smooth client hydration
    const stateScript = `window.__INITIAL_DATA__ = ${JSON.stringify({
      route: route.path,
      data: route.data,
    })};`;

    let finalHtml = templateHtml
      .replace('<!--app-html-->', appHtml)
      .replace(/<!--title-->/g, route.title)
      .replace(/<!--description-->/g, route.description)
      .replace(/<!--keywords-->/g, route.keywords || '')
      .replace(/<!--canonical-->/g, canonicalUrl)
      .replace('<!--schema-json-->', schemaTag)
      .replace('<!--initial-state-->', stateScript);

    // Write file
    if (route.path === '/') {
      fs.writeFileSync(path.resolve(DIST_DIR, 'index.html'), finalHtml, 'utf8');
    } else {
      const cleanSubPath = route.path.replace(/^\//, '');
      const routeDir = path.resolve(DIST_DIR, cleanSubPath);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.resolve(routeDir, 'index.html'), finalHtml, 'utf8');

      // Also write clean .html file for robust static web server & Vite preview fallback
      const directHtmlPath = path.resolve(DIST_DIR, `${cleanSubPath}.html`);
      const directHtmlDir = path.dirname(directHtmlPath);
      if (!fs.existsSync(directHtmlDir)) {
        fs.mkdirSync(directHtmlDir, { recursive: true });
      }
      fs.writeFileSync(directHtmlPath, finalHtml, 'utf8');
    }
  }


  // 7. Write 404.html
  const { appHtml: notFoundHtml } = render('/404', {});
  const notFoundPage = templateHtml
    .replace('<!--app-html-->', notFoundHtml)
    .replace(/<!--title-->/g, '404 - 页面未找到')
    .replace(/<!--description-->/g, '页面不存在')
    .replace(/<!--keywords-->/g, '')
    .replace(/<!--canonical-->/g, `${SITE_URL}/404`)
    .replace('<!--schema-json-->', '')
    .replace('<!--initial-state-->', `window.__INITIAL_DATA__ = { route: '/404', data: {} };`);
  fs.writeFileSync(path.resolve(DIST_DIR, '404.html'), notFoundPage, 'utf8');

  // 7.5 Generate physical HTML redirect pages and Cloudflare _redirects for AFF links
  console.log('🔗 [SSG] Generating 301 redirect pages for affiliate links...');
  const AFFILIATE_REDIRECTS = [
    { slug: 'shenxing', name: '神行加速', targetUrl: 'https://wuhan01.shenxingaff.com/#/?code=WUQMrgI8' },
    { slug: 'dalaoyun', name: '大佬云', targetUrl: 'https://fugui0077.dalaoyunaff.com/#/?code=1o7gYhTL' },
    { slug: 'shandianshu', name: '闪电鼠', targetUrl: 'https://fugui0077.shandianshuaff.com/#/?code=I2yK9PfK' },
    { slug: 'liulianyun', name: '榴莲云', targetUrl: 'https://zyrrz.liulianyunaff.com/#/?code=Y6A1M1MN' },
    { slug: 'huanqiuti', name: '环球梯', targetUrl: 'https://fugui0077.huanqiutiaff.com/#/?code=rJyQn4xG' },
    { slug: 'yunjiexian', name: '云界线', targetUrl: 'https://fugui0077.yunjiexianaff.com/#/?code=qA3LF6hW' },
  ];

  const redirectRules = [];

  for (const aff of AFFILIATE_REDIRECTS) {
    const redirectHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, nofollow">
  <meta http-equiv="refresh" content="0; url=${aff.targetUrl}">
  <link rel="canonical" href="${aff.targetUrl}">
  <title>正在跳转至 ${aff.name} 官网 - VPN查房</title>
  <script>window.location.replace("${aff.targetUrl}");</script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fbfbfd; color: #1d1d1f;">
  <div style="text-align: center; padding: 32px 24px; border: 1px solid rgba(0,0,0,0.08); background: #ffffff; max-width: 400px; width: 90%;">
    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 500;">正在前往 ${aff.name} 官方页面...</p>
    <p style="margin: 0 0 16px 0; font-size: 12px; color: #6e6e73;">若浏览器未自动跳转，请点击下方直达链接：</p>
    <a href="${aff.targetUrl}" rel="nofollow sponsored" style="display: inline-block; font-size: 12px; color: #0071e3; text-decoration: none; padding: 6px 16px; border: 1px solid rgba(0, 113, 227, 0.3);">点击直达官网 &rarr;</a>
  </div>
</body>
</html>`;

    const affDir = path.resolve(DIST_DIR, 'go', aff.slug);
    fs.mkdirSync(affDir, { recursive: true });
    fs.writeFileSync(path.resolve(affDir, 'index.html'), redirectHtml, 'utf8');

    const directAffHtml = path.resolve(DIST_DIR, 'go', `${aff.slug}.html`);
    fs.writeFileSync(directAffHtml, redirectHtml, 'utf8');

    redirectRules.push(`/go/${aff.slug} ${aff.targetUrl} 301`);
  }

  const redirectsContent = `# Cloudflare Pages 301 Redirects for AFF Links\n${redirectRules.join('\n')}\n`;
  fs.writeFileSync(path.resolve(DIST_DIR, '_redirects'), redirectsContent, 'utf8');

  // 8. Generate sitemap.xml & sitemap-index.xml
  console.log('🗺️ [SSG] Generating sitemap.xml and sitemap-index.xml...');
  const sitemapUrls = routes.map(r => {
    const loc = `${SITE_URL}${r.path === '/' ? '' : r.path}`;
    const lastmod = r.data.post ? (r.data.post.updatedDate || r.data.post.pubDate) : new Date().toISOString().split('T')[0];
    const priority = r.path === '/' ? '1.0' : r.path.startsWith('/posts/') ? '0.8' : '0.6';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

  fs.writeFileSync(path.resolve(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync(path.resolve(DIST_DIR, 'sitemap-index.xml'), sitemapIndexXml, 'utf8');

  // 9. Generate rss.xml
  console.log('📡 [SSG] Generating rss.xml...');
  const rssItems = posts.slice(0, 20).map(p => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}/posts/${p.slug}</link>
      <guid>${SITE_URL}/posts/${p.slug}</guid>
      <pubDate>${new Date(p.pubDate).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VPN查房</title>
    <link>${SITE_URL}</link>
    <description>VPN查房是一家专注网络代理与翻墙工具客观测评的独立技术博客。我们针对各类常用节点、BGP中转与IPLC/IEPL专线机场进行真实环境下的连通性、延迟、晚高峰抗抖动与流媒体解锁深度测试，提供科学客观的选型指南、客户端配置教程与防断流避坑方案。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  fs.writeFileSync(path.resolve(DIST_DIR, 'rss.xml'), rssXml, 'utf8');

  // 10. Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-index.xml
Sitemap: ${SITE_URL}/rss.xml
`;
  fs.writeFileSync(path.resolve(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');

  // 11. Automated Full-Site Integrity & Link Verification
  console.log('🛡️ [SSG] Running automated full-site linked association & link integrity check...');
  let checkedLinksCount = 0;
  const deadLinks = [];

  function scanHtmlFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanHtmlFiles(fullPath);
      } else if (entry.name.endsWith('.html')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const hrefMatches = content.matchAll(/href="(\/[^"#?]+)"/g);
        for (const match of hrefMatches) {
          const href = match[1];
          if (href.startsWith('//') || href.startsWith('/assets/')) continue;
          checkedLinksCount++;

          const clean = href.replace(/\/$/, '');
          const targetDirIndex = path.resolve(DIST_DIR, clean.replace(/^\//, ''), 'index.html');
          const targetHtml = path.resolve(DIST_DIR, `${clean.replace(/^\//, '')}.html`);
          const targetDirect = path.resolve(DIST_DIR, href.replace(/^\//, ''));

          const exists = fs.existsSync(targetDirIndex) || fs.existsSync(targetHtml) || fs.existsSync(targetDirect);
          if (!exists) {
            deadLinks.push({ from: path.relative(DIST_DIR, fullPath), href });
          }
        }
      }
    }
  }

  scanHtmlFiles(DIST_DIR);

  if (deadLinks.length > 0) {
    console.error(`❌ [SSG] Integrity Error: Found ${deadLinks.length} dead links!`);
    deadLinks.slice(0, 10).forEach(d => console.error(`   -> ${d.from} references missing "${d.href}"`));
    throw new Error(`SSG Build aborted due to ${deadLinks.length} dead links.`);
  }

  console.log(`🛡️ [SSG] Verified ${checkedLinksCount} internal links across ${routes.length} pages: 0 dead links. 100% healthy!`);

  // 12. Cleanup temporary directories
  try {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    // Windows file handle release lag
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ [SSG] Successfully pre-rendered and verified all ${routes.length} pages in ${duration}s!`);

}

runSSG().catch(err => {
  console.error('❌ [SSG] Build failed:', err);
  process.exit(1);
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  cacheDir: process.env.VITE_CACHE_DIR || undefined,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'dev-ssg-data-injection',
      apply: 'serve',
      transformIndexHtml(html, ctx) {
        const urlPath = (ctx.originalUrl || '/').split('?')[0].replace(/\/$/, '') || '/';
        const postsDir = path.resolve(__dirname, 'src/content/posts');
        let posts: any[] = [];
        const categoryMap: Record<string, { name: string; desc: string }> = {
          zhuabao: { name: '机场评测', desc: '收录站内机场评测文章，整理服务的线路、套餐、使用限制与文章中的观察记录，供你结合自身网络环境参考。' },
          mofan: { name: '机场推荐', desc: '按预算、流量、低延迟、弱网和多地区使用等需求，整理站内推荐服务与对应说明，帮助你先判断适用方向。' },
          jiaocheng: { name: '配置教程', desc: 'Clash Verge Rev、小火箭与 sing-box 客户端使用教程。' },
        };

        if (fs.existsSync(postsDir)) {
          const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
          posts = files.map(filename => {
            const slug = filename.replace(/\.md$/, '');
            const fileContent = fs.readFileSync(path.join(postsDir, filename), 'utf8');
            const { data, content } = matter(fileContent);
            const formatDate = (v: any) => {
              if (v instanceof Date) return v.toISOString().split('T')[0];
              if (typeof v === 'string') return v.split('T')[0];
              return '';
            };
            const htmlContent = marked.parse(content, { gfm: true, breaks: true });
            const categoryName = data.categoryName || categoryMap[data.category]?.name || '技术文章';
            return {
              ...data,
              categoryName,
              pubDate: formatDate(data.pubDate),
              updatedDate: formatDate(data.updatedDate) || undefined,
              slug,
              content,
              htmlContent,
              keywords: data.keywords || [],
            };
          });
          posts.sort((a, b) => {
            const timeA = new Date(a.updatedDate || a.pubDate).getTime();
            const timeB = new Date(b.updatedDate || b.pubDate).getTime();
            return timeB - timeA;
          });
        }

        let routeData: any = {};
        if (urlPath === '/' || urlPath === '/posts') {
          routeData = { posts };
        } else if (urlPath.startsWith('/category/')) {
          const cat = urlPath.replace('/category/', '');
          const catInfo = categoryMap[cat] || { name: cat, desc: '' };
          routeData = {
            category: cat,
            categoryName: catInfo.name,
            categoryDesc: catInfo.desc,
            posts: cat === 'zhuabao'
              ? posts.filter(p => p.category === 'zhuabao' || p.category === 'mofan')
              : posts.filter(p => p.category === cat),
          };
        } else if (urlPath.startsWith('/posts/')) {
          const slug = urlPath.replace('/posts/', '');
          const post = posts.find(p => p.slug === slug);
          const relatedPosts = post ? posts.filter(p => p.category === post.category && p.slug !== post.slug) : [];
          routeData = { post, relatedPosts };
        }

        const stateScript = `window.__INITIAL_DATA__ = ${JSON.stringify({ route: urlPath, data: routeData })};`;
        return html.replace('<!--initial-state-->', stateScript);
      },
    },
    {
      name: 'preview-ssg-clean-urls',
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const [urlPath, query] = req.url.split('?');
            if (urlPath && !urlPath.includes('.') && urlPath !== '/') {
              const cleanPath = urlPath.replace(/\/$/, '');
              const distPath = path.resolve(__dirname, 'dist');
              const dirIndex = path.join(distPath, cleanPath.replace(/^\//, ''), 'index.html');
              const htmlFile = path.join(distPath, cleanPath.replace(/^\//, '') + '.html');
              if (fs.existsSync(dirIndex)) {
                req.url = `${cleanPath}/index.html${query ? '?' + query : ''}`;
              } else if (fs.existsSync(htmlFile)) {
                req.url = `${cleanPath}.html${query ? '?' + query : ''}`;
              }
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});


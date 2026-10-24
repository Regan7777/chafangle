import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface Metric {
  name: string;
  result: string;
  status: 'good' | 'warning' | 'bad';
}

export interface PostFrontmatter {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  category: 'zhuabao' | 'mofan' | 'jiaocheng' | string;
  categoryName?: string;
  author?: string;
  badge?: string;
  verdict?: 'warning' | 'good' | 'info';
  verdictNote?: string;
  officialUrl?: string;
  promoCode?: string;
  pricePlan?: string;
  testLocation?: string;
  testIsp?: string;
  testPeakHours?: string;
  metrics?: Metric[];
  keywords?: string[];
  isPinned?: boolean;
}

export interface PostData extends PostFrontmatter {
  slug: string;
  content: string;
  htmlContent: string;
}

const POSTS_DIR = path.resolve(process.cwd(), 'src/content/posts');

const CATEGORY_MAP: Record<string, string> = {
  zhuabao: '机场评测',
  mofan: '机场推荐',
  jiaocheng: '配置教程',
};

export function getAllPosts(): PostData[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

  const posts: PostData[] = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContent);

    // Format pubDate
    let pubDateStr = '';
    if (data.pubDate instanceof Date) {
      pubDateStr = data.pubDate.toISOString().split('T')[0];
    } else if (typeof data.pubDate === 'string') {
      pubDateStr = data.pubDate.split('T')[0];
    }

    const htmlContent = marked.parse(content, { gfm: true, breaks: true }) as string;
    const categoryName = data.categoryName || CATEGORY_MAP[data.category] || '技术文章';

    return {
      ...(data as PostFrontmatter),
      categoryName,
      pubDate: pubDateStr,
      slug,
      content,
      htmlContent,
      keywords: data.keywords || [],
    };
  });

  // Sort by updatedDate or pubDate descending
  return posts.sort((a, b) => {
    const timeA = new Date(a.updatedDate || a.pubDate).getTime();
    const timeB = new Date(b.updatedDate || b.pubDate).getTime();
    return timeB - timeA;
  });
}

export function getPostBySlug(slug: string): PostData | undefined {
  const posts = getAllPosts();
  return posts.find(p => p.slug === slug);
}

export function getPostsByCategory(category: string): PostData[] {
  const posts = getAllPosts();
  return posts.filter(p => p.category === category);
}

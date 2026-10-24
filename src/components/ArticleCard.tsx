import React from 'react';
import type { PostData } from '../lib/posts';
import { getPostEngagement } from '../lib/engagement';

interface ArticleCardProps {
  post: PostData;
}

const CATEGORY_NAMES: Record<string, string> = {
  'zhuabao': '机场评测',
  'mofan': '机场推荐',
  'jiaocheng': '配置教程',
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ post }) => {
  const categoryLabel = CATEGORY_NAMES[post.category] || post.category;
  const { views } = getPostEngagement(post.slug);
  const wordCount = post.content ? post.content.replace(/\s+/g, '').length : 2200;
  const readingTime = Math.max(1, Math.ceil(wordCount / 400));

  return (
    <article className="group py-5 border-b border-black/[0.08] transition-colors hover:bg-black/[0.01]">
      {/* Meta Bar - 纯客观中立元数据 */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#86868b]">
        {post.isPinned && (
          <span className="font-medium text-[#0071e3]">置顶</span>
        )}
        <span>{categoryLabel}</span>
        <span>·</span>
        <time dateTime={post.updatedDate || post.pubDate}>
          {post.updatedDate && post.updatedDate !== post.pubDate ? `${post.updatedDate} 更新` : post.pubDate}
        </time>
        <span>·</span>
        {views > 0 && (
          <>
            <span>{views} 次阅读</span>
            <span>·</span>
          </>
        )}
        <span>约 {wordCount.toLocaleString()} 字 · 需 {readingTime} 分钟</span>
      </div>



      {/* Title */}
      <h3 className="mt-2 text-base sm:text-lg font-medium tracking-tight text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors leading-snug">
        <a href={`/posts/${post.slug}`}>
          {post.title}
        </a>
      </h3>

      {/* Excerpt */}
      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#6e6e73] line-clamp-2">
        {post.description}
      </p>

      {/* Footer details */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div>
          {post.pricePlan && (
            <span className="text-[#86868b]">{post.pricePlan}</span>
          )}
        </div>
        <a
          href={`/posts/${post.slug}`}
          className="text-xs font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors"
        >
          阅读全文 →
        </a>
      </div>
    </article>
  );
};

import React from 'react';
import type { PostData } from '../lib/posts';
import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { ArticleCard } from '../components/ArticleCard';
import { RightSidebar } from '../components/RightSidebar';
import { ArrowRight } from 'lucide-react';

import { Pagination } from '../components/Pagination';

interface HomePageProps {
  posts: PostData[];
}

const PAGE_SIZE = 8;
const getUpdatedTime = (post: PostData) => new Date(post.updatedDate || post.pubDate).getTime();

export const HomePage: React.FC<HomePageProps> = ({ posts }) => {
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const sortedPosts = React.useMemo(() => {
    return [...posts].sort((a, b) => getUpdatedTime(b) - getUpdatedTime(a));
  }, [posts]);

  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE);

  const displayPosts = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedPosts.slice(start, start + PAGE_SIZE);
  }, [sortedPosts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('recent-posts-stream');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Masthead */}
      <Hero />

      {/* Categories */}
      <CategoryGrid />

      {/* Main 2-Column Content */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Left Stream */}
            <div className="lg:col-span-2" id="recent-posts-stream">
              <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                <h2 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
                  最近更新
                </h2>
                <a
                  href="/posts"
                  className="inline-flex items-center gap-1 text-xs text-[#6e6e73] transition-colors hover:text-[#1d1d1f]"
                >
                  <span>全部文章 ({posts.length})</span>
                  <ArrowRight size={12} strokeWidth={1.25} />
                </a>
              </div>

              {/* Minimalist Horizontal Divider Stream */}
              <div>
                {displayPosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>

              {/* 翻页模式组件 */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-16">
                <RightSidebar posts={posts} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

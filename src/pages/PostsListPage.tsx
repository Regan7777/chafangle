import React from 'react';
import type { PostData } from '../lib/posts';
import { ArticleCard } from '../components/ArticleCard';
import { RightSidebar } from '../components/RightSidebar';

import { Pagination } from '../components/Pagination';

interface PostsListPageProps {
  posts: PostData[];
}

const PAGE_SIZE = 10;
const getUpdatedTime = (post: PostData) => new Date(post.updatedDate || post.pubDate).getTime();

export const PostsListPage: React.FC<PostsListPageProps> = ({ posts }) => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="mb-6 border-b border-black/[0.08] pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            全部文章 ({posts.length})
          </h1>
          <p className="mt-2 text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
            收录全站节点资料核验、网络工具与客户端配置教程。
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            {displayPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-16">
              <RightSidebar posts={posts} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

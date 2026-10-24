import React from 'react';
import type { PostData } from '../lib/posts';
import { ArticleCard } from '../components/ArticleCard';
import { RightSidebar } from '../components/RightSidebar';

interface CategoryPageProps {
  category: string;
  categoryName: string;
  categoryDesc: string;
  posts: PostData[];
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryName,
  categoryDesc,
  posts,
}) => {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <header className="mb-6 border-b border-black/[0.08] pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            {categoryName}
          </h1>
          <p className="mt-2 text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
            {categoryDesc}
          </p>
        </header>

        {/* Content Stream */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            {posts.length > 0 ? (
              posts.map((post) => <ArticleCard key={post.slug} post={post} />)
            ) : (
              <div className="border border-black/[0.08] bg-white p-8 text-center text-sm text-[#6e6e73]">
                本分类暂无文章记录。
              </div>
            )}
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

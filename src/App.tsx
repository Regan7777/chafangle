import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { NavPage } from './pages/NavPage';
import { AboutPage } from './pages/AboutPage';
import { PostsListPage } from './pages/PostsListPage';
import { ToolsPage } from './pages/ToolsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import type { PostData } from './lib/posts';

export interface RouteProps {
  route: string;
  data: {
    posts?: PostData[];
    post?: PostData;
    relatedPosts?: PostData[];
    category?: string;
    categoryName?: string;
    categoryDesc?: string;
  };
}

import { BackToTop } from './components/BackToTop';
import { initCardSoundEffects } from './lib/sound';

export const App: React.FC<RouteProps> = ({ route, data }) => {
  React.useEffect(() => {
    return initCardSoundEffects();
  }, []);

  let content = null;

  if (route === '/') {
    content = <HomePage posts={data.posts || []} />;
  } else if (route.startsWith('/posts/') && data.post) {
    content = <PostDetailPage post={data.post} relatedPosts={data.relatedPosts || []} />;
  } else if (route === '/posts') {
    content = <PostsListPage posts={data.posts || []} />;
  } else if (route === '/categories') {
    content = <CategoriesPage />;
  } else if (route.startsWith('/category/') && data.category) {
    content = (
      <CategoryPage
        category={data.category}
        categoryName={data.categoryName || ''}
        categoryDesc={data.categoryDesc || ''}
        posts={data.posts || []}
      />
    );
  } else if (route === '/nav') {
    content = <NavPage />;
  } else if (route === '/tools') {
    content = <ToolsPage />;
  } else if (route === '/about') {
    content = <AboutPage />;
  } else {
    content = (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-semibold text-[#1d1d1f]">404 - 页面未找到</h1>
        <p className="mt-2 text-sm text-[#6e6e73]">您访问的评测记录或页面不存在</p>
        <a href="/" className="mt-6 inline-block border border-black bg-black px-5 py-2 text-xs font-medium text-white hover:bg-neutral-800 transition-colors">
          返回首页
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfd] text-[#1d1d1f]">
      <Header currentPath={route} />
      <main className="flex-1">{content}</main>
      <Footer />
      <BackToTop />
    </div>
  );
};

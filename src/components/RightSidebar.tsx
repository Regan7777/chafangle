import React, { useState, useEffect } from 'react';
import { getHotRankings, getLikeRankings, syncAllCloudMetrics } from '../lib/engagement';

interface RightSidebarProps {
  posts?: { slug: string; title: string }[];
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ posts }) => {
  const [activeTab, setActiveTab] = useState<'hot' | 'likes'>('hot');
  const [hotList, setHotList] = useState(() => getHotRankings(posts));
  const [likeList, setLikeList] = useState(() => getLikeRankings(posts));

  useEffect(() => {
    // 首次挂载时触发全网云端计数增量同步
    syncAllCloudMetrics();

    const handleUpdate = () => {
      setHotList(getHotRankings(posts));
      setLikeList(getLikeRankings(posts));
    };

    window.addEventListener('v-engagement-update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('v-engagement-update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [posts]);

  const articles = activeTab === 'hot' ? hotList : likeList;



  return (
    <aside className="space-y-4">
      {/* 1. 主签卡片：Apple macOS Pro 钛金立体 V 标 + V 身份 + 社交栏 */}
      <div className="border border-black/[0.08] bg-white p-6 text-center">
        {/* 顶部钛金立体 V 徽标 */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center">
          <img
            src="/logo.png"
            alt="V"
            className="h-16 w-16 object-contain rounded-xl shadow-sm"
          />
        </div>

        {/* 名字与签名 */}
        <h3 className="mt-2 text-base font-bold text-[#1d1d1f]">V</h3>
        <p className="mt-1 text-xs text-[#6e6e73]">一个神秘的V</p>

        {/* 发丝细分割线 */}
        <div className="my-4 border-b border-black/[0.08]" />

        {/* 社交矢量图标栏 */}
        <div className="flex items-center justify-center text-[#6e6e73]">
          <a
            href="https://t.me/wanfengzn"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#0071e3]"
            title="Telegram"
            aria-label="Telegram"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </a>
        </div>
      </div>

      {/* 2. 分类与文章归档 */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href="/categories"
          className="group flex flex-col items-center justify-center border border-black/[0.08] bg-white py-3.5 px-2 transition-all hover:border-black/[0.2] hover:bg-[#fafafc]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#336f87] transition-transform group-hover:scale-105">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
          <span className="mt-1.5 text-xs font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
            分类
          </span>
        </a>

        <a
          href="/posts"
          className="group flex flex-col items-center justify-center border border-black/[0.08] bg-white py-3.5 px-2 transition-all hover:border-black/[0.2] hover:bg-[#fafafc]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#336f87] transition-transform group-hover:scale-105">
            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.82-1h12l.93 1H5.12z" />
          </svg>
          <span className="mt-1.5 text-xs font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
            归档
          </span>
        </a>
      </div>

      {/* 3. 热门文章 / 点赞排行 */}
      <div className="border border-black/[0.08] bg-white p-5">
        {/* Tabs 切换 */}
        <div className="flex items-center gap-2 border-b border-black/[0.08] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('hot')}
            className={`border px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === 'hot'
                ? 'border-[#336f87]/20 bg-[#f0f6f8] text-[#336f87] font-semibold'
                : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            热门文章
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('likes')}
            className={`border px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === 'likes'
                ? 'border-[#336f87]/20 bg-[#f0f6f8] text-[#336f87] font-semibold'
                : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            点赞排行
          </button>
        </div>

        {/* 1~10 强榜单列表 */}
        <div className="mt-3 space-y-2">
          {articles.map((item, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const metricValue = activeTab === 'hot' ? (item.views || 0) : ((item as any).currentLikes || 0);

            return (
              <a
                key={item.slug}
                href={item.href}
                className="group flex items-center justify-between gap-2 py-1 text-xs transition-colors"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`w-3.5 shrink-0 text-center font-mono text-xs ${
                      isTop3 ? 'font-bold text-[#ff6b00]' : 'text-[#86868b]'
                    }`}
                  >
                    {rank}
                  </span>
                  <span className="truncate text-[#1d1d1f] transition-colors group-hover:text-[#0071e3]">
                    {item.title}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-[#86868b]">
                  {metricValue} {activeTab === 'hot' ? '' : '赞'}
                </span>
              </a>
            );
          })}
        </div>

      </div>
    </aside>
  );
};

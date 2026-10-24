import React from 'react';

const categories = [
  {
    name: '机场推荐',
    href: '/category/mofan',
    description: '按不同使用需求归纳的站内服务推荐文章。',
  },
  {
    name: '机场评测',
    href: '/category/zhuabao',
    description: '收录站内机场评测文章，整理服务的线路、套餐、使用限制与文章中的观察记录，供你结合自身网络环境参考。',
  },
  {
    name: '配置教程',
    href: '/category/jiaocheng',
    description: 'Clash Verge Rev、小火箭与 sing-box 客户端使用教程。',
  },
];

export const CategoriesPage: React.FC = () => (
  <div className="py-10">
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="mb-6 border-b border-black/[0.08] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">全部分类</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6e6e73]">按文章用途进入对应分类页。</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <a
            key={category.href}
            href={category.href}
            className="group border border-black/[0.08] bg-white p-6 transition-colors hover:border-black/[0.2] hover:bg-[#fafafc]"
          >
            <h2 className="text-lg font-semibold text-[#1d1d1f] group-hover:text-[#0071e3]">{category.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6e6e73]">{category.description}</p>
          </a>
        ))}
      </div>
    </div>
  </div>
);

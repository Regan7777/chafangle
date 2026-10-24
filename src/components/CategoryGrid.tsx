import React from 'react';

const CATEGORIES = [
  {
    title: '机场推荐',
    desc: '按不同使用需求归纳的站内服务推荐文章。',
    href: '/category/mofan',
  },
  {
    title: '机场评测',
    desc: '整理服务的线路、套餐、使用限制与文章中的观察记录。',
    href: '/category/zhuabao',
  },
  {
    title: '配置教程',
    desc: 'Clash、小火箭与 sing-box 客户端使用指南。',
    href: '/category/jiaocheng',
  },
  {
    title: '实用工具',
    desc: '测速、诊断、规则资源与客户端下载入口。',
    href: '/tools',
  },
];


export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-6 border-b border-black/[0.08]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.href}
              href={cat.href}
              className="group block border border-black/[0.08] bg-white p-3.5 transition-colors hover:border-black/[0.25] hover:bg-[#f5f5f7]"
            >
              <div className="text-xs font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                {cat.title}
              </div>
              <p className="mt-1 text-[11px] leading-normal text-[#6e6e73] line-clamp-2">
                {cat.desc}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

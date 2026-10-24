import React, { useState, useEffect } from 'react';
import type { PostData } from '../lib/posts';
import {
  Calendar,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  Heart
} from 'lucide-react';
import { getPostEngagement, togglePostLike, recordPostView } from '../lib/engagement';

interface PostDetailPageProps {
  post: PostData;
  relatedPosts: PostData[];
}

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  zhuabao: '机场评测',
  mofan: '机场推荐',
  jiaocheng: '配置教程',
};

export const PostDetailPage: React.FC<PostDetailPageProps> = ({ post, relatedPosts }) => {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [engagement, setEngagement] = useState(() => getPostEngagement(post.slug));

  useEffect(() => {
    // 页面被真实打开时自动记录真实访问（单次会话去重）
    recordPostView(post.slug);
    setEngagement(getPostEngagement(post.slug));
  }, [post.slug]);

  const wordCount = post.content ? post.content.replace(/\s+/g, '').length : 2400;
  const readingTime = Math.max(1, Math.ceil(wordCount / 400));

  const handleToggleLike = () => {
    const next = togglePostLike(post.slug);
    setEngagement((prev) => ({ ...prev, ...next }));
  };


  const handleCopyPromo = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const defaultFaqs = [
    {
      q: '该服务商是否支持退款或免费试用？',
      a: '绝大多数网络代理服务因带宽即时消耗属性，不支持无理由退款，通常也不提供长期无限制试用。建议首次使用时优先选购月付轻度套餐，或在 <a href="/category/zhuabao" class="text-[#0071e3] underline">机场评测</a> 中核验测试数据后再行决策。',
    },
    {
      q: '为什么晚高峰时个别节点会出现断流或延迟偏高？',
      a: '晚间 20:30~23:00 为国内骨干网国际出口高峰期。若本地运营商存在 QoS 限制，建议切换为 BGP 备用入口或查看 <a href="/posts/20-clash-verge-rev-beginner-tutorial" class="text-[#0071e3] underline">分流规则教程</a> 开启自动切换。',
    },
    {
      q: '优惠码在结账时提示无效怎么处理？',
      a: '部分限时优惠码仅适用于特定周期套餐（如半年付或年付）。如遇折扣失效，可进入后台工单系统或联系 Telegram (@wanfengzn) 协助反馈。',
    },
    {
      q: 'iOS 苹果端无法下载客户端如何解决？',
      a: 'Shadowrocket（小火箭）等工具需使用外区 Apple ID 获取。可参考站内 <a href="/posts/21-shadowrocket-ios-beginner-tutorial" class="text-[#0071e3] underline">iOS 零基础配置教程</a>。',
    },
  ];

  const categoryTitle = post.categoryName || CATEGORY_DISPLAY_NAMES[post.category] || '机场评测';

  return (
    <div className="py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[#86868b]">
          <a href="/" className="hover:text-[#1d1d1f] transition-colors">首页</a>
          <span>/</span>
          <a href={`/category/${post.category}`} className="hover:text-[#1d1d1f] transition-colors">
            {categoryTitle}
          </a>
          <span>/</span>
          <span className="text-[#6e6e73] truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="border-b border-black/[0.08] pb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#86868b]">
            <span>{categoryTitle}</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar size={12} strokeWidth={1.25} />
              {post.updatedDate && post.updatedDate !== post.pubDate ? `更新于 ${post.updatedDate}` : post.pubDate}
            </span>
            <span>·</span>
            <span>{engagement.views.toLocaleString()} 次阅读</span>
            <span>·</span>
            <span>约 {wordCount.toLocaleString()} 字 · 需 {readingTime} 分钟</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl leading-snug">
            {post.title}
          </h1>

          <p className="text-sm leading-relaxed text-[#6e6e73]">
            {post.description}
          </p>
        </header>


        {/* 服务核心参数表（直角纯白，仅针对具有真实资费与官方推荐入口的精选推荐类文章呈现） */}
        {post.category === 'mofan' && (post.pricePlan || post.officialUrl || post.promoCode) && (
          <section className="my-8 border border-black/[0.08] bg-white p-5">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h2 className="text-xs font-semibold text-[#1d1d1f]">服务概览</h2>
              <span className="text-[11px] text-[#86868b]">核验周期：<span className="font-mono">2026</span></span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div className="border border-black/[0.06] bg-[#fbfbfd] p-3">
                <div className="text-[#86868b]">最低门槛资费</div>
                <div className="mt-1 font-mono text-base font-semibold text-[#1d1d1f]">
                  {post.pricePlan || '¥14.00 / 月起'}
                </div>
              </div>

              <div className="border border-black/[0.06] bg-[#fbfbfd] p-3">
                <div className="text-[#86868b]">专属优惠</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-base font-semibold text-[#0071e3]">
                    {post.promoCode ? post.promoCode : '直享优惠'}
                  </span>
                  {post.promoCode && (
                    <button
                      type="button"
                      onClick={() => handleCopyPromo(post.promoCode!)}
                      className="inline-flex items-center gap-1 border border-black/[0.1] bg-white px-2 py-0.5 text-[10px] text-[#1d1d1f] hover:bg-neutral-100 transition-colors"
                    >
                      {copied ? <Check size={11} strokeWidth={1.5} /> : <Copy size={11} strokeWidth={1.25} />}
                      <span>{copied ? '已复制' : '复制'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="border border-black/[0.06] bg-[#fbfbfd] p-3">
                <div className="text-[#86868b]">官方入口</div>
                <div className="mt-1">
                  {post.officialUrl ? (
                    <a
                      href={post.officialUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-black bg-black px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800 transition-colors"
                    >
                      <span>直达官网</span>
                      <ExternalLink size={11} strokeWidth={1.25} />
                    </a>
                  ) : (
                    <span className="text-[#86868b]">公开归档</span>
                  )}
                </div>
              </div>
            </div>

            {post.verdictNote && (
              <div className="mt-4 border border-black/[0.06] bg-[#fbfbfd] p-3 text-xs text-[#333336] leading-relaxed">
                <strong>测试说明：</strong>{post.verdictNote}
              </div>
            )}

            <div className="mt-3 text-[11px] text-[#86868b]">
              免责声明：实际套餐资费与节点状态以服务后台为准，建议月付使用。
            </div>
          </section>
        )}

        {/* 核心 Markdown 渲染正文 */}
        <article className="prose-apple">
          <div
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        </article>

        {/* 直角极简互动点赞卡片 */}
        <div className="my-8 border border-black/[0.08] bg-white p-6 text-center">
          <p className="text-xs text-[#6e6e73]">
            测试说明与观察记录。如果本文对您的网络连接或避坑有所启发，欢迎点赞支持。
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleToggleLike}
              className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-medium transition-all ${
                engagement.isLiked
                  ? 'border-[#ff3b30] bg-[#fff2f2] text-[#ff3b30]'
                  : 'border-black/[0.12] bg-white text-[#1d1d1f] hover:border-black/[0.3] hover:bg-[#f5f5f7]'
              }`}
            >
              <Heart
                size={14}
                strokeWidth={1.5}
                className={engagement.isLiked ? 'fill-current text-[#ff3b30]' : 'text-[#6e6e73]'}
              />
              <span>{engagement.isLiked ? '已赞同' : '赞同本文'}</span>
              <span className="font-mono text-xs font-semibold">({engagement.likes})</span>
            </button>
          </div>
        </div>

        {/* FAQ 问答集（直角无圆角，仅针对机场评测类文章呈现；教程类文章内嵌专属详尽 FAQ） */}
        {post.category !== 'jiaocheng' && (
          <section className="my-10 border border-black/[0.08] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#1d1d1f] border-b border-black/[0.06] pb-3">
              常见问题排查 (FAQ)
            </h3>

            <div className="mt-3 divide-y divide-black/[0.04]">
              {defaultFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={faq.q} className="py-2.5">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between py-1 text-left text-xs sm:text-sm font-medium text-[#1d1d1f] hover:text-[#0071e3]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={14}
                        strokeWidth={1.25}
                        className={`text-[#86868b] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        className="mt-2 text-xs leading-relaxed text-[#6e6e73]"
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 相关推荐 */}
        {relatedPosts.length > 0 && (
          <section className="my-10 border-t border-black/[0.08] pt-6">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f]">
                相关推荐文章
              </h3>
              <a href={`/category/${post.category}`} className="text-xs text-[#0071e3] hover:underline">
                查看全部 ➔
              </a>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {relatedPosts.slice(0, 3).map((rel) => (
                <a
                  key={rel.slug}
                  href={`/posts/${rel.slug}`}
                  className="group block border border-black/[0.08] bg-white p-3.5 transition-colors hover:border-black/[0.25] hover:bg-[#f5f5f7]"
                >
                  <div className="font-mono text-[10px] text-[#86868b]">{rel.updatedDate || rel.pubDate}</div>
                  <h4 className="mt-1 text-xs font-medium text-[#1d1d1f] group-hover:text-[#0071e3] line-clamp-2">
                    {rel.title}
                  </h4>
                  <div className="mt-2 text-[11px] text-[#86868b]">
                    <span>阅读文章 →</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

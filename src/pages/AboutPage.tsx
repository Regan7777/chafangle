import React from 'react';
import { Send } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {/* Header */}
        <header className="border-b border-black/[0.08] pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
            关于「VPN查房」博客与评测准则
          </h1>
          <p className="mt-2 text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
            拒绝虚标口号与一次性宣传。重点考察晚高峰连接持续性、主流 AI 工具交互响应与跨区流媒体解锁能力，只沉淀真正能稳定日用的可靠线路。
          </p>
        </header>

        {/* Section 1 */}
        <section className="border border-black/[0.08] bg-white p-6 space-y-3">
          <h2 className="text-base font-semibold text-[#1d1d1f]">一、建站初衷</h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
            选购服务、导入订阅、设置客户端，到连接出现问题时判断原因，是同一条使用链路上的不同环节。许多用户缺少的并不只是服务名单，而是从选择、接入到排查的一套清晰说明。
          </p>
          <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
            <strong className="text-[#1d1d1f]">「VPN查房」</strong>围绕这条使用链路整理内容：机场推荐用于了解不同服务的适用方向；机场评测记录具体服务的线路、套餐与使用情况；配置教程和实用工具则帮助用户完成订阅导入、客户端设置、规则选择，以及测速、DNS 与连通性排查。
          </p>
        </section>

        {/* Section 2 */}
        <section className="border border-black/[0.08] bg-white p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1d1d1f]">二、独立评测三大原则</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
            <div className="border border-black/[0.06] bg-[#fbfbfd] p-4 space-y-1.5">
              <div className="font-semibold text-[#1d1d1f]">
                保持绝对独立性
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                拒绝虚假赞助与充值软文，拒绝虚标口号与一次性宣传。
              </p>
            </div>

            <div className="border border-black/[0.06] bg-[#fbfbfd] p-4 space-y-1.5">
              <div className="font-semibold text-[#1d1d1f]">
                实战场景深度核验
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                重点考察主流 AI 工具交互响应与跨区流媒体解锁能力。
              </p>
            </div>

            <div className="border border-black/[0.06] bg-[#fbfbfd] p-4 space-y-1.5">
              <div className="font-semibold text-[#1d1d1f]">
                晚高峰真实抗压
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                只沉淀真正能稳定日用的可靠线路，扛住晚高峰（20:00–23:00）全网拥堵才是硬实力。
              </p>
            </div>
          </div>
        </section>


        {/* Section 3: Contact */}
        <section className="border border-black/[0.08] bg-white p-6 space-y-3">
          <h2 className="text-base font-semibold text-[#1d1d1f]">三、联络方式与线索反馈</h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
            欢迎向 V 提供测试线索、反馈节点异常或纠偏失实数据：
          </p>
          <div className="pt-2">
            <a
              href="https://t.me/wanfengzn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black bg-black px-4 py-2 font-mono text-xs font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              <Send size={12} strokeWidth={1.25} />
              <span>Telegram: @wanfengzn</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

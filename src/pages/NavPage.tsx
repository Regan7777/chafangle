import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

const FEATURED_AIRPORTS = [
  {
    name: '神行加速',
    tag: 'BGP多线 · 7折',
    desc: '全网多线BGP汇聚入口，支持轻量VLESS协议，折后仅¥16.10/月起，声明不限设备连接，通用订阅需联系客服领取。',
    reviewUrl: '/posts/14-shenxing-jiasu-iepl-premium-review',
    officialUrl: 'https://wuhan01.shenxingaff.com/#/?code=WUQMrgI8',
    type: 'BGP中转',
  },
  {
    name: '大佬云',
    tag: 'BGP中转 · 7折',
    desc: '老牌运营，多核心机房Anycast智能调度，折后¥13.99/月起，声明不限同时登录设备，通用订阅需联系客服领取。',
    reviewUrl: '/posts/15-dalaoyun-bgp-high-value-review',
    officialUrl: 'https://fugui0077.dalaoyunaff.com/#/?code=1o7gYhTL',
    type: 'BGP中转',
  },
  {
    name: '榴莲云',
    tag: '超大流量 · 7折',
    desc: '主打充裕流量配额与Trojan传输协议，折后¥16.80/月起，声明不限设备连接，通用订阅需联系客服领取。',
    reviewUrl: '/posts/17-liulianyun-native-ip-unlock-review',
    officialUrl: 'https://zyrrz.liulianyunaff.com/#/?code=Y6A1M1MN',
    type: 'Trojan中转',
  },
  {
    name: '云界线',
    tag: 'Hy2双擎 · 首单7折',
    desc: '搭载次世代Hysteria 2协议与自适应拥塞控制，折后¥15.40/月起，声明不限设备连接，通用订阅需联系客服领取。',
    reviewUrl: '/posts/19-yunjiexian-pure-iepl-dedicated-review',
    officialUrl: 'https://fugui0077.yunjiexianaff.com/#/?code=qA3LF6hW',
    type: 'Hy2协议',
  },
  {
    name: '环球梯',
    tag: '全球60+国 · 7折',
    desc: 'BGP双线冗余中转与全球多地区节点覆盖，折后¥16.10/月起，声明不限设备登录，提供365天按量包。',
    reviewUrl: '/posts/18-huanqiuti-global-business-review',
    officialUrl: 'https://fugui0077.huanqiutiaff.com/#/?code=rJyQn4xG',
    type: '多节点覆盖',
  },
  {
    name: '闪电鼠',
    tag: '物理超低迟 · 7折',
    desc: '近场网络直连优化与轻量低功耗Shadowsocks协议，折后¥15.40/月起，声明不限设备登录，通用订阅需联系客服领取。',
    reviewUrl: '/posts/16-shandianshu-fast-latency-review',
    officialUrl: 'https://fugui0077.shandianshuaff.com/#/?code=I2yK9PfK',
    type: '低延迟优化',
  },
];

const CLIENT_TOOLS = [
  {
    platform: 'Windows / macOS',
    name: 'Clash Verge Rev',
    type: '开源新锐',
    desc: '现代 UI 界面，内置 Mihomo 内核，完美支持各类订阅格式与分流规则配置。',
    tutorialUrl: '/posts/20-clash-verge-rev-beginner-tutorial',
  },
  {
    platform: 'iOS (iPhone / iPad)',
    name: 'Shadowrocket (小火箭)',
    type: 'iOS标配',
    desc: 'App Store 必备网络代理神器，扫码即配，分流规则全面，性能轻快省电。',
    tutorialUrl: '/posts/21-shadowrocket-ios-beginner-tutorial',
  },
  {
    platform: '全平台 (Win/Mac/Linux/Android)',
    name: 'Sing-box',
    type: '下一代核心',
    desc: '通用代理平台，原生支持 VLESS Reality 与 Hysteria2，内存占用极低。',
    tutorialUrl: '/posts/22-sing-box-next-gen-proxy-tutorial',
  },
  {
    platform: 'Android (安卓)',
    name: 'v2rayNG / Surfboard',
    type: '安卓主流',
    desc: '安卓生态标配客户端，支持分应用代理、节点测速与自动定时更新订阅。',
    tutorialUrl: '/posts/26-android-v2rayng-surfboard-tutorial',
  },
];

export const NavPage: React.FC = () => {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
        {/* Header */}
        <header className="border-b border-black/[0.08] pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            机场推荐
          </h1>
          <p className="mt-2 text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
            集中整理常用机场的套餐资费、适用方向与客户端核验说明，方便你按预算、流量、协议和使用场景客观筛选。
          </p>
        </header>

        {/* Airport Matrix */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f]">
            主流机场参数速览
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_AIRPORTS.map((item) => (
              <div
                key={item.name}
                data-sound="card"
                className="flex flex-col justify-between border border-black/[0.08] bg-white p-5 transition-colors hover:border-black/[0.25]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1d1d1f] text-base">{item.name}</span>
                    <span className="border border-black/[0.08] bg-[#f5f5f7] px-2 py-0.5 text-[11px] text-[#6e6e73]">
                      {item.tag}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[#86868b]">
                    <span>{item.type}</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#6e6e73]">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-3 text-xs">
                  <a
                    href={item.reviewUrl}
                    className="inline-flex items-center gap-1 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                  >
                    <span>实测报告</span>
                    <ArrowRight size={11} strokeWidth={1.25} />
                  </a>

                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium border border-black bg-black text-white px-2.5 py-1 text-xs hover:bg-neutral-800 transition-colors"
                  >
                    <span>直达官网</span>
                    <ExternalLink size={11} strokeWidth={1.25} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Client Tools */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f]">
            客户端接入指南
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CLIENT_TOOLS.map((client) => (
              <a
                key={client.name}
                href={client.tutorialUrl}
                data-sound="card"
                className="group flex flex-col justify-between border border-black/[0.08] bg-white p-4 transition-colors hover:border-black/[0.25] hover:bg-[#f5f5f7]"
              >
                <div>
                  <span className="font-mono text-[10px] text-[#86868b]">{client.platform}</span>
                  <h3 className="mt-1 text-xs font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                    {client.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#6e6e73]">
                    {client.desc}
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-[#0071e3] font-medium">
                  <span>查看教程 →</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

import React from 'react';

type LinkItem = { name: string; detail: string; href: string; external?: boolean };

const External = ({ item }: { item: LinkItem }) => (
  <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} className="block border border-black/[0.08] bg-white p-4 transition-colors hover:border-black/[0.25] hover:bg-[#f5f5f7]">
    <div className="text-sm font-semibold text-[#1d1d1f]">{item.name}</div>
    <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">{item.detail}</p>
  </a>
);

const sections: { title: string; intro: string; links: LinkItem[] }[] = [
  { title: '订阅链接转换工具', intro: '只有服务商没有提供当前客户端可导入的格式时，才需要转换订阅链接；能直接导入时，不需要转换。不要把长期有效的订阅链接提交给陌生公共转换站。', links: [
    { name: '先判断是否需要转换', detail: '站内：确认格式是否不兼容、保留原链接并安全验证。', href: '/posts/37-subscription-format-conversion-guide' },
    { name: 'Subconverter（GitHub）', detail: '外部：专注订阅格式转换的开源项目；适合明确需要转换格式时研究。', href: 'https://github.com/tindy2013/subconverter', external: true },
    { name: 'Sub-Store（GitHub）', detail: '外部：管理、筛选并转换多个订阅的开源项目；功能更适合进阶使用。', href: 'https://github.com/sub-store-org/Sub-Store', external: true },
  ] },
  { title: '测速与 DNS 诊断', intro: '延迟、带宽、DNS 解析与泄漏测试回答的是不同问题；应结合网络环境和时间段解读结果。', links: [
    { name: '网络连通性、测速与 DNS 诊断指南', detail: '站内：测试方法、结果解释与排查顺序。', href: '/posts/38-network-speed-dns-diagnostics-guide' },
    { name: 'Speedtest by Ookla', detail: '外部：网络带宽与延迟测试平台。', href: 'https://www.speedtest.net/', external: true },
    { name: 'Cloudflare Speed Test', detail: '外部：通过浏览器测量连接质量与延迟。', href: 'https://speed.cloudflare.com/', external: true },
    { name: 'Cloudflare DNS 诊断', detail: '外部：DNS 解析器与网络连接检查。', href: 'https://1.1.1.1/help', external: true },
  ] },
  { title: '桌面客户端（Windows、macOS、Linux）', intro: '下载前确认系统与 CPU 架构；只从项目维护的发布页获取安装包。站内文章负责导入、系统代理、TUN 与排错。', links: [
    { name: 'Clash Verge Rev 官方发布页', detail: '外部：Windows、macOS、Linux 的官方 GitHub Releases。', href: 'https://github.com/clash-verge-rev/clash-verge-rev/releases', external: true },
    { name: 'Clash Verge Rev 站内教程', detail: '站内：Windows 安装、订阅导入、系统代理、TUN 与常见错误。', href: '/posts/20-clash-verge-rev-beginner-tutorial' },
  ] },
  { title: 'iPhone 与 iPad 客户端', intro: '仅从 App Store 官方产品页获取应用。是否可下载取决于 App Store 的实际展示和你的账户资格；不要使用陌生安装包或共享账号。', links: [
    { name: 'Shadowrocket 官方 App Store', detail: '外部：Shadowrocket 的 App Store 产品页。', href: 'https://apps.apple.com/app/shadowrocket/id932747118', external: true },
    { name: 'Shadowrocket 站内教程', detail: '站内：下载后授权、导入、规则模式与故障排查。', href: '/posts/21-shadowrocket-ios-beginner-tutorial' },
    { name: 'Clash Mi 官方 App Store', detail: '外部：Clash Mi 的 App Store 产品页。', href: 'https://apps.apple.com/us/app/clash-mi/id6744321968', external: true },
    { name: 'Clash Mi 站内教程', detail: '站内：VPN 授权、订阅导入、规则模式与 iPhone 排错。', href: '/posts/40-clash-mi-ios-beginner-tutorial' },
  ] },
  { title: 'Android 客户端', intro: '只使用项目维护者的发布页；安装后再按照站内教程处理导入、VPN 权限与后台限制。', links: [
    { name: 'v2rayNG 官方发布页', detail: '外部：Android 客户端的官方 GitHub Releases。', href: 'https://github.com/2dust/v2rayNG/releases', external: true },
    { name: 'Surfboard 官方安装文档', detail: '外部：Surfboard 官方提供的安装渠道与更新说明。', href: 'https://getsurfboard.com/docs/installation/', external: true },
    { name: 'v2rayNG 与 Surfboard 站内教程', detail: '站内：Android 导入、VPN 权限、后台限制与 HTTP/解析错误。', href: '/posts/26-android-v2rayng-surfboard-tutorial' },
  ] },
  { title: '规则分流进阶', intro: '这里收录了直连、规则与全局代理的区别，sing-box 的安装与基础教程，以及手动规则配置的说明。完成客户端安装和订阅导入后，再按需要打开对应内容。', links: [
    { name: '直连、规则与全局代理说明', detail: '站内：判断流量走向、模式选择与规则误分流的排查步骤。', href: '/posts/39-direct-rule-global-proxy-modes-guide' },
    { name: 'sing-box 站内基础教程', detail: '站内：配置导入、规则选择、TUN 与日志错误排查。', href: '/posts/22-sing-box-next-gen-proxy-tutorial' },
    { name: 'sing-box 官方安装文档', detail: '外部：官方安装、下载与入门入口。', href: 'https://sing-box.sagernet.org/installation/package-manager/', external: true },
    { name: 'sing-box 规则集配置说明', detail: '外部：说明怎样在 sing-box 配置中使用内置、本地或远程规则集，并设置规则集更新。只在手动编辑 sing-box 配置时查看。', href: 'https://sing-box.sagernet.org/configuration/rule-set/', external: true },
    { name: 'Mihomo 配置与规则参考', detail: '外部：涵盖 DNS、TUN、代理组和路由规则等配置项。需要手动查看或修改 Mihomo 配置时再打开。', href: 'https://wiki.metacubex.one/', external: true },
  ] },
];

export const ToolsPage: React.FC = () => <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
  <header className="border-b border-black/[0.08] pb-7">
    <p className="text-xs font-medium text-[#0071e3]">资源中心</p>
    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1d1d1f]">实用工具</h1>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6e6e73]">官方资源、诊断平台与站内技术文档的聚合入口。外部链接会在新标签页打开；使用前请核对服务条款与隐私说明。</p>
  </header>
  <div className="space-y-9 py-8">{sections.map(section => <section key={section.title}>
    <h2 className="text-lg font-semibold text-[#1d1d1f]">{section.title}</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#6e6e73]">{section.intro}</p>
    <div className="mt-4 grid gap-3 md:grid-cols-2">{section.links.map(item => <External key={item.name} item={item} />)}</div>
  </section>)}</div>
  <section className="border-t border-black/[0.08] py-8"><h2 className="text-lg font-semibold text-[#1d1d1f]">常见问题</h2><div className="mt-4 grid gap-3 md:grid-cols-3">
    <External item={{ name: '导入与连接问题', detail: '查看各客户端教程中的 FAQ 与排障步骤。', href: '/category/jiaocheng' }} />
    <External item={{ name: '服务选择与连通性', detail: '查看网络服务实测与选购说明。', href: '/category/zhuabao' }} />
    <External item={{ name: '获取订阅前的准备', detail: '查看服务导航与客户端适配信息。', href: '/nav' }} />
  </div></section>
</div>;

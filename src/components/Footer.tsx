import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-black/[0.08] bg-[#f5f5f7] text-[#6e6e73]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Slogan */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-sm font-semibold tracking-tight text-[#1d1d1f]">VPN查房</span>
            <p className="text-xs leading-relaxed text-[#6e6e73] max-w-md">
              专注整理常用科学上网工具、主流机场套餐资费与客户端配置教程，提供中立客观的选型参考与使用指南。
            </p>
            <div className="text-[11px] text-[#86868b]">
              免责声明：本站内容仅供技术学习与交流参考，不构成购买建议。请遵守当地法律法规，涉及网络服务请理性决策。
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#1d1d1f]">导航分类</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="/nav" className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                  机场导航
                </a>
              </li>
              <li>
                <a href="/category/zhuabao" className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                  机场评测
                </a>
              </li>
              <li>
                <a href="/category/jiaocheng" className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                  配置教程
                </a>
              </li>
              <li>
                <a href="/tools" className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                  实用工具
                </a>
              </li>
              <li>
                <a href="/posts" className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                  全部文章
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#1d1d1f]">关于本站</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="/about" className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                  评测准则与简介
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-black/[0.06] pt-4 text-xs text-[#86868b] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {currentYear} VPN查房 (chafangle.com). 保留所有权利。
          </div>
        </div>
      </div>
    </footer>
  );
};

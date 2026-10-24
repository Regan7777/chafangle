import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, Send, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentPath?: string;
}

interface NavChild {
  name: string;
  href: string;
  external?: boolean;
}

interface NavItem {
  name: string;
  href: string;
  children?: NavChild[];
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('v_theme') === 'dark' ||
        (!localStorage.getItem('v_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('v_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  };

  const navItems: NavItem[] = [
    { name: '首页', href: '/' },
    { name: '机场推荐', href: '/nav' },
    { name: '机场评测', href: '/category/zhuabao' },
    {
      name: '配置教程',
      href: '/category/jiaocheng',
      children: [
        { name: '全部配置教程', href: '/category/jiaocheng' },
        { name: 'Windows：Clash Verge Rev', href: '/posts/20-clash-verge-rev-beginner-tutorial' },
        { name: 'iPhone/iPad：Shadowrocket', href: '/posts/21-shadowrocket-ios-beginner-tutorial' },
        { name: 'Android：v2rayNG 与 Surfboard', href: '/posts/26-android-v2rayng-surfboard-tutorial' },
        { name: '流媒体与社交平台教程', href: '/posts/27-chatgpt-netflix-streaming-ip-unlock-guide' },
        { name: 'sing-box 基础教程', href: '/posts/22-sing-box-next-gen-proxy-tutorial' },
        { name: '直连、规则与全局代理', href: '/posts/39-direct-rule-global-proxy-modes-guide' },
        { name: 'ChatGPT、Claude 与 Gemini', href: '/posts/42-chatgpt-claude-gemini-troubleshooting-guide' },
      ],
    },
    {
      name: '实用工具',
      href: '/tools',
      children: [
        { name: '全部实用工具', href: '/tools' },
        { name: '订阅格式转换', href: '/posts/37-subscription-format-conversion-guide' },
        { name: '网络测速与 DNS 诊断', href: '/posts/38-network-speed-dns-diagnostics-guide' },
        { name: 'sing-box 官方安装文档', href: 'https://sing-box.sagernet.org/installation/package-manager/', external: true },
        { name: 'sing-box 规则集配置说明', href: 'https://sing-box.sagernet.org/configuration/rule-set/', external: true },
        { name: 'Mihomo 配置与规则参考', href: 'https://wiki.metacubex.one/', external: true },
      ],
    },
    { name: '关于本站', href: '/about' },
  ];


  const cleanPath = currentPath.replace(/\/$/, '') || '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.08] dark:border-white/[0.08] bg-white/85 dark:bg-[#0b0b0c]/85 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="V" className="h-6 w-6 object-contain rounded-md" />
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">VPN查房</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="主导航">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? cleanPath === '/'
              : cleanPath.startsWith(item.href) || item.children?.some((child) => cleanPath.startsWith(child.href));

            if (!item.children) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1 text-xs transition-colors ${
                    isActive
                      ? 'text-[#1d1d1f] font-semibold'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  {item.name}
                </a>
              );
            }

            const expanded = openMenu === item.name;
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.name)}
                onMouseLeave={() => setOpenMenu(null)}
                onFocus={() => setOpenMenu(item.name)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
                }}
              >
                <a
                  href={item.href}
                  aria-haspopup="menu"
                  aria-expanded={expanded}
                  className={`flex items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                    isActive
                      ? 'text-[#1d1d1f] font-semibold'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  {item.name}
                  <ChevronDown size={12} strokeWidth={1.5} aria-hidden="true" />
                </a>
                {expanded && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full z-50 w-64 border border-black/[0.1] bg-white p-2 shadow-lg"
                  >
                    <div className="grid gap-0.5">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          target={child.external ? '_blank' : undefined}
                          rel={child.external ? 'noopener noreferrer' : undefined}
                          className={`px-3 py-2 text-xs leading-snug transition-colors hover:bg-[#f5f5f7] hover:text-[#0071e3] ${
                            cleanPath.startsWith(child.href) ? 'bg-[#f5f5f7] text-[#1d1d1f] font-medium' : 'text-[#4b4b50]'
                          }`}
                        >
                          {child.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Actions: Telegram Airplane Icon + Theme Toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://t.me/wanfengzn"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-[#6e6e73] hover:text-[#0071e3] transition-colors"
            title="Telegram"
            aria-label="Telegram"
          >
            <Send size={15} strokeWidth={1.5} />
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            className="cursor-pointer p-1 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
            title={theme === 'dark' ? '切换为白天模式' : '切换为黑夜模式'}
            aria-label="切换白天黑夜模式"
          >
            {theme === 'dark' ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Right Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="https://t.me/wanfengzn"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-[#6e6e73] hover:text-[#0071e3] transition-colors"
            title="Telegram"
            aria-label="Telegram"
          >
            <Send size={15} strokeWidth={1.5} />
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            className="cursor-pointer p-1 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
            title={theme === 'dark' ? '切换为白天模式' : '切换为黑夜模式'}
            aria-label="切换白天黑夜模式"
          >
            {theme === 'dark' ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-[#6e6e73] hover:text-[#1d1d1f]"
            aria-label="切换菜单"
          >
            {mobileMenuOpen ? <X size={18} strokeWidth={1.25} /> : <Menu size={18} strokeWidth={1.25} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-black/[0.08] bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.href === '/'
                ? cleanPath === '/'
                : cleanPath.startsWith(item.href) || item.children?.some((child) => cleanPath.startsWith(child.href));

              return (
                <div key={item.href}>
                  <a
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 text-xs ${
                      isActive
                        ? 'text-[#1d1d1f] font-semibold bg-black/[0.04]'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {item.name}
                    {item.children && <ChevronDown size={12} strokeWidth={1.5} aria-hidden="true" />}
                  </a>
                  {item.children && (
                    <div className="ml-3 border-l border-black/[0.08] py-1">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          target={child.external ? '_blank' : undefined}
                          rel={child.external ? 'noopener noreferrer' : undefined}
                          className="block px-3 py-1.5 text-xs text-[#6e6e73] hover:text-[#0071e3]"
                        >
                          {child.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <a
              href="https://t.me/wanfengzn"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-between border-t border-black/[0.06] pt-2 text-xs text-[#6e6e73]"
            >
              <span>联系 Telegram (@wanfengzn)</span>
              <ArrowUpRight size={13} strokeWidth={1.25} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

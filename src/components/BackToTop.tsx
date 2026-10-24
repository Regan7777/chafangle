import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollTop > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
        setScrollPercent(percent);
      } else {
        setScrollPercent(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={`返回顶部，当前阅读进度 ${scrollPercent}%`}
      title="一键置顶"
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 flex-col items-center justify-center border border-black/[0.12] bg-white text-[#1d1d1f] shadow-sm transition-all duration-200 hover:border-black/[0.3] hover:bg-[#f5f5f7] active:bg-[#e8e8ed]"
    >
      <ArrowUp size={13} strokeWidth={1.5} className="text-[#1d1d1f]" />
      <span className="font-mono text-[10px] font-medium leading-none text-[#6e6e73]">
        {scrollPercent}%
      </span>
    </button>
  );
};

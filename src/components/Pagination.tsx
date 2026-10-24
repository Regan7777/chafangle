import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // 计算展示的页码（当页数较多时自动省略）
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="分页导航" className="mt-8 flex items-center justify-center gap-1.5 text-xs">
      {/* 上一页 */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`inline-flex h-8 items-center gap-1 border px-3 transition-colors ${
          currentPage <= 1
            ? 'cursor-not-allowed border-black/[0.06] bg-transparent text-[#b0b0b8]'
            : 'border-black/[0.12] bg-white text-[#1d1d1f] hover:border-black/[0.3] hover:bg-[#f5f5f7]'
        }`}
      >
        <ChevronLeft size={13} strokeWidth={1.5} />
        <span>上一页</span>
      </button>

      {/* 页码 */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-[#86868b]">
              ···
            </span>
          );
        }

        const pageNum = p as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex h-8 min-w-[32px] items-center justify-center border px-2 font-mono transition-colors ${
              isActive
                ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white font-medium'
                : 'border-black/[0.12] bg-white text-[#1d1d1f] hover:border-black/[0.3] hover:bg-[#f5f5f7]'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* 下一页 */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`inline-flex h-8 items-center gap-1 border px-3 transition-colors ${
          currentPage >= totalPages
            ? 'cursor-not-allowed border-black/[0.06] bg-transparent text-[#b0b0b8]'
            : 'border-black/[0.12] bg-white text-[#1d1d1f] hover:border-black/[0.3] hover:bg-[#f5f5f7]'
        }`}
      >
        <span>下一页</span>
        <ChevronRight size={13} strokeWidth={1.5} />
      </button>
    </nav>
  );
};

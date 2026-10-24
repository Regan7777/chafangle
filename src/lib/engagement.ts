// 真实互动与访问量引擎 (Pure Real Engagement & Visits Engine)
// 双引擎架构：
// 1. 本地零延迟秒显（localStorage 缓存，首屏 0ms 闪现，绝不阻塞渲染与 SEO）
// 2. 云端全网实时累加（Cloudflare Pages Functions /api/counter 边缘 API，静默双向同步）
// 3. 容灾降级兜底：离线或本地开发时静默回退，绝不抛错，确保物理 SSG 100% 稳定性。

export interface ArticleMetrics {
  slug: string;
  title: string;
  href: string;
}

const STORAGE_VIEW_PREFIX = 'v_post_views_';
const STORAGE_LIKE_PREFIX = 'v_post_liked_';
const STORAGE_LIKES_COUNT_PREFIX = 'v_post_likes_count_';
const SESSION_VIEW_FLAG_PREFIX = 'v_session_viewed_';
const API_BASE_URL = '/api/counter';

/**
 * 安全触发全站更新自定义事件
 */
function emitEngagementUpdate(slug: string, detail: { views?: number; likes?: number; isLiked?: boolean }) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent('v-engagement-update', {
        detail: { slug, ...detail },
      })
    );
  } catch {
    // 忽略非浏览器环境或事件异常
  }
}

/**
 * 后台异步从 Cloudflare 云端拉取单篇文章最新指标并刷新本地缓存
 */
async function syncFromCloud(slug: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch(`${API_BASE_URL}?slug=${encodeURIComponent(slug)}&action=get`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data && typeof data.views === 'number' && typeof data.likes === 'number') {
      const localViews = parseInt(localStorage.getItem(`${STORAGE_VIEW_PREFIX}${slug}`) || '0', 10);
      const localLikes = parseInt(localStorage.getItem(`${STORAGE_LIKES_COUNT_PREFIX}${slug}`) || '0', 10);

      // 云端权威值通常大于或等于本地值，取两者的最新同步值
      const finalViews = Math.max(localViews, data.views);
      const finalLikes = Math.max(localLikes, data.likes);

      localStorage.setItem(`${STORAGE_VIEW_PREFIX}${slug}`, String(finalViews));
      localStorage.setItem(`${STORAGE_LIKES_COUNT_PREFIX}${slug}`, String(finalLikes));

      emitEngagementUpdate(slug, { views: finalViews, likes: finalLikes });
    }
  } catch {
    // 静默降级，保持本地存储正常运行
  }
}

/**
 * 记录单篇文章的真实访问量：打开文章时自增 +1，并向云端同步
 */
export function recordPostView(slug: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const sessionKey = `${SESSION_VIEW_FLAG_PREFIX}${slug}`;
    const storageKey = `${STORAGE_VIEW_PREFIX}${slug}`;
    let currentViews = parseInt(localStorage.getItem(storageKey) || '0', 10);

    // 单次会话不重复刷访问量
    if (!sessionStorage.getItem(sessionKey)) {
      currentViews += 1;
      localStorage.setItem(storageKey, String(currentViews));
      sessionStorage.setItem(sessionKey, '1');

      emitEngagementUpdate(slug, { views: currentViews });

      // 异步上报至 Cloudflare 边缘云端
      fetch(`${API_BASE_URL}?slug=${encodeURIComponent(slug)}&action=view`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.views === 'number') {
            const authoritativeViews = Math.max(currentViews, data.views);
            localStorage.setItem(storageKey, String(authoritativeViews));
            emitEngagementUpdate(slug, { views: authoritativeViews });
          }
        })
        .catch(() => {
          // 静默降级
        });
    } else {
      // 若已访问过，仍发起一次拉取以获得全网最新累加数据
      syncFromCloud(slug);
    }

    return currentViews;
  } catch {
    return 0;
  }
}

/**
 * 获取文章当前的真实阅读量与点赞数（本地立即返回，并在后台静默同步全网数据）
 */
export function getPostEngagement(slug: string): { views: number; likes: number; isLiked: boolean } {
  if (typeof window === 'undefined') {
    return { views: 0, likes: 0, isLiked: false };
  }
  try {
    const views = parseInt(localStorage.getItem(`${STORAGE_VIEW_PREFIX}${slug}`) || '0', 10);
    const likes = parseInt(localStorage.getItem(`${STORAGE_LIKES_COUNT_PREFIX}${slug}`) || '0', 10);
    const isLiked = localStorage.getItem(`${STORAGE_LIKE_PREFIX}${slug}`) === 'true';

    // 触发后台轻量拉取，保证数据最终一致性
    syncFromCloud(slug);

    return { views, likes, isLiked };
  } catch {
    return { views: 0, likes: 0, isLiked: false };
  }
}

/**
 * 真实点赞切换：本地乐观即时响应，并在云端完成全网累加
 */
export function togglePostLike(slug: string): { likes: number; isLiked: boolean } {
  if (typeof window === 'undefined') {
    return { likes: 0, isLiked: false };
  }
  try {
    const isLiked = localStorage.getItem(`${STORAGE_LIKE_PREFIX}${slug}`) === 'true';
    const nextLiked = !isLiked;
    let currentLikes = parseInt(localStorage.getItem(`${STORAGE_LIKES_COUNT_PREFIX}${slug}`) || '0', 10);
    currentLikes = nextLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    // 本地乐观更新
    localStorage.setItem(`${STORAGE_LIKE_PREFIX}${slug}`, String(nextLiked));
    localStorage.setItem(`${STORAGE_LIKES_COUNT_PREFIX}${slug}`, String(currentLikes));

    emitEngagementUpdate(slug, { likes: currentLikes, isLiked: nextLiked });

    // 异步同步到云端
    const delta = nextLiked ? '1' : '-1';
    fetch(`${API_BASE_URL}?slug=${encodeURIComponent(slug)}&action=like&delta=${delta}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.likes === 'number') {
          const authoritativeLikes = Math.max(0, data.likes);
          localStorage.setItem(`${STORAGE_LIKES_COUNT_PREFIX}${slug}`, String(authoritativeLikes));
          emitEngagementUpdate(slug, { likes: authoritativeLikes, isLiked: nextLiked });
        }
      })
      .catch(() => {
        // 静默降级
      });

    return { likes: currentLikes, isLiked: nextLiked };
  } catch {
    return { likes: 0, isLiked: false };
  }
}

/**
 * 批量同步全站排行榜数据
 */
export async function syncAllCloudMetrics(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch(`${API_BASE_URL}?action=all`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return;
    const json = await res.json();
    if (json && json.status === 'ok' && json.data) {
      let updated = false;
      Object.entries(json.data as Record<string, { views: number; likes: number }>).forEach(([slug, val]) => {
        if (typeof val.views === 'number') {
          localStorage.setItem(`${STORAGE_VIEW_PREFIX}${slug}`, String(val.views));
          updated = true;
        }
        if (typeof val.likes === 'number') {
          localStorage.setItem(`${STORAGE_LIKES_COUNT_PREFIX}${slug}`, String(val.likes));
          updated = true;
        }
      });
      if (updated) {
        emitEngagementUpdate('__all__', {});
      }
    }
  } catch {
    // 离线或本地时降级
  }
}

/**
 * 热门文章排行：按访问次数排序（支持动态注入 posts 保证单一数据源）
 */
export function getHotRankings(posts?: { slug: string; title: string }[]) {
  const sourceList = posts || [];
  return sourceList.slice(0, 10).map((item) => {
    let views = 0;
    if (typeof window !== 'undefined') {
      try {
        views = parseInt(localStorage.getItem(`${STORAGE_VIEW_PREFIX}${item.slug}`) || '0', 10);
      } catch {
        views = 0;
      }
    }
    return { slug: item.slug, title: item.title, href: `/posts/${item.slug}`, views };
  }).sort((a, b) => b.views - a.views);
}

/**
 * 点赞排行：按获赞数排序（支持动态注入 posts 保证单一数据源）
 */
export function getLikeRankings(posts?: { slug: string; title: string }[]) {
  const sourceList = posts || [];
  return sourceList.slice(0, 10).map((item) => {
    let currentLikes = 0;
    if (typeof window !== 'undefined') {
      try {
        currentLikes = parseInt(localStorage.getItem(`${STORAGE_LIKES_COUNT_PREFIX}${item.slug}`) || '0', 10);
      } catch {
        currentLikes = 0;
      }
    }
    return { slug: item.slug, title: item.title, href: `/posts/${item.slug}`, currentLikes };
  }).sort((a, b) => b.currentLikes - a.currentLikes);
}

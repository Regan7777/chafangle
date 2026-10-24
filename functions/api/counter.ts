interface Env {
  CHAFANGLE_KV?: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string) => Promise<void>;
    list: (options?: { prefix?: string }) => Promise<{ keys: { name: string }[] }>;
  };
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

export const onRequest = async (context: PagesFunctionContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'get';
  const slug = (url.searchParams.get('slug') || '').trim();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 若 Cloudflare KV 尚未绑定，返回优雅降级提示，避免前端抛错
  if (!env.CHAFANGLE_KV) {
    return new Response(
      JSON.stringify({
        status: 'unbound',
        message: 'Cloudflare KV (CHAFANGLE_KV) is not bound yet. Please bind in Cloudflare Pages dashboard.',
        slug,
        views: 0,
        likes: 0,
      }),
      { headers: corsHeaders }
    );
  }

  const kv = env.CHAFANGLE_KV;

  try {
    // 批量拉取大盘全量数据（供右侧边栏排行榜快速渲染）
    if (action === 'all') {
      const list = await kv.list({ prefix: 'post_' });
      const results: Record<string, { views: number; likes: number }> = {};

      for (const item of list.keys) {
        // key 格式: post_{slug}_{type}
        const parts = item.name.split('_');
        const type = parts.pop();
        const postSlug = parts.slice(1).join('_');
        if (!postSlug) continue;

        if (!results[postSlug]) {
          results[postSlug] = { views: 0, likes: 0 };
        }
        const val = parseInt((await kv.get(item.name)) || '0', 10);
        if (type === 'views') results[postSlug].views = val;
        if (type === 'likes') results[postSlug].likes = val;
      }

      return new Response(JSON.stringify({ status: 'ok', data: results }), { headers: corsHeaders });
    }

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const viewsKey = `post_${slug}_views`;
    const likesKey = `post_${slug}_likes`;

    let views = parseInt((await kv.get(viewsKey)) || '0', 10);
    let likes = parseInt((await kv.get(likesKey)) || '0', 10);

    // 访问量真实自增
    if (action === 'view') {
      views += 1;
      await kv.put(viewsKey, String(views));
    }
    // 点赞真实增减 (+1 / -1)
    else if (action === 'like') {
      const delta = parseInt(url.searchParams.get('delta') || '1', 10);
      likes = Math.max(0, likes + delta);
      await kv.put(likesKey, String(likes));
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        slug,
        views,
        likes,
      }),
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

import { GET as getSitemapXml } from './sitemap.xml';

export async function GET(context: any) {
  return getSitemapXml(context);
}

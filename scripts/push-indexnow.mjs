import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const HOST = 'chafangle.com';
const KEY = '7ec54bed5e684bee9e50ea059b0e5538';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.resolve(ROOT_DIR, 'dist/sitemap.xml');

async function pushToIndexNow() {
  console.log('📡 [IndexNow] Preparing URL batch for submission...');

  let urlList = [];

  if (fs.existsSync(SITEMAP_PATH)) {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const matches = [...sitemapContent.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
    urlList = matches.map(m => m[1]);
  }

  // Fallback if dist/sitemap.xml not yet built
  if (urlList.length === 0) {
    console.log('⚠️ [IndexNow] dist/sitemap.xml not found, extracting from posts...');
    const postsDir = path.resolve(ROOT_DIR, 'src/content/posts');
    const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    const coreRoutes = [
      `https://${HOST}/`,
      `https://${HOST}/posts`,
      `https://${HOST}/nav`,
      `https://${HOST}/tools`,
      `https://${HOST}/about`,
      `https://${HOST}/categories`,
      `https://${HOST}/category/zhuabao`,
      `https://${HOST}/category/mofan`,
      `https://${HOST}/category/jiaocheng`,
    ];
    const postUrls = postFiles.map(f => `https://${HOST}/posts/${f.replace(/\.md$/, '')}`);
    urlList = [...coreRoutes, ...postUrls];
  }

  console.log(`📦 [IndexNow] Found ${urlList.length} unique URLs to submit.`);
  console.log(`🔑 [IndexNow] Key: ${KEY}`);
  console.log(`📍 [IndexNow] Key Location: ${KEY_LOCATION}`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🚀 [IndexNow] Sending request to ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      console.log(`   Response status: ${response.status} ${response.statusText}`);
      if (response.status === 200 || response.status === 202) {
        console.log(`✅ [IndexNow] Successfully submitted ${urlList.length} URLs to ${endpoint}`);
      } else {
        const text = await response.text();
        console.log(`⚠️ [IndexNow] Endpoint returned status ${response.status}: ${text}`);
      }
    } catch (err) {
      console.error(`❌ [IndexNow] Error submitting to ${endpoint}:`, err.message);
    }
  }
}

pushToIndexNow();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = 'c:/Users/78432/Desktop/总落地博客/查房了博客chafangle.com';
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const POSTS_DIR = path.resolve(ROOT_DIR, 'src/content/posts');

console.log('🔍 [Link Audit] Starting comprehensive full-stack link and topology inspection...\n');

// 1. Collect all HTML files in dist/
function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);
console.log(`📂 Found ${htmlFiles.length} rendered HTML pages in dist/`);

// 2. Parse Links from HTML
const internalLinkRegex = /href=["'](\/[^"'#?]*|https:\/\/chafangle\.com\/[^"'#?]*)["']/g;
const externalLinkRegex = /href=["'](https?:\/\/(?!chafangle\.com)[^"'\s]+)["']/g;
const assetSrcRegex = /src=["'](\/[^"'#?]*|https:\/\/chafangle\.com\/[^"'#?]*)["']/g;

let totalInternalLinks = 0;
const deadInternalLinks = [];
const handbookOccurrences = [];
const allExternalUrls = new Set();
const internalLinkGraph = new Map(); // target -> Array of sources

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const relPath = path.relative(DIST_DIR, htmlFile).replace(/\\/g, '/');

  // Check /handbook
  if (content.includes('/handbook')) {
    handbookOccurrences.push(relPath);
  }

  // Check internal hrefs
  let match;
  while ((match = internalLinkRegex.exec(content)) !== null) {
    totalInternalLinks++;
    let rawTarget = match[1].replace('https://chafangle.com', '');
    if (!rawTarget.startsWith('/')) rawTarget = '/' + rawTarget;

    // Record source
    if (!internalLinkGraph.has(rawTarget)) {
      internalLinkGraph.set(rawTarget, []);
    }
    internalLinkGraph.get(rawTarget).push(relPath);

    // Verify physical file existence
    const cleanTarget = rawTarget.replace(/^\//, '');
    let exists = false;

    if (cleanTarget === '') {
      exists = fs.existsSync(path.join(DIST_DIR, 'index.html'));
    } else {
      const option1 = path.join(DIST_DIR, cleanTarget, 'index.html');
      const option2 = path.join(DIST_DIR, `${cleanTarget}.html`);
      const option3 = path.join(DIST_DIR, cleanTarget);
      exists = fs.existsSync(option1) || fs.existsSync(option2) || fs.existsSync(option3);
    }

    if (!exists) {
      deadInternalLinks.push({ source: relPath, target: rawTarget });
    }
  }

  // Check asset src
  while ((match = assetSrcRegex.exec(content)) !== null) {
    let rawSrc = match[1].replace('https://chafangle.com', '');
    if (!rawSrc.startsWith('/')) rawSrc = '/' + rawSrc;
    const cleanSrc = rawSrc.replace(/^\//, '');
    const assetPath = path.join(DIST_DIR, cleanSrc);
    if (!fs.existsSync(assetPath)) {
      deadInternalLinks.push({ source: relPath, target: rawSrc, type: 'asset' });
    }
  }

  // Check external hrefs
  while ((match = externalLinkRegex.exec(content)) !== null) {
    const extUrl = match[1];
    // Filter out schemas, xml namespaces, font CDNs
    if (!extUrl.includes('schema.org') &&
        !extUrl.includes('w3.org') &&
        !extUrl.includes('fonts.googleapis.com') &&
        !extUrl.includes('fonts.gstatic.com')) {
      allExternalUrls.add(extUrl);
    }
  }
}

// Also check external URLs in markdown posts and components
const postFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
for (const pf of postFiles) {
  const postContent = fs.readFileSync(path.join(POSTS_DIR, pf), 'utf8');
  let m;
  const mdUrlRegex = /https?:\/\/[^\s)\]"'>]+/g;
  while ((m = mdUrlRegex.exec(postContent)) !== null) {
    const u = m[0].replace(/[.,;:)\]]+$/, '');
    if (!u.includes('chafangle.com') && !u.includes('schema.org') && !u.includes('w3.org')) {
      allExternalUrls.add(u);
    }
  }
}

console.log(`\n========================================`);
console.log(`📊 INTERNAL LINK INTEGRITY SUMMARY`);
console.log(`========================================`);
console.log(`Total internal links checked: ${totalInternalLinks}`);
console.log(`Dead internal links found: ${deadInternalLinks.length}`);
if (deadInternalLinks.length > 0) {
  console.log('🚨 DEAD INTERNAL LINKS:');
  for (const item of deadInternalLinks) {
    console.log(`   - [${item.source}] -> ${item.target} (${item.type || 'page'})`);
  }
} else {
  console.log(`✅ 100% INTERNAL LINKS VALID! ZERO 404 DEAD LINKS.`);
}

console.log(`\nForbidden /handbook links: ${handbookOccurrences.length}`);
if (handbookOccurrences.length > 0) {
  console.log(`🚨 Found /handbook in: ${handbookOccurrences.join(', ')}`);
} else {
  console.log(`✅ /handbook is 100% CLEAN (0 occurrences).`);
}

// 3. Bidirectional Interlink & Topology Verification
console.log(`\n========================================`);
console.log(`🔗 BIDIRECTIONAL INTERLINK TOPOLOGY AUDIT`);
console.log(`========================================`);

let reviewsMissingTutorialLink = 0;
let tutorialsWithForcedAffiliate = 0;
let orphanPosts = [];

const reviewPosts = [];
const tutorialPosts = [];

for (const pf of postFiles) {
  const content = fs.readFileSync(path.join(POSTS_DIR, pf), 'utf8');
  const slug = pf.replace(/\.md$/, '');
  const urlPath = `/posts/${slug}`;

  // Check if post is linked anywhere
  const incoming = internalLinkGraph.get(urlPath) || [];
  if (incoming.length === 0) {
    orphanPosts.push(slug);
  }

  if (content.includes('category: "zhuabao"') || content.includes('category: "mofan"')) {
    reviewPosts.push({ slug, content });
    // Check if review links to tutorials
    const hasTutorialLink = content.includes('/posts/20-clash') ||
                            content.includes('/posts/21-shadowrocket') ||
                            content.includes('/posts/22-sing-box') ||
                            content.includes('/category/jiaocheng') ||
                            content.includes('/nav');
    if (!hasTutorialLink) {
      reviewsMissingTutorialLink++;
      console.log(`⚠️ Review article [${slug}] has weak interlink to tutorials or /nav`);
    }
  } else if (content.includes('category: "jiaocheng"')) {
    tutorialPosts.push({ slug, content });
    // Check if tutorial has forced promotion or affiliate
    if (content.includes('aff') || content.includes('go/') || content.includes('code=')) {
      tutorialsWithForcedAffiliate++;
      console.log(`🚨 Tutorial [${slug}] contains commercial affiliate promotion!`);
    }
  }
}

console.log(`Total review posts: ${reviewPosts.length}`);
console.log(`Total tutorial posts: ${tutorialPosts.length}`);
console.log(`Reviews with proper tutorial/nav interlinks: ${reviewPosts.length - reviewsMissingTutorialLink} / ${reviewPosts.length}`);
console.log(`Tutorials with zero commercial affiliation: ${tutorialPosts.length - tutorialsWithForcedAffiliate} / ${tutorialPosts.length}`);
console.log(`Orphan articles (unreachable from site): ${orphanPosts.length}`);
if (orphanPosts.length > 0) {
  console.log(`🚨 Orphan posts: ${orphanPosts.join(', ')}`);
} else {
  console.log(`✅ ZERO orphan articles. All articles are securely stitched into navigation, categories, and article streams!`);
}

// 4. Test External Links
console.log(`\n========================================`);
console.log(`🌐 EXTERNAL LINK STATUS AUDIT`);
console.log(`========================================`);
console.log(`Found ${allExternalUrls.size} unique external URLs. Testing connectivity...\n`);

const externalResults = [];

async function testUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return { url, status: res.status, statusText: res.statusText, ok: res.ok };
  } catch (err) {
    return { url, status: 0, statusText: err.name === 'AbortError' ? 'TIMEOUT (7s)' : err.message, ok: false };
  }
}

// Run in batches of 5 to avoid overloading
const urlArray = Array.from(allExternalUrls);
const batchSize = 5;
for (let i = 0; i < urlArray.length; i += batchSize) {
  const batch = urlArray.slice(i, i + batchSize);
  const results = await Promise.all(batch.map(u => testUrl(u)));
  for (const r of results) {
    externalResults.push(r);
    const symbol = r.ok ? '✅' : (r.status >= 300 && r.status < 400 ? '🔀' : (r.status === 403 ? '🛡️' : '❌'));
    console.log(`${symbol} [${r.status || 'ERR'}] ${r.url} (${r.statusText})`);
  }
}

console.log(`\n========================================`);
console.log(`🏁 EXTERNAL AUDIT SUMMARY`);
console.log(`========================================`);
const okCount = externalResults.filter(r => r.ok).length;
const blockedOrWafCount = externalResults.filter(r => r.status === 403 || r.status === 401).length;
const deadOrTimeoutCount = externalResults.filter(r => !r.ok && r.status !== 403 && r.status !== 401).length;

console.log(`Total External URLs: ${externalResults.length}`);
console.log(`✅ Normal / OK (200~299): ${okCount}`);
console.log(`🛡️ Protected / Cloudflare / WAF (403): ${blockedOrWafCount}`);
console.log(`⚠️ Dead / Timeout / Error: ${deadOrTimeoutCount}`);

fs.writeFileSync(
  path.resolve(ROOT_DIR, 'link-audit-report.json'),
  JSON.stringify({
    timestamp: new Date().toISOString(),
    internalLinks: { total: totalInternalLinks, dead: deadInternalLinks },
    interlinks: { reviewsMissingTutorialLink, tutorialsWithForcedAffiliate, orphanPosts },
    externalLinks: externalResults,
  }, null, 2)
);

console.log(`\n📄 Detailed report written to link-audit-report.json`);

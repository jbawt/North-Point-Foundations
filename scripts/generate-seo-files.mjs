/**
 * After `vite build`, writes `dist/robots.txt` and `dist/sitemap.xml` using `VITE_SITE_URL`
 * and the same base path logic as `vite.config.ts` (`GITHUB_PAGES_BASE`).
 *
 * Example:
 *   cross-env VITE_SITE_URL=https://yoursite.com npm run build
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');

const siteUrl = process.env.VITE_SITE_URL?.trim().replace(/\/$/, '');
const rawBase = process.env.GITHUB_PAGES_BASE?.trim();
const pagesBase = rawBase && rawBase !== '' ? rawBase : '/';
const basePath = pagesBase.endsWith('/') ? pagesBase : `${pagesBase}/`;

function absoluteLoc(path) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const pathPart = cleanPath ? `/${cleanPath}` : '/';
  const relative =
    basePath === '/' ? pathPart : `${basePath.replace(/\/$/, '')}${pathPart}`;
  return `${siteUrl}${relative}`;
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Indexed marketing URLs only (matches `noindex` rules in `SeoHead`). */
const SITEMAP_PATHS = ['/', '/services', '/about', '/contact'];

function main() {
  if (!existsSync(dist)) {
    console.warn('generate-seo-files: dist/ missing — skip (run vite build first).');
    return;
  }

  const robotsPublic = join(process.cwd(), 'public', 'robots.txt');
  let robotsBody = `User-agent: *\nAllow: /\n`;
  if (existsSync(robotsPublic)) {
    robotsBody = readFileSync(robotsPublic, 'utf8');
  }

  if (!siteUrl) {
    console.warn(
      'generate-seo-files: VITE_SITE_URL not set — copied robots only (no Sitemap line). Set VITE_SITE_URL for production.',
    );
    writeFileSync(join(dist, 'robots.txt'), robotsBody, 'utf8');
    return;
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_PATHS.map(
  (path) => `  <url>
    <loc>${escapeXml(absoluteLoc(path))}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
).join('\n')}
</urlset>
`;

  const sitemapUrl = absoluteLoc('/sitemap.xml');
  const robotsOut =
    robotsBody.trimEnd() +
    '\n\n' +
    `# Generated at build — submit this URL in Search Console\n` +
    `Sitemap: ${sitemapUrl}\n`;

  writeFileSync(join(dist, 'robots.txt'), robotsOut, 'utf8');
  writeFileSync(join(dist, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log('generate-seo-files: wrote dist/robots.txt and dist/sitemap.xml');
}

main();

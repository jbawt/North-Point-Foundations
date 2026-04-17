/**
 * GitHub Pages serves `404.html` for unknown URLs. Copying the built SPA shell there
 * allows client-side routing to load on refresh / deep links.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const index = join(dist, 'index.html');
const notFound = join(dist, '404.html');

if (!existsSync(index)) {
  console.error('gh-pages-hydrate: dist/index.html missing — run vite build first.');
  process.exit(1);
}

copyFileSync(index, notFound);
console.log('gh-pages-hydrate: wrote dist/404.html');

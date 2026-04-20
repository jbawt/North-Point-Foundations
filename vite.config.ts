/// <reference types="node" />
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub project pages: `https://<user>.github.io/<repo>/`
 * Set `GITHUB_PAGES_BASE` to `/<repo>/` for those builds; omit or use `/` for
 * `username.github.io` repos or hosts at the domain root (e.g. Netlify).
 */
/** Treat blank like unset — `??` alone misses `GITHUB_PAGES_BASE=""` in CI. */
const rawBase = process.env.GITHUB_PAGES_BASE?.trim();
const pagesBase = rawBase && rawBase !== '' ? rawBase : '/';
const base = pagesBase.endsWith('/') ? pagesBase : `${pagesBase}/`;

function thankYouFormAction(): string {
  if (base === '/') return '/thank-you';
  const prefix = base.replace(/\/$/, '');
  return `${prefix}/thank-you`;
}

/** PageSpeed “Render blocking requests”: avoid synchronous stylesheet links in `<head>`. */
function nonBlockingStylesheetLinks(html: string): string {
  return html.replace(/<link\s+rel="stylesheet"([^>]+)>/g, (full, inner: string) => {
    if (!/\bhref="[^"]+\.css"/.test(inner)) return full;
    const trimmed = inner.replace(/\s+/g, ' ').trim();
    const spacer = trimmed ? ` ${trimmed}` : '';
    return (
      `<link rel="preload" as="style"${spacer} onload="this.onload=null;this.rel='stylesheet'">` +
      `<noscript>${full}</noscript>`
    );
  });
}

export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'npf-index-html-base-hints',
      transformIndexHtml(html) {
        const action = thankYouFormAction();
        let out = html.replaceAll('action="/thank-you"', `action="${action}"`).replaceAll(
          'href="/favicon_io/',
          `href="${base}favicon_io/`,
        );
        out = nonBlockingStylesheetLinks(out);
        return out;
      },
    },
  ],
  build: {
    cssMinify: 'esbuild',
    /** mapbox-gl is ~1.7MB minified; the default 500 kB warning is noisy without lazy-loading maps. */
    chunkSizeWarningLimit: 2000,
    modulePreload: {
      /** Defer heavy chunks so first paint does less main-thread work (layout reads in Framer / Mapbox). */
      resolveDependencies: (_filename, deps) => deps.filter((dep) => !/(mapbox|framer)/i.test(dep)),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mapbox-gl') || id.includes('react-map-gl')) return 'mapbox';
            if (id.includes('framer-motion')) return 'framer';
            if (id.includes('gsap')) return 'gsap';
          }
        },
      },
    },
  },
});

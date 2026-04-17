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

export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'npf-index-html-base-hints',
      transformIndexHtml(html) {
        const action = thankYouFormAction();
        return html.replaceAll('action="/thank-you"', `action="${action}"`).replaceAll(
          'href="/favicon_io/',
          `href="${base}favicon_io/`,
        );
      },
    },
  ],
  build: {
    cssMinify: 'esbuild',
    /** mapbox-gl is ~1.7MB minified; the default 500 kB warning is noisy without lazy-loading maps. */
    chunkSizeWarningLimit: 2000,
  },
});

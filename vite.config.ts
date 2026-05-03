/// <reference types="node" />
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Netlify and local dev: app is served at the site root. */
const base = '/' as const;

function thankYouFormAction(): string {
  return '/thank-you';
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
  },
});

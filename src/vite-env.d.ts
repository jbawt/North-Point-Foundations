/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Public production site origin, no path or trailing slash (e.g. `https://yoursite.com`).
   * Used for canonical URLs, Open Graph, JSON-LD, and post-build `sitemap.xml` / `robots.txt`.
   */
  readonly VITE_SITE_URL: string | undefined;
  readonly VITE_MAPBOX_ACCESS_TOKEN: string | undefined;
  /**
   * Optional Mapbox style URL. The app appends `optimize=true` for style-optimized vector tiles
   * unless already present. Skip custom URLs if you add runtime layers that need source-layers
   * stripped from the initial style (see Mapbox GL JS performance guide).
   */
  readonly VITE_MAPBOX_STYLE_URL: string | undefined;
  /**
   * Optional Netlify form POST URL (e.g. `https://your-site.netlify.app/`). Use when hosting on
   * GitHub Pages but submissions go to Netlify. If omitted, POST uses `import.meta.env.BASE_URL`.
   */
  readonly VITE_NETLIFY_FORM_ACTION: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

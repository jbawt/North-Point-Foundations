/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string | undefined;
  /** Optional Mapbox Studio style URL (overrides default light basemap) */
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

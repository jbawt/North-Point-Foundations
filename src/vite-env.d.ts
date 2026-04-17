/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string | undefined;
  /** Optional Mapbox Studio style URL (overrides default light basemap) */
  readonly VITE_MAPBOX_STYLE_URL: string | undefined;
  /**
   * Optional absolute URL for Netlify form POST when running the app locally (e.g.
   * `https://your-site.netlify.app/`). Omit on production; defaults to `/`.
   */
  readonly VITE_NETLIFY_FORM_ACTION: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string | undefined;
  /** Optional Mapbox Studio style URL (overrides default light basemap) */
  readonly VITE_MAPBOX_STYLE_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

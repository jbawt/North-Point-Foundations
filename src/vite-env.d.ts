/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string | undefined;
  /** Optional Mapbox Studio style URL (overrides default light basemap) */
  readonly VITE_MAPBOX_STYLE_URL: string | undefined;
  /** EmailJS public key (account → API keys) */
  readonly VITE_EMAILJS_PUBLIC_KEY: string | undefined;
  /** EmailJS email service id */
  readonly VITE_EMAILJS_SERVICE_ID: string | undefined;
  /** EmailJS template id for quote requests */
  readonly VITE_EMAILJS_TEMPLATE_ID: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

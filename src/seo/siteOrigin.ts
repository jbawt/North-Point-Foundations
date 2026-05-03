/**
 * Absolute site URL for canonical tags, OG URLs, and JSON-LD.
 * Set `VITE_SITE_URL` in production (e.g. `https://example.com`). Falls back to `window.location.origin` in the browser when unset (fine for local dev).
 */
export function getSiteOrigin(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/** Router basename without trailing slash (empty string when hosted at domain root). */
export function getRouterBasename(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

/**
 * Normalizes pathname for meta lookup (strip GitHub Pages-style basename).
 */
export function normalizeDocPath(pathname: string): string {
  const base = getRouterBasename();
  if (base && pathname.startsWith(`/${base}`)) {
    const rest = pathname.slice(base.length + 1);
    return rest ? `/${rest}` : '/';
  }
  if (base && pathname === `/${base}`) return '/';
  return pathname || '/';
}

/**
 * Absolute URL for a site path (leading slash). Respects Vite `base` / GitHub Pages subdirectory.
 */
export function absoluteUrlForPath(path: string): string {
  const origin = getSiteOrigin();
  let base = import.meta.env.BASE_URL || '/';
  if (!base.endsWith('/')) base = `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const pathPart = cleanPath ? `/${cleanPath}` : '/';
  const relative =
    base === '/' ? pathPart : `${base.replace(/\/$/, '')}${pathPart}`;
  if (!origin) return relative;
  return `${origin}${relative}`;
}

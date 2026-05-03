import { absoluteUrlForPath } from './siteOrigin.ts';

type Crumb = { name: string; path: string };

const HOME: Crumb = { name: 'Home', path: '/' };

const MAP: Record<string, readonly Crumb[]> = {
  '/services': [HOME, { name: 'Services', path: '/services' }],
  '/about': [HOME, { name: 'About', path: '/about' }],
  '/contact': [HOME, { name: 'Contact', path: '/contact' }],
  '/thank-you': [HOME, { name: 'Thank you', path: '/thank-you' }],
};

export function buildBreadcrumbJsonLd(normalizedPath: string): object | null {
  const trail = MAP[normalizedPath];
  if (!trail) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrlForPath(c.path),
    })),
  };
}

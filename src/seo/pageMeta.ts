import { SITE } from '../content/siteCopy.ts';

export type PageMeta = {
  title: string;
  description: string;
};

const BRAND = SITE.name;

/** Unique titles & meta descriptions per marketing route (≤ ~155–160 chars for descriptions where possible). */
const ROUTES: Record<string, PageMeta> = {
  '/': {
    title: `${BRAND} | ${SITE.shortTagline} | ${SITE.region}`,
    description: SITE.heroSub,
  },
  '/services': {
    title: `Services | ${SITE.shortTagline} | ${BRAND}`,
    description: `${SITE.name} offers exterior waterproofing, crack repair, weeping tile, sump systems, window wells, and excavation across ${SITE.region}. See specs and scope for each service.`,
  },
  '/about': {
    title: `About us | ${BRAND} | ${SITE.region}`,
    description: `${SITE.lead} ${SITE.values}`,
  },
  '/contact': {
    title: `Request a quote | Contact | ${BRAND}`,
    description: `Request a foundation repair or waterproofing quote from ${SITE.name}. Tell us about your project online or call ${SITE.quotePhoneDisplay}. Serving ${SITE.region}.`,
  },
  '/thank-you': {
    title: `Thank you | Quote request received | ${BRAND}`,
    description: `Your quote request was submitted. ${SITE.name} will follow up using your contact details.`,
  },
};

const NOT_FOUND: PageMeta = {
  title: `Page not found | ${BRAND}`,
  description: `The page you requested is not available. Return home or browse services for ${SITE.name} in ${SITE.region}.`,
};

export function getPageMeta(normalizedPath: string): PageMeta {
  if (normalizedPath in ROUTES) {
    return ROUTES[normalizedPath]!;
  }
  return NOT_FOUND;
}

export function isKnownMarketingPath(normalizedPath: string): boolean {
  return Object.prototype.hasOwnProperty.call(ROUTES, normalizedPath);
}

import { SITE } from '../content/siteCopy.ts';
import { absoluteUrlForPath, getSiteOrigin } from './siteOrigin.ts';

/** E.164 without `tel:` — schema.org expects international format. */
function telephoneE164(): string {
  const tel = SITE.quotePhoneTel.replace(/^tel:/i, '');
  return tel.startsWith('+') ? tel : `+${tel}`;
}

/**
 * HomeAndConstructionBusiness JSON-LD (service-area; street address omitted until client publishes one NAP).
 */
export function buildLocalBusinessJsonLd(): object {
  const origin = getSiteOrigin();
  const url = origin ? absoluteUrlForPath('/') : '';

  const areaServed = SITE.serviceAreas
    .filter((a) => a !== 'surrounding areas')
    .map((name) => ({
      '@type': 'City',
      name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: SITE.region,
      },
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: SITE.name,
    description: SITE.lead,
    url: url || undefined,
    telephone: telephoneE164(),
    areaServed,
    sameAs: [SITE.facebookUrl, SITE.instagramUrl],
    knowsAbout: SITE.services.map((s) => s.name),
  };
}

export function buildWebSiteJsonLd(): object {
  const origin = getSiteOrigin();
  const url = origin ? absoluteUrlForPath('/') : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: url || undefined,
    description: SITE.heroSub,
  };
}

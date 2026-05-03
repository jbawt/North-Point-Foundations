import { buildLocalBusinessJsonLd, buildWebSiteJsonLd } from '../seo/structuredData.ts';

/**
 * Global JSON-LD: `WebSite` + `HomeAndConstructionBusiness` as a single `@graph`.
 * Renders once in the main layout.
 */
export function StructuredDataOrg() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [buildWebSiteJsonLd(), buildLocalBusinessJsonLd()],
  };

  return (
    <script type="application/ld+json" data-npf-schema="org">
      {JSON.stringify(graph)}
    </script>
  );
}

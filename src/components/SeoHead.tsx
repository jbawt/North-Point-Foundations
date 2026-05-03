import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { buildBreadcrumbJsonLd } from '../seo/breadcrumbJsonLd.ts';
import { getPageMeta, isKnownMarketingPath } from '../seo/pageMeta.ts';
import { absoluteUrlForPath, getSiteOrigin, normalizeDocPath } from '../seo/siteOrigin.ts';

const DEFAULT_OG_TYPE = 'website';
const TWITTER_CARD = 'summary_large_image';

export function SeoHead() {
  const { pathname } = useLocation();
  const normalized = normalizeDocPath(pathname);
  const { title, description } = getPageMeta(normalized);
  const origin = getSiteOrigin();
  /** Canonical uses path only (no UTM/query) to consolidate signals. */
  const canonical = origin ? absoluteUrlForPath(normalized === '' ? '/' : normalized) : undefined;
  const ogUrl = canonical;
  /** Thank-you and similar utility routes: avoid indexing thin/duplicate funnels. */
  const noindexPath = normalized === '/thank-you';
  const indexable = isKnownMarketingPath(normalized) && !noindexPath;
  const breadcrumbLd = buildBreadcrumbJsonLd(normalized);

  return (
    <Helmet htmlAttributes={{ lang: 'en' }} prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {!indexable ? <meta name="robots" content="noindex, follow" /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:type" content={DEFAULT_OG_TYPE} />
      <meta property="og:site_name" content="North Point Foundations" />
      {ogUrl ? <meta property="og:url" content={ogUrl} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content={TWITTER_CARD} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {breadcrumbLd ? (
        <script type="application/ld+json" data-npf-schema="breadcrumb">
          {JSON.stringify(breadcrumbLd)}
        </script>
      ) : null}
    </Helmet>
  );
}

import { lazy, Suspense } from 'react';
import { DataTickerDivider } from '../components/DataTickerDivider.tsx';
import { HomeHero } from '../components/HomeHero.tsx';
import { ServicesAboutDivider } from '../components/ServicesAboutDivider.tsx';
import { SITE } from '../content/siteCopy.ts';

const ServicesSection = lazy(() =>
  import('../components/ServicesSection.tsx').then((m) => ({ default: m.ServicesSection })),
);
const AboutSection = lazy(() =>
  import('../components/AboutSection.tsx').then((m) => ({ default: m.AboutSection })),
);
const ServiceAreaDivider = lazy(() =>
  import('../components/ServiceAreaDivider.tsx').then((m) => ({ default: m.ServiceAreaDivider })),
);
const TestimonialsSection = lazy(() =>
  import('../components/TestimonialsSection.tsx').then((m) => ({ default: m.TestimonialsSection })),
);

function BelowFoldFallback() {
  return <div className="min-h-px w-full" aria-hidden />;
}

export function HomePage() {
  return (
    <>
      <HomeHero />
      <DataTickerDivider />
      <Suspense fallback={<BelowFoldFallback />}>
        <ServicesSection />
      </Suspense>
      <ServicesAboutDivider />
      <Suspense fallback={<BelowFoldFallback />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<BelowFoldFallback />}>
        <ServiceAreaDivider />
      </Suspense>
      {SITE.showTestimonialsOnHome ? (
        <Suspense fallback={<BelowFoldFallback />}>
          <TestimonialsSection />
        </Suspense>
      ) : null}
    </>
  );
}

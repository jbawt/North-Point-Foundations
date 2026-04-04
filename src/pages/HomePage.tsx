import { AboutSection } from '../components/AboutSection.tsx';
import { DataTickerDivider } from '../components/DataTickerDivider.tsx';
import { HomeHero } from '../components/HomeHero.tsx';
import { ServiceAreaDivider } from '../components/ServiceAreaDivider.tsx';
import { ServicesAboutDivider } from '../components/ServicesAboutDivider.tsx';
import { ServicesSection } from '../components/ServicesSection.tsx';
import { TestimonialsSection } from '../components/TestimonialsSection.tsx';
import { SITE } from '../content/siteCopy.ts';

export function HomePage() {
  return (
    <>
      <HomeHero />
      <DataTickerDivider />
      <ServicesSection />
      <ServicesAboutDivider />
      <AboutSection />
      <ServiceAreaDivider />
      {SITE.showTestimonialsOnHome ? <TestimonialsSection /> : null}
    </>
  );
}

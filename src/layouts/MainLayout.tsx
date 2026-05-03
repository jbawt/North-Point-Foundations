import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer.tsx';
import { NavBar } from '../components/NavBar.tsx';
import { ScrollToTop } from '../components/ScrollToTop.tsx';
import { SeoHead } from '../components/SeoHead.tsx';
import { StickyContactRail } from '../components/StickyContactRail.tsx';
import { StructuredDataOrg } from '../components/StructuredDataOrg.tsx';

function RouteFallback() {
  return (
    <div
      className="flex min-h-[50dvh] w-full flex-1 items-center justify-center bg-white dark:bg-zinc-950"
      aria-busy="true"
    >
      <span className="sr-only">Loading page</span>
      <div
        className="h-9 w-9 animate-pulse rounded-full bg-npf-border dark:bg-zinc-800"
        aria-hidden
      />
    </div>
  );
}

export function MainLayout() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-white text-npf-charcoal dark:bg-zinc-950 dark:text-zinc-100">
      <SeoHead />
      <StructuredDataOrg />
      <ScrollToTop />
      <NavBar />
      <main className="flex min-h-0 w-full flex-1 flex-col">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <StickyContactRail />
    </div>
  );
}

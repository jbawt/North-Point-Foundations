import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer.tsx';
import { NavBar } from '../components/NavBar.tsx';
import { ScrollToTop } from '../components/ScrollToTop.tsx';
import { StickyContactRail } from '../components/StickyContactRail.tsx';

export function MainLayout() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-white text-npf-charcoal dark:bg-zinc-950 dark:text-zinc-100">
      <ScrollToTop />
      <NavBar />
      <main className="flex min-h-0 w-full flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
      <StickyContactRail />
    </div>
  );
}

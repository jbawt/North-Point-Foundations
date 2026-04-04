import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer.tsx';
import { NavBar } from '../components/NavBar.tsx';

export function MainLayout() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-white text-npf-charcoal">
      <NavBar />
      <main className="w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

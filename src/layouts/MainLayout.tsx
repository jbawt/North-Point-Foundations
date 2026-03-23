import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

export function MainLayout() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-white text-npf-charcoal">
      <NavBar />
      <main className="w-full flex-1">
        <Outlet />
      </main>
    </div>
  );
}

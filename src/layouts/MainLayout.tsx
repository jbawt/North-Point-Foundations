import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-npf-charcoal">
      <NavBar />
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}

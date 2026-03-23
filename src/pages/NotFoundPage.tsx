import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center text-slate-200">
      <p className="text-sm uppercase tracking-wide text-cyan-300">404</p>
      <h2 className="text-4xl font-bold text-white">Page not found</h2>
      <p className="text-slate-300">The page you requested does not exist.</p>
      <Link className="rounded-md bg-cyan-500/20 px-4 py-2 text-cyan-300 hover:bg-cyan-500/30" to="/">
        Go Home
      </Link>
    </section>
  );
}

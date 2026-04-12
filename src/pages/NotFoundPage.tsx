import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 bg-white px-6 text-center text-npf-charcoal dark:bg-zinc-950 dark:text-zinc-100">
      <p className="text-sm font-semibold uppercase tracking-wide text-npf-red">404</p>
      <h2 className="text-4xl font-bold text-npf-charcoal">Page not found</h2>
      <p className="text-npf-muted">The page you requested does not exist.</p>
      <Link
        className="npf-sleek-lift-subtle rounded-md bg-npf-red px-4 py-2 font-medium text-white hover:bg-npf-red-dark hover:shadow-[0_14px_36px_-14px_rgba(188,44,38,0.55)]"
        to="/"
      >
        Go Home
      </Link>
    </section>
  );
}

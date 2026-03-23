import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 bg-white px-6 text-center text-npf-charcoal">
      <p className="text-sm font-semibold uppercase tracking-wide text-npf-red">404</p>
      <h2 className="text-4xl font-bold text-npf-charcoal">Page not found</h2>
      <p className="text-npf-muted">The page you requested does not exist.</p>
      <Link
        className="rounded-md bg-npf-red px-4 py-2 font-medium text-white hover:bg-npf-red-dark"
        to="/"
      >
        Go Home
      </Link>
    </section>
  );
}

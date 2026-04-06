import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Resets window scroll on client-side navigation (SPA route changes). */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

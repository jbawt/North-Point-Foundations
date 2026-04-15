import {
  FaBars,
  FaCircleInfo,
  FaEnvelope,
  FaHouse,
  FaScrewdriverWrench,
  FaXmark,
} from 'react-icons/fa6';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import brandLogo from '../assets/Logo_transparent_250px.png';
import { SITE } from '../content/siteCopy.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

const navItems = [
  { to: '/', label: 'Home', icon: FaHouse },
  { to: '/services', label: 'Services', icon: FaScrewdriverWrench },
  { to: '/about', label: 'About', icon: FaCircleInfo },
  { to: '/contact', label: 'Contact', icon: FaEnvelope },
] as const;

function navLinkShell(isActive: boolean) {
  const shell =
    'group relative isolate inline-flex items-center justify-center overflow-hidden rounded-lg ' +
    'transition-[color,background-color,transform,box-shadow] duration-300 ease-out ' +
    'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(188,44,38,0.22)] ' +
    'active:translate-y-0 active:scale-[0.98] active:shadow-none ' +
    'motion-reduce:transform-none motion-reduce:shadow-none motion-reduce:transition-colors ' +
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:-translate-x-full ' +
    'before:skew-x-[-12deg] before:bg-gradient-to-r before:from-transparent before:via-white/45 before:to-transparent dark:before:via-white/12 ' +
    'before:transition-transform before:duration-500 before:ease-out ' +
    'hover:before:translate-x-full motion-reduce:before:hidden ' +
    'after:pointer-events-none after:absolute after:inset-x-5 after:bottom-1.5 after:z-0 after:h-[3px] ' +
    'after:rounded-full after:bg-npf-red after:transition-transform after:duration-300 ' +
    'after:ease-[cubic-bezier(0.34,1.45,0.64,1)] after:origin-left after:scale-x-0 ' +
    'hover:after:scale-x-100 motion-reduce:after:transition-none';
  const tone = isActive
    ? 'bg-npf-red-soft text-npf-red after:scale-x-100 dark:bg-npf-red/15 dark:text-red-300'
    : 'text-npf-muted hover:bg-npf-surface hover:text-npf-charcoal dark:text-zinc-400 dark:hover:bg-zinc-800/90 dark:hover:text-zinc-100';
  return `${shell} ${tone}`;
}

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = menuPanelRef.current;
    if (!panel) return;
    if (menuOpen) {
      panel.removeAttribute('inert');
      return;
    }
    if (panel.contains(document.activeElement)) {
      menuButtonRef.current?.focus({ preventScroll: true });
    }
    panel.setAttribute('inert', '');
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 w-full border-b border-npf-border bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/90"
    >
      {menuOpen ? (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-[45] bg-npf-charcoal/35 backdrop-blur-[1px] md:hidden"
          onClick={() => setMenuOpen(false)}
          type="button"
        />
      ) : null}
      <div className="relative z-50 flex w-full items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <NavLink
            className="flex shrink-0 items-center gap-2 text-npf-charcoal no-underline transition-[opacity,transform] duration-300 ease-out hover:opacity-95 hover:scale-[1.02] motion-reduce:hover:scale-100 dark:text-zinc-100 sm:gap-3"
            to="/"
          >
            <img
              alt={SITE.name}
              className="h-14 w-auto max-w-[min(54vw,13rem)] object-contain object-left sm:h-20 sm:max-w-none md:h-24 lg:h-28"
              height={120}
              src={brandLogo}
              width={300}
            />
          </NavLink>
          <div className="hidden min-h-[2.5rem] min-[400px]:flex min-[400px]:flex-col min-[400px]:justify-center border-l border-npf-border pl-3 dark:border-zinc-700 sm:min-h-0 sm:pl-4">
            <span className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-npf-red sm:text-xs">
              {SITE.shortTagline}
            </span>
            <span className="mt-0.5 hidden text-[11px] leading-snug text-npf-muted sm:block sm:text-xs">
              {SITE.region}
            </span>
          </div>
        </div>

        <ul className="hidden items-center gap-2 md:flex md:gap-3 lg:gap-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                className={({ isActive }) =>
                  `${navLinkShell(isActive)} px-5 py-3 text-base font-semibold`
                }
                to={to}
              >
                <span className="relative z-10 inline-flex items-center gap-2.5">
                  <Icon className="text-lg transition-transform duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)] group-hover:scale-110 group-hover:-rotate-3 group-hover:text-npf-red motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0" />
                  {label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="relative md:hidden">
          <button
            ref={menuButtonRef}
            aria-controls={menuId}
            aria-expanded={menuOpen}
            className="npf-sleek-lift-subtle flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-npf-border bg-white text-npf-charcoal shadow-sm hover:border-npf-red/40 hover:bg-white hover:text-npf-red active:scale-95 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-npf-red/45 dark:hover:bg-zinc-800"
            onClick={() => setMenuOpen((o) => !o)}
            type="button"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            {menuOpen ? <FaXmark className="text-xl" /> : <FaBars className="text-xl" />}
          </button>

          <div
            ref={menuPanelRef}
            className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(calc(100vw-2rem),22rem)] min-w-[16rem] origin-top-right rounded-xl border border-npf-border bg-white shadow-xl transition-[opacity,transform] duration-200 ease-out dark:border-zinc-700 dark:bg-zinc-900 md:hidden ${
              menuOpen
                ? 'pointer-events-auto scale-100 opacity-100'
                : 'pointer-events-none scale-95 opacity-0'
            }`}
            id={menuId}
          >
            <div className="border-b border-npf-border px-4 py-3 dark:border-zinc-700">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-npf-red">{SITE.name}</p>
              <p className="mt-1 text-xs leading-snug text-npf-muted dark:text-zinc-400">
                {SITE.shortTagline} · {SITE.region}
              </p>
            </div>
            <ul className="flex max-h-[min(24rem,70dvh)] flex-col gap-1 overflow-y-auto overscroll-contain p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
              {navItems.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    className={({ isActive }) =>
                      `${navLinkShell(isActive)} w-full justify-start px-4 py-4 text-lg font-semibold sm:py-5`
                    }
                    onClick={() => setMenuOpen(false)}
                    to={to}
                  >
                    <span className="relative z-10 inline-flex items-center gap-4">
                      <Icon className="text-2xl text-current" />
                      {label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>
    </nav>
  );
}

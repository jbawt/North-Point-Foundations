import { Link, NavLink } from 'react-router-dom';
import brandLogo from '../assets/Logo_transparent_250px.png';
import { SITE, serviceAreasSentence } from '../content/siteCopy.ts';

const footerNav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-npf-border bg-npf-charcoal text-white dark:border-zinc-800 dark:bg-black"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 sm:py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:gap-12">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1 lg:max-w-md">
            <Link
              className="inline-block transition-[transform,opacity] duration-300 ease-out hover:opacity-95 hover:scale-[1.02] motion-reduce:hover:scale-100"
              to="/"
            >
              <img
                alt={SITE.name}
                className="h-14 w-auto max-w-[14rem] object-contain object-left brightness-0 invert sm:h-16 md:h-[4.5rem]"
                height={120}
                src={brandLogo}
                width={300}
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              {SITE.shortTagline} serving {SITE.region}. Honest pricing and reliable foundation & waterproofing work.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {footerNav.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    className="text-sm font-medium text-white/85 transition hover:text-white focus:outline-none focus-visible:underline"
                    to={to}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  className="inline-flex font-semibold text-white transition-[transform,color,filter] duration-300 ease-out hover:translate-x-1 hover:text-white hover:brightness-110 focus:outline-none focus-visible:underline motion-reduce:hover:translate-x-0"
                  to="/contact"
                >
                  Get a quote
                </Link>
              </li>
              <li className="text-white/65">
                <span className="font-medium text-white/80">Service area:</span>{' '}
                {serviceAreasSentence()}.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/50 sm:text-left">
          © {year} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

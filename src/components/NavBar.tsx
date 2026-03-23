import { FaCircleInfo, FaHouse, FaWaveSquare } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import brandLogo from '../assets/Logo_transparent_250px.png';

const navItems = [
  { to: '/', label: 'Home', icon: FaHouse },
  { to: '/state', label: 'State', icon: FaWaveSquare },
  { to: '/about', label: 'About', icon: FaCircleInfo },
];

export function NavBar() {
  return (
    <nav className="w-full border-b border-npf-border bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <NavLink className="flex items-center gap-3 text-npf-charcoal no-underline" to="/">
          <img
            alt="North Point Foundations"
            className="h-11 w-auto object-contain"
            height={44}
            src={brandLogo}
            width={180}
          />
        </NavLink>
        <ul className="flex shrink-0 items-center gap-1 sm:gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-npf-red-soft text-npf-red'
                      : 'text-npf-muted hover:bg-npf-surface hover:text-npf-charcoal'
                  }`
                }
              >
                <Icon className="text-base" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

import { FaCircleInfo, FaHouse, FaWaveSquare } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', icon: FaHouse },
  { to: '/state', label: 'State', icon: FaWaveSquare },
  { to: '/about', label: 'About', icon: FaCircleInfo },
];

export function NavBar() {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <h1 className="text-lg font-semibold text-white">North Point Foundations</h1>
        <ul className="flex items-center gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

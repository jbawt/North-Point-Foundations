import { FaMoon, FaSun } from 'react-icons/fa6';
import { useTheme } from '../theme/ThemeProvider.tsx';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { resolved, followsSystem, toggleTheme } = useTheme();

  const Icon = resolved === 'dark' ? FaMoon : FaSun;

  const label = followsSystem
    ? resolved === 'dark'
      ? 'Dark (matching device). Click to use light mode.'
      : 'Light (matching device). Click to use dark mode.'
    : resolved === 'dark'
      ? 'Dark mode. Click for light mode.'
      : 'Light mode. Click for dark mode.';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        'npf-sleek-lift-subtle inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-npf-border bg-white text-lg text-npf-charcoal shadow-sm ' +
        'transition-[background-color,border-color,color,box-shadow] hover:border-npf-red/35 hover:text-npf-red ' +
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-red/35 focus-visible:ring-offset-2 ' +
        'dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-npf-red/45 dark:hover:text-npf-red ' +
        'dark:focus-visible:ring-offset-zinc-950 md:h-12 md:w-12 ' +
        className
      }
      aria-label={label}
      title={label}
    >
      <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
    </button>
  );
}

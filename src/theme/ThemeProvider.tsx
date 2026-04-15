import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'npf-theme';

/** User explicitly chose light or dark. `null` means follow the OS (`prefers-color-scheme`). */
export type ThemeExplicit = 'light' | 'dark';

function readStored(): ThemeExplicit | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v;
    if (v === 'system') localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode etc. */
  }
  return null;
}

type ThemeContextValue = {
  /** Saved choice, or `null` when matching the device. */
  explicit: ThemeExplicit | null;
  /** Whether the site follows `prefers-color-scheme` (no saved override). */
  followsSystem: boolean;
  /** Effective light/dark on screen. */
  resolved: ThemeExplicit;
  setTheme: (mode: ThemeExplicit) => void;
  /** Toggle between light and dark and persist (no separate “system” mode in the control). */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [explicit, setExplicitState] = useState<ThemeExplicit | null>(null);
  const [systemDark, setSystemDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setExplicitState(readStored());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: ThemeExplicit =
    explicit === 'light' ? 'light' : explicit === 'dark' ? 'dark' : systemDark ? 'dark' : 'light';

  const followsSystem = explicit === null;

  useLayoutEffect(() => {
    if (!mounted) return;
    applyDarkClass(resolved === 'dark');
  }, [resolved, mounted]);

  const setTheme = useCallback((mode: ThemeExplicit) => {
    setExplicitState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setTheme]);

  const value = useMemo(
    () => ({ explicit, followsSystem, resolved, setTheme, toggleTheme }),
    [explicit, followsSystem, resolved, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

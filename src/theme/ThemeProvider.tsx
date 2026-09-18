import {
  createContext,
  use,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  /** The selected mode. */
  mode: ThemeMode;
  /** The applied mode, with `system` resolved from the OS preference. */
  resolvedMode: ResolvedThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export interface ThemeProviderProps {
  /**
   * Initial theme mode. `system` follows the OS preference.
   * @default 'system'
   */
  defaultMode?: ThemeMode;
  children?: ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const darkSchemeQuery = '(prefers-color-scheme: dark)';

function subscribeToSystemScheme(onChange: () => void) {
  const mediaQuery = window.matchMedia(darkSchemeQuery);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

const getSystemPrefersDark = () => window.matchMedia(darkSchemeQuery).matches;
const getServerPrefersDark = () => false;

/**
 * Applies the theme by setting `data-theme` on `<html>`, so portalled content (popups, dialogs)
 * is themed too. In `system` mode the attribute is removed and the CSS follows the OS preference.
 * Render a single ThemeProvider at the app root; use a `data-theme` attribute to theme a section.
 */
export function ThemeProvider({ defaultMode = 'system', children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const systemPrefersDark = useSyncExternalStore(
    subscribeToSystemScheme,
    getSystemPrefersDark,
    getServerPrefersDark,
  );
  const resolvedMode: ResolvedThemeMode =
    mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');

    if (mode === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', mode);
    }

    return () => {
      if (previous === null) {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', previous);
      }
    };
  }, [mode]);

  const value = useMemo(() => ({ mode, resolvedMode, setMode }), [mode, resolvedMode]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }
  return context;
}

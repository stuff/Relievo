import {
  createContext,
  use,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useControllableState } from '../utils/useControllableState';

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
   * Theme mode, when controlled. Use with `onModeChange`, for example to persist the choice.
   */
  mode?: ThemeMode;
  /**
   * Initial theme mode, when uncontrolled. `system` follows the OS preference.
   * @default 'system'
   */
  defaultMode?: ThemeMode;
  /**
   * Called when `setMode` requests a new mode, in both controlled and uncontrolled use.
   */
  onModeChange?: (mode: ThemeMode) => void;
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
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<ThemeProvider defaultMode="system">`. The provider keeps the mode;
 *   `setMode` from `useTheme()` changes it.
 * - **Controlled**: `<ThemeProvider mode={mode} onModeChange={setMode}>`. Your state is the source
 *   of truth, for example to persist the choice: `setMode` only reports the requested mode.
 */
export function ThemeProvider({
  mode: modeProp,
  defaultMode = 'system',
  onModeChange,
  children,
}: ThemeProviderProps) {
  const [mode, setMode] = useControllableState({
    value: modeProp,
    defaultValue: defaultMode,
    onChange: onModeChange,
    name: 'ThemeProvider mode',
  });
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

  const value = useMemo(() => ({ mode, resolvedMode, setMode }), [mode, resolvedMode, setMode]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }
  return context;
}

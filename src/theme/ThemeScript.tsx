export interface ThemeScriptProps {
  /**
   * The `localStorage` key holding the persisted mode, matching what `onModeChange` writes.
   * @default 'theme'
   */
  storageKey?: string;
}

/**
 * A blocking script for the document `<head>`, rendered before Relievo's CSS and before
 * hydration: it reads the persisted mode from `localStorage` and sets `data-theme` on `<html>`
 * immediately, so an explicit light or dark choice applies to the very first paint instead of
 * flashing the OS default first.
 *
 * Nothing to do for `system`, or when nothing is stored yet: the server already renders without
 * `data-theme`, which is already correct, since the CSS falls back to `prefers-color-scheme`.
 *
 * Pair it with a `ThemeProvider` controlled from the same storage key (see "Theming" in the
 * README). Render once, in `<head>`, ahead of `ThemeProvider`.
 */
export function ThemeScript({ storageKey = 'theme' }: ThemeScriptProps) {
  const script = `(function(){try{var m=localStorage.getItem(${JSON.stringify(storageKey)});if(m==="light"||m==="dark")document.documentElement.setAttribute("data-theme",m);}catch(e){}})()`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

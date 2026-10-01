import { useCallback, useRef } from 'react';

/**
 * Gives a floating layer the theme of the element that opens it. A layer is portalled to the end
 * of the page, outside any `data-theme` section (a pane forced to light or dark, a themed card):
 * it would fall back to the page's theme, and open dark under a light section. Put `anchorRef` on
 * the trigger (a button) and `positionerRef` on the layer's positioner: when the layer mounts, it takes the
 * `data-theme` of the trigger's nearest themed ancestor. Without one, the page's theme (the OS
 * preference, or `<html>`'s attribute) already applies to both.
 * @internal
 */
export function useInheritedTheme() {
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const positionerRef = useCallback((positioner: HTMLElement | null) => {
    const theme = anchorRef.current?.closest('[data-theme]')?.getAttribute('data-theme');

    if (positioner && theme) {
      positioner.setAttribute('data-theme', theme);
    }
  }, []);

  return { anchorRef, positionerRef };
}

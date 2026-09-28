import { useEffect, type RefObject } from 'react';

/** The class names the hook toggles on the scroller: markers of the module, not public API. */
export interface ScrollRailClasses {
  /** The bar is wider than its room. */
  scrollable: string;
  /** There is more to see before the visible part. */
  fadeStart: string;
  /** There is more to see after the visible part. */
  fadeEnd: string;
  /** A mouse drag is scrolling the bar. */
  dragging: string;
}

// Under this many pixels, a rounding error of the scroll position is not "more to see"
const EDGE = 1;
// A mouse that moves less than this while pressed is still a click
const DRAG_THRESHOLD = 5;
// The width of the fade at either end (1.5rem in the stylesheet): a tab brought into view is kept
// clear of it
const FADE = 24;
// What a "line" of wheel delta is worth in pixels, when the browser reports it as such
const LINE = 16;

/*
 * Makes a bar wider than its room comfortable to scroll sideways. Everything happens on the DOM
 * element itself, not in React state: a scroll fires many times a second and nothing here changes
 * what React renders.
 *
 * - A mouse wheel, which only turns vertically, scrolls the bar.
 * - A mouse can grab the bar and drag it. Touch and pen scroll it natively.
 * - The classes of `classes` tell the stylesheet when there is more to see on either side.
 * - The selected tab is brought into view when the selection changes.
 */
export function useScrollRail(
  ref: RefObject<HTMLElement | null>,
  classes: ScrollRailClasses,
): void {
  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;
    const bar = scroller;

    const overflow = () => bar.scrollWidth - bar.clientWidth;

    function update() {
      const max = overflow();
      const left = bar.scrollLeft;
      bar.classList.toggle(classes.scrollable, max > EDGE);
      bar.classList.toggle(classes.fadeStart, max > EDGE && left > EDGE);
      bar.classList.toggle(classes.fadeEnd, max > EDGE && left < max - EDGE);
    }

    // Wheel: vertical delta scrolls sideways. Left alone once the bar cannot go further that way,
    // so the page takes over at the ends instead of the wheel getting stuck on the bar.
    function onWheel(event: WheelEvent) {
      const max = overflow();
      // A pinch (ctrl) is a zoom; a sideways gesture (trackpad) already scrolls the bar natively
      if (event.ctrlKey || max <= EDGE || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const unit = event.deltaMode === 1 ? LINE : event.deltaMode === 2 ? bar.clientWidth : 1;
      const from = bar.scrollLeft;
      const to = Math.min(max, Math.max(0, from + event.deltaY * unit));
      // Scroll positions are fractional on some screens: a bar half a pixel short of the end is
      // at the end
      if (Math.abs(to - from) < EDGE) return;

      event.preventDefault();
      bar.scrollLeft = to;
    }

    // Drag: a mouse press, then a move past the threshold, grabs the bar
    let drag: { pointerId: number; startX: number; startLeft: number; grabbed: boolean } | null =
      null;
    // The click that ends a drag lands on the tab under the pointer: it must not select it
    let swallowClick = false;
    let swallowTimer: ReturnType<typeof setTimeout> | undefined;

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || event.button !== 0 || overflow() <= EDGE) return;
      swallowClick = false;
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startLeft: bar.scrollLeft,
        grabbed: false,
      };
    }

    function onPointerMove(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const distance = event.clientX - drag.startX;
      if (!drag.grabbed) {
        if (Math.abs(distance) < DRAG_THRESHOLD) return;
        drag.grabbed = true;
        bar.classList.add(classes.dragging);
        // Keeps the moves coming when the pointer leaves the bar. Only once it is a drag: a
        // capture from the press would redirect the click of a plain press away from its tab.
        bar.setPointerCapture?.(event.pointerId);
      }
      bar.scrollLeft = drag.startLeft - distance;
    }

    function onPointerEnd(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      if (drag.grabbed) {
        bar.classList.remove(classes.dragging);
        bar.releasePointerCapture?.(event.pointerId);
        // The click follows the release at once; if none does, do not keep eating clicks
        swallowClick = true;
        clearTimeout(swallowTimer);
        swallowTimer = setTimeout(() => (swallowClick = false), 0);
      }
      drag = null;
    }

    function onClickCapture(event: MouseEvent) {
      if (!swallowClick) return;
      swallowClick = false;
      event.stopPropagation();
      event.preventDefault();
    }

    // Selection: bring the tab that just became selected into view, clear of the fades
    function onSelectionChange() {
      const tab = bar.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!tab || overflow() <= EDGE || typeof bar.scrollBy !== 'function') return;

      const room = bar.getBoundingClientRect();
      const box = tab.getBoundingClientRect();
      const before = box.left - (room.left + FADE);
      const after = box.right - (room.right - FADE);
      const shift = before < 0 ? before : after > 0 ? after : 0;
      if (shift === 0) return;

      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      bar.scrollBy({ left: shift, behavior: reduced ? 'auto' : 'smooth' });
    }

    bar.addEventListener('wheel', onWheel, { passive: false });
    bar.addEventListener('scroll', update, { passive: true });
    bar.addEventListener('pointerdown', onPointerDown);
    bar.addEventListener('pointermove', onPointerMove);
    bar.addEventListener('pointerup', onPointerEnd);
    bar.addEventListener('pointercancel', onPointerEnd);
    bar.addEventListener('click', onClickCapture, { capture: true });

    const selection = new MutationObserver(onSelectionChange);
    selection.observe(bar, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });

    // The room or the tabs change size (window resize, a count that grows, the font that loads)
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    resize?.observe(bar);
    if (bar.firstElementChild) resize?.observe(bar.firstElementChild);
    update();

    return () => {
      bar.removeEventListener('wheel', onWheel);
      bar.removeEventListener('scroll', update);
      bar.removeEventListener('pointerdown', onPointerDown);
      bar.removeEventListener('pointermove', onPointerMove);
      bar.removeEventListener('pointerup', onPointerEnd);
      bar.removeEventListener('pointercancel', onPointerEnd);
      bar.removeEventListener('click', onClickCapture, { capture: true });
      selection.disconnect();
      resize?.disconnect();
      clearTimeout(swallowTimer);
    };
  }, [ref, classes]);
}

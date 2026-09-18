// jsdom does not implement matchMedia. This mock only knows about prefers-color-scheme.
const listeners = new Set<(event: MediaQueryListEvent) => void>();
let prefersDark = false;

function createMediaQueryList(query: string): MediaQueryList {
  return {
    media: query,
    get matches() {
      return query.includes('dark') && prefersDark;
    },
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as MediaQueryList;
}

window.matchMedia = createMediaQueryList;

/** Changes the OS color scheme preference and notifies subscribers. */
export function setSystemPrefersDark(value: boolean) {
  prefersDark = value;
  listeners.forEach((listener) => listener({ matches: value } as MediaQueryListEvent));
}

export function resetMatchMedia() {
  prefersDark = false;
  listeners.clear();
}

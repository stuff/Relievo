import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { resetMatchMedia } from './matchMedia';

afterEach(() => {
  cleanup();
  resetMatchMedia();
  document.documentElement.removeAttribute('data-theme');
});

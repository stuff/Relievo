import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeScript } from './ThemeScript';

const root = document.documentElement;

function runScript(container: HTMLElement) {
  const script = container.querySelector('script');
  // Runs the script produced by the component itself
  new Function(script?.textContent ?? '')();
}

afterEach(() => {
  root.removeAttribute('data-theme');
  localStorage.clear();
});

describe('ThemeScript', () => {
  it('sets data-theme when an explicit mode is stored', () => {
    localStorage.setItem('theme', 'dark');
    const { container } = render(<ThemeScript />);

    runScript(container);

    expect(root).toHaveAttribute('data-theme', 'dark');
  });

  it('does nothing for a stored system mode', () => {
    localStorage.setItem('theme', 'system');
    const { container } = render(<ThemeScript />);

    runScript(container);

    expect(root).not.toHaveAttribute('data-theme');
  });

  it('does nothing when nothing is stored', () => {
    const { container } = render(<ThemeScript />);

    runScript(container);

    expect(root).not.toHaveAttribute('data-theme');
  });

  it('ignores an invalid stored value', () => {
    localStorage.setItem('theme', 'purple');
    const { container } = render(<ThemeScript />);

    runScript(container);

    expect(root).not.toHaveAttribute('data-theme');
  });

  it('reads a custom storage key', () => {
    localStorage.setItem('custom-theme', 'light');
    const { container } = render(<ThemeScript storageKey="custom-theme" />);

    runScript(container);

    expect(root).toHaveAttribute('data-theme', 'light');
  });

  it('ignores the default key when a custom one is set', () => {
    localStorage.setItem('theme', 'dark');
    const { container } = render(<ThemeScript storageKey="custom-theme" />);

    runScript(container);

    expect(root).not.toHaveAttribute('data-theme');
  });
});

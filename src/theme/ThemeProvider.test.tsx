import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { setSystemPrefersDark } from '../test/matchMedia';
import { ThemeProvider, useTheme, type ThemeMode } from './ThemeProvider';

function ThemeProbe() {
  const { mode, resolvedMode, setMode } = useTheme();

  return (
    <>
      <output aria-label="mode">{mode}</output>
      <output aria-label="resolved">{resolvedMode}</output>
      {(['light', 'dark', 'system'] as ThemeMode[]).map((option) => (
        <button key={option} onClick={() => setMode(option)}>
          {option}
        </button>
      ))}
    </>
  );
}

const root = document.documentElement;

describe('ThemeProvider', () => {
  it('follows the OS preference in system mode, without data-theme', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('mode')).toHaveTextContent('system');
    expect(screen.getByLabelText('resolved')).toHaveTextContent('light');
    expect(root).not.toHaveAttribute('data-theme');

    act(() => setSystemPrefersDark(true));

    expect(screen.getByLabelText('resolved')).toHaveTextContent('dark');
    expect(root).not.toHaveAttribute('data-theme');
  });

  it('sets data-theme on <html> for an explicit mode', () => {
    render(
      <ThemeProvider defaultMode="dark">
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(root).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByLabelText('resolved')).toHaveTextContent('dark');
  });

  it('ignores the OS preference in an explicit mode', () => {
    setSystemPrefersDark(true);
    render(
      <ThemeProvider defaultMode="light">
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('resolved')).toHaveTextContent('light');
  });

  it('switches modes with setMode', async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'dark' }));
    expect(root).toHaveAttribute('data-theme', 'dark');

    await userEvent.click(screen.getByRole('button', { name: 'light' }));
    expect(root).toHaveAttribute('data-theme', 'light');

    await userEvent.click(screen.getByRole('button', { name: 'system' }));
    expect(root).not.toHaveAttribute('data-theme');
  });

  it('reports mode changes when uncontrolled', async () => {
    const onModeChange = vi.fn();
    render(
      <ThemeProvider onModeChange={onModeChange}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'dark' }));

    expect(onModeChange).toHaveBeenCalledWith('dark');
    expect(root).toHaveAttribute('data-theme', 'dark');
  });

  it('renders the mode prop when controlled, and only reports setMode', async () => {
    const onModeChange = vi.fn();
    render(
      <ThemeProvider mode="light" onModeChange={onModeChange}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'dark' }));

    expect(onModeChange).toHaveBeenCalledWith('dark');
    expect(screen.getByLabelText('mode')).toHaveTextContent('light');
    expect(root).toHaveAttribute('data-theme', 'light');
  });

  it('follows the mode prop when the parent updates it', async () => {
    function ControlledTheme() {
      const [mode, setMode] = useState<ThemeMode>('light');
      return (
        <ThemeProvider mode={mode} onModeChange={setMode}>
          <ThemeProbe />
        </ThemeProvider>
      );
    }
    render(<ControlledTheme />);

    await userEvent.click(screen.getByRole('button', { name: 'dark' }));

    expect(screen.getByLabelText('mode')).toHaveTextContent('dark');
    expect(root).toHaveAttribute('data-theme', 'dark');
  });

  it('restores the previous data-theme on unmount', () => {
    root.setAttribute('data-theme', 'light');
    const { unmount } = render(<ThemeProvider defaultMode="dark" />);
    expect(root).toHaveAttribute('data-theme', 'dark');

    unmount();

    expect(root).toHaveAttribute('data-theme', 'light');
  });
});

describe('useTheme', () => {
  it('throws outside a ThemeProvider', () => {
    // React logs the render error; keep the test output clean.
    const consoleError = console.error;
    console.error = () => {};
    try {
      expect(() => render(<ThemeProbe />)).toThrow('useTheme must be used within a ThemeProvider.');
    } finally {
      console.error = consoleError;
    }
  });
});

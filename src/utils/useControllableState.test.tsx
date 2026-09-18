import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useControllableState } from './useControllableState';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useControllableState', () => {
  it('manages its own state when uncontrolled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: undefined, defaultValue: 'a', onChange, name: 'Test' }),
    );

    act(() => result.current[1]('b'));

    expect(result.current[0]).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('renders the value prop and only reports changes when controlled', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 'a', onChange, name: 'Test' }),
      { initialProps: { value: 'x' } },
    );

    act(() => result.current[1]('y'));
    expect(result.current[0]).toBe('x');
    expect(onChange).toHaveBeenCalledWith('y');

    rerender({ value: 'y' });
    expect(result.current[0]).toBe('y');
  });

  it('does not report a change to the current value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: undefined, defaultValue: 'a', onChange, name: 'Test' }),
    );

    act(() => result.current[1]('a'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps a stable setter', () => {
    const { result, rerender } = renderHook(() =>
      useControllableState({ value: undefined, defaultValue: 'a', name: 'Test' }),
    );
    const setter = result.current[1];

    act(() => result.current[1]('b'));
    rerender();

    expect(result.current[1]).toBe(setter);
  });

  it('warns when switching from uncontrolled to controlled', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = renderHook(
      ({ value }: { value?: string }) =>
        useControllableState({ value, defaultValue: 'a', name: 'Test' }),
      { initialProps: {} },
    );

    rerender({ value: 'b' });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('from uncontrolled to controlled'));
  });
});

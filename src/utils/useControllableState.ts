import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UseControllableStateOptions<T> {
  /** Controlled value. When defined, the component renders it and never updates it itself. */
  value: T | undefined;
  /** Initial value when uncontrolled. */
  defaultValue: T;
  /** Called with every requested change, in both modes. */
  onChange?: (value: T) => void;
  /** Component and prop names, for the dev warning when switching modes. */
  name: string;
}

/**
 * State that works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 * The mode is fixed at mount, like native inputs: switching logs a warning in development.
 * @internal
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
  name,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  // Read once, at mount: the mode does not change afterwards
  const [isControlled] = useState(value !== undefined);
  const currentValue = isControlled ? (value as T) : internalValue;

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && isControlled !== (value !== undefined)) {
      console.warn(
        `${name} is changing from ${isControlled ? 'controlled' : 'uncontrolled'} to ` +
          `${isControlled ? 'uncontrolled' : 'controlled'}. Decide between the controlled prop ` +
          'and its default prop for the lifetime of the component.',
      );
    }
  }, [isControlled, value, name]);

  // Kept in a ref so setValue stays stable and consumers' memoized values do not change.
  const latest = useRef({ currentValue, onChange });
  useLayoutEffect(() => {
    latest.current = { currentValue, onChange };
  });

  const setValue = useCallback(
    (next: T) => {
      if (Object.is(next, latest.current.currentValue)) {
        return;
      }
      if (!isControlled) {
        setInternalValue(next);
      }
      latest.current.onChange?.(next);
    },
    [isControlled],
  );

  return [currentValue, setValue];
}

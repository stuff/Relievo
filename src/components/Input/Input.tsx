import type { ComponentProps, ReactNode } from 'react';
import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import styles from './Input.module.scss';

// Styling is owned by the design system: className, style and render are not part of the
// public API. The input has a single size, so the native `size` attribute (width in characters)
// is dropped too, and an <input> has no children. `error` replaces `aria-invalid`.
type OmittedProps = 'className' | 'style' | 'render' | 'size' | 'children' | 'aria-invalid';

export interface InputProps extends Omit<ComponentProps<typeof BaseInput>, OmittedProps> {
  /**
   * Visible label, linked to the input. Required: every input needs an accessible name.
   */
  label: ReactNode;
  /**
   * The value, when controlled. The input always shows it: update it from `onValueChange`.
   * Leave undefined for an uncontrolled input.
   */
  value?: string;
  /**
   * The initial value, when uncontrolled. The input then manages its value itself.
   */
  defaultValue?: string;
  /**
   * Called on every edit with the new value, in both controlled and uncontrolled use.
   */
  onValueChange?: (value: string, eventDetails: BaseInput.ChangeEventDetails) => void;
  /**
   * Hides the label visually. It stays in the page for screen readers and translation tools.
   * Only for inputs whose purpose is obvious from context, such as a search field next to
   * a Search button. A visible label is better in forms.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Text below the input: a hint on the expected format, or the error message when `error` is
   * set. Linked to the input with `aria-describedby`, so screen readers announce it.
   */
  helperText?: ReactNode;
  /**
   * Whether the value is invalid. Paints the input, label and `helperText` red and sets
   * `aria-invalid`. Explain the error in `helperText`: color alone is not enough.
   * @default false
   */
  error?: boolean;
  /**
   * Native input type. Use `email`, `tel`, `url` or `number` to get the matching mobile keyboard
   * and browser validation.
   * @default 'text'
   */
  type?: ComponentProps<'input'>['type'];
  /**
   * Whether the input ignores user interaction.
   * @default false
   */
  disabled?: boolean;
}

/**
 * A single-line text field with its label and an optional helper text. Set `error` to show the
 * error state. Other props (`name`, `placeholder`, `ref`, …) go to the `<input>`.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<Input label="Name" defaultValue="Jane" />`. The input keeps its own value.
 *   Read it on submit (`FormData`, `name`) or follow edits with `onValueChange`.
 * - **Controlled**: `<Input label="Name" value={name} onValueChange={setName} />`. Your state is
 *   the source of truth: the input shows `value` and only reports edits.
 */
export function Input({
  label,
  hideLabel = false,
  helperText,
  error = false,
  type = 'text',
  disabled = false,
  ...props
}: InputProps) {
  return (
    // Field.Root spreads the invalid state to the label, input and description
    // (data-invalid, and aria-invalid on the input).
    <Field.Root disabled={disabled} invalid={error} className={styles.field}>
      <Field.Label className={styles.label} data-hidden={hideLabel ? '' : undefined}>
        {label}
      </Field.Label>
      <BaseInput
        {...props}
        type={type}
        disabled={disabled}
        className={styles.input}
        style={undefined}
      />
      {helperText != null && (
        <Field.Description className={styles.helperText}>{helperText}</Field.Description>
      )}
    </Field.Root>
  );
}

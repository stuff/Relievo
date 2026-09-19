import type { ComponentProps, ReactNode } from 'react';
import { Field } from '@base-ui/react/field';
import styles from './Textarea.module.scss';

// Styling is owned by the design system: className and style are not part of the public API. A
// <textarea> takes its value from `value` / `defaultValue`, not children. `error` replaces
// `aria-invalid`.
type OmittedProps =
  | 'className'
  | 'style'
  | 'children'
  | 'aria-invalid'
  | 'value'
  | 'defaultValue'
  | 'onChange';

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, OmittedProps> {
  /**
   * Visible label, linked to the textarea. Required: every field needs an accessible name.
   */
  label: ReactNode;
  /**
   * The value, when controlled. The textarea always shows it: update it from `onValueChange`.
   * Leave undefined for an uncontrolled textarea.
   */
  value?: string;
  /**
   * The initial value, when uncontrolled. The textarea then manages its value itself.
   */
  defaultValue?: string;
  /**
   * Called on every edit with the new value, in both controlled and uncontrolled use.
   */
  onValueChange?: (value: string, eventDetails: Field.Control.ChangeEventDetails) => void;
  /**
   * Hides the label visually. It stays in the page for screen readers and translation tools.
   * Only when the purpose is obvious from context: a visible label is better in forms.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Text below the textarea: a hint on what to write, or the error message when `error` is set.
   * Linked with `aria-describedby`, so screen readers announce it.
   */
  helperText?: ReactNode;
  /**
   * Whether the value is invalid. Paints the textarea, label and `helperText` red and sets
   * `aria-invalid`. Explain the error in `helperText`: color alone is not enough.
   * @default false
   */
  error?: boolean;
  /**
   * Visible lines of text: the initial height. The user can still drag it taller.
   * @default 4
   */
  rows?: number;
  /**
   * Whether the textarea ignores user interaction.
   * @default false
   */
  disabled?: boolean;
}

/**
 * A multi-line text field with its label and an optional helper text: the same carved field as
 * `Input`, with rounder corners than a pill can hold. The user can drag it taller. Set `error` to
 * show the error state. Other props (`name`, `placeholder`, `maxLength`, …) go to the `<textarea>`.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<Textarea label="Notes" defaultValue="…" />`. The textarea keeps its own
 *   value. Read it on submit (`FormData`, `name`) or follow edits with `onValueChange`.
 * - **Controlled**: `<Textarea label="Notes" value={notes} onValueChange={setNotes} />`. Your state
 *   is the source of truth: the textarea shows `value` and only reports edits.
 */
export function Textarea({
  label,
  hideLabel = false,
  helperText,
  error = false,
  rows = 4,
  disabled = false,
  value,
  defaultValue,
  onValueChange,
  ...props
}: TextareaProps) {
  return (
    // Field.Root spreads the invalid state to the label, textarea and description
    // (data-invalid, and aria-invalid on the textarea).
    <Field.Root disabled={disabled} invalid={error} className={styles.field}>
      <Field.Label className={styles.label} data-hidden={hideLabel ? '' : undefined}>
        {label}
      </Field.Label>
      <Field.Control
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        render={<textarea {...props} rows={rows} className={styles.textarea} style={undefined} />}
      />
      {helperText != null && (
        <Field.Description className={styles.helperText}>{helperText}</Field.Description>
      )}
    </Field.Root>
  );
}

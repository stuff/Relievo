import type { ComponentProps, MouseEvent, ReactElement, ReactNode } from 'react';
import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Input.module.scss';

// Styling is owned by the design system: className, style and render are not part of the
// public API. The input has a single size, so the native `size` attribute (width in characters)
// is dropped too, and an <input> has no children. `error` replaces `aria-invalid`, and our
// `prefix` replaces the rarely used HTML attribute (an RDFa vocabulary prefix).
type OmittedProps =
  | 'className'
  | 'style'
  | 'render'
  | 'size'
  | 'children'
  | 'aria-invalid'
  | 'prefix';

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
   * Icon at the start of the field, such as `<MagnifyingGlassIcon />` from `@phosphor-icons/react`.
   * The input sets its size and color; the icon is decorative (hidden from screen readers).
   */
  startIcon?: ReactElement;
  /**
   * Icon at the end of the field. Sized and colored like `startIcon`. Decorative only: not
   * a button.
   */
  endIcon?: ReactElement;
  /**
   * Text before the value, such as a currency (`$`) or a protocol (`https://`). Announced to
   * screen readers as part of the input description.
   */
  prefix?: string;
  /**
   * Text after the value, such as a unit (`€`, `kg`) or a domain (`.com`). Announced to
   * screen readers as part of the input description.
   */
  suffix?: string;
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
 * Icons and text can sit on both sides of the value, in this order:
 * `startIcon`, `prefix`, value, `suffix`, `endIcon`.
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
  startIcon,
  endIcon,
  prefix,
  suffix,
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
      {/* The pill: icons and affixes sit inside it, around the borderless <input>. */}
      <div className={styles.control} onMouseDown={focusInput}>
        <IconSlot icon={startIcon} className={styles.icon} />
        {prefix != null && <Affix>{prefix}</Affix>}
        <BaseInput
          {...props}
          type={type}
          disabled={disabled}
          className={styles.input}
          style={undefined}
        />
        {suffix != null && <Affix>{suffix}</Affix>}
        <IconSlot icon={endIcon} className={styles.icon} />
      </div>
      {helperText != null && (
        <Field.Description className={styles.helperText}>{helperText}</Field.Description>
      )}
    </Field.Root>
  );
}

// A Field description: Base UI adds it to the input's aria-describedby, next to helperText.
function Affix({ children }: { children: string }) {
  return (
    <Field.Description render={<span />} className={styles.affix}>
      {children}
    </Field.Description>
  );
}

// Clicking an icon, an affix or the padding focuses the input, as if the pill were the input.
function focusInput(event: MouseEvent<HTMLDivElement>) {
  const input = event.currentTarget.querySelector('input');
  if (!input || event.target === input || input.disabled) {
    return;
  }
  event.preventDefault();
  input.focus();
}

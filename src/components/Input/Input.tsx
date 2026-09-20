import { createContext, use, type ComponentProps, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { IconSlot } from '../../internal/IconSlot';
import { Button, type ButtonProps } from '../Button';
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
   * a button (use `endAction` for that).
   */
  endIcon?: ReactElement;
  /**
   * A button at the end of the field, acting on its value: an `Input.Action`, such as a clear or
   * a show-password button. Last in the field, after `endIcon`. Disabled with the field.
   */
  endAction?: ReactElement<InputActionProps>;
  /**
   * A `Button` beside the field, acting on its value, such as "Read the page" or "Apply". The
   * input lines it up with its own line, whatever the height of the label and helper text, which
   * span them both. Give it the default `md` size, the field's height; it keeps its own
   * `disabled` state, so disable it yourself when the value is not ready.
   */
  endButton?: ReactElement<ButtonProps>;
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

export interface InputActionProps {
  /**
   * What the button does, such as "Clear the search". Required: the button only shows an icon,
   * so this is its accessible name.
   */
  label: string;
  /**
   * The icon, such as `<XIcon />` from `@phosphor-icons/react`. Sized and colored by the button.
   */
  icon: ReactElement;
  /**
   * Called when the button is pressed. Focus stays in the field.
   */
  onClick?: () => void;
  /**
   * Whether the button ignores user interaction. It is also disabled with its field.
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
  endAction,
  endButton,
  prefix,
  suffix,
  helperText,
  error = false,
  type = 'text',
  disabled = false,
  ...props
}: InputProps) {
  // The end button is aligned with the pill and sized like it: another element would not line up
  if (process.env.NODE_ENV !== 'production' && endButton && endButton.type !== Button) {
    console.warn("Input's endButton must be a Relievo Button.");
  }

  // The pill: icons and affixes sit inside it, around the borderless <input>.
  const pill = (
    <div
      className={`${styles.control}${endAction ? ` ${styles.withAction}` : ''}`}
      onMouseDown={focusInput}
    >
      <IconSlot icon={startIcon} className={styles.icon} />
      {prefix != null && <Affix>{prefix}</Affix>}
      <BaseInput {...props} type={type} disabled={disabled} className={styles.input} style={undefined} />
      {suffix != null && <Affix>{suffix}</Affix>}
      <IconSlot icon={endIcon} className={styles.icon} />
      <InputDisabledContext value={disabled}>{endAction}</InputDisabledContext>
    </div>
  );

  return (
    // Field.Root spreads the invalid state to the label, input and description
    // (data-invalid, and aria-invalid on the input).
    <Field.Root disabled={disabled} invalid={error} className={styles.field}>
      <Field.Label className={styles.label} data-hidden={hideLabel ? '' : undefined}>
        {label}
      </Field.Label>
      {/* A button beside the field: the label and helper text span the row, and the pill, not the
          whole field, is what the button lines up with. */}
      {endButton ? (
        <div className={styles.row}>
          {pill}
          {endButton}
        </div>
      ) : (
        pill
      )}
      {helperText != null && (
        <Field.Description className={styles.helperText}>{helperText}</Field.Description>
      )}
    </Field.Root>
  );
}

// Whether the enclosing Input is disabled: its action is disabled with it
const InputDisabledContext = createContext(false);

/**
 * A round, icon-only button at the end of an `Input`, acting on its value: clear it, show a
 * password, copy it. Pass it as the input's `endAction`. Raised, since it can be pressed.
 */
function InputAction({ label, icon, onClick, disabled = false }: InputActionProps) {
  const fieldDisabled = use(InputDisabledContext);
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled || fieldDisabled}
      onClick={onClick}
      className={styles.action}
    >
      <IconSlot icon={icon} className={styles.actionIcon} />
    </button>
  );
}

Input.Action = InputAction;

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

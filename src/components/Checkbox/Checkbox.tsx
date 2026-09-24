import { useId, type ReactNode } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Field } from '@base-ui/react/field';
import { CheckIcon, MinusIcon } from '@phosphor-icons/react';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Checkbox.module.scss';

export interface CheckboxProps {
  /**
   * Visible label, next to the box. Clicking it toggles the checkbox. Required: every checkbox
   * needs an accessible name.
   */
  label: ReactNode;
  /**
   * Hides the label visually. It stays in the page for screen readers. Only for checkboxes whose
   * purpose is obvious from context, such as selecting a row in a table.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Text below the label: what ticking the box implies, or the error message when `error` is
   * set. Linked to the checkbox with `aria-describedby`, so screen readers announce it.
   */
  helperText?: ReactNode;
  /**
   * Whether the choice is invalid, such as terms that must be accepted. Paints the box, label and
   * `helperText` red and sets `aria-invalid`. Explain the error in `helperText`: color alone is
   * not enough.
   * @default false
   */
  error?: boolean;
  /**
   * Whether the checkbox is ticked, when controlled. Update it from `onCheckedChange`.
   */
  checked?: boolean;
  /**
   * Whether the checkbox is initially ticked, when uncontrolled.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Called with the new state when the checkbox is ticked or unticked, in both controlled and
   * uncontrolled use.
   */
  onCheckedChange?: (checked: boolean, eventDetails: BaseCheckbox.Root.ChangeEventDetails) => void;
  /**
   * Shows a mixed state (a dash), neither ticked nor unticked, such as a "select all" checkbox
   * when only some items are selected. Screen readers announce it as mixed. Clicking it calls
   * `onCheckedChange`: clear `indeterminate` there.
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Whether the checkbox ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the user must tick the checkbox before submitting the form.
   * @default false
   */
  required?: boolean;
  /**
   * Name of the hidden input, to submit the checkbox with a form.
   */
  name?: string;
  /**
   * Value submitted with the form when the checkbox is ticked.
   * @default 'on'
   */
  value?: string;
}

/**
 * A single yes / no choice, such as accepting terms or turning an option on, with an optional
 * helper text. The box is a raised cube, like a secondary button; ticked, it turns to the brand
 * color and shows a check. Set `error` to show the error state.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<Checkbox label="Remember me" defaultChecked />`.
 * - **Controlled**: `<Checkbox label="Remember me" checked={remember} onCheckedChange={setRemember} />`.
 */
export function Checkbox({
  label,
  hideLabel = false,
  helperText,
  error = false,
  indeterminate = false,
  ...props
}: CheckboxProps) {
  const labelId = useId();

  return (
    // Field.Root links the helper text to the checkbox (aria-describedby) and spreads the invalid
    // state (aria-invalid on the checkbox, data-invalid on the helper text).
    <Field.Root disabled={props.disabled} invalid={error} className={styles.field}>
      <label className={styles.checkbox} data-disabled={props.disabled ? '' : undefined}>
        <BaseCheckbox.Root
          {...props}
          indeterminate={indeterminate}
          aria-labelledby={labelId}
          className={styles.box}
          style={undefined}
        >
          <BaseCheckbox.Indicator className={styles.indicator}>
            <IconSlot
              icon={indeterminate ? <MinusIcon /> : <CheckIcon />}
              className={styles.icon}
            />
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        <span
          id={labelId}
          className={styles.label}
          data-hidden={hideLabel ? '' : undefined}
          data-invalid={error ? '' : undefined}
        >
          {label}
        </span>
      </label>
      {helperText != null && (
        <Field.Description className={styles.helperText}>{helperText}</Field.Description>
      )}
    </Field.Root>
  );
}

import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Field } from '@base-ui/react/field';
import { Select as BaseSelect } from '@base-ui/react/select';
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Select.module.scss';

interface SelectBaseProps {
  /**
   * Visible label, linked to the select. Required: every select needs an accessible name.
   */
  label: ReactNode;
  /**
   * Hides the label visually. It stays in the page for screen readers. Only for selects whose
   * purpose is obvious from context. A visible label is better in forms.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Shown in the field while no option is chosen, such as "Choose a country".
   */
  placeholder?: ReactNode;
  /**
   * The value of the chosen option, when controlled (`null` for none). Update it from
   * `onValueChange`.
   */
  value?: string | null;
  /**
   * The value of the initially chosen option, when uncontrolled. Leave it out to start with no
   * choice, showing the `placeholder`.
   */
  defaultValue?: string | null;
  /**
   * Called with the value of the chosen option when it changes, in both controlled and
   * uncontrolled use.
   */
  onValueChange?: (value: string | null, eventDetails: BaseSelect.Root.ChangeEventDetails) => void;
  /**
   * Whether the list is open, when controlled. Update it from `onOpenChange`.
   */
  open?: boolean;
  /**
   * Whether the list is initially open, when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Called when the list opens or closes, in both controlled and uncontrolled use.
   */
  onOpenChange?: (open: boolean, eventDetails: BaseSelect.Root.ChangeEventDetails) => void;
  /**
   * Text below the field: a hint, or the error message when `error` is set. Linked to the select
   * with `aria-describedby`, so screen readers announce it.
   */
  helperText?: ReactNode;
  /**
   * Whether the choice is invalid. Paints the field, label and `helperText` red and sets
   * `aria-invalid`. Explain the error in `helperText`: color alone is not enough.
   * @default false
   */
  error?: boolean;
  /**
   * Icon at the start of the field, such as `<GlobeIcon />` from `@phosphor-icons/react`.
   * Decorative (hidden from screen readers).
   */
  startIcon?: ReactElement;
  /**
   * Whether the select ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether an option must be chosen before submitting the form.
   * @default false
   */
  required?: boolean;
  /**
   * Name of the hidden input, to submit the chosen value with a form.
   */
  name?: string;
}

export interface SelectGroupProps {
  /**
   * Title of the group, shown above its options and read by screen readers as the group's name.
   */
  label?: ReactNode;
  /**
   * `Select.Item` elements.
   */
  children?: ReactNode;
}

export interface SelectOption {
  /**
   * Identifies the option: the select's value is the value of the chosen option.
   */
  value: string;
  /**
   * The label of the option, also shown in the field once chosen.
   */
  label: ReactNode;
  /**
   * Whether this option cannot be chosen.
   * @default false
   */
  disabled?: boolean;
}

interface SelectWithItemsProps extends SelectBaseProps {
  /**
   * The options, as `Select.Item` elements, optionally in `Select.Group`s. Or pass them as an
   * array with `options` (without groups).
   */
  children?: ReactNode;
  options?: never;
}

interface SelectWithOptionsProps extends SelectBaseProps {
  /**
   * The options, as an array, such as data from an API: `[{ value: 'fr', label: 'France' }]`.
   * For a simple list: to group options, pass `Select.Group` and `Select.Item` children instead.
   */
  options: readonly SelectOption[];
  children?: never;
}

// Options as children or as an array, not both
export type SelectProps = SelectWithItemsProps | SelectWithOptionsProps;

export interface SelectItemProps {
  /**
   * Identifies the option: the select's value is the value of the chosen option.
   */
  value: string;
  /**
   * Whether this option cannot be chosen.
   * @default false
   */
  disabled?: boolean;
  /**
   * The label of the option, also shown in the field once chosen.
   */
  children?: ReactNode;
}

// Base UI shows the chosen option's label from an items map, even before the list has rendered:
// build it from the Select.Item children, so the compound API needs no duplication.
function collectItems(children: ReactNode, items: Record<string, ReactNode> = {}) {
  Children.forEach(children, (child) => {
    if (!isValidElement<{ value?: string; children?: ReactNode }>(child)) {
      return;
    }
    if (child.type === Fragment || child.type === SelectGroup) {
      collectItems(child.props.children, items);
    } else if (child.type === SelectItem && child.props.value !== undefined) {
      items[child.props.value] = child.props.children;
    }
  });
  return items;
}

/**
 * A single choice among a long list, such as a country or a category: a field that opens a list
 * of options. The field is carved like an Input (a value goes here); the list floats above the
 * page. Keyboard: arrows move, Enter chooses, typing jumps to an option.
 *
 * Options go as `Select.Item` children, grouped under a title with `Select.Group` if needed, or as
 * an array with `options` for a simple list.
 *
 * For 2 to 5 short options, use `Segmented`; for several choices, `Chip.Group`.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<Select label="Country" defaultValue="fr">…</Select>`.
 * - **Controlled**: `<Select label="Country" value={country} onValueChange={setCountry}>…</Select>`.
 */
export function Select({
  label,
  hideLabel = false,
  placeholder,
  helperText,
  error = false,
  startIcon,
  disabled = false,
  children,
  options,
  ...rootProps
}: SelectProps) {
  const items = options
    ? options.map((option) => (
        <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </SelectItem>
      ))
    : children;

  return (
    // Field.Root spreads the invalid and disabled states to the label, trigger and description
    <Field.Root disabled={disabled} invalid={error} className={styles.field}>
      <Field.Label className={styles.label} data-hidden={hideLabel ? '' : undefined}>
        {label}
      </Field.Label>
      <BaseSelect.Root<string> {...rootProps} disabled={disabled} items={collectItems(items)}>
        <BaseSelect.Trigger className={styles.trigger} style={undefined}>
          <IconSlot icon={startIcon} className={styles.icon} />
          <BaseSelect.Value className={styles.value} placeholder={placeholder} />
          <BaseSelect.Icon className={styles.caret}>
            <IconSlot icon={<CaretDownIcon />} className={styles.icon} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            className={styles.positioner}
            alignItemWithTrigger={false}
            sideOffset={4}
          >
            <BaseSelect.Popup className={styles.popup}>
              <BaseSelect.List className={styles.list}>{items}</BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {helperText != null && (
        <Field.Description className={styles.helperText}>{helperText}</Field.Description>
      )}
    </Field.Root>
  );
}

function SelectItem({ value, disabled, children }: SelectItemProps) {
  return (
    <BaseSelect.Item value={value} disabled={disabled} className={styles.item} style={undefined}>
      <BaseSelect.ItemText className={styles.itemText}>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className={styles.itemIndicator}>
        <IconSlot icon={<CheckIcon />} className={styles.icon} />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

function SelectGroup({ label, children }: SelectGroupProps) {
  return (
    <BaseSelect.Group className={styles.group}>
      {label != null && (
        <BaseSelect.GroupLabel className={styles.groupLabel}>{label}</BaseSelect.GroupLabel>
      )}
      {children}
    </BaseSelect.Group>
  );
}

Select.Item = SelectItem;
Select.Group = SelectGroup;

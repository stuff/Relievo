import type { ReactElement, ReactNode } from 'react';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Segmented.module.scss';

export type SegmentedSize = 'sm' | 'md' | 'lg';

export interface SegmentedProps {
  /**
   * Accessible name of the control, read by screen readers (not displayed), such as "Period".
   */
  label: string;
  /**
   * The value of the chosen item, when controlled. Update it from `onValueChange`.
   */
  value?: string;
  /**
   * The value of the initially chosen item, when uncontrolled. Leave it out to start with no
   * choice: once an item is chosen, it cannot be unselected.
   */
  defaultValue?: string;
  /**
   * Called with the value of the chosen item when it changes, in both controlled and
   * uncontrolled use.
   */
  onValueChange?: (value: string, eventDetails: RadioGroup.ChangeEventDetails) => void;
  /**
   * Name of the hidden input, to submit the chosen value with a form.
   */
  name?: string;
  /**
   * Height and font size, on the control scale: lines up with a Button or an Input of the same size.
   * @default 'md'
   */
  size?: SegmentedSize;
  /**
   * Whether every item ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * `Segmented.Item` elements: 2 to 5 short options work best, as the control does not wrap.
   */
  children?: ReactNode;
}

export interface SegmentedItemProps {
  /**
   * Identifies the item: the control's value is the value of the chosen item.
   */
  value: string;
  /**
   * Whether this item ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Icon before the label, such as `<CalendarIcon />` from `@phosphor-icons/react`. Decorative.
   */
  startIcon?: ReactElement;
  /**
   * Icon after the label. Decorative.
   */
  endIcon?: ReactElement;
  children?: ReactNode;
}

/**
 * A single choice among a few short options, such as a period or a view. A carved track (it holds
 * one value, like an input) where the chosen item stands out; the highlight slides from one item
 * to the next. Arrow keys move and select; screen readers announce radio buttons.
 *
 * For several choices, use `Chip.Group` (filters). For a long list, use a select.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<Segmented label="Period" defaultValue="week">`.
 * - **Controlled**: `<Segmented label="Period" value={period} onValueChange={setPeriod}>`.
 */
export function Segmented({
  label,
  onValueChange,
  size = 'md',
  ...props
}: SegmentedProps) {
  return (
    <RadioGroup<string>
      {...props}
      onValueChange={onValueChange}
      aria-label={label}
      data-size={size}
      className={styles.track}
      style={undefined}
    />
  );
}

function SegmentedItem({ value, disabled, startIcon, endIcon, children }: SegmentedItemProps) {
  return (
    <Radio.Root value={value} disabled={disabled} className={styles.item} style={undefined}>
      <IconSlot icon={startIcon} className={styles.icon} />
      {/* A flex item, so text-box can trim the label */}
      {children != null && <span className={styles.label}>{children}</span>}
      <IconSlot icon={endIcon} className={styles.icon} />
    </Radio.Root>
  );
}

Segmented.Item = SegmentedItem;

// The parts as named exports too: the package entry (src/index.tsx) rebuilds `Segmented.*` from them,
// so that the dot notation also works in Server Components.
export { SegmentedItem };

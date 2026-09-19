import { createContext, use, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Chip.module.scss';

export type ChipTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
export type ChipVariant = 'solid' | 'outline';
export type ChipSize = 'xs' | 'sm' | 'md' | 'lg';

// Styling is owned by the design system: className, style and render are not part of the
// public API.
type LockedProps = 'className' | 'style' | 'render' | 'nativeButton';

export interface ChipProps extends Omit<ComponentProps<typeof Toggle>, LockedProps> {
  /**
   * Meaning of the chip. `neutral` for plain tags, `primary` to highlight without a status,
   * `info`, `success`, `warning` and `danger` for statuses. A selected `neutral` chip turns to
   * the brand color (`primary`); other tones keep their color when selected.
   * @default 'neutral'
   */
  tone?: ChipTone;
  /**
   * Rendering: `solid` fills the chip with the tone, `outline` draws only its border and text.
   * @default 'solid'
   */
  variant?: ChipVariant;
  /**
   * Height, padding and font size.
   * @default 'md'
   */
  size?: ChipSize;
  /**
   * Icon before the label, such as `<StarIcon />` from `@phosphor-icons/react`. The chip sets its
   * size and color; the icon is decorative. On selectable chips, the icon can tell what each
   * chip turns on.
   */
  startIcon?: ReactElement;
  /**
   * Icon after the label. Sized and colored like `startIcon`.
   */
  endIcon?: ReactElement;
  /**
   * Whether the chip ignores user interaction. A static chip is only dimmed.
   * @default false
   */
  disabled?: boolean;
  /**
   * Makes the chip selectable, when controlled: whether it is selected. Use with
   * `onPressedChange`. Inside a `Chip.Group`, the group owns the selection instead.
   */
  pressed?: boolean;
  /**
   * Makes the chip selectable, when uncontrolled: whether it starts selected.
   */
  defaultPressed?: boolean;
  /**
   * Makes the chip selectable. Called when the chip is selected or deselected, in both controlled
   * and uncontrolled use.
   */
  onPressedChange?: (pressed: boolean, eventDetails: Toggle.ChangeEventDetails) => void;
  /**
   * Identifies the chip in a `Chip.Group`: the group's value lists the values of the selected
   * chips. Required inside a group.
   */
  value?: string;
  children?: ReactNode;
}

// Wraps the text so text-box can trim it: the property does not reach text placed directly in a
// flex container.
function Label({ children }: { children?: ReactNode }) {
  return children == null ? null : <span className={styles.label}>{children}</span>;
}

// Set by Chip.Group: its chips are always selectable.
const ChipGroupContext = createContext(false);

/**
 * A compact label: a tag, a status or a filter.
 *
 * A chip is static by default. It becomes selectable (a toggle button with `aria-pressed`) when it
 * is inside a `Chip.Group`, or when it receives `pressed`, `defaultPressed` or `onPressedChange`.
 *
 * Works uncontrolled or controlled when selectable:
 * - **Uncontrolled**: `<Chip defaultPressed>Vegan</Chip>`. The chip keeps its own state.
 * - **Controlled**: `<Chip pressed={vegan} onPressedChange={setVegan}>Vegan</Chip>`.
 */
export function Chip({
  tone = 'neutral',
  variant = 'solid',
  size = 'md',
  startIcon,
  endIcon,
  disabled = false,
  children,
  ...props
}: ChipProps) {
  const inGroup = use(ChipGroupContext);
  const selectable =
    inGroup ||
    props.pressed !== undefined ||
    props.defaultPressed !== undefined ||
    props.onPressedChange !== undefined;

  const sharedProps = {
    'data-tone': tone,
    'data-variant': variant,
    'data-size': size,
    className: styles.chip,
    style: undefined,
  };

  if (!selectable) {
    const { pressed: _pressed, defaultPressed: _defaultPressed, value: _value, ...spanProps } = props;
    return (
      <span
        {...(spanProps as ComponentProps<'span'>)}
        data-disabled={disabled ? '' : undefined}
        {...sharedProps}
      >
        <IconSlot icon={startIcon} className={styles.icon} />
        <Label>{children}</Label>
        <IconSlot icon={endIcon} className={styles.icon} />
      </span>
    );
  }

  return (
    <Toggle {...props} disabled={disabled} data-selectable="" {...sharedProps}>
      <IconSlot icon={startIcon} className={styles.icon} />
      <Label>{children}</Label>
      <IconSlot icon={endIcon} className={styles.icon} />
    </Toggle>
  );
}

type LockedGroupProps = 'className' | 'style' | 'render' | 'orientation';

export interface ChipGroupProps extends Omit<ComponentProps<typeof ToggleGroup>, LockedGroupProps> {
  /**
   * Accessible name of the group, read by screen readers (not displayed), such as "Diet".
   */
  label: string;
  /**
   * Whether several chips can be selected at once (filters). When `false`, selecting a chip
   * deselects the others (a single choice).
   * @default false
   */
  multiple?: boolean;
  /**
   * The values of the selected chips, when controlled. Update it from `onValueChange`.
   */
  value?: readonly string[];
  /**
   * The values of the initially selected chips, when uncontrolled.
   */
  defaultValue?: readonly string[];
  /**
   * Called with the values of the selected chips whenever the selection changes, in both
   * controlled and uncontrolled use.
   */
  onValueChange?: (value: string[], eventDetails: ToggleGroup.ChangeEventDetails) => void;
  /**
   * Whether every chip in the group ignores user interaction.
   * @default false
   */
  disabled?: boolean;
}

/**
 * A set of selectable chips, navigable with the arrow keys. Each chip needs a `value`.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<Chip.Group label="Diet" defaultValue={['vegan']}>`. The group keeps the
 *   selection.
 * - **Controlled**: `<Chip.Group label="Diet" value={diet} onValueChange={setDiet}>`.
 */
function ChipGroup({ label, multiple = false, ...props }: ChipGroupProps) {
  return (
    <ChipGroupContext value>
      <ToggleGroup
        {...props}
        multiple={multiple}
        aria-label={label}
        className={styles.group}
        style={undefined}
      />
    </ChipGroupContext>
  );
}

Chip.Group = ChipGroup;

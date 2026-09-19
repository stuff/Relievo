import { createContext, use, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
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

// Set by Chip.Group: its chips are always selectable, as toggle buttons (multiple choice) or radio
// buttons (single choice).
const ChipGroupContext = createContext<'toggle' | 'radio' | null>(null);

/**
 * A compact label: a tag, a status or a filter.
 *
 * A chip is static by default. It becomes selectable when it is inside a `Chip.Group` (a radio
 * button in a single-choice group, a toggle button otherwise), or when it receives `pressed`,
 * `defaultPressed` or `onPressedChange` (a toggle button with `aria-pressed`).
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
  const groupMode = use(ChipGroupContext);
  const selectable =
    groupMode !== null ||
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

  const content = (
    <>
      <IconSlot icon={startIcon} className={styles.icon} />
      <Label>{children}</Label>
      <IconSlot icon={endIcon} className={styles.icon} />
    </>
  );

  if (groupMode === 'radio') {
    const {
      pressed: _pressed,
      defaultPressed: _defaultPressed,
      onPressedChange: _onPressedChange,
      value,
      ...radioProps
    } = props;
    return (
      <Radio.Root
        {...(radioProps as Omit<ComponentProps<typeof Radio.Root>, 'value'>)}
        value={value}
        disabled={disabled}
        data-selectable=""
        {...sharedProps}
      >
        {content}
      </Radio.Root>
    );
  }

  return (
    <Toggle {...props} disabled={disabled} data-selectable="" {...sharedProps}>
      {content}
    </Toggle>
  );
}

interface ChipGroupBaseProps {
  /**
   * Accessible name of the group, read by screen readers (not displayed), such as "Diet".
   */
  label: string;
  /**
   * Whether every chip in the group ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  children?: ReactNode;
}

export interface ChipGroupSingleProps extends ChipGroupBaseProps {
  /**
   * Whether several chips can be selected at once. Without it, the group is a single choice: a
   * carved track where exactly one chip is chosen (radio buttons for assistive technologies).
   * With it, the group is a set of independent raised chips (filters, toggle buttons).
   * @default false
   */
  multiple?: false;
  /**
   * The value of the chosen chip, when controlled. Update it from `onValueChange`.
   */
  value?: string;
  /**
   * The value of the initially chosen chip, when uncontrolled.
   */
  defaultValue?: string;
  /**
   * Called with the value of the chosen chip when it changes, in both controlled and
   * uncontrolled use.
   */
  onValueChange?: (value: string, eventDetails: RadioGroup.ChangeEventDetails) => void;
  /**
   * Name of the hidden input, to submit the chosen value with a form.
   */
  name?: string;
}

export interface ChipGroupMultipleProps extends ChipGroupBaseProps {
  multiple: true;
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
}

export type ChipGroupProps = ChipGroupSingleProps | ChipGroupMultipleProps;

/**
 * A set of selectable chips. Each chip needs a `value`.
 *
 * - **Single choice** (default): a carved track, like an input, holding one value. The chosen chip
 *   comes out of the track. Arrow keys move and select; screen readers announce radio buttons.
 *   Best for 2 to 5 short options (a period, a sort order); it does not wrap.
 * - **Multiple choice** (`multiple`): separate raised chips, each an independent toggle, that wrap.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<Chip.Group label="Sort by" defaultValue="recent">`, or
 *   `<Chip.Group label="Diet" multiple defaultValue={['vegan']}>`. The group keeps the selection.
 * - **Controlled**: `<Chip.Group label="Sort by" value={sort} onValueChange={setSort}>`.
 */
function ChipGroup(props: ChipGroupProps) {
  if (props.multiple) {
    const { label, multiple, ...groupProps } = props;
    return (
      <ChipGroupContext value="toggle">
        <ToggleGroup
          {...groupProps}
          multiple={multiple}
          aria-label={label}
          className={styles.group}
          style={undefined}
        />
      </ChipGroupContext>
    );
  }

  const { label, multiple: _multiple, onValueChange, ...groupProps } = props;
  return (
    <ChipGroupContext value="radio">
      <RadioGroup<string>
        {...groupProps}
        onValueChange={onValueChange}
        aria-label={label}
        className={styles.track}
        style={undefined}
      />
    </ChipGroupContext>
  );
}

Chip.Group = ChipGroup;

import type { ReactElement, ReactNode } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { CaretDownIcon, CaretRightIcon, CheckIcon } from '@phosphor-icons/react';
import { IconSlot } from '../../internal/IconSlot';
import { useLinkComponent } from '../../provider/RelievoProvider';
import { Button, type ButtonSize } from '../Button';
import styles from './Menu.module.scss';

export type MenuItemTone = 'neutral' | 'danger';

export interface MenuProps {
  /**
   * Label of the button that opens the menu, such as "Actions".
   */
  label: ReactNode;
  /**
   * Icon before the label of the button, such as `<DotsThreeIcon />`. Decorative.
   */
  startIcon?: ReactElement;
  /**
   * Height of the button, on the control scale shared with `Button`: match the buttons next to it.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Whether the menu is open, when controlled. Update it from `onOpenChange`.
   */
  open?: boolean;
  /**
   * Whether the menu is initially open, when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Called when the menu opens or closes, in both controlled and uncontrolled use.
   */
  onOpenChange?: (open: boolean, eventDetails: BaseMenu.Root.ChangeEventDetails) => void;
  /**
   * Whether the button ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * The content of the menu: `Menu.Item`, `Menu.Group`, `Menu.Separator`, `Menu.Submenu`,
   * `Menu.CheckboxItem`, `Menu.RadioGroup`.
   */
  children?: ReactNode;
}

interface MenuItemContentProps {
  /**
   * Icon before the label, such as `<PencilSimpleIcon />`. Decorative.
   */
  startIcon?: ReactElement;
  /**
   * Icon after the label. Decorative.
   */
  endIcon?: ReactElement;
  /**
   * The label of the item.
   */
  children?: ReactNode;
}

export interface MenuItemProps extends MenuItemContentProps {
  /**
   * Called when the item is chosen, by pointer or keyboard. The menu then closes.
   */
  onSelect?: () => void;
  /**
   * Turns the item into a link, using the router link configured in `RelievoProvider`.
   */
  href?: string;
  /**
   * The meaning of the item, as a color: `danger` for a destructive action, such as Delete.
   * Pair it with a label that says so: color alone does not carry meaning.
   * @default 'neutral'
   */
  tone?: MenuItemTone;
  /**
   * Whether the item cannot be chosen. It is skipped by the arrow keys.
   * @default false
   */
  disabled?: boolean;
}

export interface MenuGroupProps {
  /**
   * Title of the group, shown above its items and read by screen readers as the group's name.
   */
  label?: ReactNode;
  children?: ReactNode;
}

export interface MenuSubmenuProps {
  /**
   * Label of the item that opens the submenu.
   */
  label: ReactNode;
  /**
   * Icon before the label. Decorative.
   */
  startIcon?: ReactElement;
  /**
   * Whether the submenu cannot be opened.
   * @default false
   */
  disabled?: boolean;
  /**
   * The content of the submenu: the same parts as a menu.
   */
  children?: ReactNode;
}

export interface MenuCheckboxItemProps {
  /**
   * Whether the item is ticked, when controlled. Update it from `onCheckedChange`.
   */
  checked?: boolean;
  /**
   * Whether the item is initially ticked, when uncontrolled.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Called with the new state when the item is ticked or unticked, in both controlled and
   * uncontrolled use. The menu stays open.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Whether the item cannot be toggled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The label of the item.
   */
  children?: ReactNode;
}

export interface MenuRadioGroupProps {
  /**
   * The value of the chosen item, when controlled. Update it from `onValueChange`.
   */
  value?: string;
  /**
   * The value of the initially chosen item, when uncontrolled.
   */
  defaultValue?: string;
  /**
   * Called with the value of the chosen item, in both controlled and uncontrolled use. The menu
   * stays open.
   */
  onValueChange?: (value: string) => void;
  /**
   * Title of the group, shown above its items and read by screen readers as the group's name.
   */
  label?: ReactNode;
  /**
   * `Menu.RadioItem` elements.
   */
  children?: ReactNode;
}

export interface MenuRadioItemProps {
  /**
   * Identifies the item within its `Menu.RadioGroup`.
   */
  value: string;
  /**
   * Whether the item cannot be chosen.
   * @default false
   */
  disabled?: boolean;
  /**
   * The label of the item.
   */
  children?: ReactNode;
}

function ItemContent({ startIcon, endIcon, children }: MenuItemContentProps) {
  return (
    <>
      <IconSlot icon={startIcon} className={`${styles.icon} ${styles.startIcon}`} />
      <span className={styles.label}>{children}</span>
      <IconSlot icon={endIcon} className={styles.icon} />
    </>
  );
}

// The floating list, shared by the menu and its submenus
function Popup({ submenu = false, children }: { submenu?: boolean; children?: ReactNode }) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        className={styles.positioner}
        sideOffset={submenu ? 0 : 4}
        alignOffset={submenu ? -5 : 0}
        align="start"
      >
        <BaseMenu.Popup className={styles.popup}>{children}</BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

/**
 * A secondary button that opens a list of actions: items with an optional icon, groups under a
 * title, separators, submenus, and items that can be ticked. The list floats above the page.
 * Keyboard: arrows move, Enter chooses, the right arrow opens a submenu, Escape closes.
 *
 * ```tsx
 * <Menu label="Actions">
 *   <Menu.Item startIcon={<PencilSimpleIcon />} onSelect={edit}>Edit</Menu.Item>
 *   <Menu.Separator />
 *   <Menu.Item tone="danger" startIcon={<TrashIcon />} onSelect={remove}>Delete</Menu.Item>
 * </Menu>
 * ```
 *
 * Works uncontrolled (it opens and closes on its own) or controlled with `open` and
 * `onOpenChange`.
 */
export function Menu({
  label,
  startIcon,
  size = 'md',
  disabled = false,
  children,
  ...rootProps
}: MenuProps) {
  return (
    <BaseMenu.Root {...rootProps}>
      <BaseMenu.Trigger
        disabled={disabled}
        render={
          <Button
            variant="secondary"
            size={size}
            startIcon={startIcon}
            endIcon={<CaretDownIcon />}
            disabled={disabled}
          />
        }
      >
        {label}
      </BaseMenu.Trigger>
      <Popup>{children}</Popup>
    </BaseMenu.Root>
  );
}

function MenuItem({
  onSelect,
  href,
  tone = 'neutral',
  disabled = false,
  startIcon,
  endIcon,
  children,
}: MenuItemProps) {
  const Link = useLinkComponent();
  // Called without the click event, as its type says: a server action passed as onSelect would
  // otherwise receive the event and fail to serialize it
  const select = onSelect && (() => onSelect());
  const content = (
    <ItemContent startIcon={startIcon} endIcon={endIcon}>
      {children}
    </ItemContent>
  );

  // A link, through the app's router link. A disabled link is a plain item: nothing to follow.
  if (href !== undefined && !disabled) {
    return (
      <BaseMenu.LinkItem
        // oxlint-disable-next-line react/static-components -- the app's link, stable across renders
        render={<Link href={href} />}
        onClick={select}
        data-tone={tone}
        className={styles.item}
        style={undefined}
      >
        {content}
      </BaseMenu.LinkItem>
    );
  }

  return (
    <BaseMenu.Item
      onClick={select}
      disabled={disabled}
      data-tone={tone}
      className={styles.item}
      style={undefined}
    >
      {content}
    </BaseMenu.Item>
  );
}

function MenuGroup({ label, children }: MenuGroupProps) {
  return (
    <BaseMenu.Group className={styles.group}>
      {label != null && (
        <BaseMenu.GroupLabel className={styles.groupLabel}>{label}</BaseMenu.GroupLabel>
      )}
      {children}
    </BaseMenu.Group>
  );
}

function MenuSeparator() {
  // A styled rule between items: <hr> would bring its own margins and border to undo
  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role, jsx-a11y/control-has-associated-label
  return <div role="separator" className={styles.separator} />;
}

function MenuSubmenu({ label, startIcon, disabled = false, children }: MenuSubmenuProps) {
  return (
    <BaseMenu.SubmenuRoot>
      <BaseMenu.SubmenuTrigger disabled={disabled} className={styles.item} style={undefined}>
        <ItemContent startIcon={startIcon} endIcon={<CaretRightIcon />}>
          {label}
        </ItemContent>
      </BaseMenu.SubmenuTrigger>
      <Popup submenu>{children}</Popup>
    </BaseMenu.SubmenuRoot>
  );
}

function MenuCheckboxItem({ onCheckedChange, children, ...props }: MenuCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem
      {...props}
      onCheckedChange={onCheckedChange && ((checked) => onCheckedChange(checked))}
      className={styles.item}
      style={undefined}
    >
      <span className={styles.label}>{children}</span>
      <BaseMenu.CheckboxItemIndicator className={styles.indicator}>
        <IconSlot icon={<CheckIcon />} className={styles.icon} />
      </BaseMenu.CheckboxItemIndicator>
    </BaseMenu.CheckboxItem>
  );
}

function MenuRadioGroup({ label, onValueChange, children, ...props }: MenuRadioGroupProps) {
  return (
    <BaseMenu.RadioGroup
      {...props}
      onValueChange={onValueChange && ((value: string) => onValueChange(value))}
      className={styles.group}
    >
      {label != null && (
        <BaseMenu.GroupLabel className={styles.groupLabel}>{label}</BaseMenu.GroupLabel>
      )}
      {children}
    </BaseMenu.RadioGroup>
  );
}

function MenuRadioItem({ value, disabled, children }: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem value={value} disabled={disabled} className={styles.item} style={undefined}>
      <span className={styles.label}>{children}</span>
      <BaseMenu.RadioItemIndicator className={styles.indicator}>
        <span className={styles.dot} />
      </BaseMenu.RadioItemIndicator>
    </BaseMenu.RadioItem>
  );
}

Menu.Item = MenuItem;
Menu.Group = MenuGroup;
Menu.Separator = MenuSeparator;
Menu.Submenu = MenuSubmenu;
Menu.CheckboxItem = MenuCheckboxItem;
Menu.RadioGroup = MenuRadioGroup;
Menu.RadioItem = MenuRadioItem;

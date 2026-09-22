import type { ReactNode } from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { CaretRightIcon } from '@phosphor-icons/react';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Collapsible.module.scss';

export interface CollapsibleProps {
  /**
   * Label of the trigger that shows or hides the content.
   */
  label: ReactNode;
  /**
   * Whether the content is shown, when controlled. Update it from `onOpenChange`.
   */
  open?: boolean;
  /**
   * Whether the content is initially shown, when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Called when the content is shown or hidden, in both controlled and uncontrolled use.
   */
  onOpenChange?: (open: boolean, eventDetails: BaseCollapsible.Root.ChangeEventDetails) => void;
  /**
   * Whether the trigger ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * The content shown or hidden.
   */
  children?: ReactNode;
}

/**
 * A section whose content shows or hides when its trigger is clicked, with a caret that turns to
 * point at the revealed content.
 *
 * ```tsx
 * <Collapsible label="Details">
 *   <p>Shown once the trigger is clicked.</p>
 * </Collapsible>
 * ```
 *
 * Works uncontrolled (it opens and closes on its own) or controlled with `open` and
 * `onOpenChange`.
 */
export function Collapsible({
  label,
  open,
  defaultOpen,
  onOpenChange,
  disabled = false,
  children,
}: CollapsibleProps) {
  return (
    <BaseCollapsible.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      className={styles.root}
    >
      <BaseCollapsible.Trigger className={styles.trigger} style={undefined}>
        <IconSlot icon={<CaretRightIcon />} className={styles.icon} />
        <span className={styles.label}>{label}</span>
      </BaseCollapsible.Trigger>
      <BaseCollapsible.Panel className={styles.content} style={undefined}>
        <div className={styles.inner}>{children}</div>
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
}

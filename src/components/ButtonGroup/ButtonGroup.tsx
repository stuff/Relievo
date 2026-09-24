import type { ReactNode } from 'react';
import styles from './ButtonGroup.module.scss';

export interface ButtonGroupProps {
  /**
   * Accessible name of the group, read by screen readers (not displayed), such as "Text formatting".
   * Leave it out when the buttons speak for themselves, such as a form's Cancel / Save.
   */
  label?: string;
  /**
   * Whether the buttons move to a new line when the group runs out of room. Leave it off for a
   * short group that must stay on one line (the buttons overflow instead); turn it on for a longer
   * group in a container whose width varies.
   * @default false
   */
  wrap?: boolean;
  /**
   * `Button` elements, separated by a fixed gap.
   */
  children?: ReactNode;
}

/**
 * Related buttons side by side, such as a form's Cancel / Save. The group sets the gap between
 * them and keeps them on a single line, unless `wrap` lets them move to the next one. Screen
 * readers announce a group, named by `label` when given.
 */
export function ButtonGroup({ label, wrap = false, children }: ButtonGroupProps) {
  return (
    // A fieldset would add a legend and default borders for what is only a row of buttons
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
    <div role="group" aria-label={label} data-wrap={wrap || undefined} className={styles.group}>
      {children}
    </div>
  );
}

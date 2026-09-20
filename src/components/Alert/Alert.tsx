import { type ReactElement, type ReactNode } from 'react';
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Alert.module.scss';

export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  /**
   * The meaning of the message, as a color: it fills the alert with a light tint of the tone and
   * colors its border, icon and title. `neutral` has no status: a plain remark. Each tone comes
   * with its own icon, so the color is never alone in carrying the meaning.
   * @default 'neutral'
   */
  tone?: AlertTone;
  /**
   * A short line above the message, in the tone's color: what happened. Leave it out when the
   * message is one sentence and says it already.
   */
  title?: ReactNode;
  /**
   * The message: text, and anything it needs inside, such as a link, a `Checkbox` or a `Button`.
   */
  children?: ReactNode;
  /**
   * The icon before the message. Defaults to the tone's icon (a warning triangle for `warning`…);
   * pass another element to replace it, such as `<ClockIcon />`, or `false` to remove it.
   */
  icon?: ReactElement | false;
  /**
   * Called when the close button is pressed. Without it, the alert has no close button: pass it
   * only when the message can be dismissed, and remove the alert from the page yourself.
   */
  onClose?: () => void;
  /**
   * The accessible name of the close button, next to `onClose`.
   * @default 'Close'
   */
  closeLabel?: string;
  /**
   * Whether the alert shows up after the page has loaded, in answer to an action (a failed
   * submission, a saved change): screen readers then announce it. `warning` and `danger` are
   * announced right away (`role="alert"`), the other tones once the user is idle
   * (`role="status"`). Leave it off for a message that is part of the page from the start.
   * @default false
   */
  live?: boolean;
}

const toneIcons: Record<AlertTone, ReactElement> = {
  neutral: <InfoIcon />,
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
  danger: <WarningCircleIcon />,
};

/**
 * A message in the flow of the page: a failed action, a warning, a result. Flat, since it is
 * information (see the relief rule in AGENTS.md), filled with a light tint of its `tone` and
 * introduced by the tone's icon.
 *
 * ```tsx
 * <Alert tone="danger" title="The scan failed">
 *   Timeout on welcometothejungle.com. <Button variant="link">Try again</Button>
 * </Alert>
 * ```
 *
 * For a message about a single field, use the `error` and `helperText` props of `Input` or
 * `Textarea` instead: it belongs to the field, not to the page.
 */
export function Alert({
  tone = 'neutral',
  title,
  children,
  icon,
  onClose,
  closeLabel = 'Close',
  live = false,
}: AlertProps) {
  // The tone's icon by default; false removes it
  const leadingIcon = icon === false ? undefined : (icon ?? toneIcons[tone]);
  // A message that shows up after an action is announced: at once when it is a problem, once the
  // user is idle otherwise
  const role = live ? (tone === 'warning' || tone === 'danger' ? 'alert' : 'status') : undefined;
  // The close button calls onClose with no argument: it is often a server action or a setState,
  // which would choke on the click event

  return (
    <div role={role} data-tone={tone} className={styles.alert}>
      <IconSlot icon={leadingIcon} className={styles.icon} />
      <div className={styles.content}>
        {title !== undefined && title !== null && title !== false && (
          <p className={styles.title}>{title}</p>
        )}
        {children}
      </div>
      {onClose && (
        <button type="button" aria-label={closeLabel} onClick={() => onClose()} className={styles.close}>
          <IconSlot icon={<XIcon />} className={styles.closeIcon} />
        </button>
      )}
    </div>
  );
}

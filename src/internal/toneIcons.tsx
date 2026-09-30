import type { ReactElement } from 'react';
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon } from '@phosphor-icons/react';

/** The tones that mean something, and so have an icon. */
export type StatusTone = 'info' | 'success' | 'warning' | 'danger';

/**
 * One icon per status tone, the same in every component: the icon is what carries the meaning
 * where the color cannot, for a reader in greyscale or with a color vision deficiency. Measured
 * on the kit's own chips, 9 of the 15 tone pairs are below the just-noticeable difference once
 * the hue is removed, so the color really is alone otherwise.
 *
 * `neutral` and `accent` are absent on purpose: `neutral` means no meaning, and an icon would
 * invent one; `accent` is the brand highlight, not a status, so there is nothing for it to state.
 *
 * `danger` is a cross and not an exclamation mark, because `warning` is already an exclamation
 * mark: in a circle, the two would differ only by the shape around them, which is the weakest
 * distinction exactly where it is needed most, at the smallest sizes and without color.
 *
 * @internal
 */
export const toneIcons: Record<StatusTone, ReactElement> = {
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
  danger: <XCircleIcon />,
};

/**
 * The icon of a tone, or nothing for a tone that carries no meaning. Components call it with
 * their own tone union, which is a subset of the six.
 * @internal
 */
export function toneIcon(tone: string): ReactElement | undefined {
  return toneIcons[tone as StatusTone];
}

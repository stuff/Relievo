import type { ReactElement } from 'react';
import { IconContext, type IconWeight } from '@phosphor-icons/react';

/** Weight of every Phosphor icon rendered by the kit. */
const iconWeight: IconWeight = 'bold';
const iconContext = { weight: iconWeight };

/**
 * Wraps a decorative icon. The caller's CSS sizes and colors it (`icon-slot` mixin); the context
 * sets the Phosphor weight, unless the icon passes its own `weight` prop.
 * @internal
 */
export function IconSlot({ icon, className }: { icon?: ReactElement; className: string }) {
  if (!icon) {
    return null;
  }

  return (
    <span className={className} aria-hidden>
      <IconContext value={iconContext}>{icon}</IconContext>
    </span>
  );
}

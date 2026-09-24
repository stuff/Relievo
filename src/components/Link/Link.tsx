import type { ComponentProps, ReactNode } from 'react';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import { useLinkComponent } from '../../provider/RelievoProvider';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Link.module.scss';

export type LinkTone = 'primary' | 'neutral';

type LockedProps = 'className' | 'style';

export interface LinkProps extends Omit<ComponentProps<'a'>, LockedProps | 'href' | 'target' | 'rel'> {
  /**
   * Where the link goes. It is rendered with the link component configured in `RelievoProvider`
   * (a native `<a>` by default), so navigation stays inside your router.
   */
  href: string;
  /**
   * The text of the link. It takes the size, weight and family of the text around it, so the same
   * link works in a sentence, in a small meta line or inside a `Card.Title`.
   */
  children?: ReactNode;
  /**
   * The color of the link: `primary` is the brand color, `neutral` the text color, for a link in
   * a place that is already busy. Both are underlined, since color alone may not mark a link.
   * @default 'primary'
   */
  tone?: LinkTone;
  /**
   * Whether the link leaves the site. It opens in a new tab, with the `rel` that keeps the new
   * page from reaching back, and an arrow after the text says so before the click.
   * @default false
   */
  external?: boolean;
}

/**
 * A link in the flow of the text. It inherits the type around it, so it fits a sentence, a meta
 * line or a card title alike, and it always carries an underline.
 *
 * ```tsx
 * <p>12 offers for “rust”. <Link href="/offers">Back to the list</Link></p>
 * <Card.Title><Link href="/offers/42">Fullstack engineer</Link></Card.Title>
 * <Link href="https://example.com" external>The job ad</Link>
 * ```
 *
 * For a link that acts as a control — a row of actions, an icon and a label — use
 * `Button variant="link"`, which has a control's height and spacing.
 */
export function Link({ href, children, tone = 'primary', external = false, ...rest }: LinkProps) {
  const LinkComponent = useLinkComponent();

  return (
    // oxlint-disable-next-line react/static-components -- the app's link, stable across renders
    <LinkComponent
      {...rest}
      href={href}
      // noopener keeps the new page from reaching this one through window.opener; noreferrer
      // stops the address from being sent along
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      data-tone={tone}
      className={styles.link}
      style={undefined}
    >
      {children}
      {external && <IconSlot icon={<ArrowUpRightIcon />} className={styles.icon} />}
    </LinkComponent>
  );
}

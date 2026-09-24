import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { IconSlot } from '../../internal/IconSlot';
import { useLinkComponent } from '../../provider/RelievoProvider';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Styling is owned by the design system: className and style are not part of the public API.
type LockedProps = 'className' | 'style';

interface ButtonOwnProps {
  /**
   * Visual style. `primary` for the main action, `secondary` for supporting actions,
   * `link` for low-emphasis actions in text or dense layouts.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Height, horizontal padding and font size.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Icon before the label, such as `<PlusIcon />` from `@phosphor-icons/react`. The button sets its
   * size and color; the icon is decorative (hidden from screen readers).
   */
  startIcon?: ReactElement;
  /**
   * Icon after the label, such as `<ArrowRightIcon />`. Sized and colored like `startIcon`.
   */
  endIcon?: ReactElement;
  /**
   * Whether the button ignores user interaction. A disabled link has no `href`
   * and is out of the tab order.
   * @default false
   */
  disabled?: boolean;
}

export interface ButtonAsButtonProps
  extends ButtonOwnProps,
    Omit<ComponentProps<typeof BaseButton>, LockedProps | 'render' | 'nativeButton'> {
  /**
   * Native button type. Use `submit` to submit the enclosing form.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  href?: never;
}

// `type` is dropped: on a link it is a rarely used MIME type hint, and it would clash with
// the button `type` in the docs.
export interface ButtonAsLinkProps
  extends ButtonOwnProps,
    Omit<ComponentProps<'a'>, LockedProps | 'type'> {
  /**
   * Renders the button as a link, using the link component configured in `RelievoProvider`
   * (a native `<a>` by default).
   */
  href: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function Content({
  startIcon,
  endIcon,
  children,
}: {
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  children?: ReactNode;
}) {
  return (
    <>
      <IconSlot icon={startIcon} className={styles.icon} />
      {/* A flex item, so text-box can trim the label */}
      {children != null && <span className={styles.label}>{children}</span>}
      <IconSlot icon={endIcon} className={styles.icon} />
    </>
  );
}

export function Button(props: ButtonProps) {
  const Link = useLinkComponent();

  if (props.href !== undefined) {
    const {
      variant = 'primary',
      size = 'md',
      href,
      disabled = false,
      startIcon,
      endIcon,
      children,
      ...linkProps
    } = props;
    const content = (
      <Content startIcon={startIcon} endIcon={endIcon}>
        {children}
      </Content>
    );
    const sharedProps = {
      'data-variant': variant,
      'data-size': size,
      className: styles.button,
      style: undefined,
    };

    // Disabled links drop href, which removes them from navigation and the tab order.
    // Router links require an href, so a disabled link is always a native <a>.
    if (disabled) {
      return (
        // Without href an <a> has no link role: it is stated here
        // oxlint-disable-next-line jsx-a11y/no-redundant-roles
        <a {...linkProps} role="link" aria-disabled data-disabled="" {...sharedProps}>
          {content}
        </a>
      );
    }

    // A link is not a button: render the app's link (a native <a> by default)
    // rather than Base UI's role="button".
    return (
      // oxlint-disable-next-line react/static-components -- the app's link, stable across renders
      <Link {...linkProps} href={href} {...sharedProps}>
        {content}
      </Link>
    );
  }

  const { variant = 'primary', size = 'md', startIcon, endIcon, children, ...buttonProps } = props;

  return (
    <BaseButton
      {...buttonProps}
      data-variant={variant}
      data-size={size}
      className={styles.button}
      style={undefined}
    >
      <Content startIcon={startIcon} endIcon={endIcon}>
        {children}
      </Content>
    </BaseButton>
  );
}

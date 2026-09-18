import type { ComponentProps } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { useLinkComponent } from '../../provider/UiKitProvider';
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
   * Renders the button as a link, using the link component configured in `UiKitProvider`
   * (a native `<a>` by default).
   */
  href: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button(props: ButtonProps) {
  const Link = useLinkComponent();

  if (props.href !== undefined) {
    const { variant = 'primary', size = 'md', href, disabled = false, ...linkProps } = props;
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
        <a
          {...linkProps}
          role="link"
          aria-disabled
          data-disabled=""
          {...sharedProps}
        />
      );
    }

    // A link is not a button: render the app's link (a native <a> by default)
    // rather than Base UI's role="button".
    return <Link {...linkProps} href={href} {...sharedProps} />;
  }

  const { variant = 'primary', size = 'md', ...buttonProps } = props;

  return (
    <BaseButton
      {...buttonProps}
      data-variant={variant}
      data-size={size}
      className={styles.button}
      style={undefined}
    />
  );
}

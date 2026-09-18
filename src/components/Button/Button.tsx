import type { ComponentProps } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { useLinkComponent } from '../../provider/UiKitProvider';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Styling is owned by the design system: className and style are not part of the public API.
type LockedProps = 'className' | 'style';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export interface ButtonAsButtonProps
  extends ButtonOwnProps,
    Omit<ComponentProps<typeof BaseButton>, LockedProps | 'render' | 'nativeButton'> {
  href?: never;
}

export interface ButtonAsLinkProps extends ButtonOwnProps, Omit<ComponentProps<'a'>, LockedProps> {
  /** Renders the button as a link. */
  href: string;
  disabled?: boolean;
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

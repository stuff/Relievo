import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { IconSlot } from '../../internal/IconSlot';
import { toneIcon } from '../../internal/toneIcons';
import { useLinkComponent } from '../../provider/RelievoProvider';
import styles from './Button.module.scss';

export type ButtonVariant = 'solid' | 'link';
export type ButtonTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Styling is owned by the design system: className and style are not part of the public API.
type LockedProps = 'className' | 'style';

interface ButtonOwnProps {
  /**
   * How the button is drawn. `solid` is a raised button; `link` is text only, for low-emphasis
   * actions in text or dense layouts.
   * @default 'solid'
   */
  variant?: ButtonVariant;
  /**
   * What the action means. `neutral` for most actions, `accent` for the main action of a screen
   * (filled with the brand color, one per view), `danger` for a destructive action, `info`,
   * `success` and `warning` for an action tied to that status. A status tone draws a colored
   * border and label on the neutral fill, and its icon before the label (see `startIcon`), so the
   * color is never alone in carrying it.
   * @default 'neutral'
   */
  tone?: ButtonTone;
  /**
   * Height, horizontal padding and font size.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Icon before the label, such as `<PlusIcon />` from `@phosphor-icons/react`. The button sets its
   * size and color; the icon is decorative (hidden from screen readers).
   *
   * Defaults to the status tone's icon for `info`, `success`, `warning` and `danger`; `neutral`
   * and `accent` have none. Pass an element to replace it with a more specific one, such as
   * `<TrashIcon />` for Delete, or `false` to remove it.
   */
  startIcon?: ReactElement | false;
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
  extends
    ButtonOwnProps,
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
  extends ButtonOwnProps, Omit<ComponentProps<'a'>, LockedProps | 'type'> {
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
  // The status tone's icon by default; false removes it. An explicit icon wins: a bin says more
  // about Delete than the generic cross.
  const leadingIcon =
    props.startIcon === false ? undefined : (props.startIcon ?? toneIcon(props.tone ?? 'neutral'));

  if (props.href !== undefined) {
    const {
      variant = 'solid',
      tone = 'neutral',
      size = 'md',
      href,
      disabled = false,
      // Kept out of the DOM props: leadingIcon above resolves it
      startIcon: _startIcon,
      endIcon,
      children,
      ...linkProps
    } = props;
    const content = (
      <Content startIcon={leadingIcon} endIcon={endIcon}>
        {children}
      </Content>
    );
    const sharedProps = {
      'data-variant': variant,
      'data-tone': tone,
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

  const {
    variant = 'solid',
    tone = 'neutral',
    size = 'md',
    startIcon: _startIcon,
    endIcon,
    children,
    ...buttonProps
  } = props;

  return (
    <BaseButton
      {...buttonProps}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      className={styles.button}
      style={undefined}
    >
      <Content startIcon={leadingIcon} endIcon={endIcon}>
        {children}
      </Content>
    </BaseButton>
  );
}

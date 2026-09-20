import { Children, Fragment, type ReactNode } from 'react';
import styles from './Stack.module.scss';

export type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type StackGap = 'xs' | 'sm' | 'md' | 'lg';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'main'
  | 'header'
  | 'footer'
  | 'nav'
  | 'span'
  | 'ul'
  | 'ol';

export interface StackProps {
  /**
   * The HTML element. `div` for a plain group; `ul` or `ol` for a list, whose children must then
   * be `li` elements; a landmark or sectioning element when the content is one; `span` inside a
   * line of text. The look does not change with the element.
   * @default 'div'
   */
  as?: StackElement;
  /**
   * The axis the children follow, as in flexbox: `column` stacks them from top to bottom, `row`
   * lines them up from start to end; the `-reverse` values flip the visual order only (screen
   * readers and the keyboard keep the source order).
   * @default 'column'
   */
  direction?: StackDirection;
  /**
   * How the children line up across the stack's axis, as in flexbox: in a `row`, `center` puts
   * them on the same middle line, `baseline` on the same text line, `start` and `end` against
   * one edge. `stretch` gives them the full height of the row (or width of the column), unless
   * they set their own.
   * @default 'stretch'
   */
  align?: StackAlign;
  /**
   * Space between the children, on the kit's spacing scale: `xs` (0.25rem), `sm` (0.5rem), `md`
   * (1rem), `lg` (1.5rem). With `separator`, the line sits in the middle of it.
   * @default 'md'
   */
  gap?: StackGap;
  /**
   * Draws a thin line between the children, across the stack's axis. Decorative: hidden from
   * screen readers.
   * @default false
   */
  separator?: boolean;
  /**
   * Whether the children move to a new line when a `row` runs out of room.
   * @default false
   */
  wrap?: boolean;
  children?: ReactNode;
}

/**
 * Lays its children out in a column or a row, with a gap on the kit's spacing scale, optional
 * lines between them, and the element that fits the content (`as`, a list included).
 *
 * ```tsx
 * <Stack direction="row" gap="sm" wrap>…</Stack>
 * <Stack as="ul" separator>
 *   <li>…</li>
 * </Stack>
 * ```
 */
export function Stack({
  as: Element = 'div',
  direction = 'column',
  align = 'stretch',
  gap = 'md',
  separator = false,
  wrap = false,
  children,
}: StackProps) {
  const isList = Element === 'ul' || Element === 'ol';
  // A list may only hold li elements: its separators are hidden li
  const Separator = isList ? 'li' : 'span';

  return (
    <Element
      data-direction={direction}
      data-align={align}
      data-gap={gap}
      data-wrap={wrap ? '' : undefined}
      className={`${styles.stack}${isList ? ` ${styles.list}` : ''}`}
    >
      {separator
        ? Children.toArray(children).map((child, index) => (
            // toArray gives each child a key: keep it on the pair
            <Fragment key={(child as { key?: string }).key ?? index}>
              {index > 0 && <Separator aria-hidden className={styles.separator} />}
              {child}
            </Fragment>
          ))
        : children}
    </Element>
  );
}

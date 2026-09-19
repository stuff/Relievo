import type { ReactNode } from 'react';
import styles from './Box.module.scss';

export type BoxSpacing = 'xs' | 'sm' | 'md' | 'lg';
export type BoxElement = 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'nav' | 'span';

export interface BoxProps {
  /**
   * The HTML element. `div` for a plain container; a landmark (`main`, `nav`, `aside`, `header`,
   * `footer`) or a sectioning element (`section`, `article`) when the content is one; `span`
   * inside a line of text. The look does not change with the element.
   * @default 'div'
   */
  as?: BoxElement;
  /**
   * Space inside the box, on every side, on the kit's spacing scale: `xs` (0.25rem), `sm`
   * (0.5rem), `md` (1rem), `lg` (1.5rem). No padding when left out.
   */
  padding?: BoxSpacing;
  /**
   * Space around the box, on every side, on the same scale as `padding`. No margin when left out.
   * Prefer a `Stack`'s `gap` to space boxes from each other.
   */
  margin?: BoxSpacing;
  /**
   * Draws a thin border with rounded corners, in the kit's border color. For a panel with a
   * surface, a title or a status, use a `Card` instead.
   * @default false
   */
  border?: boolean;
  children?: ReactNode;
}

/**
 * A generic container: padding, margin and an optional border on the kit's spacing scale, and the
 * element that fits the content (`as`). It has no look of its own beyond that: a `Card` is the
 * panel with a surface.
 *
 * ```tsx
 * <Box as="section" padding="md" border>…</Box>
 * ```
 */
export function Box({ as: Element = 'div', padding, margin, border = false, children }: BoxProps) {
  return (
    <Element
      data-padding={padding}
      data-margin={margin}
      data-border={border ? '' : undefined}
      className={styles.box}
    >
      {children}
    </Element>
  );
}

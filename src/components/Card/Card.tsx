import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { CheckCircleIcon, InfoIcon, SparkleIcon, WarningIcon, XCircleIcon } from '@phosphor-icons/react';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Card.module.scss';

export type CardTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
export type CardVariant = 'solid' | 'outline';
export type CardElement = 'div' | 'article' | 'section';
export type CardTitleElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type CardStatusTone = Exclude<CardTone, 'neutral'>;

interface CardBaseProps {
  /**
   * The HTML element of the card. `div` for a plain panel; `article` for a self-contained item
   * (a post, a product in a list); `section` for a part of the page. An `article` or a `section`
   * is named by its `Card.Title` for screen readers.
   * @default 'div'
   */
  as?: CardElement;
  /**
   * Rendering: `solid` fills the card with the surface color, tinted by the tone at the top;
   * `outline` has no fill, over whatever is behind the card, with a lighter tint: a lighter panel.
   * @default 'solid'
   */
  variant?: CardVariant;
  /**
   * The parts of the card, in order: `Card.Header`, `Card.Body`, `Card.Footer`. Each one is
   * optional; a line sets the footer apart.
   */
  children?: ReactNode;
}

interface CardNeutralProps extends CardBaseProps {
  /**
   * The meaning of the card, as a color: the border takes the tone, the top of the card gets a
   * light tint of it (lighter in `outline`) and a tone icon sits in the top-right corner.
   * `neutral` has no meaning, and no icon. Pair a status tone with a title that says the same
   * thing: color alone does not carry meaning.
   * @default 'neutral'
   */
  tone?: 'neutral';
  icon?: never;
}

interface CardToneProps extends CardBaseProps {
  /**
   * The meaning of the card, as a color: the border takes the tone, the top of the card gets a
   * light tint of it (lighter in `outline`) and a tone icon sits in the top-right corner.
   * `neutral` has no meaning, and no icon. Pair a status tone with a title that says the same
   * thing: color alone does not carry meaning.
   * @default 'neutral'
   */
  tone: CardStatusTone;
  /**
   * Decorative icon in the top-right corner, in the tone's color, behind the text. Only with a
   * tone other than `neutral`. Defaults to the tone's icon (a warning triangle for `warning`…);
   * pass another element to replace it, such as `<LockIcon />`, or `false` to remove it. Hidden
   * when `Card.Header` has an `end` slot, which takes its corner.
   */
  icon?: ReactElement | false;
}

export type CardProps = CardNeutralProps | CardToneProps;

export interface CardHeaderProps {
  /**
   * `Card.Title`, optionally followed by `Card.Description`.
   */
  children?: ReactNode;
  /**
   * Content before the title, such as a `Checkbox` that selects the card in a list. Centered on
   * the title's first line; the title and description take the remaining width.
   */
  start?: ReactNode;
  /**
   * Content after the title: a status or a score as a `Chip`, a `Menu` of actions. Centered on
   * the title's first line, it never wraps under it. It takes the place of the tone's corner
   * icon, which is hidden.
   */
  end?: ReactNode;
}

export interface CardTitleProps {
  /**
   * The heading element, to fit the card in the page outline: `h3` under a section's `h2`, `h2`
   * for a card directly under the page's `h1`, `h1` when the card is the page itself (a detail
   * page). The look does not change with the element.
   * @default 'h3'
   */
  as?: CardTitleElement;
  children?: ReactNode;
}

export interface CardDescriptionProps {
  /**
   * A short line under the title: what the card holds.
   */
  children?: ReactNode;
}

export interface CardBodyProps {
  /**
   * The main content of the card.
   */
  children?: ReactNode;
}

export interface CardFooterProps {
  /**
   * Actions or secondary information, laid out in a row, such as a `ButtonGroup`.
   */
  children?: ReactNode;
}

interface CardContextValue {
  titleId: string;
  setHasTitle: (hasTitle: boolean) => void;
}

const CardContext = createContext<CardContextValue | null>(null);

const toneIcons: Record<CardStatusTone, ReactElement> = {
  primary: <SparkleIcon />,
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
  danger: <XCircleIcon />,
};

/**
 * A flat panel that groups related content: a header (title and
 * description), a body and a footer set apart by a line, each optional. A status `tone` colors
 * it and adds the tone's icon in the corner (`icon` replaces or removes it).
 *
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Team</Card.Title>
 *     <Card.Description>People who can edit this project.</Card.Description>
 *   </Card.Header>
 *   <Card.Body>…</Card.Body>
 *   <Card.Footer>…</Card.Footer>
 * </Card>
 * ```
 */
export function Card({ as: Element = 'div', tone = 'neutral', variant = 'solid', icon, children }: CardProps) {
  const titleId = useId();
  // The tone's icon by default; false removes it. A neutral card has none.
  const cornerIcon = tone === 'neutral' || icon === false ? undefined : (icon ?? toneIcons[tone]);
  const [hasTitle, setHasTitle] = useState(false);
  // A generic div cannot be named; an article or a section is named by its title
  const labelledBy = Element !== 'div' && hasTitle ? titleId : undefined;

  return (
    <CardContext.Provider value={{ titleId, setHasTitle }}>
      <Element
        aria-labelledby={labelledBy}
        data-tone={tone}
        data-variant={variant}
        className={styles.card}
      >
        <IconSlot icon={cornerIcon} className={styles.icon} />
        {children}
      </Element>
    </CardContext.Provider>
  );
}

const isEmpty = (node: ReactNode) => node === undefined || node === null || node === false;

function CardHeader({ start, end, children }: CardHeaderProps) {
  const hasStart = !isEmpty(start);
  const hasEnd = !isEmpty(end);

  if (!hasStart && !hasEnd) {
    return <div className={styles.header}>{children}</div>;
  }

  return (
    <div className={`${styles.header} ${styles.withSlots}${hasEnd ? ` ${styles.withEnd}` : ''}`}>
      {hasStart && <div className={styles.slot}>{start}</div>}
      <div className={styles.heading}>{children}</div>
      {hasEnd && <div className={styles.slot}>{end}</div>}
    </div>
  );
}

function CardTitle({ as: Heading = 'h3', children }: CardTitleProps) {
  const context = useContext(CardContext);
  const setHasTitle = context?.setHasTitle;

  useLayoutEffect(() => {
    if (!setHasTitle) return;
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <Heading id={context?.titleId} className={styles.title}>
      {children}
    </Heading>
  );
}

function CardDescription({ children }: CardDescriptionProps) {
  return <p className={styles.description}>{children}</p>;
}

function CardBody({ children }: CardBodyProps) {
  return <div className={styles.body}>{children}</div>;
}

function CardFooter({ children }: CardFooterProps) {
  return <div className={styles.footer}>{children}</div>;
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

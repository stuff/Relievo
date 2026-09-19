import type { MouseEvent, ReactNode } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { IconSlot } from '../../internal/IconSlot';
import { useLinkComponent } from '../../provider/UiKitProvider';
import { useControllableState } from '../../utils/useControllableState';
import { getPageItems } from './pages';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  /**
   * Number of pages. At least 1.
   */
  pageCount: number;
  /**
   * The current page, from 1, when controlled. Update it from `onPageChange`.
   */
  page?: number;
  /**
   * The initial page, from 1, when uncontrolled.
   * @default 1
   */
  defaultPage?: number;
  /**
   * Called with the requested page when the user picks one, in both controlled and uncontrolled
   * use. With `getPageHref`, it is called before the link navigates, and not for a click that
   * opens the page in a new tab or window.
   */
  onPageChange?: (page: number) => void;
  /**
   * Turns the pages into links, for a page number kept in the URL: returns the address of a page,
   * such as `(page) => \`?page=${page}\``. Links use the router link configured in
   * `UiKitProvider`, so a client-side router navigates without reloading. Control the component
   * from the URL (`page={pageFromUrl}`): the browser's back and forward buttons then update it
   * too. Without `getPageHref`, the pages are buttons.
   */
  getPageHref?: (page: number) => string;
  /**
   * Pages shown on each side of the current page. The first and last pages are always shown;
   * gaps become an ellipsis.
   * @default 1
   */
  siblingCount?: number;
  /**
   * Accessible name of the navigation landmark, read by screen readers. Name it after what it
   * pages through when a page has several, such as "Products pages".
   * @default 'Pagination'
   */
  label?: string;
  /**
   * Accessible name of the previous page control.
   * @default 'Previous page'
   */
  previousLabel?: string;
  /**
   * Accessible name of the next page control.
   * @default 'Next page'
   */
  nextLabel?: string;
  /**
   * Accessible name of a page, for screen readers (the page number is displayed).
   * @default (page) => `Page ${page}`
   */
  getPageLabel?: (page: number) => string;
}

interface ItemProps {
  page: number;
  href?: string;
  current?: boolean;
  disabled?: boolean;
  label: string;
  onSelect: (page: number) => void;
  children: ReactNode;
}

function Item({ page, href, current = false, disabled = false, label, onSelect, children }: ItemProps) {
  const Link = useLinkComponent();
  const shared = {
    className: styles.item,
    'aria-label': label,
    'aria-current': current ? ('page' as const) : undefined,
    'data-current': current ? '' : undefined,
  };

  if (href !== undefined) {
    // A disabled link has no href, so it leaves navigation and the tab order
    if (disabled) {
      return (
        <a {...shared} role="link" aria-disabled data-disabled="">
          {children}
        </a>
      );
    }
    return (
      <Link
        {...shared}
        href={href}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          // A modified click opens the page elsewhere (a new tab or window): this one stays put
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
          }
          onSelect(page);
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...shared}
      type="button"
      disabled={disabled}
      data-disabled={disabled ? '' : undefined}
      onClick={() => onSelect(page)}
    >
      {children}
    </button>
  );
}

/**
 * Moves through a list split into pages: previous and next controls around the page numbers, with
 * an ellipsis for long ranges. The current page is marked for screen readers (`aria-current`).
 *
 * When the full row does not fit in the width it is given, it switches to a compact row: the
 * previous and next controls around the current page out of the count (`5 / 12`). It works in a
 * block, a flex row or a stretched grid cell; a grid cell aligned to `start` keeps the full row.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<Pagination pageCount={12} defaultPage={1} onPageChange={loadPage} />`.
 * - **Controlled**: `<Pagination pageCount={12} page={page} onPageChange={setPage} />`.
 *
 * With `getPageHref`, the pages are links, for a page number kept in the URL.
 */
export function Pagination({
  pageCount,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  getPageHref,
  siblingCount = 1,
  label = 'Pagination',
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  getPageLabel = (page) => `Page ${page}`,
}: PaginationProps) {
  const [rawPage, setPage] = useControllableState({
    value: pageProp,
    defaultValue: defaultPage,
    onChange: onPageChange,
    name: 'Pagination (page)',
  });
  const count = Math.max(1, Math.floor(pageCount));
  const page = Math.min(Math.max(1, rawPage), count);
  const items = getPageItems(page, count, siblingCount);
  const href = (target: number) => getPageHref?.(target);

  return (
    // data-items: how many controls the full row holds, for the container query that switches to
    // the compact row (see the stylesheet)
    <nav aria-label={label} data-items={items.length + 2} className={styles.pagination}>
      <ul className={styles.list}>
        <li>
          <Item
            page={page - 1}
            href={href(page - 1)}
            disabled={page <= 1}
            label={previousLabel}
            onSelect={setPage}
          >
            <IconSlot icon={<CaretLeftIcon />} className={styles.icon} />
          </Item>
        </li>
        {items.map((item) =>
          typeof item === 'number' ? (
            <li key={item} className={styles.page}>
              <Item
                page={item}
                href={href(item)}
                current={item === page}
                label={getPageLabel(item)}
                onSelect={setPage}
              >
                {/* A flex item, so text-box can trim the number */}
                <span className={styles.label}>{item}</span>
              </Item>
            </li>
          ) : (
            // Decorative: screen readers skip it, the page labels say which pages are there
            <li key={item} className={`${styles.page} ${styles.ellipsis}`} aria-hidden>
              …
            </li>
          ),
        )}
        {/* Compact row, when the full one does not fit: the current page out of the count */}
        <li className={styles.status}>
          {page} / {count}
        </li>
        <li>
          <Item
            page={page + 1}
            href={href(page + 1)}
            disabled={page >= count}
            label={nextLabel}
            onSelect={setPage}
          >
            <IconSlot icon={<CaretRightIcon />} className={styles.icon} />
          </Item>
        </li>
      </ul>
    </nav>
  );
}

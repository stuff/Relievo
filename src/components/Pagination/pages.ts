export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * The items to show: the first and last pages, the current page with `siblings` pages on each
 * side, and an ellipsis for each gap. The number of items stays the same from page to page, so
 * the controls do not jump around.
 * @internal
 */
export function getPageItems(page: number, pageCount: number, siblings: number): PageItem[] {
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  // First, last, current, siblings and two ellipses
  const slots = siblings * 2 + 5;

  if (pageCount <= slots) {
    return range(1, pageCount);
  }

  const start = Math.max(page - siblings, 1);
  const end = Math.min(page + siblings, pageCount);
  // An ellipsis stands for at least two pages: a gap of one shows the page itself
  const showStartEllipsis = start > 3;
  const showEndEllipsis = end < pageCount - 2;
  const edgeCount = siblings * 2 + 3;

  if (!showStartEllipsis) {
    return [...range(1, edgeCount), 'ellipsis-end', pageCount];
  }
  if (!showEndEllipsis) {
    return [1, 'ellipsis-start', ...range(pageCount - edgeCount + 1, pageCount)];
  }
  return [1, 'ellipsis-start', ...range(start, end), 'ellipsis-end', pageCount];
}

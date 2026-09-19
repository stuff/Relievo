import { describe, expect, it } from 'vitest';
import { getPageItems } from './pages';

describe('getPageItems', () => {
  it('shows every page when they fit', () => {
    expect(getPageItems(1, 7, 1)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(getPageItems(1, 1, 1)).toEqual([1]);
  });

  it('collapses the end near the start', () => {
    expect(getPageItems(1, 20, 1)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(getPageItems(4, 20, 1)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
  });

  it('collapses both sides in the middle', () => {
    expect(getPageItems(10, 20, 1)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
  });

  it('collapses the start near the end', () => {
    expect(getPageItems(20, 20, 1)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
    expect(getPageItems(17, 20, 1)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });

  it('keeps the same number of items from page to page', () => {
    for (let page = 1; page <= 20; page++) {
      expect(getPageItems(page, 20, 1)).toHaveLength(7);
      expect(getPageItems(page, 20, 2)).toHaveLength(9);
    }
  });
});

import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RelievoProvider, type LinkComponentProps } from '../../provider';
import { Pagination, type PaginationProps } from './Pagination';

describe('Pagination', () => {
  it('renders a named navigation with the current page marked', () => {
    render(<Pagination pageCount={5} defaultPage={2} />);

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    const current = screen.getByRole('button', { name: 'Page 2' });
    expect(nav).toContainElement(current);
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
  });

  it('hides the ellipsis from assistive technologies', () => {
    render(<Pagination pageCount={20} />);

    expect(screen.getByText('…')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button', { name: 'Page 20' })).toBeInTheDocument();
  });

  it('disables previous on the first page and next on the last', () => {
    const { rerender } = render(<Pagination pageCount={3} page={1} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();

    rerender(<Pagination pageCount={3} page={3} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  describe('uncontrolled', () => {
    it('starts on page 1 by default, then moves on its own', async () => {
      const onPageChange = vi.fn();
      render(<Pagination pageCount={5} onPageChange={onPageChange} />);

      expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
        'aria-current',
        'page',
      );

      await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
        'aria-current',
        'page',
      );

      await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
      expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(onPageChange).toHaveBeenLastCalledWith(4);
    });

    it('does not report a click on the current page', async () => {
      const onPageChange = vi.fn();
      render(<Pagination pageCount={5} defaultPage={3} onPageChange={onPageChange} />);

      await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('controlled', () => {
    it('renders the page prop and only reports changes', async () => {
      const onPageChange = vi.fn();
      render(<Pagination pageCount={5} page={2} onPageChange={onPageChange} />);

      await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));

      expect(onPageChange).toHaveBeenCalledWith(3);
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it("follows the parent's update", async () => {
      function Controlled() {
        const [page, setPage] = useState(1);
        return <Pagination pageCount={5} page={page} onPageChange={setPage} />;
      }
      render(<Controlled />);

      await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));

      expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });
  });

  it('renders the compact status, the current page out of the count', () => {
    // Shown instead of the page numbers when the row does not fit (a container query)
    render(<Pagination pageCount={12} defaultPage={5} />);

    expect(screen.getByText('5 / 12')).toBeInTheDocument();
  });

  it('keeps the page within range', () => {
    render(<Pagination pageCount={3} page={9} />);

    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('uses the given labels', () => {
    render(
      <Pagination
        pageCount={3}
        label="Products pages"
        previousLabel="Page précédente"
        nextLabel="Page suivante"
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Products pages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page précédente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page suivante' })).toBeInTheDocument();
  });

  describe('with pageHref', () => {
    it('puts the page number wherever {page} appears', () => {
      render(
        <Pagination pageCount={3} defaultPage={1} pageHref="/p/{page}?from={page}&sort=price" />,
      );

      expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
        'href',
        '/p/2?from=2&sort=price',
      );
    });

    it('renders links, the current one marked, previous disabled on the first page', () => {
      render(<Pagination pageCount={3} defaultPage={1} pageHref="?page={page}" />);

      expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '?page=2');
      expect(screen.getByRole('link', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
      const previous = screen.getByRole('link', { name: 'Previous page' });
      expect(previous).not.toHaveAttribute('href');
      expect(previous).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('uses the router link from RelievoProvider and reports the page', async () => {
      const onPageChange = vi.fn();
      const RouterLink = vi.fn(({ onClick, ...props }: LinkComponentProps) => (
        <a
          {...props}
          data-router=""
          onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
          }}
        />
      ));
      render(
        <RelievoProvider linkComponent={RouterLink}>
          <Pagination pageCount={3} onPageChange={onPageChange} pageHref="/p/{page}" />
        </RelievoProvider>,
      );

      const link = screen.getByRole('link', { name: 'Page 3' });
      expect(link).toHaveAttribute('data-router');
      await userEvent.click(link);

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('does not change page for a click that opens a new tab', async () => {
      const onPageChange = vi.fn();
      render(<Pagination pageCount={3} onPageChange={onPageChange} pageHref="?page={page}" />);

      // One user session, so Control stays held during the click
      const user = userEvent.setup();
      await user.keyboard('{Control>}');
      await user.click(screen.getByRole('link', { name: 'Page 3' }));
      await user.keyboard('{/Control}');

      expect(onPageChange).not.toHaveBeenCalled();
      expect(screen.getByRole('link', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    });
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as PaginationProps;
    render(<Pagination {...props} pageCount={3} />);

    const nav = screen.getByRole('navigation');
    expect(nav).not.toHaveClass('custom');
    expect(nav).not.toHaveAttribute('style');
  });
});

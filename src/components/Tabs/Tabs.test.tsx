import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { StarIcon } from '@phosphor-icons/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, type TabsProps } from './Tabs';
import styles from './Tabs.module.scss';

function Basic(props: Partial<TabsProps> = {}) {
  return (
    <Tabs label="Products" {...props}>
      <Tabs.List>
        <Tabs.Item value="published">Published</Tabs.Item>
        <Tabs.Item value="drafts">Drafts</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="published">On sale</Tabs.Panel>
      <Tabs.Panel value="drafts">Not on sale</Tabs.Panel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tab list named by its label', () => {
    render(<Basic defaultValue="published" />);

    expect(screen.getByRole('tablist', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('shows the panel of the selected tab, and only that one', () => {
    render(<Basic defaultValue="published" />);

    expect(screen.getByRole('tabpanel')).toHaveTextContent('On sale');
    expect(screen.queryByText('Not on sale')).toBeNull();
  });

  it('selects a tab when it is clicked, and swaps the panel', async () => {
    render(<Basic defaultValue="published" />);

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Published' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Not on sale');
  });

  it('links each tab to its panel', () => {
    render(<Basic defaultValue="published" />);

    const tab = screen.getByRole('tab', { name: 'Published' });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', tab.getAttribute('aria-controls'));
  });

  it('moves the selection with the arrow keys', async () => {
    render(<Basic defaultValue="published" />);

    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Published' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{Enter}');

    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses defaultValue as the first selection when uncontrolled', () => {
    render(<Basic defaultValue="drafts" />);

    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders the value prop when controlled, and only reports the change', async () => {
    const onValueChange = vi.fn();
    render(<Basic value="published" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(screen.getByRole('tab', { name: 'Published' })).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onValueChange with the value alone', async () => {
    // A server action or a setState takes one argument: Base UI's event details must not reach it
    const onValueChange = vi.fn();
    render(<Basic defaultValue="published" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(onValueChange.mock.calls[0]).toHaveLength(1);
  });

  it('follows the value prop when the parent updates it', async () => {
    function Controlled() {
      const [value, setValue] = useState('published');
      return (
        <>
          <button type="button" onClick={() => setValue('drafts')}>
            Go to drafts
          </button>
          <Basic value={value} onValueChange={setValue} />
        </>
      );
    }
    render(<Controlled />);

    await userEvent.click(screen.getByRole('button', { name: 'Go to drafts' }));

    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('fires onValueChange when uncontrolled too', async () => {
    const onValueChange = vi.fn();
    render(<Basic defaultValue="published" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('works with no panel at all', async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs label="Products" defaultValue="published" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
          <Tabs.Item value="drafts">Drafts</Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(screen.queryByRole('tabpanel')).toBeNull();
  });

  it('shows nothing when the selected tab has no panel', async () => {
    render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
          <Tabs.Item value="drafts">Drafts</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="published">On sale</Tabs.Panel>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(screen.queryByRole('tabpanel')).toBeNull();
  });

  it('names the tab after its label, count included', () => {
    render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published">Published 216</Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Published 216' })).toBeInTheDocument();
  });

  it('hides the icon from screen readers', () => {
    const { container } = render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published" startIcon={<StarIcon />}>
            Published
          </Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    expect(container.querySelector('svg')?.closest('[aria-hidden]')).not.toBeNull();
    expect(screen.getByRole('tab', { name: 'Published' })).toBeInTheDocument();
  });

  it('cannot select a disabled tab', async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs label="Products" defaultValue="published" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
          <Tabs.Item value="drafts" disabled>
            Drafts
          </Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Published' })).toHaveAttribute('aria-selected', 'true');
  });

  it('carries its size on the rail', () => {
    const { container } = render(<Basic defaultValue="published" size="sm" />);

    expect(container.querySelector('[data-size="sm"]')).not.toBeNull();
  });

  it('is md by default', () => {
    const { container } = render(<Basic defaultValue="published" />);

    expect(container.querySelector('[data-size="md"]')).not.toBeNull();
  });

  it('carries the panel variant as an attribute', () => {
    render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="published" variant="framed">
          On sale
        </Tabs.Panel>
      </Tabs>,
    );

    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-variant', 'framed');
  });

  it('is a plain panel by default', () => {
    render(<Basic defaultValue="published" />);

    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-variant', 'plain');
  });

  describe('when the bar is wider than its room', () => {
    // jsdom has no layout: the sizes are set by hand
    function renderScrolling({ scrollWidth = 600, clientWidth = 200 } = {}) {
      const onValueChange = vi.fn();
      render(<Basic defaultValue="published" onValueChange={onValueChange} />);
      const scroller = screen.getByRole('tablist').parentElement as HTMLElement;
      Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: scrollWidth });
      Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: clientWidth });
      // No ResizeObserver in jsdom to notice the new sizes: a scroll makes the bar look again
      fireEvent.scroll(scroller);
      return { scroller, onValueChange };
    }

    // The scroll events jsdom does not fire on its own
    function scrollTo(scroller: HTMLElement, left: number) {
      scroller.scrollLeft = left;
      fireEvent.scroll(scroller);
    }

    function drag(scroller: HTMLElement, from: number, to: number, target: Element = scroller) {
      fireEvent.pointerDown(target, {
        pointerType: 'mouse',
        button: 0,
        pointerId: 1,
        clientX: from,
      });
      fireEvent.pointerMove(target, { pointerType: 'mouse', pointerId: 1, clientX: to });
      fireEvent.pointerUp(target, { pointerType: 'mouse', pointerId: 1, clientX: to });
    }

    describe('mouse wheel', () => {
      it('scrolls the bar sideways', () => {
        const { scroller } = renderScrolling();

        const notCancelled = fireEvent.wheel(scroller, { deltaY: 100 });

        expect(scroller.scrollLeft).toBe(100);
        // The page must not scroll as well
        expect(notCancelled).toBe(false);
      });

      it('scrolls back with a negative delta', () => {
        const { scroller } = renderScrolling();
        scroller.scrollLeft = 150;

        fireEvent.wheel(scroller, { deltaY: -100 });

        expect(scroller.scrollLeft).toBe(50);
      });

      it('never scrolls past the ends', () => {
        const { scroller } = renderScrolling();

        fireEvent.wheel(scroller, { deltaY: 5000 });
        expect(scroller.scrollLeft).toBe(400);

        fireEvent.wheel(scroller, { deltaY: -5000 });
        expect(scroller.scrollLeft).toBe(0);
      });

      it('leaves the wheel to the page once the bar cannot go further', () => {
        const { scroller } = renderScrolling();

        // Already at the start, scrolling back
        expect(fireEvent.wheel(scroller, { deltaY: -100 })).toBe(true);

        scroller.scrollLeft = 400;
        // Already at the end, scrolling forward
        expect(fireEvent.wheel(scroller, { deltaY: 100 })).toBe(true);
      });

      it('leaves the wheel to the page when the tabs fit', () => {
        const { scroller } = renderScrolling({ scrollWidth: 200, clientWidth: 200 });

        expect(fireEvent.wheel(scroller, { deltaY: 100 })).toBe(true);
        expect(scroller.scrollLeft).toBe(0);
      });

      it('leaves a sideways gesture to the browser', () => {
        const { scroller } = renderScrolling();

        expect(fireEvent.wheel(scroller, { deltaX: 100, deltaY: 10 })).toBe(true);
        expect(scroller.scrollLeft).toBe(0);
      });

      it('counts a line of delta as more than a pixel', () => {
        const { scroller } = renderScrolling();

        // DOM_DELTA_LINE, as Firefox reports a notched wheel
        fireEvent.wheel(scroller, { deltaY: 3, deltaMode: 1 });

        expect(scroller.scrollLeft).toBe(48);
      });
    });

    describe('mouse drag', () => {
      it('scrolls the bar with the pointer', () => {
        const { scroller } = renderScrolling();
        scroller.scrollLeft = 100;

        fireEvent.pointerDown(scroller, {
          pointerType: 'mouse',
          button: 0,
          pointerId: 1,
          clientX: 150,
        });
        fireEvent.pointerMove(scroller, { pointerType: 'mouse', pointerId: 1, clientX: 100 });

        // Dragging left moves the content left, as if held in the hand
        expect(scroller.scrollLeft).toBe(150);
      });

      it('does not select the tab it is released over', () => {
        const { scroller, onValueChange } = renderScrolling();
        const tab = screen.getByRole('tab', { name: 'Drafts' });

        drag(scroller, 150, 60, tab);
        fireEvent.click(tab);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(tab).toHaveAttribute('aria-selected', 'false');
      });

      it('still selects a tab on a plain click', async () => {
        const { onValueChange } = renderScrolling();

        await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

        expect(onValueChange).toHaveBeenCalledWith('drafts');
      });

      it('takes a small move for a click', () => {
        const { scroller, onValueChange } = renderScrolling();
        const tab = screen.getByRole('tab', { name: 'Drafts' });

        drag(scroller, 150, 147, tab);
        fireEvent.click(tab);

        expect(scroller.scrollLeft).toBe(0);
        expect(onValueChange).toHaveBeenCalledWith('drafts');
      });

      it('selects on the click after a drag once the drag is over', () => {
        vi.useFakeTimers();
        try {
          const { scroller, onValueChange } = renderScrolling();
          const tab = screen.getByRole('tab', { name: 'Drafts' });

          drag(scroller, 150, 60, tab);
          // No click followed the release (the pointer was let go elsewhere)
          vi.runAllTimers();
          fireEvent.click(tab);

          expect(onValueChange).toHaveBeenCalledWith('drafts');
        } finally {
          vi.useRealTimers();
        }
      });

      it('leaves touch and pen to the browser', () => {
        const { scroller } = renderScrolling();

        fireEvent.pointerDown(scroller, { pointerType: 'touch', pointerId: 1, clientX: 150 });
        fireEvent.pointerMove(scroller, { pointerType: 'touch', pointerId: 1, clientX: 50 });

        expect(scroller.scrollLeft).toBe(0);
      });

      it('does nothing when the tabs fit', () => {
        const { scroller } = renderScrolling({ scrollWidth: 200, clientWidth: 200 });

        drag(scroller, 150, 50);

        expect(scroller.scrollLeft).toBe(0);
      });
    });

    describe('fades', () => {
      it('shows one at the end while at the start', () => {
        const { scroller } = renderScrolling();

        expect(scroller).toHaveClass(styles.fadeEnd);
        expect(scroller).not.toHaveClass(styles.fadeStart);
      });

      it('shows both in the middle', () => {
        const { scroller } = renderScrolling();

        scrollTo(scroller, 200);

        expect(scroller).toHaveClass(styles.fadeStart, styles.fadeEnd);
      });

      it('shows one at the start once at the end', () => {
        const { scroller } = renderScrolling();

        scrollTo(scroller, 400);

        expect(scroller).toHaveClass(styles.fadeStart);
        expect(scroller).not.toHaveClass(styles.fadeEnd);
      });

      it('shows none when the tabs fit', () => {
        const { scroller } = renderScrolling({ scrollWidth: 200, clientWidth: 200 });

        scrollTo(scroller, 0);

        expect(scroller).not.toHaveClass(styles.fadeStart);
        expect(scroller).not.toHaveClass(styles.fadeEnd);
      });
    });
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as TabsProps;
    const { container } = render(<Basic defaultValue="published" {...props} />);

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

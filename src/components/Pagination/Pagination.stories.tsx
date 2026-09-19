import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RelievoProvider, type LinkComponentProps } from '../../provider';
import { Pagination } from './Pagination';

// Grid items stretch, so each pagination gets the width of the story and can switch to its
// compact row (a grid item aligned to start would keep its full width and overflow instead)
const stack = { display: 'grid', gap: 'var(--rv-space-4)' } as const;
const text = { fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' } as const;

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    pageCount: 12,
    defaultPage: 5,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Few pages: all of them are shown. */
export const FewPages: Story = {
  args: { pageCount: 5, defaultPage: 1 },
};

/** Long ranges collapse into an ellipsis; the number of items stays the same from page to page. */
export const ManyPages: Story = {
  render: (args) => (
    <div style={stack}>
      {[1, 4, 10, 17, 20].map((page) => (
        <Pagination key={page} {...args} pageCount={20} defaultPage={page} />
      ))}
    </div>
  ),
};

/** `siblingCount` shows more pages around the current one. */
export const Siblings: Story = {
  args: { pageCount: 30, defaultPage: 15, siblingCount: 2 },
};

/** The pagination keeps its own page: `defaultPage` sets the first one. */
export const Uncontrolled: Story = {
  args: { defaultPage: 1 },
};

/** The parent owns the page: `page` and `onPageChange`. */
export const Controlled: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(3);

    return (
      <div style={stack}>
        <Pagination {...args} defaultPage={undefined} page={page} onPageChange={setPage} />
        <span style={text}>Page: {page}</span>
      </div>
    );
  },
};

/**
 * `getPageHref` turns the pages into links, for a page number kept in the URL. Here a stand-in
 * client-side router navigates without reloading, and the page comes from the URL (controlled).
 */
export const AsLinks: Story = {
  render: function Render(args) {
    // Stands in for a client-side router: the URL is state, links navigate without reloading
    const [url, setUrl] = useState('/products?page=3');
    const RouterLink = useMemo(
      () =>
        function RouterLink({ href, onClick, ...props }: LinkComponentProps) {
          return (
            <a
              {...props}
              href={href}
              onClick={(event) => {
                onClick?.(event);
                if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                  event.preventDefault();
                  setUrl(href);
                }
              }}
            />
          );
        },
      [],
    );
    // The page comes from the URL: the pagination is controlled by it
    const page = Number(new URL(url, 'https://example.com').searchParams.get('page') ?? 1);

    return (
      <RelievoProvider linkComponent={RouterLink}>
        <div style={stack}>
          <Pagination
            {...args}
            defaultPage={undefined}
            page={page}
            getPageHref={(target) => `/products?page=${target}`}
          />
          <span style={text}>URL: {url}</span>
        </div>
      </RelievoProvider>
    );
  },
};

/**
 * When the full row does not fit, the pagination switches to a compact row: the current page out
 * of the count. Drag the corner of the frame to resize it.
 */
export const Compact: Story = {
  render: (args) => (
    <div
      style={{
        inlineSize: '12rem',
        minInlineSize: '8rem',
        maxInlineSize: '40rem',
        padding: 'var(--rv-space-3)',
        border: '1px dashed var(--rv-color-border)',
        resize: 'horizontal',
        overflow: 'hidden',
      }}
    >
      <Pagination {...args} />
    </div>
  ),
};

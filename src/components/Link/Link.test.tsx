import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { RelievoProvider } from '../../provider/RelievoProvider';
import { Link, type LinkProps } from './Link';

describe('Link', () => {
  it('renders a link to its href, named by its text', () => {
    render(<Link href="/offers">Back to the list</Link>);

    expect(screen.getByRole('link', { name: 'Back to the list' })).toHaveAttribute('href', '/offers');
  });

  it('is primary by default, and carries its tone as an attribute', () => {
    render(
      <>
        <Link href="/a">One</Link>
        <Link href="/b" tone="neutral">Two</Link>
      </>,
    );

    expect(screen.getByRole('link', { name: 'One' })).toHaveAttribute('data-tone', 'primary');
    expect(screen.getByRole('link', { name: 'Two' })).toHaveAttribute('data-tone', 'neutral');
  });

  it('stays in the same tab by default', () => {
    render(<Link href="/offers">Back to the list</Link>);

    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('opens an external link in a new tab, with a rel that cannot reach back', () => {
    render(<Link href="https://example.com" external>The ad</Link>);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('marks an external link with an icon, hidden from screen readers', () => {
    const { container } = render(<Link href="https://example.com" external>The ad</Link>);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.closest('[aria-hidden]')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'The ad' })).toBeInTheDocument();
  });

  it('draws no icon when the link stays on the site', () => {
    const { container } = render(<Link href="/offers">Back to the list</Link>);

    expect(container.querySelector('svg')).toBeNull();
  });

  it("renders the app's link component when one is configured", () => {
    function RouterLink({ href, children, ...rest }: ComponentProps<'a'> & { href: string }) {
      return <a {...rest} href={href} data-router="">{children}</a>;
    }
    render(
      <RelievoProvider linkComponent={RouterLink}>
        <Link href="/offers">Back to the list</Link>
      </RelievoProvider>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('data-router');
  });

  it('passes through the props of an anchor', () => {
    render(<Link href="/offers" id="back" title="The whole list" download="">Back</Link>);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('id', 'back');
    expect(link).toHaveAttribute('title', 'The whole list');
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as LinkProps;
    const { container } = render(<Link {...props} href="/offers">Back</Link>);

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

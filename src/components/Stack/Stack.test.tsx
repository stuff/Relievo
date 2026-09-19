import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack, type StackProps } from './Stack';

describe('Stack', () => {
  it('renders a column with a medium gap by default', () => {
    render(
      <Stack>
        <span>One</span>
        <span>Two</span>
      </Stack>,
    );

    const stack = screen.getByText('One').parentElement!;
    expect(stack.tagName).toBe('DIV');
    expect(stack).toHaveAttribute('data-direction', 'column');
    expect(stack).toHaveAttribute('data-gap', 'md');
    expect(stack).not.toHaveAttribute('data-wrap');
  });

  it('applies the direction, gap and wrap', () => {
    render(
      <Stack direction="row-reverse" gap="xs" wrap>
        <span>One</span>
      </Stack>,
    );

    const stack = screen.getByText('One').parentElement!;
    expect(stack).toHaveAttribute('data-direction', 'row-reverse');
    expect(stack).toHaveAttribute('data-gap', 'xs');
    expect(stack).toHaveAttribute('data-wrap');
  });

  it('renders the element given by as', () => {
    render(
      <Stack as="nav">
        <a href="/">Home</a>
      </Stack>,
    );

    expect(screen.getByRole('navigation')).toContainElement(screen.getByRole('link'));
  });

  it('adds no separator by default', () => {
    const { container } = render(
      <Stack>
        <span>One</span>
        <span>Two</span>
      </Stack>,
    );

    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0);
  });

  it('puts a hidden separator between each pair of children, skipping empty ones', () => {
    const { container } = render(
      <Stack separator>
        <span>One</span>
        {false}
        <span>Two</span>
        {null}
        <span>Three</span>
      </Stack>,
    );

    const stack = container.firstElementChild!;
    const kinds = [...stack.children].map((child) =>
      child.hasAttribute('aria-hidden') ? '|' : child.textContent,
    );
    expect(kinds).toEqual(['One', '|', 'Two', '|', 'Three']);
  });

  it('keeps a valid list: its separators are hidden list items', () => {
    render(
      <Stack as="ul" separator>
        <li>One</li>
        <li>Two</li>
      </Stack>,
    );

    const list = screen.getByRole('list');
    expect([...list.children].every((child) => child.tagName === 'LI')).toBe(true);
    // Screen readers only count the real items
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as StackProps;
    const { container } = render(
      <Stack {...props}>
        <span>One</span>
      </Stack>,
    );

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

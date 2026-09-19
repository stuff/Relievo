import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Box, type BoxProps } from './Box';

describe('Box', () => {
  it('renders a div without spacing or border by default', () => {
    render(<Box>Content</Box>);

    const box = screen.getByText('Content');
    expect(box.tagName).toBe('DIV');
    expect(box).not.toHaveAttribute('data-padding');
    expect(box).not.toHaveAttribute('data-margin');
    expect(box).not.toHaveAttribute('data-border');
  });

  it('renders the element given by as', () => {
    render(
      <>
        <Box as="section">Section</Box>
        <Box as="nav">Navigation</Box>
        <Box as="span">Inline</Box>
      </>,
    );

    expect(screen.getByText('Section').tagName).toBe('SECTION');
    expect(screen.getByRole('navigation')).toHaveTextContent('Navigation');
    expect(screen.getByText('Inline').tagName).toBe('SPAN');
  });

  it('applies the padding, the margin and the border', () => {
    render(
      <Box padding="md" margin="xs" border>
        Content
      </Box>,
    );

    const box = screen.getByText('Content');
    expect(box).toHaveAttribute('data-padding', 'md');
    expect(box).toHaveAttribute('data-margin', 'xs');
    expect(box).toHaveAttribute('data-border');
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as BoxProps;
    const { container } = render(<Box {...props}>Content</Box>);

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

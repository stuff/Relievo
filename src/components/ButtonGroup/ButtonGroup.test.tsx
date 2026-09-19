import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button';
import { ButtonGroup, type ButtonGroupProps } from './ButtonGroup';

describe('ButtonGroup', () => {
  it('renders its buttons in a group named by label', () => {
    render(
      <ButtonGroup label="Form actions">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole('group', { name: 'Form actions' });
    expect(group).toContainElement(screen.getByRole('button', { name: 'Cancel' }));
    expect(group).toContainElement(screen.getByRole('button', { name: 'Save' }));
  });

  it('has no accessible name without label', () => {
    render(
      <ButtonGroup>
        <Button>Save</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group')).not.toHaveAttribute('aria-label');
  });

  it('stays on a single line by default, and wraps with wrap', () => {
    render(
      <>
        <ButtonGroup label="Single line">
          <Button>Save</Button>
        </ButtonGroup>
        <ButtonGroup label="Wrapping" wrap>
          <Button>Save</Button>
        </ButtonGroup>
      </>,
    );

    expect(screen.getByRole('group', { name: 'Single line' })).not.toHaveAttribute('data-wrap');
    expect(screen.getByRole('group', { name: 'Wrapping' })).toHaveAttribute('data-wrap');
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as ButtonGroupProps;
    render(
      <ButtonGroup {...props}>
        <Button>Save</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole('group');
    expect(group).not.toHaveClass('custom');
    expect(group).not.toHaveAttribute('style');
  });
});

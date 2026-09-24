import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible } from './Collapsible';
import type { CollapsibleProps } from './Collapsible';

describe('Collapsible', () => {
  it('renders a trigger that reveals its content', async () => {
    render(
      <Collapsible label="Details">
        <p>Hidden by default</p>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Hidden by default')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText('Hidden by default')).toBeInTheDocument();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens with the keyboard', async () => {
    render(
      <Collapsible label="Details">
        <p>Hidden by default</p>
      </Collapsible>,
    );

    screen.getByRole('button', { name: 'Details' }).focus();
    await userEvent.keyboard('{Enter}');

    expect(await screen.findByText('Hidden by default')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    render(
      <Collapsible label="Details" disabled>
        <p>Hidden by default</p>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('data-disabled');
    await userEvent.click(trigger);

    expect(screen.queryByText('Hidden by default')).not.toBeInTheDocument();
  });

  it('starts open with defaultOpen', () => {
    render(
      <Collapsible label="Details" defaultOpen>
        <p>Shown from the start</p>
      </Collapsible>,
    );

    expect(screen.getByText('Shown from the start')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  describe('controlled', () => {
    it('opens from the open prop and only reports changes', async () => {
      const onOpenChange = vi.fn();
      render(
        <Collapsible label="Details" open onOpenChange={onOpenChange}>
          <p>Content</p>
        </Collapsible>,
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Details' }));

      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it("follows the parent's update", async () => {
      function Controlled() {
        const [isOpen, setOpen] = useState(false);
        return (
          <Collapsible label="Details" open={isOpen} onOpenChange={setOpen}>
            <p>Content</p>
          </Collapsible>
        );
      }
      render(<Controlled />);

      await userEvent.click(screen.getByRole('button', { name: 'Details' }));

      expect(await screen.findByText('Content')).toBeInTheDocument();
    });
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as CollapsibleProps;
    render(
      <Collapsible {...props} label="Details">
        Content
      </Collapsible>,
    );

    expect(screen.getByRole('button', { name: 'Details' })).not.toHaveClass('custom');
    expect(screen.getByRole('button', { name: 'Details' })).not.toHaveAttribute('style');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UiKitProvider, type LinkComponentProps } from '../../provider';
import { Button, type ButtonProps } from './Button';

describe('Button', () => {
  it('renders a native button with the default variant and size', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
  });

  it('applies the variant and size', () => {
    render(
      <Button variant="secondary" size="lg">
        Save
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('stays focusable when disabled with focusableWhenDisabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled focusableWhenDisabled onClick={onClick}>
        Save
      </Button>,
    );

    await userEvent.tab();
    const button = screen.getByRole('button');
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-disabled', 'true');

    await userEvent.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as ButtonProps;
    render(<Button {...props}>Save</Button>);

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('custom');
    expect(button).not.toHaveAttribute('style');
  });

  describe('with href', () => {
    it('renders a native link', () => {
      render(<Button href="/settings">Settings</Button>);

      const link = screen.getByRole('link', { name: 'Settings' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/settings');
      expect(link).toHaveAttribute('data-variant', 'primary');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders a disabled link without href', () => {
      render(
        <Button href="/settings" disabled>
          Settings
        </Button>,
      );

      const link = screen.getByRole('link', { name: 'Settings' });
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-disabled');
    });

    it('renders the link component configured in UiKitProvider', () => {
      const RouterLink = vi.fn((props: LinkComponentProps) => <a {...props} data-router="" />);
      render(
        <UiKitProvider linkComponent={RouterLink}>
          <Button href="/settings" target="_blank">
            Settings
          </Button>
        </UiKitProvider>,
      );

      const link = screen.getByRole('link', { name: 'Settings' });
      expect(link).toHaveAttribute('data-router');
      expect(link).toHaveAttribute('href', '/settings');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.className).not.toBe('');
    });

    it('does not use the configured link component when disabled', () => {
      const RouterLink = vi.fn((props: LinkComponentProps) => <a {...props} />);
      render(
        <UiKitProvider linkComponent={RouterLink}>
          <Button href="/settings" disabled>
            Settings
          </Button>
        </UiKitProvider>,
      );

      expect(RouterLink).not.toHaveBeenCalled();
      expect(screen.getByRole('link')).not.toHaveAttribute('href');
    });
  });
});

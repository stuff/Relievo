import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArrowRightIcon, PlusIcon } from '@phosphor-icons/react';
import { describe, expect, it, vi } from 'vitest';
import { RelievoProvider, type LinkComponentProps } from '../../provider';
import { Button, type ButtonProps } from './Button';

describe('Button', () => {
  it('renders a native button, solid, neutral and md by default', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'solid');
    expect(button).toHaveAttribute('data-tone', 'neutral');
    expect(button).toHaveAttribute('data-size', 'md');
  });

  it('applies the variant, tone and size', () => {
    render(
      <Button variant="link" tone="danger" size="lg">
        Delete
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveAttribute('data-variant', 'link');
    expect(button).toHaveAttribute('data-tone', 'danger');
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

  it('renders icons around the label, hidden from assistive technologies', () => {
    render(
      <Button
        startIcon={<PlusIcon data-testid="start" />}
        endIcon={<ArrowRightIcon data-testid="end" />}
      >
        Add
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Add' });
    const [start, label, end] = Array.from(button.childNodes);
    expect(start).toContainElement(screen.getByTestId('start'));
    expect(label).toHaveTextContent('Add');
    expect(end).toContainElement(screen.getByTestId('end'));
    expect(start).toHaveAttribute('aria-hidden', 'true');
    expect(end).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders Phosphor icons in bold, unless the icon sets its own weight', () => {
    const { container: bold } = render(<PlusIcon weight="bold" />);
    const { container: regular } = render(<PlusIcon weight="regular" />);
    render(
      <>
        <Button startIcon={<PlusIcon data-testid="default" />}>Add</Button>
        <Button startIcon={<PlusIcon data-testid="explicit" weight="regular" />}>Add</Button>
      </>,
    );

    expect(screen.getByTestId('default').innerHTML).toBe(bold.querySelector('svg')!.innerHTML);
    expect(screen.getByTestId('explicit').innerHTML).toBe(regular.querySelector('svg')!.innerHTML);
  });

  it('renders icons in links too', () => {
    render(
      <Button href="/new" startIcon={<PlusIcon data-testid="start" />}>
        New
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'New' })).toContainElement(screen.getByTestId('start'));
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
      expect(link).toHaveAttribute('data-variant', 'solid');
      expect(link).toHaveAttribute('data-tone', 'neutral');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('applies the variant and tone, enabled or disabled', () => {
      render(
        <>
          <Button href="/new" tone="accent">
            New
          </Button>
          <Button href="/old" variant="link" tone="warning" disabled>
            Old
          </Button>
        </>,
      );

      const enabled = screen.getByRole('link', { name: 'New' });
      expect(enabled).toHaveAttribute('data-variant', 'solid');
      expect(enabled).toHaveAttribute('data-tone', 'accent');
      const disabled = screen.getByRole('link', { name: 'Old' });
      expect(disabled).toHaveAttribute('data-variant', 'link');
      expect(disabled).toHaveAttribute('data-tone', 'warning');
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

    it('renders the link component configured in RelievoProvider', () => {
      const RouterLink = vi.fn((props: LinkComponentProps) => <a {...props} data-router="" />);
      render(
        <RelievoProvider linkComponent={RouterLink}>
          <Button href="/settings" target="_blank">
            Settings
          </Button>
        </RelievoProvider>,
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
        <RelievoProvider linkComponent={RouterLink}>
          <Button href="/settings" disabled>
            Settings
          </Button>
        </RelievoProvider>,
      );

      expect(RouterLink).not.toHaveBeenCalled();
      expect(screen.getByRole('link')).not.toHaveAttribute('href');
    });
  });
});

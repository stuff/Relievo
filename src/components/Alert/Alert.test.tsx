import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClockIcon } from '@phosphor-icons/react';
import { describe, expect, it, vi } from 'vitest';
import { Alert, type AlertProps } from './Alert';

describe('Alert', () => {
  it('renders its message', () => {
    render(<Alert>The scan failed.</Alert>);

    expect(screen.getByText('The scan failed.')).toBeInTheDocument();
  });

  it('is neutral by default', () => {
    const { container } = render(<Alert>Something.</Alert>);

    expect(container.firstElementChild).toHaveAttribute('data-tone', 'neutral');
  });

  it('carries its tone as an attribute', () => {
    const { container } = render(<Alert tone="danger">Something.</Alert>);

    expect(container.firstElementChild).toHaveAttribute('data-tone', 'danger');
  });

  it('shows the title above the message', () => {
    render(
      <Alert tone="danger" title="The scan failed">
        Timeout on the job board.
      </Alert>,
    );

    expect(screen.getByText('The scan failed')).toBeInTheDocument();
    expect(screen.getByText('Timeout on the job board.')).toBeInTheDocument();
  });

  it('has no title element without the prop', () => {
    const { container } = render(<Alert>Something.</Alert>);

    expect(container.querySelector('p')).toBeNull();
  });

  it('shows an icon for each tone, hidden from screen readers', () => {
    const { container } = render(<Alert tone="success">Saved.</Alert>);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.closest('[aria-hidden]')).not.toBeNull();
  });

  it('replaces the tone icon with the one given', () => {
    const { container } = render(
      <Alert tone="warning" icon={<ClockIcon data-testid="clock" />}>
        Overdue.
      </Alert>,
    );

    expect(screen.getByTestId('clock')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('removes the icon with icon={false}', () => {
    const { container } = render(
      <Alert tone="warning" icon={false}>
        Overdue.
      </Alert>,
    );

    expect(container.querySelector('svg')).toBeNull();
  });

  it('has no close button without onClose', () => {
    render(<Alert>Something.</Alert>);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onClose with no argument when the close button is pressed', async () => {
    // onClose is often a server action or a setState: the click event must not reach it
    const onClose = vi.fn();
    render(<Alert onClose={onClose}>Something.</Alert>);

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledWith();
  });

  it('names the close button with closeLabel', () => {
    render(
      <Alert onClose={() => {}} closeLabel="Dismiss this message">
        Something.
      </Alert>,
    );

    expect(screen.getByRole('button', { name: 'Dismiss this message' })).toBeInTheDocument();
  });

  it('is not a live region by default', () => {
    const { container } = render(<Alert tone="danger">Something.</Alert>);

    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('announces a live problem at once', () => {
    render(
      <Alert tone="danger" live>
        Could not save.
      </Alert>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not save.');
  });

  it('announces a live message of another tone politely', () => {
    render(
      <Alert tone="success" live>
        Saved.
      </Alert>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Saved.');
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as AlertProps;
    const { container } = render(<Alert {...props}>Something.</Alert>);

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

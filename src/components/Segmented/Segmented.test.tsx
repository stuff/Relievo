import { CalendarIcon } from '@phosphor-icons/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Segmented, type SegmentedProps } from './Segmented';

function Period(props: Partial<SegmentedProps>) {
  return (
    <Segmented label="Period" {...props}>
      <Segmented.Item value="day">Day</Segmented.Item>
      <Segmented.Item value="week">Week</Segmented.Item>
      <Segmented.Item value="month">Month</Segmented.Item>
    </Segmented>
  );
}

describe('Segmented', () => {
  it('renders a named radio group with the default size', () => {
    render(<Period />);

    const group = screen.getByRole('radiogroup', { name: 'Period' });
    expect(group).toHaveAttribute('data-size', 'md');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('applies the size', () => {
    render(<Period size="lg" />);

    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-size', 'lg');
  });

  it('starts with no choice without a default value', () => {
    render(<Period />);

    for (const item of screen.getAllByRole('radio')) {
      expect(item).not.toBeChecked();
    }
  });

  it('chooses one item at a time, reporting a single value', async () => {
    const onValueChange = vi.fn();
    render(<Period onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Day' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Month' }));

    expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('month', expect.anything());
  });

  it('keeps the chosen item when it is clicked again', async () => {
    render(<Period defaultValue="week" />);

    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));

    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('selects with the arrow keys', async () => {
    render(<Period defaultValue="day" />);

    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('renders the value prop when controlled, and only reports changes', async () => {
    const onValueChange = vi.fn();
    render(<Period value="day" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Month' }));

    expect(onValueChange).toHaveBeenCalledWith('month', expect.anything());
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
  });

  it('follows the value prop when the parent updates it', async () => {
    function Controlled() {
      const [value, setValue] = useState('day');
      return <Period value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);

    await userEvent.click(screen.getByRole('radio', { name: 'Month' }));

    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
  });

  it('submits the chosen value with a form under its name', () => {
    const { container } = render(
      <form>
        <Period name="period" defaultValue="week" />
      </form>,
    );

    expect(new FormData(container.querySelector('form')!).get('period')).toBe('week');
  });

  it('disables every item', () => {
    render(<Period disabled />);

    for (const item of screen.getAllByRole('radio')) {
      expect(item).toHaveAttribute('aria-disabled', 'true');
    }
  });

  it('disables a single item', async () => {
    render(
      <Segmented label="Period" defaultValue="day">
        <Segmented.Item value="day">Day</Segmented.Item>
        <Segmented.Item value="week" disabled>
          Week
        </Segmented.Item>
      </Segmented>,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));

    expect(screen.getByRole('radio', { name: 'Week' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
  });

  it('renders item icons hidden from assistive technologies', () => {
    render(
      <Segmented label="Period">
        <Segmented.Item value="week" startIcon={<CalendarIcon data-testid="icon" />}>
          Week
        </Segmented.Item>
      </Segmented>,
    );

    expect(screen.getByRole('radio', { name: 'Week' })).toContainElement(screen.getByTestId('icon'));
    expect(screen.getByTestId('icon').closest('[aria-hidden]')).toBeInTheDocument();
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as SegmentedProps;
    const { container } = render(<Period {...props} />);

    // The hidden <input> Base UI renders for forms has its own inline style: check our elements only
    const group = screen.getByRole('radiogroup');
    expect(container.querySelector('.custom')).toBeNull();
    expect(group).not.toHaveAttribute('style');
    for (const item of screen.getAllByRole('radio')) {
      expect(item).not.toHaveAttribute('style');
    }
  });
});

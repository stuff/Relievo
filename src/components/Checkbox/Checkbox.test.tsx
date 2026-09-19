import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, type CheckboxProps } from './Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox named by its label, unticked by default', () => {
    render(<Checkbox label="Remember me" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Remember me' });
    expect(checkbox).not.toBeChecked();
    expect(screen.getByText('Remember me')).toBeVisible();
  });

  describe('uncontrolled', () => {
    it('starts from defaultChecked, then toggles on its own', async () => {
      const onCheckedChange = vi.fn();
      render(<Checkbox label="Remember me" defaultChecked onCheckedChange={onCheckedChange} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();

      await userEvent.click(checkbox);

      expect(checkbox).not.toBeChecked();
      expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it('toggles when the label is clicked', async () => {
      render(<Checkbox label="Remember me" />);

      await userEvent.click(screen.getByText('Remember me'));

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('toggles with the space key', async () => {
      render(<Checkbox label="Remember me" />);

      await userEvent.tab();
      expect(screen.getByRole('checkbox')).toHaveFocus();
      await userEvent.keyboard(' ');

      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('controlled', () => {
    it('renders the checked prop and only reports changes', async () => {
      const onCheckedChange = vi.fn();
      render(<Checkbox label="Remember me" checked={false} onCheckedChange={onCheckedChange} />);

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
      expect(checkbox).not.toBeChecked();
    });

    it("follows the parent's update", async () => {
      function Controlled() {
        const [checked, setChecked] = useState(false);
        return <Checkbox label="Remember me" checked={checked} onCheckedChange={setChecked} />;
      }
      render(<Controlled />);

      await userEvent.click(screen.getByRole('checkbox'));

      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  it('announces the indeterminate state as mixed', () => {
    render(<Checkbox label="Select all" indeterminate />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('does not toggle when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Remember me" disabled onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('describes the checkbox with the helper text', () => {
    render(<Checkbox label="Newsletter" helperText="One email a month." />);

    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('One email a month.');
  });

  it('renders no helper text element without helperText', () => {
    const { container } = render(<Checkbox label="Newsletter" />);

    expect(container.querySelector('p')).toBeNull();
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-describedby');
  });

  it('shows the error state on the checkbox, label and helper text', () => {
    render(<Checkbox label="I accept the terms" error helperText="Accept the terms to continue." />);

    const checkbox = screen.getByRole('checkbox', { name: 'I accept the terms' });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('data-invalid');
    expect(screen.getByText('I accept the terms')).toHaveAttribute('data-invalid');
    expect(screen.getByText('Accept the terms to continue.')).toHaveAttribute('data-invalid');
  });

  it('is valid by default', () => {
    render(<Checkbox label="I accept the terms" helperText="Required." />);

    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByText('I accept the terms')).not.toHaveAttribute('data-invalid');
    expect(screen.getByText('Required.')).not.toHaveAttribute('data-invalid');
  });

  it('submits its value with a form when ticked', () => {
    render(
      <form data-testid="form">
        <Checkbox label="Newsletter" name="newsletter" value="yes" defaultChecked />
      </form>,
    );

    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('newsletter')).toBe('yes');
  });

  it('keeps a hidden label for screen readers', () => {
    render(<Checkbox label="Select row" hideLabel />);

    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument();
    expect(screen.getByText('Select row')).toHaveAttribute('data-hidden');
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as CheckboxProps;
    const { container } = render(<Checkbox {...props} label="Remember me" />);

    // Base UI's hidden <input> carries its own inline style: check the elements we render
    for (const element of [container.firstElementChild!, screen.getByRole('checkbox')]) {
      expect(element).not.toHaveClass('custom');
      expect(element).not.toHaveAttribute('style');
    }
  });
});

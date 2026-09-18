import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { EnvelopeIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { describe, expect, it, vi } from 'vitest';
import { Input, type InputProps } from './Input';

describe('Input', () => {
  it('renders a text input named by its label', () => {
    render(<Input label="Name" />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('type', 'text');
  });

  it('focuses the input when the label is clicked', async () => {
    render(<Input label="Name" />);

    await userEvent.click(screen.getByText('Name'));

    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('marks the label as focused while the input has focus', async () => {
    render(<Input label="Name" />);
    const label = screen.getByText('Name');

    expect(label).not.toHaveAttribute('data-focused');
    await userEvent.click(screen.getByRole('textbox'));
    expect(label).toHaveAttribute('data-focused');
    await userEvent.tab();
    expect(label).not.toHaveAttribute('data-focused');
  });

  it('keeps the label linked when an id is passed', () => {
    render(<Input label="Email" id="email" type="email" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('keeps a hidden label as the accessible name', () => {
    render(<Input label="Search" hideLabel type="search" />);

    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByText('Search').tagName).toBe('LABEL');
    expect(screen.getByText('Search')).toHaveAttribute('data-hidden');
  });

  it('shows the label by default', () => {
    render(<Input label="Name" />);

    expect(screen.getByText('Name')).not.toHaveAttribute('data-hidden');
  });

  it('reports typed values through onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<Input label="Name" onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'Jo');

    expect(onValueChange).toHaveBeenLastCalledWith('Jo', expect.anything());
  });

  it('uses defaultValue as the initial value when uncontrolled', async () => {
    render(<Input label="Name" defaultValue="Jane" />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 's');

    expect(input).toHaveValue('Janes');
  });

  it('renders the value prop when controlled', async () => {
    const onValueChange = vi.fn();
    render(<Input label="Name" value="Jane" onValueChange={onValueChange} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 's');

    expect(onValueChange).toHaveBeenCalledWith('Janes', expect.anything());
    expect(input).toHaveValue('Jane');
  });

  it('follows the value prop when the parent updates it', async () => {
    function ControlledInput() {
      const [value, setValue] = useState('');
      return <Input label="Name" value={value} onValueChange={(next) => setValue(next.toUpperCase())} />;
    }
    render(<ControlledInput />);

    await userEvent.type(screen.getByRole('textbox'), 'jo');

    expect(screen.getByRole('textbox')).toHaveValue('JO');
  });

  it('cannot be edited when disabled', async () => {
    render(<Input label="Name" disabled defaultValue="Jane" />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'x');

    expect(input).toBeDisabled();
    expect(input).toHaveValue('Jane');
    expect(screen.getByText('Name')).toHaveAttribute('data-disabled');
  });

  it('shows the error state on the input, label and helper text', () => {
    render(<Input label="Email" error helperText="Enter a valid email." />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInvalid();
    expect(input).toHaveAttribute('data-invalid');
    expect(screen.getByText('Email')).toHaveAttribute('data-invalid');
    expect(screen.getByText('Enter a valid email.')).toHaveAttribute('data-invalid');
  });

  it('is valid by default', () => {
    render(<Input label="Email" helperText="We never share it." />);

    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByText('Email')).not.toHaveAttribute('data-invalid');
    expect(screen.getByText('We never share it.')).not.toHaveAttribute('data-invalid');
  });

  it('describes the input with the helper text', () => {
    render(<Input label="Email" helperText="We never share it." />);

    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('We never share it.');
  });

  it('renders no helper text element without helperText', () => {
    const { container } = render(<Input label="Email" />);

    expect(container.querySelector('p')).toBeNull();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  describe('icons and affixes', () => {
    it('renders them in order around the input', () => {
      const { container } = render(
        <Input
          label="Email"
          startIcon={<EnvelopeIcon data-testid="start" />}
          prefix="to:"
          suffix="@acme.com"
          endIcon={<MagnifyingGlassIcon data-testid="end" />}
        />,
      );

      const control = container.querySelector('input')!.parentElement!;
      const order = Array.from(control.children).map((child) =>
        child.tagName === 'INPUT' ? 'input' : child.textContent || child.querySelector('svg')?.dataset.testid,
      );
      expect(order).toEqual(['start', 'to:', 'input', '@acme.com', 'end']);
    });

    it('hides icons from assistive technologies', () => {
      render(<Input label="Search" startIcon={<MagnifyingGlassIcon data-testid="icon" />} />);

      expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('announces the prefix and suffix with the helper text', () => {
      render(<Input label="Price" prefix="$" suffix="USD" helperText="Tax included." />);

      expect(screen.getByRole('textbox', { name: 'Price' })).toHaveAccessibleDescription(
        '$ USD Tax included.',
      );
    });

    it('focuses the input when an affix is clicked', async () => {
      render(<Input label="Weight" suffix="kg" />);

      await userEvent.click(screen.getByText('kg'));

      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('does not focus a disabled input when an affix is clicked', async () => {
      render(<Input label="Weight" suffix="kg" disabled />);

      await userEvent.click(screen.getByText('kg'));

      expect(screen.getByRole('textbox')).not.toHaveFocus();
    });
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as InputProps;
    const { container } = render(<Input {...props} label="Name" />);

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

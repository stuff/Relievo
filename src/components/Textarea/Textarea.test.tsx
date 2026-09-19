import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea, type TextareaProps } from './Textarea';

describe('Textarea', () => {
  it('renders a multi-line text field named by its label, four lines high by default', () => {
    render(<Textarea label="Notes" />);

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('takes the number of rows and native props', () => {
    render(<Textarea label="Notes" rows={10} name="notes" placeholder="Anything else?" maxLength={500} />);

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toHaveAttribute('rows', '10');
    expect(textarea).toHaveAttribute('name', 'notes');
    expect(textarea).toHaveAttribute('placeholder', 'Anything else?');
    expect(textarea).toHaveAttribute('maxlength', '500');
  });

  it('focuses the textarea when the label is clicked', async () => {
    render(<Textarea label="Notes" />);

    await userEvent.click(screen.getByText('Notes'));

    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('marks the label as focused while the textarea has focus', async () => {
    render(<Textarea label="Notes" />);
    const label = screen.getByText('Notes');

    await userEvent.click(screen.getByRole('textbox'));
    expect(label).toHaveAttribute('data-focused');
    await userEvent.tab();
    expect(label).not.toHaveAttribute('data-focused');
  });

  it('keeps a hidden label as the accessible name', () => {
    render(<Textarea label="Notes" hideLabel />);

    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument();
    expect(screen.getByText('Notes')).toHaveAttribute('data-hidden');
  });

  it('keeps line breaks in the value', async () => {
    const onValueChange = vi.fn();
    render(<Textarea label="Notes" onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'a{Enter}b');

    expect(onValueChange).toHaveBeenLastCalledWith('a\nb', expect.anything());
  });

  it('uses defaultValue as the initial value when uncontrolled', async () => {
    render(<Textarea label="Notes" defaultValue="First" />);

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 's');

    expect(textarea).toHaveValue('Firsts');
  });

  it('renders the value prop when controlled, and only reports edits', async () => {
    const onValueChange = vi.fn();
    render(<Textarea label="Notes" value="First" onValueChange={onValueChange} />);

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 's');

    expect(onValueChange).toHaveBeenCalledWith('Firsts', expect.anything());
    expect(textarea).toHaveValue('First');
  });

  it('follows the value prop when the parent updates it', async () => {
    function ControlledTextarea() {
      const [value, setValue] = useState('');
      return (
        <Textarea label="Notes" value={value} onValueChange={(next) => setValue(next.toUpperCase())} />
      );
    }
    render(<ControlledTextarea />);

    await userEvent.type(screen.getByRole('textbox'), 'jo');

    expect(screen.getByRole('textbox')).toHaveValue('JO');
  });

  it('cannot be edited when disabled', async () => {
    render(<Textarea label="Notes" disabled defaultValue="First" />);

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'x');

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveValue('First');
    expect(screen.getByText('Notes')).toHaveAttribute('data-disabled');
  });

  it('shows the error state on the textarea, label and helper text', () => {
    render(<Textarea label="Notes" error helperText="Write at least 50 characters." />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInvalid();
    expect(screen.getByText('Notes')).toHaveAttribute('data-invalid');
    expect(screen.getByText('Write at least 50 characters.')).toHaveAttribute('data-invalid');
  });

  it('is valid by default', () => {
    render(<Textarea label="Notes" />);

    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('describes the textarea with the helper text', () => {
    render(<Textarea label="Notes" helperText="Only you can see them." />);

    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Only you can see them.');
  });

  it('submits its value with the form under its name', async () => {
    const { container } = render(
      <form>
        <Textarea label="Notes" name="notes" defaultValue="First" />
      </form>,
    );

    await userEvent.type(screen.getByRole('textbox'), '!');

    expect(new FormData(container.querySelector('form')!).get('notes')).toBe('First!');
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as TextareaProps;
    const { container } = render(<Textarea {...props} label="Notes" />);

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

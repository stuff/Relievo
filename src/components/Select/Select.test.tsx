import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select, type SelectProps } from './Select';

function Countries(props: Partial<Extract<SelectProps, { options?: never }>>) {
  return (
    <Select label="Country" placeholder="Choose a country" {...props}>
      <Select.Item value="fr">France</Select.Item>
      <Select.Item value="de">Germany</Select.Item>
      <Select.Item value="it" disabled>
        Italy
      </Select.Item>
    </Select>
  );
}

describe('Select', () => {
  it('renders a field named by its label, showing the placeholder', () => {
    render(<Countries />);

    const trigger = screen.getByRole('combobox', { name: 'Country' });
    expect(trigger).toHaveTextContent('Choose a country');
  });

  it("shows the chosen option's label before the list has opened", () => {
    render(<Countries defaultValue="de" />);

    expect(screen.getByRole('combobox')).toHaveTextContent('Germany');
  });

  describe('uncontrolled', () => {
    it('opens on click and chooses an option', async () => {
      const onValueChange = vi.fn();
      render(<Countries onValueChange={onValueChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(await screen.findByRole('option', { name: 'France' }));

      expect(screen.getByRole('combobox')).toHaveTextContent('France');
      expect(onValueChange).toHaveBeenCalledWith('fr', expect.anything());
    });

    it('does not choose a disabled option', async () => {
      const onValueChange = vi.fn();
      render(<Countries onValueChange={onValueChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      const italy = await screen.findByRole('option', { name: 'Italy' });
      expect(italy).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(italy);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('controlled', () => {
    it('renders the value prop and only reports changes', async () => {
      const onValueChange = vi.fn();
      render(<Countries value="fr" onValueChange={onValueChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(await screen.findByRole('option', { name: 'Germany' }));

      expect(onValueChange).toHaveBeenCalledWith('de', expect.anything());
      expect(screen.getByRole('combobox')).toHaveTextContent('France');
    });

    it("follows the parent's update", async () => {
      function Controlled() {
        const [value, setValue] = useState<string | null>('fr');
        return <Countries value={value} onValueChange={setValue} />;
      }
      render(<Controlled />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(await screen.findByRole('option', { name: 'Germany' }));

      expect(screen.getByRole('combobox')).toHaveTextContent('Germany');
    });

    it('opens from the open prop and reports open changes', async () => {
      const onOpenChange = vi.fn();
      render(<Countries open onOpenChange={onOpenChange} />);

      expect(await screen.findByRole('listbox')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');

      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('does not open when disabled', async () => {
    render(<Countries disabled />);

    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('data-disabled');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('describes the field with the helper text', () => {
    render(<Countries helperText="Where we ship your order." />);

    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Where we ship your order.');
  });

  it('shows the error state on the field, label and helper text', () => {
    render(<Countries error helperText="Choose a country." />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Country')).toHaveAttribute('data-invalid');
    expect(screen.getByText('Choose a country.')).toHaveAttribute('data-invalid');
  });

  it('keeps a hidden label for screen readers', () => {
    render(<Countries hideLabel />);

    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
    expect(screen.getByText('Country')).toHaveAttribute('data-hidden');
  });

  it('submits the chosen value with a form', () => {
    render(
      <form data-testid="form">
        <Countries name="country" defaultValue="de" />
      </form>,
    );

    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('country')).toBe('de');
  });

  describe('with groups', () => {
    function Grouped(props: Partial<Extract<SelectProps, { options?: never }>>) {
      return (
        <Select label="Country" {...props}>
          <Select.Group label="Europe">
            <Select.Item value="fr">France</Select.Item>
            <Select.Item value="de">Germany</Select.Item>
          </Select.Group>
          <Select.Group label="Asia">
            <Select.Item value="jp">Japan</Select.Item>
          </Select.Group>
        </Select>
      );
    }

    it('names each group after its label and keeps its options inside', async () => {
      render(<Grouped />);

      await userEvent.click(screen.getByRole('combobox'));
      const europe = await screen.findByRole('group', { name: 'Europe' });
      const asia = screen.getByRole('group', { name: 'Asia' });

      expect(europe).toContainElement(screen.getByRole('option', { name: 'France' }));
      expect(asia).toContainElement(screen.getByRole('option', { name: 'Japan' }));
    });

    it('shows the label of an option chosen inside a group', async () => {
      render(<Grouped />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(await screen.findByRole('option', { name: 'Japan' }));

      expect(screen.getByRole('combobox')).toHaveTextContent('Japan');
      expect(screen.getByRole('combobox')).not.toHaveTextContent('jp');
    });

    it("shows the chosen option's label from inside a group before opening", () => {
      render(<Grouped defaultValue="jp" />);

      expect(screen.getByRole('combobox')).toHaveTextContent('Japan');
    });
  });

  describe('with options', () => {
    const countries = [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
      { value: 'it', label: 'Italy', disabled: true },
    ];

    it('renders the options of the array', async () => {
      const onValueChange = vi.fn();
      render(<Select label="Country" options={countries} defaultValue="fr" onValueChange={onValueChange} />);

      expect(screen.getByRole('combobox')).toHaveTextContent('France');
      await userEvent.click(screen.getByRole('combobox'));
      expect(await screen.findByRole('option', { name: 'Italy' })).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(screen.getByRole('option', { name: 'Germany' }));

      expect(onValueChange).toHaveBeenCalledWith('de', expect.anything());
      expect(screen.getByRole('combobox')).toHaveTextContent('Germany');
    });

    it('does not accept options and children together', () => {
      // Type-level check: typecheck fails if this becomes valid
      const both = (
        // @ts-expect-error options and children are exclusive
        <Select label="Country" options={countries}>
          <Select.Item value="fr">France</Select.Item>
        </Select>
      );

      expect(both).toBeDefined();
    });
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as object;
    const { container } = render(<Countries {...props} />);

    for (const element of [container.firstElementChild!, screen.getByRole('combobox')]) {
      expect(element).not.toHaveClass('custom');
      expect(element).not.toHaveAttribute('style');
    }
  });
});

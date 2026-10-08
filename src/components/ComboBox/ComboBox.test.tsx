import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ComboBox, type ComboBoxProps } from './ComboBox';

const countries = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy', disabled: true },
  { value: 'es', label: 'Spain' },
];

type SingleProps = Partial<Extract<ComboBoxProps, { multiple?: false }>>;
type MultipleProps = Partial<Extract<ComboBoxProps, { multiple: true }>>;

function Countries(props: SingleProps) {
  return <ComboBox label="Country" placeholder="Search a country" options={countries} {...props} />;
}

function ManyCountries(props: MultipleProps) {
  return <ComboBox label="Countries" options={countries} multiple {...props} />;
}

const field = () => screen.getByRole('combobox', { name: /^Countr/ });
// The chips' text. While the list is open, Base UI hides the rest of the page from screen readers:
// the chips are found among hidden elements too.
const chips = () =>
  screen
    .queryAllByRole('button', { name: /^Remove /, hidden: true })
    .map((button) => button.parentElement!.textContent);

describe('ComboBox', () => {
  it('renders an input named by its label, showing the placeholder', () => {
    render(<Countries />);

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveAttribute(
      'placeholder',
      'Search a country',
    );
  });

  it('filters the options as you type', async () => {
    render(<Countries />);

    await userEvent.type(field(), 'ger');

    expect(await screen.findByRole('option', { name: 'Germany' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'France' })).not.toBeInTheDocument();
  });

  it('says when no option matches', async () => {
    render(<Countries emptyText="No country found" />);

    await userEvent.type(field(), 'xyz');

    expect(await screen.findByText('No country found')).toBeInTheDocument();
  });

  it('opens from the round button', async () => {
    render(<Countries />);

    const trigger = screen.getByRole('button', { name: 'Country' });
    expect(trigger).toHaveAttribute('tabindex', '-1');
    await userEvent.click(trigger);

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
  });

  it('does not choose a disabled option', async () => {
    const onValueChange = vi.fn();
    render(<Countries onValueChange={onValueChange} />);

    await userEvent.click(field());
    const italy = await screen.findByRole('option', { name: 'Italy' });
    expect(italy).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(italy);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  describe('one value', () => {
    describe('uncontrolled', () => {
      it("shows the default option's label in the field", () => {
        render(<Countries defaultValue="de" />);

        expect(field()).toHaveValue('Germany');
      });

      it('chooses an option, fills the field and closes the list', async () => {
        const onValueChange = vi.fn();
        render(<Countries onValueChange={onValueChange} />);

        await userEvent.click(field());
        await userEvent.click(await screen.findByRole('option', { name: 'France' }));

        expect(field()).toHaveValue('France');
        expect(onValueChange).toHaveBeenCalledWith('fr', expect.anything());
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    describe('controlled', () => {
      it('renders the value prop and only reports changes', async () => {
        const onValueChange = vi.fn();
        render(<Countries value="fr" onValueChange={onValueChange} />);

        await userEvent.click(field());
        await userEvent.click(await screen.findByRole('option', { name: 'Germany' }));

        expect(onValueChange).toHaveBeenCalledWith('de', expect.anything());
        expect(field()).toHaveValue('France');
      });

      it("follows the parent's update", async () => {
        function Controlled() {
          const [value, setValue] = useState<string | null>('fr');
          return <Countries value={value} onValueChange={setValue} />;
        }
        render(<Controlled />);

        await userEvent.click(field());
        await userEvent.click(await screen.findByRole('option', { name: 'Germany' }));

        expect(field()).toHaveValue('Germany');
      });
    });
  });

  describe('several values', () => {
    describe('uncontrolled', () => {
      it('shows each default option as a chip', () => {
        render(<ManyCountries defaultValue={['fr', 'de']} />);

        expect(chips()).toEqual(['France', 'Germany']);
      });

      it('adds a chip for each choice and keeps the list open', async () => {
        const onValueChange = vi.fn();
        render(<ManyCountries onValueChange={onValueChange} />);

        await userEvent.click(field());
        await userEvent.click(await screen.findByRole('option', { name: 'France' }));
        await userEvent.click(screen.getByRole('option', { name: 'Spain' }));

        expect(chips()).toEqual(['France', 'Spain']);
        expect(onValueChange).toHaveBeenLastCalledWith(['fr', 'es'], expect.anything());
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      it('removes a chip with its button', async () => {
        const onValueChange = vi.fn();
        render(<ManyCountries defaultValue={['fr', 'de']} onValueChange={onValueChange} />);

        await userEvent.click(screen.getByRole('button', { name: 'Remove France' }));

        expect(chips()).toEqual(['Germany']);
        expect(onValueChange).toHaveBeenCalledWith(['de'], expect.anything());
      });

      it('removes the last chip with Backspace from an empty field', async () => {
        render(<ManyCountries defaultValue={['fr', 'de']} />);

        await userEvent.click(field());
        await userEvent.keyboard('{Backspace}');

        expect(chips()).toEqual(['France']);
      });

      it('shows the placeholder only while no option is chosen', async () => {
        render(<ManyCountries placeholder="Search a country" />);

        expect(field()).toHaveAttribute('placeholder', 'Search a country');
        await userEvent.click(field());
        await userEvent.click(await screen.findByRole('option', { name: 'France' }));

        expect(field()).not.toHaveAttribute('placeholder');
      });

      it('names the remove buttons with removeLabel', () => {
        render(<ManyCountries defaultValue={['fr']} removeLabel="Retirer" />);

        expect(screen.getByRole('button', { name: 'Retirer France' })).toBeInTheDocument();
      });
    });

    describe('controlled', () => {
      it('renders the value prop and only reports changes', async () => {
        const onValueChange = vi.fn();
        render(<ManyCountries value={['fr']} onValueChange={onValueChange} />);

        await userEvent.click(field());
        await userEvent.click(await screen.findByRole('option', { name: 'Germany' }));

        expect(onValueChange).toHaveBeenCalledWith(['fr', 'de'], expect.anything());
        expect(chips()).toEqual(['France']);
      });

      it("follows the parent's update", async () => {
        function Controlled() {
          const [value, setValue] = useState<string[]>(['fr']);
          return <ManyCountries value={value} onValueChange={setValue} />;
        }
        render(<Controlled />);

        await userEvent.click(screen.getByRole('button', { name: 'Remove France' }));

        expect(chips()).toEqual([]);
      });
    });

    it('submits every chosen value with a form', () => {
      render(
        <form data-testid="form">
          <ManyCountries name="countries" defaultValue={['fr', 'de']} />
        </form>,
      );

      const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
      expect(data.getAll('countries')).toEqual(['fr', 'de']);
    });
  });

  describe('open state', () => {
    it('opens from defaultOpen', async () => {
      render(<Countries defaultOpen />);

      expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });

    it('opens from the open prop and only reports open changes', async () => {
      const onOpenChange = vi.fn();
      render(<Countries open onOpenChange={onOpenChange} />);

      expect(await screen.findByRole('listbox')).toBeInTheDocument();
      await userEvent.click(field());
      await userEvent.keyboard('{Escape}');

      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('does not open when disabled', async () => {
    render(<Countries disabled />);

    expect(field()).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Country' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('describes the field with the helper text', () => {
    render(<Countries helperText="Where we ship your order." />);

    expect(field()).toHaveAccessibleDescription('Where we ship your order.');
  });

  it('shows the error state on the field, label and helper text', () => {
    render(<Countries error helperText="Choose a country." />);

    expect(field()).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Country')).toHaveAttribute('data-invalid');
    expect(screen.getByText('Choose a country.')).toHaveAttribute('data-invalid');
  });

  it('keeps a hidden label for screen readers', () => {
    render(<Countries hideLabel />);

    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
    expect(screen.getByText('Country')).toHaveAttribute('data-hidden');
  });

  describe('with groups', () => {
    const timeZones = [
      {
        label: 'Europe',
        options: [
          { value: 'paris', label: 'Paris' },
          { value: 'berlin', label: 'Berlin' },
        ],
      },
      { label: 'Asia', options: [{ value: 'tokyo', label: 'Tokyo' }] },
    ];

    it('names each group after its label and keeps its options inside', async () => {
      render(<ComboBox label="Time zone" options={timeZones} />);

      await userEvent.click(screen.getByRole('combobox'));
      const europe = await screen.findByRole('group', { name: 'Europe' });

      expect(within(europe).getByRole('option', { name: 'Paris' })).toBeInTheDocument();
      expect(
        within(screen.getByRole('group', { name: 'Asia' })).getByRole('option', { name: 'Tokyo' }),
      ).toBeInTheDocument();
    });

    it('shows the label of a default option from inside a group', () => {
      render(<ComboBox label="Time zone" options={timeZones} defaultValue="tokyo" />);

      expect(screen.getByRole('combobox')).toHaveValue('Tokyo');
    });
  });

  describe('theme of the list', () => {
    // The list is portalled out of its section: it must still open in the section's theme
    it.each(['light', 'dark'])(
      'opens in the theme of a %s section around the combobox',
      async (theme) => {
        render(
          <div data-theme={theme}>
            <Countries />
          </div>,
        );

        await userEvent.click(field());

        const themed = (await screen.findByRole('listbox')).closest('[data-theme]');
        expect(themed).toHaveAttribute('data-theme', theme);
        expect(themed).not.toContainElement(field());
      },
    );

    it('adds no theme when no section is themed, so the page theme applies', async () => {
      render(<Countries />);

      await userEvent.click(field());

      expect((await screen.findByRole('listbox')).closest('[data-theme]')).toBeNull();
    });
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as object;
    const { container } = render(<Countries {...props} />);

    for (const element of [container.firstElementChild!, field()]) {
      expect(element).not.toHaveClass('custom');
      expect(element).not.toHaveAttribute('style');
    }
  });
});

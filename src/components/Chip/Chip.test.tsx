import { StarIcon } from '@phosphor-icons/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Chip, type ChipProps } from './Chip';

// The chip root around its label text
const getChip = (text: string) => screen.getByText(text).parentElement!;

describe('Chip', () => {
  describe('static', () => {
    it('renders a non-interactive element with the default tone, variant and size', () => {
      render(<Chip>Draft</Chip>);

      const chip = getChip('Draft');
      expect(chip.tagName).toBe('SPAN');
      expect(chip).toHaveAttribute('data-tone', 'neutral');
      expect(chip).toHaveAttribute('data-variant', 'solid');
      expect(chip).toHaveAttribute('data-size', 'md');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('applies the tone, variant and size', () => {
      render(
        <Chip tone="danger" variant="outline" size="xs">
          Failed
        </Chip>,
      );

      const chip = getChip('Failed');
      expect(chip).toHaveAttribute('data-tone', 'danger');
      expect(chip).toHaveAttribute('data-variant', 'outline');
      expect(chip).toHaveAttribute('data-size', 'xs');
    });

    it('marks a disabled chip', () => {
      render(<Chip disabled>Archived</Chip>);

      expect(getChip('Archived')).toHaveAttribute('data-disabled');
    });

    it('renders icons hidden from assistive technologies', () => {
      render(<Chip startIcon={<StarIcon data-testid="icon" />}>Featured</Chip>);

      expect(screen.getByTestId('icon').closest('[aria-hidden]')).toBeInTheDocument();
    });
  });

  describe('selectable', () => {
    it('toggles when uncontrolled', async () => {
      const onPressedChange = vi.fn();
      render(<Chip onPressedChange={onPressedChange}>Vegan</Chip>);

      const chip = screen.getByRole('button', { name: 'Vegan' });
      expect(chip).toHaveAttribute('aria-pressed', 'false');

      await userEvent.click(chip);

      expect(chip).toHaveAttribute('aria-pressed', 'true');
      expect(chip).toHaveAttribute('data-pressed');
      expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it('starts selected with defaultPressed', () => {
      render(<Chip defaultPressed>Vegan</Chip>);

      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('renders the pressed prop when controlled, and only reports changes', async () => {
      const onPressedChange = vi.fn();
      render(
        <Chip pressed={false} onPressedChange={onPressedChange}>
          Vegan
        </Chip>,
      );

      await userEvent.click(screen.getByRole('button'));

      expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('follows the pressed prop when the parent updates it', async () => {
      function Controlled() {
        const [pressed, setPressed] = useState(false);
        return (
          <Chip pressed={pressed} onPressedChange={setPressed}>
            Vegan
          </Chip>
        );
      }
      render(<Controlled />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('cannot be toggled when disabled', async () => {
      const onPressedChange = vi.fn();
      render(
        <Chip disabled onPressedChange={onPressedChange}>
          Vegan
        </Chip>,
      );

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('button')).toBeDisabled();
      expect(onPressedChange).not.toHaveBeenCalled();
    });

    it('renders its icon, hidden from assistive technologies', () => {
      render(
        <Chip defaultPressed startIcon={<StarIcon data-testid="icon" />}>
          Favorites
        </Chip>,
      );

      expect(screen.getByRole('button', { name: 'Favorites' })).toContainElement(screen.getByTestId('icon'));
      expect(screen.getByTestId('icon').closest('[aria-hidden]')).toBeInTheDocument();
    });
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as ChipProps;
    const { container } = render(
      <>
        <Chip {...props}>Static</Chip>
        <Chip {...props} defaultPressed>
          Selectable
        </Chip>
      </>,
    );

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

describe('Chip.Group', () => {
  const options = (
    <>
      <Chip value="vegan">Vegan</Chip>
      <Chip value="gluten-free">Gluten free</Chip>
      <Chip value="halal">Halal</Chip>
    </>
  );

  describe('single choice (default)', () => {
    it('renders a named radio group', () => {
      render(<Chip.Group label="Diet">{options}</Chip.Group>);

      expect(screen.getByRole('radiogroup', { name: 'Diet' })).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('chooses one chip at a time, reporting a single value', async () => {
      const onValueChange = vi.fn();
      render(
        <Chip.Group label="Diet" onValueChange={onValueChange}>
          {options}
        </Chip.Group>,
      );

      await userEvent.click(screen.getByRole('radio', { name: 'Vegan' }));
      await userEvent.click(screen.getByRole('radio', { name: 'Halal' }));

      expect(screen.getByRole('radio', { name: 'Vegan' })).not.toBeChecked();
      expect(screen.getByRole('radio', { name: 'Halal' })).toBeChecked();
      expect(onValueChange).toHaveBeenLastCalledWith('halal', expect.anything());
    });

    it('keeps the chosen chip when it is clicked again', async () => {
      render(
        <Chip.Group label="Diet" defaultValue="vegan">
          {options}
        </Chip.Group>,
      );

      await userEvent.click(screen.getByRole('radio', { name: 'Vegan' }));

      expect(screen.getByRole('radio', { name: 'Vegan' })).toBeChecked();
    });

    it('selects with the arrow keys', async () => {
      render(
        <Chip.Group label="Diet" defaultValue="vegan">
          {options}
        </Chip.Group>,
      );

      await userEvent.tab();
      expect(screen.getByRole('radio', { name: 'Vegan' })).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('radio', { name: 'Gluten free' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Gluten free' })).toBeChecked();
    });

    it('renders the value prop when controlled, and only reports changes', async () => {
      const onValueChange = vi.fn();
      render(
        <Chip.Group label="Diet" value="vegan" onValueChange={onValueChange}>
          {options}
        </Chip.Group>,
      );

      await userEvent.click(screen.getByRole('radio', { name: 'Halal' }));

      expect(onValueChange).toHaveBeenCalledWith('halal', expect.anything());
      expect(screen.getByRole('radio', { name: 'Vegan' })).toBeChecked();
    });

    it('follows the value prop when the parent updates it', async () => {
      function Controlled() {
        const [value, setValue] = useState('vegan');
        return (
          <Chip.Group label="Diet" value={value} onValueChange={setValue}>
            {options}
          </Chip.Group>
        );
      }
      render(<Controlled />);

      await userEvent.click(screen.getByRole('radio', { name: 'Halal' }));

      expect(screen.getByRole('radio', { name: 'Halal' })).toBeChecked();
    });

    it('submits the chosen value with a form under its name', async () => {
      const { container } = render(
        <form>
          <Chip.Group label="Diet" name="diet" defaultValue="halal">
            {options}
          </Chip.Group>
        </form>,
      );

      const form = container.querySelector('form')!;
      expect(new FormData(form).get('diet')).toBe('halal');
    });

    it('disables every chip', () => {
      render(
        <Chip.Group label="Diet" disabled>
          {options}
        </Chip.Group>,
      );

      for (const chip of screen.getAllByRole('radio')) {
        expect(chip).toHaveAttribute('aria-disabled', 'true');
      }
    });
  });

  describe('multiple choice', () => {
    it('renders a named group of toggle buttons', () => {
      render(
        <Chip.Group label="Diet" multiple>
          {options}
        </Chip.Group>,
      );

      expect(screen.getByRole('group', { name: 'Diet' })).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('allows several selections', async () => {
      const onValueChange = vi.fn();
      render(
        <Chip.Group label="Diet" multiple onValueChange={onValueChange}>
          {options}
        </Chip.Group>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Vegan' }));
      await userEvent.click(screen.getByRole('button', { name: 'Halal' }));

      expect(onValueChange).toHaveBeenLastCalledWith(['vegan', 'halal'], expect.anything());
    });

    it('starts from defaultValue when uncontrolled', () => {
      render(
        <Chip.Group label="Diet" multiple defaultValue={['gluten-free']}>
          {options}
        </Chip.Group>,
      );

      expect(screen.getByRole('button', { name: 'Gluten free' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('renders the value prop when controlled, and only reports changes', async () => {
      const onValueChange = vi.fn();
      render(
        <Chip.Group label="Diet" multiple value={['vegan']} onValueChange={onValueChange}>
          {options}
        </Chip.Group>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Halal' }));

      expect(onValueChange).toHaveBeenCalledWith(['vegan', 'halal'], expect.anything());
      expect(screen.getByRole('button', { name: 'Halal' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('follows the value prop when the parent updates it', async () => {
      function Controlled() {
        const [value, setValue] = useState<string[]>([]);
        return (
          <Chip.Group label="Diet" multiple value={value} onValueChange={setValue}>
            {options}
          </Chip.Group>
        );
      }
      render(<Controlled />);

      await userEvent.click(screen.getByRole('button', { name: 'Vegan' }));

      expect(screen.getByRole('button', { name: 'Vegan' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('moves focus between chips with the arrow keys', async () => {
      render(
        <Chip.Group label="Diet" multiple>
          {options}
        </Chip.Group>,
      );

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Vegan' })).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Gluten free' })).toHaveFocus();
    });

    it('disables every chip', () => {
      render(
        <Chip.Group label="Diet" multiple disabled>
          {options}
        </Chip.Group>,
      );

      for (const chip of screen.getAllByRole('button')) {
        expect(chip).toBeDisabled();
      }
    });
  });
});

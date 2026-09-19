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
  function Diet(props: Partial<React.ComponentProps<typeof Chip.Group>>) {
    return (
      <Chip.Group label="Diet" {...props}>
        <Chip value="vegan">Vegan</Chip>
        <Chip value="gluten-free">Gluten free</Chip>
        <Chip value="halal">Halal</Chip>
      </Chip.Group>
    );
  }

  it('renders a named group of selectable chips', () => {
    render(<Diet />);

    expect(screen.getByRole('group', { name: 'Diet' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('allows a single selection by default', async () => {
    const onValueChange = vi.fn();
    render(<Diet onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Vegan' }));
    await userEvent.click(screen.getByRole('button', { name: 'Halal' }));

    expect(screen.getByRole('button', { name: 'Vegan' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Halal' })).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(['halal'], expect.anything());
  });

  it('allows several selections with multiple', async () => {
    const onValueChange = vi.fn();
    render(<Diet multiple onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Vegan' }));
    await userEvent.click(screen.getByRole('button', { name: 'Halal' }));

    expect(onValueChange).toHaveBeenLastCalledWith(['vegan', 'halal'], expect.anything());
  });

  it('starts from defaultValue when uncontrolled', () => {
    render(<Diet defaultValue={['gluten-free']} />);

    expect(screen.getByRole('button', { name: 'Gluten free' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders the value prop when controlled, and only reports changes', async () => {
    const onValueChange = vi.fn();
    render(<Diet value={['vegan']} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Halal' }));

    expect(onValueChange).toHaveBeenCalledWith(['halal'], expect.anything());
    expect(screen.getByRole('button', { name: 'Vegan' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Halal' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('follows the value prop when the parent updates it', async () => {
    function Controlled() {
      const [value, setValue] = useState<string[]>([]);
      return <Diet multiple value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);

    await userEvent.click(screen.getByRole('button', { name: 'Vegan' }));

    expect(screen.getByRole('button', { name: 'Vegan' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('moves focus between chips with the arrow keys', async () => {
    render(<Diet />);

    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Vegan' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Gluten free' })).toHaveFocus();
  });

  it('disables every chip', () => {
    render(<Diet disabled />);

    for (const chip of screen.getAllByRole('button')) {
      expect(chip).toBeDisabled();
    }
  });
});

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';

// The point of the shared table is that a tone looks the same wherever it appears. Asserting it
// here rather than in each component's tests is what keeps them from drifting apart again:
// Card used to give danger a cross and Alert an exclamation mark, and nothing caught it.

const icon = (container: HTMLElement) => container.querySelector('svg')?.outerHTML;

const perTone = (tone: 'info' | 'success' | 'warning' | 'danger') => [
  icon(render(<Alert tone={tone} title="A message" />).container),
  icon(
    render(
      <Card tone={tone}>
        <Card.Body>A card</Card.Body>
      </Card>,
    ).container,
  ),
  icon(render(<Chip tone={tone}>A chip</Chip>).container),
  icon(render(<Button tone={tone}>A button</Button>).container),
];

describe('tone icons', () => {
  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'draws the same %s icon in every component',
    (tone) => {
      const [alert, card, chip, button] = perTone(tone);

      expect(alert).toBeDefined();
      expect(card).toBe(alert);
      expect(chip).toBe(alert);
      expect(button).toBe(alert);
    },
  );

  it('gives each status tone an icon of its own', () => {
    const icons = (['info', 'success', 'warning', 'danger'] as const).map((tone) =>
      icon(render(<Chip tone={tone}>A chip</Chip>).container)!,
    );

    expect(new Set(icons).size).toBe(icons.length);
  });

  it('gives no icon to the tones that state nothing', () => {
    const { container: neutralAlert } = render(<Alert title="A remark" />);
    const { container: neutralChip } = render(<Chip>A tag</Chip>);
    const { container: accentChip } = render(<Chip tone="accent">A tag</Chip>);
    const { container: neutralButton } = render(<Button>Save</Button>);
    const { container: accentButton } = render(<Button tone="accent">Publish</Button>);
    const { container: accentCard } = render(
      <Card tone="accent">
        <Card.Body>A card</Card.Body>
      </Card>,
    );

    expect(neutralAlert.querySelector('svg')).toBeNull();
    expect(neutralChip.querySelector('svg')).toBeNull();
    expect(accentChip.querySelector('svg')).toBeNull();
    expect(neutralButton.querySelector('svg')).toBeNull();
    expect(accentButton.querySelector('svg')).toBeNull();
    expect(accentCard.querySelector('svg')).toBeNull();
  });
});

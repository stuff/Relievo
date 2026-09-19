import { useState } from 'react';
import {
  BellIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  InfoIcon,
  StarIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, type ChipSize, type ChipTone, type ChipVariant } from './Chip';

const tones: ChipTone[] = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'];
const variants: ChipVariant[] = ['solid', 'outline'];
const sizes: ChipSize[] = ['xs', 'sm', 'md', 'lg'];

// Story labels start with a capital: all-lowercase text sits visually high in a chip.
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const row = { display: 'flex', flexWrap: 'wrap', gap: 'var(--ui-space-2)', alignItems: 'center' } as const;
const stack = { display: 'grid', gap: 'var(--ui-space-4)' } as const;

const meta = {
  title: 'Components/Chip',
  component: Chip,
  subcomponents: { 'Chip.Group': Chip.Group },
  tags: ['autodocs'],
  args: {
    children: 'Chip',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={stack}>
      {variants.map((variant) => (
        <div key={variant} style={row}>
          {tones.map((tone) => (
            <Chip {...args} key={tone} tone={tone} variant={variant}>
              {capitalize(tone)}
            </Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {sizes.map((size) => (
        <Chip {...args} key={size} size={size} tone="primary" startIcon={<StarIcon />}>
          {size.toUpperCase()}
        </Chip>
      ))}
    </div>
  ),
};

/** Status chips: a tone and a matching icon, so the status does not rely on color alone. */
export const Statuses: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} tone="info" startIcon={<InfoIcon />}>
        In review
      </Chip>
      <Chip {...args} tone="success" startIcon={<CheckCircleIcon />}>
        Published
      </Chip>
      <Chip {...args} tone="warning" startIcon={<WarningIcon />}>
        Expires soon
      </Chip>
      <Chip {...args} tone="danger" startIcon={<XCircleIcon />}>
        Failed
      </Chip>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} disabled>
        Static
      </Chip>
      <Chip {...args} disabled defaultPressed={false}>
        Selectable
      </Chip>
      <Chip {...args} disabled defaultPressed variant="outline" tone="primary">
        Selected
      </Chip>
    </div>
  ),
};

/** A standalone chip becomes selectable with `defaultPressed` (uncontrolled)… */
export const Uncontrolled: Story = {
  args: { defaultPressed: false, children: 'Vegan', tone: 'primary', variant: 'outline' },
};

/** …or with `pressed` and `onPressedChange` (controlled). */
export const Controlled: Story = {
  render: function Render(args) {
    const [pressed, setPressed] = useState(true);

    return (
      <div style={{ ...stack, fontFamily: 'var(--ui-font-family)' }}>
        <Chip {...args} tone="primary" variant="outline" pressed={pressed} onPressedChange={setPressed}>
          Vegan
        </Chip>
        <span>
          pressed: <code>{String(pressed)}</code>
        </span>
      </div>
    );
  },
};

const diets = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'gluten-free', label: 'Gluten free' },
  { value: 'halal', label: 'Halal' },
];

/** Filters: any number of chips selected. Controlled here, in both variants and every size. */
export const GroupMultiple: Story = {
  render: function Render(args) {
    const [selection, setSelection] = useState<Record<string, string[]>>({});

    return (
      <div style={{ ...stack, fontFamily: 'var(--ui-font-family)' }}>
        {variants.map((variant) => (
          <div key={variant} style={{ display: 'grid', gap: 'var(--ui-space-3)' }}>
            <strong>{variant}</strong>
            {sizes.map((size) => {
              const key = `${variant}-${size}`;
              const value = selection[key] ?? ['vegan'];

              return (
                <div key={size} style={row}>
                  <Chip.Group
                    label={`Diet (${variant}, ${size})`}
                    value={value}
                    onValueChange={(next) => setSelection((current) => ({ ...current, [key]: next }))}
                  >
                    {diets.map((diet) => (
                      <Chip {...args} key={diet.value} value={diet.value} variant={variant} size={size}>
                        {diet.label}
                      </Chip>
                    ))}
                  </Chip.Group>
                  <code>{JSON.stringify(value)}</code>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
};

/** Each chip can carry its own icon, telling what it turns on. Selection shows through color and relief. */
export const GroupWithIcons: Story = {
  render: (args) => (
    <Chip.Group label="Notifications" defaultValue={['email']}>
      <Chip {...args} value="email" startIcon={<EnvelopeIcon />}>
        Email
      </Chip>
      <Chip {...args} value="push" startIcon={<BellIcon />}>
        Push
      </Chip>
      <Chip {...args} value="digest" startIcon={<StarIcon />}>
        Weekly digest
      </Chip>
    </Chip.Group>
  ),
};

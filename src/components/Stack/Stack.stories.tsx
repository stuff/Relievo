import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '../Box';
import { Stack } from './Stack';

// Stands for a child of the stack
const item: CSSProperties = {
  padding: 'var(--rv-space-2) var(--rv-space-3)',
  borderRadius: 'var(--rv-radius-sm)',
  background: 'color-mix(in oklab, var(--rv-color-primary-tint), transparent 80%)',
  color: 'var(--rv-color-text)',
  fontFamily: 'var(--rv-font-family)',
};

const items = ['Linen shirt', 'Canvas tote', 'Leather boots'];

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    children: items.map((name) => (
      <div key={name} style={item}>
        {name}
      </div>
    )),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '28rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A column with a `md` gap. */
export const Default: Story = {};

export const Row: Story = {
  args: { direction: 'row' },
};

/** `gap` on the spacing scale: `xs` (0.25rem), `sm` (0.5rem), `md` (1rem), `lg` (1.5rem). */
export const Gaps: Story = {
  render: (args) => (
    <Stack gap="lg">
      {(['xs', 'sm', 'md', 'lg'] as const).map((gap) => (
        <Stack key={gap} {...args} direction="row" gap={gap} />
      ))}
    </Stack>
  ),
};

/** `separator` draws a line between the children, in the middle of the gap. */
export const Separator: Story = {
  render: (args) => (
    <Stack gap="lg">
      <Box border padding="md">
        <Stack {...args} separator />
      </Box>
      <Box border padding="md">
        <Stack {...args} direction="row" separator />
      </Box>
    </Stack>
  ),
};

/**
 * `align` lines the children up across the axis: here a field and its button on the same middle
 * line, whatever their heights.
 */
export const Align: Story = {
  render: (args) => (
    <Stack gap="lg">
      {(['stretch', 'center', 'end'] as const).map((align) => (
        <Stack key={align} {...args} direction="row" align={align} gap="sm">
          <div style={{ ...item, paddingBlock: 'var(--rv-space-6)' }}>Tall</div>
          <div style={item}>{align}</div>
          <div style={item}>Short</div>
        </Stack>
      ))}
    </Stack>
  ),
};

/** `wrap` moves children to a new line when a row runs out of room. */
export const Wrap: Story = {
  args: {
    direction: 'row',
    gap: 'sm',
    wrap: true,
    children: [...items, 'Straw hat', 'Wool socks', 'Silk scarf', 'Denim jacket'].map((name) => (
      <div key={name} style={item}>
        {name}
      </div>
    )),
  },
};

/** `as="ul"`: a list whose children are `li`. Its separators are hidden list items. */
export const AsList: Story = {
  args: {
    as: 'ul',
    separator: true,
    gap: 'sm',
    children: items.map((name) => (
      <li key={name} style={{ fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' }}>
        {name}
      </li>
    )),
  },
};

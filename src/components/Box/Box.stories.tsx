import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';

// Stands for the content, so the padding shows around it
const content: CSSProperties = {
  padding: 'var(--rv-space-2) var(--rv-space-3)',
  borderRadius: 'var(--rv-radius-sm)',
  background: 'color-mix(in oklab, var(--rv-color-primary-tint), transparent 80%)',
  color: 'var(--rv-color-text)',
  fontFamily: 'var(--rv-font-family)',
};

const meta = {
  title: 'Components/Box',
  component: Box,
  tags: ['autodocs'],
  args: {
    padding: 'md',
    border: true,
    children: <div style={content}>Content</div>,
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `padding` on the spacing scale: `xs` (0.25rem), `sm` (0.5rem), `md` (1rem), `lg` (1.5rem). */
export const Paddings: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Box key={padding} {...args} padding={padding}>
          <div style={content}>{padding}</div>
        </Box>
      ))}
    </div>
  ),
};

/** `margin` on the same scale: the dashed outline marks the space the box takes around it. */
export const Margins: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((margin) => (
        <div key={margin} style={{ outline: '1px dashed var(--rv-color-border)' }}>
          <Box {...args} margin={margin}>
            <div style={content}>{margin}</div>
          </Box>
        </div>
      ))}
    </div>
  ),
};

/** Without `border`, the box only spaces its content. */
export const WithoutBorder: Story = {
  args: { border: false },
};

/** `as` picks the element, such as `section` or `aside`: the look does not change. */
export const AsAside: Story = {
  args: { as: 'aside', children: <div style={content}>An aside, for content related to the page</div> },
};

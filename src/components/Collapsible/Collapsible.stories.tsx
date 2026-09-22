import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible } from './Collapsible';

const text = { fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' } as const;
const width = { maxWidth: '24rem' } as const;

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  args: {
    label: 'Show more details',
  },
  render: (args) => (
    <div style={width}>
      <Collapsible {...args}>
        <p style={text}>
          This content is hidden by default and revealed when the trigger is clicked.
        </p>
      </Collapsible>
    </div>
  ),
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closed by default, opens on click. */
export const Default: Story = {};

/**
 * The content, shown. Left out of the Docs page: an open panel takes focus away from the trigger
 * that opens it there.
 */
export const Open: Story = {
  tags: ['!autodocs'],
  args: { defaultOpen: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** The panel opens and closes on its own. */
export const Uncontrolled: Story = {};

/** The parent owns the open state: `open` and `onOpenChange`. */
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ ...width, display: 'grid', gap: 'var(--rv-space-3)' }}>
        <span style={text}>Open: {String(open)}</span>
        <Collapsible {...args} open={open} onOpenChange={setOpen}>
          <p style={text}>Shown once the trigger is clicked.</p>
        </Collapsible>
      </div>
    );
  },
};

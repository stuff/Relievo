import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Name',
    placeholder: 'Jane Doe',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The input keeps its own value, starting from `defaultValue`. */
export const Uncontrolled: Story = {
  args: { defaultValue: 'Jane Doe' },
};

/** The parent owns the value: here it upper-cases every edit before passing it back. */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('JANE');

    return (
      <div style={{ display: 'grid', gap: 'var(--ui-space-3)', fontFamily: 'var(--ui-font-family)' }}>
        <Input {...args} value={value} onValueChange={(next) => setValue(next.toUpperCase())} />
        <span>
          value: <code>{value}</code>
        </span>
      </div>
    );
  },
};

export const Email: Story = {
  args: { label: 'Email', type: 'email', placeholder: 'jane@example.com' },
};

export const HiddenLabel: Story = {
  args: { label: 'Search', hideLabel: true, placeholder: 'Search…', type: 'search' },
};

export const WithButton: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ui-space-3)', alignItems: 'end' }}>
      <Input {...args} label="Search" hideLabel placeholder="Search…" type="search" />
      <Button variant="secondary">Search</Button>
    </div>
  ),
};

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'jane@example.com',
    helperText: 'We only use it to send your receipts.',
  },
};

/** `error` paints the input, label and helper text red. The helper text explains the error. */
export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'not-an-email',
    error: true,
    helperText: 'Enter an email address, like jane@example.com.',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Read only for now' },
};

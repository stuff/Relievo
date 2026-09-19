import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const stack = { display: 'grid', gap: 'var(--rv-space-3)', justifyItems: 'start' } as const;

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Email me about new features',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every state: unticked, ticked, mixed, each one disabled, and the error state. */
export const States: Story = {
  render: () => (
    <div style={stack}>
      <Checkbox label="Unticked" />
      <Checkbox label="Ticked" defaultChecked />
      <Checkbox label="Mixed" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled, ticked" disabled defaultChecked />
      <Checkbox label="Disabled, mixed" disabled indeterminate />
      <Checkbox label="Error" error helperText="Explain the error here." />
      <Checkbox label="Error, ticked" error defaultChecked helperText="Explain the error here." />
      <Checkbox label="Disabled, with helper text" disabled helperText="Not available on your plan." />
    </div>
  ),
};

/** A helper text under the label, aligned with it. */
export const WithHelperText: Story = {
  args: { helperText: 'One email a month, no more. Unsubscribe at any time.' },
};

/** `error` paints the box, label and helper text red; the helper text explains the error. */
export const WithError: Story = {
  args: {
    label: 'I accept the terms of service',
    error: true,
    helperText: 'Accept the terms to create your account.',
  },
};

/** The checkbox keeps its own state: `defaultChecked` sets the initial one. */
export const Uncontrolled: Story = {
  args: { defaultChecked: true },
};

/** The parent owns the state: `checked` and `onCheckedChange`. */
export const Controlled: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false);

    return (
      <div style={stack}>
        <Checkbox {...args} checked={checked} onCheckedChange={setChecked} />
        <span style={{ fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' }}>
          Checked: {String(checked)}
        </span>
      </div>
    );
  },
};

const toppings = ['Cheese', 'Mushrooms', 'Olives'];

/** A "select all" checkbox: mixed while only some items are ticked. */
export const SelectAll: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(['Cheese']);
    const all = selected.length === toppings.length;

    return (
      <div style={stack}>
        <Checkbox
          label="All toppings"
          checked={all}
          indeterminate={selected.length > 0 && !all}
          onCheckedChange={(checked) => setSelected(checked ? toppings : [])}
        />
        <div style={{ ...stack, paddingInlineStart: 'var(--rv-space-6)' }}>
          {toppings.map((topping) => (
            <Checkbox
              key={topping}
              label={topping}
              checked={selected.includes(topping)}
              onCheckedChange={(checked) =>
                setSelected((current) =>
                  checked ? [...current, topping] : current.filter((item) => item !== topping),
                )
              }
            />
          ))}
        </div>
      </div>
    );
  },
};

/** A long label wraps; the box stays on its first line. */
export const LongLabel: Story = {
  args: {
    label:
      'I agree to the terms of service and the privacy policy, and I understand how my data will be used to provide the service.',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '22rem' }}>
        <Story />
      </div>
    ),
  ],
};

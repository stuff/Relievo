import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../Input';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label: 'Description',
    placeholder: 'What is this product made of?',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '24rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const description =
  'A linen shirt with a relaxed fit, mother-of-pearl buttons and a single chest pocket. ' +
  'Washed for softness.';

export const Default: Story = {};

/** The textarea keeps its own value, starting from `defaultValue`. */
export const Uncontrolled: Story = {
  args: { defaultValue: description },
};

/** The parent owns the value: here it counts the characters left. */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(description);
    const left = 200 - value.length;

    return (
      <Textarea
        {...args}
        value={value}
        onValueChange={(next) => setValue(next.slice(0, 200))}
        helperText={`${left} characters left.`}
      />
    );
  },
};

/** In a form, next to single-line fields: the same carved surface, label and helper text. */
export const InAForm: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-5)' }}>
      <Input label="Name" defaultValue="Linen shirt" />
      <Textarea {...args} defaultValue={description} helperText="Shown on the product page." />
    </div>
  ),
};

/** `rows` sets the initial height; the user can still drag it taller. */
export const Rows: Story = {
  args: { rows: 8, defaultValue: description },
};

export const WithHelperText: Story = {
  args: { helperText: 'Shown on the product page, under the price.' },
};

/** `error` paints the textarea, label and helper text red. The helper text explains the error. */
export const WithError: Story = {
  args: {
    defaultValue: 'Nice shirt.',
    error: true,
    helperText: 'Write at least 50 characters.',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: description },
};

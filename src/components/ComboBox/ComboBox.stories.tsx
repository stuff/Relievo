import { useState } from 'react';
import { GlobeIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from '../Input';
import { ComboBox, type ComboBoxProps } from './ComboBox';

const countries = [
  { value: 'at', label: 'Austria' },
  { value: 'be', label: 'Belgium' },
  { value: 'dk', label: 'Denmark' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy', disabled: true },
  { value: 'nl', label: 'Netherlands' },
  { value: 'pt', label: 'Portugal' },
  { value: 'es', label: 'Spain' },
  { value: 'se', label: 'Sweden' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'gb', label: 'United Kingdom' },
];

const timeZones = [
  {
    label: 'Europe',
    options: [
      { value: 'europe-london', label: 'London' },
      { value: 'europe-paris', label: 'Paris' },
      { value: 'europe-berlin', label: 'Berlin' },
    ],
  },
  {
    label: 'America',
    options: [
      { value: 'america-new-york', label: 'New York' },
      { value: 'america-chicago', label: 'Chicago' },
      { value: 'america-los-angeles', label: 'Los Angeles' },
    ],
  },
  {
    label: 'Asia',
    options: [
      { value: 'asia-tokyo', label: 'Tokyo' },
      { value: 'asia-singapore', label: 'Singapore' },
    ],
  },
];

const text = { fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' } as const;

const meta = {
  title: 'Components/ComboBox',
  component: ComboBox,
  tags: ['autodocs'],
  args: {
    label: 'Country',
    placeholder: 'Search a country',
    options: countries,
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ maxWidth: parameters.maxWidth ?? '20rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<ComboBoxProps>;

export default meta;
// ComboBoxProps is a union (one value or several): type the stories with it directly
type Story = StoryObj<ComboBoxProps>;

export const Default: Story = {};

/** `multiple`: each chosen option is a chip, removed with its button or with Backspace. */
export const Multiple: Story = {
  args: { label: 'Countries', multiple: true, defaultValue: ['fr', 'de'] },
};

/** The field grows onto new lines as chips are added; the round button moves down to the last line. */
export const ManySelected: Story = {
  args: {
    label: 'Countries',
    multiple: true,
    defaultValue: ['at', 'be', 'dk', 'fr', 'de', 'nl', 'pt', 'es'],
  },
};

/**
 * The list, open: chosen options have a check, Italy is disabled, and the list scrolls. With
 * `multiple`, it stays open after a choice. Left out of the Docs page: an open list takes the
 * focus, which would scroll the page to it.
 */
export const Open: Story = {
  tags: ['!autodocs'],
  args: { label: 'Countries', multiple: true, defaultOpen: true, defaultValue: ['fr', 'de'] },
  render: (args: ComboBoxProps) => (
    <div style={{ minHeight: '26rem' }}>
      <ComboBox {...args} />
    </div>
  ),
};

/** Pass groups to `options` to group the options under titles. Open the list to see them. */
export const WithGroups: Story = {
  args: { label: 'Time zone', placeholder: 'Search a city', options: timeZones },
};

export const WithHelperText: Story = {
  args: { helperText: 'Where we ship your order.' },
};

/** `error` paints the field, label and helper text red; the helper text explains the error. */
export const WithError: Story = {
  args: {
    label: 'Countries',
    multiple: true,
    defaultValue: ['fr'],
    error: true,
    helperText: 'Choose at least two countries.',
  },
};

export const WithIcon: Story = {
  args: { startIcon: <GlobeIcon />, multiple: true, defaultValue: ['fr', 'de'] },
};

export const Disabled: Story = {
  args: { disabled: true, multiple: true, defaultValue: ['fr', 'de'] },
};

/** The combobox keeps its own value: `defaultValue` sets the initial one. */
export const Uncontrolled: Story = {
  args: { defaultValue: 'de' },
};

/** The parent owns the value: `value` and `onValueChange`. */
export const Controlled: Story = {
  render: function Render(args: ComboBoxProps) {
    const [value, setValue] = useState<string | null>('fr');

    return (
      <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
        <ComboBox
          {...(args as Extract<ComboBoxProps, { multiple?: false }>)}
          value={value}
          onValueChange={setValue}
        />
        <span style={text}>Value: {String(value)}</span>
      </div>
    );
  },
};

/** With `multiple`, the value is an array. */
export const ControlledMultiple: Story = {
  render: function Render(args: ComboBoxProps) {
    const [value, setValue] = useState<string[]>(['fr', 'es']);

    return (
      <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
        <ComboBox
          {...(args as Omit<
            ComboBoxProps,
            'multiple' | 'value' | 'defaultValue' | 'onValueChange'
          >)}
          label="Countries"
          multiple
          value={value}
          onValueChange={setValue}
        />
        <span style={text}>Value: {JSON.stringify(value)}</span>
      </div>
    );
  },
};

/** One line is as tall as an Input and a Button: they line up in a row. */
export const WithInputAndButton: Story = {
  parameters: { maxWidth: '40rem' },
  render: (args: ComboBoxProps) => (
    <div style={{ display: 'flex', gap: 'var(--rv-space-3)', alignItems: 'end' }}>
      <div style={{ flex: 1 }}>
        <Input label="City" placeholder="Paris" />
      </div>
      <div style={{ flex: 1 }}>
        <ComboBox {...args} />
      </div>
      <Button tone="accent" startIcon={<PlusIcon />}>
        Add
      </Button>
    </div>
  ),
};

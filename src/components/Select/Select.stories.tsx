import { useState } from 'react';
import { GlobeIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select, type SelectProps } from './Select';

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

const options = countries.map((country) => (
  <Select.Item key={country.value} value={country.value} disabled={country.disabled}>
    {country.label}
  </Select.Item>
));

const text = { fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' } as const;

const meta = {
  title: 'Components/Select',
  component: Select,
  subcomponents: { 'Select.Item': Select.Item, 'Select.Group': Select.Group },
  tags: ['autodocs'],
  args: {
    label: 'Country',
    placeholder: 'Choose a country',
    children: options,
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ maxWidth: parameters.maxWidth ?? '20rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<SelectProps>;

export default meta;
// SelectProps is a union (children or options): type the stories with it directly
type Story = StoryObj<SelectProps>;

export const Default: Story = {};

/**
 * The list, open: the chosen option has a check, Italy is disabled, and the list scrolls.
 * Left out of the Docs page: an open list takes the focus, which would scroll the page to it.
 */
export const Open: Story = {
  tags: ['!autodocs'],
  args: { defaultOpen: true, defaultValue: 'fr' },
  render: (args: SelectProps) => (
    <div style={{ minHeight: '26rem' }}>
      <Select {...args} />
    </div>
  ),
};

export const WithHelperText: Story = {
  args: { helperText: 'Where we ship your order.' },
};

/** `error` paints the field, label and helper text red; the helper text explains the error. */
export const WithError: Story = {
  args: { error: true, helperText: 'Choose the country we ship to.' },
};

export const WithIcon: Story = {
  args: { startIcon: <GlobeIcon />, defaultValue: 'fr' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'fr' },
};

/**
 * `Select.Group` groups options under a title; groups are separated by a line. Children only:
 * `options` is for simple lists. Open the select to see them.
 */
export const WithGroups: Story = {
  render: () => (
    <div style={{ minHeight: '26rem' }}>
      <Select label="Time zone" defaultValue="europe-paris">
        <Select.Group label="Europe">
          <Select.Item value="europe-london">London</Select.Item>
          <Select.Item value="europe-paris">Paris</Select.Item>
          <Select.Item value="europe-berlin">Berlin</Select.Item>
        </Select.Group>
        <Select.Group label="America">
          <Select.Item value="america-new-york">New York</Select.Item>
          <Select.Item value="america-chicago">Chicago</Select.Item>
          <Select.Item value="america-los-angeles">Los Angeles</Select.Item>
        </Select.Group>
        <Select.Group label="Asia">
          <Select.Item value="asia-tokyo">Tokyo</Select.Item>
          <Select.Item value="asia-singapore">Singapore</Select.Item>
        </Select.Group>
      </Select>
    </div>
  ),
};

/** `options` takes the options as an array, such as data from an API, instead of children. */
export const WithOptions: Story = {
  render: () => (
    <Select label="Country" placeholder="Choose a country" options={countries} defaultValue="es" />
  ),
};

/** The select keeps its own value: `defaultValue` sets the initial one. */
export const Uncontrolled: Story = {
  args: { defaultValue: 'de' },
};

/** The parent owns the value: `value` and `onValueChange`. */
export const Controlled: Story = {
  render: function Render(args: SelectProps) {
    const [value, setValue] = useState<string | null>('fr');

    return (
      <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
        <Select {...args} value={value} onValueChange={setValue} />
        <span style={text}>Value: {String(value)}</span>
      </div>
    );
  },
};

/** Same height as an Input and a Button: they line up in a row. */
export const WithInputAndButton: Story = {
  parameters: { maxWidth: '40rem' },
  render: (args: SelectProps) => (
    <div style={{ display: 'flex', gap: 'var(--rv-space-3)', alignItems: 'end' }}>
      <div style={{ flex: 1 }}>
        <Input label="City" placeholder="Paris" />
      </div>
      <div style={{ flex: 1 }}>
        <Select {...args} />
      </div>
      <Button startIcon={<PlusIcon />}>Add</Button>
    </div>
  ),
};

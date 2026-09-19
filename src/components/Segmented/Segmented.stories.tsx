import { useState } from 'react';
import { CalendarIcon, ListIcon, SquaresFourIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from '../Input';
import { Segmented, type SegmentedSize } from './Segmented';

const sizes: SegmentedSize[] = ['sm', 'md', 'lg'];
const stack = { display: 'grid', gap: 'var(--rv-space-4)', justifyItems: 'start' } as const;

const periods = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  subcomponents: { 'Segmented.Item': Segmented.Item },
  tags: ['autodocs'],
  args: {
    label: 'Period',
    defaultValue: 'week',
  },
  render: (args) => (
    <Segmented {...args}>
      {periods.map((period) => (
        <Segmented.Item key={period.value} value={period.value}>
          {period.label}
        </Segmented.Item>
      ))}
    </Segmented>
  ),
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click around, or use the arrow keys: the highlight slides from one item to the next. */
export const Default: Story = {};

/** Sizes of the control scale: each lines up with a Button and an Input of the same size. */
export const Sizes: Story = {
  render: function Render(args) {
    const [period, setPeriod] = useState('week');

    return (
      <div style={stack}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'flex', gap: 'var(--rv-space-3)', alignItems: 'center' }}>
            <Segmented {...args} size={size} value={period} onValueChange={setPeriod} defaultValue={undefined}>
              {periods.map((item) => (
                <Segmented.Item key={item.value} value={item.value}>
                  {item.label}
                </Segmented.Item>
              ))}
            </Segmented>
            <Button size={size} variant="secondary">
              Export
            </Button>
          </div>
        ))}
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <Segmented {...args} label="View" defaultValue="grid">
      <Segmented.Item value="list" startIcon={<ListIcon />}>
        List
      </Segmented.Item>
      <Segmented.Item value="grid" startIcon={<SquaresFourIcon />}>
        Grid
      </Segmented.Item>
      <Segmented.Item value="calendar" startIcon={<CalendarIcon />}>
        Calendar
      </Segmented.Item>
    </Segmented>
  ),
};

/** Without a default value, nothing is chosen until the first click; the highlight then fades in. */
export const NoInitialChoice: Story = {
  args: { defaultValue: undefined },
};

/** The parent owns the value. */
export const Controlled: Story = {
  render: function Render(args) {
    const [period, setPeriod] = useState('month');

    return (
      <div style={{ ...stack, fontFamily: 'var(--rv-font-family)' }}>
        <Segmented {...args} value={period} onValueChange={setPeriod} defaultValue={undefined}>
          {periods.map((item) => (
            <Segmented.Item key={item.value} value={item.value}>
              {item.label}
            </Segmented.Item>
          ))}
        </Segmented>
        <span>
          value: <code>{period}</code>
        </span>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={stack}>
      <Segmented {...args} disabled>
        {periods.map((item) => (
          <Segmented.Item key={item.value} value={item.value}>
            {item.label}
          </Segmented.Item>
        ))}
      </Segmented>
      <Segmented {...args} label="Period (one item disabled)">
        {periods.map((item) => (
          <Segmented.Item key={item.value} value={item.value} disabled={item.value === 'year'}>
            {item.label}
          </Segmented.Item>
        ))}
      </Segmented>
    </div>
  ),
};

/** In a toolbar, next to an Input and a Button of the same size. */
export const InToolbar: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--rv-space-3)', alignItems: 'end', width: '40rem' }}>
      <Input label="Search" hideLabel placeholder="Search…" type="search" />
      <Segmented {...args} label="View" defaultValue="grid">
        <Segmented.Item value="list" startIcon={<ListIcon />}>
          List
        </Segmented.Item>
        <Segmented.Item value="grid" startIcon={<SquaresFourIcon />}>
          Grid
        </Segmented.Item>
      </Segmented>
      <Button>New</Button>
    </div>
  ),
};

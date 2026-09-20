import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArchiveIcon,
  GavelIcon,
  ListIcon,
  ScalesIcon,
  SparkleIcon,
  StarIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: {
    'Tabs.List': Tabs.List,
    'Tabs.Item': Tabs.Item,
    'Tabs.Panel': Tabs.Panel,
  },
  tags: ['autodocs'],
  args: { label: 'Products' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="published">
      <Tabs.List>
        <Tabs.Item value="published">Published</Tabs.Item>
        <Tabs.Item value="drafts">Drafts</Tabs.Item>
        <Tabs.Item value="archived">Archived</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="published">14 products are on sale.</Tabs.Panel>
      <Tabs.Panel value="drafts">3 products are still drafts.</Tabs.Panel>
      <Tabs.Panel value="archived">Nothing archived yet.</Tabs.Panel>
    </Tabs>
  ),
};

/** `startIcon` puts an icon before the label. A count is part of that label, as text. */
export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="review">
      <Tabs.List>
        <Tabs.Item value="new" startIcon={<SparkleIcon />}>New 12</Tabs.Item>
        <Tabs.Item value="kept" startIcon={<StarIcon />}>Kept 3</Tabs.Item>
        <Tabs.Item value="review" startIcon={<ScalesIcon />}>To review 216</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="new">The 12 products added since your last visit.</Tabs.Panel>
      <Tabs.Panel value="kept">The 3 products you kept.</Tabs.Panel>
      <Tabs.Panel value="review">216 products are waiting for a decision.</Tabs.Panel>
    </Tabs>
  ),
};

/** The bar keeps track of the selected tab, starting from `defaultValue`. */
export const Uncontrolled: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="drafts">
      <Tabs.List>
        <Tabs.Item value="published">Published</Tabs.Item>
        <Tabs.Item value="drafts">Drafts</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="published">On sale.</Tabs.Panel>
      <Tabs.Panel value="drafts">Not on sale yet.</Tabs.Panel>
    </Tabs>
  ),
};

/** The parent owns the selection: here it also says which tab was asked for last. */
export const Controlled: Story = {
  render: function Render(args) {
    const [tab, setTab] = useState('published');
    const [asked, setAsked] = useState<string[]>([]);

    return (
      <div style={{ display: 'grid', gap: 'var(--rv-space-4)' }}>
        <Tabs
          {...args}
          value={tab}
          onValueChange={(next) => {
            setTab(next);
            setAsked((all) => [...all, next]);
          }}
        >
          <Tabs.List>
            <Tabs.Item value="published">Published</Tabs.Item>
            <Tabs.Item value="drafts">Drafts</Tabs.Item>
            <Tabs.Item value="archived">Archived</Tabs.Item>
          </Tabs.List>
        </Tabs>
        <p style={{ margin: 0, fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text-muted)', fontSize: 'var(--rv-font-size-sm)' }}>
          Asked for: {asked.join(' → ') || 'nothing yet'}
        </p>
      </div>
    );
  },
};

/** `framed` puts the panel on a card's surface; `plain`, the default, leaves it bare. */
export const FramedPanel: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="published">
      <Tabs.List>
        <Tabs.Item value="published">Published</Tabs.Item>
        <Tabs.Item value="drafts">Drafts</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="published" variant="framed">
        14 products are on sale. A framed panel carries the surface and border of a Card.
      </Tabs.Panel>
      <Tabs.Panel value="drafts" variant="framed">3 products are still drafts.</Tabs.Panel>
    </Tabs>
  ),
};

/** `sm` and `md` line up with a `Button` of the same size. There is no `lg`. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-5)' }}>
      {(['sm', 'md'] as const).map((size) => (
        <Tabs {...args} key={size} size={size} defaultValue="review">
          <Tabs.List>
            <Tabs.Item value="new" startIcon={<SparkleIcon />}>New 12</Tabs.Item>
            <Tabs.Item value="kept" startIcon={<StarIcon />}>Kept 3</Tabs.Item>
            <Tabs.Item value="review" startIcon={<ScalesIcon />}>To review 216</Tabs.Item>
          </Tabs.List>
        </Tabs>
      ))}
    </div>
  ),
};

/** More tabs than room: the bar scrolls sideways, and the rail holds still around it. */
export const Scrolling: Story = {
  render: (args) => (
    <div style={{ maxWidth: '26rem' }}>
      <Tabs {...args} defaultValue="review">
        <Tabs.List>
          <Tabs.Item value="new" startIcon={<SparkleIcon />}>New 12</Tabs.Item>
          <Tabs.Item value="kept" startIcon={<StarIcon />}>Kept 3</Tabs.Item>
          <Tabs.Item value="review" startIcon={<ScalesIcon />}>To review 216</Tabs.Item>
          <Tabs.Item value="conflicts" startIcon={<WarningIcon />}>Conflicts 0</Tabs.Item>
          <Tabs.Item value="mine" startIcon={<GavelIcon />}>My calls 201</Tabs.Item>
          <Tabs.Item value="dropped" startIcon={<ArchiveIcon />}>Dropped 1938</Tabs.Item>
          <Tabs.Item value="all" startIcon={<ListIcon />}>All 2186</Tabs.Item>
        </Tabs.List>
      </Tabs>
    </div>
  ),
};

/** A tab that cannot be selected. */
export const DisabledTab: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="published">
      <Tabs.List>
        <Tabs.Item value="published">Published</Tabs.Item>
        <Tabs.Item value="drafts" disabled>Drafts</Tabs.Item>
        <Tabs.Item value="archived">Archived</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="published">On sale.</Tabs.Panel>
      <Tabs.Panel value="archived">Archived.</Tabs.Panel>
    </Tabs>
  ),
};

/** Tabs with no panel at all: `onValueChange` is what the app acts on. */
export const WithoutPanels: Story = {
  render: function Render(args) {
    const [tab, setTab] = useState('published');

    return (
      <div style={{ display: 'grid', gap: 'var(--rv-space-4)' }}>
        <Tabs {...args} value={tab} onValueChange={setTab}>
          <Tabs.List>
            <Tabs.Item value="published">Published</Tabs.Item>
            <Tabs.Item value="drafts">Drafts</Tabs.Item>
          </Tabs.List>
        </Tabs>
        <p style={{ margin: 0, fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' }}>
          The app would now show: {tab}
        </p>
      </div>
    );
  },
};

import { DownloadSimpleIcon, PlusIcon, ShareNetworkIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: {
    label: 'Form actions',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Cancel</Button>
      <Button>Save</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: { label: 'Document actions' },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button startIcon={<PlusIcon />}>New</Button>
      <Button variant="secondary" startIcon={<DownloadSimpleIcon />}>
        Export
      </Button>
      <Button variant="secondary" startIcon={<ShareNetworkIcon />}>
        Share
      </Button>
      <Button variant="link">More</Button>
    </ButtonGroup>
  ),
};

/** The group never wraps: in a narrow container, the buttons overflow instead of stacking. */
export const SingleLine: Story = {
  render: (args) => (
    <div style={{ width: '16rem', padding: 'var(--rv-space-3)', border: '1px dashed var(--rv-color-border)' }}>
      <ButtonGroup {...args}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="secondary">Save draft</Button>
        <Button>Publish</Button>
      </ButtonGroup>
    </div>
  ),
};

/** With `wrap`, the buttons move to the next line when the container runs out of room. */
export const Wrap: Story = {
  args: { wrap: true },
  render: SingleLine.render,
};

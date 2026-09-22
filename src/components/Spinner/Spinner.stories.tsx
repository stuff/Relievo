import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from '../Input';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  render: () => (
    <span style={{ fontSize: '2rem', color: 'var(--rv-color-text)' }}>
      <Spinner />
    </span>
  ),
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sized and colored like any other icon: 2rem here, through the surrounding font size. */
export const Default: Story = {};

/** As `startIcon`, in place of the field's usual icon while it reloads. */
export const InAnInput: Story = {
  render: () => (
    <Input label="Search" hideLabel placeholder="Search…" startIcon={<Spinner />} defaultValue="react nantes" />
  ),
};

/** As `startIcon`, in place of a button's usual icon while its action runs. */
export const InAButton: Story = {
  render: () => (
    <Button variant="secondary" startIcon={<Spinner />} disabled>
      Loading…
    </Button>
  ),
};

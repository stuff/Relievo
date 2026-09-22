import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClockIcon } from '@phosphor-icons/react';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Link } from '../Link';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    children: 'The last scan failed: timeout on the job board.',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '36rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** One alert per tone, each with its own icon. */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
      <Alert {...args} tone="neutral">A plain remark, with no status.</Alert>
      <Alert {...args} tone="info">12 offers for “rust”, across every tab.</Alert>
      <Alert {...args} tone="success">34 offers scored again, 3 verdicts changed.</Alert>
      <Alert {...args} tone="warning">An answer was expected on 12 September.</Alert>
      <Alert {...args} tone="danger">The last scan failed: timeout on the job board.</Alert>
    </div>
  ),
};

/** `title` says what happened in one line; the message explains it. */
export const WithTitle: Story = {
  args: {
    tone: 'danger',
    title: 'The scan failed',
    children: 'Timeout on the job board after 30 seconds. The offers on file did not change.',
  },
};

/** The message can hold anything it needs: a link, a checkbox, a button. */
export const WithContent: Story = {
  args: {
    tone: 'danger',
    title: 'This offer is already on file',
    children: (
      <>
        <p>
          It was added on 3 September, from <Link href="#source">the same address</Link>.
        </p>
        <Checkbox label="Replace the version on file with this one" />
        <div>
          <Button variant="secondary" size="sm">Add anyway</Button>
        </div>
      </>
    ),
  },
};

/** A `Link` inside the message takes the alert's tone, not its own default primary color. */
export const WithLink: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
      <Alert {...args} tone="info">
        169 offers for “test”, across every tab. <Link href="#list">Back to the list</Link>
      </Alert>
      <Alert {...args} tone="danger">
        The last scan failed: timeout on the job board. <Link href="#retry">Try again</Link>
      </Alert>
    </div>
  ),
};

/** `icon` replaces the tone's icon; `icon={false}` removes it. */
export const Icons: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
      <Alert {...args} tone="warning" icon={<ClockIcon />}>
        An answer was expected on 12 September. You can follow up.
      </Alert>
      <Alert {...args} tone="warning" icon={false}>
        The same message, without an icon.
      </Alert>
    </div>
  ),
};

/** With `onClose`, a close button shows up: remove the alert from the page yourself. */
export const Dismissible: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);

    return open ? (
      <Alert {...args} tone="success" onClose={() => setOpen(false)}>
        34 offers scored again, 3 verdicts changed.
      </Alert>
    ) : (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Show it again</Button>
    );
  },
};

/**
 * `live` is for a message that shows up in answer to an action: screen readers announce it.
 * Press the button to add one.
 */
export const Live: Story = {
  render: function Render(args) {
    const [failures, setFailures] = useState(0);

    return (
      <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
        <div>
          <Button variant="secondary" size="sm" onClick={() => setFailures((n) => n + 1)}>
            Save
          </Button>
        </div>
        {failures > 0 && (
          <Alert {...args} tone="danger" live title="Could not save">
            Attempt {failures} failed. The server did not answer.
          </Alert>
        )}
      </div>
    );
  },
};

/** A long message wraps under the icon, never around it. */
export const LongMessage: Story = {
  args: {
    tone: 'warning',
    title: 'The grid disagrees with you',
    children:
      'The grid said “dismiss” when you ranked this offer, it says “keep” now. A new fact ' +
      'contradicts your choice, and the reasons below are up to date. Rank it again, or keep ' +
      'your choice and say you have seen this.',
    onClose: () => {},
  },
};

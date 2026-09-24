import { useState } from 'react';
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  ScalesIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  subcomponents: { 'Input.Action': Input.Action },
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
      <div
        style={{ display: 'grid', gap: 'var(--rv-space-3)', fontFamily: 'var(--rv-font-family)' }}
      >
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

export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-4)' }}>
      <Input
        {...args}
        label="Search"
        type="search"
        placeholder="Search…"
        startIcon={<MagnifyingGlassIcon />}
      />
      <Input
        {...args}
        label="Email"
        type="email"
        placeholder="jane@example.com"
        endIcon={<EnvelopeIcon />}
      />
    </div>
  ),
};

/** `prefix` and `suffix` hold text such as a currency or a unit. Screen readers announce them. */
export const WithPrefixAndSuffix: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-4)' }}>
      <Input {...args} label="Price" type="number" placeholder="0.00" suffix="€" />
      <Input {...args} label="Amount" type="number" placeholder="0.00" prefix="$" />
      <Input {...args} label="Website" placeholder="acme" prefix="https://" suffix=".com" />
      <Input
        {...args}
        label="Weight"
        type="number"
        placeholder="0"
        startIcon={<ScalesIcon />}
        suffix="kg"
      />
      <Input
        {...args}
        label="Domain"
        placeholder="acme"
        startIcon={<GlobeIcon />}
        suffix=".com"
        error
        helperText="This domain is taken."
      />
    </div>
  ),
};

export const HiddenLabel: Story = {
  args: { label: 'Search', hideLabel: true, placeholder: 'Search…', type: 'search' },
};

/**
 * `endButton` puts a `Button` beside the field, acting on its value. The input lines it up with
 * its own line, whatever the height of the label and helper text, which span them both.
 */
export const WithButton: Story = {
  args: {
    label: 'Address of the offer',
    placeholder: 'https://example.com/job/123',
    helperText:
      'Required: without an address the offer cannot be found again. Campaign tokens are ' +
      'removed, the address kept is the offer’s.',
    endButton: (
      <Button variant="secondary" startIcon={<GlobeIcon />}>
        Read the page
      </Button>
    ),
  },
};

/**
 * `endAction` puts a button at the end of the field, acting on its value: an `Input.Action`, round
 * and icon-only, named by its `label`. Here, clearing a search and showing a password.
 */
export const WithAction: Story = {
  render: function Render(args) {
    const [search, setSearch] = useState('react nantes');
    const [visible, setVisible] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--rv-space-5)', maxWidth: '20rem' }}>
        <Input
          {...args}
          label="Search"
          placeholder="Search…"
          type="search"
          startIcon={<MagnifyingGlassIcon />}
          value={search}
          onValueChange={setSearch}
          endAction={
            search ? (
              <Input.Action
                label="Clear the search"
                icon={<XIcon />}
                onClick={() => setSearch('')}
              />
            ) : undefined
          }
        />
        <Input
          {...args}
          label="Password"
          placeholder=""
          type={visible ? 'text' : 'password'}
          defaultValue="correct horse battery"
          endAction={
            <Input.Action
              label={visible ? 'Hide the password' : 'Show the password'}
              icon={visible ? <EyeSlashIcon /> : <EyeIcon />}
              onClick={() => setVisible((v) => !v)}
            />
          }
        />
      </div>
    );
  },
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

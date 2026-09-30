import type { CSSProperties, ReactElement } from 'react';
import {
  ArrowRightIcon,
  CaretDownIcon,
  CheckIcon,
  DownloadSimpleIcon,
  InfoIcon,
  PlusIcon,
  TrashIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LinkComponentProps } from '../../provider';
import { RelievoProvider } from '../../provider';
import { Button, type ButtonTone } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const tones: ButtonTone[] = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'];
const statusIcons: Partial<Record<ButtonTone, ReactElement>> = {
  info: <InfoIcon />,
  success: <CheckIcon />,
  warning: <WarningIcon />,
  danger: <TrashIcon />,
};
const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--rv-space-3)',
  alignItems: 'center',
};
const capitalize = (tone: string) => tone[0].toUpperCase() + tone.slice(1);

/** The default: a solid neutral button, for most actions. */
export const Neutral: Story = {
  args: { children: 'Save draft' },
};

/** The main action of a screen, in the brand color. One per view. */
export const Accent: Story = {
  args: { tone: 'accent', children: 'Publish' },
};

/** Text only, for low-emphasis actions in text or dense layouts. */
export const Link: Story = {
  args: { variant: 'link', children: 'Cancel' },
};

/**
 * Every tone, solid and as a link. A status tone (`info`, `success`, `warning`, `danger`) keeps the
 * neutral fill with a border and a label in its color: filled, it would compete with the accent.
 * Pair it with an icon or a label that says the same thing.
 */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
      {(['solid', 'link'] as const).map((variant) => (
        <div key={variant} style={row}>
          {tones.map((tone) => (
            <Button {...args} key={tone} variant={variant} tone={tone}>
              {capitalize(tone)}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={row}>
          {tones.map((tone) => (
            <Button
              {...args}
              key={tone}
              size={size}
              tone={tone}
              startIcon={statusIcons[tone] ?? <PlusIcon />}
            >
              {capitalize(tone)}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Themes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--rv-space-4)' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{
            ...row,
            padding: 'var(--rv-space-4)',
            borderRadius: 'var(--rv-radius-lg)',
            backgroundColor: 'var(--rv-color-background)',
            border: '1px solid var(--rv-color-border)',
          }}
        >
          <Button {...args}>Neutral</Button>
          <Button {...args} tone="accent">
            Accent
          </Button>
          <Button {...args} tone="danger">
            Danger
          </Button>
          <Button {...args} variant="link">
            Link
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} tone="accent" startIcon={<PlusIcon />}>
        Add
      </Button>
      <Button {...args} endIcon={<ArrowRightIcon />}>
        Continue
      </Button>
      <Button {...args} startIcon={<DownloadSimpleIcon />} endIcon={<CaretDownIcon />}>
        Export
      </Button>
      <Button {...args} tone="danger" startIcon={<TrashIcon />}>
        Delete
      </Button>
    </div>
  ),
};

/** Icons follow the button size. */
export const IconSizes: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm" startIcon={<PlusIcon />}>
        Small
      </Button>
      <Button {...args} size="md" startIcon={<PlusIcon />}>
        Medium
      </Button>
      <Button {...args} size="lg" startIcon={<PlusIcon />}>
        Large
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={row}>
      <Button {...args}>Neutral</Button>
      <Button {...args} tone="accent">
        Accent
      </Button>
      <Button {...args} tone="danger">
        Danger
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
};

export const FocusableWhenDisabled: Story = {
  args: { disabled: true, focusableWhenDisabled: true },
};

export const AsLink: Story = {
  args: { href: 'https://base-ui.com', children: 'Go to Base UI' },
};

export const DisabledLink: Story = {
  args: { href: 'https://base-ui.com', disabled: true, children: 'Go to Base UI' },
};

// Stands in for a router link such as next/link: navigates without reloading the page.
function RouterLink({ href, onClick, ...props }: LinkComponentProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
        alert(`Client-side navigation to ${href}`);
      }}
    />
  );
}

export const WithRouterLink: Story = {
  args: { href: '/settings', children: 'Settings' },
  render: (args) => (
    <RelievoProvider linkComponent={RouterLink}>
      <Button {...args} />
    </RelievoProvider>
  ),
};

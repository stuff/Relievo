import { ArrowRightIcon, CaretDownIcon, DownloadSimpleIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LinkComponentProps } from '../../provider';
import { RelievoProvider } from '../../provider';
import { Button } from './Button';

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

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ui-space-3)', alignItems: 'center' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Themes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ui-space-4)' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{
            display: 'flex',
            gap: 'var(--ui-space-3)',
            padding: 'var(--ui-space-4)',
            borderRadius: 'var(--ui-radius-lg)',
            backgroundColor: 'var(--ui-color-background)',
            border: '1px solid var(--ui-color-border)',
          }}
        >
          <Button {...args} variant="primary">
            Primary
          </Button>
          <Button {...args} variant="secondary">
            Secondary
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ui-space-3)', alignItems: 'center' }}>
      <Button {...args} startIcon={<PlusIcon />}>
        Add
      </Button>
      <Button {...args} variant="secondary" endIcon={<ArrowRightIcon />}>
        Continue
      </Button>
      <Button {...args} variant="secondary" startIcon={<DownloadSimpleIcon />} endIcon={<CaretDownIcon />}>
        Export
      </Button>
    </div>
  ),
};

/** Icons follow the button size. */
export const IconSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ui-space-3)', alignItems: 'center' }}>
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
    <div style={{ display: 'flex', gap: 'var(--ui-space-3)', alignItems: 'center' }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
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

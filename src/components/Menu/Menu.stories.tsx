import { useState } from 'react';
import {
  ArchiveIcon,
  CopyIcon,
  DotsThreeIcon,
  EnvelopeIcon,
  GearIcon,
  LinkIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  SignOutIcon,
  TrashIcon,
  UserIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RelievoProvider, type LinkComponentProps } from '../../provider';
import { Menu } from './Menu';

const text = { fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' } as const;
// Room for the open list below the button
const tall = { minHeight: '22rem' } as const;

const meta = {
  title: 'Components/Menu',
  component: Menu,
  subcomponents: {
    'Menu.Item': Menu.Item,
    'Menu.Group': Menu.Group,
    'Menu.Separator': Menu.Separator,
    'Menu.Submenu': Menu.Submenu,
    'Menu.CheckboxItem': Menu.CheckboxItem,
    'Menu.RadioGroup': Menu.RadioGroup,
    'Menu.RadioItem': Menu.RadioItem,
  },
  tags: ['autodocs'],
  args: {
    label: 'Actions',
    startIcon: <DotsThreeIcon />,
  },
  render: (args) => (
    <div style={tall}>
      <Menu {...args}>
        <Menu.Item startIcon={<PencilSimpleIcon />}>Edit</Menu.Item>
        <Menu.Item startIcon={<CopyIcon />}>Duplicate</Menu.Item>
        <Menu.Item startIcon={<ArchiveIcon />} disabled>
          Archive
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item tone="danger" startIcon={<TrashIcon />}>
          Delete
        </Menu.Item>
      </Menu>
    </div>
  ),
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Items with icons, a disabled one, a separator and a destructive item (`tone="danger"`). */
export const Default: Story = {};

/**
 * The list, open. Left out of the Docs page: an open list takes the focus, which would scroll the
 * page to it.
 */
export const Open: Story = {
  tags: ['!autodocs'],
  args: { defaultOpen: true },
};

/** `Menu.Group` puts items under a title. */
export const WithGroups: Story = {
  render: (args) => (
    <div style={tall}>
      <Menu {...args}>
        <Menu.Group label="Edit">
          <Menu.Item startIcon={<PencilSimpleIcon />}>Rename</Menu.Item>
          <Menu.Item startIcon={<CopyIcon />}>Duplicate</Menu.Item>
        </Menu.Group>
        <Menu.Group label="Danger zone">
          <Menu.Item tone="danger" startIcon={<TrashIcon />}>
            Delete
          </Menu.Item>
        </Menu.Group>
      </Menu>
    </div>
  ),
};

/** `Menu.Submenu` opens a list next to the item: on hover, a click or the right arrow. */
export const WithSubmenu: Story = {
  render: (args) => (
    <div style={tall}>
      <Menu {...args}>
        <Menu.Item startIcon={<PencilSimpleIcon />}>Edit</Menu.Item>
        <Menu.Submenu label="Share" startIcon={<ShareNetworkIcon />}>
          <Menu.Item startIcon={<LinkIcon />}>Copy link</Menu.Item>
          <Menu.Item startIcon={<EnvelopeIcon />}>Send by email</Menu.Item>
          <Menu.Submenu label="More">
            <Menu.Item>Export as PDF</Menu.Item>
            <Menu.Item>Export as CSV</Menu.Item>
          </Menu.Submenu>
        </Menu.Submenu>
        <Menu.Separator />
        <Menu.Item tone="danger" startIcon={<TrashIcon />}>
          Delete
        </Menu.Item>
      </Menu>
    </div>
  ),
};

// Stands in for a client-side router
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

/** `href` turns an item into a link, through the router link configured in `RelievoProvider`. */
export const WithLinks: Story = {
  args: { label: 'Account', startIcon: <UserIcon /> },
  render: (args) => (
    <RelievoProvider linkComponent={RouterLink}>
      <div style={tall}>
        <Menu {...args}>
          <Menu.Item href="/profile" startIcon={<UserIcon />}>
            Profile
          </Menu.Item>
          <Menu.Item href="/settings" startIcon={<GearIcon />}>
            Settings
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item tone="danger" startIcon={<SignOutIcon />}>
            Sign out
          </Menu.Item>
        </Menu>
      </div>
    </RelievoProvider>
  ),
};

/**
 * `Menu.CheckboxItem` toggles an option and `Menu.RadioGroup` picks one of several; the menu
 * stays open while they change.
 */
export const Checkable: Story = {
  args: { label: 'View', startIcon: undefined },
  render: function Render(args) {
    const [grid, setGrid] = useState(true);
    const [sort, setSort] = useState('name');

    return (
      <div style={{ ...tall, display: 'grid', alignContent: 'start', gap: 'var(--rv-space-3)' }}>
        <span style={text}>
          Grid: {String(grid)}, sort: {sort}
        </span>
        <div>
          <Menu {...args}>
            <Menu.CheckboxItem checked={grid} onCheckedChange={setGrid}>
              Show grid
            </Menu.CheckboxItem>
            <Menu.CheckboxItem defaultChecked>Show hidden files</Menu.CheckboxItem>
            <Menu.Separator />
            <Menu.RadioGroup label="Sort by" value={sort} onValueChange={setSort}>
              <Menu.RadioItem value="name">Name</Menu.RadioItem>
              <Menu.RadioItem value="date">Date modified</Menu.RadioItem>
              <Menu.RadioItem value="size">Size</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** The menu opens and closes on its own. */
export const Uncontrolled: Story = {};

/** The parent owns the open state: `open` and `onOpenChange`. */
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ ...tall, display: 'grid', alignContent: 'start', gap: 'var(--rv-space-3)' }}>
        <span style={text}>Open: {String(open)}</span>
        <div>
          <Menu {...args} open={open} onOpenChange={setOpen}>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
          </Menu>
        </div>
      </div>
    );
  },
};

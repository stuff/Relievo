import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { describe, expect, it, vi } from 'vitest';
import { UiKitProvider, type LinkComponentProps } from '../../provider';
import { Menu, type MenuProps } from './Menu';

async function open(name = 'Actions') {
  await userEvent.click(screen.getByRole('button', { name }));
  return screen.findByRole('menu');
}

describe('Menu', () => {
  it('renders a button that opens a menu', async () => {
    render(
      <Menu label="Actions">
        <Menu.Item>Edit</Menu.Item>
      </Menu>,
    );

    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('data-variant', 'secondary');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await open();

    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onSelect and closes when an item is chosen', async () => {
    const onSelect = vi.fn();
    render(
      <Menu label="Actions">
        <Menu.Item onSelect={onSelect}>Edit</Menu.Item>
      </Menu>,
    );

    await open();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('chooses an item with the keyboard', async () => {
    const onSelect = vi.fn();
    render(
      <Menu label="Actions">
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item onSelect={onSelect}>Duplicate</Menu.Item>
      </Menu>,
    );

    screen.getByRole('button', { name: 'Actions' }).focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('menu');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('renders icons, hidden from assistive technologies', async () => {
    render(
      <Menu label="Actions">
        <Menu.Item startIcon={<PencilSimpleIcon data-testid="icon" />}>Edit</Menu.Item>
      </Menu>,
    );

    await open();

    expect(screen.getByRole('menuitem', { name: 'Edit' })).toContainElement(screen.getByTestId('icon'));
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not choose a disabled item', async () => {
    const onSelect = vi.fn();
    render(
      <Menu label="Actions">
        <Menu.Item disabled onSelect={onSelect}>
          Archive
        </Menu.Item>
      </Menu>,
    );

    await open();
    const item = screen.getByRole('menuitem', { name: 'Archive' });
    await userEvent.click(item);

    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('applies the tone of an item, neutral by default', async () => {
    render(
      <Menu label="Actions">
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item tone="danger">Delete</Menu.Item>
      </Menu>,
    );

    await open();

    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveAttribute('data-tone', 'neutral');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-tone', 'danger');
  });

  it('renders a link item through the router link', async () => {
    const RouterLink = vi.fn((props: LinkComponentProps) => <a {...props} data-router="" />);
    render(
      <UiKitProvider linkComponent={RouterLink}>
        <Menu label="Account">
          <Menu.Item href="/settings">Settings</Menu.Item>
        </Menu>
      </UiKitProvider>,
    );

    await open('Account');
    const link = screen.getByRole('menuitem', { name: 'Settings' });

    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('data-router');
  });

  it('names groups after their label and renders separators', async () => {
    render(
      <Menu label="Actions">
        <Menu.Group label="Edit">
          <Menu.Item>Rename</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Item>Delete</Menu.Item>
      </Menu>,
    );

    await open();

    expect(screen.getByRole('group', { name: 'Edit' })).toContainElement(
      screen.getByRole('menuitem', { name: 'Rename' }),
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('opens a submenu and chooses one of its items', async () => {
    const onSelect = vi.fn();
    render(
      <Menu label="Actions">
        <Menu.Submenu label="Share">
          <Menu.Item onSelect={onSelect}>Copy link</Menu.Item>
        </Menu.Submenu>
      </Menu>,
    );

    await open();
    const share = screen.getByRole('menuitem', { name: 'Share' });
    expect(share).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(share);
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Copy link' }));

    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('toggles a checkbox item and stays open', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Menu label="View">
        <Menu.CheckboxItem defaultChecked onCheckedChange={onCheckedChange}>
          Show grid
        </Menu.CheckboxItem>
      </Menu>,
    );

    await open('View');
    const item = screen.getByRole('menuitemcheckbox', { name: 'Show grid' });
    expect(item).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(item);

    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('chooses one radio item of a group', async () => {
    const onValueChange = vi.fn();
    render(
      <Menu label="Sort">
        <Menu.RadioGroup label="Sort by" defaultValue="name" onValueChange={onValueChange}>
          <Menu.RadioItem value="name">Name</Menu.RadioItem>
          <Menu.RadioItem value="date">Date</Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu>,
    );

    await open('Sort');
    expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Date' }));

    expect(onValueChange).toHaveBeenCalledWith('date');
    expect(screen.getByRole('menuitemradio', { name: 'Date' })).toHaveAttribute('aria-checked', 'true');
  });

  describe('controlled', () => {
    it('opens from the open prop and only reports changes', async () => {
      const onOpenChange = vi.fn();
      render(
        <Menu label="Actions" open onOpenChange={onOpenChange}>
          <Menu.Item>Edit</Menu.Item>
        </Menu>,
      );

      expect(await screen.findByRole('menu')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');

      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it("follows the parent's update", async () => {
      function Controlled() {
        const [isOpen, setOpen] = useState(false);
        return (
          <Menu label="Actions" open={isOpen} onOpenChange={setOpen}>
            <Menu.Item>Edit</Menu.Item>
          </Menu>
        );
      }
      render(<Controlled />);

      await open();

      expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    });
  });

  it('does not open when disabled', async () => {
    render(
      <Menu label="Actions" disabled>
        <Menu.Item>Edit</Menu.Item>
      </Menu>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as MenuProps;
    render(
      <Menu {...props} label="Actions">
        <Menu.Item>Edit</Menu.Item>
      </Menu>,
    );

    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).not.toHaveClass('custom');
    expect(trigger).not.toHaveAttribute('style');
  });
});

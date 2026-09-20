import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { StarIcon } from '@phosphor-icons/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, type TabsProps } from './Tabs';

function Basic(props: Partial<TabsProps> = {}) {
  return (
    <Tabs label="Products" {...props}>
      <Tabs.List>
        <Tabs.Item value="published">Published</Tabs.Item>
        <Tabs.Item value="drafts">Drafts</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="published">On sale</Tabs.Panel>
      <Tabs.Panel value="drafts">Not on sale</Tabs.Panel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tab list named by its label', () => {
    render(<Basic defaultValue="published" />);

    expect(screen.getByRole('tablist', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('shows the panel of the selected tab, and only that one', () => {
    render(<Basic defaultValue="published" />);

    expect(screen.getByRole('tabpanel')).toHaveTextContent('On sale');
    expect(screen.queryByText('Not on sale')).toBeNull();
  });

  it('selects a tab when it is clicked, and swaps the panel', async () => {
    render(<Basic defaultValue="published" />);

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Published' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Not on sale');
  });

  it('links each tab to its panel', () => {
    render(<Basic defaultValue="published" />);

    const tab = screen.getByRole('tab', { name: 'Published' });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', tab.getAttribute('aria-controls'));
  });

  it('moves the selection with the arrow keys', async () => {
    render(<Basic defaultValue="published" />);

    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Published' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{Enter}');

    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses defaultValue as the first selection when uncontrolled', () => {
    render(<Basic defaultValue="drafts" />);

    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders the value prop when controlled, and only reports the change', async () => {
    const onValueChange = vi.fn();
    render(<Basic value="published" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(screen.getByRole('tab', { name: 'Published' })).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onValueChange with the value alone', async () => {
    // A server action or a setState takes one argument: Base UI's event details must not reach it
    const onValueChange = vi.fn();
    render(<Basic defaultValue="published" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(onValueChange.mock.calls[0]).toHaveLength(1);
  });

  it('follows the value prop when the parent updates it', async () => {
    function Controlled() {
      const [value, setValue] = useState('published');
      return (
        <>
          <button type="button" onClick={() => setValue('drafts')}>Go to drafts</button>
          <Basic value={value} onValueChange={setValue} />
        </>
      );
    }
    render(<Controlled />);

    await userEvent.click(screen.getByRole('button', { name: 'Go to drafts' }));

    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('fires onValueChange when uncontrolled too', async () => {
    const onValueChange = vi.fn();
    render(<Basic defaultValue="published" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(screen.getByRole('tab', { name: 'Drafts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('works with no panel at all', async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs label="Products" defaultValue="published" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
          <Tabs.Item value="drafts">Drafts</Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(screen.queryByRole('tabpanel')).toBeNull();
  });

  it('shows nothing when the selected tab has no panel', async () => {
    render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
          <Tabs.Item value="drafts">Drafts</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="published">On sale</Tabs.Panel>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(screen.queryByRole('tabpanel')).toBeNull();
  });

  it('shows the count after the label, as part of the tab name', () => {
    render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published" count={216}>Published</Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Published 216' })).toBeInTheDocument();
  });

  it('draws no count when there is none', () => {
    render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Published' })).toBeInTheDocument();
  });

  it('hides the icon from screen readers', () => {
    const { container } = render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published" startIcon={<StarIcon />}>Published</Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    expect(container.querySelector('svg')?.closest('[aria-hidden]')).not.toBeNull();
    expect(screen.getByRole('tab', { name: 'Published' })).toBeInTheDocument();
  });

  it('cannot select a disabled tab', async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs label="Products" defaultValue="published" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
          <Tabs.Item value="drafts" disabled>Drafts</Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Drafts' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Published' })).toHaveAttribute('aria-selected', 'true');
  });

  it('carries its size on the rail', () => {
    const { container } = render(<Basic defaultValue="published" size="sm" />);

    expect(container.querySelector('[data-size="sm"]')).not.toBeNull();
  });

  it('is md by default', () => {
    const { container } = render(<Basic defaultValue="published" />);

    expect(container.querySelector('[data-size="md"]')).not.toBeNull();
  });

  it('carries the panel variant as an attribute', () => {
    render(
      <Tabs label="Products" defaultValue="published">
        <Tabs.List>
          <Tabs.Item value="published">Published</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="published" variant="framed">On sale</Tabs.Panel>
      </Tabs>,
    );

    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-variant', 'framed');
  });

  it('is a plain panel by default', () => {
    render(<Basic defaultValue="published" />);

    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-variant', 'plain');
  });

  it('ignores className and style passed by untyped callers', () => {
    const props = { className: 'custom', style: { color: 'red' } } as unknown as TabsProps;
    const { container } = render(<Basic defaultValue="published" {...props} />);

    expect(container.querySelector('.custom')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
  });
});

import { useState, type CSSProperties } from 'react';
import {
  ArchiveIcon,
  CheckCircleIcon,
  FolderIcon,
  FunnelIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Card } from '../components/Card';
import { Checkbox } from '../components/Checkbox';
import { Chip } from '../components/Chip';
import { Input } from '../components/Input';
import { Menu } from '../components/Menu';
import { Pagination } from '../components/Pagination';
import { Segmented } from '../components/Segmented';
import { Select } from '../components/Select';

// A realistic screen using every component together, to judge the kit's overall coherence:
// spacing, alignment, sizes, tones and both themes (use the toolbar's Light + Dark mode).

const text: CSSProperties = { margin: 0, fontFamily: 'var(--ui-font-family)', color: 'var(--ui-color-text)' };
const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 'var(--ui-space-3)', alignItems: 'center' };

const stack: CSSProperties = { display: 'grid', gap: 'var(--ui-space-5)' };

// Options as an array, like data from an API (Category above uses Select.Item children)
const suppliers = [
  { value: 'atelier', label: 'Atelier Lin' },
  { value: 'nordic', label: 'Nordic Wool' },
  { value: 'tannery', label: 'Old Tannery' },
];

const products = [
  { name: 'Linen shirt', price: '49 €', status: 'Published', tone: 'success', icon: <CheckCircleIcon /> },
  { name: 'Wool scarf', price: '35 €', status: 'In review', tone: 'info', icon: <InfoIcon /> },
  { name: 'Canvas tote', price: '19 €', status: 'Low stock', tone: 'warning', icon: <WarningIcon /> },
  { name: 'Leather boots', price: '189 €', status: 'Sync failed', tone: 'danger', icon: <XCircleIcon /> },
] as const;

function Overview() {
  const [categories, setCategories] = useState<string[]>(['clothing']);
  const [selected, setSelected] = useState<string[]>(['Canvas tote', 'Leather boots']);
  const allSelected = selected.length === products.length;

  return (
    <div style={{ display: 'grid', gap: 'var(--ui-space-6)', width: 'min(100%, 44rem)' }}>
      {/* A toned card: an alert about the list below */}
      <Card as="section" tone="warning">
        <Card.Header>
          <Card.Title as="h2">2 products need your attention</Card.Title>
          <Card.Description>Canvas tote is low on stock and Leather boots failed to sync.</Card.Description>
        </Card.Header>
        <Card.Footer>
          <ButtonGroup>
            <Button variant="secondary" size="sm">
              Review
            </Button>
            <Button variant="link" size="sm">
              Dismiss
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>

      <Card as="section">
        <Card.Header>
          <Card.Title as="h2">Products</Card.Title>
        </Card.Header>
        <Card.Body>
          <div style={stack}>
            {/* Toolbar: search next to buttons, all at the md control height */}
            <div style={{ display: 'flex', gap: 'var(--ui-space-3)', alignItems: 'end' }}>
              <Input label="Search products" hideLabel placeholder="Search…" type="search" startIcon={<MagnifyingGlassIcon />} />
              <Button variant="secondary" startIcon={<FunnelIcon />}>
                Filters
              </Button>
              <Button startIcon={<PlusIcon />}>New product</Button>
            </div>

            <div style={{ display: 'grid', gap: 'var(--ui-space-3)' }}>
              <Chip.Group label="Categories" value={categories} onValueChange={setCategories}>
                <Chip value="clothing">Clothing</Chip>
                <Chip value="accessories">Accessories</Chip>
                <Chip value="shoes">Shoes</Chip>
                <Chip value="bags">Bags</Chip>
              </Chip.Group>
              <Segmented label="Sort by" defaultValue="recent" size="sm">
                <Segmented.Item value="recent">Most recent</Segmented.Item>
                <Segmented.Item value="price">Price</Segmented.Item>
                <Segmented.Item value="stock">Stock</Segmented.Item>
              </Segmented>
            </div>

            {/* List: a checkbox per row, status chips next to text and a link button */}
            <div style={{ display: 'grid' }}>
              {/* Selection: select all, and a menu of actions on the selected products */}
              <div style={{ ...row, justifyContent: 'space-between', paddingBlock: 'var(--ui-space-3)' }}>
                <Checkbox
                  label={`${selected.length} selected`}
                  checked={allSelected}
                  indeterminate={selected.length > 0 && !allSelected}
                  onCheckedChange={(checked) => setSelected(checked ? products.map((product) => product.name) : [])}
                />
                <Menu label="Actions" disabled={selected.length === 0}>
                  <Menu.Item startIcon={<CheckCircleIcon />}>Publish</Menu.Item>
                  <Menu.Item startIcon={<ArchiveIcon />}>Archive</Menu.Item>
                  <Menu.Submenu label="Move to" startIcon={<FolderIcon />}>
                    <Menu.Item>Clothing</Menu.Item>
                    <Menu.Item>Accessories</Menu.Item>
                    <Menu.Item>Shoes</Menu.Item>
                  </Menu.Submenu>
                  <Menu.Separator />
                  <Menu.Item tone="danger" startIcon={<TrashIcon />}>
                    Delete
                  </Menu.Item>
                </Menu>
              </div>
              {products.map((product) => (
                <div
                  key={product.name}
                  style={{
                    ...row,
                    flexWrap: 'nowrap',
                    paddingBlock: 'var(--ui-space-3)',
                    borderTop: '1px solid var(--ui-color-border)',
                  }}
                >
                  <Checkbox
                    label={`Select ${product.name}`}
                    hideLabel
                    checked={selected.includes(product.name)}
                    onCheckedChange={(checked) =>
                      setSelected((current) =>
                        checked ? [...current, product.name] : current.filter((name) => name !== product.name),
                      )
                    }
                  />
                  <span style={{ ...text, flex: 1, fontWeight: 500 }}>{product.name}</span>
                  <span style={{ ...text, width: '4rem', textAlign: 'end' }}>{product.price}</span>
                  <span style={{ width: '8.5rem' }}>
                    <Chip tone={product.tone} size="sm" startIcon={product.icon}>
                      {product.status}
                    </Chip>
                  </span>
                  <Button variant="link" size="sm" startIcon={<PencilSimpleIcon />}>
                    Edit
                  </Button>
                </div>
              ))}
            </div>
            <Pagination label="Products pages" pageCount={8} defaultPage={1} />
          </div>
        </Card.Body>
      </Card>

      <Card as="section">
        <Card.Header>
          <Card.Title as="h2">Edit product</Card.Title>
        </Card.Header>
        <Card.Body>
          <div style={stack}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--ui-space-5)' }}>
              <Input label="Name" defaultValue="Linen shirt" helperText="Shown on the product page." />
              <Input label="Price" type="number" defaultValue="49" suffix="€" />
              <Select label="Category" defaultValue="clothing">
                <Select.Item value="clothing">Clothing</Select.Item>
                <Select.Item value="accessories">Accessories</Select.Item>
                <Select.Item value="shoes">Shoes</Select.Item>
                <Select.Item value="bags">Bags</Select.Item>
              </Select>
              <Select label="Supplier" placeholder="Choose a supplier" options={suppliers} />
              <Input label="Website" placeholder="acme" prefix="https://" suffix=".com" />
              <Input label="Contact email" type="email" defaultValue="not-an-email" error helperText="Enter an email address, like jane@example.com." />
              <Input label="SKU" defaultValue="LS-0042" disabled helperText="Generated automatically." />
              <div style={{ display: 'grid', gap: 'var(--ui-space-2)', alignContent: 'start' }}>
                <span style={{ ...text, fontSize: 'var(--ui-font-size-sm)', fontWeight: 500 }}>Tags</span>
                <div style={row}>
                  <Chip tone="primary">New</Chip>
                  <Chip>Summer</Chip>
                  <Chip variant="outline">Organic</Chip>
                  <Chip disabled>Archived</Chip>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 'var(--ui-space-3)' }}>
              <Checkbox label="Show in the shop" defaultChecked helperText="Customers can find and buy it." />
              <Checkbox label="Feature on the home page" />
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <ButtonGroup>
            <Button variant="link">Cancel</Button>
            <Button variant="secondary">Save draft</Button>
            <Button>Publish</Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>

      <Card as="section">
        <Card.Header>
          <Card.Title as="h2">Sizes side by side</Card.Title>
        </Card.Header>
        <Card.Body>
          <div style={stack}>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size} style={row}>
                <Button size={size} startIcon={<PlusIcon />}>
                  Button {size}
                </Button>
                <Button size={size} variant="secondary">
                  Secondary
                </Button>
                <Segmented label={`View (${size})`} size={size} defaultValue="grid">
                  <Segmented.Item value="list">List</Segmented.Item>
                  <Segmented.Item value="grid">Grid</Segmented.Item>
                </Segmented>
                <Chip size={size} tone="primary">
                  Chip {size}
                </Chip>
                {size === 'md' && (
                  <span style={{ width: '12rem' }}>
                    <Input label="Input" hideLabel placeholder="Input (md only)" />
                  </span>
                )}
              </div>
            ))}
            <div style={row}>
              <Chip size="xs">Chip xs</Chip>
              <Chip size="sm">Chip sm</Chip>
              <Chip size="md">Chip md</Chip>
              <Chip size="lg">Chip lg</Chip>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

const meta = {
  title: 'Overview/All components',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllComponents: Story = {
  render: () => <Overview />,
};

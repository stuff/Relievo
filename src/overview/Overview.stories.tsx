import { useState, type CSSProperties } from 'react';
import {
  ArchiveIcon,
  CheckCircleIcon,
  FolderIcon,
  FunnelIcon,
  InfoIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../components/Alert';
import { Box } from '../components/Box';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Card } from '../components/Card';
import { Checkbox } from '../components/Checkbox';
import { Chip } from '../components/Chip';
import { Input } from '../components/Input';
import { Link } from '../components/Link';
import { Menu } from '../components/Menu';
import { Pagination } from '../components/Pagination';
import { Segmented } from '../components/Segmented';
import { Select } from '../components/Select';
import { Stack } from '../components/Stack';
import { Tabs } from '../components/Tabs';
import { Textarea } from '../components/Textarea';

// A realistic screen using every component together, to judge the kit's overall coherence:
// spacing, alignment, sizes, tones and both themes (use the toolbar's Light + Dark mode).

const text: CSSProperties = { margin: 0, fontFamily: 'var(--rv-font-family)', color: 'var(--rv-color-text)' };
const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 'var(--rv-space-3)', alignItems: 'center' };

const stack: CSSProperties = { display: 'grid', gap: 'var(--rv-space-5)' };

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
  const [search, setSearch] = useState('linen');
  const allSelected = selected.length === products.length;

  return (
    <div style={{ display: 'grid', gap: 'var(--rv-space-6)', width: 'min(100%, 44rem)' }}>
      {/* A message about what just happened, above the page's content */}
      <Alert tone="success" onClose={() => {}}>
        Prices updated for 3 products.
      </Alert>

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

      {/* Tabs over the list: the rail is a wide secondary button, the current tab the
          primary fill. Its panel holds the card below. */}
      <Tabs label="Products" defaultValue="all">
        <Tabs.List>
          <Tabs.Item value="all" startIcon={<ListIcon />}>All 4</Tabs.Item>
          <Tabs.Item value="low" startIcon={<WarningIcon />}>Low stock 1</Tabs.Item>
          <Tabs.Item value="archived" startIcon={<ArchiveIcon />}>Archived 0</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="all">
      <Card as="section">
        <Card.Header>
          <Card.Title as="h2">Products</Card.Title>
        </Card.Header>
        <Card.Body>
          <div style={stack}>
            {/* Toolbar: search next to buttons, all at the md control height */}
            <div style={{ display: 'flex', gap: 'var(--rv-space-3)', alignItems: 'end' }}>
              <Input
                label="Search products"
                hideLabel
                placeholder="Search…"
                type="search"
                startIcon={<MagnifyingGlassIcon />}
                value={search}
                onValueChange={setSearch}
                endAction={
                  search ? (
                    <Input.Action label="Clear the search" icon={<XIcon />} onClick={() => setSearch('')} />
                  ) : undefined
                }
              />
              <Button variant="secondary" startIcon={<FunnelIcon />}>
                Filters
              </Button>
              <Button startIcon={<PlusIcon />}>New product</Button>
            </div>

            <Stack gap="sm">
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
            </Stack>

            {/* List: a checkbox per row, status chips next to text and a link button, lines between rows */}
            <Stack gap="sm" separator>
              {/* Selection: select all, and a menu of actions on the selected products */}
              <div style={{ ...row, justifyContent: 'space-between' }}>
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
                  style={{ ...row, flexWrap: 'nowrap' }}
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
            </Stack>
            <Pagination label="Products pages" pageCount={8} defaultPage={1} />
          </div>
        </Card.Body>
      </Card>
        </Tabs.Panel>
        <Tabs.Panel value="low" variant="framed">Canvas tote is down to 3 units.</Tabs.Panel>
        <Tabs.Panel value="archived" variant="framed">Nothing archived yet.</Tabs.Panel>
      </Tabs>

      <Card as="section">
        <Card.Header>
          <Card.Title as="h2">Edit product</Card.Title>
        </Card.Header>
        <Card.Body>
          <div style={stack}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--rv-space-5)' }}>
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
              <div style={{ display: 'grid', gap: 'var(--rv-space-2)', alignContent: 'start' }}>
                <span style={{ ...text, fontSize: 'var(--rv-font-size-sm)', fontWeight: 500 }}>Tags</span>
                <div style={row}>
                  <Chip tone="primary">New</Chip>
                  <Chip>Summer</Chip>
                  <Chip variant="outline">Organic</Chip>
                  <Chip disabled>Archived</Chip>
                </div>
              </div>
            </div>
            <Textarea
              label="Description"
              defaultValue="A linen shirt with a relaxed fit, mother-of-pearl buttons and a single chest pocket."
              helperText="Shown on the product page, under the price."
            />
            <Stack gap="sm">
              <Checkbox label="Show in the shop" defaultChecked helperText="Customers can find and buy it." />
              <Checkbox label="Feature on the home page" />
            </Stack>
            {/* A plain bordered container: a side note, not a panel of its own */}
            <Box as="aside" border padding="md">
              <p style={text}>
                Photos and videos are managed in the <Link href="#media">media library</Link>, and
                the guidelines live on{' '}
                <Link href="https://example.com" external>the brand site</Link>.
              </p>
            </Box>
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

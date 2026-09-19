import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  CheckCircleIcon,
  FunnelIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Input } from '../components/Input';
import { Segmented } from '../components/Segmented';

// A realistic screen using every component together, to judge the kit's overall coherence:
// spacing, alignment, sizes, tones and both themes (use the toolbar's Light + Dark mode).

const text: CSSProperties = { margin: 0, fontFamily: 'var(--ui-font-family)', color: 'var(--ui-color-text)' };
const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 'var(--ui-space-3)', alignItems: 'center' };

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 'var(--ui-space-5)',
        padding: 'var(--ui-space-6)',
        borderRadius: 'var(--ui-radius-lg)',
        border: '1px solid var(--ui-color-border)',
        background: 'var(--ui-color-surface)',
      }}
    >
      <h2 style={{ ...text, fontSize: 'var(--ui-font-size-lg)', fontWeight: 600 }}>{title}</h2>
      {children}
    </section>
  );
}

const products = [
  { name: 'Linen shirt', price: '49 €', status: 'Published', tone: 'success', icon: <CheckCircleIcon /> },
  { name: 'Wool scarf', price: '35 €', status: 'In review', tone: 'info', icon: <InfoIcon /> },
  { name: 'Canvas tote', price: '19 €', status: 'Low stock', tone: 'warning', icon: <WarningIcon /> },
  { name: 'Leather boots', price: '189 €', status: 'Sync failed', tone: 'danger', icon: <XCircleIcon /> },
] as const;

function Overview() {
  const [categories, setCategories] = useState<string[]>(['clothing']);

  return (
    <div style={{ display: 'grid', gap: 'var(--ui-space-6)', width: 'min(100%, 44rem)' }}>
      <Card title="Products">
        {/* Toolbar: search next to buttons, all at the md control height */}
        <div style={{ display: 'flex', gap: 'var(--ui-space-3)', alignItems: 'end' }}>
          <Input label="Search products" hideLabel placeholder="Search…" type="search" startIcon={<MagnifyingGlassIcon />} />
          <Button variant="secondary" startIcon={<FunnelIcon />}>
            Filters
          </Button>
          <Button startIcon={<PlusIcon />}>New product</Button>
        </div>

        <div style={{ display: 'grid', gap: 'var(--ui-space-3)' }}>
          <Chip.Group label="Categories" multiple value={categories} onValueChange={setCategories}>
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

        {/* List: status chips next to text and a link button */}
        <div style={{ display: 'grid' }}>
          {products.map((product, index) => (
            <div
              key={product.name}
              style={{
                ...row,
                flexWrap: 'nowrap',
                paddingBlock: 'var(--ui-space-3)',
                borderTop: index === 0 ? undefined : '1px solid var(--ui-color-border)',
              }}
            >
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
      </Card>

      <Card title="Edit product">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--ui-space-5)' }}>
          <Input label="Name" defaultValue="Linen shirt" helperText="Shown on the product page." />
          <Input label="Price" type="number" defaultValue="49" suffix="€" />
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
        <div style={{ ...row, justifyContent: 'flex-end' }}>
          <Button variant="link">Cancel</Button>
          <Button variant="secondary">Save draft</Button>
          <Button>Publish</Button>
        </div>
      </Card>

      <Card title="Sizes side by side">
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

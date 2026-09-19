import { LockIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Input } from '../Input';
import { Card, type CardProps, type CardTone } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  subcomponents: {
    'Card.Header': Card.Header,
    'Card.Title': Card.Title,
    'Card.Description': Card.Description,
    'Card.Body': Card.Body,
    'Card.Footer': Card.Footer,
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters }) => (
      <div style={{ maxWidth: parameters.maxWidth ?? '24rem' }}>
        <Story />
      </div>
    ),
  ],
  render: (args: CardProps) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Card with footer</Card.Title>
        <Card.Description>Complete card layout</Card.Description>
      </Card.Header>
      <Card.Body>Main content area.</Card.Body>
      <Card.Footer>Footer actions go here</Card.Footer>
    </Card>
  ),
} satisfies Meta<CardProps>;

export default meta;
// CardProps is a union (icon only with a status tone): type the stories with it directly
type Story = StoryObj<CardProps>;

export const Default: Story = {};

/** A form in the body, its actions in the footer. */
export const WithActions: Story = {
  render: (args: CardProps) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Invite a teammate</Card.Title>
        <Card.Description>They will be able to edit this project.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Input label="Email" type="email" placeholder="jane@example.com" />
      </Card.Body>
      <Card.Footer>
        <ButtonGroup>
          <Button variant="secondary">Cancel</Button>
          <Button startIcon={<PlusIcon />}>Invite</Button>
        </ButtonGroup>
      </Card.Footer>
    </Card>
  ),
};

const tones: { tone: CardTone; title: string }[] = [
  { tone: 'neutral', title: 'Project summary' },
  { tone: 'primary', title: 'New feature' },
  { tone: 'info', title: 'Maintenance on Sunday' },
  { tone: 'success', title: 'Payment received' },
  { tone: 'warning', title: 'Storage almost full' },
  { tone: 'danger', title: 'Payment failed' },
];

/**
 * The border takes the tone; the top of the card and its top-right corner a light tint of it, with
 * the tone's icon. The title says the same thing as the color: color alone does not carry meaning.
 */
export const Tones: Story = {
  parameters: { maxWidth: '50rem' },
  render: (args: CardProps) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))', gap: 'var(--rv-space-4)' }}>
      {tones.map(({ tone, title }) => (
        <Card key={tone} variant={args.variant} {...({ tone } as CardProps)}>
          <Card.Header>
            <Card.Title>{title}</Card.Title>
            <Card.Description>Tone: {tone}</Card.Description>
          </Card.Header>
          <Card.Body>Main content area.</Card.Body>
        </Card>
      ))}
    </div>
  ),
};

/** `outline` has no fill: the card shows whatever is behind it, with a lighter tint at the top. */
export const Outline: Story = {
  ...Tones,
  args: { variant: 'outline' },
};

/** `icon` replaces the tone's icon with any icon. */
export const CustomIcon: Story = {
  render: () => (
    <Card tone="info" icon={<LockIcon />}>
      <Card.Header>
        <Card.Title>Private project</Card.Title>
        <Card.Description>Only invited members can see it.</Card.Description>
      </Card.Header>
      <Card.Body>Main content area.</Card.Body>
    </Card>
  ),
};

/** `icon={false}` removes the tone's icon. */
export const WithoutIcon: Story = {
  render: () => (
    <Card tone="success" icon={false}>
      <Card.Header>
        <Card.Title>Payment received</Card.Title>
        <Card.Description>Thank you for your order.</Card.Description>
      </Card.Header>
      <Card.Body>Main content area.</Card.Body>
    </Card>
  ),
};

/** Every part is optional. */
export const BodyOnly: Story = {
  render: (args: CardProps) => (
    <Card {...args}>
      <Card.Body>A card with a body and nothing else.</Card.Body>
    </Card>
  ),
};

/** `as="article"` or `as="section"`: screen readers name the card after its title. */
export const AsArticle: Story = {
  args: { as: 'article' },
};

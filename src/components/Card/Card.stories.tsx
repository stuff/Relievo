import { PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Input } from '../Input';
import { Card, type CardTone } from './Card';

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
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Card with footer</Card.Title>
        <Card.Description>Complete card layout</Card.Description>
      </Card.Header>
      <Card.Body>Main content area.</Card.Body>
      <Card.Footer>Footer actions go here</Card.Footer>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A form in the body, its actions in the footer. */
export const WithActions: Story = {
  render: (args) => (
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
 * The border takes the tone; the top of the card and its top-right corner a light tint of it.
 * The title says the same thing as the color: color alone does not carry meaning.
 */
export const Tones: Story = {
  parameters: { maxWidth: '50rem' },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))', gap: 'var(--ui-space-4)' }}>
      {tones.map(({ tone, title }) => (
        <Card key={tone} {...args} tone={tone}>
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

/** Every part is optional. */
export const BodyOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Body>A card with a body and nothing else.</Card.Body>
    </Card>
  ),
};

/** `as="article"` or `as="section"`: screen readers name the card after its title. */
export const AsArticle: Story = {
  args: { as: 'article' },
};

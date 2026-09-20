import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card';
import { Link } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: { href: '#somewhere', children: 'the linen shirt' },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: '32rem',
          fontFamily: 'var(--rv-font-family)',
          color: 'var(--rv-color-text)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <p style={{ margin: 0 }}>
      The order holds <Link {...args} /> and two pairs of socks.
    </p>
  ),
};

/** `primary` is the brand color, `neutral` the text color for a place that is already busy. */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--rv-space-3)' }}>
      <p style={{ margin: 0 }}>
        Primary: the order holds <Link {...args} tone="primary" /> and two pairs of socks.
      </p>
      <p style={{ margin: 0 }}>
        Neutral: the order holds <Link {...args} tone="neutral" /> and two pairs of socks.
      </p>
    </div>
  ),
};

/** `external` opens a new tab and says so with an arrow, before the click. */
export const External: Story = {
  render: (args) => (
    <p style={{ margin: 0 }}>
      The fabric comes from{' '}
      <Link {...args} href="https://example.com" external>
        a mill in Normandy
      </Link>
      , which publishes its sources.
    </p>
  ),
};

/**
 * The link has no size of its own: it takes the type of whatever holds it. The same component is
 * a card title, a line of body text and a small meta line.
 */
export const InheritsTheType: Story = {
  render: (args) => (
    <Card as="article">
      <Card.Header>
        <Card.Title as="h2">
          <Link {...args} href="#offer">Fullstack engineer — two days from home</Link>
        </Card.Title>
        <Card.Description>
          Ortec · Paris ·{' '}
          <Link {...args} href="#application" tone="neutral">already applied</Link>
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <p style={{ margin: 0 }}>
          The grid kept this one. <Link {...args} href="#grid">See why</Link>, or open{' '}
          <Link {...args} href="https://example.com" external>the ad itself</Link>.
        </p>
      </Card.Body>
    </Card>
  ),
};

/** In a long paragraph: the underline is offset, so it clears the descenders. */
export const InAParagraph: Story = {
  render: (args) => (
    <p style={{ margin: 0, lineHeight: 1.6 }}>
      A linen shirt with a relaxed fit, mother-of-pearl buttons and a single chest pocket, washed
      for softness. It is cut from <Link {...args} href="#fabric">a heavy Japanese linen</Link> that
      keeps its shape, and it is the piece{' '}
      <Link {...args} href="#reviews">everybody judges the range by</Link>. Wash it cold, hang it
      to dry.
    </p>
  ),
};

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LockIcon } from '@phosphor-icons/react';
import { Card, type CardProps, type CardTitleProps } from './Card';

function FullCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Team</Card.Title>
        <Card.Description>People who can edit this project.</Card.Description>
      </Card.Header>
      <Card.Body>Main content</Card.Body>
      <Card.Footer>Footer content</Card.Footer>
    </Card>
  );
}

describe('Card', () => {
  it('renders the header, body and footer in order', () => {
    const { container } = render(<FullCard />);

    const card = container.firstElementChild!;
    const [header, body, footer] = Array.from(card.children);
    expect(header).toHaveTextContent('TeamPeople who can edit this project.');
    expect(body).toHaveTextContent('Main content');
    expect(footer).toHaveTextContent('Footer content');
  });

  it('renders the title as a level 3 heading by default', () => {
    render(<FullCard />);

    expect(screen.getByRole('heading', { level: 3, name: 'Team' })).toBeInTheDocument();
  });

  it('renders the title as the given heading element', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title as="h2">Team</Card.Title>
        </Card.Header>
      </Card>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Team' })).toBeInTheDocument();
  });

  it('renders the title as a level 1 heading when the card is the page', () => {
    render(
      <Card as="article">
        <Card.Header>
          <Card.Title as="h1">Order 1042</Card.Title>
        </Card.Header>
      </Card>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Order 1042' })).toBeInTheDocument();
  });

  it('renders a div by default, without a name', () => {
    const { container } = render(<FullCard />);

    const card = container.firstElementChild!;
    expect(card.tagName).toBe('DIV');
    expect(card).not.toHaveAttribute('aria-labelledby');
  });

  it.each([
    ['article', 'article'],
    ['section', 'region'],
  ] as const)('renders an %s named by its title', (element, role) => {
    render(
      <Card as={element}>
        <Card.Header>
          <Card.Title>Team</Card.Title>
        </Card.Header>
        <Card.Body>Main content</Card.Body>
      </Card>,
    );

    const card = screen.getByRole(role, { name: 'Team' });
    expect(card.tagName).toBe(element.toUpperCase());
  });

  it('does not name an article without a title', () => {
    render(
      <Card as="article">
        <Card.Body>Main content</Card.Body>
      </Card>,
    );

    expect(screen.getByRole('article')).not.toHaveAttribute('aria-labelledby');
  });

  it('applies the tone, neutral by default', () => {
    const { container } = render(
      <>
        <Card>
          <Card.Body>Neutral</Card.Body>
        </Card>
        <Card tone="danger">
          <Card.Body>Danger</Card.Body>
        </Card>
      </>,
    );

    const [neutral, danger] = Array.from(container.children);
    expect(neutral).toHaveAttribute('data-tone', 'neutral');
    expect(danger).toHaveAttribute('data-tone', 'danger');
  });

  it('renders the aside in the header, after the title, without changing the name', () => {
    render(
      <Card as="article">
        <Card.Header aside={<span>Shipped</span>}>
          <Card.Title>Order 1042</Card.Title>
          <Card.Description>3 items</Card.Description>
        </Card.Header>
      </Card>,
    );

    const title = screen.getByRole('heading', { name: 'Order 1042' });
    const aside = screen.getByText('Shipped');
    expect(title.compareDocumentPosition(aside) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('article', { name: 'Order 1042' })).toBeInTheDocument();
  });

  it('renders the description as a paragraph', () => {
    render(<FullCard />);

    expect(screen.getByText('People who can edit this project.').tagName).toBe('P');
  });

  describe('corner icon', () => {
    it("shows the tone's icon by default, hidden from assistive technologies", () => {
      const { container } = render(
        <Card tone="warning">
          <Card.Body>Low stock</Card.Body>
        </Card>,
      );

      const slot = container.querySelector('svg')!.parentElement!;
      expect(slot).toHaveAttribute('aria-hidden', 'true');
    });

    it('shows no icon on a neutral card', () => {
      const { container } = render(
        <Card>
          <Card.Body>Summary</Card.Body>
        </Card>,
      );

      expect(container.querySelector('svg')).toBeNull();
    });

    it('replaces the icon with the given element', () => {
      render(
        <Card tone="info" icon={<LockIcon data-testid="lock" />}>
          <Card.Body>Private</Card.Body>
        </Card>,
      );

      expect(screen.getByTestId('lock')).toBeInTheDocument();
      expect(document.querySelectorAll('svg')).toHaveLength(1);
    });

    it('removes the icon with icon={false}', () => {
      const { container } = render(
        <Card tone="success" icon={false}>
          <Card.Body>Paid</Card.Body>
        </Card>,
      );

      expect(container.querySelector('svg')).toBeNull();
    });

    it('only accepts icon with a status tone', () => {
      // Type-level checks: typecheck fails if these become valid
      // @ts-expect-error icon needs a tone other than neutral
      const noTone = <Card icon={false} />;
      // @ts-expect-error icon needs a tone other than neutral
      const neutral = <Card tone="neutral" icon={<LockIcon />} />;

      expect([noTone, neutral]).toHaveLength(2);
    });
  });

  it('applies the variant, solid by default', () => {
    const { container } = render(
      <>
        <Card>
          <Card.Body>Solid</Card.Body>
        </Card>
        <Card variant="outline">
          <Card.Body>Outline</Card.Body>
        </Card>
      </>,
    );

    const [solid, outline] = Array.from(container.children);
    expect(solid).toHaveAttribute('data-variant', 'solid');
    expect(outline).toHaveAttribute('data-variant', 'outline');
  });

  it('ignores className and style passed by untyped callers', () => {
    const locked = { className: 'custom', style: { color: 'red' } };
    const { container } = render(
      <Card {...(locked as unknown as CardProps)}>
        <Card.Header {...(locked as unknown as CardProps)}>
          <Card.Title {...(locked as unknown as CardTitleProps)}>Team</Card.Title>
          <Card.Description {...(locked as unknown as CardProps)}>Description</Card.Description>
        </Card.Header>
        <Card.Body {...(locked as unknown as CardProps)}>Body</Card.Body>
        <Card.Footer {...(locked as unknown as CardProps)}>Footer</Card.Footer>
      </Card>,
    );

    for (const element of Array.from(container.querySelectorAll('*'))) {
      expect(element).not.toHaveClass('custom');
      expect(element).not.toHaveAttribute('style');
    }
  });
});

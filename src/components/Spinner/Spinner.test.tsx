import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders a ring, hidden from assistive technologies once wrapped in an icon slot', () => {
    const { container } = render(
      <span aria-hidden>
        <Spinner />
      </span>,
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument();
  });
});

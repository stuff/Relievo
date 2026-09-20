import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as client from './client';
import * as entry from './index';

// The parts of compound components: exported by ./client, reached through the dot notation only
const parts: Record<string, Record<string, unknown>> = {
  Card: {
    Header: client.CardHeader,
    Title: client.CardTitle,
    Description: client.CardDescription,
    Body: client.CardBody,
    Footer: client.CardFooter,
  },
  Chip: { Group: client.ChipGroup },
  Input: { Action: client.InputAction },
  Menu: {
    Item: client.MenuItem,
    Group: client.MenuGroup,
    Separator: client.MenuSeparator,
    Submenu: client.MenuSubmenu,
    CheckboxItem: client.MenuCheckboxItem,
    RadioGroup: client.MenuRadioGroup,
    RadioItem: client.MenuRadioItem,
  },
  Segmented: { Item: client.SegmentedItem },
  Select: { Item: client.SelectItem, Group: client.SelectGroup },
  Tabs: { List: client.TabsList, Item: client.TabsItem, Panel: client.TabsPanel },
};

const partNames = Object.values(parts).flatMap((p) =>
  Object.values(p).map((component) => (component as { name: string }).name),
);

describe('package entry', () => {
  it('exports everything the client module exports, except the parts', () => {
    const fromClient = Object.keys(client).filter((name) => !partNames.includes(name));
    expect(Object.keys(entry).sort()).toEqual(fromClient.sort());
  });

  it('attaches each part to its compound component as the client export itself', () => {
    for (const [component, componentParts] of Object.entries(parts)) {
      const wrapper = (entry as unknown as Record<string, Record<string, unknown>>)[component];
      for (const [part, clientPart] of Object.entries(componentParts)) {
        // The same reference: in a Server Component, this is what crosses the boundary
        expect(wrapper[part], `${component}.${part}`).toBe(clientPart);
      }
    }
  });

  it('renders a compound component through the dot notation', () => {
    render(
      <entry.Card as="article">
        <entry.Card.Header>
          <entry.Card.Title>Team</entry.Card.Title>
        </entry.Card.Header>
        <entry.Card.Body>Main content</entry.Card.Body>
      </entry.Card>,
    );

    expect(screen.getByRole('article', { name: 'Team' })).toHaveTextContent('Main content');
  });
});

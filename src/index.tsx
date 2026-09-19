// The package entry. It has no 'use client' directive and must stay free of hooks, state and
// context: in a React Server Components app it runs on the server as well as in the browser.
//
// Everything is implemented in ./client ('use client'). A Server Component only sees an export
// of a client module as an opaque reference: properties attached to it, such as `Card.Header`,
// do not cross the boundary and come out undefined. So compound components are rebuilt here: a
// thin wrapper rendering the client root, with each part attached as its own client reference.
// `<Card.Body>` then works in Server and Client Components alike.
//
// Every public export of ./client must be listed here (index.test.tsx checks it).
import {
  Card as CardRoot,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip as ChipRoot,
  ChipGroup,
  Input as InputRoot,
  InputAction,
  Menu as MenuRoot,
  MenuCheckboxItem,
  MenuGroup,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSubmenu,
  Segmented as SegmentedRoot,
  SegmentedItem,
  Select as SelectRoot,
  SelectGroup,
  SelectItem,
  type CardProps,
  type ChipProps,
  type InputProps,
  type MenuProps,
  type SegmentedProps,
  type SelectProps,
} from './client';

export {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Pagination,
  RelievoProvider,
  Textarea,
  ThemeProvider,
  useTheme,
} from './client';
export type * from './client';

export function Card(props: CardProps) {
  return <CardRoot {...props} />;
}
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export function Chip(props: ChipProps) {
  return <ChipRoot {...props} />;
}
Chip.Group = ChipGroup;

export function Input(props: InputProps) {
  return <InputRoot {...props} />;
}
Input.Action = InputAction;

export function Menu(props: MenuProps) {
  return <MenuRoot {...props} />;
}
Menu.Item = MenuItem;
Menu.Group = MenuGroup;
Menu.Separator = MenuSeparator;
Menu.Submenu = MenuSubmenu;
Menu.CheckboxItem = MenuCheckboxItem;
Menu.RadioGroup = MenuRadioGroup;
Menu.RadioItem = MenuRadioItem;

export function Segmented(props: SegmentedProps) {
  return <SegmentedRoot {...props} />;
}
Segmented.Item = SegmentedItem;

export function Select(props: SelectProps) {
  return <SelectRoot {...props} />;
}
Select.Item = SelectItem;
Select.Group = SelectGroup;

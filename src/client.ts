// The kit's implementation, built as `client.js` with a 'use client' banner (see vite.config.ts).
// Apps import the package entry, src/index.tsx, which re-exports this module.

// The kit's typeface. External to the bundle: the app's bundler serves the font files.
import '@fontsource-variable/geist';
import './styles/tokens.scss';
import './styles/global.scss';
import { Card } from './components/Card';
import { Chip } from './components/Chip';
import { Input } from './components/Input';
import { Menu } from './components/Menu';
import { Segmented } from './components/Segmented';
import { Select } from './components/Select';

export * from './components/Box';
export * from './components/Button';
export * from './components/ButtonGroup';
export * from './components/Card';
export * from './components/Checkbox';
export * from './components/Chip';
export * from './components/Input';
export * from './components/Menu';
export * from './components/Pagination';
export * from './components/Segmented';
export * from './components/Select';
export * from './components/Stack';
export * from './components/Textarea';
export * from './provider';
export * from './theme';

// The parts of compound components, as named exports: in a Server Component, each one is then a
// client reference of its own, from which src/index.tsx rebuilds the dot notation. They are
// declared here rather than exported by the component files: Storybook names a component after
// its export in its code snippets, which would then show `<CardHeader>` instead of `<Card.Header>`.
export const CardHeader = Card.Header;
export const CardTitle = Card.Title;
export const CardDescription = Card.Description;
export const CardBody = Card.Body;
export const CardFooter = Card.Footer;
export const ChipGroup = Chip.Group;
export const InputAction = Input.Action;
export const MenuItem = Menu.Item;
export const MenuGroup = Menu.Group;
export const MenuSeparator = Menu.Separator;
export const MenuSubmenu = Menu.Submenu;
export const MenuCheckboxItem = Menu.CheckboxItem;
export const MenuRadioGroup = Menu.RadioGroup;
export const MenuRadioItem = Menu.RadioItem;
export const SelectItem = Select.Item;
export const SelectGroup = Select.Group;
export const SegmentedItem = Segmented.Item;

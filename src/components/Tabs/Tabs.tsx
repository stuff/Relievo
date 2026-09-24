import { createContext, use, type ReactElement, type ReactNode } from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { IconSlot } from '../../internal/IconSlot';
import styles from './Tabs.module.scss';

export type TabsSize = 'sm' | 'md';
export type TabsPanelVariant = 'plain' | 'framed';

export interface TabsProps {
  /**
   * The accessible name of the tab list: what the tabs are about ("Offers", "Settings"). It is
   * not shown; give the group a visible heading as well when the page needs one.
   */
  label: string;
  /**
   * The height of the bar, on the kit's control scale: `sm` (2rem) and `md` (2.5rem) line up with
   * a `Button` of the same size. A tab bar heading a page is never taller than that, so there is
   * no `lg`.
   * @default 'md'
   */
  size?: TabsSize;
  /**
   * The selected tab. Use it with `onValueChange` to own the selection: the bar then shows this
   * value and nothing else, and reports what the user asked for.
   */
  value?: string;
  /**
   * The tab selected at first, when you do not own the selection. The bar keeps track of it
   * afterwards.
   */
  defaultValue?: string;
  /**
   * Called with the value of the tab the user selected, in both modes. It is the way out of the
   * component: use it to react to a change, or to navigate elsewhere.
   */
  onValueChange?: (value: string) => void;
  /**
   * A `Tabs.List` holding the `Tabs.Item`s, then one `Tabs.Panel` per tab. A tab with no panel
   * shows nothing, which is what you want when the selection drives the page instead.
   */
  children?: ReactNode;
}

export interface TabsListProps {
  /**
   * The `Tabs.Item`s, in the order they are read.
   */
  children?: ReactNode;
}

export interface TabsItemProps {
  /**
   * What this tab stands for, matched against the root's `value` and against a `Tabs.Panel`.
   */
  value: string;
  /**
   * The label of the tab. A count goes in it, as text: `To review 216`.
   */
  children?: ReactNode;
  /**
   * Decorative icon before the label, as an element: `startIcon={<StarIcon />}`.
   */
  startIcon?: ReactElement;
  /**
   * Whether the tab cannot be selected.
   * @default false
   */
  disabled?: boolean;
}

export interface TabsPanelProps {
  /**
   * The tab this panel belongs to. It shows when that tab is selected.
   */
  value: string;
  /**
   * How the panel is drawn: `plain` is the bare content, `framed` puts it on a panel with the
   * surface and border of a `Card`.
   * @default 'plain'
   */
  variant?: TabsPanelVariant;
  children?: ReactNode;
}

interface TabsContextValue {
  size: TabsSize;
  label: string;
}

const TabsContext = createContext<TabsContextValue>({ size: 'md', label: '' });

/**
 * A bar of tabs over the content they show. The bar is one raised rail, like a wide secondary
 * button, and the selected tab is the primary fill, which slides from one tab to the next.
 *
 * ```tsx
 * <Tabs label="Offers" defaultValue="new">
 *   <Tabs.List>
 *     <Tabs.Item value="new">New 12</Tabs.Item>
 *     <Tabs.Item value="kept">Kept 3</Tabs.Item>
 *   </Tabs.List>
 *   <Tabs.Panel value="new">…</Tabs.Panel>
 *   <Tabs.Panel value="kept">…</Tabs.Panel>
 * </Tabs>
 * ```
 *
 * - **Uncontrolled**: `<Tabs defaultValue="new">`. The bar keeps track of the selected tab.
 * - **Controlled**: `<Tabs value={tab} onValueChange={setTab}>`. Your state decides which tab is
 *   selected, and `onValueChange` tells you what the user asked for.
 *
 * `onValueChange` fires in both modes, so it also serves when the tabs drive something else, such
 * as a page change, and no `Tabs.Panel` is rendered at all.
 */
export function Tabs({
  label,
  size = 'md',
  value,
  defaultValue,
  onValueChange,
  children,
}: TabsProps) {
  return (
    <TabsContext value={{ size, label }}>
      <BaseTabs.Root
        value={value}
        defaultValue={defaultValue}
        // Called with the value alone: Base UI's event details would reach an app's server
        // action or setState, which take one argument
        onValueChange={(next) => onValueChange?.(next as string)}
        className={styles.root}
        style={undefined}
      >
        {children}
      </BaseTabs.Root>
    </TabsContext>
  );
}

/*
 * The rail. Three elements: the raised rail itself, a scroller so a bar wider than the page can
 * be scrolled sideways, and Base UI's list, which is the tablist proper.
 */
function TabsList({ children }: TabsListProps) {
  const { size, label } = use(TabsContext);

  return (
    <div data-size={size} className={styles.rail}>
      <div className={styles.scroller}>
        <BaseTabs.List aria-label={label} className={styles.list} style={undefined}>
          {children}
        </BaseTabs.List>
      </div>
      {/* The bar under the rail, anchored to the selected tab, so it slides with it. An element
          rather than a pseudo: an anchor must come earlier in the tree than what is positioned
          against it, and the list's ::after is already the thumb. Decorative. */}
      <span aria-hidden className={styles.underline} />
    </div>
  );
}

function TabsItem({ value, children, startIcon, disabled = false }: TabsItemProps) {
  return (
    <BaseTabs.Tab value={value} disabled={disabled} className={styles.tab} style={undefined}>
      <IconSlot icon={startIcon} className={styles.icon} />
      <span className={styles.label}>{children}</span>
    </BaseTabs.Tab>
  );
}

function TabsPanel({ value, variant = 'plain', children }: TabsPanelProps) {
  return (
    <BaseTabs.Panel value={value} data-variant={variant} className={styles.panel} style={undefined}>
      {children}
    </BaseTabs.Panel>
  );
}

Tabs.List = TabsList;
Tabs.Item = TabsItem;
Tabs.Panel = TabsPanel;

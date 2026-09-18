import { createContext, use, useMemo, type ComponentProps, type ComponentType, type ReactNode } from 'react';

/** Props the design system passes to the link component. */
export interface LinkComponentProps extends Omit<ComponentProps<'a'>, 'href'> {
  href: string;
}

/** A router link, such as `next/link`. It must forward its props to the rendered `<a>`. */
export type LinkComponent = ComponentType<LinkComponentProps>;

export interface UiKitProviderProps {
  /** Rendered by components that take an `href`. Defaults to a native `<a>`. */
  linkComponent?: LinkComponent;
  children?: ReactNode;
}

interface UiKitContextValue {
  linkComponent: LinkComponent | 'a';
}

const UiKitContext = createContext<UiKitContextValue>({ linkComponent: 'a' });

/**
 * App-level configuration for the design system. Render it once at the app root.
 * Optional: without it, links render as a native `<a>`.
 */
export function UiKitProvider({ linkComponent, children }: UiKitProviderProps) {
  const value = useMemo<UiKitContextValue>(
    () => ({ linkComponent: linkComponent ?? 'a' }),
    [linkComponent],
  );

  return <UiKitContext value={value}>{children}</UiKitContext>;
}

/** @internal */
export function useLinkComponent(): LinkComponent | 'a' {
  return use(UiKitContext).linkComponent;
}

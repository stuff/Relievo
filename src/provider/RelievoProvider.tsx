import { createContext, use, useMemo, type ComponentProps, type ComponentType, type ReactNode } from 'react';

/** Props the design system passes to the link component. */
export interface LinkComponentProps extends Omit<ComponentProps<'a'>, 'href'> {
  href: string;
}

/** A router link, such as `next/link`. It must forward its props to the rendered `<a>`. */
export type LinkComponent = ComponentType<LinkComponentProps>;

export interface RelievoProviderProps {
  /** Rendered by components that take an `href`. Defaults to a native `<a>`. */
  linkComponent?: LinkComponent;
  children?: ReactNode;
}

interface RelievoContextValue {
  linkComponent: LinkComponent | 'a';
}

const RelievoContext = createContext<RelievoContextValue>({ linkComponent: 'a' });

/**
 * App-level configuration for the design system. Render it once at the app root.
 * Optional: without it, links render as a native `<a>`.
 */
export function RelievoProvider({ linkComponent, children }: RelievoProviderProps) {
  const value = useMemo<RelievoContextValue>(
    () => ({ linkComponent: linkComponent ?? 'a' }),
    [linkComponent],
  );

  return <RelievoContext value={value}>{children}</RelievoContext>;
}

/** @internal */
export function useLinkComponent(): LinkComponent | 'a' {
  return use(RelievoContext).linkComponent;
}

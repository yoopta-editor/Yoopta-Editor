import type { ReactNode } from 'react';

import type { PluginElementRenderProps } from './plugins/types';

/**
 * Props for custom JSX plugin elements
 */
type PluginElementJSXProps = {
  render?: (props: PluginElementRenderProps) => ReactNode;
  props?: Record<string, unknown>;
  children?: ReactNode;
};

/**
 * Extend JSX.IntrinsicElements with custom plugin element types.
 * These are used in YooptaPlugin `elements` JSX definition.
 */
declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      [name: string]: PluginElementJSXProps;
    }
  }
}

export { };


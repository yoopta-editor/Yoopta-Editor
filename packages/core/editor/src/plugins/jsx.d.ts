import type { ComponentType } from 'react';

import type { PluginElementNodeType, PluginElementRenderProps } from './types';

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      // Allow any string as element name for plugin JSX elements
      [elemName: string]: {
        render?: ComponentType<PluginElementRenderProps>;
        props?: Record<string, unknown>;
        children?: React.ReactNode;
        nodeType?: PluginElementNodeType;
      };
    }
  }
}

export {};


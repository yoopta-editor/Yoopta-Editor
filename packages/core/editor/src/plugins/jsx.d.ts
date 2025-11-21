import type { ComponentType } from 'react';
import type { ZodTypeAny } from 'zod';

import type { PluginElementRenderProps } from './types';

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      // Allow any string as element name for plugin JSX elements
      [elemName: string]: {
        render?: ComponentType<PluginElementRenderProps>;
        propsSchema?: ZodTypeAny;
        children?: React.ReactNode;
      };
    }
  }
}

export {};


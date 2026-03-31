import type { CSSProperties } from 'react';

import type { YooEditor } from '../editor/types';

export type MetaExtension<K extends string = string, V = unknown> = {
  key: K;
  defaultValue: V;
  commands: (editor: YooEditor) => Record<string, (...args: any[]) => any>;
  blockStyle?: (value: V) => CSSProperties | undefined;
  events?: {
    onKeyDown?: (editor: YooEditor, event: KeyboardEvent) => boolean | void;
  };
};

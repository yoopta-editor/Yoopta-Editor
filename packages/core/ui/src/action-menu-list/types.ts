import type { ReactElement, ReactNode } from 'react';
import type { YooEditor } from '@yoopta/editor';

export type ActionMenuItem = {
  type: string;
  title: string;
  description?: string;
  icon?: string | ReactNode | ReactElement;
};

export type ActionMenuListProps = {
  items?: ActionMenuItem[] | string[];
  trigger?: string;
  view?: 'small' | 'default';
  mode?: 'create' | 'toggle';
};

export type ActionMenuRenderProps = {
  actions: ActionMenuItem[];
  editor: YooEditor;
  selectedAction?: ActionMenuItem;
  onClose: () => void;
  getItemProps: (type: string) => any;
  getRootProps: () => any;
  empty: boolean;
  view?: 'small' | 'default';
  mode?: 'create' | 'toggle';
};

import type { ReactElement, ReactNode } from 'react';
import type { YooEditor, YooptaBlock } from '@yoopta/editor';

export type ActionMenuRenderProps = {
  actions: ActionMenuToolItem[];
  editor: YooEditor;
  selectedAction?: ActionMenuToolItem;
  onClose: () => void;
  getItemProps: (type: string) => any;
  getRootProps: () => any;
  empty: boolean;
  view?: 'small' | 'default';
  mode?: 'create' | 'toggle';
};

export type ActionMenuToolItem = {
  type: string;
  title: string;
  description?: string;
  icon?: string | ReactNode | ReactElement;
};

export type ActionMenuToolProps = {
  // trigger?: string;
  actions?: YooptaBlock[];
  render?: (props: any) => JSX.Element;
  items?: ActionMenuToolItem[] | string[];
};

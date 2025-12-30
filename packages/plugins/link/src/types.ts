import type { SlateElement } from '@yoopta/editor';

export type LinkPluginElementKeys = 'link';
export type LinkElementProps = {
  url: string | null;
  target?: string;
  rel?: string;
  title?: string | null;
  nodeType?: 'inline';
};
export type LinkElement = SlateElement<'link', LinkElementProps>;

export type LinkElementMap = {
  link: LinkElement;
};

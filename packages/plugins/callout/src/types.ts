import type { SlateElement } from '@yoopta/editor';

export type CalloutPluginElementKeys = 'callout';

export type CalloutTheme = 'default' | 'success' | 'warning' | 'error' | 'info';
export type CalloutElementProps = { theme: CalloutTheme };
export type CalloutElement = SlateElement<'callout', CalloutElementProps>;

export type CalloutElementMap = {
  callout: CalloutElement;
};

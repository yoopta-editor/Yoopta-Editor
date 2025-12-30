import type { SlateElement } from '@yoopta/editor';

export type TabsPluginElementKeys = 'tabs';

export type TabsTheme = 'default' | 'success' | 'warning' | 'error' | 'info';
export type TabsElementProps = { theme: TabsTheme };
export type TabsElement = SlateElement<'tabs', TabsElementProps>;

export type TabsElementMap = {
  tabs: TabsElement;
};

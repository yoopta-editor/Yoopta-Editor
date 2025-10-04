import type { SlateElement } from '@yoopta/editor';

export type DividerTheme = 'solid' | 'dashed' | 'dotted' | 'gradient';

export type DividerElementProps = {
  theme: DividerTheme;
  color?: string;
};

export type DividerElement = SlateElement<'divider', DividerElementProps>;
export type DividerElementMap = {
  divider: DividerElement;
};

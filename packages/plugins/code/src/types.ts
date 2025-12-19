import type { SlateElement } from '@yoopta/editor';

export type CodePluginElements = 'code';
export type CodeElementProps = {
  language?: string;
  theme?: string;
};

export type CodePluginBlockOptions = {};

export type CodeElement = SlateElement<'code', CodeElementProps>;

export type CodeElementMap = {
  code: CodeElement;
};

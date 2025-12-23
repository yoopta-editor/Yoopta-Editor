import type { SlateElement } from '@yoopta/editor';

export type CodeGroupPluginElements = 'code';
export type CodeGroupElementProps = {
  language?: string;
  theme?: string;
};

export type CodeGroupPluginBlockOptions = {};

export type CodeGroupElement = SlateElement<'code', CodeGroupElementProps>;

export type CodeGroupElementMap = {
  code: CodeGroupElement;
};

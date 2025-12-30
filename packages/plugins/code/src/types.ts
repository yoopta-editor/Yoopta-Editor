import type { SlateElement } from '@yoopta/editor';
import type { BundledLanguage, BundledTheme } from 'shiki';

export type CodePluginElements = 'code';
export type CodeElementProps = {
  language?: BundledLanguage;
  theme?: BundledTheme;
};

export type CodePluginBlockOptions = {};

export type CodeElement = SlateElement<'code', CodeElementProps>;

export type CodeElementMap = {
  code: CodeElement;
};

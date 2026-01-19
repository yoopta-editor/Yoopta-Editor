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

// CODE_GROUP plugin
export type CodeGroupContainerElementProps = {
  activeTabId?: string | null;
  theme?: BundledTheme;
};

export type CodeGroupContentElementProps = {
  referenceId?: string | null;
  language?: BundledLanguage;
};

export type CodeGroupPluginBlockOptions = {};

export type CodeGroupContainerElement = SlateElement<
  'code-group-container',
  CodeGroupContainerElementProps
>;
export type CodeGroupListElement = SlateElement<'code-group-list'>;
export type CodeGroupItemHeadingElement = SlateElement<'code-group-item-heading'>;
export type CodeGroupContentElement = SlateElement<
  'code-group-content',
  CodeGroupContentElementProps
>;

export type CodeGroupElementMap = {
  'code-group-container': CodeGroupContainerElement;
  'code-group-list': CodeGroupListElement;
  'code-group-item-heading': CodeGroupItemHeadingElement;
  'code-group-content': CodeGroupContentElement;
};

import type { SlateElement } from '@yoopta/editor';

export type TableOfContentsDepth = 1 | 2 | 3;

export type TableOfContentsElementProps = {
  /** Max heading level to show: 1 = H1 only, 2 = H1+H2, 3 = H1+H2+H3 */
  depth: TableOfContentsDepth;
  /** Optional title above the list (e.g. "Table of Contents") */
  title?: string;
  /** Block types to treat as headings (e.g. ['HeadingOne', 'HeadingTwo', 'HeadingThree']) */
  headingTypes: string[];
  /** Show numbered list (1. 2. 3.) */
  showNumbers: boolean;
  /** Allow collapsing the TOC block */
  collapsible?: boolean;
};

export type TableOfContentsElement = SlateElement<
  'table-of-contents',
  TableOfContentsElementProps
>;

export type TableOfContentsElementMap = {
  'table-of-contents': TableOfContentsElement;
};

/** Heading level for known Yoopta heading types */
export const HEADING_TYPE_LEVEL: Record<string, number> = {
  HeadingOne: 1,
  HeadingTwo: 2,
  HeadingThree: 3,
};

export const DEFAULT_HEADING_TYPES = ['HeadingOne', 'HeadingTwo', 'HeadingThree'];

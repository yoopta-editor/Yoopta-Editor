import { TableOfContents } from './plugin/toc-plugin';
import type {
  TableOfContentsDepth,
  TableOfContentsElement,
  TableOfContentsElementMap,
  TableOfContentsElementProps,
} from './types';

export { TableOfContentsCommands } from './commands';
export { DEFAULT_HEADING_TYPES, HEADING_TYPE_LEVEL } from './types';
export { useTableOfContentsItems } from './useTableOfContentsItems';

export default TableOfContents;

export type {
  TableOfContentsDepth,
  TableOfContentsElement,
  TableOfContentsElementMap,
  TableOfContentsElementProps,
};
export type {
  TableOfContentsItem,
  UseTableOfContentsItemsOptions,
} from './useTableOfContentsItems';

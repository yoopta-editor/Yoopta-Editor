// Need to import these types
import type { SlateEditor, SlateElement, YooptaBlockData } from '../types';

// ========================================
// Core types
// ========================================

export type ElementPath = number[] | 'selection' | 'first' | 'last';
export type ElementMatcher = (element: SlateElement) => boolean;

// ========================================
// INSERT Element
// ========================================

export type InsertElementOptions = {
  blockId: string;
  type: string;
  props?: Record<string, unknown>;
  children?: SlateElement[];
  at?: 'next' | 'prev' | 'start' | 'end' | number[];
  focus?: boolean;
  select?: boolean;
  text?: string;
  match?: ElementMatcher;
};

// ========================================
// UPDATE Element
// ========================================

export type UpdateElementOptions = {
  blockId: string;
  type: string;
  props?: Record<string, unknown>;
  path?: ElementPath;
  match?: ElementMatcher;
  text?: string;
};

// ========================================
// DELETE Element
// ========================================

export type DeleteElementOptions = {
  blockId: string;
  type: string;
  path?: ElementPath;
  match?: ElementMatcher;
  mode?: 'unwrap' | 'remove';
};

// ========================================
// Helper types (existing methods)
// ========================================

export type GetElementOptions = {
  blockId: string;
  type?: string;
  path?: number[];
  match?: ElementMatcher;
};

export type GetElementsOptions = {
  blockId: string;
  type?: string;
  match?: ElementMatcher;
};

export type GetElementEntryOptions = {
  blockId: string;
  type?: string;
  path?: number[];
};

export type GetElementPathOptions = {
  blockId: string;
  element: SlateElement;
};

export type GetElementChildrenOptions = {
  blockId: string;
  type: string;
  path?: number[];
};

export type IsElementEmptyOptions = {
  blockId: string;
  type: string;
  path?: number[];
};

export type InsertElementTextOptions = {
  blockId: string;
  text: string;
  at?: number[];
};

export type GetElementRectOptions = {
  blockId: string;
  element: SlateElement;
};

// ========================================
// Transform Block (Escape hatch)
// ========================================

export type TransformBlockOptions = {
  blockId: string;
  transform: (slate: SlateEditor, block: YooptaBlockData) => void;
};

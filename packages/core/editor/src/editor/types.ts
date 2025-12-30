import type { Descendant, Path, Point, Selection } from 'slate';
import type { ReactEditor } from 'slate-react';

import type { decreaseBlockDepth } from './blocks/decreaseBlockDepth';
import type { deleteBlock } from './blocks/deleteBlock';
import type { duplicateBlock } from './blocks/duplicateBlock';
import type { focusBlock } from './blocks/focusBlock';
import type { GetBlockOptions } from './blocks/getBlock';
import type { increaseBlockDepth } from './blocks/increaseBlockDepth';
import type { insertBlock } from './blocks/insertBlock';
import type { toggleBlock } from './blocks/toggleBlock';
import type { EditorBlurOptions } from './core/blur';
import type { HistoryStack, HistoryStackName, YooptaHistory } from './core/history';
import type { getEmail } from '../parsers/getEmail';
import type { getHTML } from '../parsers/getHTML';
import type { WithoutFirstArg } from '../utils/types';
import type { moveBlock } from './blocks/moveBlock';
import type { SplitBlockOptions } from './blocks/splitBlock';
import type { updateBlock } from './blocks/updateBlock';
import type { YooptaOperation, applyTransforms } from './core/applyTransforms';
import type { setEditorValue } from './core/setEditorValue';
import type { getMarkdown } from '../parsers/getMarkdown';
import type { getPlainText } from '../parsers/getPlainText';
import type {
  Plugin,
  PluginElementProps,
  PluginElementsMap,
  PluginOptions,
} from '../plugins/types';
import type { ElementStructureOptions, TextNodeOptions } from './elements/create-element-structure';

export type YooptaBlockData<T = Descendant | SlateElement> = {
  id: string;
  value: T[];
  type: string;
  meta: YooptaBlockBaseMeta;
};

export type YooptaBlockBaseMeta = {
  order: number;
  depth: number;
  align?: 'left' | 'center' | 'right' | undefined;
};

export type YooptaContentValue = Record<string, YooptaBlockData>;

export type SlateEditor = ReactEditor;

// add 'end' | 'start'
export type FocusAt = Path | Point;

export type YooptaPluginsEditorMap = Record<string, SlateEditor>;
export type YooptaPathIndex = number | null;
export type YooptaPath = {
  current: YooptaPathIndex;
  selected?: number[] | null;
  selection?: Selection | null;
  source?: null | 'selection-box' | 'native-selection' | 'mousemove' | 'keyboard' | 'copy-paste';
};

// Marks
export type TextFormat = {
  type: string;
  hotkey?: string;
  getValue: () => null | any;
  isActive: () => boolean;
  toggle: () => void;
  update: (props?: any) => void;
};

export type YooptaBlock = {
  type: string;
  options?: PluginOptions<any>;
  elements: PluginElementsMap;
  isActive: () => boolean;
};

export type YooptaBlocks = Record<string, YooptaBlock>;
export type YooptaFormats = Record<string, TextFormat>;

export type YooptaEditorEventKeys = 'change' | 'focus' | 'blur' | 'block:copy' | 'path-change';
export type YooptaEventChangePayload = {
  operations: YooptaOperation[];
  value: YooptaContentValue;
};

export type YooptaEventsMap = {
  change: YooptaEventChangePayload;
  focus: boolean;
  blur: boolean;
  'block:copy': YooptaBlockData;
  'path-change': YooptaPath;
};

export type BaseCommands = Record<string, (...args: any[]) => any>;

// [TODO] - Fix generic and default types
// [TODO] - change with WithoutFirstArg
export type BaseYooEditor = {
  id: string;
  readOnly: boolean;
  isEmpty: () => boolean;

  // block handlers
  insertBlock: WithoutFirstArg<typeof insertBlock>;
  updateBlock: WithoutFirstArg<typeof updateBlock>;
  deleteBlock: WithoutFirstArg<typeof deleteBlock>;
  duplicateBlock: WithoutFirstArg<typeof duplicateBlock>;
  toggleBlock: WithoutFirstArg<typeof toggleBlock>;
  increaseBlockDepth: WithoutFirstArg<typeof increaseBlockDepth>;
  decreaseBlockDepth: WithoutFirstArg<typeof decreaseBlockDepth>;
  moveBlock: WithoutFirstArg<typeof moveBlock>;
  focusBlock: WithoutFirstArg<typeof focusBlock>;
  mergeBlock: () => void;
  splitBlock: (options?: SplitBlockOptions) => void;
  getBlock: (options: GetBlockOptions) => YooptaBlockData | null;

  // element structure builder
  y: ((type: string, options?: ElementStructureOptions) => SlateElement) & {
    text: (text: string, marks?: TextNodeOptions) => SlateElementTextNode;
    inline: (type: string, options?: ElementStructureOptions) => SlateElement;
  };

  // path handlers
  path: YooptaPath;
  setPath: (path: YooptaPath) => void;

  children: YooptaContentValue;
  getEditorValue: () => YooptaContentValue;
  setEditorValue: WithoutFirstArg<typeof setEditorValue>;
  blockEditorsMap: YooptaPluginsEditorMap;
  // blocks: YooptaBlocks;
  formats: YooptaFormats;
  // shortcuts: Record<string, YooptaBlock>;
  plugins: Record<string, Plugin<Record<string, SlateElement>, unknown>>;
  commands: Record<string, (...args: any[]) => any>;

  // core handlers
  applyTransforms: WithoutFirstArg<typeof applyTransforms>;
  batchOperations: (fn: () => void) => void;

  // events handlers
  on: <K extends keyof YooptaEventsMap>(
    event: K,
    fn: (payload: YooptaEventsMap[K]) => void,
  ) => void;
  once: <K extends keyof YooptaEventsMap>(
    event: K,
    fn: (payload: YooptaEventsMap[K]) => void,
  ) => void;
  off: <K extends keyof YooptaEventsMap>(
    event: K,
    fn: (payload: YooptaEventsMap[K]) => void,
  ) => void;
  emit: <K extends keyof YooptaEventsMap>(event: K, payload: YooptaEventsMap[K]) => void;

  // focus handlers
  isFocused: () => boolean;
  blur: (options?: EditorBlurOptions) => void;
  focus: () => void;

  // parser handlers
  getHTML: WithoutFirstArg<typeof getHTML>;
  getMarkdown: WithoutFirstArg<typeof getMarkdown>;
  getPlainText: WithoutFirstArg<typeof getPlainText>;
  getEmail: WithoutFirstArg<typeof getEmail>;

  // history
  historyStack: Record<HistoryStackName, HistoryStack[]>;
  isSavingHistory: WithoutFirstArg<typeof YooptaHistory.isSavingHistory>;
  isMergingHistory: WithoutFirstArg<typeof YooptaHistory.isMergingHistory>;
  withoutSavingHistory: WithoutFirstArg<typeof YooptaHistory.withoutSavingHistory>;
  withoutMergingHistory: WithoutFirstArg<typeof YooptaHistory.withoutMergingHistory>;
  withMergingHistory: WithoutFirstArg<typeof YooptaHistory.withMergingHistory>;
  withSavingHistory: WithoutFirstArg<typeof YooptaHistory.withSavingHistory>;
  redo: WithoutFirstArg<typeof YooptaHistory.redo>;
  undo: WithoutFirstArg<typeof YooptaHistory.undo>;

  // ref to editor element
  refElement: HTMLElement | null;
};

export type SlateElementTextNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  strike?: boolean;
  highlight?: any;
};

// types for slate values
export type SlateElement<K extends string = string, T = any> = {
  id: string;
  type: K;
  children: Descendant[];
  props?: PluginElementProps<T>;
};

export type YooEditor = BaseYooEditor;

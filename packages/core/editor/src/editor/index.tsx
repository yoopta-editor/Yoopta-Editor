import EventEmitter from 'eventemitter3';

import type { YooptaMark } from '../marks';
import type { YooptaPlugin } from '../plugins';
import { decreaseBlockDepth } from './blocks/decreaseBlockDepth';
import { deleteBlock } from './blocks/deleteBlock';
import { duplicateBlock } from './blocks/duplicateBlock';
import { focusBlock } from './blocks/focusBlock';
import { getBlock } from './blocks/getBlock';
import { increaseBlockDepth } from './blocks/increaseBlockDepth';
import { insertBlock } from './blocks/insertBlock';
import { mergeBlock } from './blocks/mergeBlock';
import { moveBlock } from './blocks/moveBlock';
import { splitBlock } from './blocks/splitBlock';
import { toggleBlock } from './blocks/toggleBlock';
import { updateBlock } from './blocks/updateBlock';
import { applyTransforms } from './core/applyTransforms';
import { batchOperations } from './core/batchOperations';
import { blur } from './core/blur';
import { focus } from './core/focus';
import { getEditorValue } from './core/getEditorValue';
import type { UndoRedoOptions } from './core/history';
import { YooptaHistory } from './core/history';
import { isFocused } from './core/isFocused';
import { setEditorValue } from './core/setEditorValue';
import { setPath } from './paths/setPath';
import type { SlateElement, YooEditor, YooptaContentValue } from './types';
import type { EmailTemplateOptions } from '../parsers/getEmail';
import { getEmail } from '../parsers/getEmail';
import { getHTML } from '../parsers/getHTML';
import { getMarkdown } from '../parsers/getMarkdown';
import { getPlainText } from '../parsers/getPlainText';
import { getYooptaJSON } from '../parsers/getYooptaJSON';
import { isEmpty } from './core/isEmpty';
import { y, yInline, yText } from './elements/create-element-structure';
import type { ElementStructureOptions } from './elements/create-element-structure';
import { deleteElement } from './elements/deleteElement';
import { getElement } from './elements/getElement';
import { getElementChildren } from './elements/getElementChildren';
import { getElementEntry } from './elements/getElementEntry';
import { getElementPath } from './elements/getElementPath';
import { getElementRect } from './elements/getElementRect';
import { getElements } from './elements/getElements';
import { getParentElementPath } from './elements/getParentElementPath';
import { insertElement } from './elements/insertElement';
import { isElementEmpty } from './elements/isElementEmpty';
import { updateElement } from './elements/updateElement';
import type { Plugin } from '../plugins/types';
import {
  buildBlockSlateEditors,
  buildMarks,
  buildPlugins,
} from '../utils/editor-builders';
import { generateId } from '../utils/generateId';
import { validateYooptaValue } from '../utils/validations';

export type CreateYooptaEditorOptions = {
  id?: string;
  plugins: readonly YooptaPlugin<Record<string, SlateElement>>[];
  marks?: YooptaMark<any>[];
  value?: YooptaContentValue;
  readOnly?: boolean;
};

export function createYooptaEditor(opts: CreateYooptaEditorOptions): YooEditor {
  const { id, plugins: pluginsFromOptions, marks, value, readOnly } = opts;

  const plugins = pluginsFromOptions
    .filter((plugin) => !!plugin)
    .map((plugin) => plugin.getPlugin as Plugin<Record<string, SlateElement>>);
  // Create a unique event emitter for each editor instance
  const eventEmitter = new EventEmitter();

  const Events = {
    on: (event, fn) => eventEmitter.on(event, fn),
    once: (event, fn) => eventEmitter.once(event, fn),
    off: (event, fn) => eventEmitter.off(event, fn),
    emit: (event, payload) => eventEmitter.emit(event, payload),
  };

  const isValueValid = validateYooptaValue(value);
  if (!isValueValid && typeof value !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error(
      `Initial value is not valid. Should be an object with blocks. You passed: ${JSON.stringify(value)}`,
    );
  }

  const editorId = id ?? generateId();
  const children = (isValueValid ? value : {}) as YooptaContentValue;

  const editor: YooEditor = {
    id: editorId,
    children,
    blockEditorsMap: {},
    path: { current: null },
    readOnly: readOnly ?? false,
    isEmpty: () => isEmpty(editor),
    getEditorValue: () => getEditorValue(editor),
    setEditorValue: (...args) => setEditorValue(editor, ...args),
    insertBlock: (...args) => insertBlock(editor, ...args),
    deleteBlock: (...args) => deleteBlock(editor, ...args),
    duplicateBlock: (...args) => duplicateBlock(editor, ...args),
    toggleBlock: (...args) => toggleBlock(editor, ...args),
    increaseBlockDepth: (...args) => increaseBlockDepth(editor, ...args),
    decreaseBlockDepth: (...args) => decreaseBlockDepth(editor, ...args),
    moveBlock: (...args) => moveBlock(editor, ...args),
    focusBlock: (...args) => focusBlock(editor, ...args),
    getBlock: (...args) => getBlock(editor, ...args),
    updateBlock: (...args) => updateBlock(editor, ...args),
    splitBlock: (...args) => splitBlock(editor, ...args),
    mergeBlock: (...args) => mergeBlock(editor, ...args),
    setPath: (...args) => setPath(editor, ...args),

    // New element methods
    insertElement: (options) => insertElement(editor, options),
    updateElement: (options) => updateElement(editor, options),
    deleteElement: (options) => deleteElement(editor, options),
    getElement: (options) => getElement(editor, options),
    getElements: (options) => getElements(editor, options),
    getElementEntry: (options) => getElementEntry(editor, options),
    getElementPath: (options) => getElementPath(editor, options),
    getElementRect: (options) => getElementRect(editor, options),
    getParentElementPath: (options) => getParentElementPath(editor, options),
    getElementChildren: (options) => getElementChildren(editor, options),
    isElementEmpty: (options) => isElementEmpty(editor, options),

    y: Object.assign(
      (type: string, options?: ElementStructureOptions) => y(editor, type, options),
      {
        text: yText,
        inline: (type: string, options?: ElementStructureOptions) => yInline(editor, type, options),
      },
    ),

    formats: {},
    marks: marks ?? [],
    plugins: {},

    applyTransforms: (operations, ...args) => applyTransforms(editor, operations, ...args),
    batchOperations: (callback) => batchOperations(editor, callback),

    on: (event, callback) => Events.on(event, callback),
    off: (event, callback) => Events.off(event, callback),
    emit: (event, ...args) => Events.emit(event, ...args),
    once: (event, callback) => Events.once(event, callback),

    isFocused: () => isFocused(editor),
    focus: () => focus(editor),
    blur: (...args) => blur(editor, ...args),

    getHTML: (content: YooptaContentValue) => getHTML(editor, content),
    getMarkdown: (content: YooptaContentValue) => getMarkdown(editor, content),
    getPlainText: (content: YooptaContentValue) => getPlainText(editor, content),
    getEmail: (content: YooptaContentValue, options?: Partial<EmailTemplateOptions>) =>
      getEmail(editor, content, options),
    getYooptaJSON: (content: YooptaContentValue) => getYooptaJSON(editor, content),

    refElement: null,

    historyStack: {
      undos: [],
      redos: [],
    },

    redo: (options?: UndoRedoOptions) => YooptaHistory.redo(editor, options),
    undo: (options?: UndoRedoOptions) => YooptaHistory.undo(editor, options),
    isSavingHistory: () => YooptaHistory.isSavingHistory(editor),
    isMergingHistory: () => YooptaHistory.isMergingHistory(editor),
    withoutSavingHistory: (fn) => YooptaHistory.withoutSavingHistory(editor, fn),
    withSavingHistory: (fn) => YooptaHistory.withSavingHistory(editor, fn),
    withoutMergingHistory: (fn) => YooptaHistory.withoutMergingHistory(editor, fn),
    withMergingHistory: (fn) => YooptaHistory.withMergingHistory(editor, fn),
  };

  editor.plugins = buildPlugins(plugins);
  editor.formats = marks ? buildMarks(editor, marks) : {};
  editor.blockEditorsMap = buildBlockSlateEditors(editor);

  return editor;
}

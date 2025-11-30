import EventEmitter from 'eventemitter3';

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
import type { YooEditor, YooptaContentValue } from './types';
import type { EmailTemplateOptions } from '../parsers/getEmail';
import { getEmail } from '../parsers/getEmail';
import { getHTML } from '../parsers/getHTML';
import { getMarkdown } from '../parsers/getMarkdown';
import { getPlainText } from '../parsers/getPlainText';
import { isEmpty } from './core/isEmpty';
import { h } from './elements/createElementStructure';

export function createYooptaEditor(): YooEditor {
  // Create a unique event emitter for each editor instance
  const eventEmitter = new EventEmitter();

  const Events = {
    on: (event, fn) => eventEmitter.on(event, fn),
    once: (event, fn) => eventEmitter.once(event, fn),
    off: (event, fn) => eventEmitter.off(event, fn),
    emit: (event, payload) => eventEmitter.emit(event, payload),
  };
  const editor: YooEditor = {
    id: '',
    children: {},
    blockEditorsMap: {},
    path: { current: null },
    readOnly: false,
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
    h: (...args) => h(editor, ...args),

    formats: {},
    plugins: {},
    commands: {},

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

  return editor;
}

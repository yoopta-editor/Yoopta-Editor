import React, { useCallback, useEffect, useMemo, useState } from 'react';
import EventEmitter from 'eventemitter3';
import { getDefaultYooptaChildren } from './components/Editor/utils';
import { YooptaContextProvider } from './contexts/YooptaContext/YooptaContext';
import { ToolsProvider } from './contexts/YooptaContext/ToolsContext';
import { SlateElement } from './editor/types';
import {
  buildBlocks,
  buildBlockShortcuts,
  buildBlockSlateEditors,
  buildCommands,
  buildMarks,
  buildPlugins,
} from './utils/editorBuilders';
import { YooptaPlugin } from './plugins';
import { YooptaMark } from './marks';
import { FakeSelectionMark } from './marks/FakeSelectionMark';
import { generateId } from './utils/generateId';
import { YooEditor, YooptaBlockData, YooptaContentValue } from './editor/types';
import { Plugin } from './plugins/types';
import { validateYooptaValue } from './utils/validateYooptaValue';
import { YooptaOnChangeOptions } from './YooptaEditor';
import { YooptaPath } from './editor/types';

type Props = {
  id?: string;
  editor: YooEditor;
  value?: YooptaContentValue;
  marks?: YooptaMark<any>[];
  plugins: Readonly<YooptaPlugin<Record<string, SlateElement>>[]>;
  tools?: any;
  children?: React.ReactNode;
  readOnly?: boolean;
  onChange?: (value: YooptaContentValue, options: YooptaOnChangeOptions) => void;
};

type EditorState = {
  editor: YooEditor;
  version: number;
};
const DEFAULT_VALUE: Record<string, YooptaBlockData> = getDefaultYooptaChildren();
const eventEmitter = new EventEmitter();

const Events = {
  on: (event: string, fn: (...args: any[]) => void) => eventEmitter.on(event, fn),
  once: (event: string, fn: (...args: any[]) => void) => eventEmitter.once(event, fn),
  off: (event: string, fn: (...args: any[]) => void) => eventEmitter.off(event, fn),
  emit: (event: string, payload: any) => eventEmitter.emit(event, payload),
};

function validateInitialValue(value: any): boolean {
  if (!value) return false;
  if (typeof value !== 'object') return false;
  if (Object.keys(value).length === 0) return false;

  return true;
}

const YooptaEditorProvider = ({
  id,
  editor,
  value,
  marks: marksProps,
  plugins: pluginsProps,
  tools,
  children,
  readOnly,
  onChange,
}: Props) => {
  const marks = useMemo(() => {
    if (marksProps) return [FakeSelectionMark, ...marksProps];
    return [FakeSelectionMark];
  }, [marksProps]);

  const plugins = useMemo(() => {
    return pluginsProps.map((plugin) => plugin.getPlugin as Plugin<Record<string, SlateElement>>);
  }, [pluginsProps]);

  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (!editor.id) editor.id = id || generateId();
    editor.readOnly = readOnly || false;
    if (marks) editor.formats = buildMarks(editor, marks);
    editor.blocks = buildBlocks(editor, plugins);

    const isValueValid = validateYooptaValue(value);
    if (!isValueValid && typeof value !== 'undefined') {
      // [TODO] - add link to documentation
      console.error(
        `Initial value is not valid. Should be an object with blocks. You passed: ${JSON.stringify(value)}`,
      );
    }

    editor.children = (isValueValid ? value : {}) as YooptaContentValue;
    editor.blockEditorsMap = buildBlockSlateEditors(editor);
    editor.shortcuts = buildBlockShortcuts(editor);
    editor.plugins = buildPlugins(plugins);
    editor.commands = buildCommands(editor, plugins);

    return { editor, version: 0 };
  });

  const [_, setStatePath] = useState<YooptaPath | null>(null);

  const onEditorPathChange = useCallback((path: YooptaPath) => {
    setStatePath(path);
  }, []);

  const onValueChange = useCallback((value, options: YooptaOnChangeOptions) => {
    setEditorState((prevState) => ({
      editor: prevState.editor,
      version: prevState.version + 1,
    }));

    if (typeof onChange === 'function' && Array.isArray(options.operations)) {
      const operations = options.operations.filter(
        (operation) =>
          operation.type !== 'validate_block_paths' &&
          operation.type !== 'set_block_path' &&
          operation.type !== 'set_slate',
      );

      if (operations.length > 0) onChange(value, { operations });
    }
  }, []);

  useEffect(() => {
    const changeHandler = (options) => {
      onValueChange(options.value, { operations: options.operations });
    };

    editor.on('change', changeHandler);
    editor.on('path-change', onEditorPathChange);

    return () => {
      editor.off('change', changeHandler);
      editor.off('path-change', onEditorPathChange);
    };
  }, [editor, onValueChange]);

  return (
    <YooptaContextProvider editorState={editorState}>
      <ToolsProvider tools={tools}>{children}</ToolsProvider>
    </YooptaContextProvider>
  );
};

export { YooptaEditorProvider };

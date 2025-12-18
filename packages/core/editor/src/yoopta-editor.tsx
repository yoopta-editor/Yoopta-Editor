import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Editor } from './components/Editor/render-editor';
import { YooptaContextProvider } from './contexts/YooptaContext/YooptaContext';
import type { YooptaOperation } from './editor/core/applyTransforms';
import type { SlateElement, YooEditor, YooptaContentValue, YooptaPath } from './editor/types';
import type { YooptaMark } from './marks';
import type { YooptaPlugin } from './plugins';
import type { Plugin } from './plugins/types';
import {
  buildBlockSlateEditors,
  buildCommands,
  buildMarks,
  buildPlugins,
} from './utils/editor-builders';
import { generateId } from './utils/generateId';
import { validateYooptaValue } from './utils/validations';

export type YooptaOnChangeOptions = {
  operations: YooptaOperation[];
};

export type YooptaEditorProps = {
  id?: string;
  editor: YooEditor;
  plugins: readonly YooptaPlugin<Record<string, SlateElement>>[];
  marks?: YooptaMark<any>[];
  value?: YooptaContentValue;
  onChange?: (value: YooptaContentValue, options: YooptaOnChangeOptions) => void;
  onPathChange?: (path: YooptaPath) => void;
  autoFocus?: boolean;
  className?: string;
  selectionBoxRoot?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
  children?: React.ReactNode;
  placeholder?: string;
  readOnly?: boolean;
  width?: number | string;
  style?: CSSProperties;
};

type EditorState = {
  editor: YooEditor;
  version: number;
};

const YooptaEditor = ({
  id,
  editor,
  value,
  marks,
  plugins: pluginsFromProp,
  autoFocus,
  className,
  selectionBoxRoot,
  children,
  placeholder,
  readOnly,
  width,
  style,
  onChange,
  onPathChange,
}: YooptaEditorProps) => {
  const plugins = useMemo(
    () => pluginsFromProp.map((plugin) => plugin.getPlugin as Plugin<Record<string, SlateElement>>),
    [pluginsFromProp],
  );

  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (!editor.id) editor.id = id || generateId();
    editor.readOnly = readOnly || false;
    editor.plugins = buildPlugins(plugins);

    if (marks) editor.formats = buildMarks(editor, marks);

    const isValueValid = validateYooptaValue(value);
    if (!isValueValid && typeof value !== 'undefined') {
      // [TODO] - add link to documentation
      console.error(
        `Initial value is not valid. Should be an object with blocks. You passed: ${JSON.stringify(
          value,
        )}`,
      );
    }

    editor.children = (isValueValid ? value : {}) as YooptaContentValue;
    editor.blockEditorsMap = buildBlockSlateEditors(editor);
    editor.commands = buildCommands(editor, plugins);

    return { editor, version: 0 };
  });

  const [_, setStatePath] = useState<YooptaPath | null>(null);

  const onEditorPathChange = useCallback((path: YooptaPath) => {
    setStatePath(path);
    onPathChange?.(path);
  }, []);

  const onValueChange = useCallback((changeValue, options: YooptaOnChangeOptions) => {
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

      if (operations.length > 0) onChange(changeValue, { operations });
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
      <Editor
        placeholder={placeholder}
        marks={marks}
        autoFocus={autoFocus}
        className={className}
        selectionBoxRoot={selectionBoxRoot}
        width={width}
        style={style}>
        {children}
      </Editor>
    </YooptaContextProvider>
  );
};

export { YooptaEditor };

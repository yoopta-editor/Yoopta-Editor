import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Editor } from './components/Editor/render-editor';
import { YooptaContextProvider } from './contexts/YooptaContext/YooptaContext';
import type { YooptaOperation } from './editor/core/applyTransforms';
import type { YooEditor, YooptaBlockData, YooptaContentValue, YooptaPath } from './editor/types';

export type YooptaOnChangeOptions = {
  operations: YooptaOperation[];
};

export type RenderBlockProps = {
  block: YooptaBlockData;
  children: ReactNode;
  blockId: string;
};

export type YooptaEditorProps = {
  editor: YooEditor;
  onChange?: (value: YooptaContentValue, options: YooptaOnChangeOptions) => void;
  onPathChange?: (path: YooptaPath) => void;
  autoFocus?: boolean;
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
  style?: CSSProperties;
  /** Custom render wrapper for each block. Useful for drag-and-drop integration. */
  renderBlock?: (props: RenderBlockProps) => ReactNode;
};

type EditorState = {
  editor: YooEditor;
  version: number;
};

// [TODO] - add placeholder 
const YooptaEditor = ({
  editor,
  autoFocus,
  className,
  children,
  placeholder,
  style,
  onChange,
  onPathChange,
  renderBlock,
}: YooptaEditorProps) => {
  const [editorState, setEditorState] = useState<EditorState>({ editor, version: 0 });
  const [, setStatePath] = useState<YooptaPath | null>(null);

  useEffect(() => {
    const changeHandler = (options: { value: YooptaContentValue; operations: YooptaOperation[] }) => {
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

        if (operations.length > 0) onChange(options.value, { operations });
      }
    };

    const pathChangeHandler = (path: YooptaPath) => {
      setStatePath(path);
      onPathChange?.(path);
    };

    editor.on('change', changeHandler);
    editor.on('path-change', pathChangeHandler);

    return () => {
      editor.off('change', changeHandler);
      editor.off('path-change', pathChangeHandler);
    };
  }, [editor, onChange, onPathChange]);

  return (
    <YooptaContextProvider editorState={editorState}>
      <Editor
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={className}
        style={style}
        renderBlock={renderBlock}>
        {children}
      </Editor>
    </YooptaContextProvider>
  );
};

export { YooptaEditor };

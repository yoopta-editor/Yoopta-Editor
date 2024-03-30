import EventEmitter from 'eventemitter3';
import { YooptaContextProvider } from './contexts/YooptaContext/YooptaContext';
import { getDefaultYooptaChildren } from './components/Editor/utils';
import { Editor } from './components/Editor/Editor';
import { useMemo, useState } from 'react';
import { YooEditor, YooptaBlockData, YooptaContentValue } from './editor/types';
import { Plugin } from './plugins/types';
import NoSSR from './components/NoSsr/NoSsr';
import { Tools, ToolsProvider } from './contexts/YooptaContext/ToolsContext';
import {
  buildBlocks,
  buildBlockShortcuts,
  buildBlockSlateEditors,
  buildMarks,
  buildPlugins,
} from './utils/editorBuilders';
import { YooptaPlugin } from './plugins';
import { YooptaMark } from './marks';
import { FakeSelectionMark } from './marks/FakeSelectionMark';

type Props = {
  editor: YooEditor;
  plugins: YooptaPlugin[];
  marks?: YooptaMark<any>[];
  value?: YooptaContentValue;
  autoFocus?: boolean;
  className?: string;
  selectionBoxRoot?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
  children?: React.ReactNode;
  tools?: Partial<Tools>;
  placeholder?: string;
  readOnly?: boolean;
  width?: number;
};

const DEFAULT_VALUE: Record<string, YooptaBlockData> = getDefaultYooptaChildren();
const eventEmitter = new EventEmitter();

const Events = {
  on: (event, fn) => eventEmitter.on(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  emit: (event, payload) => eventEmitter.emit(event, payload),
};

function isValidateInitialValue(value: any): boolean {
  if (!value) return false;
  if (typeof value !== 'object') return false;
  if (Object.keys(value).length === 0) return false;

  return true;
}

const YooptaEditor = ({
  editor,
  value,
  marks: marksProps,
  plugins: pluginsProps,
  autoFocus,
  className,
  tools,
  selectionBoxRoot,
  children,
  placeholder,
  readOnly,
  width,
}: Props) => {
  const applyChanges = () => {
    setEditorState((prev) => ({ ...prev, version: prev.version + 1 }));
  };

  const marks = useMemo(() => {
    if (marksProps) return [FakeSelectionMark, ...marksProps];
    return [FakeSelectionMark];
  }, [marksProps]);

  const plugins = useMemo(() => {
    return pluginsProps.map((plugin) => plugin.getPlugin as Plugin<string, any, any>);
  }, [pluginsProps]);

  const [editorState, setEditorState] = useState<{ editor: YooEditor<any, 'hightlight'>; version: number }>(() => {
    editor.applyChanges = applyChanges;
    editor.readOnly = readOnly || false;
    if (marks) editor.formats = buildMarks(editor, marks);
    editor.blocks = buildBlocks(editor, plugins);

    editor.children = (isValidateInitialValue(value) ? value : DEFAULT_VALUE) as YooptaContentValue;
    editor.blockEditorsMap = buildBlockSlateEditors(editor);
    editor.shortcuts = buildBlockShortcuts(editor);
    editor.plugins = buildPlugins(plugins);

    editor.on = Events.on;
    editor.once = Events.once;
    editor.off = Events.off;
    editor.emit = Events.emit;

    return { editor, version: 0 };
  });

  return (
    <NoSSR>
      <YooptaContextProvider editorState={editorState}>
        <ToolsProvider tools={tools}>
          <Editor
            placeholder={placeholder}
            marks={marks}
            autoFocus={autoFocus}
            className={className}
            selectionBoxRoot={selectionBoxRoot}
            width={width}
          />
          {children}
        </ToolsProvider>
      </YooptaContextProvider>
    </NoSSR>
  );
};

export { YooptaEditor };

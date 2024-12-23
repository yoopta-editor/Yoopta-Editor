import { Editor } from './components/Editor/Editor';
import { CSSProperties } from 'react';
import { SlateElement, YooEditor, YooptaContentValue } from './editor/types';
import { Tools } from './contexts/YooptaContext/ToolsContext';
import { YooptaPlugin } from './plugins';
import { YooptaMark } from './marks';
import { FakeSelectionMark } from './marks/FakeSelectionMark';
import { generateId } from './utils/generateId';
import { YooptaOperation } from './editor/core/applyTransforms';
import { YooptaEditorProvider } from './YooptaEditorProvider';

export type YooptaOnChangeOptions = {
  operations: YooptaOperation[];
};

export type YooptaEditorProps = {

type Props = {
  id?: string;
  editor: YooEditor;
  plugins: Readonly<YooptaPlugin<Record<string, SlateElement>>[]>;
  marks?: YooptaMark<any>[];
  value?: YooptaContentValue;
  onChange?: (value: YooptaContentValue, options: YooptaOnChangeOptions) => void;
  autoFocus?: boolean;
  className?: string;
  selectionBoxRoot?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
  children?: React.ReactNode;
  tools?: Partial<Tools>;
  placeholder?: string;
  readOnly?: boolean;
  width?: number | string;
  style?: CSSProperties;
};


const YooptaEditor = ({
  id,
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
  style,
  onChange,
}: Props) => {
  return (
    <YooptaEditorProvider
      id={id}
      editor={editor}
      value={value}
      marks={marksProps}
      plugins={pluginsProps}
      tools={tools}
      readOnly={readOnly}
      onChange={onChange}
    >
      <Editor
        placeholder={placeholder}
        marks={marksProps}
        autoFocus={autoFocus}
        className={className}
        selectionBoxRoot={selectionBoxRoot}
        width={width}
        style={style}
      >
        {children}
      </Editor>
    </YooptaEditorProvider>
  );
};
export { YooptaEditor };

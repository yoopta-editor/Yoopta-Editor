import { useRef, useState } from 'react';
import type { BasicSetupOptions } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import type {
  PluginCustomEditorRenderProps} from '@yoopta/editor';
import {
  buildBlockData,
  useBlockData,
  useYooptaEditor,
  useYooptaReadOnly,
} from '@yoopta/editor';

import { CodeBlockOptions } from './CodeBlockOptions';
import type { CodeElement } from '../types';
import { getCodeElement, getCodeElementText } from '../utils/element';
import { LANGUAGES_MAP } from '../utils/languages';
import { THEMES_MAP } from '../utils/themes';

const codeMirrorSetup: BasicSetupOptions = {
  lineNumbers: false,
  autocompletion: false,
  foldGutter: false,
  highlightActiveLineGutter: false,
  highlightActiveLine: false,
  tabSize: 2,
};

const CodeEditor = ({ blockId }: PluginCustomEditorRenderProps) => {
  const editor = useYooptaEditor();
  const isReadOnly = useYooptaReadOnly();
  const cmEditorRef = useRef(null);
  const block = useBlockData(blockId);
  const [code, setCode] = useState(() => getCodeElementText(block) || '');

  const element = getCodeElement(block) as CodeElement;

  const theme = element.props?.theme || 'VSCode';
  const language = element.props?.language || 'javascript';

  const onChange = (value: string) => {
    setCode(value);
    editor.updateBlock(blockId, { value: [{ ...element, children: [{ text: value }] }] });
  };

  const onClick = () => {
    if (isReadOnly) return;

    if (editor.path.current !== block.meta.order) {
      editor.setPath({ current: block.meta.order });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const isShiftEnter = e.key === 'Enter' && e.shiftKey;
    if (isShiftEnter) {
      e.preventDefault();
      const defaultBlock = buildBlockData();
      editor.insertBlock(defaultBlock.type, {
        at: block.meta.order + 1,
        focus: true,
        blockData: defaultBlock,
      });
      
    }
  };

  return (
    <div
      data-element-type="code"
      data-custom-editor
      className="yoo-code-rounded-md yoo-code-mt-2 yoo-code-p-0 yoopta-code"
      onMouseDown={onClick}>
      <div contentEditable={false}>
        <CodeMirror
          value={code}
          height="auto"
          extensions={[LANGUAGES_MAP[language]?.extension || LANGUAGES_MAP.javascript.extension]}
          onChange={onChange}
          width="100%"
          theme={THEMES_MAP[theme] || THEMES_MAP.VSCode}
          className="yoopta-code-cm-editor"
          basicSetup={codeMirrorSetup}
          editable={!isReadOnly}
          readOnly={isReadOnly}
          onClick={onClick}
          onKeyDown={onKeyDown}
          ref={cmEditorRef}
          style={{ caretColor: 'red', tabSize: 2 }}
        />
      </div>
      {!isReadOnly && <CodeBlockOptions block={block} editor={editor} element={element} />}
    </div>
  );
};

export { CodeEditor };

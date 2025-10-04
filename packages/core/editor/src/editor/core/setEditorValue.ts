import type { SetEditorValueOperation } from './applyTransforms';
import { validateYooptaValue } from '../../utils/validateYooptaValue';
import { Blocks } from '../blocks';
import type { YooEditor, YooptaContentValue } from '../types';

export function setEditorValue(editor: YooEditor, value: YooptaContentValue | null) {
  let editorValue: YooptaContentValue;

  if (value === null || !validateYooptaValue(value)) {
    const defaultBlock = Blocks.buildBlockData();
    editorValue = { [defaultBlock.id]: defaultBlock };
  } else {
    editorValue = value;
  }

  const operation: SetEditorValueOperation = {
    type: 'set_editor_value',
    properties: {
      value: editorValue,
    },
    prevProperties: {
      value: editor.children,
    },
  };

  editor.applyTransforms([operation], { validatePaths: true });
}

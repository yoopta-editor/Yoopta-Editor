export { YooptaPlugin } from './plugins';
export {
  useBlockData,
  useYooptaEditor,
  useYooptaFocused,
  useBlockSelected,
  useYooptaReadOnly,
  useYooptaPluginOptions,
} from './contexts/YooptaContext/YooptaContext';
import { YooptaEditor, type YooptaEditorProps, type YooptaOnChangeOptions } from './YooptaEditor';
export { deserializeHTML } from './parsers/deserializeHTML';
export { type EmailTemplateOptions } from './parsers/getEmail';

// [TODO] - should be in separated package @yoopta/common/ui or @yoopta/ui
export { UI } from './UI';

export { useYooptaTools, Tools } from './contexts/YooptaContext/ToolsContext';

export { generateId } from './utils/generateId';
export { HOTKEYS } from './utils/hotkeys';
export { getRootBlockElementType, getRootBlockElement } from './utils/blockElements';

// to remove
export { findPluginBlockByPath } from './utils/findPluginBlockByPath';
export { findSlateBySelectionPath } from './utils/findSlateBySelectionPath';
export { deserializeTextNodes } from './parsers/deserializeTextNodes';
export { serializeTextNodes, serializeTextNodesIntoMarkdown } from './parsers/serializeTextNodes';

export { createYooptaEditor } from './editor';
export { createYooptaMark, YooptaMarkParams, YooptaMark } from './marks';
export {
  YooEditor,
  SlateElement,
  YooptaBlockData,
  YooptaBlock,
  YooptaContentValue,
  SlateEditor,
  YooptaPath,
  YooptaPathIndex,
  YooptaEventChangePayload,
  YooptaEventsMap,
  YooptaEditorEventKeys,
} from './editor/types';
export { buildBlockData } from './components/Editor/utils';
export { buildBlockElementsStructure } from './editor/elements/utils';
export { buildSlateEditor } from './utils/buildSlate';

export {
  PluginElementRenderProps,
  PluginEventHandlerOptions,
  PluginCustomEditorRenderProps,
  PluginDeserializeParser,
  PluginSerializeParser,
  YooptaMarkProps,
  PluginOptions,
} from './plugins/types';

export { Elements } from './editor/elements';
export { buildBlockElement } from './editor/elements/utils';
export { Blocks } from './editor/blocks';
export { Paths } from './editor/paths';
export {
  InsertBlockOperation,
  DeleteBlockOperation,
  NormalizePathsBlockOperation,
  SetSelectionBlockOperation,
  SplitBlockOperation,
  SetBlockValueOperation,
  SetBlockMetaOperation,
  MergeBlockOperation,
  MoveBlockOperation,
  SetSlateOperation,
  SetEditorValueOperation,
  YooptaOperation,
} from './editor/core/applyTransforms';

export type {
  ElementPropEditor,
  ElementPropEditorType,
  SelectPropEditor,
  ColorPropEditor,
  NumberPropEditor,
  TogglePropEditor,
  TextPropEditor,
  SizePropEditor,
  UploadPropEditor,
  RangePropEditor,
} from './types/propsEditor';
export default YooptaEditor;
export { YooptaEditorProps, YooptaOnChangeOptions };
export {
  useFocusedElement,
  useSetFocusedElement,
  useUpdateFocusedElement,
  useElementFocusManager,
  useResetFocusedElement,
} from './contexts/ElementFocusManager/ElementFocusManager';

import './styles.css';

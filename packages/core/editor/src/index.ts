import { useFocused, useSelected } from 'slate-react';

import {
  type RenderBlockProps,
  YooptaEditor,
  type YooptaEditorProps,
  type YooptaOnChangeOptions,
} from './yoopta-editor';

export { YooptaPlugin } from './plugins';
export {
  useBlockData,
  useYooptaEditor,
  useYooptaFocused,
  useBlockSelected,
  useYooptaReadOnly,
  useYooptaPluginOptions,
} from './contexts/YooptaContext/YooptaContext';
export { deserializeHTML } from './parsers/deserializeHTML';
export { type EmailTemplateOptions } from './parsers/getEmail';

export { generateId } from './utils/generateId';
export { HOTKEYS } from './utils/hotkeys';
export {
  getRootBlockElementType,
  getRootBlockElement,
  getAllowedPluginsFromElement,
} from './utils/block-elements';

// to remove
export { findSlateBySelectionPath } from './utils/findSlateBySelectionPath';
export { deserializeTextNodes } from './parsers/deserializeTextNodes';
export { serializeTextNodes, serializeTextNodesIntoMarkdown } from './parsers/serializeTextNodes';

export { createYooptaEditor, CreateYooptaEditorOptions } from './editor';
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
  DecoratorFn,
  LeafDecoratorRenderFn,
} from './editor/types';
export { buildBlockData, buildBlockElement } from './components/Editor/utils';
export { buildBlockElementsStructure } from './utils/block-elements';
export { buildSlateEditor } from './utils/build-slate';

export {
  Plugin,
  PluginElementRenderProps,
  PluginEventHandlerOptions,
  PluginCustomEditorRenderProps,
  PluginDeserializeParser,
  PluginSerializeParser,
  YooptaMarkProps,
  PluginOptions,
} from './plugins/types';
export type { ExtendPlugin, ExtendPluginElementConfig } from './plugins/create-yoopta-plugin';
export type { ElementStructureOptions } from './editor/elements/create-element-structure';

export { Elements } from './editor/elements';
export { Blocks } from './editor/blocks';
export { Marks } from './editor/textFormats';
export { Selection } from './editor/selection';
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
  ToogleBlockOperation,
  MoveBlockOperation,
  SetSlateOperation,
  SetEditorValueOperation,
  YooptaOperation,
} from './editor/core/applyTransforms';

// eslint-disable-next-line import/no-default-export
export default YooptaEditor;
export { RenderBlockProps, YooptaEditorProps, YooptaOnChangeOptions };

// [TODO] - move to hooks
export function useElementSelected() {
  const selected = useSelected();
  const focused = useFocused();

  return {
    isElementSelected: selected,
    isElementFocused: focused,
  };
}

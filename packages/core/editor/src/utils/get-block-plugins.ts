import { getRootBlockElement } from './block-elements';
import type { SlateElement, YooEditor } from '../editor/types';
import type { Plugin } from '../plugins/types';

export function getBlockPlugins(
  editor: YooEditor,
): Record<string, Plugin<Record<string, SlateElement>>> {
  const blockPlugins: Record<string, Plugin<Record<string, SlateElement>>> = {};

  Object.values(editor.plugins).forEach((plugin) => {
    const rootBlockElement = getRootBlockElement(plugin.elements);
    const nodeType = rootBlockElement?.props?.nodeType;
    const isInline = nodeType === 'inline' || nodeType === 'inlineVoid';

    if (!isInline) {
      blockPlugins[plugin.type] = plugin;
    }
  });

  return blockPlugins;
}

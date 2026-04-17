import type { PluginElement, PluginElementsMap } from '../../plugins/types';
import type { YooEditor } from '../types';
import type { GetRootElementOptions } from './types';

/**
 * Find the root element type from a plugin's element definitions.
 * If the plugin has a single element, that's the root.
 * If it has multiple elements, the one with `asRoot: true` is the root.
 */
function resolveRootElementType(
  elems: PluginElementsMap<string, unknown>,
): string | undefined {
  const elements = Object.keys(elems);
  return elements.length === 1
    ? elements[0]
    : elements.find((key) => elems[key].asRoot);
}

/**
 * Get the root element definition for a given block type (plugin).
 *
 * Each plugin defines one or more elements. The root element is either the only
 * element in the map, or the one marked with `asRoot: true`.
 *
 * @param editor - YooEditor instance
 * @param options - Options with `blockType` specifying the plugin type
 * @returns The root PluginElement definition, or `undefined` if the plugin
 *   doesn't exist or has no root element.
 *
 * @example
 * ```typescript
 * // Get root element of an Accordion plugin
 * const rootElement = Elements.getRootElement(editor, { blockType: 'Accordion' });
 *
 * // Check if root element is void
 * if (rootElement?.props?.nodeType === 'void') {
 *   // handle void element
 * }
 * ```
 */
export function getRootElement(
  editor: YooEditor,
  options: GetRootElementOptions,
): PluginElement<string, unknown> | undefined {
  const plugin = editor.plugins[options.blockType];
  if (!plugin?.elements) return undefined;

  const rootElementType = resolveRootElementType(plugin.elements);
  return rootElementType ? plugin.elements[rootElementType] : undefined;
}

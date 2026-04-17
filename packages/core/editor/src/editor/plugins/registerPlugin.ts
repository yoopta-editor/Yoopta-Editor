import type { YooptaPlugin } from '../../plugins';
import type { Plugin } from '../../plugins/types';
import { buildPlugins } from '../../utils/editor-builders';
import type { SlateElement, YooEditor } from '../types';

/**
 * Registers a plugin at runtime into an already-initialized editor.
 *
 * This rebuilds the full plugin map (including injection resolution)
 * and emits a `plugin:register` event so the UI can re-render.
 */
export function registerPlugin(
  editor: YooEditor,
  pluginInput: YooptaPlugin<Record<string, SlateElement>>,
): void {
  const plugin = pluginInput.getPlugin as Plugin<Record<string, SlateElement>>;

  if (editor.plugins[plugin.type]) {
    return;
  }

  // Collect all existing raw plugins + the new one
  const allPlugins = [
    ...Object.values(editor.plugins).map(stripInjectedMetadata),
    plugin,
  ];

  // Rebuild the full plugin map with injection resolution
  editor.plugins = buildPlugins(allPlugins);

  // Emit event for UI components (slash menu, toolbar, etc.) to update
  editor.emit('plugin:register', { type: plugin.type });
}

/**
 * Unregisters a plugin by type name.
 *
 * Removes the plugin and any blocks of that type from the editor content.
 * Rebuilds the plugin map and emits `plugin:unregister`.
 */
export function unregisterPlugin(editor: YooEditor, pluginType: string): void {
  if (!editor.plugins[pluginType]) {
    return;
  }

  // Remove all blocks of this plugin type from content
  const blockIdsToRemove = Object.keys(editor.children).filter(
    (blockId) => editor.children[blockId]?.type === pluginType,
  );

  for (const blockId of blockIdsToRemove) {
    delete editor.children[blockId];
    delete editor.blockEditorsMap[blockId];
  }

  // Rebuild plugins without the removed one
  const remainingPlugins = Object.values(editor.plugins)
    .filter((p) => p.type !== pluginType)
    .map(stripInjectedMetadata);

  editor.plugins = buildPlugins(remainingPlugins);

  editor.emit('plugin:unregister', { type: pluginType });
}

/**
 * Strips injection metadata (rootPlugin, added inline elements) from a processed plugin
 * so it can be re-processed cleanly by buildPlugins().
 *
 * buildPlugins() adds `rootPlugin` to injected elements and merges inline elements.
 * Re-running it on already-processed plugins would duplicate these. We strip them
 * and let buildPlugins() recompute from scratch.
 */
function stripInjectedMetadata(
  plugin: Plugin<Record<string, SlateElement>>,
): Plugin<Record<string, SlateElement>> {
  if (!plugin.elements) return plugin;

  const cleanElements: typeof plugin.elements = {};

  for (const [key, element] of Object.entries(plugin.elements)) {
    // Skip elements that were injected from other plugins
    if (element.rootPlugin && element.rootPlugin !== plugin.type) {
      continue;
    }

    // Remove rootPlugin property from own elements
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rootPlugin, ...rest } = element as Plugin<Record<string, SlateElement>>['elements'][string] & { rootPlugin?: string };
    cleanElements[key] = rest;
  }

  return { ...plugin, elements: cleanElements };
}

import { buildBlockElementsStructure, getRootBlockElement } from './blockElements';
import { buildSlateEditor } from './buildSlate';
import { getValue } from '../editor/textFormats/getValue';
import { isActive } from '../editor/textFormats/isActive';
import { toggle } from '../editor/textFormats/toggle';
import { update } from '../editor/textFormats/update';
import type { SlateElement, YooEditor } from '../editor/types';
import type { YooptaMark } from '../marks';
import type { Plugin, PluginElementsMap } from '../plugins/types';

export function buildMarks(editor, marks: YooptaMark<any>[]) {
  const formats: YooEditor['formats'] = {};

  marks.forEach((mark) => {
    const type = mark.type;
    formats[type] = {
      hotkey: mark.hotkey,
      type,
      getValue: () => getValue(editor, type),
      isActive: () => isActive(editor, type),
      toggle: () => toggle(editor, type),
      update: (props) => update(editor, type, props),
    };
  });

  return formats;
}

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

export function buildBlockSlateEditors(editor: YooEditor) {
  const blockEditorsMap = {};

  Object.keys(editor.children).forEach((id) => {
    const slate = buildSlateEditor(editor);

    if (slate.children.length === 0) {
      const block = editor.children[id];
      if (block) {
        const slateStructure = buildBlockElementsStructure(editor, block.type);
        slate.children = [slateStructure];
      }
    }

    blockEditorsMap[id] = slate;
  });

  return blockEditorsMap;
}

// const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {};

export function buildPlugins(
  plugins: Plugin<Record<string, SlateElement>>[],
): Record<string, Plugin<Record<string, SlateElement>>> {
  const pluginsMap = {};
  const inlineTopLevelPlugins: PluginElementsMap<string, any> = {};

  // First pass: collect inline elements and set asRoot for single-element plugins
  plugins.forEach((plugin) => {
    if (plugin.elements) {
      const elementKeys = Object.keys(plugin.elements);
      const updatedElements = { ...plugin.elements };

      // If plugin has only one element, mark it as root
      if (elementKeys.length === 1) {
        const singleElementKey = elementKeys[0];
        const singleElement = plugin.elements[singleElementKey];
        const nodeType = singleElement.props?.nodeType;
        const isInline = nodeType === 'inline' || nodeType === 'inlineVoid';

        if (!singleElement.asRoot && !isInline) {
          updatedElements[singleElementKey] = { ...singleElement, asRoot: true };
        }
      }

      elementKeys.forEach((elementType) => {
        const element = updatedElements[elementType];
        const nodeType = element.props?.nodeType;

        if (nodeType === 'inline' || nodeType === 'inlineVoid') {
          inlineTopLevelPlugins[elementType] = { ...element, rootPlugin: plugin.type };
        }
      });

      pluginsMap[plugin.type] = { ...plugin, elements: updatedElements };
    } else {
      pluginsMap[plugin.type] = plugin;
    }
  });

  // Second pass: extend plugins with allowedPlugins elements
  Object.keys(pluginsMap).forEach((pluginType) => {
    const plugin = pluginsMap[pluginType];
    if (plugin.elements) {
      const extendedElements = { ...plugin.elements };

      // Find elements with allowedPlugins
      Object.keys(plugin.elements).forEach((elementKey) => {
        const element = plugin.elements[elementKey];

        if (Array.isArray(element.allowedPlugins) && element.allowedPlugins.length > 0) {
          const allowedElementTypes: string[] = [];

          // For each allowed plugin, add its elements
          element.allowedPlugins.forEach((allowedPluginType) => {
            const allowedPlugin = plugins.find((p) => p.type === allowedPluginType);

            if (allowedPlugin && allowedPlugin.elements) {
              // Find root element of the allowed plugin
              const rootElementType =
                Object.keys(allowedPlugin.elements).find(
                  (key) => allowedPlugin.elements[key].asRoot,
                ) ?? Object.keys(allowedPlugin.elements)[0];

              if (rootElementType) {
                allowedElementTypes.push(rootElementType);

                // Add root element with render function and rootPlugin (if not already present)
                if (!extendedElements[rootElementType]) {
                  extendedElements[rootElementType] = {
                    ...allowedPlugin.elements[rootElementType],
                    rootPlugin: allowedPluginType,
                  };
                }

                // Add children elements with render functions and rootPlugin
                const rootElement = allowedPlugin.elements[rootElementType];
                if (rootElement?.children) {
                  rootElement.children.forEach((childType) => {
                    if (allowedPlugin.elements[childType] && !extendedElements[childType]) {
                      extendedElements[childType] = {
                        ...allowedPlugin.elements[childType],
                        rootPlugin: allowedPluginType,
                      };
                    }
                  });
                }
              }
            }
          });

          // Update children property in extendedElements to include allowed element types
          if (allowedElementTypes.length > 0) {
            const extendedElement = extendedElements[elementKey];
            if (extendedElement) {
              extendedElement.children = [
                ...(extendedElement.children ?? []),
                ...allowedElementTypes,
              ] as any;
            }
          }
        }
      });

      // Add inline elements to all plugins
      const finalElements = { ...extendedElements, ...inlineTopLevelPlugins };
      pluginsMap[plugin.type] = { ...plugin, elements: finalElements };
    }
  });
  console.log('editor-builders buildPlugins', pluginsMap);

  return pluginsMap;
}

export function buildCommands(
  editor: YooEditor,
  plugins: Plugin<Record<string, SlateElement>>[],
): Record<string, (...args: any[]) => any> {
  const commands = {};

  plugins.forEach((plugin) => {
    if (plugin.commands) {
      Object.keys(plugin.commands).forEach((command) => {
        if (plugin.commands?.[command]) {
          commands[command] = (...args) => plugin.commands?.[command](editor, ...args);
        }
      });
    }
  });

  return commands;
}

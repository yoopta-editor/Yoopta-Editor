import { buildBlockElementsStructure } from './block-elements';
import { buildSlateEditor } from './build-slate';
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
      getValue: () => getValue(editor, { type }),
      isActive: () => isActive(editor, { type }),
      toggle: () => toggle(editor, { type }),
      update: (props) => update(editor, { type, value: props }),
    };
  });

  return formats;
}

export function buildBlockSlateEditors(editor: YooEditor) {
  const blockEditorsMap = {};

  Object.keys(editor.children).forEach((id) => {
    const slate = editor.buildSlateEditorFn
      ? editor.buildSlateEditorFn(id)
      : buildSlateEditor(editor);

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

/**
 * Checks if an element is inline or inlineVoid
 */
function isInlineElement(element: PluginElementsMap<string, any>[string]): boolean {
  const nodeType = element.props?.nodeType;
  return nodeType === 'inline' || nodeType === 'inlineVoid';
}

/**
 * Checks if a plugin is an inline/inlineVoid plugin (all its elements are inline/inlineVoid)
 */
function isInlinePlugin(plugin: Plugin<Record<string, SlateElement>>): boolean {
  if (!plugin.elements) return false;
  const elementKeys = Object.keys(plugin.elements);
  if (elementKeys.length === 0) return false;

  // Check if all elements are inline/inlineVoid
  return elementKeys.every((key) => {
    const element = plugin.elements[key];
    return isInlineElement(element);
  });
}

/**
 * Checks if a plugin is a root element plugin (has at least one root element)
 */
function isRootElementPlugin(plugin: Plugin<Record<string, SlateElement>>): boolean {
  if (!plugin.elements) return false;
  const elementKeys = Object.keys(plugin.elements);

  // Check if any element is marked as root or has nodeType 'void' or 'block'
  return elementKeys.some((key) => {
    const element = plugin.elements[key];
    const nodeType = element.props?.nodeType;
    return element.asRoot || nodeType === 'void' || nodeType === 'block';
  });
}

export function buildPlugins(
  plugins: Plugin<Record<string, SlateElement>>[],
): Record<string, Plugin<Record<string, SlateElement>>> {
  const pluginsMap: Record<string, Plugin<Record<string, SlateElement>>> = {};
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

  // Second pass: extend plugins with injectElementsFromPlugins elements
  Object.keys(pluginsMap).forEach((pluginType) => {
    const plugin = pluginsMap[pluginType];
    if (plugin.elements) {
      const extendedElements = { ...plugin.elements };
      const isCurrentPluginInline = isInlinePlugin(plugin);
      const isCurrentPluginRoot = isRootElementPlugin(plugin);

      // Find elements with injectElementsFromPlugins
      Object.keys(plugin.elements).forEach((elementKey) => {
        const element = plugin.elements[elementKey];
        if (
          Array.isArray(element.injectElementsFromPlugins) &&
          element.injectElementsFromPlugins.length > 0
        ) {
          // For each allowed plugin, add its elements to the plugin's elements map
          // Filter out self-references to prevent circular dependencies
          element.injectElementsFromPlugins
            .filter((allowedPluginType) => allowedPluginType !== pluginType)
            .forEach((allowedPluginType) => {
              const allowedPlugin = plugins.find((p) => p.type === allowedPluginType);

              if (allowedPlugin?.elements) {
                const isAllowedPluginInline = isInlinePlugin(allowedPlugin);
                const isAllowedPluginRoot = isRootElementPlugin(allowedPlugin);

                // Prevent inline/inlineVoid plugins from injecting into each other
                if (isCurrentPluginInline && isAllowedPluginInline) {
                  return;
                }

                // Prevent root elements from being injected into inline/inlineVoid plugins
                if (isCurrentPluginInline && isAllowedPluginRoot) {
                  return;
                }

                // Prevent inline/inlineVoid elements from being injected into root element plugins
                if (isCurrentPluginRoot && isAllowedPluginInline) {
                  return;
                }

                // Find root element of the allowed plugin
                const rootElementType =
                  Object.keys(allowedPlugin.elements).find(
                    (key) => allowedPlugin.elements[key].asRoot,
                  ) ?? Object.keys(allowedPlugin.elements)[0];

                if (rootElementType) {
                  const rootElement = allowedPlugin.elements[rootElementType];
                  const isRootElementInline = isInlineElement(rootElement);

                  // Skip if trying to inject inline element into root plugin
                  if (isCurrentPluginRoot && isRootElementInline) {
                    return;
                  }

                  // Add root element WITHOUT asRoot (it's now nested, not root)
                  if (!extendedElements[rootElementType]) {
                    // Copy element without asRoot property
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { asRoot, ...elementWithoutAsRoot } = rootElement;
                    extendedElements[rootElementType] = {
                      ...elementWithoutAsRoot,
                      rootPlugin: allowedPluginType,
                    };
                  }

                  // Add children elements with render functions and rootPlugin
                  if (rootElement?.children) {
                    rootElement.children.forEach((childType) => {
                      if (allowedPlugin.elements[childType] && !extendedElements[childType]) {
                        const childElement = allowedPlugin.elements[childType];
                        const isChildElementInline = isInlineElement(childElement);

                        // Skip if trying to inject inline child element into root plugin
                        if (isCurrentPluginRoot && isChildElementInline) {
                          return;
                        }

                        extendedElements[childType] = {
                          ...childElement,
                          rootPlugin: allowedPluginType,
                        };
                      }
                    });
                  }
                }
              }
            });

          // Note: We don't add injectElementsFromPlugins elements to the children array
          // injectElementsFromPlugins elements are available for insertion but not automatically created
        }
      });

      // Add inline elements only to root element plugins (not to inline/inlineVoid plugins)
      const finalElements = isCurrentPluginInline
        ? extendedElements
        : ({ ...extendedElements, ...inlineTopLevelPlugins } as typeof extendedElements);
      pluginsMap[plugin.type] = { ...plugin, elements: finalElements };
    }
  });

  return pluginsMap;
}

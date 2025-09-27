import { SlateElement, YooEditor, YooptaBlockData } from '../editor/types';
import { Plugin, PluginElementsMap } from '../plugins/types';
import { YooptaMark } from '../marks';
import { findPluginBlockByPath } from '../utils/findPluginBlockByPath';
import { buildBlockElementsStructure, getRootBlockElement } from './blockElements';
import { buildSlateEditor } from './buildSlate';
import { getValue } from '../editor/textFormats/getValue';
import { isActive } from '../editor/textFormats/isActive';
import { toggle } from '../editor/textFormats/toggle';
import { update } from '../editor/textFormats/update';

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

export function buildBlocks(editor, plugins: Plugin<Record<string, SlateElement>>[]) {
  const blocks: YooEditor['blocks'] = {};

  plugins.forEach((plugin) => {
    const rootBlockElement = getRootBlockElement(plugin.elements);
    const nodeType = rootBlockElement?.props?.nodeType;
    const isInline = nodeType === 'inline' || nodeType === 'inlineVoid';

    if (!isInline) {
      const elements = {};
      Object.keys(plugin.elements).forEach((key) => {
        const { render, ...element } = plugin.elements[key];
        elements[key] = element;
      });

      // Omit fetchers and other non-block related options
      const { display, placeholder, shortcuts } = plugin.options || {};

      blocks[plugin.type] = {
        type: plugin.type,
        elements,
        hasCustomEditor: !!plugin.customEditor,
        options: {
          display,
          placeholder,
          shortcuts,
        },
        isActive: () => {
          const block = findPluginBlockByPath(editor, { at: editor.path.current });
          return block?.type === plugin.type;
        },
      };
    }
  });

  return blocks;
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

export function buildBlockShortcuts(editor: YooEditor) {
  const shortcuts = {};

  Object.values(editor.blocks).forEach((block) => {
    const hasShortcuts =
      block.options &&
      Array.isArray(block.options?.shortcuts) &&
      block.options?.shortcuts.length > 0;

    if (hasShortcuts) {
      block.options?.shortcuts?.forEach((shortcut) => {
        shortcuts[shortcut] = block;
      });
    }
  });

  return shortcuts;
}

// const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {};

export function buildPlugins(
  plugins: Plugin<Record<string, SlateElement>>[],
): Record<string, Plugin<Record<string, SlateElement>>> {
  const pluginsMap = {};
  const inlineTopLevelPlugins: PluginElementsMap<string, any> = {};

  plugins.forEach((plugin) => {
    if (plugin.elements) {
      Object.keys(plugin.elements).forEach((type) => {
        const element = plugin.elements[type];

        const nodeType = element.props?.nodeType;

        if (nodeType === 'inline' || nodeType === 'inlineVoid') {
          inlineTopLevelPlugins[type] = { ...element, rootPlugin: plugin.type };
        }
      });
    }

    pluginsMap[plugin.type] = plugin;
  });

  plugins.forEach((plugin) => {
    if (plugin.elements) {
      const elements = { ...plugin.elements, ...inlineTopLevelPlugins };
      pluginsMap[plugin.type] = { ...plugin, elements };
    }
  });

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

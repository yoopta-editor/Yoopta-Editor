import { Element } from 'slate';

import { Blocks } from '../editor/blocks';
import type {
  SlateElement,
  YooEditor,
  YooptaBlockBaseMeta,
  YooptaBlockData,
} from '../editor/types';
import type { PluginDeserializeParser } from '../plugins/types';
import { getRootBlockElementType } from '../utils/block-elements';
import { generateId } from '../utils/generateId';
import { isYooptaBlock } from '../utils/validations';

type MarkMatcher = {
  type: string;
  parse?: (el: HTMLElement) => Record<string, unknown>;
};

const MARKS_NODE_NAME_MATCHERS_MAP: Record<string, MarkMatcher> = {
  B: { type: 'bold' },
  STRONG: { type: 'bold' },
  I: { type: 'italic' },
  U: { type: 'underline' },
  S: { type: 'strike' },
  CODE: { type: 'code' },
  EM: { type: 'italic' },
  MARK: {
    type: 'highlight',
    parse: (el) => {
      const color = el.style?.color;
      return color ? { color } : {};
    },
  },
};

const VALID_TEXT_ALIGNS: (YooptaBlockBaseMeta['align'] | undefined)[] = [
  'left',
  'center',
  'right',
  undefined,
];

type PluginsMapByNode = {
  type: string;
  parse: PluginDeserializeParser['parse'];
};

type PluginsMapByNodeNames = Record<string, PluginsMapByNode | PluginsMapByNode[]>;

// Cache for plugins map to avoid rebuilding on every paste
const pluginsMapCache = new WeakMap<YooEditor, PluginsMapByNodeNames>();

type DeserializedChild =
  | { text: string;[mark: string]: unknown }
  | SlateElement
  | YooptaBlockData
  | null;

function mapNodeChildren(child: unknown): DeserializedChild | DeserializedChild[] {
  if (typeof child === 'string') {
    return { text: child };
  }

  if (Element.isElement(child)) {
    return child as SlateElement;
  }

  if (Array.isArray(child)) {
    return child.map(mapNodeChildren).flat();
  }

  if (child && typeof child === 'object' && 'text' in child) {
    return child as { text: string };
  }

  if (isYooptaBlock(child)) {
    const block = child as YooptaBlockData;
    const firstElement = block.value[0] as SlateElement | undefined;
    if (firstElement?.children) {
      return firstElement.children.map(mapNodeChildren).flat();
    }
    return { text: '' };
  }

  return { text: '' };
}

function getMappedPluginByNodeNames(editor: YooEditor): PluginsMapByNodeNames {
  // Return cached map if available
  const cached = pluginsMapCache.get(editor);
  if (cached) return cached;

  const PLUGINS_NODE_NAME_MATCHERS_MAP: PluginsMapByNodeNames = {};

  Object.keys(editor.plugins).forEach((pluginType) => {
    const plugin = editor.plugins[pluginType];
    const { parsers } = plugin;
    const htmlParser = parsers?.html;
    const deserializeConfig = htmlParser?.deserialize;

    if (deserializeConfig?.nodeNames) {
      const { nodeNames } = deserializeConfig;

      nodeNames.forEach((nodeName) => {
        const nodeNameMap = PLUGINS_NODE_NAME_MATCHERS_MAP[nodeName];

        if (nodeNameMap) {
          const nodeNameItem = Array.isArray(nodeNameMap) ? nodeNameMap : [nodeNameMap];
          PLUGINS_NODE_NAME_MATCHERS_MAP[nodeName] = [
            ...nodeNameItem,
            { type: pluginType, parse: deserializeConfig.parse },
          ];
        } else {
          PLUGINS_NODE_NAME_MATCHERS_MAP[nodeName] = {
            type: pluginType,
            parse: deserializeConfig.parse,
          };
        }
      });
    }
  });

  // Cache the result
  pluginsMapCache.set(editor, PLUGINS_NODE_NAME_MATCHERS_MAP);

  return PLUGINS_NODE_NAME_MATCHERS_MAP;
}

function buildBlock(
  editor: YooEditor,
  plugin: PluginsMapByNode,
  el: HTMLElement,
  children: unknown[],
): SlateElement | YooptaBlockData | YooptaBlockData[] | undefined {
  let nodeElementOrBlocks: SlateElement | YooptaBlockData[] | undefined;

  if (plugin.parse) {
    const parseResult = plugin.parse(el, editor);
    if (parseResult !== undefined) {
      nodeElementOrBlocks = parseResult;
    }

    const isInline =
      Element.isElement(nodeElementOrBlocks) && nodeElementOrBlocks.props?.nodeType === 'inline';
    if (isInline) return nodeElementOrBlocks;
  }

  const block = editor.plugins[plugin.type];
  if (!block) return undefined;

  const rootElementType = getRootBlockElementType(block.elements) ?? '';
  const rootElement = block.elements?.[rootElementType];
  if (!rootElement) return undefined;

  const isVoid = rootElement.props?.nodeType === 'void';

  const mappedChildren = isVoid
    ? [{ text: '' }]
    : (children.map(mapNodeChildren).flat().filter(Boolean) as SlateElement['children']);

  let rootNode: SlateElement = {
    id: generateId(),
    type: rootElementType,
    children: mappedChildren.length > 0 ? mappedChildren : [{ text: '' }],
    props: { nodeType: 'block', ...rootElement.props },
  };

  if (nodeElementOrBlocks) {
    if (Element.isElement(nodeElementOrBlocks)) {
      rootNode = nodeElementOrBlocks as SlateElement;
    } else if (Array.isArray(nodeElementOrBlocks)) {
      return nodeElementOrBlocks;
    }
  }

  // Ensure children is never empty
  if (!rootNode.children || rootNode.children.length === 0) {
    rootNode.children = [{ text: '' }];
  }

  // If plugin has parse but returned nothing, skip this node
  if (!nodeElementOrBlocks && plugin.parse) {
    return undefined;
  }

  const align = el.getAttribute('data-meta-align') as YooptaBlockBaseMeta['align'];
  const depth = parseInt(el.getAttribute('data-meta-depth') ?? '0', 10);

  const blockData = Blocks.buildBlockData({
    id: generateId(),
    type: plugin.type,
    value: [rootNode],
    meta: {
      order: 0,
      depth: Number.isNaN(depth) ? 0 : depth,
      align: VALID_TEXT_ALIGNS.includes(align) ? align : undefined,
    },
  });

  return blockData;
}

function deserialize(
  editor: YooEditor,
  pluginsMap: PluginsMapByNodeNames,
  el: HTMLElement | ChildNode,
): DeserializedChild | DeserializedChild[] {
  // Text node
  if (el.nodeType === Node.TEXT_NODE) {
    const text = el.textContent?.replace(/[\t\n\r\f\v]+/g, ' ') ?? '';
    return { text } as DeserializedChild;
  }

  // Not an element node
  if (el.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  // Line break
  if (el.nodeName === 'BR') {
    return { text: '\n' };
  }

  const parent = el as HTMLElement;
  const children = Array.from(parent.childNodes)
    .map((node) => deserialize(editor, pluginsMap, node))
    .flat()
    .filter((child): child is NonNullable<DeserializedChild> => child !== null);

  // Handle marks (bold, italic, etc.)
  const markMatcher = MARKS_NODE_NAME_MATCHERS_MAP[parent.nodeName];
  if (markMatcher) {
    const markType = markMatcher.type;
    const markValue = markMatcher.parse ? markMatcher.parse(parent) : true;

    return children.map((child) => {
      if (typeof child === 'string') {
        return { [markType]: markValue, text: child };
      }
      if (child && typeof child === 'object' && 'text' in child) {
        return { ...child, [markType]: markValue };
      }
      return child;
    });
  }

  // Handle plugin blocks
  const plugin = pluginsMap[parent.nodeName];

  if (plugin) {
    if (Array.isArray(plugin)) {
      const blocks = plugin
        .map((p) => buildBlock(editor, p, parent, children))
        .filter(Boolean) as (SlateElement | YooptaBlockData | YooptaBlockData[])[];
      return blocks.flat();
    }

    const result = buildBlock(editor, plugin, parent, children);
    if (result) return result;
  }

  return children;
}

/**
 * Clears the cached plugins map for the editor.
 * Call this when plugins are modified.
 */
export function clearDeserializeCache(editor: YooEditor): void {
  pluginsMapCache.delete(editor);
}

/**
 * Deserializes HTML into Yoopta blocks.
 */
export function deserializeHTML(editor: YooEditor, html: HTMLElement): YooptaBlockData[] {
  const PLUGINS_NODE_NAME_MATCHERS_MAP = getMappedPluginByNodeNames(editor);

  const result = deserialize(editor, PLUGINS_NODE_NAME_MATCHERS_MAP, html);
  const flatResult = Array.isArray(result) ? result.flat() : [result];

  return flatResult.filter(isYooptaBlock) as YooptaBlockData[];
}

import { Element } from 'slate';

import { Blocks } from '../editor/blocks';
import type {
  SlateElement,
  YooEditor,
  YooptaBlockBaseMeta,
  YooptaBlockData,
} from '../editor/types';
import type { PluginDeserializeParser } from '../plugins/types';
import { getRootBlockElementType } from '../utils/blockElements';
import { generateId } from '../utils/generateId';
import { isYooptaBlock } from '../utils/validators';

const MARKS_NODE_NAME_MATCHERS_MAP = {
  B: { type: 'bold' },
  STRONG: { type: 'bold' },
  I: { type: 'italic' },
  U: { type: 'underline' },
  S: { type: 'strike' },
  CODE: { type: 'code' },
  EM: { type: 'italic' },
  MARK: { type: 'highlight', parse: (el) => ({ color: el.style.color }) },
};

const VALID_TEXT_ALIGNS = ['left', 'center', 'right', undefined];

type PluginsMapByNode = {
  type: string;
  parse: PluginDeserializeParser['parse'];
};

type PluginsMapByNodeNames = Record<string, PluginsMapByNode | PluginsMapByNode[]>;

function getMappedPluginByNodeNames(editor: YooEditor): PluginsMapByNodeNames {
  const PLUGINS_NODE_NAME_MATCHERS_MAP: PluginsMapByNodeNames = {};

  Object.keys(editor.plugins).forEach((pluginType) => {
    const plugin = editor.plugins[pluginType];
    const { parsers } = plugin;

    if (parsers) {
      const { html } = parsers;

      if (html) {
        const { deserialize } = html;

        if (deserialize) {
          const { nodeNames } = deserialize;
          if (nodeNames) {
            nodeNames.forEach((nodeName) => {
              const nodeNameMap = PLUGINS_NODE_NAME_MATCHERS_MAP[nodeName];

              if (nodeNameMap) {
                const nodeNameItem = Array.isArray(nodeNameMap) ? nodeNameMap : [nodeNameMap];
                PLUGINS_NODE_NAME_MATCHERS_MAP[nodeName] = [
                  ...nodeNameItem,
                  { type: pluginType, parse: deserialize.parse },
                ];
              } else {
                PLUGINS_NODE_NAME_MATCHERS_MAP[nodeName] = {
                  type: pluginType,
                  parse: deserialize.parse,
                };
              }
            });
          }
        }
      }
    }
  });

  return PLUGINS_NODE_NAME_MATCHERS_MAP;
}

function buildBlock(editor: YooEditor, plugin: PluginsMapByNode, el: HTMLElement, children: any[]) {
  let nodeElementOrBlocks;

  if (plugin.parse) {
    nodeElementOrBlocks = plugin.parse(el as HTMLElement, editor);

    const isInline =
      Element.isElement(nodeElementOrBlocks) && nodeElementOrBlocks.props?.nodeType === 'inline';
    if (isInline) return nodeElementOrBlocks;
  }

  const block = editor.plugins[plugin.type];
  const rootElementType = getRootBlockElementType(block.elements) || '';
  const rootElement = block.elements[rootElementType];

  const isVoid = rootElement.props?.nodeType === 'void';

  let rootNode: SlateElement<string, any> | YooptaBlockData[] = {
    id: generateId(),
    type: rootElementType,
    children: isVoid && !block.customEditor ? [{ text: '' }] : children.map(mapNodeChildren).flat(),
    props: { nodeType: 'block', ...rootElement.props },
  };

  if (nodeElementOrBlocks) {
    if (Element.isElement(nodeElementOrBlocks)) {
      rootNode = nodeElementOrBlocks;
    } else if (Array.isArray(nodeElementOrBlocks)) {
      const blocks = nodeElementOrBlocks;
      return blocks;
    }
  }

  if (rootNode.children.length === 0) {
    rootNode.children = [{ text: '' }];
  }

  if (!nodeElementOrBlocks && plugin.parse) return;

  const align = el.getAttribute('data-meta-align') as YooptaBlockBaseMeta['align'];
  const depth = parseInt(el.getAttribute('data-meta-depth') || '0', 10);

  const blockData = Blocks.buildBlockData({
    id: generateId(),
    type: plugin.type,
    value: [rootNode],
    meta: {
      order: 0,
      depth,
      align: VALID_TEXT_ALIGNS.includes(align) ? align : undefined,
    },
  });

  return blockData;
}

function deserialize(
  editor: YooEditor,
  pluginsMap: PluginsMapByNodeNames,
  el: HTMLElement | ChildNode,
) {
  if (el.nodeType === 3) {
    const text = el.textContent?.replace(/[\t\n\r\f\v]+/g, ' ');
    return { text };
  }
  if (el.nodeType !== 1) {
    return null;
  }
  if (el.nodeName === 'BR') {
    return { text: '\n' };
  }

  const parent = el as HTMLElement;
  const children = Array.from(parent.childNodes)
    .map((node) => deserialize(editor, pluginsMap, node))
    .flat()
    .filter(Boolean);

  if (MARKS_NODE_NAME_MATCHERS_MAP[parent.nodeName]) {
    const mark = MARKS_NODE_NAME_MATCHERS_MAP[parent.nodeName];
    const markType = mark.type;

    return children.map((child) => {
      if (typeof child === 'string') {
        return { [markType]: mark.parse ? mark.parse(parent) : true, text: child };
      }
      if (child.text) {
        return { ...child, [markType]: mark.parse ? mark.parse(parent) : true };
      }
      return child;
    });
  }

  const plugin = pluginsMap[parent.nodeName];

  if (plugin) {
    if (Array.isArray(plugin)) {
      const blocks = plugin.map((p) => buildBlock(editor, p, parent, children)).filter(Boolean);
      return blocks;
    }

    return buildBlock(editor, plugin, parent, children);
  }

  return children;
}

function mapNodeChildren(child) {
  if (typeof child === 'string') {
    return { text: child };
  }

  if (Element.isElement(child)) {
    return child;
  }

  if (Array.isArray(child)) {
    return child.map(mapNodeChildren).flat();
  }

  if (child?.text) {
    return child;
  }

  if (isYooptaBlock(child)) {
    const block = child as YooptaBlockData;
    return (block.value[0] as SlateElement).children.map(mapNodeChildren).flat();
  }

  return { text: '' };
}

export function deserializeHTML(editor: YooEditor, html: HTMLElement) {
  console.log('pasted html', html);

  const PLUGINS_NODE_NAME_MATCHERS_MAP = getMappedPluginByNodeNames(editor);

  const blocks = deserialize(editor, PLUGINS_NODE_NAME_MATCHERS_MAP, html)
    .flat()
    .filter(isYooptaBlock) as YooptaBlockData[];

  return blocks;
}

import type { NodeEntry } from 'slate';
import { Editor, Element, Path } from 'slate';

import { generateId } from './generateId';
import { buildBlockElement } from '../components/Editor/utils';
import type { SlateEditor, SlateElement, YooEditor, YooptaBlock } from '../editor/types';
import { YooptaBlockData } from '../editor/types';
import type {
  Plugin,
  PluginElement,
  PluginElementProps,
  PluginElementsMap,
} from '../plugins/types';

export function getRootBlockElementType(
  elems: PluginElementsMap<string, unknown> | undefined,
): string | undefined {
  if (!elems) return;

  const elements = Object.keys(elems);
  const rootElementType =
    elements.length === 1 ? elements[0] : elements.find((key) => elems[key].asRoot);

  return rootElementType;
}

export function getRootBlockElement(
  elems: PluginElementsMap<string, unknown> | undefined,
): PluginElement<string, unknown> | undefined {
  if (!elems) return;

  const rootElementType = getRootBlockElementType(elems);
  const rootElement = rootElementType ? elems[rootElementType] : undefined;

  return rootElement;
}

export function isRootElementVoid(elems: PluginElementsMap<string, unknown> | undefined): boolean {
  const rootElement = getRootBlockElement(elems);
  return rootElement?.props?.nodeType === 'void';
}

export type GetBlockElementNodeOptions = {
  at?: Path;
  elementType?: string;
};

export function getBlockElementNode(
  slate: SlateEditor,
  options: GetBlockElementNodeOptions = {},
): NodeEntry<SlateElement> | undefined {
  const { at, elementType } = options;

  const atPath = at || slate.selection?.anchor.path;
  if (!atPath) return;

  let match = (n) => !Editor.isEditor(n) && Element.isElement(n);

  if (elementType) {
    match = (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === elementType;
  }

  const parentPath = Path.parent(atPath);
  const nodes = Editor.nodes(slate, {
    at: parentPath,
    match,
    mode: 'lowest',
  });

  if (nodes) {
    const [nodeEntry] = nodes;
    return nodeEntry as NodeEntry<SlateElement>;
  }
}

export function buildSlateNodeElement(
  type: string,
  props: PluginElementProps<unknown> = { nodeType: 'block' },
): SlateElement<any> {
  return { id: generateId(), type, children: [{ text: '' }], props };
}

function recursivelyCollectElementChildren(
  blockElement: PluginElement<string, unknown>,
  blockElements: PluginElementsMap,
  elementsMapWithTextContent?: ElementsMapWithTextContent,
): SlateElement[] {
  return (
    blockElement.children?.map((elementType) => {
      const childElement = blockElements[elementType];
      if (!childElement) {
        throw new Error(`Element definition for ${elementType} not found`);
      }

      const childNode: SlateElement = buildBlockElement({
        id: generateId(),
        type: elementType,
        props: childElement.props,
        children:
          childElement.children && childElement.children.length > 0
            ? recursivelyCollectElementChildren(
                childElement,
                blockElements,
                elementsMapWithTextContent,
              )
            : [{ text: elementsMapWithTextContent?.[elementType] || '' }],
      });

      return childNode;
    }) || []
  );
}

type ElementsMapWithTextContent = Record<string, string>;

export function buildBlockElementsStructure(
  editor: YooEditor,
  blockType: string,
  elementsMapWithTextContent?: ElementsMapWithTextContent,
): SlateElement {
  const block: YooptaBlock = editor.blocks[blockType];
  const blockElements = block.elements;

  const rootBlockElementType = getRootBlockElementType(blockElements);
  if (!rootBlockElementType) {
    throw new Error(`Root element type not found for block type ${blockType}`);
  }
  const rootBlockElement = blockElements[rootBlockElementType];

  const rootElementNode: SlateElement = {
    id: generateId(),
    type: rootBlockElementType,
    props: rootBlockElement.props,
    children:
      rootBlockElement.children && rootBlockElement.children.length > 0
        ? recursivelyCollectElementChildren(
            rootBlockElement,
            blockElements,
            elementsMapWithTextContent,
          )
        : [{ text: '' }],
  };

  return rootElementNode;
}

export function getPluginByInlineElement(
  plugins: YooEditor['plugins'],
  elementType: string,
): Plugin<Record<string, SlateElement>, unknown> | undefined {
  const plugin = Object.values(plugins).find(
    (plugin) => plugin.type === plugin.elements?.[elementType]?.rootPlugin,
  );
  return plugin;
}

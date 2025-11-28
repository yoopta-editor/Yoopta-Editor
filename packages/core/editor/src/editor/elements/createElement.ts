import type { Span } from 'slate';
import { Editor, Path, Transforms } from 'slate';

import { getElementEntry } from './getElementEntry';
import { buildBlockElement } from '../../components/Editor/utils';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';

export type CreateBlockElementOptions = {
  path?: 'next' | 'prev' | Path | Span;
  focus?: boolean;
  split?: boolean;
};

export type CreateElement<TElementKeys, TElementProps> = {
  type: TElementKeys;
  props?: TElementProps;
};

export function createElement<TElementKeys extends string, TElementProps>(
  editor: YooEditor,
  blockId: string,
  element: CreateElement<TElementKeys, TElementProps>,
  options?: CreateBlockElementOptions,
) {
  const blockData = editor.children[blockId];
  if (!blockData) {
    throw new Error(`Block with id ${blockId} not found`);
  }
  console.log('createElement element', element);

  const slate = findSlateBySelectionPath(editor, { at: blockData.meta.order });
  if (!slate) {
    console.warn('No slate found');
    return;
  }

  Editor.withoutNormalizing(slate, () => {
    const block = editor.plugins[blockData.type];
    const blockElement = block.elements[element.type];
    const nodeElement = buildBlockElement({
      type: element.type,
      props: { ...blockElement.props, ...element.props },
    });

    const elementTypes = Object.keys(block.elements);

    const childrenElements: SlateElement[] = [];

    elementTypes.forEach((blockElementType) => {
      const blockElementConfig = block.elements[blockElementType];

      if (blockElementType === element.type) {
        if (Array.isArray(blockElementConfig.children) && blockElementConfig.children.length > 0) {
          blockElementConfig.children.forEach((childElementType) => {
            const childElement = block.elements[childElementType];
            childrenElements.push(
              buildBlockElement({ type: childElementType, props: childElement.props }),
            );
          });
        }
      }
    });

    if (childrenElements.length > 0) nodeElement.children = childrenElements;

    const { path, focus = true } = options || {};
    let atPath;

    const elementEntry = getElementEntry(editor, blockId, { type: element.type });

    if (elementEntry) {
      const [, elementPath] = elementEntry;

      if (Path.isPath(path)) {
        atPath = path;
      } else if (path === 'prev') {
        atPath = Path.previous(elementPath);
      } else if (path === 'next') {
        atPath = Path.next(elementPath);
      }
    }

    Transforms.insertNodes(slate, nodeElement, { at: atPath, select: focus });

    if (focus) {
      if (childrenElements.length > 0) {
        const firstChild = childrenElements[0];
        const firstElementEntry = getElementEntry(editor, blockId, {
          path: atPath,
          type: firstChild.type,
        });

        if (firstElementEntry) {
          const [, firstElementPath] = firstElementEntry;
          Transforms.select(slate, firstElementPath);
        }
      }
    }

    // editor.emit('change', { value: editor.children, operations: [] });
  });
}

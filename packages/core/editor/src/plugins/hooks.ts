import { useMemo } from 'react';
import { Editor, Element, Node, Operation, Path, Range, Transforms } from 'slate';
import { buildBlockData } from '../components/Editor/utils';
import { Blocks } from '../editor/blocks';
import { Paths } from '../editor/paths';
import { SlateEditor, YooEditor, YooptaBlockData } from '../editor/types';
import { EditorEventHandlers } from '../types/eventHandlers';
import { getRootBlockElementType } from '../utils/blockElements';
import { generateId } from '../utils/generateId';
import { HOTKEYS } from '../utils/hotkeys';
import { withInlines } from './extenstions/withInlines';
import { PluginEventHandlerOptions, PluginEvents } from './types';
import { SetSlateOperation, YooptaOperation } from '../editor/core/applyTransforms';
import { YooptaHistory } from '../editor/core/history';

export const useSlateEditor = (
  id: string,
  editor: YooEditor,
  block: YooptaBlockData,
  elements: any,
  withExtensions: any,
) => {
  return useMemo(() => {
    let slate = editor.blockEditorsMap[id];

    const { normalizeNode, insertText, apply } = slate;
    const elementTypes = Object.keys(elements);

    elementTypes.forEach((elementType) => {
      const nodeType = elements[elementType].props?.nodeType;

      const isInline = nodeType === 'inline';
      const isVoid = nodeType === 'void';
      const isInlineVoid = nodeType === 'inlineVoid';

      const { markableVoid: prevMarkableVoid, isVoid: prevIsVoid, isInline: prevIsInline } = slate;
      if (isInlineVoid) {
        slate.markableVoid = (element) => prevMarkableVoid(element) || element.type === elementType;
      }

      if (isVoid || isInlineVoid) {
        slate.isVoid = (element) => prevIsVoid(element) || element.type === elementType;
      }

      if (isInline || isInlineVoid) {
        slate.isInline = (element) => prevIsInline(element) || element.type === elementType;

        // [TODO] - Move it to Link plugin extension
        slate = withInlines(editor, slate);
      }
    });

    slate.insertText = (text) => {
      const selectedPaths = Paths.getSelectedPaths(editor);
      const path = Paths.getPath(editor);
      if (Array.isArray(selectedPaths) && selectedPaths.length > 0) {
        editor.setPath({ current: path });
      }

      insertText(text);
    };

    // This normalization is needed to validate the elements structure
    slate.normalizeNode = (entry) => {
      const [node, path] = entry;
      const blockElements = editor.blocks[block.type].elements;

      // Normalize only `simple` block elements.
      // Simple elements are elements that have only one defined block element type.
      // [TODO] - handle validation for complex block elements
      if (Object.keys(blockElements).length > 1) {
        return normalizeNode(entry);
      }

      if (Element.isElement(node)) {
        const { type } = node;
        const rootElementType = getRootBlockElementType(blockElements);

        if (!elementTypes.includes(type)) {
          Transforms.setNodes(slate, { type: rootElementType, props: { ...node.props } }, { at: path });
          return;
        }

        if (node.type === rootElementType) {
          for (const [child, childPath] of Node.children(slate, path)) {
            if (Element.isElement(child) && !slate.isInline(child)) {
              Transforms.unwrapNodes(slate, { at: childPath });
              return;
            }
          }
        }
      }

      normalizeNode(entry);
    };

    slate.apply = (op) => {
      if (Operation.isSelectionOperation(op)) {
        const selectedPaths = Paths.getSelectedPaths(editor);
        const path = Paths.getPath(editor);

        if (Array.isArray(selectedPaths) && slate.selection && Range.isExpanded(slate.selection)) {
          editor.setPath({ current: path });
        }
      }

      let save = editor.isSavingHistory();
      if (typeof save === 'undefined') {
        save = shouldSave(op);
      }

      if (save) {
        const lastEditorBatch = editor.historyStack.undos[editor.historyStack.undos.length - 1];
        if (!lastEditorBatch || lastEditorBatch?.operations[0]?.type !== 'set_slate') {
          const setSlateOperation: SetSlateOperation = {
            type: 'set_slate',
            properties: {
              slateOps: [op],
              selectionBefore: slate.selection,
            },
            blockId: id,
            slate: slate,
          };

          editor.applyTransforms([setSlateOperation], { source: 'api', validatePaths: false });
          apply(op);
          return;
        }

        const lastSlateOps = (lastEditorBatch?.operations[0] as SetSlateOperation)?.properties?.slateOps;
        const lastOp = lastSlateOps && lastSlateOps[lastSlateOps.length - 1];
        let merge = shouldMerge(op, lastOp);

        if (slate.operations.length !== 0) {
          merge = true;
        }

        if (merge) {
          if (lastOp !== op) {
            lastSlateOps.push(op);
          }
        } else {
          const batch = {
            operations: [op],
            selectionBefore: slate.selection,
          };

          const setSlateOperation: SetSlateOperation = {
            type: 'set_slate',
            properties: {
              slateOps: batch.operations,
              selectionBefore: batch.selectionBefore,
            },
            blockId: id,
            slate: slate,
          };

          editor.applyTransforms([setSlateOperation], { source: 'api', validatePaths: false });
        }
      }

      apply(op);
    };

    if (withExtensions) {
      slate = withExtensions(slate, editor, id);
    }

    return slate;
  }, []);
};

export const useEventHandlers = (
  events: PluginEvents | undefined,
  editor: YooEditor,
  block: YooptaBlockData,
  slate: SlateEditor,
) => {
  return useMemo<EditorEventHandlers>(() => {
    if (!events || editor.readOnly) return {};
    const { onBeforeCreate, onDestroy, onCreate, ...eventHandlers } = events || {};

    const eventHandlersOptions: PluginEventHandlerOptions = {
      hotkeys: HOTKEYS,
      currentBlock: block,
      defaultBlock: Blocks.buildBlockData({ id: generateId() }),
    };
    const eventHandlersMap = {};

    Object.keys(eventHandlers).forEach((eventType) => {
      eventHandlersMap[eventType] = function handler(event) {
        if (eventHandlers[eventType]) {
          const handler = eventHandlers[eventType](editor, slate, eventHandlersOptions);
          handler(event);
        }
      };
    });

    return eventHandlersMap;
  }, [events, editor, block]);
};

const shouldSave = (op: Operation): boolean => {
  if (op.type === 'set_selection') {
    return false;
  }

  return true;
};

const shouldMerge = (op: Operation, prev: Operation | undefined): boolean => {
  if (prev === op) return true;

  if (
    prev &&
    op.type === 'insert_text' &&
    prev.type === 'insert_text' &&
    op.offset === prev.offset + prev.text.length &&
    Path.equals(op.path, prev.path)
  ) {
    return true;
  }

  if (
    prev &&
    op.type === 'remove_text' &&
    prev.type === 'remove_text' &&
    op.offset + op.text.length === prev.offset &&
    Path.equals(op.path, prev.path)
  ) {
    return true;
  }

  return false;
};

import { useMemo } from 'react';
import { Element, Node, Operation, Path, Range, Transforms } from 'slate';

import { withInlines } from './extenstions/with-inlines';
import type { PluginDOMEvents, PluginEventHandlerOptions } from './types';
import { Blocks } from '../editor/blocks';
import type { SetSlateOperation } from '../editor/core/applyTransforms';
import { Paths } from '../editor/paths';
import type { SlateEditor, YooEditor, YooptaBlockData } from '../editor/types';
import type { EditorEventHandlers } from '../types/eventHandlers';
import { getRootBlockElementType } from '../utils/block-elements';
import { generateId } from '../utils/generateId';
import { HOTKEYS } from '../utils/hotkeys';


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


export const useSlateEditor = (
  id: string,
  editor: YooEditor,
  block: YooptaBlockData,
  elements: any,
  withExtensions: any,
) =>
  useMemo(() => {
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
        slate.markableVoid = (element) =>
          element.type === elementType ? true : prevMarkableVoid(element);
      }

      if (isVoid || isInlineVoid) {
        slate.isVoid = (element) => (element.type === elementType ? true : prevIsVoid(element));
      }

      if (isInline || isInlineVoid) {
        slate.isInline = (element) => (element.type === elementType ? true : prevIsInline(element));

        // [TODO] - Move it to Link plugin extension
        slate = withInlines(editor, slate);
      }
    });

    slate.insertText = (text) => {
      const selectedPaths = Paths.getSelectedPaths(editor);
      const path = Paths.getBlockOrder(editor);
      if (Array.isArray(selectedPaths) && selectedPaths.length > 0) {
        editor.setPath({ current: path });
      }

      insertText(text);
    };

    // This normalization is needed to validate the elements structure
    slate.normalizeNode = (entry) => {
      const [node, path] = entry;
      const blockElements = editor.plugins[block.type].elements;

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
          Transforms.setNodes(
            slate,
            { id: generateId(), type: rootElementType, props: { ...node.props } },
            { at: path },
          );
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
      // If this is a remote collaborative change, skip Yoopta history tracking
      if (editor.isRemoteSlateOp?.(slate)) {
        apply(op);
        return;
      }

      if (Operation.isSelectionOperation(op)) {
        const selectedPaths = Paths.getSelectedPaths(editor);
        const path = Paths.getBlockOrder(editor);

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
            slate,
          };

          editor.applyTransforms([setSlateOperation], { source: 'api', validatePaths: false });
          apply(op);
          return;
        }

        const lastSlateOps = (lastEditorBatch?.operations[0] as SetSlateOperation)?.properties
          ?.slateOps;
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
            slate,
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
  }, [id, block.type, editor, elements, withExtensions]);

export const useEventHandlers = (
  events: PluginDOMEvents | undefined,
  editor: YooEditor,
  block: YooptaBlockData,
  slate: SlateEditor,
) =>
  useMemo<EditorEventHandlers>(() => {
    if (editor.readOnly) return {};

    const eventHandlersOptions: PluginEventHandlerOptions = {
      hotkeys: HOTKEYS,
      currentBlock: block,
      defaultBlock: Blocks.buildBlockData({ id: generateId() }),
    };
    const eventHandlersMap: EditorEventHandlers = {};

    // Get inline plugin event handlers
    const inlinePlugins = Object.values(editor.plugins).filter((plugin) => {
      const rootElement = Object.values(plugin.elements)[0];
      // Check both top-level nodeType and props.nodeType for inline elements
      const nodeType =
        (rootElement as { nodeType?: string })?.nodeType ?? rootElement?.props?.nodeType;
      return nodeType === 'inline' || nodeType === 'inlineVoid';
    });

    // Start with block's event handlers (or empty if block has none)
    const eventHandlers = events ?? {};

    // Merge block and inline plugin event handlers
    const allEventHandlers = { ...eventHandlers };

    inlinePlugins.forEach((plugin) => {
      if (plugin.events) {
        Object.keys(plugin.events).forEach((eventType) => {
          if (allEventHandlers[eventType]) {
            // If event handler already exists, wrap it to include inline plugin handler
            const existingHandler = allEventHandlers[eventType];
            const inlineHandler = plugin.events![eventType];

            allEventHandlers[eventType] = (yEditor, ySlate, options) => (event) => {
              // Call inline handler FIRST so it can preventDefault before the block handler
              // This ensures inline plugins (like Emoji, Mention) can intercept events
              // (e.g., Enter for emoji selection) before block handlers (e.g., Lists, Tabs)
              inlineHandler(yEditor, ySlate, options)(event);

              // Skip block handler if inline handler already handled the event
              if ((event as Event).defaultPrevented) return;

              existingHandler(yEditor, ySlate, options)(event);
            };
          } else {
            // If no block handler exists, just use the inline handler
            allEventHandlers[eventType] = plugin.events![eventType];
          }
        });
      }
    });

    // Transform handlers to match EditorEventHandlers type
    Object.keys(allEventHandlers).forEach((eventType) => {
      const handler = allEventHandlers[eventType];
      if (handler) {
        eventHandlersMap[eventType] = (event) => {
          const eventHandler = handler(editor, slate, eventHandlersOptions);
          eventHandler(event);
        };
      }
    });

    return eventHandlersMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, block, slate]);

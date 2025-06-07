import { useState, useRef, useEffect, memo } from 'react';
import { YooEditor, YooptaBlockData } from '../../editor/types';
import DragIcon from './icons/drag.svg';
import PlusIcon from './icons/plus.svg';
import { generateId } from '../../utils/generateId';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { getRootBlockElement } from '../../utils/blockElements';
import { ReactEditor } from 'slate-react';
import { Editor, Transforms } from 'slate';
import { BlockOptions } from '../../UI/BlockOptions/BlockOptions';
import { Blocks } from '../../editor/blocks';
import { Portal } from '../../UI/Portal/Portal';
import { useActionMenuToolRefs, useBlockOptionsRefs } from './hooks';
import { Overlay } from '../../UI/Overlay/Overlay';
import { throttle } from '../../utils/throttle';

type dragHandleProps = {
  attributes: any;
  listeners: any;
  setActivatorNodeRef: any;
};

type FloatingBlockActionsProps = {
  editor: YooEditor;
  dragHandleProps: dragHandleProps | null;
};

type ActionStyles = {
  position: 'fixed';
  top: number;
  left: number;
  opacity: number;
  transform: string;
  transition: string;
};

const INITIAL_STYLES: ActionStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  opacity: 0,
  transform: 'scale(0.95) translateX(-46px)',
  transition: 'opacity 150ms ease-out',
};

export const FloatingBlockActions = memo(({ editor, dragHandleProps }: FloatingBlockActionsProps) => {
  const [hoveredBlock, setHoveredBlock] = useState<YooptaBlockData | null>(null);
  const blockActionsRef = useRef<HTMLDivElement>(null);
  const [actionStyles, setActionStyles] = useState<ActionStyles>(INITIAL_STYLES);

  const { attributes, listeners, setActivatorNodeRef } = dragHandleProps || {};

  const { isBlockOptionsMounted, setIsBlockOptionsOpen, blockOptionsFloatingStyle, blockOptionsRefs } =
    useBlockOptionsRefs();

  const {
    isActionMenuOpen,
    actionMenuRefs,
    hasActionMenu,
    actionMenuStyles,
    onChangeActionMenuOpen,
    onCloseActionMenu,
    actionMenuRenderProps,
    ActionMenu,
  } = useActionMenuToolRefs({ editor });

  const updateBlockPosition = (blockElement: HTMLElement, blockData: YooptaBlockData) => {
    setHoveredBlock(blockData);

    const blockElementRect = blockElement.getBoundingClientRect();
    const blockActionsWidth = blockActionsRef.current?.offsetWidth || 46;

    setActionStyles((prev) => ({
      ...prev,
      top: blockElementRect.top + 2,
      left: blockElementRect.left,
      opacity: 1,
      transform: `scale(1) translateX(-${blockActionsWidth}px)`,
    }));
  };

  const hideBlockActions = () => {
    setActionStyles((prev) => ({
      ...prev,
      opacity: 0,
      transform: INITIAL_STYLES.transform,
    }));

    setTimeout(() => {
      setHoveredBlock(null);
    }, 150);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const isInsideEditor = editor.refElement?.contains(event.target as Node);

    if (!isInsideEditor) return hideBlockActions();
    if (editor.readOnly) return;

    const target = event.target as HTMLElement;
    const blockElement = target.closest('[data-yoopta-block]') as HTMLElement;

    if (blockElement) {
      const blockId = blockElement.getAttribute('data-yoopta-block-id');

      if (blockId === hoveredBlock?.id) return;

      const blockData = editor.children[blockId || ''];
      if (blockData) updateBlockPosition(blockElement, blockData);
    }
  };

  const throttledMouseMove = throttle(handleMouseMove, 100, { leading: true, trailing: true });

  useEffect(() => {
    document.addEventListener('scroll', hideBlockActions);
    document.addEventListener('mousemove', throttledMouseMove);

    return () => {
      document.removeEventListener('scroll', hideBlockActions);
      document.removeEventListener('mousemove', throttledMouseMove);
      throttledMouseMove.cancel();
    };
  }, []);

  const onPlusClick = () => {
    const block = hoveredBlock;
    if (!block) return;

    const slate = Blocks.getBlockSlate(editor, { id: block.id });
    const blockEntity = editor.blocks[block.type];
    if (!slate) return;

    const blockEl = document.querySelector(`[data-yoopta-block-id="${block.id}"]`);
    const rootElement = getRootBlockElement(blockEntity.elements);
    let string: undefined | string;
    if (!blockEntity.hasCustomEditor) {
      string = Editor.string(slate, [0]);
    }

    const isEmptyString = typeof string === 'string' && string.trim().length === 0;
    if (hasActionMenu && isEmptyString && rootElement?.props?.nodeType !== 'void') {
      editor.setPath({ current: block.meta.order });
      editor.focusBlock(block.id);
      actionMenuRefs.setReference(blockEl);
      onChangeActionMenuOpen(true);
    } else {
      const defaultBlock = Blocks.buildBlockData({ id: generateId() });
      const nextPath = block.meta.order + 1;
      editor.setPath({ current: block.meta.order });
      editor.insertBlock(defaultBlock.type, { at: nextPath, focus: true });
      if (hasActionMenu) {
        setTimeout(() => {
          if (blockEl) actionMenuRefs.setReference(blockEl.nextSibling as HTMLElement);
          onChangeActionMenuOpen(true);
        }, 0);
      }
    }
  };

  const onSelectBlock = (event: React.MouseEvent) => {
    event.stopPropagation();
    const block = hoveredBlock;
    if (!block) return;

    const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
    editor.focusBlock(block.id);

    if (!slate) return;

    setTimeout(() => {
      const currentBlock = editor.blocks[block.type];

      if (!currentBlock.hasCustomEditor) {
        ReactEditor.blur(slate);
        ReactEditor.deselect(slate);
        Transforms.deselect(slate);
      }

      editor.setPath({ current: block.meta.order, selected: [block.meta.order] });

      setIsBlockOptionsOpen(true);
    }, 10);
  };

  const onDragButtonRef = (node: HTMLElement | null) => {
    setActivatorNodeRef?.(node);
    blockOptionsRefs.setReference(node);
  };

  return (
    <Portal id="block-actions">
      <div contentEditable={false} style={actionStyles} className="yoopta-block-actions" ref={blockActionsRef}>
        <div className="yoopta-block-action-buttons">
          {isActionMenuOpen && hasActionMenu && (
            <Portal id="yoo-block-options-portal">
              <Overlay lockScroll className="yoo-editor-z-[100]" onClick={onCloseActionMenu}>
                <div style={actionMenuStyles} ref={actionMenuRefs.setFloating}>
                  {/* @ts-ignore - fixme */}
                  <ActionMenu {...actionMenuRenderProps} />
                </div>
              </Overlay>
            </Portal>
          )}
          <button type="button" onClick={onPlusClick} className="yoopta-block-actions-plus">
            <PlusIcon />
          </button>
          <button
            ref={onDragButtonRef}
            type="button"
            className="yoopta-block-actions-drag"
            onClick={onSelectBlock}
            {...attributes}
            {...listeners}
          >
            <DragIcon />
          </button>
          <BlockOptions
            isOpen={isBlockOptionsMounted}
            refs={blockOptionsRefs}
            style={blockOptionsFloatingStyle}
            onClose={() => setIsBlockOptionsOpen(false)}
          />
        </div>
      </div>
    </Portal>
  );
});

FloatingBlockActions.displayName = 'FloatingBlockActions';

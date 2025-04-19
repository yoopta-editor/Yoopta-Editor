import { useRef } from 'react';
import { Editor, Element, Path, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { Blocks } from '../../editor/blocks';
import { Paths } from '../../editor/paths';
import { YooEditor, YooptaPath } from '../../editor/types';
import { findPluginBlockByPath } from '../../utils/findPluginBlockByPath';
import { getPreviousPath } from '../../editor/paths/getPreviousPath';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';

type MultiSelectionOptions = {
  editor: YooEditor;
};

type SelectionState = {
  selectionStarted: boolean;
  indexToSelect: null | number;
  startedIndexToSelect: null | number;
};

const DEFAULT_SELECTION_STATE: SelectionState = {
  selectionStarted: false,
  indexToSelect: null,
  startedIndexToSelect: null,
};

export function useMultiSelection({ editor }: MultiSelectionOptions) {
  const isMultiSelectingStarted = useRef(false);
  const isMultiSelectingInProgress = useRef(false);
  const startBlockPathRef = useRef<number | null>(null);
  const currentBlockPathRef = useRef<number | null>(null);

  let selectionState = useRef<SelectionState>(DEFAULT_SELECTION_STATE).current;

  const blurSlateSelection = () => {
    const path = editor.path.current;

    if (typeof path === 'number') {
      const slate = Blocks.getBlockSlate(editor, { at: path });
      const block = Blocks.getBlock(editor, { at: path });
      const blockEntity = editor.blocks[block?.type || ''];
      if (!slate || blockEntity?.hasCustomEditor) return;

      try {
        Editor.withoutNormalizing(slate, () => {
          // [TEST]
          Transforms.select(slate, [0]);

          if (slate.selection && Range.isExpanded(slate.selection)) {
            ReactEditor.blur(slate);
            ReactEditor.deselect(slate);
          }
        });
      } catch (error) {}
    }
  };

  const onShiftKeyDown = (blockOrder: number) => {
    blurSlateSelection();

    const currentSelectionIndex = Paths.getPath(editor);
    if (typeof currentSelectionIndex !== 'number') return;

    const indexesBetween = Array.from({ length: Math.abs(blockOrder - currentSelectionIndex) }).map((_, index) =>
      blockOrder > currentSelectionIndex ? currentSelectionIndex + index + 1 : currentSelectionIndex - index - 1,
    );

    editor.setPath({ current: blockOrder, selected: [...indexesBetween, currentSelectionIndex], source: 'keyboard' });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (editor.readOnly) return;

    if (!editor.isFocused()) editor.focus();

    editor.batchOperations(() => {
      const selectedBlocks = Paths.getSelectedPaths(editor);
      // [TEST]
      if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0 && !e.shiftKey && !e.altKey) {
        editor.setPath({ current: null });
      }

      const target = e.target as HTMLElement;
      const blockElement = target.closest('[data-yoopta-block]');

      if (blockElement && e.button === 0) {
        const blockId = blockElement.getAttribute('data-yoopta-block-id') || '';
        const blockOrder = editor.children[blockId]?.meta.order;

        if (typeof blockOrder === 'number') {
          isMultiSelectingStarted.current = true;
          startBlockPathRef.current = blockOrder;
          currentBlockPathRef.current = blockOrder;

          if (e.shiftKey && !Paths.isPathEmpty(editor) && blockOrder !== editor.path.current) {
            onShiftKeyDown(blockOrder);
            return;
          }

          if (blockOrder !== editor.path.current) {
            editor.setPath({ current: blockOrder });
          }

          editor.refElement?.addEventListener('mousemove', onMouseMove);
          editor.refElement?.addEventListener('mouseup', onMouseUp);
          document?.addEventListener('mouseup', onMouseUp);
        }
      }
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isMultiSelectingStarted.current || editor.readOnly) return;

    const target = document.elementFromPoint(e.clientX, e.clientY);
    const blockElement = target?.closest('[data-yoopta-block]');

    if (blockElement) {
      editor.batchOperations(() => {
        const blockId = blockElement.getAttribute('data-yoopta-block-id') || '';
        const blockOrder = editor.children[blockId]?.meta.order;

        // When multi-selecting is started and the mouse is moving over the start block
        if (
          isMultiSelectingInProgress.current &&
          typeof blockOrder === 'number' &&
          blockOrder === startBlockPathRef.current
        ) {
          currentBlockPathRef.current = blockOrder;
          editor.setPath({ current: blockOrder, selected: [blockOrder], source: 'mousemove' });
          return;
        }

        // Multi-selecting started between blocks
        if (typeof blockOrder === 'number' && blockOrder !== currentBlockPathRef.current) {
          currentBlockPathRef.current = blockOrder;
          isMultiSelectingInProgress.current = true;

          const start = Math.min(startBlockPathRef.current!, blockOrder);
          const end = Math.max(startBlockPathRef.current!, blockOrder);

          blurSlateSelection();

          const selectedBlocks = Array.from({ length: end - start + 1 }, (_, i) => start + i);
          editor.setPath({ current: blockOrder, selected: selectedBlocks, source: 'mousemove' });
        }
      });
    }
  };

  const onMouseUp = () => {
    isMultiSelectingStarted.current = false;
    isMultiSelectingInProgress.current = false;
    startBlockPathRef.current = null;
    currentBlockPathRef.current = null;
    editor.refElement?.removeEventListener('mousemove', onMouseMove);
    editor.refElement?.removeEventListener('mouseup', onMouseUp);
    document?.removeEventListener('mouseup', onMouseUp);
  };

  const onShiftArrowUp = (event) => {
    if (typeof event.isDefaultPrevented === 'function' && event.isDefaultPrevented()) return;

    if (
      selectionState.selectionStarted &&
      selectionState.startedIndexToSelect !== null &&
      selectionState.indexToSelect !== null
    ) {
      const currentIndex = selectionState.indexToSelect;
      const nextTopIndex = currentIndex - 1;

      if (currentIndex === 0) return;
      // jump to next index if started selection from this index
      if (currentIndex === selectionState.startedIndexToSelect) {
        const selectedPaths = editor.path.selected ? [...editor.path.selected, nextTopIndex] : [nextTopIndex];
        editor.setPath({ current: nextTopIndex, selected: selectedPaths, source: 'keyboard' });
        selectionState.indexToSelect = nextTopIndex;
        return;
      }

      if (nextTopIndex < selectionState.startedIndexToSelect) {
        const selectedPaths = editor.path.selected ? [...editor.path.selected, nextTopIndex] : [nextTopIndex];

        editor.setPath({ current: nextTopIndex, selected: selectedPaths, source: 'keyboard' });
        selectionState.indexToSelect = nextTopIndex;
        return;
      }

      const selectedBlocks = Paths.getSelectedPaths(editor);

      if (selectedBlocks?.includes(currentIndex) && currentIndex !== selectionState.startedIndexToSelect) {
        const filteredIndexes = selectedBlocks.filter((index) => index !== currentIndex);
        editor.setPath({ current: nextTopIndex, selected: filteredIndexes, source: 'keyboard' });
        selectionState.indexToSelect = nextTopIndex;
        return;
      }

      return;
    }

    const block = findPluginBlockByPath(editor);
    const slate = findSlateBySelectionPath(editor);

    if (!slate || !slate.selection || !block) return;

    const parentPath = Path.parent(slate.selection.anchor.path);
    // [TODO] - handle cases for inline node elements
    const isStart = Editor.isStart(slate, slate.selection.focus, parentPath);

    if (Range.isExpanded(slate.selection) && isStart) {
      const prevPath = getPreviousPath(editor);
      if (typeof prevPath !== 'number') return;

      const prevBlock = findPluginBlockByPath(editor, { at: prevPath });

      if (block && prevBlock) {
        event.preventDefault();

        ReactEditor.blur(slate);
        ReactEditor.deselect(slate);
        Transforms.deselect(slate);

        const selectedPaths = editor.path.selected
          ? [...editor.path.selected, block?.meta.order, block.meta.order - 1]
          : [block?.meta.order, block.meta.order - 1];

        editor.setPath({ current: null, selected: selectedPaths, source: 'keyboard' });

        selectionState.startedIndexToSelect = block.meta.order;
        selectionState.indexToSelect = block.meta.order - 1;
        selectionState.selectionStarted = true;
      }
    }
  };

  const onShiftArrowDown = (event) => {
    if (
      selectionState.selectionStarted &&
      selectionState.indexToSelect !== null &&
      selectionState.startedIndexToSelect !== null
    ) {
      const currentIndex = selectionState.indexToSelect;
      const nextIndex = currentIndex + 1;

      if (nextIndex === Object.keys(editor.children).length) return;

      // jump to next index if started selection from this index
      if (currentIndex === selectionState.startedIndexToSelect) {
        const selectedPaths = editor.path.selected ? [...editor.path.selected, nextIndex] : [nextIndex];
        editor.setPath({ current: nextIndex, selected: selectedPaths, source: 'keyboard' });
        selectionState.indexToSelect = nextIndex;
        return;
      }

      if (nextIndex > selectionState.startedIndexToSelect) {
        const selectedPaths = editor.path.selected ? [...editor.path.selected, nextIndex] : [nextIndex];
        editor.setPath({ current: nextIndex, selected: selectedPaths, source: 'keyboard' });
        selectionState.indexToSelect = nextIndex;
        return;
      }

      const selectedBlocks = Paths.getSelectedPaths(editor);
      if (selectedBlocks?.includes(currentIndex) && currentIndex !== selectionState.startedIndexToSelect) {
        const filteredIndexes = selectedBlocks.filter((index) => index !== currentIndex);
        editor.setPath({ current: nextIndex, selected: filteredIndexes, source: 'keyboard' });
        selectionState.indexToSelect = nextIndex;
        return;
      }

      return;
    }

    const block = findPluginBlockByPath(editor);
    const slate = findSlateBySelectionPath(editor);
    if (!slate || !slate.selection || !block) return;

    const parentPath = Path.parent(slate.selection.anchor.path);
    // [TODO] - handle cases for inline node elements
    const isEnd = Editor.isEnd(slate, slate.selection.focus, parentPath);

    if (Range.isExpanded(slate.selection) && isEnd) {
      const nextPath = Paths.getNextPath(editor);
      const nextBlock = findPluginBlockByPath(editor, { at: nextPath });

      if (block && nextBlock) {
        event.preventDefault();

        ReactEditor.blur(slate);
        ReactEditor.deselect(slate);
        Transforms.deselect(slate);

        const selectedPaths = editor.path.selected
          ? [...editor.path.selected, block?.meta.order, block?.meta.order + 1]
          : [block?.meta.order, block.meta.order + 1];

        editor.setPath({ current: null, selected: selectedPaths, source: 'keyboard' });

        selectionState.startedIndexToSelect = block.meta.order;
        selectionState.indexToSelect = block.meta.order + 1;
        selectionState.selectionStarted = true;
      }
    }
  };

  return { onMouseDown, onShiftArrowUp, onShiftArrowDown, selectionState };
}

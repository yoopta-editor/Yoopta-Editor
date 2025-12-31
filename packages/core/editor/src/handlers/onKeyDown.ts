import { isKeyHotkey } from 'is-hotkey';
import { Editor, Path, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { Blocks } from '../editor/blocks';
import { Paths } from '../editor/paths';
import type { YooEditor } from '../editor/types';
import { findSlateBySelectionPath } from '../utils/findSlateBySelectionPath';
import { generateId } from '../utils/generateId';
import { getFirstNodePoint, getLastNodePoint } from '../utils/get-node-points';
import { HOTKEYS } from '../utils/hotkeys';

export function onKeyDown(editor: YooEditor) {
  return (event: React.KeyboardEvent) => {
    const slate = findSlateBySelectionPath(editor, { at: editor.path.current });

    if (HOTKEYS.isShiftEnter(event)) {
      if (event.isDefaultPrevented()) return;

      if (!slate || !slate.selection) return;

      event.preventDefault();
      slate.insertText('\n');

      return;
    }

    if (HOTKEYS.isUndo(event)) {
      event.preventDefault();
      return;
    }

    if (HOTKEYS.isRedo(event)) {
      event.preventDefault();
      return;
    }

    if (HOTKEYS.isEnter(event)) {
      if (event.isDefaultPrevented()) return;
      if (!slate || !slate.selection) return;

      event.preventDefault();

      const first = Editor.first(slate, []);
      const last = Editor.last(slate, []);
      const isStart = Editor.isStart(slate, slate.selection.anchor, first[1]);
      const isEnd = Editor.isEnd(slate, slate.selection.anchor, last[1]);

      if (Range.isExpanded(slate.selection)) {
        Transforms.delete(slate, { at: slate.selection });
      }

      // when the cursor is between start and end of the block
      if (!isStart && !isEnd) {
        // [TEST]
        editor.splitBlock({ focus: true });
        return;
      }

      const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
      const defaultBlock = Blocks.buildBlockData({ id: generateId() });

      const string = Editor.string(slate, []);
      const insertBefore = isStart && string.length > 0;

      const nextPath = Paths.getNextBlockOrder(editor);

      // [TEST]
      editor.batchOperations(() => {
        // [TEST]
        editor.insertBlock(defaultBlock.type, {
          at: insertBefore ? editor.path.current : nextPath,
          focus: !insertBefore,
        });

        // [TEST]
        if (insertBefore && currentBlock) {
          editor.focusBlock(currentBlock.id);
        }
      });

      return;
    }

    if (HOTKEYS.isBackspace(event)) {
      if (event.isDefaultPrevented()) return;
      // if (!slate || !slate.selection) return;

      // const parentPath = Path.parent(slate.selection.anchor.path);
      // const isStart = Editor.isStart(slate, slate.selection.anchor, parentPath);

      // // When the cursor is at the start of the block, delete the block
      // if (isStart) {
      //   event.preventDefault();
      //   const text = Editor.string(slate, parentPath);

      //   // If current block is empty just delete block
      //   if (text.trim().length === 0) {
      //     // [TEST]
      //     editor.deleteBlock({ at: editor.path.current, focus: true });
      //     return;
      //   }
      //   // If current block is not empty merge text nodes with previous block

      //   if (Range.isExpanded(slate.selection)) {
      //     return Transforms.delete(slate, { at: slate.selection });
      //   }

      //   const prevBlock = Blocks.getBlock(editor, { at: Paths.getPreviousBlockOrder(editor) });
      //   const prevSlate = Blocks.getBlockSlate(editor, { id: prevBlock?.id });
      //   if (prevBlock && prevSlate) {
      //     const { node: lastSlateNode } = getLastNode(prevSlate);
      //     const prevSlateText = Node.string(lastSlateNode);

      //     if (prevSlateText.trim().length === 0) {
      //       // [TEST]
      //       editor.deleteBlock({ blockId: prevBlock.id, focus: false });
      //       editor.setPath({ current: prevBlock.meta.order });
      //       return;
      //     }
      //   }

      //   // [TEST]
      //   editor.mergeBlock();
      // }
      // return;
    }

    if (HOTKEYS.isSelect(event)) {
      if (event.isDefaultPrevented()) return;
      if (!slate || !slate.selection) return;

      const [, firstElementPath] = Editor.first(slate, [0]);
      const [, lastElementPath] = Editor.last(slate, [slate.children.length - 1]);

      const fullRange = Editor.range(slate, firstElementPath, lastElementPath);
      const isAllBlockElementsSelected = Range.equals(slate.selection, fullRange);

      const string = Editor.string(slate, fullRange);
      const isElementEmpty = string.trim().length === 0;

      // [TODO] - handle cases for void node elements
      if ((Range.isExpanded(slate.selection) && isAllBlockElementsSelected) || isElementEmpty) {
        event.preventDefault();

        ReactEditor.blur(slate);
        ReactEditor.deselect(slate);
        Transforms.deselect(slate);

        const allBlockPaths = Array.from(
          { length: Object.keys(editor.children).length },
          (_, i) => i,
        );
        editor.setPath({ current: null, selected: allBlockPaths, source: 'keyboard' });
        return;
      }
    }

    if (HOTKEYS.isShiftTab(event)) {
      if (event.isDefaultPrevented()) return;
      event.preventDefault();

      const selectedPaths = editor.path.selected;
      if (Array.isArray(selectedPaths) && selectedPaths.length > 0) {
        editor.batchOperations(() => {
          selectedPaths.forEach((index) => {
            const block = Blocks.getBlock(editor, { at: index });
            if (block && block.meta.depth > 0) {
              editor.decreaseBlockDepth({ at: index });
            }
          });
        });

        return;
      }

      editor.decreaseBlockDepth();
      return;
    }

    // if (HOTKEYS.isTab(event)) {
    //   if (event.isDefaultPrevented()) return;
    //   event.preventDefault();

    //   const selectedPaths = editor.path.selected;
    //   if (Array.isArray(selectedPaths) && selectedPaths.length > 0) {
    //     editor.batchOperations(() => {
    //       selectedPaths.forEach((index) => {
    //         editor.increaseBlockDepth({ at: index });
    //       });
    //     });

    //     return;
    //   }

    //   editor.increaseBlockDepth();
    //   return;
    // }

    if (HOTKEYS.isArrowUp(event)) {
      if (event.isDefaultPrevented()) return;
      if (!slate || !slate.selection) return;

      const prevPath = Paths.getPreviousBlockOrder(editor);
      if (typeof prevPath !== 'number') return;

      const prevBlock = Blocks.getBlock(editor, { at: prevPath });
      if (!prevBlock) return;

      const firstLeafPoint = getFirstNodePoint(slate);
      const isAtFirstLeafStart =
        Path.equals(slate.selection.anchor.path, firstLeafPoint.path) &&
        slate.selection.anchor.offset === 0;

      if (isAtFirstLeafStart) {
        const prevSlate = findSlateBySelectionPath(editor, { at: prevPath });
        if (!prevSlate) return;

        const prevLastLeafPoint = getLastNodePoint(prevSlate);

        event.preventDefault();
        editor.focusBlock(prevBlock.id, {
          focusAt: prevLastLeafPoint,
          waitExecution: false,
          shouldUpdateBlockPath: true,
        });
        return;
      }
    }

    if (HOTKEYS.isArrowDown(event)) {
      if (event.isDefaultPrevented()) return;
      if (!slate || !slate.selection) return;

      const nextPath = Paths.getNextBlockOrder(editor);
      if (typeof nextPath !== 'number') return;

      const nextBlock = Blocks.getBlock(editor, { at: nextPath });
      if (!nextBlock) return;

      const lastLeafPoint = getLastNodePoint(slate);
      const isAtLastLeafEnd =
        Path.equals(slate.selection.anchor.path, lastLeafPoint.path) &&
        slate.selection.anchor.offset === lastLeafPoint.offset;

      if (isAtLastLeafEnd) {
        const nextSlate = findSlateBySelectionPath(editor, { at: nextPath });
        if (!nextSlate) return;

        const nextFirstLeafPoint = getFirstNodePoint(nextSlate);

        event.preventDefault();
        editor.focusBlock(nextBlock.id, {
          focusAt: nextFirstLeafPoint,
          waitExecution: false,
          shouldUpdateBlockPath: true,
        });
        return;
      }
    }

    if (slate && slate.selection) {
      if (Range.isExpanded(slate.selection)) {
        const marks = Object.values(editor.formats);
        if (marks.length > 0) {
          for (const mark of Object.values(editor.formats)) {
            if (mark.hotkey && isKeyHotkey(mark.hotkey)(event)) {
              event.preventDefault();
              editor.formats[mark.type].toggle();
              break;
            }
          }
        }
      }
    }
  };
}

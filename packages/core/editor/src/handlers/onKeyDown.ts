import { isKeyHotkey } from 'is-hotkey';
import { Path, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { Blocks } from '../editor/blocks';
import { Paths } from '../editor/paths';
import type { YooEditor } from '../editor/types';
import { executeEnterAction, getEnterAction } from '../utils/enter-action';
import { executeBackspaceAction, getBackspaceAction } from '../utils/execute-backspace-action';
import { findSlateBySelectionPath } from '../utils/findSlateBySelectionPath';
import { getNextHierarchicalSelection } from '../utils/get-next-hierarchical-selection';
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

      const result = getEnterAction(editor, slate);

      console.log('HOTKEYS.isEnter(event) result', result);

      switch (result.action) {
        case 'delegate-to-plugin':
          return;

        case 'default':
          return;

        case 'prevent':
          event.preventDefault();
          return;

        default:
          event.preventDefault();
          executeEnterAction(editor, slate, result);
          return;
      }
    }

    if (HOTKEYS.isBackspace(event)) {
      if (event.isDefaultPrevented()) return;
      if (!slate || !slate.selection) return;

      const result = getBackspaceAction(editor, slate);

      switch (result.action) {
        case 'default':
          // Allow Slate to handle it normally
          return;

        case 'prevent':
          // Block the action
          event.preventDefault();
          return;

        default:
          // Execute custom action
          event.preventDefault();
          executeBackspaceAction(editor, slate, result);
          return;
      }
    }

    if (HOTKEYS.isSelect(event)) {
      if (event.isDefaultPrevented()) return;
      if (!slate || !slate.selection) return;

      const result = getNextHierarchicalSelection(editor, slate);

      switch (result.action) {
        case 'select-path':
          event.preventDefault();
          Transforms.select(slate, result.path);
          break;

        case 'select-range':
          event.preventDefault();
          Transforms.select(slate, result.range);
          break;

        case 'select-block':
          event.preventDefault();
          ReactEditor.blur(slate);
          ReactEditor.deselect(slate);
          Transforms.deselect(slate);
          editor.setPath({
            current: null,
            selected: [result.blockOrder],
            source: 'keyboard',
          });
          break;

        case 'select-all-blocks':
          event.preventDefault();
          editor.setPath({
            current: null,
            selected: result.blockOrders,
            source: 'keyboard',
          });
          break;

        default:
          break;
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

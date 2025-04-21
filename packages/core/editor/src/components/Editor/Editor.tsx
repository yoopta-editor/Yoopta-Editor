import { ClipboardEvent, CSSProperties, ReactNode, useEffect } from 'react';
import { useYooptaEditor, useYooptaReadOnly } from '../../contexts/YooptaContext/YooptaContext';
import { RenderBlocks } from './RenderBlocks';
import { YooptaMark } from '../../marks';
import { findPluginBlockByPath } from '../../utils/findPluginBlockByPath';
import { buildBlockData } from './utils';
import { generateId } from '../../utils/generateId';
import { HOTKEYS } from '../../utils/hotkeys';
import { Editor as SlateEditor, Element, Path } from 'slate';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { YooptaContentValue } from '../../editor/types';
import { useRectangeSelectionBox } from '../SelectionBox/hooks';
import { SelectionBox } from '../SelectionBox/SelectionBox';
import { Blocks } from '../../editor/blocks';
import { useMultiSelection } from './selection';
import { Paths } from '../../editor/paths';

type Props = {
  marks?: YooptaMark<any>[];
  selectionBoxRoot?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
  width?: number | string;
  children: ReactNode;
  style?: CSSProperties;
};

const getEditorStyles = (styles: CSSProperties) => ({
  ...styles,
  width: styles.width || 400,
  paddingBottom: typeof styles.paddingBottom === 'number' ? styles.paddingBottom : 100,
});

const Editor = ({
  placeholder,
  marks,
  className,
  selectionBoxRoot,
  width,
  style,
  children,
  autoFocus = true,
}: Props) => {
  const editor = useYooptaEditor();
  const isReadOnly = useYooptaReadOnly();
  const selectionBox = useRectangeSelectionBox({ editor, root: selectionBoxRoot });
  const multiSelection = useMultiSelection({ editor });

  useEffect(() => {
    if (!autoFocus || isReadOnly) return;
    editor.focus();
  }, [autoFocus, isReadOnly]);

  useEffect(() => {
    if (isReadOnly) return;

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [editor.path, isReadOnly]);

  const handleEmptyZoneClick = (e: React.MouseEvent) => {
    const editorEl = editor.refElement;
    if (!editorEl) return;

    const { bottom } = editorEl.getBoundingClientRect();
    const paddingBottom = parseInt(getComputedStyle(editorEl).paddingBottom, 10);
    const paddingBottomAreaTop = bottom - paddingBottom;
    const defaultBlock = buildBlockData({ id: generateId() });

    if (e.clientY >= paddingBottomAreaTop) {
      const lastPath = Object.keys(editor.children).length - 1;
      const lastBlock = findPluginBlockByPath(editor, { at: lastPath });
      const lastSlate = findSlateBySelectionPath(editor, { at: lastPath });

      if (lastBlock && lastSlate && lastSlate.selection) {
        const string = SlateEditor.string(lastSlate, lastSlate.selection.anchor.path);
        const parentPath = Path.parent(lastSlate.selection.anchor.path);
        const [lastNode] = SlateEditor.node(lastSlate, parentPath);

        if (
          lastBlock.type === defaultBlock.type &&
          Element.isElement(lastNode) &&
          lastNode.props?.nodeType !== 'void' &&
          string.trim().length === 0
        ) {
          editor.focusBlock(lastBlock.id, { slate: lastSlate });
          return;
        }
      }

      const nextPath = lastPath + 1;
      editor.insertBlock(defaultBlock.type, { at: nextPath, focus: true });
    }
  };

  const resetSelectionState = () => {
    multiSelection.selectionState.indexToSelect = null;
    multiSelection.selectionState.startedIndexToSelect = null;
    multiSelection.selectionState.selectionStarted = false;
  };

  const onMouseDown = (event: React.MouseEvent) => {
    if (isReadOnly) return;

    multiSelection.onMouseDown(event);
    resetSelectionState();
    handleEmptyZoneClick(event);
  };

  const onBlur = (event: React.FocusEvent) => {
    const isInsideEditor =
      editor.refElement?.contains(event.relatedTarget as Node) || editor.refElement?.contains(event.target as Node);

    if (isInsideEditor || isReadOnly) return;

    resetSelectionState();

    const selectedBlocks = Paths.getSelectedPaths(editor);
    if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
      editor.setPath({ current: null, selected: null });
    }
  };

  const onKeyDown = (event) => {
    if (isReadOnly) return;

    if (HOTKEYS.isRedo(event)) {
      event.preventDefault();
      editor.redo();
      return;
    }

    if (HOTKEYS.isUndo(event)) {
      event.preventDefault();
      editor.undo();
      return;
    }

    if (HOTKEYS.isSelect(event)) {
      const selectedBlocks = Paths.getSelectedPaths(editor);
      const isAllBlocksSelected = selectedBlocks?.length === Object.keys(editor.children).length;

      if (isAllBlocksSelected) {
        event.preventDefault();
        return;
      }

      if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
        event.preventDefault();
        const allBlockIndexes = Object.keys(editor.children).map((k, i) => i);
        editor.setPath({ current: null, selected: allBlockIndexes, source: 'keyboard' });
        return;
      }
    }

    if (HOTKEYS.isCopy(event) || HOTKEYS.isCut(event)) {
      const selectedBlocks = Paths.getSelectedPaths(editor);
      if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
        event.preventDefault();

        const htmlString = editor.getHTML(editor.getEditorValue());
        const textString = editor.getPlainText(editor.getEditorValue());
        const htmlBlob = new Blob([htmlString], { type: 'text/html' });
        const textBlob = new Blob([textString], { type: 'text/plain' });

        const clipboardItem = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        });

        navigator.clipboard.write([clipboardItem]).then(() => {
          const html = new DOMParser().parseFromString(htmlString, 'text/html');
          console.log('HTML copied\n', html.body);
        });

        if (HOTKEYS.isCut(event)) {
          // [TEST]
          editor.batchOperations(() => {
            const selectedBlocks = Paths.getSelectedPaths(editor);

            if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
              const isAllBlocksSelected = selectedBlocks.length === Object.keys(editor.children).length;

              selectedBlocks.forEach((index) => {
                const blockId = Blocks.getBlock(editor, { at: index })?.id;
                if (blockId) editor.deleteBlock({ blockId });
              });

              if (isAllBlocksSelected) {
                const defaultBlock = buildBlockData({ id: generateId() });
                editor.insertBlock(defaultBlock.type, { at: 0, focus: true });
              }
            }
          });

          editor.setPath({ current: null, selected: null, source: 'copy-paste' });
          resetSelectionState();
        }
        return;
      }
    }

    if (HOTKEYS.isBackspace(event)) {
      event.stopPropagation();
      const selectedBlocks = Paths.getSelectedPaths(editor);
      const isAllBlocksSelected = selectedBlocks?.length === Object.keys(editor.children).length;

      if (isAllBlocksSelected) {
        event.preventDefault();

        // [TEST]
        editor.batchOperations(() => {
          const allBlocks = Object.keys(editor.children);
          allBlocks.forEach((blockId) => editor.deleteBlock({ blockId }));

          editor.setPath({ current: null, selected: null });
          resetSelectionState();
        });

        return;
      }

      // [TEST]
      editor.batchOperations(() => {
        const selectedBlocks = Paths.getSelectedPaths(editor);

        if (Array.isArray(selectedBlocks) && selectedBlocks?.length > 0) {
          event.preventDefault();
          selectedBlocks.forEach((index) => editor.deleteBlock({ at: index }));

          editor.setPath({ current: null, selected: null });
          resetSelectionState();
        }
      });

      return;
    }

    // [TODO] - handle sharing cursor between blocks
    if (HOTKEYS.isShiftArrowUp(event)) {
      multiSelection.onShiftArrowUp(event);
    }

    if (HOTKEYS.isShiftArrowDown(event)) {
      multiSelection.onShiftArrowDown(event);
    }

    if (HOTKEYS.isTab(event)) {
      const selectedBlocks = Paths.getSelectedPaths(editor);
      if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
        event.preventDefault();

        editor.batchOperations(() => {
          selectedBlocks.forEach((index) => {
            const block = Blocks.getBlock(editor, { at: index });
            editor.increaseBlockDepth({ blockId: block?.id });
          });
        });
      }
      return;
    }

    if (HOTKEYS.isShiftTab(event)) {
      const selectedBlocks = Paths.getSelectedPaths(editor);
      if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
        event.preventDefault();

        editor.batchOperations(() => {
          selectedBlocks.forEach((index) => {
            const block = Blocks.getBlock(editor, { at: index });
            editor.decreaseBlockDepth({ blockId: block?.id });
          });
        });
      }
      return;
    }
  };

  // This event handler will be fired only in read-only mode
  const onCopy = (e: ClipboardEvent) => {
    if (!isReadOnly) return;
    const clipboardData: Pick<DataTransfer, 'getData' | 'setData'> = e.clipboardData;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.collapsed) return;

      const clonedContent = range.cloneContents();
      const blocksEl = clonedContent.querySelectorAll('[data-yoopta-block-id]');

      if (!blocksEl.length) return;

      const content: YooptaContentValue = Array.from(blocksEl).reduce((acc, blockEl) => {
        const blockId = blockEl.getAttribute('data-yoopta-block-id') || '';
        const block = editor.children[blockId];
        if (block) acc[blockId] = block;
        return acc;
      }, {});

      const htmlString = editor.getHTML(content);
      const textString = editor.getPlainText(content);

      clipboardData.setData('text/html', htmlString);
      clipboardData.setData('text/plain', textString);
      return;
    }
  };

  const editorStyles: CSSProperties = getEditorStyles({
    ...style,
    userSelect: selectionBox.selection ? 'none' : 'auto',
    pointerEvents: selectionBox.selection ? 'none' : 'auto',
    width: width || style?.width,
    paddingBottom: style?.paddingBottom,
  });

  return (
    <div
      ref={(ref) => (editor.refElement = ref)}
      className={className ? `yoopta-editor ${className}` : 'yoopta-editor'}
      style={editorStyles}
      onMouseDown={onMouseDown}
      onBlur={onBlur}
      onCopy={onCopy}
      onCut={onCopy}
    >
      <RenderBlocks editor={editor} marks={marks} placeholder={placeholder} />
      {selectionBoxRoot !== false && (
        <SelectionBox
          origin={selectionBox.origin}
          coords={selectionBox.coords}
          isOpen={selectionBox.selection && !isReadOnly}
        />
      )}
      {children}
    </div>
  );
};

export { Editor };

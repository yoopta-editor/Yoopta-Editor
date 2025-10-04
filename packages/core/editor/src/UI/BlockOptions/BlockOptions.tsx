import type { CSSProperties } from 'react';
import { useState } from 'react';
import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { CopyIcon, Link2Icon, TrashIcon } from '@radix-ui/react-icons';
import copy from 'copy-to-clipboard';

import TurnIcon from './icons/turn.svg';
import { buildActionMenuRenderProps } from './utils';
import { useYooptaTools } from '../../contexts/YooptaContext/ToolsContext';
import { useYooptaEditor } from '../../contexts/YooptaContext/YooptaContext';
import { getRootBlockElement } from '../../utils/blockElements';
import { findPluginBlockByPath } from '../../utils/findPluginBlockByPath';
import { Overlay } from '../Overlay/Overlay';
import { Portal } from '../Portal/Portal';

const BlockOptionsMenuGroup = ({ children }) => (
  <div className="yoopta-block-options-group">{children}</div>
);

const BlockOptionsMenuContent = ({ children }) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className="yoopta-block-options-menu-content data-[state=open]:yoo-editor-animate-in data-[state=closed]:yoo-editor-animate-out data-[state=closed]:yoo-editor-fade-out-0 data-[state=open]:yoo-editor-fade-in-0 data-[state=closed]:yoo-editor-zoom-out-95 data-[state=open]:yoo-editor-zoom-in-95 data-[side=bottom]:yoo-editor-slide-in-from-top-2 data-[side=left]:yoo-editor-slide-in-from-right-2 data-[side=right]:yoo-editor-slide-in-from-left-2 data-[side=top]:yoo-editor-slide-in-from-bottom-2">
    {children}
  </div>
);

const BlockOptionsMenuItem = ({ children }) => (
  <div className="yoopta-block-options-item">{children}</div>
);

type BlockOptionsSeparatorProps = {
  className?: string;
};

const BlockOptionsSeparator = ({ className = '' }: BlockOptionsSeparatorProps) => (
  <div className={`yoopta-block-options-separator ${className}`} />
);

export type BlockOptionsProps = {
  isOpen: boolean;
  onClose: () => void;
  refs: any;
  style: CSSProperties;
  children?: React.ReactNode;
  actions?: ['delete', 'duplicate', 'turnInto', 'copy'] | null;
};

const DEFAULT_ACTIONS: BlockOptionsProps['actions'] = ['delete', 'duplicate', 'turnInto', 'copy'];

const BlockOptions = ({
  isOpen,
  onClose,
  refs,
  style,
  actions = DEFAULT_ACTIONS,
  children,
}: BlockOptionsProps) => {
  const editor = useYooptaEditor();
  const tools = useYooptaTools();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const {
    refs: actionMenuRefs,
    floatingStyles: actionMenuFloatingStyles,
    context,
  } = useFloating({
    placement: 'right',
    open: isActionMenuOpen,
    onOpenChange: setIsActionMenuOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted: isActionMenuMounted, styles: actionMenuTransitionStyles } =
    useTransitionStyles(context, {
      duration: 100,
    });

  if (!isOpen) return null;

  const currentBlock = findPluginBlockByPath(editor, { at: editor.path.current });
  const rootElement = getRootBlockElement(editor.blocks[currentBlock?.type || '']?.elements);
  const isVoidElement = rootElement?.props?.nodeType === 'void';

  const onDelete = () => {
    editor.deleteBlock({ at: editor.path.current });
    editor.setPath({ current: null });

    onClose();
  };

  const onDuplicate = () => {
    // [TEST]
    if (typeof editor.path.current !== 'number') return;

    editor.duplicateBlock({ original: { path: editor.path.current }, focus: true });

    onClose();
  };

  const onCopy = () => {
    const block = findPluginBlockByPath(editor);
    if (block) {
      copy(`${window.location.origin}${window.location.pathname}#${block.id}`);
      editor.emit('block:copy', block);
    }

    onClose();
  };

  const ActionMenu = tools.ActionMenu;
  const actionMenuStyles = { ...actionMenuFloatingStyles, ...actionMenuTransitionStyles };

  const onCloseActionMenu = () => {
    setIsActionMenuOpen(false);
    onClose();
  };

  const actionMenuRenderProps = buildActionMenuRenderProps({
    editor,
    view: 'small',
    onClose: onCloseActionMenu,
  });

  return (
    // [TODO] - take care about SSR
    <Portal id="yoo-block-options-portal">
      <Overlay lockScroll className="yoo-editor-z-[100]" onClick={onClose}>
        <div style={style} ref={refs.setFloating} contentEditable={false}>
          <BlockOptionsMenuContent>
            {actions !== null && (
              <BlockOptionsMenuGroup>
                <BlockOptionsMenuItem>
                  <button type="button" className="yoopta-block-options-button" onClick={onDelete}>
                    <TrashIcon className="yoo-editor-w-4 yoo-editor-h-4 yoo-editor-mr-2" />
                    Delete
                  </button>
                </BlockOptionsMenuItem>
                <BlockOptionsMenuItem>
                  <button
                    type="button"
                    className="yoopta-block-options-button"
                    onClick={onDuplicate}>
                    <CopyIcon className="yoo-editor-w-4 yoo-editor-h-4 yoo-editor-mr-2" />
                    Duplicate
                  </button>
                </BlockOptionsMenuItem>
                {!!ActionMenu &&
                  !isVoidElement &&
                  !editor.blocks[currentBlock?.type || '']?.hasCustomEditor && (
                    <BlockOptionsMenuItem>
                      {isActionMenuMounted && (
                        <Portal id="yoo-block-options-portal">
                          <Overlay
                            lockScroll
                            className="yoo-editor-z-[100]"
                            onClick={() => setIsActionMenuOpen(false)}>
                            <div style={actionMenuStyles} ref={actionMenuRefs.setFloating}>
                              {/* @ts-ignore - fixme */}
                              <ActionMenu {...actionMenuRenderProps} />
                            </div>
                          </Overlay>
                        </Portal>
                      )}
                      <button
                        type="button"
                        className="yoopta-block-options-button"
                        ref={actionMenuRefs.setReference}
                        onClick={() => setIsActionMenuOpen((open) => !open)}>
                        <TurnIcon className="yoo-editor-w-4 yoo-editor-h-4 yoo-editor-mr-2" />
                        Turn into
                      </button>
                    </BlockOptionsMenuItem>
                  )}
                <BlockOptionsMenuItem>
                  <button type="button" className="yoopta-block-options-button" onClick={onCopy}>
                    <Link2Icon className="yoo-editor-w-4 yoo-editor-h-4 yoo-editor-mr-2" />
                    Copy link to block
                  </button>
                </BlockOptionsMenuItem>
              </BlockOptionsMenuGroup>
            )}
            {children}
          </BlockOptionsMenuContent>
        </div>
      </Overlay>
    </Portal>
  );
};

export {
  BlockOptions,
  BlockOptionsMenuContent,
  BlockOptionsMenuGroup,
  BlockOptionsMenuItem,
  BlockOptionsSeparator,
};

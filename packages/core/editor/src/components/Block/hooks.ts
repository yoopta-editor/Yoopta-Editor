import { useYooptaTools } from '../../contexts/YooptaContext/ToolsContext';
import { useFloating, offset, flip, inline, shift, useTransitionStyles, autoUpdate } from '@floating-ui/react';
import { useMemo, useState } from 'react';
import { buildActionMenuRenderProps } from '../../UI/BlockOptions/utils';
import { YooptaBlockData } from '../../editor/types';
import { Transform } from '@dnd-kit/utilities';

export const useActionMenuToolRefs = ({ editor }) => {
  const tools = useYooptaTools();
  const ActionMenu = tools.ActionMenu;

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const {
    refs: actionMenuRefs,
    floatingStyles: actionMenuFloatingStyles,
    context: actionMenuContext,
  } = useFloating({
    placement: 'bottom-start',
    open: isActionMenuOpen,
    onOpenChange: setIsActionMenuOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted: isMountedActionMenu, styles: actionMenuTransitionStyles } = useTransitionStyles(
    actionMenuContext,
    { duration: 100 },
  );

  const actionMenuStyles = { ...actionMenuFloatingStyles, ...actionMenuTransitionStyles };
  const onChangeActionMenuOpen = (state) => setIsActionMenuOpen(state);

  const onCloseActionMenu = () => onChangeActionMenuOpen(false);
  const actionMenuRenderProps = buildActionMenuRenderProps({
    editor,
    view: 'default',
    mode: 'create',
    onClose: onCloseActionMenu,
  });

  return {
    isActionMenuOpen: isMountedActionMenu,
    actionMenuStyles,
    actionMenuRefs,
    hasActionMenu: !!ActionMenu,
    onChangeActionMenuOpen,
    actionMenuRenderProps,
    onCloseActionMenu,
    ActionMenu,
  };
};

export const useBlockStyles = (
  block: YooptaBlockData,
  transform: Transform | null,
  transition: string | undefined,
  isDragging: boolean,
  isOver: boolean,
) => {
  return useMemo(
    () => ({
      container: {
        marginLeft: `${block.meta.depth * 20}px`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
        transition,
        opacity: isDragging ? 0.7 : 1,
      },
      content: isOver && !isDragging ? { borderBottom: '2px solid #007aff' } : undefined,
    }),
    [block.meta.depth, transform, transition, isDragging, isOver],
  );
};

export const useBlockOptionsRefs = () => {
  const [isBlockOptionsOpen, setIsBlockOptionsOpen] = useState(false);

  const {
    refs: blockOptionsRefs,
    floatingStyles: blockOptionsStyles,
    context: blockOptionsContext,
  } = useFloating({
    placement: 'right-start',
    open: isBlockOptionsOpen,
    onOpenChange: setIsBlockOptionsOpen,
    middleware: [inline(), flip(), shift(), offset()],
  });

  const { isMounted: isBlockOptionsMounted, styles: blockOptionsTransitionStyles } = useTransitionStyles(
    blockOptionsContext,
    {
      duration: 100,
    },
  );
  const blockOptionsFloatingStyle = { ...blockOptionsStyles, ...blockOptionsTransitionStyles };

  return {
    blockOptionsRefs,
    blockOptionsFloatingStyle,
    isBlockOptionsOpen,
    setIsBlockOptionsOpen,
    isBlockOptionsMounted,
  };
};

import { useYooptaDndKitContext } from '@yoopta/ui';
import {
  FloatingBlockActions as FloatingBlockActionsUI,
  useFloatingBlockActions,
  useFloatingBlockActionHandlers,
} from '@yoopta/ui/floating-block-actions';
import { useBlockOptionsContext } from '@/new-components/block-options/block-options';

export const FloatingBlockActions = () => {
  const { hoveredBlockId } = useFloatingBlockActions();
  const { onPlusClick, onDragClick } = useFloatingBlockActionHandlers();
  const { getDragHandleProps } = useYooptaDndKitContext();
  const { open, close, isOpen } = useBlockOptionsContext();

  const dragActionClick = (event: React.MouseEvent) => {
    onDragClick(event);
    if (isOpen) {
      close();
    } else {
      open({ element: event.currentTarget as HTMLElement });
    }
  };

  const plusActionClick = (event: React.MouseEvent) => {
    onPlusClick(event);
    open({ element: event.currentTarget as HTMLElement });
  };

  const dragProps = getDragHandleProps(hoveredBlockId);

  return (
    <FloatingBlockActionsUI.Root>
      <FloatingBlockActionsUI.PlusAction onClick={plusActionClick} />
      <FloatingBlockActionsUI.DragAction onClick={dragActionClick} {...dragProps} />
    </FloatingBlockActionsUI.Root>
  );
};

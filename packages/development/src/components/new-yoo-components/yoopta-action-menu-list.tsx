import { ActionMenuList } from '@yoopta/ui/action-menu-list';
import { Placement } from '@floating-ui/dom';
import { HeadingIcon } from 'lucide-react';
import { Blocks, useYooptaEditor } from '@yoopta/editor';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: HTMLElement | null;
  placement: Placement;
}

export const YooptaActionMenuList = ({ open, onOpenChange, anchor, placement }: Props) => {
  return (
    <ActionMenuList
      open={open}
      anchor={anchor}
      onOpenChange={onOpenChange}
      view="small"
      placement={placement}
    >
      <ActionMenuList.Content />
    </ActionMenuList >
  )
};

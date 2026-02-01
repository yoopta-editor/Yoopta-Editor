import React from 'react';
import { ActionMenuList } from '@yoopta/ui/action-menu-list';
import { Placement } from '@floating-ui/dom';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: HTMLElement | null;
  placement: Placement;
}

export const ActionMenuListComponent = ({ open, onOpenChange, anchor, placement }: Props) => {
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

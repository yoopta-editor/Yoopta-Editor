import { ActionMenuList } from '@yoopta/ui/action-menu-list';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: HTMLElement | null;
  blockId: string | null;
}

export const YooptaActionMenuList = ({ open, onOpenChange, anchor, blockId }: Props) => {
  return (
    <ActionMenuList
      open={open}
      onOpenChange={onOpenChange}
      anchor={anchor}
      blockId={blockId}
      view="small"
      placement="right-start"
    >
      <ActionMenuList.Content />
    </ActionMenuList>
  )
};

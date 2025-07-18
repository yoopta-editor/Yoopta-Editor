import { useYooptaEditor } from '@yoopta/editor';
import { Toolbar as ToolbarUI, ToolbarProvider, useToolbarActions } from '@yoopta/ui/toolbar';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  PaletteIcon,
} from 'lucide-react';
import { HighlightColor, useHighlightColor } from '@yoopta/ui/highlight-color';

export const Toolbar = () => {
  const { toggleMark, toggleAlign, isMarkActive, getCurrentAlign } = useToolbarActions();
  const { open, close, isOpen, refs, floatingStyles } = useHighlightColor();
  const editor = useYooptaEditor();

  const getAlignIcon = () => {
    const align = getCurrentAlign();
    switch (align) {
      case 'left':
        return <AlignLeftIcon />;
      case 'center':
        return <AlignCenterIcon />;
      case 'right':
        return <AlignRightIcon />;
      default:
        return <AlignLeftIcon />;
    }
  };

  return (
    <ToolbarProvider>
      <ToolbarUI.Root>
        <ToolbarUI.Content>
          <ToolbarUI.Group>
            <ToolbarUI.Toggle
              icon={<BoldIcon />}
              active={isMarkActive('bold')}
              onClick={() => toggleMark('bold')}
              aria-label="Bold"
            />
            <ToolbarUI.Toggle
              icon={<ItalicIcon />}
              active={isMarkActive('italic')}
              onClick={() => toggleMark('italic')}
              aria-label="Italic"
            />
            <ToolbarUI.Toggle
              icon={<UnderlineIcon />}
              active={isMarkActive('underline')}
              onClick={() => toggleMark('underline')}
              aria-label="Underline"
            />
            <ToolbarUI.Toggle
              icon={<StrikethroughIcon />}
              active={isMarkActive('strike')}
              onClick={() => toggleMark('strike')}
              aria-label="Strikethrough"
            />
            <ToolbarUI.Toggle
              icon={<CodeIcon />}
              active={isMarkActive('code')}
              onClick={() => toggleMark('code')}
              aria-label="Code"
            />
          </ToolbarUI.Group>
          <ToolbarUI.Separator />
          <ToolbarUI.Group>
            <ToolbarUI.Toggle icon={getAlignIcon()} onClick={toggleAlign} aria-label="Text alignment" />
          </ToolbarUI.Group>
          <ToolbarUI.Group>
            <ToolbarUI.Toggle
              icon={<PaletteIcon />}
              onClick={(event: React.MouseEvent) => open({ element: event.currentTarget as HTMLElement })}
              aria-label="Highlight color"
            />
            <HighlightColor
              editor={editor}
              isOpen={isOpen}
              onClose={close}
              refs={refs}
              floatingStyles={floatingStyles}
            />
          </ToolbarUI.Group>
        </ToolbarUI.Content>
      </ToolbarUI.Root>
    </ToolbarProvider>
  );
};

import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Selection, useYooptaEditor } from '@yoopta/editor';

import { Separator } from '../../ui/separator';
import { cn } from '../../utils';

type DividerTheme = 'solid' | 'dashed' | 'dotted' | 'gradient';

export const Divider = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const { attributes, element } = props;
  const dividerElement = element as SlateElement<
    'divider',
    { theme?: DividerTheme; color?: string }
  >;
  const theme = dividerElement.props?.theme ?? 'solid';
  const color = dividerElement.props?.color;

  const getSeparatorClassName = () => {
    switch (theme) {
      case 'dashed':
        return cn(
          'border-t-2 border-dashed border-b-0 border-l-0 border-r-0 bg-transparent',
          color ? '' : 'border-border',
        );
      case 'dotted':
        return cn(
          'border-t-2 border-dotted border-b-0 border-l-0 border-r-0 bg-transparent',
          color ? '' : 'border-border',
        );
      case 'gradient':
        return 'h-[2px] bg-transparent border-0';
      default: // solid
        return cn('h-[1px]', color ? '' : 'bg-border');
    }
  };

  const getSeparatorStyles = () => {
    if (!color) return {};

    switch (theme) {
      case 'dashed':
        return {
          borderTopColor: color,
        };
      case 'dotted':
        return {
          borderTopColor: color,
        };
      case 'gradient':
        return {
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        };
      default: // solid
        return {
          backgroundColor: color,
        };
    }
  };

  const onClick = () => {
    const block = Blocks.getBlock(editor, { id: props.blockId })
    if (!block) return;
    Selection.setSelected(editor, { at: block.meta.order });
  }

  return (
    <div {...attributes} contentEditable={false} className="w-full py-3" onClick={onClick}>
      <Separator
        orientation="horizontal"
        decorative
        className={getSeparatorClassName()}
        style={getSeparatorStyles()}
      />
      {props.children}
    </div>
  );
};

import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Selection, useYooptaEditor } from '@yoopta/editor';
import {
  ElementOptions,
} from '@yoopta/ui/element-options';

import { Separator } from '../../ui/separator';
import { cn } from '../../utils';
import type { DividerElementProps, DividerTheme } from '../componets/divider-element-options';
import { DividerElementOptions } from '../componets/divider-element-options';

const getSeparatorClassName = (theme: DividerTheme, color: string | undefined) => {
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

export const Divider = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const { attributes, element, blockId } = props;
  const dividerElement = element as SlateElement<'divider', DividerElementProps>;
  const theme = dividerElement.props?.theme ?? 'solid';
  const color = dividerElement.props?.color;


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
    const block = Blocks.getBlock(editor, { id: blockId });
    if (!block) return;
    Selection.setSelected(editor, { at: block.meta.order });
  };

  return (
    <div
      {...attributes}
      contentEditable={false}
      className="group relative w-full py-3"
      onClick={onClick}>
      <ElementOptions.Root blockId={blockId} element={element}>
        <ElementOptions.Trigger
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-accent"
        />
        <DividerElementOptions />
      </ElementOptions.Root>

      <Separator
        orientation="horizontal"
        decorative
        className={getSeparatorClassName(theme, color)}
        style={getSeparatorStyles()}
      />
      {props.children}
    </div>
  );
};

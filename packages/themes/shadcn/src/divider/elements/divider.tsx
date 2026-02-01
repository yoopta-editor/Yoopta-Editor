import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Selection, useYooptaEditor } from '@yoopta/editor';
import {
  ElementOptions,
  useElementOptions,
  useUpdateElementProps,
} from '@yoopta/ui/element-options';

import { Separator } from '../../ui/separator';
import { cn } from '../../utils';

type DividerTheme = 'solid' | 'dashed' | 'dotted' | 'gradient';

type DividerElementProps = {
  theme?: DividerTheme;
  color?: string;
};

const DIVIDER_THEMES = [
  { value: 'solid' as const, label: 'Solid' },
  { value: 'dashed' as const, label: 'Dashed' },
  { value: 'dotted' as const, label: 'Dotted' },
  { value: 'gradient' as const, label: 'Gradient' },
];

const DIVIDER_COLORS = [
  '#E5E7EB', // gray-200
  '#6B7280', // gray-500
  '#1F2937', // gray-800
  '#EF4444', // red-500
  '#F59E0B', // amber-500
  '#22C55E', // green-500
  '#3B82F6', // blue-500
  '#8B5CF6', // violet-500
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DividerOptionsContent = () => {
  const { element } = useElementOptions();
  const updateProps = useUpdateElementProps<DividerElementProps>();
  const dividerElement = element as SlateElement<'divider', DividerElementProps>;

  return (
    <ElementOptions.Content
      side="top"
      align="center"
      sideOffset={8}
      className="min-w-[180px] rounded-lg border bg-popover p-2 shadow-md">
      <ElementOptions.Group className="flex flex-col gap-1">
        <ElementOptions.Label className="px-2 text-xs font-medium text-muted-foreground">
          Style
        </ElementOptions.Label>
        <ElementOptions.Select
          value={dividerElement.props?.theme ?? 'solid'}
          options={DIVIDER_THEMES}
          onValueChange={(value) => updateProps({ theme: value })}
          className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm hover:bg-accent"
        />
      </ElementOptions.Group>

      <ElementOptions.Separator className="my-2 h-px bg-border" />

      <ElementOptions.Group className="flex flex-col gap-1">
        <ElementOptions.Label className="px-2 text-xs font-medium text-muted-foreground">
          Color
        </ElementOptions.Label>
        <ElementOptions.ColorPicker
          value={dividerElement.props?.color ?? '#E5E7EB'}
          onChange={(value) => updateProps({ color: value })}
          presetColors={DIVIDER_COLORS}
          className="flex h-8 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm hover:bg-accent"
        />
      </ElementOptions.Group>
    </ElementOptions.Content>
  );
};

export const Divider = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const { attributes, element, blockId } = props;
  const dividerElement = element as SlateElement<'divider', DividerElementProps>;
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

  const handleClick = () => {
    const block = Blocks.getBlock(editor, { id: blockId });
    if (!block) return;
    Selection.setSelected(editor, { at: block.meta.order });
  };

  return (
    <div
      {...attributes}
      contentEditable={false}
      className="group relative w-full py-3"
      onClick={handleClick}>
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

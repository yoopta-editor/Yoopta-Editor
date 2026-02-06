import type { SlateElement } from "@yoopta/editor";
import { ElementOptions, useElementOptions, useUpdateElementProps } from "@yoopta/ui/element-options";

export const DIVIDER_THEMES = [
  { value: 'solid' as const, label: 'Solid' },
  { value: 'dashed' as const, label: 'Dashed' },
  { value: 'dotted' as const, label: 'Dotted' },
  { value: 'gradient' as const, label: 'Gradient' },
];

export const DIVIDER_COLORS = [
  '#E5E7EB', // gray-200
  '#6B7280', // gray-500
  '#1F2937', // gray-800
  '#EF4444', // red-500
  '#F59E0B', // amber-500
  '#22C55E', // green-500
  '#3B82F6', // blue-500
  '#8B5CF6', // violet-500
];


export type DividerTheme = 'solid' | 'dashed' | 'dotted' | 'gradient';

export type DividerElementProps = {
  theme?: DividerTheme;
  color?: string;
};

export const DividerElementOptions = () => {
  const { element } = useElementOptions();
  const updateProps = useUpdateElementProps<DividerElementProps>();
  const dividerElement = element as SlateElement<'divider', DividerElementProps>;

  return (
    <ElementOptions.Content
      side="bottom"
      align="end"
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

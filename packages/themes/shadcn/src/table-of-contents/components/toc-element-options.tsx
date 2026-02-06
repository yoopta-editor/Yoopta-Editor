import {
  ElementOptions,
  useElementOptions,
  useUpdateElementProps,
} from '@yoopta/ui/element-options';
import type { TableOfContentsElementProps } from '@yoopta/table-of-contents';

const DEPTH_OPTIONS = [
  { value: '1' as const, label: 'H1 only' },
  { value: '2' as const, label: 'H1 – H2' },
  { value: '3' as const, label: 'H1 – H3' },
];

export const TocElementOptions = () => {
  const { element } = useElementOptions();
  const updateProps = useUpdateElementProps<TableOfContentsElementProps>();
  const tocProps = (element.props ?? {}) as Partial<TableOfContentsElementProps>;

  return (
    <ElementOptions.Content
      side="bottom"
      align="end"
      sideOffset={8}
      className="min-w-[200px] rounded-lg border bg-popover p-2 shadow-md">
      <ElementOptions.Group className="flex flex-col gap-1">
        <ElementOptions.Label className="px-2 text-xs font-medium text-muted-foreground">
          Title
        </ElementOptions.Label>
        <ElementOptions.Input
          value={tocProps.title ?? 'Table of Contents'}
          onChange={(value) => updateProps({ title: value })}
          placeholder="Title..."
          className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </ElementOptions.Group>

      <ElementOptions.Separator className="my-2 h-px bg-border" />

      <ElementOptions.Group className="flex flex-col gap-1">
        <ElementOptions.Label className="px-2 text-xs font-medium text-muted-foreground">
          Depth
        </ElementOptions.Label>
        <ElementOptions.Select
          value={String(tocProps.depth ?? 3)}
          options={DEPTH_OPTIONS}
          onValueChange={(value) => updateProps({ depth: Number(value) as 1 | 2 | 3 })}
          className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm hover:bg-accent"
        />
      </ElementOptions.Group>

      <ElementOptions.Separator className="my-2 h-px bg-border" />

      <ElementOptions.Group className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Numbered</span>
          <ElementOptions.Toggle
            checked={tocProps.showNumbers ?? false}
            onCheckedChange={(checked) => updateProps({ showNumbers: checked })}
          />
        </div>
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Collapsible</span>
          <ElementOptions.Toggle
            checked={tocProps.collapsible ?? false}
            onCheckedChange={(checked) => updateProps({ collapsible: checked })}
          />
        </div>
      </ElementOptions.Group>
    </ElementOptions.Content>
  );
};

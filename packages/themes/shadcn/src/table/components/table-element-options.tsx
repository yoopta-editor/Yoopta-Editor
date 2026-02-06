import {
  ElementOptions,
  useElementOptions,
  useUpdateElementProps,
} from '@yoopta/ui/element-options';

type TableAppearanceProps = {
  bordered?: boolean;
  striped?: boolean;
  compact?: boolean;
  scrollable?: boolean;
};

export const TableElementOptions = () => {
  const { element } = useElementOptions();
  const updateProps = useUpdateElementProps<TableAppearanceProps>();
  const tableProps = (element.props ?? {}) as Partial<TableAppearanceProps>;

  return (
    <ElementOptions.Content
      side="bottom"
      align="end"
      sideOffset={8}
      className="min-w-[180px] rounded-lg border bg-popover p-2 shadow-md">
      <ElementOptions.Group className="flex flex-col gap-1.5">
        <ElementOptions.Label className="px-2 text-xs font-bold text-muted-foreground">
          Appearance
        </ElementOptions.Label>
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Bordered</span>
          <ElementOptions.Toggle
            checked={tableProps.bordered ?? true}
            onCheckedChange={(checked) => updateProps({ bordered: checked })}
          />
        </div>
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Compact</span>
          <ElementOptions.Toggle
            checked={tableProps.compact ?? false}
            onCheckedChange={(checked) => updateProps({ compact: checked })}
          />
        </div>
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Scrollable</span>
          <ElementOptions.Toggle
            checked={tableProps.scrollable ?? true}
            onCheckedChange={(checked) => updateProps({ scrollable: checked })}
          />
        </div>
      </ElementOptions.Group>
    </ElementOptions.Content>
  );
};

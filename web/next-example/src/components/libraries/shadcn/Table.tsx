import { PluginElementRenderProps } from '@yoopta/editor';

// https://ui.shadcn.com/docs/components/typography
export function Table(props: PluginElementRenderProps) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <tbody {...props.attributes}>{props.children}</tbody>
      </table>
    </div>
  );
}

export function TableRow(props: PluginElementRenderProps) {
  return (
    <tr {...props.attributes} className="m-0 !border-t p-0 even:bg-[#f4f4f5]">
      {props.children}
    </tr>
  );
}

export function TableDataCell(props: PluginElementRenderProps) {
  const Node = props.isDataCellAsHeader ? 'th' : 'td';
  const style = {
    maxWidth: props.width,
    minWidth: props.height,
    backgroundColor: props.selected ? '#f0f0f0' : 'transparent',
  };

  return (
    <Node
      {...props.attributes}
      style={style}
      className="!border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
      {props.children}
    </Node>
  );
}

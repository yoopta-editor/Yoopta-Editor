import { PluginElementRenderProps } from '@yoopta/editor';

const DividerRenderElement = ({
  attributes,
  children,
  element,
  blockId,
}: PluginElementRenderProps) => {
  return (
    <div
      {...attributes}
      className="w-full flex relative items-center h-[14px] my-1"
      contentEditable={false}>
      <hr className="absolute w-full" />
      {children}
    </div>
  );
};

export { DividerRenderElement };

import { PluginElementRenderProps } from '@yoopta/editor';

export const TabsList = (props: PluginElementRenderProps) => {
  return (
    <ul
      className="relative not-prose mb-6 pb-[1px] flex-none min-w-full overflow-auto border-b border-[#4ade80] space-x-6 flex dark:border-zinc-200/10"
      {...props.attributes}
    >
      {props.children}
    </ul>
  );
};

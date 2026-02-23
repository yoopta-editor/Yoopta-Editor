import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockData } from '@yoopta/editor';
import { useNumberListCount } from '@yoopta/lists';

export const NumberedList = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId } = props;

  const block = useBlockData(blockId);
  const count = useNumberListCount(block);

  return (
    <div {...attributes} className="my-0 ml-6 list-decimal leading-7 mt-2">
      <span contentEditable={false}>{count}.</span>
      <span {...attributes} className="pl-2">
        {children}
      </span>
    </div>
  );
};

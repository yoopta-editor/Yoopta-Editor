import { Anchor, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Popover } from '../../../ui/popover';
import { Input } from '../../../ui/input';

export const HeadingOne = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <h1
      id={element.id}
      draggable={false}
      {...attributes}
      className="scroll-m-20 mt-8 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
};

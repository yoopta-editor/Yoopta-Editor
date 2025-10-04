import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import {
  Elements,
  PluginElementRenderProps,
  useBlockData,
  useYooptaEditor,
  useYooptaReadOnly,
} from '@yoopta/editor';
import { PlusCircle } from 'lucide-react';
import { CarouselBlockOptions } from '../components/CarouselBlockOptions';

const Carousel = ({ children, element, blockId, attributes }: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const block = useBlockData(blockId);

  const onAddCarouselItem = () => {
    Elements.createElement(
      editor,
      blockId,
      { type: 'carousel-item' },
      { path: 'next', focus: true, split: false },
    );
  };

  const orientation = element.props?.orientation;
  const loop = element.props?.loop;

  return (
    <CarouselRoot
      {...attributes}
      className="yoopta-carousel"
      opts={{ loop }}
      orientation={orientation}>
      <CarouselContent>{children}</CarouselContent>
      <CarouselPrevious contentEditable={false} />
      <CarouselNext contentEditable={false} />
      {!editor.readOnly && (
        <>
          <button type="button" onClick={onAddCarouselItem}>
            <PlusCircle />
          </button>
          <CarouselBlockOptions props={element.props} block={block} editor={editor} />
        </>
      )}
    </CarouselRoot>
  );
};

export { Carousel };

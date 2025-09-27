import { Card, CardContent } from '@/components/ui/card';
import { CarouselItem as CarouselRootItem } from '@/components/ui/carousel';
import { Elements, PluginElementRenderProps, useYooptaEditor } from '@yoopta/editor';
import { Trash } from 'lucide-react';

const CarouselItem = ({ element, blockId, attributes, children }: PluginElementRenderProps) => {
  const editor = useYooptaEditor();

  const onDeleteItem = () => {
    const items = Elements.getElementChildren(editor, blockId, { type: 'carousel' });
    if (items?.length === 1) {
      return editor.deleteBlock({ blockId });
    }

    const elementPath = Elements.getElementPath(editor, blockId, element);
    if (elementPath) {
      Elements.deleteElement(editor, blockId, { path: elementPath, type: 'carousel-item' });
    }
  };

  return (
    <CarouselRootItem
      key={element.id}
      {...attributes}
      className="md:basis-1/2 lg:basis-1/3 relative group">
      <div className="p-1">
        <Card>
          <CardContent className="flex flex-col aspect-square items-center p-4">
            {children}
          </CardContent>
        </Card>
      </div>
      {!editor.readOnly && (
        <button
          type="button"
          onClick={onDeleteItem}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100">
          <Trash size={16} color="gray" />
        </button>
      )}
    </CarouselRootItem>
  );
};

export { CarouselItem };

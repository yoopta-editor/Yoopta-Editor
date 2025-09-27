import {
  Elements,
  PluginElementRenderProps,
  useYooptaEditor,
  useYooptaReadOnly,
} from '@yoopta/editor';
import { ImageIcon, DeleteIcon, Delete, Trash2 } from 'lucide-react';
import { ChangeEvent, MouseEvent } from 'react';

const CarouselItemImage = ({
  element,
  children,
  attributes,
  blockId,
}: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const readOnly = useYooptaReadOnly();

  const onUploadFile = (event: ChangeEvent) => {
    if (readOnly) return;

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;

      const elementPath = Elements.getElementPath(editor, blockId, element);

      Elements.updateElement(
        editor,
        blockId,
        { type: 'carousel-item-image', props: { ...element.props, src } },
        { path: elementPath },
      );
    };
    reader.readAsDataURL(file);
  };

  const onDeleteImage = () => {
    if (readOnly) return;

    const elementPath = Elements.getElementPath(editor, blockId, element);

    Elements.updateElement(
      editor,
      blockId,
      { type: 'carousel-item-image', props: { ...element.props, src: null } },
      { path: elementPath },
    );
  };

  return (
    <div className="p-0 py-1 h-full w-full" {...attributes} contentEditable={false}>
      <div className="grid gap-2">
        <label
          htmlFor={`${element.id}-uploader`}
          className="aspect-square w-full rounded-md object-cover cursor-pointer relative"
          onClick={(e) => e.stopPropagation()}>
          <input
            id={`${element.id}-uploader`}
            onChange={onUploadFile}
            type="file"
            className="hidden opacity-0"
            multiple={false}
            disabled={readOnly}
            accept="image/*"
          />
          {element.props.src ? (
            <>
              <img
                alt={`${element.id} image`}
                loading="lazy"
                width="100%"
                height="100%"
                decoding="async"
                data-nimg="1"
                className="aspect-square w-full rounded-md object-cover"
                src={element.props.src}
              />
              {!readOnly && (
                <button
                  onClick={onDeleteImage}
                  className="absolute top-1 right-1 z-10"
                  type="button">
                  <Trash2 size={20} color="red" />
                </button>
              )}
            </>
          ) : (
            <div className="aspect-square w-full h-full rounded-md bg-gray-200 relative">
              <ImageIcon
                size={30}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          )}
        </label>
      </div>
      {children}
    </div>
  );
};

export { CarouselItemImage };

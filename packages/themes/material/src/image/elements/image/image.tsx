import { type PluginElementRenderProps } from '@yoopta/editor';

import { ImagePlaceholder, ImagePlaceholderCompact } from './image-placeholder';

export const ImageElement = ({ element, attributes, children }: PluginElementRenderProps) => {
  if (!element.props.src) {
    return (
      <ImagePlaceholderCompact
        onUpload={() => {}}
        onInsertUrl={() => {}}
        onInsertFromUnsplash={() => {}}
        onInsertFromAI={async () => {}}
        attributes={attributes}>
        {children}
      </ImagePlaceholderCompact>
    );
  }

  return (
    <div {...attributes} contentEditable={false}>
      <img src={element.props.src} alt={element.props.alt} />
      {children}
    </div>
  );
};

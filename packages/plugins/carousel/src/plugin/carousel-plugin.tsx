import { YooptaPlugin } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';

import { CarouselCommands } from '../commands/carousel-commands';
import type { CarouselElementMap } from '../types';

const CarouselContainer = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes} data-component-part="carousel-container">
    {children}
  </div>
);

const CarouselListItem = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes} data-component-part="carousel-list-item">
    {children}
  </div>
);

export const CarouselPlugin = new YooptaPlugin<CarouselElementMap>({
  type: 'Carousel',
  elements: (
    <carousel-container render={CarouselContainer}>
      <carousel-list-item render={CarouselListItem} />
    </carousel-container>
  ),
  options: {
    display: {
      title: 'Carousel',
      description: 'Create a carousel to display images or content in a slider',
    },
    shortcuts: ['carousel'],
  },
  commands: CarouselCommands,
  lifecycle: {
    beforeCreate: (editor) => CarouselCommands.buildCarouselElements(editor, { items: 5 }),
  },
  events: {
    onKeyDown: (editor, slate, options) => (event) => {
      //
    },
  },
});

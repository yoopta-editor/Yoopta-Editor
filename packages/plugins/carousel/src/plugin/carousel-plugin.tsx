import { YooptaPlugin, serializeTextNodes, serializeTextNodesIntoMarkdown } from '@yoopta/editor';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';

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
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['DIV'],
        parse: (el) => {
          // Check if this is our carousel format (has flex container with items)
          const flexContainer = el.querySelector(':scope > div[style*="display: flex"]');
          if (!flexContainer) return;

          const items = flexContainer.querySelectorAll(':scope > div');
          if (items.length === 0) return;

          // Check if items look like carousel items (have specific styling)
          const firstItem = items[0];
          const hasCarouselStyle =
            firstItem.style.flex === '0 0 auto' ||
            firstItem.style.borderRadius === '8px';

          if (!hasCarouselStyle) return;

          const carouselItems: SlateElement[] = [];

          items.forEach((item, index) => {
            carouselItems.push({
              id: `carousel-item-${index}`,
              type: 'carousel-list-item',
              children: [{ text: item.textContent || '' }],
            } as SlateElement);
          });

          if (carouselItems.length === 0) return;

          return {
            id: 'carousel-container',
            type: 'carousel-container',
            children: carouselItems,
            props: { nodeType: 'block' },
          } as SlateElement;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};

        if (element.type === 'carousel-container') {
          const items = element.children || [];
          const itemsHtml = items
            .map((item: SlateElement, index: number) => {
              if (item.type === 'carousel-list-item') {
                const contentText = serializeTextNodes(item.children);
                return `<div style="flex: 0 0 auto; width: 200px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; margin-right: 16px;">${contentText}</div>`;
              }
              return '';
            })
            .join('');

          return `
            <div data-meta-depth="${depth}" style="margin-left: ${depth * 20}px; overflow-x: auto;">
              <div style="display: flex; padding: 8px 0;">${itemsHtml}</div>
            </div>`;
        }

        return '';
      },
    },
    markdown: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};
        const indent = '  '.repeat(depth);

        if (element.type === 'carousel-container') {
          const items = element.children || [];
          return items
            .map((item: SlateElement, index: number) => {
              if (item.type === 'carousel-list-item') {
                const contentText = serializeTextNodesIntoMarkdown(item.children);
                return `${indent}${index + 1}. ${contentText}`;
              }
              return '';
            })
            .join('\n');
        }

        return '';
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};

        if (element.type === 'carousel-container') {
          const items = element.children || [];
          const itemsHtml = items
            .map((item: SlateElement, index: number) => {
              if (item.type === 'carousel-list-item') {
                const contentText = serializeTextNodes(item.children);
                return `
                  <td style="width: 200px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; vertical-align: top;">
                    ${contentText}
                  </td>`;
              }
              return '';
            })
            .join('');

          return `
            <table style="width: 100%; margin-left: ${depth * 20}px;">
              <tbody>
                <tr>${itemsHtml}</tr>
              </tbody>
            </table>`;
        }

        return '';
      },
    },
  },
  events: {
    onKeyDown: (editor, slate, options) => (event) => {
      //
    },
  },
});

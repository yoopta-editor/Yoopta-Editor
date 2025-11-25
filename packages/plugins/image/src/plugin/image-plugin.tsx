import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { YooptaPlugin, generateId } from '@yoopta/editor';

import { ImageCommands } from '../commands';
import type { ImageElementMap, ImageElementProps, ImagePluginOptions } from '../types';
import { ImageRender } from '../ui/Image';
import { limitSizes } from '../utils/limitSizes';

const ALIGNS_TO_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const ImageContainerRender = (props: PluginElementRenderProps) => {
  const { children, element, blockId, attributes } = props;
  return (
    <div {...attributes} className="flex flex-col gap-0">
      {children}
    </div>
  );
};

const ImageCaptionRender = (props: PluginElementRenderProps) => {
  const { children, element, blockId, attributes } = props;
  return (
    <div {...attributes} className="text-sm text-gray-500">
      {children}
    </div>
  );
};

const imageProps = {
  src: null,
  alt: null,
  srcSet: null,
  bgColor: null,
  fit: null,
  sizes: { width: 0, height: 0 },
  nodeType: 'void',
};

const Image = new YooptaPlugin<ImageElementMap, ImagePluginOptions>({
  type: 'Image',
  // @ts-expect-error - image conflicts with native HTML element type
  elements: <image render={ImageRender} props={imageProps} nodeType="void" />,
  commands: ImageCommands,
  options: {
    display: {
      title: 'Image',
      description: 'Upload from device or insert with link',
    },
    onUpload: () => Promise.resolve({ src: null, alt: null }),
    accept: 'image/png, image/jpeg, image/gif, image/webp',
    maxSizes: { maxWidth: 650, maxHeight: 550 },
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['IMG'],
        parse: (el, editor) => {
          if (el.nodeName === 'IMG') {
            const sizes = {
              width: el.getAttribute('width')
                ? parseInt(el.getAttribute('width') || '650', 10)
                : 650,
              height: el.getAttribute('height')
                ? parseInt(el.getAttribute('height') || '500', 10)
                : 500,
            };

            const maxSizes = (editor.plugins.Image.options as ImagePluginOptions)?.maxSizes;
            const limitedSizes = limitSizes(sizes!, {
              width: maxSizes!.maxWidth!,
              height: maxSizes!.maxHeight!,
            });

            const props: SlateElement<'image', ImageElementProps>['props'] = {
              nodeType: 'void',
              src: el.getAttribute('src') || '',
              alt: el.getAttribute('alt') || '',
              srcSet: el.getAttribute('srcset') || '',
              fit: (el.getAttribute('objectFit') || 'contain') as ImageElementProps['fit'],
              sizes: limitedSizes,
            };

            const node: SlateElement = {
              id: generateId(),
              type: 'image',
              children: [{ text: '' }],
              props,
            };

            return node;
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'center';

        return `<div style="margin-left: ${
          depth * 20
        }px; display: flex; width: 100%; justify-content: ${justify};">
        <img data-meta-align="${align}" data-meta-depth="${depth}" src="${
          element.props.src
        }" alt="${element.props.alt}" width="${element.props.sizes.width}" height="${
          element.props.sizes.height
        }" objectFit="${element.props.fit}"/>
        </div>`;
      },
    },
    markdown: {
      serialize: (element, text) => `![${element.props.alt || element.id}](${element.props.src})\n`,
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'center';

        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td style="margin-left: ${
                  depth * 20
                }px; display: flex; width: 100%; justify-content: ${justify}; margin-top: 1rem;">
                    <img data-meta-align="${align}" style="margin: 0 auto; object-fit:${
          element.props.fit || 'contain'
        };" data-meta-depth="${depth}" src="${element.props.src}" alt="${
          element.props.alt
        }" width="${element.props.sizes.width}" height="${element.props.sizes.height}" />
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
});

export { Image };

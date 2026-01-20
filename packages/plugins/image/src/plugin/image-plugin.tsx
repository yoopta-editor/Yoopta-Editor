import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { YooptaPlugin, generateId } from '@yoopta/editor';

import { ImageCommands } from '../commands';
import type { ImageElementMap, ImageElementProps, ImagePluginOptions } from '../types';
import { limitSizes } from '../utils/limitSizes';

const ALIGNS_TO_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const imageProps: ImageElementProps = {
  id: null,
  src: null,
  alt: null,
  srcSet: null,
  bgColor: null,
  fit: null,
  sizes: { width: 0, height: 0 },
};

const BaseImageRender = (props: PluginElementRenderProps) => (
  <div {...props.attributes} contentEditable={false}>
    <img
      src={props.element.props.src}
      alt={props.element.props.alt}
      width={props.element.props.sizes?.width}
      height={props.element.props.sizes?.height}
      style={{ objectFit: props.element.props.fit }}
    />
    {props.children}
  </div>
);

const Image = new YooptaPlugin<ImageElementMap, ImagePluginOptions>({
  type: 'Image',
  elements: <image render={BaseImageRender} props={imageProps} nodeType="void" />,
  commands: ImageCommands,
  options: {
    display: {
      title: 'Image',
      description: 'Upload from device or insert with link',
    },
    // accept: 'image/png, image/jpeg, image/gif, image/webp',
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
              id: generateId(),
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

        return `<div style="margin-left: ${depth * 20
          }px; display: flex; width: 100%; justify-content: ${justify};">
        <img data-meta-align="${align}" data-meta-depth="${depth}" src="${element.props.src
          }" alt="${element.props.alt}" width="${element.props.sizes.width}" height="${element.props.sizes.height
          }" objectFit="${element.props.fit}"/>
        </div>`;
      },
    },
    markdown: {
      serialize: (element) => `![${element.props.alt || element.id}](${element.props.src})\n`,
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'center';

        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td style="margin-left: ${depth * 20
          }px; display: flex; width: 100%; justify-content: ${justify}; margin-top: 1rem;">
                    <img data-meta-align="${align}" style="margin: 0 auto; object-fit:${element.props.fit || 'contain'
          };" data-meta-depth="${depth}" src="${element.props.src}" alt="${element.props.alt
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

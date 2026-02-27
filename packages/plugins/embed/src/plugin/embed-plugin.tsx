import { YooptaPlugin, generateId } from '@yoopta/editor';

import { EmbedCommands } from '../commands';
import type { EmbedElementMap, EmbedElementProps, EmbedPluginOptions } from '../types';
import { parseEmbedUrl } from '../utils/providers';

const ALIGNS_TO_JUSTIFY: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const DEFAULT_EMBED_PROPS: EmbedElementProps = {
  provider: null,
  sizes: { width: 650, height: 400 },
  nodeType: 'void',
};

const Embed = new YooptaPlugin<EmbedElementMap, EmbedPluginOptions>({
  type: 'Embed',
  elements: (
    <embed
      render={(props) => <div contentEditable={false} {...props.attributes}>
        <iframe
          title={props.element.props.provider?.type}
          src={props.element.props.provider?.embedUrl}
          width={props.element.props.sizes.width}
          height={props.element.props.sizes.height}
          allowFullScreen
          frameBorder={0}
        />
        {props.children}
      </div>}
      props={DEFAULT_EMBED_PROPS}
      nodeType="void"
    />
  ),
  options: {
    display: {
      title: 'Embed',
      description: 'Embed videos, maps, code, and more',
    },
    shortcuts: ['embed', 'youtube', 'vimeo', 'twitter', 'instagram', 'figma', 'codepen', 'spotify'],
  },
  commands: EmbedCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['IFRAME', 'DIV'],
        parse: (el) => {
          // Handle IFRAME elements
          if (el.nodeName === 'IFRAME') {
            const src = el.getAttribute('src');
            if (!src) return;

            const provider = parseEmbedUrl(src);
            if (!provider) return;

            const width = parseInt(el.getAttribute('width') ?? '650', 10);
            const height = parseInt(el.getAttribute('height') ?? '400', 10);

            return {
              id: generateId(),
              type: 'embed',
              children: [{ text: '' }],
              props: {
                provider,
                sizes: { width, height },
                nodeType: 'void',
              } as EmbedElementProps,
            };
          }

          // Handle DIV with data-yoopta-embed attribute
          if (el.nodeName === 'DIV' && el.hasAttribute('data-yoopta-embed')) {
            const iframe = el.querySelector('iframe');
            if (!iframe) return;

            const src = iframe.getAttribute('src');
            if (!src) return;

            const provider = parseEmbedUrl(src);
            if (!provider) return;

            const width = parseInt(iframe.getAttribute('width') ?? '650', 10);
            const height = parseInt(iframe.getAttribute('height') ?? '400', 10);

            return {
              id: generateId(),
              type: 'embed',
              children: [{ text: '' }],
              props: {
                provider,
                sizes: { width, height },
                nodeType: 'void',
              } as EmbedElementProps,
            };
          }
        },
      },
      serialize: (element, _text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta ?? {};
        const justify = ALIGNS_TO_JUSTIFY[align] ?? 'center';
        const { provider, sizes } = element.props as EmbedElementProps;

        if (!provider) {
          return `<div data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${depth * 20}px;"><!-- Empty embed --></div>`;
        }

        return `<div data-yoopta-embed data-provider="${provider.type}" data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${depth * 20}px; display: flex; width: 100%; justify-content: ${justify};">
          <iframe src="${provider.embedUrl}" width="${sizes.width}" height="${sizes.height}" frameborder="0" allowfullscreen></iframe>
        </div>`;
      },
    },
    markdown: {
      serialize: (element) => {
        const { provider } = element.props as EmbedElementProps;
        if (!provider) return '';

        // Markdown doesn't support embeds natively, output as link
        return `[${provider.meta?.title ?? provider.type}](${provider.url})\n`;
      },
    },
    email: {
      serialize: (element, _text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta ?? {};
        const justify = ALIGNS_TO_JUSTIFY[align] ?? 'center';
        const { provider, sizes } = element.props as EmbedElementProps;

        if (!provider) return '';

        // Email clients don't support iframes, show link with thumbnail if available
        const thumbnailHtml = provider.meta?.thumbnailUrl
          ? `<img src="${provider.meta.thumbnailUrl}" width="${sizes.width}" height="${sizes.height}" alt="${provider.meta?.title ?? 'Embedded content'}" style="border-radius: 8px; max-width: 100%;" />`
          : `<div style="width: ${sizes.width}px; height: ${sizes.height}px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #666;">Click to view ${provider.type} content</span>
            </div>`;

        return `
          <table style="width: 100%;">
            <tbody>
              <tr>
                <td style="margin-left: ${depth * 20}px; display: flex; justify-content: ${justify}; padding: 1rem 0;">
                  <a href="${provider.url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                    ${thumbnailHtml}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
});

export { Embed };

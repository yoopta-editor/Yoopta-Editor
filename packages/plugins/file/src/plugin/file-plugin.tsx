import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin, generateId } from '@yoopta/editor';

import { FileCommands } from '../commands';
import type { FileElementMap, FileElementProps, FilePluginOptions } from '../types';
import { formatFileSize } from '../utils/format-size';

const ALIGNS_TO_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const DEFAULT_FILE_PROPS: FileElementProps = {
  id: null,
  src: null,
  name: null,
  size: null,
  format: null,
};

const File = new YooptaPlugin<FileElementMap, FilePluginOptions>({
  type: 'File',
  elements: (
    <file
      render={(props: PluginElementRenderProps) => {
        const { name, src, size, format } = props.element.props;
        const displayName = format ? `${name}.${format}` : name;

        return (
          <div {...props.attributes}>
            <a href={src ?? undefined} download={name ?? undefined} target="_blank" rel="noopener noreferrer">
              {displayName ?? 'Untitled file'}
              {size ? ` (${formatFileSize(size)})` : ''}
            </a>
            {props.children}
          </div>
        );
      }}
      nodeType="void"
      props={DEFAULT_FILE_PROPS}
    />
  ),
  commands: FileCommands,
  options: {
    display: {
      title: 'File',
      description: 'Upload and attach files',
    },
    accept: '',
  },
  parsers: {
    html: {
      serialize: (element, _text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta ?? {};
        const justify = ALIGNS_TO_JUSTIFY[align] ?? 'left';
        const displayName = element.props.format
          ? `${element.props.name}.${element.props.format}`
          : element.props.name;
        const sizeText = element.props.size ? ` (${formatFileSize(element.props.size)})` : '';

        return `<div style="margin-left: ${depth * 20}px; display: flex; width: 100%; justify-content: ${justify}">
          <a 
            data-yoopta-file
            data-meta-align="${align}" 
            data-meta-depth="${depth}" 
            href="${element.props.src}" 
            data-size="${element.props.size ?? 0}" 
            data-format="${element.props.format ?? ''}"
            data-id="${element.props.id ?? ''}"
            download="${element.props.name}" 
            target="_blank" 
            rel="noopener noreferrer"
          >${displayName}${sizeText}</a>
        </div>`;
      },
      deserialize: {
        // [TODO] - add props as second param. ex.: ['A', { 'data-yoopta-file': true }]
        nodeNames: ['A'],
        parse: (el) => {
          if (el.nodeName === 'A') {
            const hasDownloadAttr = !!el.getAttribute('download');
            const isYooptaFile = !!el.getAttribute('data-yoopta-file');
            const href = el.getAttribute('href');

            // Only parse if it's a download link or explicitly marked as yoopta file
            if (!hasDownloadAttr && !isYooptaFile) return;
            if (!href) return;

            try {
              const url = new URL(href, window.location.origin);
              const textContent = el.textContent ?? '';
              const downloadAttr = el.getAttribute('download') ?? '';

              // Parse name and format
              let name = downloadAttr || textContent.split(' (')[0] || '';
              let format: string | null = null;

              const dotIndex = name.lastIndexOf('.');
              if (dotIndex > 0) {
                format = name.slice(dotIndex + 1);
                name = name.slice(0, dotIndex);
              }

              // Parse size from data attribute or text content
              const sizeAttr = el.getAttribute('data-size');
              const size = sizeAttr ? Number(sizeAttr) : null;

              // Parse id and format from data attributes
              const id = el.getAttribute('data-id') ?? null;
              const formatAttr = el.getAttribute('data-format');
              if (formatAttr) format = formatAttr;

              return {
                id: generateId(),
                type: 'file',
                children: [{ text: '' }],
                props: {
                  id,
                  name: name || null,
                  format,
                  src: url.href,
                  size,
                },
              };
            } catch {
              // Invalid URL, skip
            }
          }
        },
      },
    },
    markdown: {
      serialize: (element) => {
        const displayName = element.props.format
          ? `${element.props.name}.${element.props.format}`
          : element.props.name;
        return `[${displayName}](${element.props.src})\n`;
      },
    },
    email: {
      serialize: (element, _text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta ?? {};
        const justify = ALIGNS_TO_JUSTIFY[align] ?? 'left';
        const displayName = element.props.format
          ? `${element.props.name}.${element.props.format}`
          : element.props.name;
        const sizeText = element.props.size ? ` (${formatFileSize(element.props.size)})` : '';

        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td style="margin-left: ${depth * 20}px; display: flex; width: 100%; justify-content: ${justify}; padding: 8px 0;">
                  <a 
                    href="${element.props.src}" 
                    download="${element.props.name}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style="
                      display: inline-flex;
                      align-items: center;
                      gap: 8px;
                      padding: 12px 16px;
                      background-color: #f5f5f5;
                      border-radius: 8px;
                      text-decoration: none;
                      color: #333;
                      font-size: 14px;
                    "
                  >
                    <span style="font-size: 20px;">📎</span>
                    <span>${displayName}${sizeText}</span>
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

export { File };

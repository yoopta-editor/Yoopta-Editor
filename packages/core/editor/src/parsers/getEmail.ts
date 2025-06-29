import { Paths } from '../editor/paths';
import { SlateElement, YooEditor, YooptaContentValue } from '../editor/types';
import { serializeTextNodes } from './serializeTextNodes';

type StyleElement = {
  id?: string;
  content: string;
};

type MetaElement = {
  content?: string;
  name?: string;
  'http-equiv'?: string;
  property?: string;
  charset?: string;
};

type StyleAttribute = {
  [key: string]: string | number;
};

type ElementAttributes = {
  style?: StyleAttribute;
  [key: string]: any;
};

export type EmailTemplateOptions = {
  head?: {
    styles?: StyleElement[];
    meta?: MetaElement[];
    title?: string;
  };
  body?: {
    attrs?: ElementAttributes;
  };
  container?: {
    attrs?: ElementAttributes;
  };
  customTemplate?: (content: string) => string;
};

const DEFAULT_OPTIONS: EmailTemplateOptions = {
  head: {
    meta: [
      { content: 'width=device-width', name: 'viewport' },
      { charset: 'UTF-8' },
      { content: 'IE=edge', 'http-equiv': 'X-UA-Compatible' },
    ],
  },
  body: {
    attrs: {
      style: {
        margin: '0 auto',
        padding: 0,
        width: '900px',
      },
    },
  },
  container: {
    attrs: {
      style: {
        margin: '0 auto',
        width: '600px',
      },
    },
  },
};

export function getEmail(editor: YooEditor, content: YooptaContentValue, opts?: EmailTemplateOptions): string {
  const options = deepMerge(DEFAULT_OPTIONS, opts || {});
  const blocks = Object.values(content)
    .filter((item) => {
      const selectedBlocks = Paths.getSelectedPaths(editor);

      if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
        return selectedBlocks?.includes(item.meta.order);
      }

      return true;
    })
    .sort((a, b) => a.meta.order - b.meta.order);

  const email = blocks.map((blockData) => {
    const plugin = editor.plugins[blockData.type];

    if (plugin && plugin.parsers?.email?.serialize) {
      // @ts-ignore - fixme
      const innerContent = serializeTextNodes(blockData.value[0].children);
      return plugin.parsers.email.serialize(
        blockData.value[0] as SlateElement,
        innerContent,
        blockData.meta,
        editor,
        blockData,
      );
    }

    return '';
  });

  const emailContent = email.join('');

  if (options.customTemplate) {
    return options.customTemplate(emailContent);
  }

  const bodyAttrs = attributesToString(options.body?.attrs);
  const containerAttrs = attributesToString(options.container?.attrs);

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
      <head>
        <title>${options?.head?.title || 'Email-Builder'}</title>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        ${generateMetaTags(options.head?.meta)}
        ${generateStyles(options.head?.styles)}
      </head>
      <body id="yoopta-email" ${bodyAttrs}>
        <table ${containerAttrs}>
          <tbody>
            <tr>
              <td>
                ${emailContent}
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `;
}

// Email helpers
function generateMetaTags(meta: MetaElement[] = []): string {
  return meta
    .map((tag) => {
      const attrs = Object.entries(tag)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => {
          if (value === '') return key;
          return `${key}="${value}"`;
        })
        .join(' ');

      return `<meta ${attrs}>`;
    })
    .join('\n');
}

function generateStyles(styles: StyleElement[] = []): string {
  return styles
    .map((style) => {
      const idAttr = style.id ? ` id="${style.id}"` : '';
      return `<style${idAttr}>${style.content}</style>`;
    })
    .join('\n');
}

function styleObjectToString(style?: StyleAttribute): string {
  if (!style) return '';

  return Object.entries(style)
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      return `${cssKey}: ${value}${typeof value === 'number' ? 'px' : ''};`;
    })
    .join(' ');
}

function attributesToString(attrs?: ElementAttributes): string {
  if (!attrs) return '';

  return Object.entries(attrs)
    .map(([key, value]) => {
      if (key === 'style') {
        const styleString = styleObjectToString(value as StyleAttribute);
        return `style="${styleString}"`;
      }

      return `${key}="${value}"`;
    })
    .join(' ');
}

function deepMerge(target: any, source: any): any {
  if (Array.isArray(target) && Array.isArray(source)) {
    return target.concat(source);
  }

  if (typeof target === 'object' && typeof source === 'object') {
    return Object.keys({ ...target, ...source }).reduce((acc, key) => {
      acc[key] = deepMerge(target[key], source[key]);
      return acc;
    }, {});
  }

  return source;
}

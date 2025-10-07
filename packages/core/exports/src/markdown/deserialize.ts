import type { YooEditor, YooptaContentValue } from '@yoopta/editor';
import { marked } from 'marked';

import { deserializeHTML } from '../html/deserialize';

export function deserializeMarkdown(editor: YooEditor, markdown: string): YooptaContentValue {
  const imageExtension = {
    name: 'image',
    level: 'block',
    start(src: string) {
      return src.match(/!\[/)?.index;
    },
    tokenizer(src: string) {
      const rule = /^!\[(.*?)\]\((.*?)\)/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'image',
          raw: match[0],
          alt: match[1],
          href: match[2],
        };
      }
    },
    renderer(token: any) {
      return `<img alt="${token.alt}" src="${token.href}">`;
    },
  };
  marked.use({ extensions: [imageExtension] });
  const html = marked.parse(markdown, { gfm: true, breaks: true, pedantic: false }) as string;
  return deserializeHTML(editor, html);
}

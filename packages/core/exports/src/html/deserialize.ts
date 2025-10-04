import type { YooEditor, YooptaContentValue} from '@yoopta/editor';
import { deserializeHTML as parseHTML } from '@yoopta/editor';

export function deserializeHTML(editor: YooEditor, htmlString: string): YooptaContentValue {
  const parsedHtml = new DOMParser().parseFromString(htmlString, 'text/html');
  const value: YooptaContentValue = {};

  const blocks = parseHTML(editor, parsedHtml.body);

  blocks.forEach((block, i) => {
    const blockData = block;
    blockData.meta.order = i;
    value[block.id] = blockData;
  });

  return value;
}

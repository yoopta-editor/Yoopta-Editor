import { YooEditor, YooptaContentValue, deserializeHTML as parseHTML } from '@yoopta/editor';

export function deserializeHTML(editor: YooEditor, htmlString: string): YooptaContentValue {
  const parsedHtml = new DOMParser().parseFromString(htmlString, 'text/html');

  console.log('deserializeHTML htmlString', htmlString);
  console.log('deserializeHTML parsedHtml', parsedHtml);
  const value: YooptaContentValue = {};

  const blocks = parseHTML(editor, parsedHtml.body);

  blocks.forEach((block, i) => {
    const blockData = block;
    blockData.meta.order = i;
    value[block.id] = blockData;
  });

  return value;
}

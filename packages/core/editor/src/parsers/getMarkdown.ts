import { SlateElement, YooEditor, YooptaBlockBaseMeta, YooptaBlockData, YooptaContentValue } from '../editor/types';

export function serialize(editor: YooEditor, blocksData: YooptaBlockData[]) {
  const blocks = blocksData.sort((a, b) => (a.meta.order > b.meta.order ? 1 : -1));

  const markdown = blocks.map((blockData) => {
    const plugin = editor.plugins[blockData.type];

    if (plugin) {
      const element = blockData.value[0] as SlateElement;

      if (plugin.parsers?.markdown?.serialize) {
        const serialized = plugin.parsers.markdown.serialize(
          element,
          // @ts-ignore - fixme
          element.children.map((child) => child.text).join(''),
          blockData.meta as YooptaBlockBaseMeta,
        );
        if (serialized) return serialized;
      }
    }

    return '';
  });

  return markdown.join('\n');
}

export function getMarkdown(editor: YooEditor, content: YooptaContentValue) {
  const selectedBlocks = Object.values(content);
  return serialize(editor, selectedBlocks);
}

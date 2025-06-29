import { serializeTextNodesIntoMarkdown } from '@yoopta/editor';

export function serializeMarkown(element, text, blockMeta) {
  const { depth = 0 } = blockMeta || {};
  const indent = '  '.repeat(depth); // 2 spaces per depth level
  let markdownTable = '';

  element.children.forEach((row, rowIndex) => {
    const rowMarkdown = row.children
      .map((cell) => {
        return ` ${serializeTextNodesIntoMarkdown(cell.children)} `;
      })
      .join('|');

    markdownTable += `${indent}|${rowMarkdown}|\n`;

    if (rowIndex === 0) {
      const separator = row.children.map(() => ' --- ').join('|');
      markdownTable += `${indent}|${separator}|\n`;
    }
  });

  return markdownTable;
}

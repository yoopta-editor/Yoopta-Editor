import type { SlateElement, YooptaBlockData} from '@yoopta/editor';
import { serializeTextNodes } from '@yoopta/editor';

export function serializeTableToEmail(
  element: SlateElement,
  text: string,
  blockMeta?: YooptaBlockData['meta'],
): string {
  const columns = (element.children[0] as SlateElement).children as any[];
  const { align = 'left', depth = 0 } = blockMeta || {};

  const serialized = `
    <table style="margin-left: ${depth * 20}px; text-align: ${align};
        border-collapse: collapse;
    border-spacing: 0px 0px;
    caption-side: bottom;
    font-size: .875rem;
    line-height: 1.25rem;
    table-layout: fixed;
    user-select: none;
    width: auto;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: .5rem;
    padding-top: .5rem;
    position: relative;
    width: 100%;
    " data-meta-align="${align}" data-meta-depth="${depth}" data-header-row="${
    element.props?.headerRow
  }" data-header-column="${element.props?.headerColumn}">
      <colgroup>
      ${columns
        .map((td) => `<col style="width: ${td.props?.width ? `${td.props?.width}px` : 'auto'}" />`)
        .join('')}
      </colgroup>
      <tbody>${element.children
        .map((trElement) => 
          // @ts-ignore - fixme
           `<tr style="position: relative;">${trElement.children
            .map((td) => {
              const text = serializeTextNodes(td.children);
              if (td.props?.asHeader) {
                return `<th style="
    border-width: 1px;
    border: 1px solid #e9e9e7;
    color: inherit;
    min-height: 32px;
    position: relative;
    vertical-align: top;
    background-color: #f7f6f3;
    font-size: 14px;
    line-height: 20px;
    max-width: 100%;
    overflow-wrap: break-word;
    padding: 7px 9px;
    white-space: pre-wrap;
    width: 100%;" data-width="${td.props?.width || 200}" rowspan="1" colspan="1">${text}</th>`;
              }

              return `<td style="
    border-width: 1px;
    border: 1px solid #e9e9e7;
    color: inherit;
    min-height: 32px;
    position: relative;
    vertical-align: top;
    background-color: transparent;
    font-size: 14px;
    line-height: 20px;
    max-width: 100%;
    overflow-wrap: break-word;
    padding: 7px 9px;
    white-space: pre-wrap;
    width: 100%;" data-width="${td.props?.width || 200}" rowspan="1" colspan="1">${text}</td>`;
            })
            .join('')}</tr>`
        )
        .join('')}</tbody></table>`;

  return serialized;
}

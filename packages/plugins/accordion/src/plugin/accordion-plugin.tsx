import {
  Blocks,
  Elements,
  YooptaPlugin,
  buildBlockElementsStructure,
  serializeTextNodes,
} from '@yoopta/editor';
import type { SlateElement } from '@yoopta/editor';
import type { Descendant } from 'slate';
import { Element, Transforms } from 'slate';

import { AccordionCommands } from '../commands/accordion-commands';
import { ACCORDION_ELEMENTS } from '../constants';
import type { AccordionElementMap, AccordionListItemProps } from '../types';

const accordionListItemProps: AccordionListItemProps = {
  isExpanded: true,
};

const Accordion = new YooptaPlugin<AccordionElementMap>({
  type: 'Accordion',
  elements: (
    <accordion-list render={(props) => <div {...props.attributes}>{props.children}</div>}>
      <accordion-list-item
        props={accordionListItemProps}
        render={(props) => <details {...props.attributes}>{props.children}</details>}>
        <accordion-list-item-heading
          render={(props) => <summary {...props.attributes}>{props.children}</summary>}
        />
        <accordion-list-item-content
          render={(props) => <p {...props.attributes}>{props.children}</p>}
        />
      </accordion-list-item>
    </accordion-list>
  ),
  commands: AccordionCommands,
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        if (hotkeys.isBackspace(event)) {
          if (event.isDefaultPrevented()) return;
          if (!slate.selection) return;

          const listItems = Elements.getElementChildren(editor, {
            blockId: currentBlock.id,
            type: 'accordion-list',
          });
          const accordionListItemEntry = Elements.getElementEntry(editor, {
            blockId: currentBlock.id,
            path: slate.selection.anchor.path,
            type: 'accordion-list-item',
          });

          const listItemChildPath = accordionListItemEntry?.[1] ?? slate.selection.anchor.path;
          const currentElement = Elements.getElement(editor, {
            blockId: currentBlock.id,
          });

          const isHeadingEmpty = Elements.isElementEmpty(editor, {
            blockId: currentBlock.id,
            type: 'accordion-list-item-heading',
            path: listItemChildPath,
          });

          const isContentEmpty = Elements.isElementEmpty(editor, {
            blockId: currentBlock.id,
            type: 'accordion-list-item-content',
            path: listItemChildPath,
          });

          if (
            isContentEmpty &&
            currentElement?.type === ACCORDION_ELEMENTS.AccordionListItemContent
          ) {
            event.preventDefault();
            return;
          }

          if (
            isHeadingEmpty &&
            currentElement?.type === ACCORDION_ELEMENTS.AccordionListItemHeading
          ) {
            event.preventDefault();

            if (listItems?.length === 1) {
              Blocks.deleteBlock(editor, { blockId: currentBlock.id });
              return;
            }

            if (accordionListItemEntry) {
              const [, listItemPath] = accordionListItemEntry;

              Elements.deleteElement(editor, {
                blockId: currentBlock.id,
                type: 'accordion-list-item',
                path: listItemPath,
              });
            }
          }
        }

        if (hotkeys.isEnter(event)) {
          if (event.isDefaultPrevented()) return;
          event.preventDefault();

          const currentElement = Elements.getElement(editor, {
            blockId: currentBlock.id,
          });
          const listItemEntry = Elements.getElementEntry(editor, {
            blockId: currentBlock.id,
            type: 'accordion-list-item',
          });

          if (
            currentElement?.type === ACCORDION_ELEMENTS.AccordionListItemHeading &&
            listItemEntry
          ) {
            const [listItem, listItemPath] = listItemEntry;

            Elements.updateElement(editor, {
              blockId: currentBlock.id,
              type: ACCORDION_ELEMENTS.AccordionListItem,
              props: {
                isExpanded: !listItem?.props?.isExpanded,
              },
              path: listItemPath,
            });

            return;
          }

          Elements.insertElement(editor, {
            blockId: currentBlock.id,
            type: 'accordion-list-item',
            props: { isExpanded: true },
            at: 'next',
            focus: true,
          });
        }
      };
    },
  },
  options: {
    display: {
      title: 'Accordion',
      description: 'Create collapses',
    },
    shortcuts: ['accordion'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['DETAILS'],
        parse: (el, editor) => {
          if (el.nodeName === 'DETAILS') {
            const summary = el.querySelector('summary');
            const p = el.querySelector('p');
            const elementsStructure = buildBlockElementsStructure(editor, 'Accordion', {
              [ACCORDION_ELEMENTS.AccordionListItemHeading]: summary?.textContent ?? '',
              [ACCORDION_ELEMENTS.AccordionListItemContent]: p?.textContent ?? '',
            });

            return elementsStructure;
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta ?? {};

        return `<div>${element.children
          .filter((node) => Element.isElement(node))
          .map((listItemNode) => {
            const listItem = listItemNode as SlateElement;

            return `<details data-meta-align="${align}" data-meta-depth="${depth}">${listItem.children
              .filter((node) => Element.isElement(node))
              .map((itemNode) => {
                const itemElement = itemNode as SlateElement;

                if (itemElement.type === ACCORDION_ELEMENTS.AccordionListItemHeading) {
                  return `<summary>${serializeTextNodes(itemElement.children)}</summary>`;
                }

                return `<p>${serializeTextNodes(itemElement.children)}</p>`;
              })
              .join('')}</details>`;
          })
          .join('')}</div>`;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta ?? {};

        return `
          <table data-meta-align="${align}" data-meta-depth="${depth}" style="width: 100%; border-collapse: collapse; margin-left: ${depth}px;">
            <tbody>
              ${element.children
                .filter((node: Descendant) => Element.isElement(node))
                .map((listItemNode) => {
                  const listItem = listItemNode as SlateElement;

                  return listItem.children
                    .filter((node: Descendant) => Element.isElement(node))
                    .map((itemNode) => {
                      const item = itemNode as SlateElement;

                      if (item.type === ACCORDION_ELEMENTS.AccordionListItemHeading) {
                        return `
                          <tr>
                            <td style="
                                border-radius: 0;
                                border-width: 0;
                                cursor: pointer;
                                font-size: 1rem;
                                font-weight: 500;
                                line-height: 1.5rem;
                                margin-bottom: 0;
                                padding-bottom: 1rem;
                                padding-right: 2rem;
                                padding-top: 1rem;
                                position: relative;
                                width: 100%;
                              ">
                              ${serializeTextNodes(item.children)}
                              <span style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);">
                                <svg viewbox="0 0 30 30" style="width: 12px; height: 100%;"><polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7"></polygon></svg>
                              </span>
                            </td>
                          </tr>`;
                      }
                      return `
                        <tr>
                          <td style="padding-bottom: 1rem; border-bottom: 1px solid #EFEFEE; font-size: .875rem; line-height: 1.25rem; overflow: hidden;">
                            ${serializeTextNodes(item.children)}
                          </td>
                        </tr>`;
                    })
                    .join('');
                })
                .join('')}
            </tbody>
          </table>`;
      },
    },
  },
});

export { Accordion };

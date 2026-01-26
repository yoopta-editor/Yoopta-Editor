import { YooptaPlugin, serializeTextNodes, serializeTextNodesIntoMarkdown } from '@yoopta/editor';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import type { Path } from 'slate';
import { Editor, Element, Range, Transforms } from 'slate';

import { StepsCommands } from '../commands/steps-commands';
import type { StepsElementMap } from '../types';

const StepContainer = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes} data-component-part="step-container">
    {children}
  </div>
);

const StepList = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes} className="space-y-0">
    {children}
  </div>
);

const StepListItem = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes} data-component-part="step-list-item">
    {children}
  </div>
);

const StepListItemHeading = ({ attributes, children }: PluginElementRenderProps) => (
  <h3 {...attributes} data-component-part="step-list-item-heading">
    {children}
  </h3>
);

const StepListItemContent = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes} data-component-part="step-list-item-content">
    {children}
  </div>
);

export const StepsPlugin = new YooptaPlugin<StepsElementMap>({
  type: 'Steps',
  elements: (
    <step-container render={StepContainer}>
      <step-list render={StepList}>
        <step-list-item render={StepListItem}>
          <step-list-item-heading render={StepListItemHeading} />
          <step-list-item-content render={StepListItemContent} />
        </step-list-item>
      </step-list>
    </step-container>
  ),
  options: {
    display: {
      title: 'Steps',
      description: 'Create step-by-step instructions',
    },
    shortcuts: ['steps'],
  },
  commands: StepsCommands,
  lifecycle: {
    beforeCreate: (editor) => StepsCommands.buildStepsElements(editor, { items: 2 }),
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['OL'],
        parse: (el) => {
          // Check if this is our steps format
          if (!el.querySelector('li') || el.style.listStyle !== 'none') return;

          const items = el.querySelectorAll(':scope > li');
          if (items.length === 0) return;

          const stepItems: SlateElement[] = [];

          items.forEach((item, index) => {
            const headingEl = item.querySelector('h4, [style*="font-weight: 600"]');
            const contentEl = item.querySelector('p, [style*="color: #6b7280"]');

            const headingText = headingEl?.textContent || `Step ${index + 1}`;
            const contentText = contentEl?.textContent || '';

            stepItems.push({
              id: `step-item-${index}`,
              type: 'step-list-item',
              children: [
                {
                  id: `step-heading-${index}`,
                  type: 'step-list-item-heading',
                  children: [{ text: headingText }],
                },
                {
                  id: `step-content-${index}`,
                  type: 'step-list-item-content',
                  children: [{ text: contentText }],
                },
              ],
            } as SlateElement);
          });

          if (stepItems.length === 0) return;

          return {
            id: 'step-container',
            type: 'step-container',
            children: [
              {
                id: 'step-list',
                type: 'step-list',
                children: stepItems,
              },
            ],
            props: { nodeType: 'block' },
          } as SlateElement;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};

        if (element.type === 'step-container') {
          // Will be handled by children serialization
          return '';
        }

        if (element.type === 'step-list') {
          const items = element.children || [];
          const stepsHtml = items
            .map((item, index) => {
              if (item.type === 'step-list-item') {
                const heading = item.children?.find(
                  (c: SlateElement) => c.type === 'step-list-item-heading',
                );
                const content = item.children?.find(
                  (c: SlateElement) => c.type === 'step-list-item-content',
                );

                const headingText = heading ? serializeTextNodes(heading.children) : '';
                const contentText = content ? serializeTextNodes(content.children) : '';

                return `
                  <li style="margin-bottom: 16px; padding-left: 8px;">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                      <span style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #e5e7eb; font-size: 12px; font-weight: 600; flex-shrink: 0;">${index + 1}</span>
                      <div>
                        <h4 style="margin: 0 0 4px 0; font-weight: 600;">${headingText}</h4>
                        <p style="margin: 0; color: #6b7280;">${contentText}</p>
                      </div>
                    </div>
                  </li>`;
              }
              return '';
            })
            .join('');

          return `<ol data-meta-depth="${depth}" style="list-style: none; padding: 0; margin-left: ${depth * 20}px;">${stepsHtml}</ol>`;
        }

        return '';
      },
    },
    markdown: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};
        const indent = '  '.repeat(depth);

        if (element.type === 'step-list') {
          const items = element.children || [];
          return items
            .map((item, index) => {
              if (item.type === 'step-list-item') {
                const heading = item.children?.find(
                  (c: SlateElement) => c.type === 'step-list-item-heading',
                );
                const content = item.children?.find(
                  (c: SlateElement) => c.type === 'step-list-item-content',
                );

                const headingText = heading
                  ? serializeTextNodesIntoMarkdown(heading.children)
                  : '';
                const contentText = content
                  ? serializeTextNodesIntoMarkdown(content.children)
                  : '';

                return `${indent}${index + 1}. **${headingText}**\n${indent}   ${contentText}`;
              }
              return '';
            })
            .join('\n');
        }

        return '';
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};

        if (element.type === 'step-list') {
          const items = element.children || [];
          const stepsHtml = items
            .map((item, index) => {
              if (item.type === 'step-list-item') {
                const heading = item.children?.find(
                  (c: SlateElement) => c.type === 'step-list-item-heading',
                );
                const content = item.children?.find(
                  (c: SlateElement) => c.type === 'step-list-item-content',
                );

                const headingText = heading ? serializeTextNodes(heading.children) : '';
                const contentText = content ? serializeTextNodes(content.children) : '';

                return `
                  <tr>
                    <td style="vertical-align: top; padding-right: 12px; padding-bottom: 16px;">
                      <div style="display: inline-block; width: 24px; height: 24px; border-radius: 50%; background: #e5e7eb; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">${index + 1}</div>
                    </td>
                    <td style="vertical-align: top; padding-bottom: 16px;">
                      <div style="font-weight: 600; margin-bottom: 4px;">${headingText}</div>
                      <div style="color: #6b7280;">${contentText}</div>
                    </td>
                  </tr>`;
              }
              return '';
            })
            .join('');

          return `
            <table style="width: 100%; margin-left: ${depth * 20}px;">
              <tbody>
                ${stepsHtml}
              </tbody>
            </table>`;
        }

        return '';
      },
    },
  },
  events: {
    onKeyDown: (editor, slate, options) => (event) => {
      if (options.hotkeys.isEnter(event)) {
        if (!slate.selection) return;
        event.preventDefault();

        const nodeEntry = Editor.above<SlateElement>(slate, {
          at: slate.selection,
          match: (n) => Element.isElement(n),
        });

        if (!nodeEntry) return;
        const [node] = nodeEntry;

        if (node.type === 'step-list-item-heading') {
          event.preventDefault();
          StepsCommands.addStep(editor, { blockId: options.currentBlock.id, at: slate.selection });
          return;
        }

        Transforms.insertText(slate, '\n');
      }

      if (options.hotkeys.isBackspace(event)) {
        if (!slate.selection) return;

        const nodeEntry = Editor.above<SlateElement>(slate, {
          at: slate.selection,
          match: (n) => Element.isElement(n),
        });

        if (!nodeEntry) return;
        const [node, path] = nodeEntry;
        const isStart = Editor.isStart(slate, slate.selection.anchor, path);
        const isExpanded = Range.isExpanded(slate.selection);

        if (!isStart || isExpanded) return;

        if (node.type === 'step-list-item-heading') {
          const [parentNode] = Editor.parent(slate, path) as [SlateElement, Path];
          if (Element.isElement(parentNode) && parentNode.type === 'step-list-item') {
            event.preventDefault();
            StepsCommands.deleteStep(editor, {
              blockId: options.currentBlock.id,
              stepId: parentNode.id,
            });
            return;
          }
        }

        if (node.type === 'step-list-item-content') {
          if (isStart) {
            event.preventDefault();
          }
        }
      }
    },
  },
});

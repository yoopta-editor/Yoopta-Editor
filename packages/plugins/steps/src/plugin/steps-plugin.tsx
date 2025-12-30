import { YooptaPlugin } from '@yoopta/editor';
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

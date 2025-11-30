import {
  Blocks,
  Elements,
  useYooptaEditor,
  YooptaPlugin,
  type PluginElementRenderProps,
  type SlateElement,
} from '@yoopta/editor';
import { CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type StepContainerElement = SlateElement<'step-container'>;
type StepListElement = SlateElement<'step-list'>;
type StepListItemElement = SlateElement<'step-list-item', { isCompleted?: boolean }>;
type StepListItemHeadingElement = SlateElement<'step-list-item-heading'>;
type StepListItemContentElement = SlateElement<'step-list-item-content'>;

export type StepsElementMap = {
  'step-container': StepContainerElement;
  'step-list': StepListElement;
  'step-list-item': StepListItemElement;
  'step-list-item-heading': StepListItemHeadingElement;
  'step-list-item-content': StepListItemContentElement;
};

const StepContainer = ({ attributes, children, element, blockId }: PluginElementRenderProps) => {
  const editor = useYooptaEditor();

  const handleAddStep = () => {
    Elements.createElement(
      editor,
      blockId,
      {
        type: 'step-list-item',
        props: { isCompleted: false },
      },
      { path: 'next', focus: true },
    );
  };

  return (
    <div
      {...attributes}
      role="list"
      className="relative my-8 ml-3.5 group/steps-node"
      data-step-container-id={element.id}>
      {children}
      <div
        className="absolute z-20 flex transition-opacity duration-300 opacity-0 group-hover/steps-node:opacity-100"
        contentEditable={false}
        style={{
          left: 0,
          opacity: 1,
          bottom: '-20px',
        }}>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Add more Step"
          onClick={handleAddStep}
          contentEditable={false}
          className="h-7 w-7 rounded-md">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const StepList = ({ attributes, children }: PluginElementRenderProps) => {
  return (
    <div {...attributes} className="space-y-0">
      {children}
    </div>
  );
};

const StepListItem = ({ attributes, children, element, blockId }: PluginElementRenderProps) => {
  const editor = useYooptaEditor();

  // Get all step items to determine index
  const stepItems = Elements.getElementChildren(editor, blockId, { type: 'step-list' });

  const currentIndex =
    stepItems?.findIndex((item) => {
      if ('id' in item) {
        return item.id === element.id;
      }
      return false;
    }) ?? 0;
  const stepNumber = currentIndex + 1;
  const isLast = currentIndex === (stepItems?.length ?? 0) - 1;

  // Check if step is completed
  const isCompleted = element.props?.isCompleted ?? false;

  return (
    <div
      {...attributes}
      role="listitem"
      className="relative flex items-start gap-4 pb-8 last:pb-0"
      data-step-number={stepNumber}
      data-completed={isCompleted}>
      <div className="flex flex-col items-center shrink-0" contentEditable={false}>
        <div
          className={cn(
            'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
            isCompleted
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-foreground',
          )}>
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <span className="text-xs">{stepNumber}</span>
          )}
        </div>

        {!isLast && (
          <div
            className={cn(
              'absolute top-8 h-[calc(100%)] w-0.5 transition-colors',
              isCompleted ? 'bg-primary' : 'bg-border',
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

const StepListItemHeading = ({ attributes, children }: PluginElementRenderProps) => {
  return (
    <h3
      {...attributes}
      data-component-part="step-title"
      className="mb-2 text-base font-semibold leading-tight text-foreground">
      {children}
    </h3>
  );
};

const StepListItemContent = ({ attributes, children }: PluginElementRenderProps) => {
  return (
    <div
      {...attributes}
      data-component-part="step-content"
      className="text-sm leading-relaxed text-muted-foreground
        [&_p]:mb-2 [&_p:last-child]:mb-0 
        [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2
        [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2
        [&_li]:mb-1 
        [&_strong]:font-semibold [&_strong]:text-foreground
        [&_em]:italic
        [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_code]:text-foreground
        [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:text-sm
        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-foreground
        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-foreground
        [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-foreground
        [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80">
      {children}
    </div>
  );
};

export const StepsPlugin = new YooptaPlugin<StepsElementMap>({
  type: 'Steps',
  elements: (
    <step-container render={StepContainer}>
      <step-list render={StepList}>
        <step-list-item render={StepListItem} props={{ isCompleted: false }}>
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
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        if (hotkeys.isEnter(event)) {
          event.preventDefault();

          // Add new step item
          Elements.createElement(
            editor,
            currentBlock.id,
            {
              type: 'step-list-item',
              props: { isCompleted: false },
            },
            { path: 'next', focus: true },
          );
        }

        if (hotkeys.isBackspace(event)) {
          if (!slate.selection) return;

          const stepItems = Elements.getElementChildren(editor, currentBlock.id, {
            type: 'step-list',
          });

          const currentElement = Elements.getElement(editor, currentBlock.id);

          // Check if heading is empty
          const isHeadingEmpty = Elements.isElementEmpty(editor, currentBlock.id, {
            type: 'step-list-item-heading',
            path: slate.selection.anchor.path,
          });

          if (isHeadingEmpty && currentElement?.type === 'step-list-item-heading') {
            event.preventDefault();

            if (stepItems?.length === 1) {
              Blocks.deleteBlock(editor, { blockId: currentBlock.id });
              return;
            }

            const stepItemEntry = Elements.getElementEntry(editor, currentBlock.id, {
              type: 'step-list-item',
            });

            if (stepItemEntry) {
              const [, stepItemPath] = stepItemEntry;
              Elements.deleteElement(editor, currentBlock.id, {
                type: 'step-list-item',
                path: stepItemPath,
              });
            }
          }
        }
      };
    },
  },
});

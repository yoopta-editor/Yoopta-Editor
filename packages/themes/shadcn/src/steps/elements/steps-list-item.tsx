import { useMemo } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Elements, useYooptaEditor } from '@yoopta/editor';
import { StepsCommands } from '@yoopta/steps';
import { ArrowDown, ArrowUp, MoreVertical, Trash2 } from 'lucide-react';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { cn } from '../../utils';

export const StepListItem = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;
  const editor = useYooptaEditor();

  const order = useMemo(() => {
    const path = Elements.getElementPath(editor, { blockId: props.blockId, element });
    const orderNumber = path?.[path.length - 1];
    if (!orderNumber) return 0;

    return orderNumber;
  }, [editor, element, props.blockId]);

  const stepNumber = order + 1;
  const isLast = order === element.children.length - 1;
  const isEmpty = element.children.length === 0;

  const moveUp = () => {
    StepsCommands.moveUp(editor, { blockId: props.blockId, stepId: element.id });
  };

  const moveDown = () => {
    StepsCommands.moveDown(editor, { blockId: props.blockId, stepId: element.id });
  };

  const deleteStep = () => {
    StepsCommands.deleteStep(editor, { blockId: props.blockId, stepId: element.id });
  };

  return (
    <div className="prose dark:prose-invert">
      <div className="relative group/component-wrapper group/step">
        <div
          {...attributes}
          role="listitem"
          className="step group/step relative flex items-start pb-5">
          <div
            data-component-part="step-line"
            contentEditable={false}
            className={cn(
              'absolute w-px h-[calc(100%-2.75rem)] top-[2.75rem]',
              isLast
                ? 'bg-transparent bg-gradient-to-b from-border via-80% to-transparent'
                : 'bg-border/70',
              isLast && isEmpty && 'hidden',
            )}
          />

          <div
            data-component-part="step-number"
            contentEditable={false}
            className="absolute ml-[-13px] py-2 pointer-events-none select-none">
            <div
              className={cn(
                'size-7 shrink-0 rounded-full',
                'bg-muted',
                'text-xs font-semibold',
                'flex items-center justify-center',
                'text-foreground',
              )}>
              {stepNumber}
            </div>
          </div>

          <div className="w-full overflow-hidden pl-8 pr-px">{children}</div>
        </div>

        <div
          contentEditable={false}
          className={cn(
            'z-20 absolute top-0 right-3 flex',
            'transition-opacity duration-300',
            'opacity-0 hover:opacity-100 group-hover/step:opacity-100',
          )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-8 shrink-0 rounded-lg',
                  'border border-transparent',
                  'hover:bg-muted',
                )}
                aria-label="Edit Step attributes">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={moveUp} className="cursor-pointer">
                <ArrowUp className="h-4 w-4" /> Move up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={moveDown} className="cursor-pointer">
                <ArrowDown className="h-4 w-4" /> Move down
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={deleteStep}
                className="text-destructive focus:text-destructive cursor-pointer">
                <Trash2 className="h-4 w-4" /> Delete step
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { StepsCommands } from '@yoopta/steps';
import { Plus } from 'lucide-react';

import { Button } from '../../ui/button';
import { cn } from '../../utils';

export const StepContainer = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const { attributes, children } = props;

  const addStep = () => {
    const slate = Blocks.getBlockSlate(editor, { id: props.blockId });
    if (!slate) return;

    StepsCommands.addStep(editor, { blockId: props.blockId });
  };

  return (
    <div {...attributes} role="list" className="ml-3.5 my-4 relative group/steps-node">
      {children}
      <div
        contentEditable={false}
        className={cn(
          '-ml-3.5 z-20 absolute left-0 flex',
          'transition-opacity duration-300',
          'opacity-0 group-hover/steps-node:opacity-100',
        )}
        style={{ bottom: '-4px' }}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'w-7 h-7 shrink-0 rounded-lg',
            'bg-muted hover:bg-muted/80',
            'text-sm font-semibold',
          )}
          onClick={addStep}
          aria-label="Add more Step">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

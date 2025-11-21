import { useMemo, useState } from 'react';
// remove from packages after move to @yoopta/ui packages
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { useYooptaDragDrop } from './dnd';
import { useYooptaReadOnly } from '../../contexts/YooptaContext/YooptaContext';
import type { YooEditor } from '../../editor/types';
import type { YooptaMark } from '../../marks';
import { SlateEditorComponent } from '../../plugins/slate-editor-component';
import { Block } from '../Block/Block';

const DEFAULT_EDITOR_KEYS = [];

type Props = {
  editor: YooEditor;
  marks?: YooptaMark<any>[];
  placeholder?: string;
};

const RenderBlocks = ({ editor, marks, placeholder }: Props) => {
  const isReadOnly = useYooptaReadOnly();
  const { sensors, handleDragEnd, handleDragStart } = useYooptaDragDrop({ editor });
  const [dragHandleProps, setActiveDragHandleProps] = useState(null);

  const childrenUnorderedKeys = Object.keys(editor.children);
  const childrenKeys = useMemo(() => {
    if (childrenUnorderedKeys.length === 0) return DEFAULT_EDITOR_KEYS;

    return childrenUnorderedKeys.sort((a, b) => {
      const aOrder = editor.children[a].meta.order;
      const bOrder = editor.children[b].meta.order;

      return aOrder - bOrder;
    });

    // [TODO] - unnecesary
  }, [childrenUnorderedKeys]);

  const blocks: JSX.Element[] = [];

  for (let i = 0; i < childrenKeys.length; i++) {
    const blockId = childrenKeys[i];
    const block = editor.children[blockId];
    const plugin = editor.plugins[block.type];

    if (!block || !plugin) {
      console.error(`Plugin ${block.type} not found`);
      continue;
    }

    blocks.push(
      <Block
        key={blockId}
        block={block}
        blockId={blockId}
        onActiveDragHandleChange={setActiveDragHandleProps}>
        <SlateEditorComponent
          key={blockId}
          type={block.type}
          id={blockId}
          marks={marks}
          customEditor={plugin.customEditor}
          events={plugin.events}
          elements={plugin.elements}
          options={plugin.options}
          extensions={plugin.extensions}
          placeholder={placeholder}
        />
      </Block>,
    );
  }

  if (isReadOnly) return <>{blocks}</>;

  return (
    <DndContext
      id="yoopta-dnd-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <SortableContext
        disabled={isReadOnly}
        items={childrenKeys}
        strategy={verticalListSortingStrategy}>
        {blocks}
      </SortableContext>
    </DndContext>
  );
};

export { RenderBlocks };

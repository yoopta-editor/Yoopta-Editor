import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Block } from '../Block/Block';
import { YooEditor, YooptaBlockData } from '../../editor/types';
import { YooptaMark } from '../../marks';
import { SlateEditorComponent } from '../../plugins/SlateEditorComponent';
import { useYooptaReadOnly } from '../../contexts/YooptaContext';

const DEFAULT_EDITOR_KEYS = [];

type Props = {
  editor: YooEditor;
  marks?: YooptaMark<any>[];
  placeholder?: string;
  renderBlock?: ({ blockRender, block }: { blockRender: React.ReactNode; block: YooptaBlockData }) => React.ReactNode;
  renderBlocks?: ({ blocks, items }: { blocks: React.ReactNode; items: string[] }) => React.ReactNode;
};

const RenderBlocks = ({ editor, placeholder, marks, renderBlocks, renderBlock }: Props) => {
  const isReadOnly = useYooptaReadOnly();

  // const handleDragEnd = useCallback((event: DragEndEvent) => {
  //   const { active, over } = event;

  //   if (active && over && active.id !== over.id) {
  //     const newPluginPosition = editor.children[over.id].meta.order;
  //     // [TEST]
  //     editor.moveBlock(active.id as string, newPluginPosition);
  //   }
  // }, []);

  // const handleDragStart = useCallback((event: DragStartEvent) => {
  //   editor.setPath({ current: null });
  // }, []);

  const [dragHandleProps, setActiveDragHandleProps] = useState(null);

  const childrenKeys = useMemo(() => {
    const childrenUnorderedKeys = Object.keys(editor.children);
    if (childrenUnorderedKeys.length === 0) return DEFAULT_EDITOR_KEYS;

    return childrenUnorderedKeys.sort((a, b) => {
      const aOrder = editor.children[a].meta.order;
      const bOrder = editor.children[b].meta.order;

      return aOrder - bOrder;
    });
  }, [editor.children]);

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
      <Block key={blockId} renderBlock={renderBlock} block={block} blockId={blockId}>
        <SlateEditorComponent
          key={blockId}
          type={block.type}
          id={blockId}
          customEditor={plugin.customEditor}
          events={plugin.events}
          elements={plugin.elements}
          options={plugin.options}
          extensions={plugin.extensions}
          placeholder={placeholder}
          marks={marks}
        />
      </Block>,
    );
  }

  const renderedBlocks = renderBlocks ? renderBlocks({ blocks, items: childrenKeys }) : blocks;

  if (isReadOnly) return <>{renderedBlocks}</>;

  return renderedBlocks;
};

export { RenderBlocks };

import type { ReactElement, ReactNode } from 'react';
import React, { useMemo } from 'react';

import type { YooEditor } from '../../editor/types';
import type { YooptaMark } from '../../marks';
import { SlateEditorComponent } from '../../plugins/slate-editor-component';
import type { RenderBlockProps } from '../../yoopta-editor';
import { Block } from '../Block/Block';

const DEFAULT_EDITOR_KEYS: string[] = [];

type Props = {
  editor: YooEditor;
  marks?: YooptaMark<any>[];
  placeholder?: string;
  renderBlock?: (props: RenderBlockProps) => ReactNode;
};

const RenderBlocks = ({ editor, marks, placeholder, renderBlock }: Props): ReactElement<any, any> => {
  const childrenUnorderedKeys = Object.keys(editor.children);
  const childrenKeys = useMemo(() => {
    if (childrenUnorderedKeys.length === 0) return DEFAULT_EDITOR_KEYS;

    return childrenUnorderedKeys.sort((a, b) => {
      const aOrder = editor.children[a].meta.order;
      const bOrder = editor.children[b].meta.order;

      return aOrder - bOrder;
    });

    // [TODO] - unnecesary
  }, [childrenUnorderedKeys, editor.children]);

  const blocks: JSX.Element[] = [];

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < childrenKeys.length; i += 1) {
    const blockId = childrenKeys[i];
    const block = editor.children[blockId];
    const plugin = editor.plugins[block.type];

    if (!block || !plugin) {
      console.error(`Plugin ${block.type} not found`);
      continue;
    }

    const blockContent = (
      <Block key={blockId} block={block} blockId={blockId}>
        <SlateEditorComponent
          key={blockId}
          type={block.type}
          id={blockId}
          marks={marks}
          events={plugin.events}
          elements={plugin.elements}
          extensions={plugin.extensions}
          placeholder={placeholder}
        />
      </Block>
    );

    // If renderBlock is provided, wrap the block content
    if (renderBlock) {
      blocks.push(
        <React.Fragment key={blockId}>
          {renderBlock({
            block,
            children: blockContent,
            blockId,
          })}
        </React.Fragment>,
      );
    } else {
      blocks.push(blockContent);
    }
  }

  return blocks as ReactElement<any, any>[];
};

export { RenderBlocks };

import type { ReactElement, ReactNode } from 'react';
import React, { useMemo } from 'react';

import type { YooEditor, YooptaBlockData } from '../../editor/types';
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

function renderSingleBlock(
  editor: YooEditor,
  blockId: string,
  block: YooptaBlockData,
  marks: YooptaMark<any>[] | undefined,
  placeholder: string | undefined,
  renderBlock: ((props: RenderBlockProps) => ReactNode) | undefined,
): JSX.Element {
  const plugin = editor.plugins[block.type];

  const blockContent = (
    <Block key={blockId} block={block} blockId={blockId}>
      <SlateEditorComponent
        key={blockId}
        type={block.type}
        id={blockId}
        marks={marks}
        events={plugin?.events}
        elements={plugin?.elements}
        extensions={plugin?.extensions}
        placeholder={placeholder}
      />
    </Block>
  );

  if (renderBlock) {
    return (
      <React.Fragment key={blockId}>
        {renderBlock({
          block,
          children: blockContent,
          blockId,
        })}
      </React.Fragment>
    );
  }

  return blockContent;
}

const COLUMN_GROUP_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  width: '100%',
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
  let i = 0;

  while (i < childrenKeys.length) {
    const blockId = childrenKeys[i];
    const block = editor.children[blockId];
    const plugin = editor.plugins[block?.type];

    if (!block || !plugin) {
      console.error(`Plugin ${block?.type} not found`);
      i += 1;
      continue;
    }

    const { columnGroup } = block.meta;

    if (columnGroup) {
      // Collect all consecutive blocks with the same columnGroup
      const groupBlockIds: string[] = [];
      while (i < childrenKeys.length) {
        const currentId = childrenKeys[i];
        const currentBlock = editor.children[currentId];
        if (currentBlock?.meta.columnGroup === columnGroup) {
          groupBlockIds.push(currentId);
          i += 1;
        } else {
          break;
        }
      }

      // Group blocks by columnIndex
      const columnMap = new Map<number, string[]>();
      for (const gBlockId of groupBlockIds) {
        const gBlock = editor.children[gBlockId];
        const colIndex = gBlock.meta.columnIndex ?? 0;
        if (!columnMap.has(colIndex)) {
          columnMap.set(colIndex, []);
        }
        columnMap.get(colIndex)!.push(gBlockId);
      }

      // Sort column indices
      const sortedColumnIndices = [...columnMap.keys()].sort((a, b) => a - b);

      const columnElements = sortedColumnIndices.map((colIndex) => {
        const colBlockIds = columnMap.get(colIndex)!;
        // Get width from the first block in this column
        const firstBlock = editor.children[colBlockIds[0]];
        const width = firstBlock.meta.columnWidth;
        const columnStyle: React.CSSProperties = {
          flexBasis: width ? `${width}%` : undefined,
          flexGrow: width ? 0 : 1,
          flexShrink: 0,
          minWidth: 0,
        };

        return (
          <div key={`col-${columnGroup}-${colIndex}`} className="yoopta-column" style={columnStyle}>
            {colBlockIds.map((cBlockId) => {
              const cBlock = editor.children[cBlockId];
              return renderSingleBlock(editor, cBlockId, cBlock, marks, placeholder, renderBlock);
            })}
          </div>
        );
      });

      blocks.push(
        <div key={`column-group-${columnGroup}`} className="yoopta-column-group" style={COLUMN_GROUP_STYLE}>
          {columnElements}
        </div>,
      );
    } else {
      blocks.push(renderSingleBlock(editor, blockId, block, marks, placeholder, renderBlock));
      i += 1;
    }
  }

  return blocks as ReactElement<any, any>[];
};

export { RenderBlocks };

import type React from 'react';
import type { DecoratorFn, LeafDecoratorRenderFn } from '@yoopta/editor';
import { Range as SlateRange, Text } from 'slate';
import type { NodeEntry, Point, Range } from 'slate';

import type { RemoteCursorData } from '../types';

/**
 * Creates a Slate `decorate` function that produces ranges for remote cursors.
 *
 * Single-block cursors (caret + text selection) are rendered via this decorator.
 * Multi-block selections (selectedBlocks.length > 1) are handled separately by
 * the DOM overlay in RemoteCursors.tsx.
 */
export function createCursorDecorator(cursors: RemoteCursorData[]): DecoratorFn {
  // Pre-group cursors by blockId for O(1) lookup per block
  const cursorsByBlock = new Map<string, RemoteCursorData[]>();

  for (const cursor of cursors) {
    // Skip multi-block selections — handled by DOM overlay
    if (cursor.selectedBlocks && cursor.selectedBlocks.length > 1) continue;
    if (!cursor.blockId || !cursor.selection) continue;

    let list = cursorsByBlock.get(cursor.blockId);
    if (!list) {
      list = [];
      cursorsByBlock.set(cursor.blockId, list);
    }
    list.push(cursor);
  }

  return (blockId: string, entry: NodeEntry): Range[] => {
    const blockCursors = cursorsByBlock.get(blockId);
    if (!blockCursors || blockCursors.length === 0) return [];

    const [node, path] = entry;
    if (!Text.isText(node)) return [];

    const ranges: Range[] = [];
    const nodeTextLength = node.text.length;

    for (const cursor of blockCursors) {
      const { selection, user } = cursor;
      if (!selection) continue;

      const { anchor, focus } = selection;

      // Build a Slate range for this cursor's selection
      const cursorAnchor: Point = { path: anchor.path, offset: anchor.offset };
      const cursorFocus: Point = { path: focus.path, offset: focus.offset };
      const cursorRange: Range = { anchor: cursorAnchor, focus: cursorFocus };

      const isCollapsed =
        anchor.path.length === focus.path.length &&
        anchor.path.every((v, i) => v === focus.path[i]) &&
        anchor.offset === focus.offset;

      // Build the range for this text node
      const nodeRange: Range = {
        anchor: { path, offset: 0 },
        focus: { path, offset: nodeTextLength },
      };

      if (isCollapsed) {
        // Collapsed cursor (caret only) — check if the focus point is in this text node
        if (pathEquals(focus.path, path) && focus.offset >= 0 && focus.offset <= nodeTextLength) {
          ranges.push({
            anchor: { path, offset: focus.offset },
            focus: { path, offset: focus.offset },
            remoteCursorCaret: true,
            remoteCursorColor: user.color,
            remoteCursorName: user.name,
          } as Range & Record<string, unknown>);
        }
      } else {
        // Expanded selection — compute intersection of cursorRange and nodeRange
        const intersection = safeIntersection(nodeRange, cursorRange);
        if (intersection) {
          // Highlight range
          ranges.push({
            ...intersection,
            remoteCursorHighlight: true,
            remoteCursorColor: user.color,
          } as Range & Record<string, unknown>);

          // Caret at focus point (if focus is within this text node)
          if (pathEquals(focus.path, path) && focus.offset >= 0 && focus.offset <= nodeTextLength) {
            ranges.push({
              anchor: { path, offset: focus.offset },
              focus: { path, offset: focus.offset },
              remoteCursorCaret: true,
              remoteCursorColor: user.color,
              remoteCursorName: user.name,
            } as Range & Record<string, unknown>);
          }
        }
      }
    }

    return ranges;
  };
}

/**
 * Creates a leaf renderer that wraps children with cursor caret / highlight spans.
 */
export function createCursorLeafRenderer(): LeafDecoratorRenderFn {
  return (leaf: Record<string, unknown>, children: unknown) => {
    const color = leaf.remoteCursorColor as string | undefined;

    if (leaf.remoteCursorHighlight && color) {
      // eslint-disable-next-line no-param-reassign
      children = (
        <span
          className="yoopta-collab-decorate-highlight"
          style={{ backgroundColor: color }}
        >
          {children as React.ReactNode}
        </span>
      );
    }

    if (leaf.remoteCursorCaret && color) {
      const name = leaf.remoteCursorName as string | undefined;
      // eslint-disable-next-line no-param-reassign
      children = (
        <span className="yoopta-collab-decorate-caret" style={{ position: 'relative' }}>
          <span
            contentEditable={false}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: -1,
              width: 2,
              backgroundColor: color,
              pointerEvents: 'none',
            }}
          >
            {name && (
              <span
                className="yoopta-collab-decorate-caret-label"
                style={{
                  position: 'absolute',
                  top: -20,
                  left: -1,
                  backgroundColor: color,
                  color: '#fff',
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  lineHeight: '16px',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontWeight: 500,
                }}
              >
                {name}
              </span>
            )}
          </span>
          {children as React.ReactNode}
        </span>
      );
    }

    return children;
  };
}

function pathEquals(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Compute intersection of two ranges, returning null if they don't overlap.
 * Uses SlateRange.intersection when both ranges are valid, with a try/catch
 * to handle edge cases where paths don't exist in the document.
 */
function safeIntersection(nodeRange: Range, cursorRange: Range): Range | null {
  try {
    return SlateRange.intersection(nodeRange, cursorRange);
  } catch {
    return null;
  }
}

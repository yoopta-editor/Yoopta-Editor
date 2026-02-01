import { useCallback } from 'react';
import MuiLink from '@mui/material/Link';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import type { LinkElementProps } from '@yoopta/link';
import { Editor, Element, Node, Range, Text, Transforms } from 'slate';

import { LinkHoverPopover } from './link-hover-popover';

const getNodeText = (node: unknown): string => {
  if (Text.isText(node)) {
    return node.text;
  }
  if (typeof node === 'object' && node !== null && 'children' in node) {
    const children = (node as { children?: unknown[] }).children;
    return children?.map(getNodeText).join('') ?? '';
  }
  return '';
};

const Link = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const linkText = getNodeText(element);

  const updateElement = useCallback(
    (newProps: Partial<LinkElementProps>, newText?: string) => {
      const slate = Blocks.getBlockSlate(editor, { id: blockId });
      if (!slate) return;

      const elementPath = Elements.getElementPath(editor, { blockId, element });
      if (!elementPath) return;

      Editor.withoutNormalizing(slate, () => {
        // Update props
        if (newProps) {
          Elements.updateElement(editor, {
            blockId,
            type: 'link',
            props: {
              ...element.props,
              ...newProps,
            },
            path: elementPath,
          });
        }

        if (newText !== undefined) {
          const [elementNode] = Editor.node(slate, elementPath);
          if (Element.isElement(elementNode)) {
            Transforms.insertText(slate, newText, { at: elementPath });
          }
        }
      });
    },
    [editor, blockId, element],
  );

  const deleteLink = useCallback(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;
    Editor.withoutNormalizing(slate, () => {
      if (!slate?.selection || !Range.isRange(slate.selection)) return;

      const node = Node.get(slate, slate.selection.anchor.path);
      if (!Element.isElement(node) || node.type !== 'link' || !Editor.isInline(slate, node)) {
        return;
      }

      Transforms.unwrapNodes(slate, {
        at: slate.selection.anchor.path,
        match: (n) => Element.isElement(n) && n.type === 'link',
      });
    });
  }, [editor, blockId]);

  return (
    <LinkHoverPopover
      elementProps={element.props}
      linkText={linkText}
      onUpdate={updateElement}
      onDelete={deleteLink}>
      <MuiLink
        {...attributes}
        href={element.props.url || undefined}
        target={element.props.target}
        rel={element.props.rel}
        title={element.props.title || undefined}
        underline="hover"
        color="primary"
        sx={{
          cursor: 'pointer',
          transition: 'color 0.2s',
          '&:hover': {
            color: 'primary.dark',
          },
        }}>
        {children}
      </MuiLink>
    </LinkHoverPopover>
  );
};

export { Link };

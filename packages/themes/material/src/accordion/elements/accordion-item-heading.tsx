import { useCallback, useMemo, useReducer } from 'react';
import { ExpandMore, Add as PlusIcon, Delete as TrashIcon } from '@mui/icons-material';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import type { Location } from 'slate';
import { Editor, Path, Transforms } from 'slate';

export const AccordionItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, forceRerender] = useReducer((x) => x + 1, 0);

  const parentListItem = useMemo(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return undefined;

    try {
      const elementPath = Elements.getElementPath(editor, blockId, element as SlateElement);
      const parentElement = Editor.parent(slate, elementPath as Location);
      return parentElement[0] as SlateElement;
    } catch (error) {
      // Element path not found
    }

    return undefined;
  }, [editor, blockId, element]);

  const parentListItemPath = useMemo(() => {
    if (!parentListItem) return undefined;

    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return undefined;

    try {
      return Elements.getElementPath(editor, blockId, parentListItem);
    } catch (error) {
      // Element path not found
    }

    return undefined;
  }, [editor, blockId, parentListItem]);

  const isExpanded = parentListItem?.props?.isExpanded ?? false;

  const toggleListItem = useCallback(() => {
    if (parentListItem && parentListItemPath) {
      Elements.updateElement(
        editor,
        blockId,
        {
          type: parentListItem.type,
          props: {
            ...parentListItem.props,
            isExpanded: !isExpanded,
          },
        },
        { path: parentListItemPath },
      );
    }

    forceRerender();
  }, [editor, blockId, parentListItem, parentListItemPath, isExpanded]);

  const deleteListItem = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!parentListItem || !parentListItemPath) return;

      // Get all accordion-list-item children to check if this is the last one
      const listItems = Elements.getElementChildren(editor, blockId, {
        type: 'accordion-list',
      });

      if (listItems?.length === 1) {
        Blocks.deleteBlock(editor, { blockId });
        return;
      }

      Elements.deleteElement(editor, blockId, {
        type: 'accordion-list-item',
        path: parentListItemPath,
      });
    },
    [editor, blockId, parentListItem, parentListItemPath],
  );

  const addListItem = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const slate = Blocks.getBlockSlate(editor, { id: blockId });
      if (!slate || !parentListItemPath) return;

      // Create new accordion-list-item using editor.y()
      const newListItem = editor.y('accordion-list-item', {
        props: { isExpanded: false },
        children: [
          editor.y('accordion-list-item-heading'),
          editor.y('accordion-list-item-content'),
        ],
      });

      Editor.withoutNormalizing(slate, () => {
        const nextListItemPath = Path.next(parentListItemPath);
        Transforms.insertNodes(slate, newListItem, { at: nextListItemPath });
        const nextLeafPath = [...nextListItemPath, 0, 0];

        setTimeout(() => {
          Transforms.select(slate, { offset: 0, path: nextLeafPath });
        }, 0);
      });
    },
    [editor, blockId, parentListItemPath],
  );

  return (
    <AccordionSummary
      {...attributes}
      expandIcon={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
          contentEditable={false}
          onClick={(e) => e.stopPropagation()}>
          <IconButton
            size="small"
            onClick={addListItem}
            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            title="Add accordion item">
            <PlusIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={deleteListItem}
            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            title="Delete accordion item">
            <TrashIcon fontSize="small" />
          </IconButton>
          <ExpandMore
            sx={{
              transition: 'transform 0.2s',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Box>
      }
      onClick={toggleListItem}
      sx={{
        minHeight: 48,
        '& .MuiAccordionSummary-content': {
          margin: '12px 0',
        },
      }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </AccordionSummary>
  );
};

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Editor, Element, Path, Transforms } from 'slate';
import { YooEditor, YooptaBlock, Blocks, findPluginBlockByPath, HOTKEYS } from '@yoopta/editor';
import { useActionMenuContext } from './ActionMenuContext';

export interface ActionMenuItem {
  type: string;
  title: string;
  description?: string;
  icon?: string | React.ReactNode | React.ReactElement;
}

export interface UseActionMenuOptions {
  editor: YooEditor;
  items?: string[];
  trigger?: string;
  mode?: 'create' | 'toggle';
}

export interface UseActionMenuReturn {
  actions: ActionMenuItem[];
  selectedAction: ActionMenuItem | null;
  empty: boolean;
  onFilter: (text: string) => void;
  onSelect: (type: string) => void;
  onNavigate: (direction: 'up' | 'down') => void;
  onConfirm: () => void;
  onMouseEnter: (type: string) => void;
}

const filterBy = (item: any, text: string, field: string): boolean => {
  if (!item || typeof item[field] === 'undefined') return false;

  const value = item[field];
  const searchText = text.toLowerCase().trim();

  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((v) => String(v).toLowerCase())
      .some((v) => v.includes(searchText));
  }

  return String(value).toLowerCase().includes(searchText);
};

const filterActionMenuItems = (block: YooptaBlock, searchText: string): boolean => {
  if (!searchText.trim()) return true;
  if (!block) return false;

  const searchTerms = searchText.toLowerCase().split(/\s+/);

  return searchTerms.every((term) => {
    const typeMatch = filterBy(block, term, 'type');
    if (typeMatch) return true;

    const titleMatch = block.options?.display && filterBy(block.options.display, term, 'title');
    if (titleMatch) return true;

    const shortcutMatch = block.options && filterBy(block.options, term, 'shortcuts');
    if (shortcutMatch) return true;

    const descriptionMatch = block.options?.display && filterBy(block.options.display, term, 'description');
    if (descriptionMatch) return true;

    const aliasMatch = block.options?.aliases && filterBy(block.options, term, 'aliases');
    if (aliasMatch) return true;

    return false;
  });
};

function isSlashPressed(event: KeyboardEvent): boolean {
  return (
    event.key === '/' ||
    event.keyCode === 191 ||
    event.which === 191 ||
    event.code === 'Slash' ||
    event.key === '/' ||
    (event.key === '.' && event.shiftKey)
  );
}

const mapActionMenuItems = (editor: YooEditor, items: string[]): ActionMenuItem[] => {
  return items.map((type) => {
    const block = editor.blocks[type];
    if (!block) return { type, title: type };

    const title = block.options?.display?.title || block.type;
    const description = block.options?.display?.description || '';
    const icon = block.options?.display?.icon;

    return {
      type,
      title,
      description,
      icon,
    };
  });
};

export const useActionMenu = ({
  editor,
  items,
  trigger = '/',
  mode = 'create',
}: UseActionMenuOptions): UseActionMenuReturn => {
  const { open, close, updatePosition } = useActionMenuContext();

  const [selectedAction, setSelectedAction] = useState<ActionMenuItem | null>(null);
  const [actions, setActions] = useState<ActionMenuItem[]>([]);
  const [searchText, setSearchText] = useState('');

  const blockTypes = useMemo(() => {
    const availableItems = items || Object.keys(editor.blocks);
    return mapActionMenuItems(editor, availableItems);
  }, [editor, items]);

  const empty = actions.length === 0;

  const onFilter = useCallback(
    (text: string) => {
      const cleanText = text.trim().replace(trigger, '');
      setSearchText(cleanText);

      if (!cleanText) {
        setActions(blockTypes);
        return;
      }

      const filteredActions = blockTypes.filter((action) =>
        filterActionMenuItems(editor.blocks[action.type], cleanText),
      );

      if (filteredActions.length > 0) {
        const currentExists = filteredActions.some((item) => item.type === selectedAction?.type);

        if (!currentExists) {
          setSelectedAction(filteredActions[0]);
        }
      }

      setActions(filteredActions);
    },
    [blockTypes, editor, selectedAction, trigger],
  );

  const onSelect = useCallback(
    (type: string) => {
      const action = actions.find((item) => item.type === type);
      if (action) {
        setSelectedAction(action);
      }
    },
    [actions],
  );

  const onNavigate = useCallback(
    (direction: 'up' | 'down') => {
      if (actions.length === 0) return;

      const currentIndex = selectedAction ? actions.findIndex((item) => item.type === selectedAction.type) : 0;
      let newIndex: number;

      if (direction === 'up') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : actions.length - 1;
      } else {
        newIndex = currentIndex < actions.length - 1 ? currentIndex + 1 : 0;
      }

      setSelectedAction(actions[newIndex]);
    },
    [actions, selectedAction],
  );

  const onConfirm = useCallback(() => {
    if (!selectedAction) return;

    const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
    if (!slate || !slate.selection) return;

    const blockEntry: any = Editor.above(slate, {
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
      mode: 'lowest',
    });

    if (blockEntry) {
      const [, currentNodePath] = blockEntry;
      const path = blockEntry ? currentNodePath : [];

      const start = Editor.start(slate, path);
      const range = { anchor: slate.selection.anchor, focus: start };

      Transforms.select(slate, range);
      Transforms.delete(slate);
    }

    editor.toggleBlock(selectedAction.type, { deleteText: true, focus: true });
    close();
  }, [selectedAction, editor, close]);

  const onMouseEnter = useCallback(
    (type: string) => {
      const action = blockTypes.find((item) => item.type === type);
      if (action) {
        setSelectedAction(action);
      }
    },
    [blockTypes],
  );

  // Initialize actions
  useEffect(() => {
    setActions(blockTypes);
    if (blockTypes.length > 0) {
      setSelectedAction(blockTypes[0]);
    }
  }, [blockTypes]);

  useEffect(() => {
    if (empty) {
      const timeout = setTimeout(() => {
        close();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [empty, close]);

  useEffect(() => {
    updatePosition();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;

      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      const slateEditorRef = event.currentTarget as HTMLElement;
      const isInsideEditor = slateEditorRef?.contains(event.target as Node);

      const pluginWithCustomEditor = document.querySelector('[data-custom-editor]');
      const isInsideCustomEditor = pluginWithCustomEditor?.contains(event.target as Node);

      if (isInsideCustomEditor || !slate || !slate.selection || !isInsideEditor) return;

      const isSlashKey = isSlashPressed(event);

      if (isSlashKey || HOTKEYS.isSlashCommand(event)) {
        const isInTypingMode = slate.selection && !Editor.isEditor(slate.selection.anchor.path[0]);
        if (!isInTypingMode) return;

        const parentPath = Path.parent(slate.selection.anchor.path);
        const string = Editor.string(slate, parentPath);
        const isStart = Editor.isStart(slate, slate.selection.anchor, slate.selection.focus);

        if (!isStart || string.trim().length > 0) return;

        const domSelection = window.getSelection();
        if (!domSelection) return;

        const domRange = domSelection.getRangeAt(0);
        const selectionRect = domRange.getBoundingClientRect();

        if (domRange) {
          open({
            getBoundingClientRect: () => selectionRect,
            getClientRects: () => domRange.getClientRects(),
          });
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      const isInsideEditor = editor.refElement?.contains(event.target as Node);

      if (!slate || !slate.selection || !isInsideEditor) return;

      const parentPath = Path.parent(slate.selection.anchor.path);
      const string = Editor.string(slate, parentPath);

      if (string.length === 0) return close();
      onFilter(string);
    };

    if (typeof editor.path.current === 'number') {
      const block = findPluginBlockByPath(editor, { at: editor.path.current });
      if (!block) return;

      const slateEditorRef = editor.refElement?.querySelector(
        `[data-yoopta-block-id="${block.id}"] [data-slate-editor="true"]`,
      ) as HTMLElement;

      if (!slateEditorRef) return;

      slateEditorRef.addEventListener('keydown', handleKeyDown);
      slateEditorRef.addEventListener('keyup', handleKeyUp);

      return () => {
        slateEditorRef.removeEventListener('keydown', handleKeyDown);
        slateEditorRef.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [editor.path.current, editor.refElement, open, close, onFilter]);

  return {
    actions,
    selectedAction,
    empty,
    onFilter,
    onSelect,
    onNavigate,
    onConfirm,
    onMouseEnter,
  };
};

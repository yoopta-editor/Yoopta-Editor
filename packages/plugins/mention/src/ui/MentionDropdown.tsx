import { useEffect, useState } from 'react';
import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { UI, useYooptaEditor, useYooptaPluginOptions } from '@yoopta/editor';
import { useDebounce } from 'use-debounce';

import { MentionCommands } from '../commands/MentionCommands';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../components/ui/command';
import type { MentionItem, MentionPluginOptions } from '../types';
import { useArrowNavigation } from './hooks';

const { Portal } = UI;

const Spinner = () => (
  <div className="yoopta-mention-dropdown-spinner">
    <div className="yoopta-mention-dropdown-spinner-circle" />
  </div>
);

type MentionDropdownProps = {
  onSelect: (mention: MentionItem) => void;
  onClose?: () => void;
  getItems: (query: string) => Promise<MentionItem[]>;
  debounceMs?: number;
  showLoading?: boolean;
};

export const MentionDropdown = ({
  getItems: getMentionItems,
  onSelect,
  onClose,
  debounceMs,
  showLoading,
}: MentionDropdownProps) => {
  const editor = useYooptaEditor();
  const { char = '@' } = useYooptaPluginOptions<MentionPluginOptions>('Mention');
  const isOpen = editor.mentions.target !== null;

  const [results, setResults] = useState<MentionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedValue] = useDebounce(
    editor.mentions.search,
    typeof debounceMs === 'number' ? debounceMs : 1000,
  );

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    middleware: [inline(), flip(), shift(), offset(4)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  const closeDropdown = () => {
    MentionCommands.closeDropdown(editor);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (editor.mentions.target) {
      const elRect = editor.mentions.target;
      refs.setReference({
        getBoundingClientRect: () => elRect.domRect,
        getClientRects: () => elRect.clientRect,
      });
    }
  }, [editor.mentions.target, refs.setReference]);

  const { listRef, itemRefs, selectedIndex } = useArrowNavigation({
    editor,
    items: results,
    open: isOpen,
    onSelect,
    onClose: closeDropdown,
  });

  useEffect(() => {
    const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const search = debouncedValue.replace(regex, '');
    if (!isOpen) return;

    const getItems = async () => {
      try {
        setLoading(true);
        const res = await getMentionItems(search);
        setResults(res);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [debouncedValue, isOpen]);

  if (!isOpen) return null;

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onSelectHandler = (id: string | number) => {
    const mention = results.find((u) =>
      typeof u.id === 'string' ? u.id === id : u.id === Number(id),
    );

    if (!mention) return;
    onSelect(mention);
    MentionCommands.closeDropdown(editor);
  };

  const style = {
    ...floatingStyles,
    ...transitionStyles,
  };

  const renderContent = () => {
    if (showLoading && loading) return <Spinner />;

    if (results.length === 0) return <CommandEmpty>No items found.</CommandEmpty>;

    return (
      <CommandGroup>
        <CommandList ref={listRef}>
          {results.map((mention, i) => {
            const isSelected = i === selectedIndex;
            const className = `yoopta-mention-dropdown-item ${
              isSelected ? 'yoopta-mention-dropdown-item-selected' : ''
            }`;

            return (
              <CommandItem
                key={mention.id}
                value={`${mention.id}`}
                onSelect={onSelectHandler}
                ref={(el) => (itemRefs.current[i] = el)}
                className={className}>
                <div className="yoopta-mention-dropdown-item-content">
                  {mention.avatar && (
                    <img
                      src={mention.avatar}
                      alt={mention.name}
                      className="yoopta-mention-dropdown-item-avatar"
                    />
                  )}
                  <span>{mention.name}</span>
                </div>
              </CommandItem>
            );
          })}
        </CommandList>
      </CommandGroup>
    );
  };

  return (
    <Portal id="mention-portal">
      {isMounted && (
        <div
          onClick={onClick}
          onMouseDown={onClick}
          style={style}
          ref={refs.setFloating}
          className="yoopta-mention-dropdown">
          <Command loop>{renderContent()}</Command>
        </div>
      )}
    </Portal>
  );
};

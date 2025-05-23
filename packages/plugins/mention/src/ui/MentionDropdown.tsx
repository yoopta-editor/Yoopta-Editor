import { Command, CommandEmpty, CommandGroup, CommandList, CommandItem } from './components/ui/command';
import { MentionPluginOptions, MentionItem } from '../types';
import { Blocks, UI, useYooptaEditor, useYooptaPluginOptions, YooEditor } from '@yoopta/editor';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { MentionCommands } from '../commands/MentionCommands';

const { Portal } = UI;

const useArrowNavigation = ({ editor, items, open, onSelect, onClose }) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const el = document.getElementById(`mention-portal-${editor.id}`);
      if (el && !el.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editor.id, open]);

  useEffect(() => {
    if (!open) return;

    const block = Blocks.getBlock(editor, { at: editor.path.current });
    if (!block) return;
    const blockEl = document.querySelector(`[data-yoopta-block-id="${block.id}"] [data-slate-editor="true"]`);
    if (!blockEl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Enter' && items.length > 0 && items[selectedIndex]) {
        e.preventDefault();
        onSelect(items[selectedIndex]);
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    blockEl.addEventListener('keydown', handleKeyDown as any);
    return () => blockEl.removeEventListener('keydown', handleKeyDown as any);
  }, [open, items, selectedIndex, editor.path.current]);

  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  return {
    listRef,
    selectedIndex,
    itemRefs,
  };
};

const Spinner = () => (
  <div className="yoo-mention-flex yoo-mention-justify-center yoo-mention-items-center yoo-mention-p-4">
    <div className="yoo-mention-h-5 yoo-mention-w-5 yoo-mention-border-2 yoo-mention-border-blue-500 yoo-mention-border-t-transparent yoo-mention-rounded-full yoo-mention-animate-spin"></div>
  </div>
);

type MentionDropdownProps = {
  onSelect: (mention: MentionItem) => void;
  onClose?: () => void;
  getItems: (query: string) => Promise<MentionItem[]>;
  debounceMs?: number;
  showLoading?: boolean;
};

export function MentionDropdown({
  getItems: getMentionItems,
  onSelect,
  onClose,
  debounceMs,
  showLoading,
}: MentionDropdownProps) {
  const editor = useYooptaEditor();
  const { char = '@' } = useYooptaPluginOptions<MentionPluginOptions>('Mention');
  const isOpen = editor.mentions.target !== null;

  const [results, setResults] = useState<MentionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedValue] = useDebounce(editor.mentions.search, typeof debounceMs === 'number' ? debounceMs : 1000);

  const closeDropdown = () => {
    MentionCommands.closeDropdown(editor);
    if (onClose) onClose();
  };

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

  const { top, left, height } = editor.mentions.target!;

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onSelectHandler = (id: string | number) => {
    const mention = results.find((u) => (typeof u.id === 'string' ? u.id === id : u.id === Number(id)));

    if (!mention) return;
    onSelect(mention);
    MentionCommands.closeDropdown(editor);
  };

  const style = {
    top: top + height + 4,
    left: left,
  };

  const renderContent = () => {
    if (showLoading && loading) return <Spinner />;

    if (results.length === 0) return <CommandEmpty>No items found.</CommandEmpty>;

    return (
      <CommandGroup>
        <CommandList ref={listRef} style={{ maxHeight: 300, overflow: 'auto' }}>
          {results.map((mention, i) => {
            const isSelected = i === selectedIndex;
            const className = `${
              isSelected ? 'yoo-mention-bg-gray-100' : ''
            } yoo-mention-transition-colors yoo-mention-cursor-pointer`;

            return (
              <CommandItem
                key={mention.id}
                value={`${mention.id}`}
                onSelect={onSelectHandler}
                ref={(el) => (itemRefs.current[i] = el)}
                className={className}
              >
                <div className="yoo-mention-flex yoo-mention-items-center yoo-mention-gap-2">
                  {mention.avatar && (
                    <img
                      src={mention.avatar}
                      alt={mention.name}
                      className="yoo-mention-w-6 yoo-mention-h-6 yoo-mention-rounded-full"
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
      <div
        onClick={onClick}
        onMouseDown={onClick}
        style={style}
        className="mention-dropdown yoo-mention-fixed yoo-mention-z-50 yoo-mention-bg-white yoo-mention-rounded-lg yoo-mention-border yoo-mention-shadow-md yoo-mention-w-[300px]"
      >
        <Command loop>{renderContent()}</Command>
      </div>
    </Portal>
  );
}

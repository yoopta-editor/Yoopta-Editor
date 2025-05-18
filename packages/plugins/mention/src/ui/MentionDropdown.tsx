import { Command, CommandEmpty, CommandGroup, CommandList, CommandItem } from './components/ui/command';
import { MentionUser } from '../types';
import { Blocks, UI, useYooptaEditor } from '@yoopta/editor';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

interface MentionDropdownProps {
  onSelect: (user: MentionUser) => void;
  onClose: () => void;
  users: MentionUser[];
  search: string;
  target: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const { Portal } = UI;

export function MentionDropdown({ users, target, search, onSelect, onClose }: MentionDropdownProps) {
  const isOpen = !!target;
  const editor = useYooptaEditor();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredUsers = users.filter((user) => {
    const userName = user.name.toLowerCase();
    const searchName = search.toLowerCase().replace('@', '');
    return searchName.length === 0 || userName.includes(searchName);
  });

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, filteredUsers.length);
  }, [filteredUsers]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const el = document.getElementById(`mention-portal-${editor.id}`);
      if (el && !el.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editor.id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const block = Blocks.getBlock(editor, { at: editor.path.current });
    if (!block) return;
    const blockEl = document.querySelector(`[data-yoopta-block-id="${block.id}"] [data-slate-editor="true"]`);
    if (!blockEl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % filteredUsers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
      } else if (e.key === 'Enter' && filteredUsers[selectedIndex]) {
        e.preventDefault();
        onSelect(filteredUsers[selectedIndex]);
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    blockEl.addEventListener('keydown', handleKeyDown as any);
    return () => blockEl.removeEventListener('keydown', handleKeyDown as any);
  }, [isOpen, filteredUsers, selectedIndex, editor.path.current]);

  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const { top, left, height } = target;

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const style = {
    top: top + height + 4,
    left: left,
  };

  const onSelectHandler = () => {
    onSelect(filteredUsers[selectedIndex]);
    onClose();
  };

  return (
    <Portal id="mention-portal">
      <div
        onClick={onClick}
        onMouseDown={onClick}
        style={style}
        className="mention-dropdown yoo-mention-fixed yoo-mention-z-50 yoo-mention-bg-white yoo-mention-rounded-lg yoo-mention-border yoo-mention-shadow-md yoo-mention-w-[300px]"
      >
        <Command loop>
          <CommandEmpty>No users found.</CommandEmpty>
          {filteredUsers.length > 0 && (
            <CommandGroup>
              <CommandList ref={listRef} style={{ maxHeight: 300, overflow: 'auto' }}>
                {filteredUsers.map((user, i) => {
                  const isSelected = i === selectedIndex;
                  return (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={onSelectHandler}
                      ref={(el) => (itemRefs.current[i] = el)}
                      className={`${
                        isSelected ? 'yoo-mention-bg-gray-100' : ''
                      } yoo-mention-transition-colors yoo-mention-cursor-pointer`}
                    >
                      <div className="yoo-mention-flex yoo-mention-items-center yoo-mention-gap-2">
                        {user.avatar && (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="yoo-mention-w-6 yoo-mention-h-6 yoo-mention-rounded-full"
                          />
                        )}
                        <span>{user.name}</span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandList>
            </CommandGroup>
          )}
        </Command>
      </div>
    </Portal>
  );
}

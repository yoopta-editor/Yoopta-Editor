import { Blocks } from '@yoopta/editor';
import { useEffect, useRef, useState } from 'react';
import { MentionCommands } from '../commands/MentionCommands';

export const useArrowNavigation = ({ editor, items, open, onSelect, onClose }) => {
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
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
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

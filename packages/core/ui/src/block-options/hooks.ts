import { useCallback } from 'react';
import { useYooptaEditor } from '@yoopta/editor';

/**
 * Hook that provides common block actions (duplicate, copy link, delete)
 * Use this alongside BlockOptions component for easy action handling
 *
 * @example
 * ```tsx
 * const { duplicateBlock, deleteBlock, copyBlockLink } = useBlockActions();
 *
 * <BlockOptions.Item onSelect={() => duplicateBlock(blockId)}>
 *   Duplicate
 * </BlockOptions.Item>
 * ```
 */
export const useBlockActions = () => {
  const editor = useYooptaEditor();

  const duplicateBlock = useCallback(
    (blockId: string) => {
      if (!blockId) {
        throw new Error('Block ID is required to duplicate block');
      }

      editor.duplicateBlock({ blockId, focus: true });
    },
    [editor],
  );

  const copyBlockLink = useCallback(
    (blockId: string) => {
      if (!blockId) {
        throw new Error('Block ID is required to copy block link');
      }

      const block = editor.children[blockId];
      if (block) {
        const url = `${window.location.origin}${window.location.pathname}#${block.id}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = url;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        editor.emit?.('block:copy', block);
      }
    },
    [editor],
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      if (!blockId) {
        throw new Error('Block ID is required to delete block');
      }

      editor.deleteBlock({ blockId });
      editor.setPath({ current: null });
    },
    [editor],
  );

  return {
    duplicateBlock,
    copyBlockLink,
    deleteBlock,
  };
};

// Re-export context hook for advanced usage
export { useBlockOptionsContext } from './context';
